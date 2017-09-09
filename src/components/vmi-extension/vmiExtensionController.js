app.controller('vmiExtensionController', function($scope) {

    $scope.show = false;

    $scope.tags = ["foo","bar"];

    $scope.toggleInstallers = function () {
        $scope.show = !$scope.show;
    };

    /* VMI Extention */
    $scope.tooltipsTab4 = {
        "imageName" : "Name of the image",
        "imageTags" : "Tags of the image",
        "imageDescription" : "Description of the image",
        "imageParent": "Id of the parent image (optional)",
        "imageInstallers": "List of Installers ids of the parent image (optional).",
        "imageInstaller": "Custom installer script (text area).",
        "imageOwner" : "Creator of the image"
    };

    $scope.installers = [
        {id: 0, installer_name: "45765-efa-234"},
        {id: 1, installer_name: "46795-ffe-a43"},
        {id: 2, installer_name: "567-feaae-123"}
    ];

    $scope.submit = function(){ oops(); }
});







