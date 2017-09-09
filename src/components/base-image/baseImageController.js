app.controller('baseImageController', function ($scope, $http, upload, authService, growl, $state, $timeout) {


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


    var register_base_image = SERVICES_URL + "sztaki/register_base_image";

    // {"owner":"admin",
    // "url":"http://source-images.s3.lpds.sztaki.hu/ami-000001654.qcow2",
    // "name":"Ubuntu 16.04",
    // "description":"[BASE OFFICIAL] Ubuntu 16.04.02",
    // "partition":1,
    // "tags":["ubuntu","ubuntu16","16.04"],
    // "cloudImageIds":"ami-000001654"}'
    $scope.registerBaseImageSubmit = function () {
        // $scope.formData.image_description
        // alert(""+$scope.formData.image_name);
// alert($scope.formData.tags.split(","));
        $scope.popUpToastr("success", "Upload successful");
        var cloudImageDict = {};
        cloudImageDict[$scope.formData.image_id_key] = $scope.formData.image_id_value;

        var data = {
            owner: $scope.getUserId(),
            url: $scope.formData.image_url,
            name: $scope.formData.image_name,
            description: $scope.formData.description,
            partition: parseInt($scope.formData.partition),
            tags: $scope.formData.tags.split(","),
            cloudImageIds: cloudImageDict
        };

        // alert(JSON.stringify(data));
        // todo: add validation if needed

        waitingDialog.show();

        $http.post({
            url: register_base_image,
            data: data
        }).then(
            function (response) {
                waitingDialog.hide();

                // console.log(response);
                // console.log("** Code: " + $scope.responseCode + " \n** RepositoryID: " + $scope.responseMessage);

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