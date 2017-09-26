app.controller('exploreImageController', function ($scope, $http, $state) {

    /* SEARCH AND ENTICE IMAGES */
    var url = SERVICES_URL + "gui/get_entice_images";

    $scope.virtual_images = [];
    $scope.data = {};
    $scope.countedTags = [];

    angular.copy($scope.tags, $scope.countedTags);

    var searchIdle = true;

    $scope.search = function (category) {
        if (searchIdle) {
            searchIdle = false;
            $scope.virtual_images = [];

            angular.copy($scope.tags, $scope.countedTags);

            var searchText = $scope.data.searchText || null;
            var dropdownSorting = ($scope.data.dropdownSorting ? $scope.data.dropdownSorting.id : null);

            var queryString = null;
            var queryArray = [];

            if (searchText) {
                queryArray.push("image_title=" + searchText);
            }

            if (dropdownSorting) {
                switch (dropdownSorting) {
                    case 1:
                        queryArray.push("order=name&sort=true");
                        break;
                    case 2:
                        queryArray.push("order=name");
                        break;
                    case 3:
                        queryArray.push("order=size&sort=true");
                        break;
                    case 4:
                        queryArray.push("order=size");
                        break;
                }
            }

            if (category != null) {
                queryArray.push("category_id=" + category);
            }

            if (queryArray.length > 0) {
                queryString = queryArray.join("&");
            }

            var getUrl = url;

            if (queryString) {
                getUrl += "?" + queryString;
            }

            // console.debug(queryArray);
            // console.debug(queryString);
            // waitingDialog.show();

            $http.get(getUrl).then(
                function (success) {
                    var data = success.data;
                    $scope.virtual_images = data[0];

                    for (var c = 0; c < $scope.virtual_images.length; c++) {
                        if ($scope.virtual_images[c].ownerFullName == "dummy full name") {
                            $scope.virtual_images[c].ownerFullName = "Dragi";
                        }
                    }

                    for (var c = 0; c < $scope.virtual_images.length; c++) {
                        var vi = $scope.virtual_images[c];
                        // console.log(vi);
                        if (vi.categories != null) {
                            for (var b = 0; b < vi.categories.length; b++) {
                                var cat = vi.categories[b];
                                // console.log(cat);
                                for (var d = 0; d < $scope.countedTags.length; d++) {
                                    // console.log($scope.countedTags[d]);
                                    if ($scope.countedTags[d].tag == cat) {
                                        $scope.countedTags[d].Y7HNU8Jimage_number++;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    //console.log($scope.countedTags);
                    // waitingDialog.hide();
                    // console.log($scope.virtual_images);
                    searchIdle = true;
                },
                function (failure) {
                    searchIdle = true;
                    //alert("An error occured");
                    console.log("Explore images failure or server timeout...");

                    // waitingDialog.hide();
                }
            );
        }
        ;
    }

    $scope.getCountedTags = function () {
        var a = [];
        for (var c = 0; c < $scope.countedTags.length; c++) {
            if ($scope.countedTags[c].image_number > 0)
                a.push($scope.countedTags[c])
        }
        console.log(a);
        return a;
    };

    $scope.search();

    $scope.goToInformation = function (v) {
        $state.go("image-information", {imageId: v.id});
    };

    /* SHOW / HIDE Advanced settings */
    $scope.show = false;

    $scope.toggle = function () {
        $scope.show = !$scope.show;
    };

    /* SORTING OPTIONS  */
    $scope.sorting_options = [
        {id: 2, name: "Disk Image name asc"},
        {id: 1, name: "Disk Image name desc"},
        {id: 4, name: "Disk Image size asc"},
        {id: 3, name: "Disk Image size desc"}

        /*
         {id: 4, name: "Number of downloads asc"},
         {id: 5, name: "Number of downloads desc"},
         {id: 6, name: "Number of optimisations asc"},
         {id: 7, name: "Number of optimisations desc"},
         {id: 8, name: "Newest (image) first"},
         {id: 9, name: "Oldest (image) first"}
         */
    ];
});

/*
 $scope.vmis =
 {
 "virtual_images" : [
 {
 "id" : "01",
 "avatar" : "images/apache_logo.png",
 "name" : "Apache Server 2.0",
 "image" : "public",
 "author" : "User_10",
 "size" : "240MB",
 "downloads" : "325",
 "childs" : "3",
 "tags" : ["HTTP Server", "Apache 2.0", "RESTful", "Web Server", "Server"]
 },
 {
 "id" : "02",
 "avatar" : "images/creative_cloud_logo.png",
 "name" : "Adobe Creative Cloud",
 "image" : "private",
 "author" : "User_13",
 "size" : "6,7GB",
 "downloads" : "765",
 "childs" : "0",
 "tags" : ["Photoshop", "Illustrator", "InDesign", "Bridge", "UX Design"]
 },
 {
 "id" : "03",
 "avatar" : "images/centos_logo.png",
 "name" : "Cent OS",
 "image" : "public",
 "author" : "User_20",
 "size" : "3,4GB",
 "downloads" : "265",
 "childs" : "5",
 "tags" : ["Linux", "Gnome", "Version 3.4", "KDE", "Unix"]
 },

 {
 "id" : "05",
 "avatar" : "images/nodejs_logo.png",
 "name" : "NodeJS",
 "image" : "public",
 "author" : "User_28",
 "size" : "230MB",
 "downloads" : "135",
 "childs" : "1",
 "tags" : ["JavaScript", "Open Source", "Framework", "Web", "Library"]
 },
 ]
 };
 */
//console.log($scope._vmis);
