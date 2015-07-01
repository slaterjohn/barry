	
	/*
	 *	~ gulpfile.js
	 *
	 *	Barry needs to do a lot of tidying before he can go out for release.
	 *	Our gulp file does all the leg work by packaging everything up and
	 *	tying a nice little bow on top.
	 *
	 */


	/*
	 *	~ Dependancies
	 *
	 *	1.	gulp
	 *		Duh! How else is anything going to run
	 *
	 *	2.	gulp-sass
	 *		Parses all the scss into css so it can be used in production.
	 *
	 *	3.	gulp-minify-css
	 *		We want to really minify that css for production
	 *
	 *	4.	gulp-notify
	 *		We want to get notified on any errors without looking at the console.
	 *
	 *	5.	del
	 *		Used in the clean up task.
	 *
	 */

	var gulp          = require('gulp'),
		sass          = require('gulp-sass'),
		minify        = require('gulp-minify-css'),
		notify        = require('gulp-notify'),
		del           = require('del'),
		plumber       = require('gulp-plumber'),
		rename        = require('gulp-rename'),
		runSequence   = require('run-sequence'),
		logger        = require('gulp-logger'),
		copy          = require('gulp-copy');
		concatCss     = require('gulp-concat-css'),
		autoprefixer  = require('gulp-autoprefixer');




	/*
	 *	~ Build Paths
	 *
	 *	The files we will build with.
	 *
	 */

	var buildPaths = {
		scripts: [],
		styles: ['./dev/sass/barry.scss'],
		fonts: []
	};




	/*
	 *	~ Watcher Paths
	 *
	 *	The folder we'll be monitoring in our watcher task.
	 *
	 */

	var watchPaths = {
		scripts: ['./dev/js/**/*.js'],
		styles: ['./dev/sass/**/*.scss']
	};





	/*
	 *	~ Distribution Folder
	 *
	 *	The folder where everything will end up once we've parsed, minified and cleaned.
	 *
	 */

	var distFolder = './barry/';
	var distFilePaths = {
		cssNormalFile: './barry/barry.css',
		cssMnifiedFile: './barry/barry.min.css'
	};





	/*
	 *	~ CSS Dependancies Folder
	 *
	 *	This folder is the location for all CSS thirdparty dependancies.
	 *
	 */

	var cssDepDestFolder = './dev/sass/_thirdparty/';
	var cssDepFiles = [];





	/*
	 *	~ Third Party CSS
	 *
	 *	This folder is the location for all CSS thirdparty.
	 *
	 */

	var cssThirdpartyDest = './dev/sass/.build-cache/';
	var cssThirdpartyDestFileName = '_thirdparty.css';
	var cssThirdpartyDestFile = cssThirdpartyDest + cssThirdpartyDestFileName;
	var cssThirdpartyFiles = [
		'./bower_components/normalize.css/normalize.css'
	];




	/*
	 *	~ Resources
	 *
	 *	These are folders in 'dev' that contain resources we need to copy to
	 *	production.
	 *
	 */

	var requiredResourcesDestination = './barry/resources';
	var requiredResourcesFiles = [
		'./dev/resources/**/*'
	];





	/*
	 *	~ Default
	 *
	 *	Set everything up and run the initial tasks.
	 *
	 */

	gulp.task('default', ['clean', 'watch', 'build-css']);





	/*
	 *	~ Watch
	 *
	 *	Watch for changes on the sass folder and scripts folder.
	 *
	 */

	gulp.task('watch', function(){
		gulp.watch(watchPaths.styles, ['build-css']);
	});





	/*
	 *	~ Build CSS
	 *
	 *	Run the build process
	 *
	 *	1.	Compile SASS
	 *	2.	Clean CSS
	 *	3.	Minify CSS
	 *
	 */

	gulp.task('build-css', function(callback){
		return runSequence('css-deps', 'sass', 'css-concat', 'css-merge', 'css-normal', 'css-minify', 'copy-resources', callback);
	});





	/*
	 *	~ Sass Task
	 *
	 *	Parse out all Sass to CSS file.
	 *
	 */

	gulp.task('sass', function(){
		return gulp.src(buildPaths.styles)
		.pipe(logger({
			before: '!!!!!!!!!!!!!!! STARTING SASS',
			after: '!!!!!!!!!!!!!!! SASS DONE'
		}))
		.pipe( plumber() )
		.pipe( sass({ onError: handleError}) )
		.pipe( plumber.stop() )
		.pipe( gulp.dest(distFolder) );
	});




	/*
	 *	~ CSS Dependancies
	 *
	 *	Copy all CSS dependancies to sass folder.
	 *
	 */

	gulp.task('css-deps', function(){
		return gulp.src(cssDepFiles, {base: './bower_components/'})
		.pipe( gulp.dest(cssDepDestFolder) );
	});




	/*
	 *	~ Concat Thirdparty
	 *
	 *	Concat all thirdparty CSS
	 *
	 */

	gulp.task('css-concat', function(){
		return gulp.src(cssThirdpartyFiles)
		.pipe(concatCss(cssThirdpartyDestFileName, {rebaseUrls:false}))
		.pipe( gulp.dest(cssThirdpartyDest) );
	});




	/*
	 *	~ Merge Barry
	 *
	 *	Merge all thirdparty css with Barry
	 *
	 */

	gulp.task('css-merge', function(){
		return gulp.src([cssThirdpartyDestFile, distFilePaths.cssNormalFile])
		.pipe(concatCss('barry.css', {rebaseUrls:false}))
		.pipe( gulp.dest(distFolder) );
	});




	/*
	 *	~ Cleanup CSS
	 *
	 *	Remove anything we do not need from the CSS
	 *
	 */

	gulp.task('css-normal', function(){
		return gulp.src(distFilePaths.cssNormalFile)
		.pipe(logger({
			before: '!!!!!!!!!!!!!!! STARTING CSS CLEAN',
			after: '!!!!!!!!!!!!!!! CSS CLEAN DONE'
		}))
		.pipe( plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}) )
		.pipe( autoprefixer() )
		.pipe( minify({ keepBreaks:true }) )
		.pipe( plumber.stop() )
		.pipe( gulp.dest(distFolder) );
	});




	/*
	 *	~ Minify CSS
	 *
	 *	Shrink the CSS and remove the crap.
	 *
	 */

	gulp.task('css-minify', function(){
		return gulp.src(distFilePaths.cssNormalFile)
		.pipe(logger({
			before: '!!!!!!!!!!!!!!! STARTING CSS MINIFY',
			after: '!!!!!!!!!!!!!!! CSS MINIFY DONE'
		}))
		.pipe( plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}) )
		.pipe( minify({ keepSpecialComments:0 }) )
		.pipe( rename({ extname: '.min.css' }) )
		.pipe( plumber.stop() )
		.pipe( gulp.dest(distFolder) )
		.pipe( notify({ message: 'Build Complete' }) );
	});




	/*
	 *	~ Required Resources
	 *
	 *	Copy all required resources to production folder
	 *
	 */

	gulp.task('copy-resources', function(){
		return gulp.src(requiredResourcesFiles)
		.pipe( gulp.dest(requiredResourcesDestination) );
	});




	/*
	 *	~ Clean Task
	 *
	 *	Clear the distribution folder and start fresh on every build.
	 *
	 */

	gulp.task('clean', function(cb){
		return del([distFolder], cb);
	});



	/*
	 *	~ Handle Errors
	 *
	 *	If an error happens notifiy us.
	 *
	 */

	function handleError(err){
		console.error(err);
		return notify().write(err)
	}