var gulp 			= require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var gulp 			= require('gulp-sass');

var plugins 		= gulpLoadPlugins();

gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.sass')
	.pipe(plugins.sass())
	.pipe(gulp.dest('src/css/compiled'))
});

gulp.task('concat.all.css', function() {
	return gulp.src(['src/css/compiled/**/*.css', '!src/css/compiled/main/**/*.css'])
	.pipe(plugins.concat('all.css'))
	.pipe(gulp.dest('src/css/concat'))
});

gulp.task('concat.styles.css', function() {
	return gulp.src(['src/css/compiled/main/main.css', 'src/css/compiled/main/sprites.css', 'src/css/concat/all.css', 'src/css/compiled/main/media.css'])
	.pipe(plugins.concat('styles.css'))
	.pipe(gulp.dest('src/css/concat'))
});

gulp.task('concat.libs.css', function() {
	return gulp.src('src/css/libs/**/*.css')
	.pipe(plugins.concat('libs.css'))
	.pipe(gulp.dest('src/css/concat'))
});

gulp.task('css', [
	'sass',
	'concat.all.css',
	'concat.styles.css']);

