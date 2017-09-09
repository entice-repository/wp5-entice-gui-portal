
app.controller('imageInformationController', function($scope, $http, $stateParams, $state) {

    var imageId = $stateParams.imageId;
    // var image_url = SERVICES_URL + "gui/get_entice_detailed_images";

    var image_url = SERVICES_URL + "gui/get_entice_images";
    var get_repositories = SERVICES_URL + "service/get_all_repositories";

    var deploy_on_cloud = SERVICES_URL + "deploy_vmi_on_cloud?image_id=a8169e97-59a0-4478-a0fc-db41a6d99dd9&cloud_access_key=LJUBLJANA&cloud_secret_key=hyp!w7cUNkd$rd_V&cloud_id=OpenStack";

    $scope.image = {};

    $http.get(image_url).then(
        function(success) {
            var data = success.data[0];

            //console.log(data);

            // WHY ITERATE THROUGH THE ENTIRE LIST?!
            for(var c=0; c < data.length; c++){
                if(data[c].id == imageId) {
                    //console.log(data[c]);
                    $scope.image = data[c];

                    if($scope.image.repositoriesList && $scope.image.repositoriesList.length
                        && $scope.image.repositoriesList.length > 0)
                    {
                        $scope.geoLoad($scope.image.repositoriesList[0].geolocation);
                    }

                    if(data[c].ownerFullName == "dummy full name"){
                        data[c].ownerFullName = "Dragi";
                    }

                    break;
                }
            }
        },
        function(error) {
            alert("An error occured!");
        }
    );

    $scope.data = {
        image_id: "a8169e97-59a0-4478-a0fc-db41a6d99dd9",
        cloud_access_key: "LJUBLJANA",
        cloud_secret_key: "hyp!w7cUNkd$rd_V",
        cloud_id: "OpenStack"
    };


    /* Deploy on cloud - POST REQUEST */
    $scope.deployOnCloud = function() {
        waitingDialog.show();

        $http.post(deploy_on_cloud, $scope.data).then(
            function(success) {
                console.log(success);
                waitingDialog.hide();

            },
            function(error) {
                alert("An error occured");
                waitingDialog.hide();
            }
        );
    };

    $scope.showProgress = false;

    $scope.goToOptimization = function(){
        $state.go("optimization", {imageId:imageId});
    };

    $scope.geoLoad = function(country){

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
        if(country){
            geod[country.countryNameShort] = [1, country.countryName];
        }

        $('#network-geo-map').geoChart(geod, {
            map: 'js/jqGeoChart/jqGeoChart.WorldMap.txt'
        });
    };
});
