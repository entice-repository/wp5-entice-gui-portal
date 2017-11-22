app.controller('detailedVMIBrowsingController', function ($scope, $http, $stateParams, $state) {

    var imageId = $stateParams.imageId;
    var detailed_base_image_details = SERVICES_URL + "sztaki/get_sztaki_base_image_details?base_image_id=";
    var get_repositories = SERVICES_URL + "service/get_all_repositories";

    $scope.image = {};

    $http.get(detailed_base_image_details + imageId).then(
        function (success) {
            console.log("abc00");
            var data = success.data;
            console.log("abc0");
            // alert(JSON.stringify(success));
            $scope.image.imageName = data.name;
            $scope.image.ownerFullName = data.owner;
            $scope.image.created = data.created;
            $scope.image.status = data.status;
            $scope.image.vmiURL = data.url;
            $scope.image.description = data.description;
            $scope.image.cloudImageIds = data.cloudImageIds;
            $scope.image.tags = data.tags;
            console.log("abc1");
            if (data.partition > 0)
                $http.get(get_repositories).then(
                    function (success) {
                        $scope.image.partition = success.data[data.partition - 1].geolocation.countryName;
                    },
                    function (failure) {
                    }
                );
        },
        function (error) {
            alert("An error occured!" + error);
        }
    );
});
