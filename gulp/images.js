import { $, isProd } from '../gulpfile.js'

import gulp from 'gulp'
import browsersync from 'browser-sync'
import { paths } from './paths.js'
import sharpOptimizeImages from 'gulp-sharp-optimize-images'

export default function images() {
  return gulp.src(paths.src.images)
    .pipe(
      $.changed(paths.build.images, { extension: '.png' })
    )
    .pipe(
      $.changed(paths.build.images, { extension: '.jpg' })
    )
    .pipe(
      $.changed(paths.build.images, { extension: '.webp' })
    )
    .pipe(
      $.changed(paths.build.images, { extension: '.avif' })
    )
    .pipe(
      $.changed(paths.build.images, { extension: '.gif' })
    )

    .pipe(
      sharpOptimizeImages({
        png_to_webp: {
          quality: 90,
        },
        png_to_avif: {
          quality: 90,
        },
        jpg_to_webp: {
          quality: 90,
        },
        jpg_to_avif: {
          quality: 90,
        },
        gif_to_webp: {
          quality: 95,
        },
        webp_to_webp: {
          quality: 90,
        },
        avif_to_avif: {
          quality: 90,
        },
      })
    )

    .pipe(gulp.dest(paths.build.images))
    .pipe(browsersync.stream())
}


export function imagesSvg() {
  return gulp.src(paths.src.imagesSvg)
    .pipe(
      $.changed(paths.build.images, { extension: '.svg' })
    )

    .pipe($.svgmin())

    .pipe(gulp.dest(paths.build.images))
    .pipe(browsersync.stream())
}