// gulp libs
var gulp = require('gulp');
var release = require('gulp-github-release');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

//var tag = new Date().toISOString().replace(/T.+$/, '').replace(/-/g, '.');
//var tag = '1.0.0';
var lastestTag;

gulp.task('gittag', function () {
	return new Promise(function (resolve, reject) {
		exec('git tag', function (error, stdout, stderr) {
			var outText = '' + stdout,
				errText = '' + stderr;

			if (error || errText || !outText)
			{
				reject();
			}
			else
			{
				latestTag = outText.split(/\s/)[0];
				if (!latestTag)
				{
					gutil.log(gutil.colors.red('GIT tag not found - aborting!'));
					reject();
				}
				else
				{
					gutil.log('Using GIT tag: ' + latestTag);
					resolve();
				}
				//console.log(outText.split(/\s/)[0]);
			}
		});
	});
});

// js concat & minify
gulp.task('release', ['gittag'], function () {
	gulp.src('./dist/deploy.zip')
		.pipe(release({
			//token: token,                     // or you can set an env var called GITHUB_TOKEN instead
			//owner: owner,                    	// if missing, it will be extracted from manifest (the repository.url field)
			//repo: 'publish-release',          // if missing, it will be extracted from manifest (the repository.url field)
			//tag: 'release-' + tag,              // if missing, the version will be extracted from manifest and prepended by a 'v'
			tag: lastestTag,
			name: 'publish release ' + lastestTag,     // if missing, it will be the same as the tag
			notes: 'very good!',                // if missing it will be left undefined
			draft: false,                       // if missing it's false
			prerelease: false,                  // if missing it's false
			manifest: require('./package.json') // package.json from which default values will be extracted if they're missing
		}));
});

gulp.task('default', function () {});