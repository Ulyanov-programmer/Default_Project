import fs from 'fs-extra'
import posthtml from 'posthtml'
import { globSync, hasMagic } from 'glob'
import path from 'path'


let pluginsArray, dest
const ENCODING = 'utf8'


export default async function htmlProcess({ paths, plugins }) {
  if (!pluginsArray) pluginsArray = plugins

  if (!dest) dest = paths.dest

  let processedFiles = []

  if (hasMagic(paths.src)) {
    paths.src = globSync(paths.src, {
      dotRelative: true,
    })
  }
  if (paths.src instanceof Array) {
    for (let pathToFile of paths.src) {
      processedFiles.push(await posthtmlProcess(pathToFile))
    }
  }
  else {
    processedFiles.push(await posthtmlProcess(paths.src))
  }

  return processedFiles
}

async function posthtmlProcess(pathToFile) {
  pathToFile = path.normalize(pathToFile)

  let result = await posthtml(pluginsArray)
    .process(fs.readFileSync(pathToFile, ENCODING))

  let fileName = pathToFile.split(path.sep).at(-1)

  fs.writeFileSync(dest + fileName, result.html, ENCODING)

  // a link to the processed file is returned 
  return dest + fileName
}