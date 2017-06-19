var gulp 			= require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var del				= require('del');
var browserSync		= require('browser-sync');
var runSequence 	= require('run-sequence');
var cache 			= require('gulp-cache');

var plugins 		= gulpLoadPlugins();

console.log('availiable plugins: ', Object.keys(plugins).join(', '));

function onerror(e) {
	console.log('>>> error:\n', e.name);
	console.log('---> message <---\n', e.message);
	console.log('---> reason <---\n', e.reason);
	// emit here
	this.emit('end');
};

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dst'
		},
		notify: false,
	});
});

gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.sass')
	.pipe(plugins.sass())
	.on('error', onerror)
	.pipe(gulp.dest('src/css/compiled'))
});

gulp.task('concat.all.css', function() {
	return gulp.src('src/css/compiled/common/**/*.css')
	.pipe(plugins.concat('all.css'))
	.pipe(gulp.dest('src/css/concat'))
});

gulp.task('concat.styles.css', ['concat.all.css', 'sprites'], function() {
	return gulp.src(['src/css/compiled/main/sprites.css', 'src/css/compiled/main/main.css', 'src/css/concat/all.css', 'src/css/compiled/main/media.css'])
	.pipe(plugins.concat('styles.css'))
	.pipe(gulp.dest('src/css/concat'))
});

gulp.task('concat.libs.css', function() {
	return gulp.src('src/css/libs/**/*.css')
	.pipe(plugins.concat('libs.css'))
	.pipe(gulp.dest('src/css/concat'))
});

gulp.task('css', ['concat.styles.css', 'concat.libs.css'], function() {
	return gulp.src(['src/css/concat/styles.css', 'src/css/concat/libs.css'])
	.pipe(plugins.rename({suffix: '.min', prefix : ''}))
	.pipe(plugins.autoprefixer(['last 15 versions']))
	.pipe(plugins.cleanCss()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('dst/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('concat.scripts.js', function() {
	return gulp.src('src/js/common/**/*.js')
	.pipe(plugins.concat('scripts.js'))
	.pipe(gulp.dest('src/js/concat'))
});

gulp.task('concat.libs.js', function() {
	return gulp.src(['src/js/jquery/jquery.min.js', 'src/js/libs/**/*.js'])
	.pipe(plugins.concat('libs.js'))
	.pipe(gulp.dest('src/js/concat'))
});

gulp.task('js', ['concat.scripts.js', 'concat.libs.js'], function() {
	return gulp.src(['src/js/concat/scripts.js', 'src/js/concat/libs.js'])
	.pipe(plugins.rename({suffix: '.min', prefix : ''}))
	.pipe(plugins.uglify()) 
	.on('error', onerror)
	.pipe(gulp.dest('dst/js'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('pug', function() {
	return gulp.src('src/pug/pages/**/*.pug')
	.pipe(plugins.pug()) 
	.on('error', onerror)
	.pipe(gulp.dest('dst/'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('copy', ['copy.fonts', 'copy.img', 'copy.htaccess']);

gulp.task('copy.fonts', function() {
    var mask = 'src/fonts/**/*.*';
    function run() {
      return gulp
        .src(mask)
        .pipe(gulp.dest('dst/fonts'));
    }
    return run();
});

gulp.task('copy.img', function() {
    var mask = 'src/img/**/*.*';
    function run() {
      return gulp
        .src(mask)
        .pipe(gulp.dest('dst/img'));
    }
    return run();
});

gulp.task('copy.htaccess', function() {
    var mask = 'src/.htaccess';
    function run() {
      return gulp
        .src(mask)
        .pipe(gulp.dest('dst'));
    }
    return run();
});

gulp.task('sprites', function() {
	let mask = 'src/sprites/*.*';
	function run() {
		var spriteOutput = gulp.src(mask)
		.pipe(plugins.spritesmith({
			imgName: 'sprites.png',
			cssName: 'sprites.css',
			cssTemplate: 'src/sprites.handlebars'
		}));

		spriteOutput.css.pipe(gulp.dest("src/css/compiled/main"));
		spriteOutput.img.pipe(gulp.dest("dst/img"));

		return spriteOutput;
	}

	return run();
});

gulp.task('removedst', function() {
	return del.sync('dst');
});

gulp.task('clearcache', function () {
	return cache.clearAll();
});

gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('src/sass/**/*.sass', ['sass']);
	gulp.watch('src/img/**/*.*', ['copy.img']);
	gulp.watch('src/fonts/**/*.*', ['copy.fonts']);
	gulp.watch('src/.htaccess', ['copy.htaccess']);
	gulp.watch(['src/css/compiled/**/*.css','src/css/libs/**/*.css','src/sprites/*.*'], ['css']);
	gulp.watch(['src/js/libs/**/*.js', 'src/js/common/**/*.js'], ['js']);
	gulp.watch('src/pug/**/*.pug', ['pug']);
	gulp.watch('dst/*.html', browserSync.reload);
});

gulp.task('default', function (callback) {
	runSequence(['removedst','clearcache'],
		'copy',
		'sass',
		['css','js'],
		'pug',
		'watch',
		callback)
});

