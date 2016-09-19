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

/* ANGULAR MODULES - Dependency Injection
* Calling order:
* 1. app.config()
* 2. app.run()
* 3. app.controller()
* 4. directives
* */
var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'googlechart', '720kb.tooltips',
                                 'lr.upload', 'nya.bootstrap.select', 'angular-growl']);

/* First app.config() module is called  */
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('home', {
        url: '/',
        templateUrl: './templates/home.html',
        authenticate: false
    });

    $stateProvider.state('upload-image', {
        url: '/upload-image',
        templateUrl: './templates/upload-image.html',
        controller: 'uploadImageController',
        authenticate: true
    });

    $stateProvider.state('explore-images', {
        url: '/explore-images',
        templateUrl: './templates/explore-images.html',
        controller: 'exploreImageController',
        authenticate: false
    });

    $stateProvider.state('image-information', {
        url: '/image-information/{imageId}',
        templateUrl: './templates/image-information.html',
        controller: 'imageInformationController',
        authenticate: false
    });

    $stateProvider.state('optimization', {
        url: '/optimization/:imageId',
        templateUrl: './templates/optimization.html',
        controller: 'optimizationController',
        authenticate: true
    });

    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: './templates/dashboard.html',
        controller: "repositoriesController",
        authenticate: true
    });

    $stateProvider.state('build-recipes', {
        url: '/build-recipes',
        templateUrl: './templates/build-recipes.html',
        controller: "buildRecipesController",
        authenticate: true
    });

    $stateProvider.state('sign-up', {
        url: '/sign-up',
        templateUrl: './templates/sign-up.html',
        authenticate: false
    });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: './templates/login.html',
        controller: "loginController",
        authenticate: false
    });
    
    $stateProvider.state('forgot-password', {
        url: '/reset-password',
        templateUrl: './templates/forgot-password.html',
        authenticate: false
    });
});

/* Second: app.run() module is called */
app.run(function($rootScope, $state, authService, $interval) {
    $rootScope.$state = $state;
    $rootScope.intervals = [];

    /* Everytime a state changes in this function it checks for user authentication */
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

        for(var c=0; c<$rootScope.intervals.length; c++){
            $interval.cancel($rootScope.intervals[c]);
        }

        /* States which have Authentication set to true, users are redirected to login page */
        if (toState.authenticate && !authService.isAuthenticated()) {
            // User isn’t authenticated
            $state.transitionTo('login');
            event.preventDefault();
        }
        // authService.isAuthenticated();
    });
});
