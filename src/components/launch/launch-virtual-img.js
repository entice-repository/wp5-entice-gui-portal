app.controller('launchController', function ($scope, $interval, $stateParams, $http, growl) {

    // var get_image_url = SERVICES_URL + "gui/get_entice_detailed_images";
    var launch_url = SERVICES_URL + "sztaki/launch_virtual_image";

    // var get_optimization_list = SERVICES_URL + "sztaki/get_optimization_refreshed_list?force_refresh=";
    var imageId = $stateParams.imageId;

    // $scope.imageId = imageId;
    $scope.imageData = {};

    // Default values
    $scope.data = {
        endpoint: "",
        accessKey: "",
        secretKey: "",
        virtualImageId: imageId,
        instanceType: "m1.medium",
        contextualization: "",
        cloud: "",
        cloudInterface: "",
        cloudImageId: "",
        CloudEndpointURL : "sztaki",
        CloudInterface : "ec2",
        accessKey : "entice_demo",
        instanceType : "t2.medium",
        endpoint : "https://opennebula.lpds.sztaki.hu:4567"
    }

    $scope.optimization = [];
    $scope.active = 0;

    //todo:
    var refreshOptimizationData = function (forceRefresh) {
        // $http.get(get_optimization_list + forceRefresh).then(
        //     function (success) {
        //         $scope.optimization = success.data;
        //     },
        //     function (failure) {
        //         //alert("Get Pareto request error");
        //         console.log("Get Pareto request error");
        //     }
        // );
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

    $scope.launchVirtualImage = function () {
        var data = {
            endpoint: $scope.data.endpoint,
            accessKey: $scope.data.accessKey,
            secretKey: $scope.data.secretKey,
            virtualImageId: $scope.data.virtualImageId,
            instanceType: $scope.data.instanceType,
            contextualization: $scope.data.contextualization,
            cloud: $scope.data.CloudEndpointURL,
            cloudInterface: $scope.data.CloudInterface,
            cloudImageId: $scope.data.cloudImageId,
            keypair: $scope.data.keypair
        }
        console.log(JSON.stringify(data));
        // console.log(data);

        waitingDialog.show();

        try {
            $http.post(launch_url, data).then(
                function (success) {
                    waitingDialog.hide();

                    if (success.data.message) {
                        // $scope.active = 1;
                        // refreshOptimizationData(true);
                        $scope.popUpToastr("success", "Successful Virtual Image launch: " + success.data.message);
                    }
                    else if (success.data.error)
                        $scope.popUpToastr("error", "Virtual Image launch failed: " + success.data.error);
                },
                function (error) {
                    waitingDialog.hide();
                    $scope.popUpToastr("error", "Virtual Image launch failed: " + JSON.stringify(error));
                }
            );
        }
        catch (err) {
            waitingDialog.hide();
            alert(err);
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

    $scope.convertMillisecondsToDigitalClock = function (timestamp) {
        var time = timestamp + 3600000 * 2;
        var date = new Date(time).toUTCString();
        return date
    };

    /* TEXT FOR TOOLTIPS - TODO: update */
    $scope.tooltipsOptimisation = {
        "imageId": "Image ID is the ID within the cloud repository.",
        "imageURL": "HTTP URL from where the source image file can be downloaded by the optimizer.",
        "alternativeImageURL": "Alternative HTTP URL from where the source image file can be downloaded by the optimizer.",
        "templateURL": "The template of the VMI in OVF (Open Virtual machine format.)",
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
        "fsPartition": "The partition of the image containing the root file system. Either provide a number (“0”, “1”, …) indicating a physical partition or give two strings “volume-group-name volume-name” in the case of LVM."
    };
});