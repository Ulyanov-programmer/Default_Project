import fs from 'fs-extra'
import path from 'path'
import replace from 'replace-in-file'
import * as readline from "readline-sync"


const pathToProject = path.resolve('./')
const demoProjectFolderName = `${pathToProject}/gulp_multitool`
const snippetsFolderName = `${pathToProject}/snippets`
const readmeFolder = `${pathToProject}/readmeFiles`
const src = '/#src'
const scriptModules = `${pathToProject}${src}/scripts/modules/`
const scriptGeneral = `${pathToProject}${src}/scripts/`
const stylesModules = `${pathToProject}${src}/styles/modules/`
const componentsFolder = `${pathToProject}${src}/components/`
const phpFolder = `${pathToProject}${src}/php/`

const fontsGitkeep = `${src}/fonts/.gitkeep`
const mainStyleFile = `${pathToProject}${src}/styles/index.sass`
const mainHtmlFile = `${pathToProject}${src}/index.html`
const gulpImportModulesFile = `${pathToProject}/gulp/importModules.js`
const gulpFile = `${pathToProject}/gulpfile.js`

const srcDemoFoldersAndFIles = [
	`${pathToProject}${src}/docs`, `${pathToProject}${src}/img/demo`,
]
const phpMailerFiles = [
	`${phpFolder}Exception.php`, `${phpFolder}mail.php`, `${phpFolder}PHPMailer.php`, `${phpFolder}SMTP.php`,
]
// The extension of typescript source files.
const srcExt = '.src.ts'


deleteDemoContent()
cleanReadmeFilesAndFolders()
deleteSnippets()
deleteDemoProject()

await setImportModules()
await setModules()
await setPhp()

console.log('I wish You a successful job! 🎆🎆🎆')


async function setImportModules() {
	await setImportModule(
		`Just-validate`,
		'justValidate',
		'justValidate: true,',
		`${pathToProject}${src}/scripts/justValidate.js`)

	await setImportModule(
		`Slider Swiper`,
		'swiper',
		'swiper: true,',
		`${pathToProject}${src}/scripts/sliders.js`)

	await setImportModule(
		`Typed`,
		'typed',
		'typed: true,',
		`${pathToProject}${src}/scripts/typed.js`)

	await setImportModule(
		`Input Mask`,
		'inputMask', '')

	await setImportModule(
		`Air Date Picker`,
		'airDatePicker', '')

	await setImportModule(
		`Photo Swipe`,
		'photoSwipe',
		'photoSwipe: true,',
		`${pathToProject}${src}/scripts/photoSwipe.js`)
}
async function setModules() {
	await includeModuleByQuestion({
		moduleName: 'Burger-menu',
		scriptPath: `${scriptModules}burgerMenu${srcExt}`,
		styleFilePath: `${stylesModules}burgerMenu.sass`,
		htmlPaths: [
			`${componentsFolder}_burgerMenu.htm`,
			`${componentsFolder}_navmenuBtnItem.htm`,
			`${componentsFolder}_navmenuRefItem.htm`,
		],
		htmlConnectStrings: [
			{
				path: `${pathToProject}${src}/_header.htm`,
				strings: "<%- include('components/_burgerMenu.htm') %>",
			},
			{
				strings: 'burgerMenu: true,',
			},
		],
	})
	await includeModuleByQuestion({
		moduleName: 'Sidebar',
		scriptPath: `${scriptModules}sidebar${srcExt}`,
		styleFilePath: `${stylesModules}sidebar.sass`,
		htmlPath: null,
		htmlConnectStrings: [{ strings: 'sidebar: true,' }],
	})
	await includeModuleByQuestion({
		moduleName: 'Modal-Window',
		scriptPath: `${scriptModules}modalWindow${srcExt}`,
		styleFilePath: null,
		htmlPaths: [
			`${componentsFolder}_modals.htm`, 
		],
		htmlConnectStrings: [
			{
				strings: ["<%- include('components/_modals.htm', {}) %>", "modalWindow: true,"]
			},
		],
	})
	await includeModuleByQuestion({
		moduleName: 'Spoilers',
		scriptPath: `${scriptModules}spoiler${srcExt}`,
		styleFilePath: `${stylesModules}spoiler.sass`,
		htmlPaths: null,
		htmlConnectStrings: [{ strings: 'spoiler: true,' }],
	})
	await includeModuleByQuestion({
		moduleName: 'Filter',
		scriptPath: `${scriptModules}filter${srcExt}`,
		styleFilePath: null,
		htmlPaths: null,
		htmlConnectStrings: null,
	})
	await includeModuleByQuestion({
		moduleName: 'Submenu',
		scriptPath: `${scriptModules}submenu${srcExt}`,
		styleFilePath: `${stylesModules}submenu.sass`,
		htmlPaths: null,
		htmlConnectStrings: [{ strings: 'submenu: true,' }],
	})
	await includeModuleByQuestion({
		moduleName: 'Tabs',
		scriptPath: `${scriptModules}tab${srcExt}`,
		styleFilePath: null,
		htmlPaths: null,
		htmlConnectStrings: [{ strings: 'tabs: true,' }],
	})
	await includeModuleByQuestion({
		moduleName: 'Element-modal',
		scriptPath: `${scriptModules}elementModal${srcExt}`,
		styleFilePath: null,
		htmlPaths: null,
		htmlConnectStrings: [{ strings: 'elementModal: true,' }],
	})
	await includeModuleByQuestion({
		moduleName: 'Parallax',
		scriptPath: `${scriptModules}parallax${srcExt}`,
		styleFilePath: null,
		htmlPaths: null,
		htmlConnectStrings: [{ strings: 'parallax: true,' }],
	})
	await includeModuleByQuestion({
		moduleName: 'ScrollToElement',
		scriptPath: `${scriptModules}scrollToElement${srcExt}`,
		styleFilePath: null,
		htmlPaths: null,
		htmlConnectStrings: [{ strings: 'scrollToElement: true,' }],
	})
	await includeModuleByQuestion({
		moduleName: 'Animations by scroll',
		scriptPath: `${scriptModules}animateByScroll${srcExt}`,
		styleFilePath: null,
		htmlPaths: null,
		htmlConnectStrings: [{ strings: 'animateByScroll: true,' }],
	})
	await includeModuleByQuestion({
		moduleName: 'Horizontal scroll',
		scriptPath: `${scriptGeneral}horizontalScroll.ts`,
		styleFilePath: null,
		htmlPaths: null,
		htmlConnectStrings: [{ strings: 'horizontalScroll: true,' }],
	})
	await includeModuleByQuestion({
		moduleName: 'Swipe module (required to switch a sidebar by swipe)',
		scriptPath: `${scriptModules}swipe${srcExt}`,
		styleFilePath: null,
		htmlPaths: null,
		htmlConnectStrings: [{ strings: 'swipe: false,' }],
	})
	await includeModuleByQuestion({
		moduleName: 'Form styles',
		scriptPath: '',
		styleFilePath: `${stylesModules}form.sass`,
		htmlPaths: null,
		htmlConnectStrings: [{ strings: 'formStyles: true,' }],
	})
}
async function setPhp() {
	if (readline.keyInYNStrict(`Include PHP scripts?`) == false) {
		fs.removeSync(phpFolder)
		return
	}

	if (readline.keyInYNStrict(`Include PHP-mailer?`) == false) {
		for (let phpMailerFile of phpMailerFiles) {
			fs.removeSync(phpMailerFile)
		}
	}
}

