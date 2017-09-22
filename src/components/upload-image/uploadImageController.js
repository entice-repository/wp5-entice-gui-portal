
app.controller('uploadImageController', function($scope, $http, upload, authService, growl, $state, $timeout) {

    /* GET/POST REQUESTS */
    var get_pareto = SERVICES_URL + "gui/get_newest_pareto";
    var post_upload_image = SERVICES_URL + "gui/upload_image";

    /* SHOW TOOLTIPS - additional explanation for each field (?) */
    $('[data-toggle="tooltip"]').tooltip();

    $scope.objectives = [];
    $scope.variables = [];
    $scope.pareto_point = null;
    $scope.loaded = false;

    $scope.uploadForm = {};

    /* GET REQUEST */
    $http.get(get_pareto).then(
        function(success) {
            var data = success.data;

            $scope.variables = data.variables;
            $scope.pareto.id = data.id;
            $scope.objectives = data.objectives;
            var objectives = $scope.objectives;
            var variables = $scope.variables;

            $scope.paretoChart.data = [];
            $scope.paretoChart.data.push(['', 'Cost', 'Transfer Time']);
            for(var i=0; i<objectives.length; i++) {
                $scope.paretoChart.data.push(['', objectives[i][0], objectives[i][1]]);
              //  console.log("pareto x: " +  objectives[i][0] + "\npareto y: "  + objectives[i][1]);

            }

            $scope.repositoryData = [];
            for(var i=0; i<variables.length; i++) {
                $scope.repositoryData.push(variables[i][0]);
                console.log(variables[i][0]);

            }

            $scope.loaded = true;
        },
        function(failure) {
            //alert("Get Pareto request error");
            console.log("Get Pareto request error");
        }
    );


    /* PLOT BUBBLE CHART */
    $scope.paretoChart = {
        type: "BubbleChart",
        data: [],
        options : {
            title: 'Pareto front for Multi-objective optimization',
            hAxis: {title: 'Cost  (EUR / GB)'},
            vAxis: {title: 'Transfer Time (Sec / GB)'},
            bubble: {
                textStyle: {
                    fontSize: 5,
                    color: 'green'
                }
            },
            sizeAxis: {minValue: 5,  maxSize: 17},
            colors: ['purple']
        }
    };

    $scope.pareto = {
        id : null,
        x : 0,
        y : 0
    };

    $scope.paretoChartSelect = function(selectedItem) {
        try {
            if (selectedItem && typeof selectedItem.row != "undefined") {
                console.log("Selected item " + selectedItem.row);
                var row = $scope.objectives[selectedItem.row];
                console.log("Row: " + row);
                $scope.pareto.x = row[0];
                //console.log("pareto x: " + $scope.pareto.x);
                // console.log("Repository ID when selected: ", $scope.repositoryData);
                $scope.pareto.y = row[1];
                //console.log("pareto y: ", $scope.pareto.y);
                // console.log("Repository ID when selected 2: ", $scope.repositoryData);

                $scope.pareto_point = $scope.variables[selectedItem.row][0];

            } else {
                $scope.pareto.x = null;
                $scope.pareto.y = null;
                $scope.pareto_point = null;
            }
        }
        catch(err) {
            console.log(err);
            alert(err);
        }
    };


    $scope.formData = {};

    /* POST REQUEST */
    $scope.submitForm = function() {
        console.log($scope);

        /* ARRAY OF CATEGORIES */
        var category_list = [];
        if($scope.formData.category && $scope.formData.category.length){
            for(var i=0; i<$scope.formData.category.length; i++){
                category_list.push($scope.formData.category[i].tag);
            }
        }

        var file_upload_value = null;
        var image_url_value = null;
        if($scope.tab == 1) {
            file_upload_value = $("#image_upload");
            image_url_value = "";
        }
        if($scope.tab == 2) {
            file_upload_value = null;
            image_url_value = $scope.formData.image_url ? $scope.formData.image_url : "";
        }

        var data = {
            file_upload : file_upload_value,
            image_url:  image_url_value,                                                                                                // "https://entice.lpds.sztaki.hu:5443/api/imagebuilder/build/99b5f56b-75ba-4a02-ad37-52ecfbeb1afa/result/image",
            functional_tests : $("#functional_tests_upload"),                                                           // file upload
            category_list : category_list,                                                                              // tags
            image_description : $scope.formData ? $scope.formData.image_description : null,                             // image description
            image_name : $scope.formData ? $scope.formData.image_name : null,                                           // image name
            pareto_point: $scope.pareto_point,
            avatar_id : $scope.formData.avatar && $scope.formData.avatar.id ? $scope.formData.avatar.id  : null,        // avatar
            user_id : $scope.getUserId(),
            pareto_point_id: $scope.pareto ? $scope.pareto.id : null
        };

        console.log(data);

        for(var k in data) {
            if((data[k] == null || data[k] == "" || typeof data[k] == "undefined") && (k != "file_upload" && k != "image_url")
                || (file_upload_value == null && image_url_value == null)){
                $scope.popUpToastr("info", "Please fill all required fields!");
                return;
            }
        }

        waitingDialog.show();

        iiupload({
            url: post_upload_image,
            method: 'POST',
            data: data
        }).then(
            function (response) {

                console.log(response);
                //$scope.responseCode = response.data.code;
                $scope.responseMessage = response.data.message;

                console.log("** Code: " + $scope.responseCode + " \n** RepositoryID: " + $scope.responseMessage);

                waitingDialog.hide();

                if(response.data.code == 200) {
                    $scope.popUpToastr("success", "Upload successful");
                    $timeout(function() {
                        $state.go($state.current, {}, {reload: false});
                    }, 3000);

                } else {
                    $scope.popUpToastr("error", "Upload failed: " + response.data.message);
                }
            },
            function (response) {
                console.log(response);
                error_response = response.data;

                waitingDialog.hide();
                $scope.popUpToastr("error", "Upload failed" + JSON.stringify(error_response));
            }
        );
    };

    /* TEXT FOR TOOLTIPS */
    $scope.tooltipsUploadImage = {
        "imageName": "Name your software.",
        "imageUpload": "Upload image via local storage or provide an URL path to your disk image",
        "tagSoftware": "Tag your software. You can choose multiple tags. Based on this tags, a sorting and filtering options will consider them.",
        "imageDescription" : "Describe your VMI.",
        "functionalTests": "Functional tests are needed further on when optimising a VMI.",
        "avatar": "Select an appropriate logo / avatar for your image from the list. If none of them suits for your software, choose the default image.",
        "paretoPoint": "Choose a pareto point from the graph, that represents a correlation between the cost and performance."
    };


   /* NOTIFICATIONS */
    $scope.popUpToastr = function(type, msg) {
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
        'size':'small',
        'speed': 'medium',
        'tooltipTemplateUrlCache': true,
        'side' : 'top'
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