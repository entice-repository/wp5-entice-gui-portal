app.controller('installersBrowsingController', function ($scope, $http, $state, growl) {

    /* SEARCH AND ENTICE IMAGES */
    var url = SERVICES_URL + "sztaki/get_sztaki_installers";

    $scope.rowCollection = [];

    $scope.browseBaseImages = function (message) {

        $http.get(url).then(
            function (success) {

                if (success != null) {
                    var data = success.data;
                    for (var c = 0; c < data.length; c++) {
                        //console.log(data[c]);

                        $scope.rowCollection[c] =
                            {
                                id: data[c].id,
                                name: data[c].name,
                                tags: data[c].tags,
                                description: data[c].description,
                                author: data[c].author,
                                version: data[c].version
                            };
                    }
                }
                // $scope.tooltipsTab1 = {
                // "imageName" : "Name of the image",
                // "imageTags" : "Tags of the image",
                // "imageDescription" : "Description of the image",
                // "imageType": "Type of an image (BASE/COMPOSITE)",
                // "imageStatus": "Status of the image (READY / BUILDING / FAILED)",
                // "imageCreated" : "Date of creation",
                // "imageOwner" : "Creator of the image",
                // "imageDetails": "Link to more details (id, parent, message, partition)",
                // "imageLaunch" : "Bottom to launch the image",
                // "imageExtend" : "Bottom to extend the image"
                // };


                // var data = success.data;
                // $scope.virtual_images = data[0];
                //
                // for(var c=0; c<$scope.virtual_images.length; c++){
                //     if($scope.virtual_images[c].ownerFullName == "dummy full name") {
                //         $scope.virtual_images[c].ownerFullName = "Dragi";
                //     }
                // }
                //

                //console.log($scope.countedTags);
                // waitingDialog.hide();
                // console.log($scope.virtual_images);
            },
            function (failure) {
                console.log("Explore images failure or server timeout...");
                // waitingDialog.hide();
            }
        );
    };

    /* SHOW / HIDE Advanced settings */
    $scope.show = false;

    $scope.toggle = function () {
        $scope.show = !$scope.show;
    };

    angular.element(document).ready(function () {
        $scope.browseBaseImages();
    });
});


/*
 $scope.rowCollection = [
 {
 name: 'Ubuntu 16.04',
 tags: 'ubuntu16, ubuntu, Linux"',
 description: 'apt-get, update using installer ',
 type: 'Base image',
 status: 'Ready',
 created: '05/07/2017',
 parent: '72664992-8ccc-432f-ad48,',
 details: 'build done, partition: 1',
 action: ['Launch', 'Extend', 'Delete']
 },
 {
 name: 'Ubuntu 16.04 with Tomcat7 and MySQL',
 tags: 'tomcat7, mysql-client, mysql-server, ubuntu16.04',
 description: 'tomcat 7 insyalled using installer',
 type: 'Base image',
 status: 'Ready',
 created: '07/07/2017',
 parent: '516027b3-f147-4f96',
 details: 'build done',
 action: ['Launch', 'Extend', 'Delete']
 },
 {
 name: 'Data Avenue',
 tags: 'tomcat7, mysql-client, mysql-server, ubuntu16.04',
 description: 'Data Avenue installed manually',
 type: 'Base image',
 status: 'Ready',
 created: '01/07/2017',
 parent: '79eee265-55f2-450d-4f96',
 details: 'build done',
 action: ['Launch', 'Extend', 'Delete']
 },
 {
 name: 'Ubuntu 16.04 with mc',
 tags: 'mc, mysql-client, mysql, ubuntu',
 description: 'mc installed using installer',
 type: 'Base image',
 status: 'Ready',
 created: '24/06/2017',
 parent: '16947832-543fee-45fd-aadee-4f96',
 details: 'build done',
 action: ['Launch', 'Extend', 'Delete']
 },
 {
 name: 'Data Avenue service',
 tags: 'data-avenue, tomcat7, mysql-client, update, mysql-server',
 description: 'Data Avenue installed manually.',
 type: 'Base image',
 status: 'Ready',
 created: '14/06/2017',
 parent: '1085430fa-789fd6e-45fd-f5fea-4adf6',
 details: 'build done',
 action: ['Launch', 'Extend', 'Delete']
 }
 ];

 $scope.tooltipsTab1 = {
 "imageName" : "Name of the image",
 "imageTags" : "Tags of the image",
 "imageDescription" : "Description of the image",
 "imageType": "Type of an image (BASE/COMPOSITE)",
 "imageStatus": "Status of the image (READY / BUILDING / FAILED)",
 "imageCreated" : "Date of creation",
 "imageOwner" : "Creator of the image",
 "imageDetails": "Link to more details (id, parent, message, partition)",
 "imageLaunch" : "Bottom to launch the image",
 "imageExtend" : "Bottom to extend the image"
 };

 */
