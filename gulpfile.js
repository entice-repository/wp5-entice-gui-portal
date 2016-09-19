/*
 * =================================================================================
 * This file is part of: ENTICE Image Portal (Graphical User Interface)
 * Release version: 0.2
 * =================================================================================
 * Developer: Polona Štefanič, University of Ljubljana, Slovenia
 *
 * The project leading to this application has received funding
 * from the European Union's Horizon 2020 research and innovation
 * programme under grant agreement No 644179.
 *
 * Copyright 2016
 * Contact: Vlado Stankovski (vlado.stankovski@fgg.uni-lj.si),
 Polona Štefanič (polona.stefanic@fgg.uni-lj.si)
 * =================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you must not use this file except in compliance with the License.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * For details see the terms of the License (see attached file: README).
 * The License is also available at http://www.apache.org/licenses/LICENSE-2.0.txt.
 * ================================================================================
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var flatten = require('gulp-flatten');
var webserver = require('gulp-webserver');
var minify = require('gulp-minify');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');

/* npm gulp-install --save */

/* Move index.html to dist/index.html and templates to dist/templates */
gulp.task('moveHTML', function() {
    gulp.src(['./src/index.html'])
        .pipe(gulp.dest('./dist'))
        .pipe(notify('HTML: Moved index.html.'));

    gulp.src(['!./src/index.html', '!./src/index1.html', './src/**/*.html'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist/templates'))
        .pipe(notify('HTML: Moved templates.'));
});

/* Move all CSS to templates/css */
gulp.task('moveCSS', function() {
    /* Move and concatenate all CSS files to dist/css/all.css */
    gulp.src(['./src/main.css', './src/**/*.css'])
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify('CSS: All CSS files moved and concatenated.'));

    /* Move Bower CSS libraries to dist/css/lib.css */
    gulp.src([
        './bower_components/bootstrap/dist/css/bootstrap.min.css',
        './bower_components/jquery-prettyPhoto/css/prettyPhoto.css',
        './bower_components/font-awesome/css/font-awesome.min.css',
        './bower_components/angular-bootstrap/ui-bootstrap-csp.css',
        './bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
        './bower_components/angular-tooltips/dist/angular-tooltips.css',
        './bower_components/nya-bootstrap-select/dist/css/nya-bs-select.min.css',
        './bower_components/angular-growl-v2/build/angular-growl.css'
    ])
        .pipe(concat('lib.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify('CSS: Moved Bower CSS libraries.'))
});

/* Moving and minifying all scripts */
gulp.task('moveScripts', function() {

    gulp.src(['./src/app.js'])
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify('JS: Moved app.js'));

    gulp.src(['src/global.js', '!./src/app.js', './src/**/*.js'])
        .pipe(concat('all.js'))
         /* .pipe(minify()) */
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify('JS: Moved and minified scripts.'));

    gulp.src([
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/angular/angular.min.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js',
        './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        './bower_components/bootstrap-select/dist/js/bootstrap-select.min.js',
        './bower_components/jquery-prettyPhoto/js/jquery.prettyPhoto.js',
        './bower_components/angular-google-chart/ng-google-chart.js',
        './bower_components/less/dist/less.min.js',
        './bower_components/angular-tooltips/dist/angular-tooltips.js',
        './bower_components/angular-upload/angular-upload.min.js',
        './bower_components/nya-bootstrap-select/dist/js/nya-bs-select.min.js',
        './src/lib/jqGeoChart/jqGeoChart.js',
        './bower_components/angular-growl-v2/build/angular-growl.js',
        './src/lib/waitingDialog.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify('JS: Moved and minified Bower JavaScript libraries.'));
});

gulp.task('moveImages', function() {
    gulp.src(['./src/images/**/*.png', './src/images/**/*.jpg'])
        .pipe(gulp.dest('./dist/images'))
        .pipe(notify('IMG: Images moved.'));
});

gulp.task('moveFonts', function() {
    gulp.src(['./bower_components/bootstrap/fonts/**', './bower_components/font-awesome/fonts/**'])
        .pipe(gulp.dest('./dist/fonts'))
        .pipe(notify('FONTS: Fonts moved.'));
});

gulp.task('moveLib', function() {
    gulp.src('./src/lib/**/')
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify('LIB: Libs moved.'));
});


/* Move all bower js scripts to vendor.js */
gulp.task('serve', function() {
    gulp.src('.')
        .pipe(webserver({
            port: 48080,
            livereload: true,
            open: 'http://localhost:48080/dist'
        })).pipe(notify("Running webserver on localhost!"));
});

gulp.task('watch', ['serve'], function () {
    gulp.start(['moveHTML', 'moveCSS', 'moveScripts', 'moveImages', 'moveFonts', 'moveLib']);
    gulp.watch(['src/index.html', 'src/**/*.html'], ['moveHTML']);
    gulp.watch(['src/main.css', 'src/**/*.css', 'bower_components/**/*.css'], ['moveCSS']);
    gulp.watch(['src/app.js', 'src/**/*.js', 'bower_components/**/*.js'], ['moveScripts']);
});