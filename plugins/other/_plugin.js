import fs from 'fs-extra'
import { globSync, hasMagic } from 'glob'
import globParent from 'glob-parent'
import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import { performance } from 'perf_hooks'
import { EventEmitter } from 'events'
import { FileComparer } from './comparer.js'

export class Plugin {
  static ENCODING = 'utf8'
  static activePlugins = []
  static performanceStartValue
  static performanceEndValue
  static fs = fs
  static chalk = chalk
  static path = path
  emitter
  processedBuffer = []
  thirdPartyFilesGlobArray
  globOptions = {
    ignore: null,
  }
  static globalEmitter = new EventEmitter()

  constructor(options) {
    this.#setPathsAndFiles(options)

    this.emitter = new EventEmitter()
    this.cwd = Plugin.getCwd(options)

    this.startWatchingForThirdPartyFiles(options.thirdPartyFiles)

    this.#setConsoleLogging(options?.logColor)
    this.#registerEvents(options?.runOnEvents)
    this.startWatching(options.watchEvents)

    Plugin.activePlugins.push(this)
  }

  #setPathsAndFiles(options) {
    this.glob =
      `${options.workingDirectory ?? globalThis.paths.sources.root}**/*.${options.associations}`

    this.thirdPartyFilesGlobArray = options.thirdPartyFiles

    this.globOptions.ignore = options.ignore
  }
  #registerEvents(customEvents) {
    this.taskCallback = customEvents.function

    this.emitter.on('processedFile', options => {
      this.log('processed', options)
      this.updateTaskBufferForProcessedFiles(options)
    })

    this.emitter.on('processStart', options => {
      this.log('start', options)
      Plugin.#setPerformanceTimer()
    })

    this.emitter.on('processEnd', () => {
      this.log('end', {
        time: Plugin.#getPerformanceTimerValue()
      })
    })

    this.emitter.on('runTask', options => {
      this.#runProcess(undefined, options)
    })

    for (let eventName of customEvents?.names ?? []) {
      Plugin.globalEmitter.on(eventName, paths => {
        if (paths?.length) {
          paths = paths.filter(path => path.includes(this.cwd))
        }
        this.#runProcess(paths)
      })
    }
  }
  #setConsoleLogging(logColor) {
    this.chalkColor = chalk.hex(logColor ?? '#FFF')

    // locks like `[child_plugin_name]`
    this.pluginStringInLog =
      chalk.grey('[') +
      this.chalkColor.bold(this.constructor.name) +
      chalk.grey('] ')
  }

  getChangedFiles(files = this.glob) {
    files = FileComparer.onlyChangedFiles(
      // main files
      this.unGlobPaths(files, this.globOptions),
      // third party files
      this.unGlobPaths(this.thirdPartyFilesGlobArray),
      this.outputExtname
    )

    if (files === false)
      files = this.unGlobPaths(this.glob, this.globOptions)

    return files
  }

  unGlobPaths(paths, globOptions) {
    if (!this.#checkPath(paths)) return false

    return this.#unmaskPathsAndTransformToArray(paths, globOptions)
  }

  static getCwd(options) {
    return path.normalize(globParent(options?.workingDirectory ?? globalThis.paths.sources.root))
  }

  #checkPath(paths) {
    if (paths instanceof Array &&
      paths.some(filePath => !filePath) || !paths?.length
    )
      return false

    return true
  }

  #unmaskPathsAndTransformToArray(paths, globOptions) {
    if (hasMagic(paths))
      paths = globSync(paths, globOptions)

    if (!Array.isArray(paths))
      paths = [paths]

    return paths
  }

  log(eventName, options) {
    let mainLogString

    switch (eventName) {
      case 'processed':
        if (!options.pathToFile) {
          mainLogString = ': ' + this.chalkColor(`completed`)
        }
        else if (!options.extension) {
          mainLogString = this.chalkColor(options.pathToFile) + ` was processed`
        }
        else {
          mainLogString = this.chalkColor(options.pathToFile) +
            ` was processed to .${chalk.underline(options.extension)}`
        }

        console.log(this.pluginStringInLog + mainLogString)
        break

      case 'start':
        console.log(this.pluginStringInLog + ': ' + this.chalkColor('starts'))
        break

      case 'error':
        console.log(
          chalk.red('[') +
          this.chalkColor.bold(this.constructor.name) +
          chalk.red('] ') +
          ': ' + chalk.red('error!\n') +
          chalk.red(options.error)
        )
        break

      case 'end':
        console.log(
          this.pluginStringInLog + ': ' +
          this.chalkColor('done in ') + options.time + 's'
        )
        break
    }
  }

  static #setPerformanceTimer() {
    Plugin.performanceStartValue = performance.now()
  }
  static #getPerformanceTimerValue() {
    Plugin.performanceEndValue = performance.now()

    return Math.trunc(
      Plugin.performanceEndValue - Plugin.performanceStartValue
    ) / 1000
  }

  returnAndCleanProcessedBuffer() {
    return this.processedBuffer.splice(0, this.processedBuffer.length)
  }

  static getDistPathForFile(filePath, newFileExt) {
    let parsedPath = path.parse(filePath)
    let newFileBase = newFileExt ? parsedPath.name + `.${newFileExt}` : parsedPath.base
    let newPath

    if (parsedPath.dir.includes(globalThis.paths.output.root.replaceAll('/', ''))) {
      return path.normalize(filePath)
    }
    else {
      newPath = globalThis.paths.output.root
        + parsedPath.dir.replace(this.cwd ?? Plugin.getCwd(), '') + '/'
        + newFileBase
    }

    return path.normalize(newPath)
  }

  startWatching(runEvents) {
    if (!runEvents?.length) return

    this.watcher = chokidar.watch(this.glob, {
      ignoreInitial: true,
      ignored: this.globOptions.ignore,
    })

    for (let runEvent of runEvents) {
      this.watcher.on(runEvent, this.#runProcess.bind(this))
    }
  }

  startWatchingForThirdPartyFiles(globToFiles = []) {
    let localChokidar = chokidar.watch(globToFiles, { ignoreInitial: true, })

    // running the task in such a way that it processes all the files it is associated with
    localChokidar.on('change', () => this.#runProcess(null, { passAllFiles: true }))
  }

  updateTaskBufferForProcessedFiles(options) {
    this.processedBuffer.push(
      Plugin.getDistPathForFile(options.pathToFile, options.extension)
    )
  }

  async #runProcess(paths, options) {
    if (options?.passAllFiles && !paths) {
      paths = this.unGlobPaths(this.glob, this.globOptions)
    }
    else if (!paths) {
      paths = this.getChangedFiles(paths)
    }

    if (!Array.isArray(paths)) paths = [paths]

    if (!paths?.length) return


    this.emitter.emit('processStart')

    try {
      await this.taskCallback(paths)

      this.emitter.emit('processEnd')
    }
    catch (error) {
      this.log('error', {
        error: error,
      })
    }
    finally {
      return this.returnAndCleanProcessedBuffer()
    }
  }
}