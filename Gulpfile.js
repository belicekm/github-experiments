// gulp libs
var gulp = require('gulp');
var release = require('gulp-github-release');
var gulpUtil = require('gulp-util');
//var tag = new Date().toISOString().replace(/T.+$/, '').replace(/-/g, '.');
var tag = '1.0.0';

// js concat & minify
gulp.task('release', function () {
	gulp.src('./dist/deploy.zip')
		.pipe(release({
			//token: token,                     // or you can set an env var called GITHUB_TOKEN instead
			//owner: owner,                    	// if missing, it will be extracted from manifest (the repository.url field)
			//repo: 'publish-release',          // if missing, it will be extracted from manifest (the repository.url field)
			tag: 'release-' + tag,              // if missing, the version will be extracted from manifest and prepended by a 'v'
			name: 'publish release ' + tag,     // if missing, it will be the same as the tag
			notes: 'very good!',                // if missing it will be left undefined
			draft: false,                       // if missing it's false
			prerelease: false,                  // if missing it's false
			manifest: require('./package.json') // package.json from which default values will be extracted if they're missing
		}));
});

gulp.task('default', function () {});
