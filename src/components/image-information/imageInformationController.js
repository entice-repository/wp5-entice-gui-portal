app.controller('imageInformationController', function ($scope, $http, $stateParams, $state) {

    var imageId = $stateParams.imageId;
    // var image_url = SERVICES_URL + "gui/get_entice_detailed_images";

    var image_url = SERVICES_URL + "gui/get_entice_detailed_images?id=";
    var get_repositories = SERVICES_URL + "service/get_all_repositories";

    var deploy_on_cloud = SERVICES_URL + "deploy_vmi_on_cloud?image_id=*&cloud_access_key=*&cloud_secret_key=*&cloud_id=*";
    $scope.image = {};
    var all_repositories;

    // load VMI:
    $http.get(image_url + imageId).then(
        function (success) {
            if (success.data.ownerFullName == "dummy full name") {
                success.data.ownerFullName = "Dragi";
            }

            $scope.image = success.data;

            //load VMI repository information to the map:
            if ($scope.image.repositoriesList && $scope.image.repositoriesList.length > 0) {
                $scope.geoLoad();
                for (var i = 0; i < $scope.image.repositoriesList.length; i++) {
                    console.log($scope.image.repositoriesList[i].geolocation);
                    $scope.geoLoad($scope.image.repositoriesList[i].geolocation);
                }
            }
        },
        function (error) {
            alert("An error occured!");
        }
    );

    $scope.data = {
        image_id: "*",
        cloud_access_key: "*",
        cloud_secret_key: "*",
        cloud_id: "*"
    };


    /* Deploy on cloud - POST REQUEST */
    $scope.deployOnCloud = function () {
        waitingDialog.show();

        $http.post(deploy_on_cloud, $scope.data).then(
            function (success) {
                console.log(success);
                waitingDialog.hide();

            },
            function (error) {
                alert("An error occured");
                waitingDialog.hide();
            }
        );
    };

    $scope.showProgress = false;

    $scope.goToOptimization = function () {
        var functionalTests = ""

        if ($scope.image.functionalTests != null && $scope.image.functionalTests[0] != null && $scope.image.functionalTests[0].inputDescription != null)
            functionalTests = $scope.image.functionalTests[0].inputDescription;

        // delegate data to optimization form - image ID, image URL, functional tests URL
        $state.go("optimization", {imageId: imageId, imageURL: $scope.image.vmiURL, functionalTests: functionalTests, ovfurl : $scope.image.ovfURL });
    };

    $scope.goToRegisterBaseImage = function () {
        $state.go("registerBaseImage", {imageId: imageId});
    };

    $scope.geoLoad = function (country) {

        console.log(country);

        /*
         var geod = {};
         geod[country.id] = [1, country.name];
         */

        /*
         var geod = {
         "hu" : [1, "Budapest: Hungary"]
         //"at" : [2, "Innsbruck: Austria"],
         //"us" : [3, "Amazon: US"]
         // "de" : [5, "Germany: Berlin"],
         };
         */

        var geod = {};
        if (country) {
            geod[country.countryNameShort] = [1, country.countryName];
        }

        $('#network-geo-map').geoChart(geod, {
            map: 'js/jqGeoChart/jqGeoChart.WorldMap.txt'
        });
    };
});
