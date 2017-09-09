
app.controller('optimizationController', function($scope, $interval, $stateParams, $http) {

    var get_image_url = SERVICES_URL + "gui/get_entice_detailed_images";
    var optimize_url = SERVICES_URL + "sztaki/execute_optimizer";

    var get_optimization_list = SERVICES_URL + "sztaki/get_optimization_refreshed_list";

    var imageId = $stateParams.imageId;

    $scope.imageId = imageId;
    $scope.imageData = {};
    $scope.data = {
        imageId: "f037a515-dd50-412e-9624-17512399e270",
        imageURL: "https://entice.lpds.sztaki.hu:5443/api/imagebuilder/build/cd9a6f13-fb31-4329-a00b-5aeae870c53d/result/image",
        validatorScriptURL: "https://s3.lpds.sztaki.hu/atisu/entice/wp3/optimize/wordpress-centos7.0-20160627b.sh",
        imageUserName: "root",
        fsPartition: "vg0 root",
        imageKeyPair: "ahajnal_keypair",
        imagePrivateKey: "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQ0KTUlJRXBBSUJBQUtDQVFFQXpzY0xpcmpGNUlibEgwNWljUVFZa2VWRzdCeWFWcVhuVXZQSDcwOHV2OHV0Rk1nOA0KcTNmZ09xa2YvUkgvMUIwSHZjZkdEa2x6NkhRVksrWGgwN1J1Ykh6M0x2by9SMm5MVmI3YlJnY3oxYjEwR1I3Nw0KdWJGTEZ6Y3hsUFpKR3Z4OUxsYVd5UTUwL2VlU3R5VHQ3bGV3UWJacWtRZ0R4b2pYMm1iS3VrOGRscXRYeDZhZw0KU01hK2pUOGtXZWp4dnlGNDJqWVRNSk9DZ0FjYWxrdnpqYnNpRUxrWE5Xb0pvd3JQM1V3YUR1OHRFaW91UTY0dw0Kc2pJQnBSNmp5eHlqZW9uRVJGeU9mL2M3WkMvaW9nOU50cWRmcUo4YXVKLzRMYm8xYUpiemw1dkJCeTBnZ3BzVA0KejM3eGQzTWp5UEtNZm1SQXEvOEQ1TkJ4SUtodGZYU0FMZEIrTFFJREFRQUJBb0lCQUdEcWdDbGowelQ2V05law0KaUpWS0F5NFdsWGhESzcrakFOb3JjckZpbnBtOG9BSVduQUVPTGFXdzhWSlBKbVpIdVFJbGFWbjI2WUd4THQ4bA0KWHdRNEZHMTY0T3crMUh2blJTdUtTZ0gzakQ4SkRpcGNFRVlIcUJkWWdqKzhjNlZYWkdEY3FzM1BuZHdIdHdkcQ0KSXE3TW9Nc2I4YlRLV2VLcTd1anB0dWs5L2JOSkFYTThhN3ptaFNPMWNRTkZFeWxqRStLWjFyNTRkS0lVcUlLZg0KOTh2cFFvbmhDMHA4OExOVFBNMkthdk5uK1Y3Y3ArcnlNNHVRUnhkUjc5YVFaaGFuWXQxWllTQWYrRjN2bHppTg0KVUI2OXpSNGhhbzZEUUtWeE1yVWZxU1N5cHRPcW8vN1hXTlVYM1F5R3VsZ24wTHhORjdv dnI3aEtZQlpuZ0pQdg0KeERIWEt5MENnWUVBK2NhaG83MHErYlJBTzl3RHZPeHFuSHlFV2ZGQ2ZITk5lcmJaQ3MveVRHNmFNZGo5dVd0SA0KNnNmR2ltMGcwUWtoT1M1V0ZOV1ZYWVBkeDVaMk4yMTlhQ3hLdUlUd1pvdWx6WlREZW1hdkIzUXU5OE9aZi9TTA0KRU9HMS81d2xlY0JHK2dBRnVvMGNZRVlrZWFvby9EZXU2ejFuYmRXWHMzNGhjU21Kb1JQdlBtTUNnWUVBMCs0ZQ0KWTZMVlpqUUNFOVR0bUdFRWt3Ky9UQXorUmVTa3pRWmZxWDZZTTNVOGg5OVp3bzFBNWRQaFVPQ2M0ODdwbE1UYQ0KRys0dWhtRmVJd0FFbWRBMm9FK3NUaW5CWlVMQUJ5SDZJd2xRV0pKMW5WeUE3aVZSSElYK0F4S0tmaUV4QXJQYw0KUC82dVVzaUQvTXZGQTVoR3JEUnUyWUlHRXdkRCtyRE9sN2JNN2k4Q2dZRUF0bTJHL1VwYXF3b2xxQktuZ0VMRQ0KRXdzMnQySm9odkRIOUFxOE54TnVDcmoxVWRjRWFYcWJpalRqSTVOVTFwZnVkZzhMdkNmSzhnUXY1V2hWYTJKQw0KcCtWQnBjY2l0aUxrdEdRazZhODV3eDN1ZC9PYWwwUUtsZ2ZrbjQ1eUtKeHd1b050cTdVSXRxQkVYOEFTTXpTUQ0KUXl3VDhMcUNGQXpaYkFkRWlDdEJIN1VDZ1lFQXdYcDNaZkVIcjRtMWg5TnhvaGFZYllZSDErOVl5QWhJYUNEMA0KZnJIalU3OHBKc1pDbFBvT0VJUVNCSnM2d0VOclBmVkZSaEI1aXhjak1RTFlNSEJGSHEvK0YxSEpqSitXM2l3bg0KeDRxK1BrNWZiKzAraTZ1bjFFbURyOXhpY1dudDY1QzJkL29UdmVIdmxYK1dlb1N2cUpFcHpnc0ZicVBJYlBxeg0KY1JCaklPTU NnWUJBTnZoQWppb25Ya0l1NjYzUFZsekFKQ0REcTZ1empDKzlSTkpFdEhxbkZYd1B6RHRXV3NZSQ0KeDVNSW9hWjZOZ1dSSVZJek9mc3UzMU9QdVdqZ2lHTFJQY3ZBNi80UjJmWm5sc0tvbitHRXFmajlTQ0tLOUJGZg0KYVEra0xoOHVpbUVtYlBkcVFtVWtjYkl6QmdjMnVlY1pjNWlyVGJuS1RVVjdWTkhqQzViaEhRPT0NCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0t",
        cloudAccessKey: "ahajnal@sztaki.hu",                                           // "uros.pascinski@partners.sztaki.hu",
        cloudSecretKey: "60a9dbcd3e11ddbf17c31c3155f472ba6945b5f8",                    // "e8cc564a5e9320d6c22647c5e6dab55005bf1e68",
        cloudWorkerVMInstanceType: "m1.small",
        freeDiskSpace: 100,
        numberOfParallelWorkerVMs: 8,
        maxIterationsNum: 5
        //XmaxNumberOfVMs: 8,
        //XaimedReductionRatio: 1,
        //XaimedSize: 1073741824,
        //XmaxRunningTime: 36000



    /*
    imageURL : "https://images.s3.lpds.sztaki.hu/wordpress-centos7.0-20160627a.qcow2",
    imageUserName : "root",
    fsPartition: "vg0 root",
    imageKeyPair: "ahajnal_keypair",
    imagePrivateKey : "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQ0KTUlJRXBBSUJBQUtDQVFFQXpzY0xpcmpGNUlibEgwNWljUVFZa2VWRzdCeWFWcVhuVXZQSDcwOHV2OHV0Rk1nOA0KcTNmZ09xa2YvUkgvMUIwSHZjZkdEa2x6NkhRVksrWGgwN1J1Ykh6M0x2by9SMm5MVmI3YlJnY3oxYjEwR1I3Nw0KdWJGTEZ6Y3hsUFpKR3Z4OUxsYVd5UTUwL2VlU3R5VHQ3bGV3UWJacWtRZ0R4b2pYMm1iS3VrOGRscXRYeDZhZw0KU01hK2pUOGtXZWp4dnlGNDJqWVRNSk9DZ0FjYWxrdnpqYnNpRUxrWE5Xb0pvd3JQM1V3YUR1OHRFaW91UTY0dw0Kc2pJQnBSNmp5eHlqZW9uRVJGeU9mL2M3WkMvaW9nOU50cWRmcUo4YXVKLzRMYm8xYUpiemw1dkJCeTBnZ3BzVA0KejM3eGQzTWp5UEtNZm1SQXEvOEQ1TkJ4SUtodGZYU0FMZEIrTFFJREFRQUJBb0lCQUdEcWdDbGowelQ2V05law0KaUpWS0F5NFdsWGhESzcrakFOb3JjckZpbnBtOG9BSVduQUVPTGFXdzhWSlBKbVpIdVFJbGFWbjI2WUd4THQ4bA0KWHdRNEZHMTY0T3crMUh2blJTdUtTZ0gzakQ4SkRpcGNFRVlIcUJkWWdqKzhjNlZYWkdEY3FzM1BuZHdIdHdkcQ0KSXE3TW9Nc2I4YlRLV2VLcTd1anB0dWs5L2JOSkFYTThhN3ptaFNPMWNRTkZFeWxqRStLWjFyNTRkS0lVcUlLZg0KOTh2cFFvbmhDMHA4OExOVFBNMkthdk5uK1Y3Y3ArcnlNNHVRUnhkUjc5YVFaaGFuWXQxWllTQWYrRjN2bHppTg0KVUI2OXpSNGhhbzZEUUtWeE1yVWZxU1N5cHRPcW8vN1hXTlVYM1F5R3VsZ24wTHhORjdvdnI3aEtZQlpuZ0pQdg0KeERIWEt5MENnWUVBK2NhaG83MHErYlJBTzl3RHZPeHFuSHlFV2ZGQ2ZITk5lcmJaQ3MveVRHNmFNZGo5dVd0SA0KNnNmR2ltMGcwUWtoT1M1V0ZOV1ZYWVBkeDVaMk4yMTlhQ3hLdUlUd1pvdWx6WlREZW1hdkIzUXU5OE9aZi9TTA0KRU9HMS81d2xlY0JHK2dBRnVvMGNZRVlrZWFvby9EZXU2ejFuYmRXWHMzNGhjU21Kb1JQdlBtTUNnWUVBMCs0ZQ0KWTZMVlpqUUNFOVR0bUdFRWt3Ky9UQXorUmVTa3pRWmZxWDZZTTNVOGg5OVp3bzFBNWRQaFVPQ2M0ODdwbE1UYQ0KRys0dWhtRmVJd0FFbWRBMm9FK3NUaW5CWlVMQUJ5SDZJd2xRV0pKMW5WeUE3aVZSSElYK0F4S0tmaUV4QXJQYw0KUC82dVVzaUQvTXZGQTVoR3JEUnUyWUlHRXdkRCtyRE9sN2JNN2k4Q2dZRUF0bTJHL1VwYXF3b2xxQktuZ0VMRQ0KRXdzMnQySm9odkRIOUFxOE54TnVDcmoxVWRjRWFYcWJpalRqSTVOVTFwZnVkZzhMdkNmSzhnUXY1V2hWYTJKQw0KcCtWQnBjY2l0aUxrdEdRazZhODV3eDN1ZC9PYWwwUUtsZ2ZrbjQ1eUtKeHd1b050cTdVSXRxQkVYOEFTTXpTUQ0KUXl3VDhMcUNGQXpaYkFkRWlDdEJIN1VDZ1lFQXdYcDNaZkVIcjRtMWg5TnhvaGFZYllZSDErOVl5QWhJYUNEMA0KZnJIalU3OHBKc1pDbFBvT0VJUVNCSnM2d0VOclBmVkZSaEI1aXhjak1RTFlNSEJGSHEvK0YxSEpqSitXM2l3bg0KeDRxK1BrNWZiKzAraTZ1bjFFbURyOXhpY1dudDY1QzJkL29UdmVIdmxYK1dlb1N2cUpFcHpnc0ZicVBJYlBxeg0KY1JCaklPTUNnWUJBTnZoQWppb25Ya0l1NjYzUFZsekFKQ0REcTZ1empDKzlSTkpFdEhxbkZYd1B6RHRXV3NZSQ0KeDVNSW9hWjZOZ1dSSVZJek9mc3UzMU9QdVdqZ2lHTFJQY3ZBNi80UjJmWm5sc0tvbitHRXFmajlTQ0tLOUJGZg0KYVEra0xoOHVpbUVtYlBkcVFtVWtjYkl6QmdjMnVlY1pjNWlyVGJuS1RVVjdWTkhqQzViaEhRPT0NCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0t",
    cloudEndpointURL : "http://cfe2.lpds.sztaki.hu:4567",
    cloudAccessKey: "uros.pascinski@partners.sztaki.hu",
    cloudSecretKey: "e8cc564a5e9320d6c22647c5e6dab55005bf1e68",
    cloudOptimizerVMInstanceType: "m1.medium",
    freeDiskSpace : 100,
    validatorScriptURL: "https://images.s3.lpds.sztaki.hu/wordpress-centos7.0-20160627a.sh",
    numberOfParallelWorkerVMs: 8,
    maxIterationsNum: 1,
    // hardcoded
    "XmaxNumberOfVMs": 8,
    "XaimedReductionRatio": 0.8,
    "XaimedSize": 1073741824,
    "XmaxRunningTime": 36000,
    "s3EndpointURL": "https://s3.lpds.sztaki.hu",
    "s3AccessKey": "WAU8PTCX8NSIL0RSG8K9",
    "s3SecretKey": "R16UWaOBfz44nvoGmCGXykHNjlKCVzpWc65KjiF6",
    "s3Path": "images/optimized-image.qcow2"
    */


        /*
         - ImageId (Int) REQ !! interni id za ENTICE, ne id, kot ga zahteva SZTAKI
         - ImageLoginName (String) REQ
         - ImageKeyPair (String) REQ
         - ImagePrivateKey (String) REQ
         - ValidatorScript (String) REQ
         - CloudLocation (Sting) REQ
         - CloudAccessKey (String) REQ
         - CloudSecretKey (String) REQ
         - FSPartition (String) OPT
         - WorkerVMInstanceType (String) REQ
         - MaxNumberOfIteration (String) REQ
         - FreeDiskSpace (Int) OPT.
         - Aimed Reduction Ratio (Float) OPT.
         - Aimed Size (UInt) OPT.
         - MaxRunningTime (Float) OPT.
         - MaxNumberOfVMIs (UInt) OPT.

        * */
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
        "templateURL" : "The template of the VMI in OVF (Open Virtual machine format.)",
        "imageUserName": "Login name used by the optimizer at opening SSH session, which must have root or sudo rights (defaults to root).",
        "imageKeyPair": "Key pair name used to contextualize the VM started from source image. No key pair contextualization will be done if empty.",
        "imagePrivateKey": "Private key used to open SSH session to source image VM (private key part of the key pair if provided).",
        "imageContextualization": "Contextualization configuration description (cloud-config) to be used to contextualize the VM.",
        "fsType": "File system type if differes from default (ext2-4)",
        "imageFormat": "Image file format if differs from default qcow2.",
        "validatorScriptURL": "HTTP URL from where the validation script can be downloaded by the optimizer.",
        "validatorServerURL": "HTTP URL of the validator server API endpoint.",
        "cloudLocation": "Select the cloud where to perform optimization.",
        "cloudAccessKey": "Cloud credentials",
        "cloudSecretKey": "Cloud credentials",
        "fsPartition": "The partition of the image containing the root file system. Either provide a number (“0”, “1”, …) indicating a physical partition or give two strings “volume-group-name volume-name” in the case of LVM. Defaults to partition 0 (no LVM).",
        "workerVMInstanceType":"Instance type of the VMs started from the source image.",
        "numberOfParallelWorkerVMs": "The maximum number of VMs used simultaneously during optimization.",
        "maxIterationsNum": "The number of optimization iterations. The more iterations result in the less optimized image.",
        "freeDiskSpace": "The size of demanded free disk space in the optimized image. The default value 0 preserves original free disk space.",
        "XaimedReductionRatio": "Stop optimization when the ratio of the original and the optimized image size reaches this value.",
        "XaimedSize": "Stop optimization when the size of the optimized image size reaches this value. ",
        "XmaxRunningTime": "The maximum duration of optimization in seconds. Note that actual execution time may slightly exceed this limit, as it is check after each iteration.",
        "XmaxNumberOfVMs": "The maximum number of VMs used during the optimization (default: empty unlimited)."
    };
});