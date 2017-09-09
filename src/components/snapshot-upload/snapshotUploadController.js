app.controller('snapshotUploadController', function ($scope) {

    /* TAB 4: Snapshot upload */
    $scope.tooltipsTab4 = {
        "imageName": "Name of the image",
        "imageTags": "Tags of the image",
        "imageDescription": "Description of the image",
        "partition": "Partition in therms of index of repository [1-N]",
        "imageInstallers": "List of Installers ids of the parent image (optional).",
        "imageInstaller": "Custom installer script (text area).",
        "imageOwner": "Creator of the image"
    };

    var snapshot_image_upload = SERVICES_URL + "sztaki/register_base_image";

    /* POST REQUEST */
    $scope.createSnapshotImage = function () {
        //oops();
        alert($scope);

        /* ARRAY OF CATEGORIES */
        // var category_list = [];
        // if($scope.formData.category && $scope.formData.category.length){
        //     for(var i=0; i<$scope.formData.category.length; i++){
        //         category_list.push($scope.formData.category[i].tag);
        //     }
        // }

        // DATA EXAMPLE:
        // owner:admin
        // url:"http://source-images.s3.lpds.sztaki.hu/ami-000001654.qcow2"
        // name:"Ubuntu 16.04"
        // tags:[ubuntu,ubuntu16,"16.04"]
        // description:"[BASE OFFICIAL] Ubuntu 16.04.02"
        // partition:"1"
        // cloudImageIds:{ sztaki:"ami-000001654"}

        /* ARRAY OF TAGS */
        var tag_list = [];
        if ($scope.formData.image_tags && $scope.formData.image_tags.length > 0) {
            var split = $scope.formData.image_tags.split(",");
            for (var i = 0; i < split.length; i++) {
                tag_list.push(split[i]);
            }
        }

        /* ARRAY OF CLOUD IMAGE IDS ; PARENTS */
        var cloud_image_ids = [];
        if ($scope.formData.image_parent && $scope.formData.image_parent.length > 0) {
            var split = $scope.formData.image_parent.split(",");
            for (var i = 0; i < split.length; i++) {
                cloud_image_ids.push(split[i]);
            }
        }

        var data = {
            url: $scope.formData.image_url,
            description: $scope.formData ? $scope.formData.image_description : null,
            name: $scope.formData ? $scope.formData.image_name : null,
            tags: tag_list,
            owner: $scope.getUserId(),
            partition: $scope.getUserId(),
            cloudImageIds: cloud_image_ids,
        };

        alert(data);

        // validate form, TODO
        // for(var k in data) {
        //     if((data[k] == null || data[k] == "" || typeof data[k] == "undefined") && (k != "file_upload" && k != "image_url")
        //         || (file_upload_value == null && image_url_value == null)){
        //         $scope.popUpToastr("info", "Please fill all required fields!");
        //         return;
        //     }
        // }

        waitingDialog.show();

        upload({
            url: snapshot_image_upload,
            method: 'POST',
            data: data
        }).then(
            function (response) {
                waitingDialog.hide();
                alert(response);
                //$scope.responseCode = response.data.code;
                // $scope.responseMessage = response.data.repositoryID;
                //
                // if(response.data.code == 200) {
                //     $scope.popUpToastr("success", "Upload successful");
                //     $timeout(function() {
                //         $state.go($state.current, {}, {reload: false});
                //     }, 3000);
                //
                // } else {
                //     $scope.popUpToastr("error", "Upload failed");
                // }
                $scope.responseMessage = response;
                $scope.popUpToastr("success", response);
            },
            function (response) {
                waitingDialog.hide();

                console.log(response);
                error_response = response.data;

                $scope.popUpToastr("error", "Snapshot image upload failed");
            }
        );

    }
});