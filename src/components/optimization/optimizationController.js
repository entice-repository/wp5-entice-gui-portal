/*
 * =================================================================================
 * This file is part of: ENTICE Image Portal (Graphical User Interface)
 * Release version: 0.2
 * =================================================================================
 * Developer: Polona Štefanič, University of Ljubljana, Slovenia
 *
 * The project leading to this application has received funding
 * from the European Union's Horizon 2020 research and innovation
 * programme under grant agreement No 644179.
 *
 * Copyright 2016
 * Contact: Vlado Stankovski (vlado.stankovski@fgg.uni-lj.si),
 Polona Štefanič (polona.stefanic@fgg.uni-lj.si)
 * =================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you must not use this file except in compliance with the License.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * For details see the terms of the License (see attached file: README).
 * The License is also available at http://www.apache.org/licenses/LICENSE-2.0.txt.
 * ================================================================================
 */


app.controller('optimizationController', function($scope, $interval, $stateParams, $http) {

    var get_image_url = SERVICES_URL + "gui/get_entice_detailed_images";
    var optimize_url = SERVICES_URL + "sztaki/execute_optimizer";

    var get_optimization_list = SERVICES_URL + "sztaki/get_optimization_refreshed_list";

    var imageId = $stateParams.imageId;

    $scope.imageId = imageId;
    $scope.imageData = {};
    $scope.data = {
        imageId: "f037a515-dd50-412e-9624-17512399e270",
        imageURL: "url",
        validatorScriptURL: "url",
        imageUserName: "<username>",
        fsPartition: "vg0 root",
        imageKeyPair: "<username>",
        imagePrivateKey: "<private_key>",
        cloudAccessKey: "<username>",
        cloudSecretKey: "<private_key>",
        cloudWorkerVMInstanceType: "m1.small",
        freeDiskSpace: 100,
        numberOfParallelWorkerVMs: 8,
        maxIterationsNum: 1
        //XmaxNumberOfVMs: 8,
        //XaimedReductionRatio: 1,
        //XaimedSize: 1073741824,
        //XmaxRunningTime: 36000
    };

    $scope.optimization = [];
    $scope.active = 0;

    var interval_function = function(){
        $http.get(get_optimization_list).then(
            function(success) {
                $scope.optimization = success.data;
            },
            function(failure) {
                //alert("Get Pareto request error");
                console.log("Get Pareto request error");
            }
        );
    };

    interval_function();

    /* GET REQUEST */
    $scope.intervals.push($interval(function(){
        interval_function();
    }, 20000));


    $scope.optimizeSubmit = function() {
        delete $scope.data.imageName;

        waitingDialog.show();

        $http.post(optimize_url, $scope.data).then(
            function(success) {
                console.log(success);
                $scope.active = 1;
                waitingDialog.hide();
            },
            function(error) {
                alert("Optimisation error");
                console.log("Optimisation error");
                waitingDialog.hide();
            }
        );
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
                textStyle: {color: '#7A7A7A', fontSize:12}
            },
            vAxis: {
                textPosition: 'none',
                gridlines: {
                    color: 'transparent'
                },
                baselineColor: '#7A7A7A',
                textStyle: {color: '#7A7A7A', fontSize:12}
            },
            backgroundColor: "transparent",
            bar: {groupWidth: "20%"}
            //width: 600
        }
    };

    $scope.ifShowChart = false;
    $scope.showChart = function(op) {

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


    $scope.formatSizeUnitsOptimisation = function(bytes) {
        if      (bytes>=1073741824) { bytes = (bytes/1073741824).toFixed(2) +' GB'; }
        else if (bytes>=1048576)    { bytes = (bytes/1048576).toFixed(2) +' MB'; }
        else if (bytes>=1024)       { bytes = (bytes/1024).toFixed(2) +' KB'; }
        else if (bytes>1)           { bytes = bytes + ' bytes'; }
        else if (bytes==1)          { bytes = bytes + ' byte'; }
        else                        { bytes = '-'; }
        return bytes;
    };


    $scope.convertMillisecondsToDigitalClock = function(timestamp) {
        var time = timestamp + 3600000*2;
        var date = new Date(time).toUTCString();
        console.log(date);
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
        "imageId" : "The UUID of the image in the KB",
        "imageURL" : "HTTP URL from where the source image file can be downloaded by the optimizer.",
        "imageUserName": "Login name used by the optimizer at opening SSH session, which must have root or sudo rights (defaults to root).",
        "imageKeyPair": "Key pair name used to contextualize the VM started from source image. No key pair contextualization will be done if empty.",
        "imagePrivateKey": "Private key used to open SSH session to source image VM (private key part of the key pair if provided).",
        "validatorScriptURL": "HTTP URL from where the validation script can be downloaded by the optimizer.",
        "cloudLocation": "Select the cloud where to perform optimization.",
        "cloudAccessKey": "Cloud credentials",
        "cloudSecretKey": "Cloud credentials",
        "fsPartition": "The partition of the image containing the root file system. Either provide a number (“0”, “1”, …) indicating a physical partition or give two strings “volume-group-name volume-name” in the case of LVM. Defaults to partition 0 (no LVM).",
        "workerVMInstanceType":"Instance type of the VMs started from the source image.",
        "numberOfParallelWorkerVMs": "The maximum number of VMs used simultaneously during optimization.",
        "maxIterationsNum": "The number of optimization iterations. The more iterations result in the less optimized image.",
        "freeDiskSpace": "The size of demanded free disk space in the optimized image. The default value 0 preserves original free disk space.",
        "XaimedReductionRatio": "TODO?",
        "XaimedSize": "TODO?",
        "XmaxRunningTime": "The maximum duration of optimization in seconds. Note that actual execution time may slightly exceed this limit, as it is check after each iteration.",
        "XmaxNumberOfVMs": "The maximum number of VMs used during the optimization (default: empty unlimited)."
    };
});