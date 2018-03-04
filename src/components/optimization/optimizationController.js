app.controller('optimizationController', function ($scope, $interval, $stateParams, $http, growl) {

    var get_image_url = SERVICES_URL + "gui/get_entice_detailed_images";
    var optimize_url = SERVICES_URL + "sztaki/execute_optimizer";

    var get_optimization_list = SERVICES_URL + "sztaki/get_optimization_refreshed_list?force_refresh=";

    var imageId = $stateParams.imageId;

    $scope.imageId = imageId;
    $scope.imageData = {};

    // Default values
    $scope.data = {
        ImageFormat: "qcow2",
        FsType: "ext4",
        CloudInterface: "ec2",
        CloudEndpointURL: "https://opennebula.lpds.sztaki.hu:4567",
        cloudAccessKey: "entice_demo",
        imageUserName: "root",
        CloudOptimizerVMInstanceType: "t2.medium",
        CloudWorkerVMInstanceType: "t2.medium",
        maxIterationsNum: 1,
        numberOfParallelWorkerVMs: 5,
        fsPartition: "1",
        imageURL: $stateParams.imageURL,
        validatorScriptURL: $stateParams.functionalTests,
        ovfURL: $stateParams.ovfurl
    };

    // LATEST DOCUMENTATION:
    // https://docs.google.com/document/d/1cw2hx_QgwkxAg9J8vfDUPSrUwIwpjsQDod4NzPbrINM/edit

    $scope.optimization = [];
    $scope.active = 0;

    var refreshOptimizationData = function (forceRefresh) {
        $http.get(get_optimization_list + forceRefresh).then(
            function (success) {
                $scope.optimization = success.data;
            },
            function (failure) {
                //alert("Get Pareto request error");
                console.log("Get Pareto request error");
            }
        );
    };


    $scope.tabSelected = function (selectedIndex) {
        $scope.active = selectedIndex;
        console.log("selected tab " + $scope.active);
        if ($scope.active == 1)
            refreshOptimizationData(true);
    };

    var interval_function = function () {
        // refresh only if tab index 1 is active:
        if ($scope.active == 1) {
            refreshOptimizationData(false);
        }
    };

    interval_function();

    /* GET REQUEST */
    $scope.intervals.push($interval(function () {
        interval_function();
    }, 20000));

    $scope.optimizeSubmit = function () {
        var data = {
            // Source image
            imageURL: $scope.data.imageURL,
            imageFormat: $scope.data.ImageFormat,
            ovfURL: $scope.data.ovfURL,
            validatorScriptURL: $scope.data.validatorScriptURL,
            validatorServerURL: $scope.data.validatorServerURL,
            validatorScript: $scope.data.validatorScript,
            fsPartition: $scope.data.fsPartition,
            fsType: $scope.data.FsType,

            // Optimisation resource
            cloudInterface: $scope.data.CloudInterface,
            cloudEndpointURL: $scope.data.CloudEndpointURL,
            cloudAccessKey: $scope.data.cloudAccessKey,
            cloudSecretKey: $scope.data.cloudSecretKey,
            imageId: $scope.data.imageId,
            kbImageId : imageId,
            imageKeyPair: $scope.data.imageKeyPair,
            imageUserName: $scope.data.imageUserName,
            imagePrivateKey: $scope.data.imagePrivateKey,
            imageContextualizationURL: $scope.data.imageContextualizationURL,
            imageContextualization: $scope.data.imageContextualization,
            cloudOptimizerVMInstanceType: $scope.data.CloudOptimizerVMInstanceType,
            cloudWorkerVMInstanceType: $scope.data.CloudWorkerVMInstanceType,

            // Optimisation goals and limits
            maxIterationsNum: $scope.data.maxIterationsNum,
            numberOfParallelWorkerVMs: $scope.data.numberOfParallelWorkerVMs,
            maxRunningTime: $scope.data.maxRunningTime,
            maxNumberOfVMs: $scope.data.maxNumberOfVMs,
            aimedSize: $scope.data.aimedSize,
            aimedReductionRatio: $scope.data.aimedReductionRatio,
            freeDiskSpace: $scope.data.freeDiskSpace
        }

        console.log(data);
        waitingDialog.show();

        try {
            $http.post(optimize_url, data).then(
                function (success) {
                    waitingDialog.hide();

                    if (success.data.error)
                        $scope.popUpToastr("error", "Upload failed: " + success.data.error);
                    else {
                        $scope.active = 1;
                        refreshOptimizationData(true);
                        $scope.popUpToastr("success", "Optimization successfully started");
                    }


                },
                function (error) {
                    waitingDialog.hide();
                    $scope.popUpToastr("error", "Upload failed: " + JSON.stringify(error));
                    console.log("Optimisation error");
                }
            );
        }
        catch (err) {
            waitingDialog.hide();
            alert(err);
        }
    };

    $scope.chart2 = {
        type: "ColumnChart",
        displayed: true,
        data: [
            ["Date", "Linear", {
                'type': 'string',
                'role': 'style'
            }]
        ],
        options: {
            chartArea: {'width': '80%', 'height': '80%'},
            legend: 'none',
            pointSize: 3,
            series: {
                0: {curveType: 'function', lineWidth: 2, color: "#00b3ee"}
            },
            vAxes: {
                0: {}
            },
            hAxis: {
                ticks: [],
                gridlines: {
                    color: '#333333',
                    count: 1
                },
                baselineColor: '#7A7A7A',
                textStyle: {color: '#7A7A7A', fontSize: 12}
            },
            vAxis : {
                minValue : 0
            },
            // vAxis: {
            //     textPosition: 'none',
            //     gridlines: {
            //         color: 'transparent'
            //     },
            //     baselineColor: '#7A7A7A',
            //     textStyle: {color: '#7A7A7A', fontSize: 12}
            // },
            backgroundColor: "transparent",
            bar: {groupWidth: "20%"}
            //width: 600
        }
    };

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

    $scope.ifShowChart = false;
    $scope.showChart = function (op) {

        $scope.chart2.options.hAxis.ticks = [];
        $scope.chart2.data = [
            ["Date", "Linear", {
                'type': 'string',
                'role': 'style'
            }]
        ];

        $scope.chart2.options.hAxis.ticks.push(0);
        $scope.chart2.options.hAxis.ticks.push(1);

        $scope.chart2.data.push(['Original Image Size', op.originalImageSize, '']);
        $scope.chart2.data.push(['Optimized Image Size', op.optimizedImageSize, '']);

        $scope.ifShowChart = true;
    };


    $scope.formatSizeUnitsOptimisation = function (bytes) {
        if (bytes >= 1073741824) {
            bytes = (bytes / 1073741824).toFixed(2) + ' GB';
        }
        else if (bytes >= 1048576) {
            bytes = (bytes / 1048576).toFixed(2) + ' MB';
        }
        else if (bytes >= 1024) {
            bytes = (bytes / 1024).toFixed(2) + ' KB';
        }
        else if (bytes > 1) {
            bytes = bytes + ' bytes';
        }
        else if (bytes == 1) {
            bytes = bytes + ' byte';
        }
        else {
            bytes = '-';
        }
        return bytes;
    };


    $scope.convertMillisecondsToDigitalClock = function (timestamp) {
        var time = timestamp + 3600000 * 2;
        var date = new Date(time).toUTCString();
        // console.log(date);
        return date
    };


    /*


     if(imageId) {
     $http.get(get_image_url + "?id=" + imageId).then(
     function(success) {
     $scope.imageData = success.data;
     $scope.data.imageName = $scope.imageData.imageName;
     $scope.data.imageId = $scope.imageData.id;

     for(var k in $scope.data){
     if(k != "imageName" && k != "imageId"){
     $scope.data[k] = "";
     }
     }
     //console.log($scope.imageData);
     },
     function(error) {
     alert("An error occured!");
     }
     );
     }

     $scope.maxInputsChart1 = 22;
     $scope.maxInputsChart2 = 22;

     $scope.chart1 = {
     type: "LineChart",
     displayed: true,
     data: [
     ["Date", "Linear", {
     'type': 'string',
     'role': 'style'
     }]
     ],
     options: {
     chartArea: {'width': '95%', 'height': '75%'},
     legend: 'none',
     pointSize: 1,
     series: {
     0: {curveType: 'function', lineWidth: 2, color: "#20B2AA"}
     },
     vAxes: {
     0: {}
     },
     hAxis: {
     ticks: [],
     gridlines: {
     color: '#333333',
     count: $scope.maxInputsChart1 - 1
     },
     baselineColor: '#7A7A7A',
     textStyle: {color: '#7A7A7A', fontSize:9}
     },
     vAxis: {
     gridlines: {
     color: 'transparent'
     },
     baselineColor: '#7A7A7A',
     textStyle: {color: '#7A7A7A', fontSize:9}
     },
     backgroundColor: "transparent"
     }
     };



     $scope.setChart1 = function() {
     $scope.chart1.options.hAxis.ticks = [];
     $scope.chart1.data = [
     ["Date", "Linear", {
     'type': 'string',
     'role': 'style'
     }]
     ];
     for(var c=0; c<$scope.maxInputsChart1; c++){
     $scope.chart1.options.hAxis.ticks.push(c);
     var value = parseFloat(Math.floor((Math.random() * 10.9999) + 1.9999));
     $scope.chart1.data.push([c, value, '']);
     }
     };

     $scope.setChart2 = function() {
     $scope.chart2.options.hAxis.ticks = [];
     $scope.chart2.data = [
     ["Date", "Linear", {
     'type': 'string',
     'role': 'style'
     }]
     ];
     for(var c=0; c<$scope.maxInputsChart2; c++){
     $scope.chart2.options.hAxis.ticks.push(c);
     var value = parseFloat(Math.floor((Math.random() * 10.9999) + 1.9999));
     $scope.chart2.data.push([c, value, '']);
     }
     };

     $scope.setChart1();
     $scope.setChart2();

     $scope.chartShown = false;

     $scope.showChart = function(){
     $scope.chartShown = true;
     };
     */


    /* TEXT FOR TOOLTIPS */
    $scope.tooltipsOptimisation = {
        "imageId": "Image ID is the ID within the cloud repository.",
        "imageURL": "HTTP URL from where the source image file can be downloaded by the optimizer.",
        "alternativeImageURL": "Alternative HTTP URL from where the source image file can be downloaded by the optimizer.",
        "templateURL": "The template of the VMI in OVF (Open Virtual machine format.)",
        "cloudOptimizerVMInstanceType": "Clound Optimizer VM Instance Type.",
        "cloudEndpointURL": "Clound endpoint where the optimizet VMI will be stored.",
        "imageUserName": "Login name used by the optimizer at opening SSH session, which must have root or sudo rights (defaults to root).",
        "imageKeyPair": "Key pair name used to contextualize the VM started from source image. No key pair contextualization will be done if empty.",
        "imagePrivateKey": "Private key used to open SSH session to source image VM (private key part of the key pair if provided).",
        "imageContextualization": "Contextualization configuration description (cloud-config) to be used to contextualize the VM.",
        "fsType": "File system type if differes from default (ext2-4)",
        "imageFormat": "Image file format if differs from default qcow2.",
        "validatorScriptURL": "HTTP URL from where the validation script can be downloaded by the optimizer.",
        "alternativeValidatorScriptURL": "Alternative HTTP URL from where the validation script can be downloaded by the optimizer.",
        "validatorServerURL": "HTTP URL of the validator server API endpoint.",
        "cloudLocation": "Select the cloud where to perform optimization.",
        "cloudAccessKey": "Cloud credentials",
        "cloudSecretKey": "Cloud credentials",
        "fsPartition": "The partition of the image containing the root file system. Either provide a number (“0”, “1”, …) indicating a physical partition or give two strings “volume-group-name volume-name” in the case of LVM.",
        "workerVMInstanceType": "Instance type of the VMs started from the source image.",
        "numberOfParallelWorkerVMs": "The maximum number of VMs used simultaneously during optimization.",
        "maxIterationsNum": "The number of optimization iterations. The more iterations result in the less optimized image.",
        "freeDiskSpace": "The size of demanded free disk space in the optimized image. The default value 0 preserves original free disk space.",
        "aimedReductionRatio": "Stop optimization when the ratio of the original and the optimized image size reaches this value.",
        "aimedSize": "Stop optimization when the size of the optimized image size reaches this value. ",
        "XmaxRunningTime": "The maximum duration of optimization in seconds. Note that actual execution time may slightly exceed this limit, as it is check after each iteration.",
        "XmaxNumberOfVMs": "The maximum number of VMs used during the optimization (default: empty unlimited).",
        "cloudWorkerVMInstanceType": "Worker VM instance type. It can be m1.small, m1.medium or m1.large."
    };
});