// gulp libs
var gulp = require('gulp');
var release = require('gulp-github-release');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

var TAG_ERR_TEXT = 'Unable to resolve GIT TAG';
var latestTag;

gulp.task('gittag:collect', function (cb) {
	// sorted list of GIT tags (latest will be first)
	//var cmd = 'git tag -l --sort=-refname "release-*"';
	var cmd = 'git describe --tags --abbrev=0 --match release-*';
	
	//for /f "git describe --tags --abbrev=0 --match release-*" %%a in ('ver') do @set foobar=%%a
	//for /f %%i in ('git describe --tags --abbrev=^0 --match release-*') do set GIT_LATEST_TAG=%%i

	exec(cmd, function (error, stdout, stderr) {
		var outText = '' + stdout,
			errText = '' + stderr;

		
		if (error || errText || !outText)
		{
			cb(TAG_ERR_TEXT);
		}
		else
		{
			latestTag = outText.split(/\s/)[0];
			if (!latestTag)
			{
				gutil.log(gutil.colors.red('GIT tag not found - aborting!'));
				cb(TAG_ERR_TEXT);
			}
			else if (!(/^release-\d+\.\d+\.\d+/).test(latestTag))
			{
				gutil.log(gutil.colors.red('Invalid GIT tag format "' + latestTag + '" expected "release-n.n.n".'));
				cb(TAG_ERR_TEXT);
			}
			else
			{
				gutil.log('Using GIT tag: ' + latestTag);
				cb();
			}
		}
	});
});

// js concat & minify
gulp.task('release', ['gittag:collect'], function () {
	console.log(latestTag);
	gulp.src('./dist/deploy.zip')
		.pipe(release({
			tag: latestTag,
			name: 'publish release ' + latestTag,     // if missing, it will be the same as the tag
			notes: 'very good!',                // if missing it will be left undefined
			draft: false,                       // if missing it's false
			prerelease: false,                  // if missing it's false
			manifest: require('./package.json') // package.json from which default values will be extracted if they're missing
		}));
});

gulp.task('default', function () {});
