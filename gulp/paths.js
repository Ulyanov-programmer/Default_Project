export const project = 'dist'
export const source = 'src'

export const paths = {
  build: {
    html: `${project}/`,
    php: `${project}/php/`,
    css: `${project}/styles/`,
    scripts: `${project}/scripts/`,
    scriptModules: `${project}/scripts/modules/`,
    images: `${project}/img/`,
    fonts: `${project}/fonts/`,
    libs: `${project}/libs/`,
    video: `${project}/video/`,
  },
  scr: {
    html: [`${source}/*.{html,htm}`, `!${source}/components/*.{html,htm}`],
    php: `${source}/php/*.php`,
    css: [`${source}/styles/**/*.styl`, `${source}/docs/*.styl`, `!${source}/styles/**/_*.styl`],
    scripts: `${source}/scripts/*.{ts,js}`,
    scriptModules: `${source}/scripts/modules/*.{ts,js}`,
    images: `${source}/img/**/*.{gif,ico,webp,avif,png,jpg}`,
    imagesSvg: `${source}/img/**/*.svg`,
    fonts: `${source}/fonts/*.{ttf,otf}`,
    fontsWoff: `${source}/fonts/*.{woff,woff2}`,
    fontsFolder: `${source}/fonts/`,
    libs: `${source}/libs/**/*.*`,
    video: `${source}/video/**/*.{mp4,webm}`,
  },
  watch: {
    html: `${source}/**/*.{html,htm,php}`,
    css: `${source}/styles/**/*.styl`,
    php: `${source}/php/*.php`,
    demoCss: `${source}/docs/*.styl`,
    scripts: `${source}/scripts/*.{ts,js}`,
    scriptModules: `${source}/scripts/modules/*.{ts,js}`,
    images: `${source}/img/**/*.{gif,ico,jpg,png,webp,avif}`,
    imagesSvg: `${source}/img/**/*.svg`,
    libs: `${source}/libs/*.*`,
    video: `${source}/video/**/*.{mp4,webm}`,
  },
}
export const fontsFIlePath = `${source}/styles/general/fonts.styl`
export const distPath = `${source}/styles/general/fonts.styl`