function deleteDemoContent() {
	try {
		for (let pathToDemo of srcDemoFoldersAndFIles) {
			fs.removeSync(pathToDemo)
		}

		console.log('✅ The demo content have been deleted.')
	} catch (error) {
		console.log('❌' + error)
	}
}
function cleanReadmeFilesAndFolders() {
	try {
		fs.emptyDirSync(readmeFolder)
		fs.removeSync(`${pathToProject}/README.md`)
		fs.createFileSync('README.md')

		console.log('✅ The readme folder and file are clean.')
	} catch (error) {
		console.log('❌' + error)
	}
}
function deleteDemoProject() {
	try {
		fs.removeSync(demoProjectFolderName)

		console.log('✅ Demo Project have been deleted.')
	} catch (error) {
		console.log('❌' + error)
	}
}
function deleteSnippets() {
	try {
		fs.removeSync(snippetsFolderName)

		console.log('✅ Snippets have been deleted.')
	} catch (error) {
		console.log('❌' + error)
	}
}

async function setImportModule(importModuleName, importFileVariableName, htmlConnectString, fileToDelete) {
	if (readline.keyInYNStrict(`Import the ${importModuleName}?`) == false) {
		await replace({
			files: mainHtmlFile,
			from: htmlConnectString,
			to: '',
		})
		await replace({
			files: gulpImportModulesFile,
			from: `export let ${importFileVariableName}`,
			to: `let ${importFileVariableName}`,
		})

		fs.removeSync(fileToDelete)
	}
}

async function includeModuleByQuestion(
	{ moduleName, scriptPath, styleFilePath, htmlPaths, htmlConnectStrings }) {
	
	if (readline.keyInYNStrict(`Include the ${moduleName}?`))
		return

	if (scriptPath) {
		fs.removeSync(scriptPath)

		let scriptNameWithoutExp = path.basename(scriptPath, srcExt)
		let scriptConnFileName = `${scriptNameWithoutExp}.ts`

		fs.removeSync(scriptGeneral + scriptConnFileName)
	}
	if (styleFilePath) {
		fs.removeSync(styleFilePath)
	}
	if (htmlPaths != undefined && htmlPaths.length > 0) {
		for (let htmlPath of htmlPaths) {
			fs.removeSync(htmlPath)
		}
	}
	if (htmlConnectStrings) {
		for (let htmlConnectStringData of htmlConnectStrings) {
			if (htmlConnectStringData.path == undefined)
				htmlConnectStringData.path = mainHtmlFile

			await replace({
				files: htmlConnectStringData.path,
				from: htmlConnectStringData.strings, to: '',
			})
		}
	}
}