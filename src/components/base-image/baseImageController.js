app.controller('baseImageController', function ($scope, $http, upload, authService, growl, $stateParams, $state, $timeout) {

    var image_url = SERVICES_URL + "gui/get_entice_detailed_images?id=";

    /* Create base image */
    $scope.tooltipsTab2 = {
        "imageName": "Name of the image",
        "imageTags": "Tags of the image separated with comma delimiter",
        "imageDescription": "Description of the image",
        "imageURL": "The URL from where the image file can be downloaded.",
        "imagePartition": "Physical partition number of LVM (group and volume).",
        "imageCloudId": "Map of cloud names and cloud image Ids.",
        "imageOwner": "Creator of the image"
    };


    // delegate data if the base image is registered from an existing one
    if ($stateParams.imageId) {
        $http.get(image_url + $stateParams.imageId).then(
            function (success) {
                var data = success.data;

                $scope.formData = {
                    image_name: data.imageName,
                    description: data.description,
                    image_url: data.vmiURL,
                    partition: "1",
                    tags: data.categories
                };
            },
            function (error) {
                alert("An error occured!" + error);
            }
        );
    }
    else {
        // Default values
        $scope.formData = {
            partition: "1"
        };
    }

    var register_base_image = SERVICES_URL + "sztaki/register_base_image";

    $scope.registerBaseImageSubmit = function () {

        var cloudImageDict = {};
        cloudImageDict[$scope.formData.image_id_key] = $scope.formData.image_id_value;

        var data = {
            owner: $scope.getUserId(),
            url: $scope.formData.image_url,
            name: $scope.formData.image_name,
            description: $scope.formData.description,
            partition: parseInt($scope.formData.partition),
            tags: $scope.formData.tags.split(","),
            cloudImageIds: cloudImageDict,
            imageSize : $scope.formData.imageSize
        };

        // console.log(JSON.stringify(data));
        // todo: add validation if needed

        waitingDialog.show();

        $http.post(register_base_image, data).then(
            function (response) {
                waitingDialog.hide();

                if (response.data.code == 200) {
                    $scope.popUpToastr("success", "Image with ID " + response.data.message + " was successfully registered.");
                    $timeout(function () {
                        $state.go($state.current, {}, {reload: false});
                    }, 3000);

                } else {
                    $scope.popUpToastr("error", "Error while registering base image. Error: " + response.data.error);
                }
            },
            function (response) {
                waitingDialog.hide();

                console.log(response);
                error_response = response.data.error;

                $scope.popUpToastr("error", "Upload failed: " + error_response);
            }
        );
    }


    /* NOTIFICATIONS */
    $scope.popUpToastr = function (type, msg) {
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
})