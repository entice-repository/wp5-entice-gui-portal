app.controller('uploadOptimizedImageController', function ($scope, $http, upload, authService, growl, $state, $timeout) {

    var optimized_vmi_upload = SERVICES_URL + "gui/optimised_vmi_upload";

    /* SHOW TOOLTIPS - additional explanation for each field (?) */
    $('[data-toggle="tooltip"]').tooltip();

    $scope.objectives = [];
    $scope.variables = [];
    $scope.pareto_point = null;
    $scope.loaded = false;
    $scope.uploadForm = {};
    $scope.formData = {};

    /* POST REQUEST */
    $scope.submitOptimizedImageUpload = function () {

        var file_upload_value = $("#vmi_file");
        var redistribution_json_file = $("#json_redistribution_file");

        var data = {
            file_upload: file_upload_value,
            json_file: redistribution_json_file,
        };

        // todo: add validation

        waitingDialog.show();

        upload({
            url: optimized_vmi_upload,
            method: 'POST',
            data: data
        }).then(
            function (response) {
                waitingDialog.hide();

                console.log(response);
                $scope.responseMessage = response.data.message;

                console.log("** Code: " + $scope.responseCode + " \n** RepositoryID: " + $scope.responseMessage);

                if (response.data.code == 200) {
                    $scope.popUpToastr("success", "Upload successful. Message: "+ response.data.message);
                    $timeout(function () {
                        $state.go($state.current, {}, {reload: false});
                    }, 3000);

                } else {
                    $scope.popUpToastr("error", "Upload failed");
                }
            },
            function (response) {
                waitingDialog.hide();

                console.log(response);
                error_response = response.data.message;

                $scope.popUpToastr("error", "Upload failed: " + error_response);
            }
        );
    };

    /* TEXT FOR TOOLTIPS */
    $scope.tooltipsOptimizedUploadImage = {
        "vmiFile": "Select an optimized VMI file.",
        "jsonFile": "Select a redistribution file in JSON format containing a list of elements with the following properties: sourceId, vmiName, vmiURI, destinationId",
    };

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
});

app.config(['tooltipsConfProvider', function configConf(tooltipsConfProvider) {
    tooltipsConfProvider.configure({
        'smart': true,
        'size': 'small',
        'speed': 'medium',
        'tooltipTemplateUrlCache': true,
        'side': 'top'
    });
}]);

app.directive('validFile', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, el, attrs, ngModel) {
            el.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(el.val());
                });
            });
        }
    }
});