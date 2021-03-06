// gulp libs
var gulp = require('gulp');
var release = require('gulp-github-release');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

var latestReleaseTag;

// generate version.js with GIT tag logged to console
gulp.task('version', ['gittag'], function () {
	var src = require('stream').Readable({objectMode: true});
	src._read = function () {
		this.push(new gutil.File({
			cwd: "",
			base: "",
			path: 'version.js',
			contents: new Buffer('console.log("RELEASE VERSION: ' + latestReleaseTag + '")')
		}));
		this.push(null)
	};
	return src.pipe(gulp.dest('dist/'))
});

// get latest GIT tag which has "release-" prefix and store it in latestReleaseTag variable.
gulp.task('gittag', function () {
	return new Promise(function (resolve, reject) {
		// get the latest tag with "release-" prefix
		var command = 'git describe --tags --abbrev^=0 --match release-*';
		exec(command, function (error, stdout, stderr) {
			var outText = '' + stdout,
				errText = '' + stderr;

			if (error || errText || !outText) {
				gutil.colors.red('GIT tag not found - aborting!')
				reject('GIT tag not found - aborting!');
			} else {
				latestReleaseTag = outText.trim();
				if (latestReleaseTag) {
					resolve();
				} else {
					gutil.log(gutil.colors.red('GIT tag not found - aborting!'));
					reject('GIT tag not found - aborting!');
				}
			}
		});
	});
});

// Perform GitHub release using public GitHub API
// Depends on GITHUB_TOKEN
gulp.task('release:novar', ['version'], function (callback) {
	gutil.log('Using release tag: ' + latestReleaseTag);
	if (process.env.GITHUB_TOKEN) {
		return gulp
				//.src('./dist/deploy.zip')
				.src([])
				.pipe(release({
					token: process.env.GITHUB_TOKEN,
					tag: latestReleaseTag,
					name: 'Release ' + latestReleaseTag,     // if missing, it will be the same as the tag
					//notes: 'very good!',                // if missing it will be left undefined
					draft: false,                       // if missing it's false
					prerelease: false,                  // if missing it's false
					manifest: require('./package.json') // package.json from which default values will be extracted if they're missing
				}));
	} else {
		callback('Unable to resolve GitHub authentication token from environment variable GITHUB_TOKEN');
	}
});

// ANOTHER VARIANT:

// Perform GitHub release using public GitHub API
// Depends on environment variable GITHUB_TOKEN (hardcoded in TeamCity) and GIT_LATEST_TAG (set from tag.bat)
gulp.task('release', function (callback) {
	var latestTag = process.env.GIT_LATEST_TAG;
	if (!process.env.GITHUB_TOKEN)
	{
		callback('Unable to resolve GitHub authentication token from environment variable GITHUB_TOKEN');
	}
	if (latestTag)
	{
		gutil.log('Using release tag: ' + latestTag);
		return gulp
				.src('./dist/deploy.zip')
				.pipe(release({
					tag: latestTag,
					name: 'publish release ' + latestTag,     // if missing, it will be the same as the tag
					notes: 'very good!',                // if missing it will be left undefined
					draft: false,                       // if missing it's false
					prerelease: false,                  // if missing it's false
					manifest: require('./package.json') // package.json from which default values will be extracted if they're missing
				}));
	}
	else
	{
		callback('Unable to resolve GIT tag from environment variable GIT_LATEST_TAG');
	}
});

gulp.task('default', ['release']);