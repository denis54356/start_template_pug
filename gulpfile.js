var gulp 			= require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');

var plugins 		= gulpLoadPlugins();

//console.log('availiable plugins: ', Object.keys(plugins).join(', '));

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

gulp.task('css', function() {
	return gulp.src('src/css/concat/styles.css')
	.pipe(plugins.rename({suffix: '.min', prefix : ''}))
	.pipe(plugins.autoprefixer(['last 15 versions']))
	.pipe(plugins.cleanCss()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('dst/css'))
});

gulp.task('default');

