var gulp = require('gulp');
var childProcess = require('child_process');
var del = require('del');
var electron = require('electron');
var gulpElectron = require('gulp-electron');
var packageJson = require('./app/package.json');


gulp.task("clean", function () {
    return del("./release");
});

gulp.task('run', function () {
    childProcess.spawn(electron, ['./app'], {stdio: 'inherit'});
});

gulp.task('package', ['clean'], function () {

    childProcess.execSync('npm install', {cwd: './app/', env: process.env, stdio: 'inherit'});

    gulp.src("")
        .pipe(gulpElectron({
            src: './app',
            packageJson: packageJson,
            release: './release',
            cache: './cache',
            version: 'v1.4.13',
            packaging: true,
            //token: 'abc123...',
            platforms: ['win32-ia32', 'darwin-x64'],
            platformResources: {
                darwin: {
                    CFBundleDisplayName: packageJson.name,
                    CFBundleIdentifier: packageJson.name,
                    CFBundleName: packageJson.name,
                    CFBundleVersion: packageJson.version,
                    icon: 'build/get-executables.icns'
                },
                win: {
                    "version-string": packageJson.version,
                    "file-version": packageJson.version,
                    "product-version": packageJson.version,
                    "icon": 'build/get-executables.ico'
                }
            }
        }))
        .pipe(gulp.dest(""));
});
