app.controller('vmiLaunchingController', function($scope) {
    $scope.show = false;

    $scope.toggleInstallers = function () {
        $scope.show = !$scope.show;
    };


    /* VMI Launching */
    $scope.tooltipsTab5 = {
        "cloudName" : "Name of the cloud",
        "cloudInterface" : "Cloud interface (EC2 / FCO / WT)",
        "cloudEndpoint" : "Cloud endpoint address",
        "cloudAccessKey": "Cloud Access Key (credentials)",
        "cloudSecretKey": "Cloud Secret Key (credentials)",
        "cloudInstanceType": "Instance type",
        "cloudKeyPairName" : "SSH key pair name",
        "cloudContextualization": "Custom contextualization script (optional)",
        "imageOwner": "Creator of the image"
    };

    $scope.clouds = [
        {id: 0, name: "EC2"},
        {id: 1, name: "FCO"},
        {id: 2, name: "WT Cloud"}
    ];

    $scope.submit = function(){ oops(); }
});