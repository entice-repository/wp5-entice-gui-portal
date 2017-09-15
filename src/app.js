/* ANGULAR MODULES - Dependency Injection
* Calling order:
* 1. app.config()
* 2. app.run()
* 3. app.controller()
* 4. directives
* */

function oops() {
    swal({
        title: "Oops...",
        html: "API is not defined!<br />Please contact ENTICE WP6 integrators!",
        type: 'error'
    });
}

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

    $stateProvider.state('upload-optimized-image', {
        url: '/upload-optimized-image',
        templateUrl: './templates/upload-optimized-image.html',
        controller: 'uploadOptimizedImageController',
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

    $stateProvider.state('detailed-vmi-browsing', {
        url: '/detailed-vmi-browsing/{imageId}',
        templateUrl: './templates/detailed-vmi-browsing.html',
        controller: 'detailedVMIBrowsingController',
        authenticate: false
    });

    $stateProvider.state('optimization', {
        url: '/optimization/:imageId&imageURL={imageURL}&functionalTests={functionalTests}',
        templateUrl: './templates/optimization.html',
        controller: 'optimizationController',
        authenticate: true
    });

    $stateProvider.state('storeFragmentat', {
        url: '/fragment/:imageId',
        templateUrl: './templates/fragment.html',
        controller: 'fragmentController',
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

    $stateProvider.state('vmi-browsing', {
        url: '/vmi-browsing',
        templateUrl: './templates/vmi-browsing.html',
        controller: "vmiBrowsingController",
        authenticate: false
    });

    $stateProvider.state('snapshot-upload', {
        url: '/snapshot-upload',
        templateUrl: './templates/snapshot-upload.html',
        controller: "snapshotUploadController",
        authenticate: true
    });

    $stateProvider.state('base-image', {
        url: '/base-image',
        templateUrl: './templates/base-image.html',
        controller: "baseImageController",
        authenticate: true
    });


    $stateProvider.state('installers-browsing', {
        url: '/installers-browsing',
        templateUrl: './templates/installers-browsing.html',
        controller: "installersBrowsingController",
        authenticate: true
    });

    $stateProvider.state('vmi-extension', {
        url: '/vmi-extension',
        templateUrl: './templates/vmi-extension.html',
        controller: "vmiExtensionController",
        authenticate: true
    });

    $stateProvider.state('vmi-launching', {
        url: '/vmi-launching',
        templateUrl: './templates/vmi-launching.html',
        controller: "vmiLaunchingController",
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
