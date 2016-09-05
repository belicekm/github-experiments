// gulp libs
var gulp = require('gulp');
var release = require('gulp-github-release');
var gutil = require('gulp-util');

var TAG_ERR_TEXT = 'Unable to resolve GIT TAG from environment variable GIT_LATEST_TAG';

gulp.task('release', function (callback) {
	var latestTag = process.env.GIT_LATEST_TAG;
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
		callback(TAG_ERR_TEXT);
	}
});

gulp.task('default', ['release']);
