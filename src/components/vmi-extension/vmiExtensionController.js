app.controller('vmiExtensionController', function ($scope, $http, $state, $stateParams, growl) {

    var url_get_installers = SERVICES_URL + "sztaki/get_sztaki_installers";
    var get_virtual_images = SERVICES_URL + "sztaki/get_sztaki_virtual_images";
    var create_virtual_image_url = SERVICES_URL + "sztaki/create_virtual_image";

    $scope.show = false;

    $scope.tags = ["foo", "bar"];

    var imageId = $stateParams.imageId;

    // deprecated
    $scope.toggleInstallers = function () {
        console.log("update....");
        $scope.show = !$scope.show;

    };

    $scope.installer_list = {};
    $scope.images_list = {};


    $http.get(get_virtual_images).then(
        function (success) {
            if (success != null) {
                var data = success.data;
                var index = -1;
                for (var c = 0; c < data.length; c++) {
                    $scope.images_list[c] =
                        {
                            id: data[c].id,
                            name: data[c].name,
                            // tags: data[c].tags
                            type: data[c].type
                            // owner: data[c].owner,
                            // created: new Date(data[c].created)
                        };
                    console.log("executed iteration");
                    if(imageId && data[c].id == imageId)
                        index = c;
                }

                if (index > -1){
                    // TODO: solve update of combo box programmatically
                    // $scope.images_list = $scope.images_list[index];
                    //  $scope.formData.Parent = $scope.images_list[index];
                }

            }
        },
        function (failure) {
            console.log("Explore images failure or server timeout...");
            // waitingDialog.hide();
        });

    $scope.browseInstallers = function (message) {

        $http.get(url_get_installers).then(
            function (success) {
                if (success != null) {
                    var data = success.data;
                    console.log("test1: " + data.length);
                    for (var c = 0; c < data.length; c++) {
                        $scope.installer_list[c] =
                            {
                                id: data[c].id,
                                name: data[c].name,
                                tags: data[c].tags,
                                description: data[c].description,
                                author: data[c].author,
                                version: (data[c].version ? data[c].version : "/")
                            };
                    }
                }
                console.log("test2");
            },
            function (failure) {
                console.log("Explore images failure or server timeout...");
            }
        )
    };

    /* VMI Extention */
    $scope.tooltipsTab4 = {
        "imageName": "Name of the image",
        "imageTags": "Tags of the image",
        "imageDescription": "Description of the image",
        "imageParent": "Id of the parent image (optional)",
        "imageInstallers": "List of Installers ids of the parent image (optional).",
        "imageInstaller": "Custom installer script (text area).",
        "imageOwner": "Creator of the image"
    };

    $scope.submit = function () {
        try {
            //if name is parent is not selected error occurs
            $scope.formData.Parent;

            var installers_list = [];
            if ($scope.formData.installers && $scope.formData.installers.length) {
                for (var i = 0; i < $scope.formData.installers.length; i++) {
                    installers_list.push($scope.formData.installers[i].id);
                }
            }

            var tags_list = [];
            if ($scope.formData.image_tags && $scope.formData.image_tags.length > 0) {
                var tagsSplit = $scope.formData.image_tags.split(',');
                for (var i = 0; i < tagsSplit.length; i++) {
                    tags_list.push(tagsSplit[i]);
                }
            }

            var data = {
                owner: $scope.getUserId(),
                parent: $scope.formData.Parent.id,
                // following optional attributes:
                name: $scope.formData.image_name,
                description: $scope.formData.image_description,
                knowledgeBaseRef: $scope.formData.Parent.id,
                installerIds: installers_list, //list
                installerBase64: $scope.formData.customInstaller,
                initBase64: $scope.formData.initScript,
                snapshotUrl: $scope.formData.snapshotUrl,
                tags: tags_list  //list
            };

            // console.log(JSON.stringify(data));
            waitingDialog.show();

            try {
                $http.post(create_virtual_image_url, data).then(
                    function (success) {
                        waitingDialog.hide();

                        if (success.data.error)
                            $scope.popUpToastr("error", "Virtual Image extension failed: " + success.data.error);
                        else {
                            $scope.active = 1;
                            // refreshOptimizationData(true);
                            $scope.popUpToastr("success", "Successful Virtual Image extension: " + success.data.message);
                        }
                    },
                    function (error) {
                        waitingDialog.hide();
                        $scope.popUpToastr("error", "Virtual Image extension failed: " + JSON.stringify(error));
                    }
                );
            }
            catch (err) {
                waitingDialog.hide();
                alert(err);
            }

        } catch (err) {
            $scope.popUpToastr("error", "Parent virtual/base image is not selected" + err);
        }
    }

    /* NOTIFICATIONS */
    $scope.popUpToastr = function (type, msg) {
        console.log("growl invoke");
        var config = {};
        switch (type) {
            case "success":
                growl.success(msg, config);
                break;
            case "error":
                growl.error(msg, config);
                break;
            case "warning":
                growl.warning(msg, config);
                break;
            case "info":
                growl.info(msg, config);
                break;
            default:
                growl.info(msg, config);
        }
    };


    angular.element(document).ready(function () {
        $scope.browseInstallers();
    });

});