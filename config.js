globalThis.isProductionMode = process.argv.includes('--production')


const outputFolder = 'dist/', sourcesFolder = 'sources/'

globalThis.paths = {
  root: './',
  output: {
    root: outputFolder,
    styles: outputFolder + 'styles/',
    styleLayouts: outputFolder + 'styles/layouts/',
    scripts: outputFolder + 'scripts/',
    images: outputFolder + 'images/',
    fonts: outputFolder + 'fonts/',
    assets: outputFolder + 'assets/',
  },
  sources: {
    root: sourcesFolder,
    htmlComponents: sourcesFolder + 'components/',
    styles: sourcesFolder + 'styles/',
    scripts: sourcesFolder + 'scripts/',
    images: sourcesFolder + 'images/',
    fontsFolder: sourcesFolder + 'fonts/',
    fontsFilePath: sourcesFolder + 'styles/fonts.pcss',
    assets: sourcesFolder + 'assets/',
  },
}
