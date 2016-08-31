// gulp libs
var gulp = require('gulp');
var release = require('gulp-github-release');
var gulpUtil = require('gulp-util');
var argv = require('yargs').argv;

var token = argv.token;

if (!token)
{
	throw new gulpUtil.PluginError({
		plugin: 'deploy',
		message: 'GitHub token was not specified!'
    });
}

// js concat & minify
gulp.task('release', function () {
	gulp.src('./dist/deploy.zip')
		.pipe(release({
			token: token,                     // or you can set an env var called GITHUB_TOKEN instead
			//owner: owner,                    // if missing, it will be extracted from manifest (the repository.url field)
			//repo: 'publish-release',            // if missing, it will be extracted from manifest (the repository.url field)
			tag: 'release-1.0.0',                      // if missing, the version will be extracted from manifest and prepended by a 'v'
			name: 'publish release v1.0.0',     // if missing, it will be the same as the tag
			notes: 'very good!',                // if missing it will be left undefined
			draft: false,                       // if missing it's false
			prerelease: false,                  // if missing it's false
			manifest: require('./package.json') // package.json from which default values will be extracted if they're missing
		}));
});

gulp.task('default', function () {
	
});
