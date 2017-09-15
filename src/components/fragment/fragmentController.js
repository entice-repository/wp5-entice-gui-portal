app.controller('fragmentController', function ($scope, $http, upload, authService, growl, $state, $stateParams, $timeout) {


    /* Create base image */
    $scope.tooltipsAttachFragment = {
        "file": "Fragment file to be attached to the VMI"
    };


    var store_fragment_url = SERVICES_URL + "sztaki/store_fragment";

    $scope.fragmentAttachSubmit = function () {
        var data = {
            file_upload: $("#vmi_file"),
            disk_image_id: $stateParams.imageId
        };

         alert($stateParams.imageId);

        waitingDialog.show();
        $http.post({
            url: store_fragment_url,
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