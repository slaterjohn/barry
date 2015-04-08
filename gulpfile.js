	
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
	var gulp = require('gulp'),
		sass = require('gulp-sass'),
		minify = require('gulp-minify-css'),
		notify = require('gulp-notify'),
		del = require('del'),
		plumber = require('gulp-plumber'),
		rename = require('gulp-rename');




	/*
	 *	~ Build Paths
	 *
	 *	The files we will build with.
	 *
	 */
	var buildPaths = {
		scripts: [],
		styles: ['./dev/sass/barry.scss']
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





	/*
	 *	~ Default
	 *
	 *	Set everything up and run the initial tasks.
	 *
	 */

	gulp.task('default', ['clean', 'watch'], function(){
		gulp.start('styles');
	});





	/*
	 *	~ Watch
	 *
	 *	Watch for changes on the sass folder and scripts folder.
	 *
	 */
	gulp.task('watch', function(){
		gulp.watch(watchPaths.styles, ['styles']);
	});





	/*
	 *	~ Styles Task
	 *	Ensure all sass is compiled to be production ready. This includes dropping development
	 *	comments and saving a minified and unminified CSS version.
	 *
	 *	1.	Compile SCSS to CSS
	 *	2.	On any error send to error handler
	 *	3.	Save it
	 *	4.	Minify the CSS output
	 *	5.	Rename to add .min.css to end
	 *	6.	Save the minified version
	 *	7.	Notify of success
	 *
	 */

	gulp.task('styles', function(){
		return gulp.src(buildPaths.styles)
		.pipe( plumber() )
		.pipe( sass() )
		.on('error', handleError)
		.pipe( gulp.dest(distFolder) )
		.pipe( rename({ extname: '.min.css' }) )
		.pipe( minify() )
		.pipe( gulp.dest(distFolder) )
		.pipe( notify({ message: 'Sass Compiled' }) );
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
		notify({ message: 'Sass Error' + err.message })
	}