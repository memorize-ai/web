const gulp = require('gulp')

const sass = require('gulp-sass')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const minifyCSS = require('gulp-minify-css')

sass.compiler = require('node-sass')

const scssGlob = 'src/scss/**/*.scss'

const buildSCSS = () =>
	gulp.src(scssGlob)
		.pipe(sass({
			includePaths: ['node_modules'],
			errorLogToConsole: true
		}))
		.pipe(concat('index.css'))
		.pipe(autoprefixer())
		.pipe(minifyCSS())
		.pipe(gulp.dest('public'))

gulp.task('scss', buildSCSS)

gulp.task('scss:watch', () =>
	gulp.watch(scssGlob, buildSCSS)
)
