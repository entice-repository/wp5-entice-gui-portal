app.controller('virtualImageStatisticsController', function($scope, $http, authService) {
    /* GET  / POST REQUESTS */
    var get_pareto = SERVICES_URL + "gui/get_newest_pareto?stage=2";

    var get_statistics = SERVICES_URL + "gui/get_statistics_data";
    var get_sztaki_statistics = SERVICES_URL + "sztaki/get_sztaki_statistic";

    $scope.stats = {};

    var getUserId = function(){
        var user = authService.get("user");
        return user.id;
    };

    $scope.statistics = {};

    $http.get(get_statistics+"?show_admin_data=true&user_id="+getUserId()).then(
        function(success) {
            var data = success.data;
            $scope.statistics = data;

            $http.get(get_sztaki_statistics).then(
                function(success) {
                    var data = success.data;
                    $scope.stats = data;
                    $scope.stats.numberOfFragments = bytesToSize(data.numberOfFragments);
                    $scope.stats.fragmentedImageStorageSpace = bytesToSize(data.fragmentedImageStorageSpace);
                    $scope.stats.sizeOfBaseImages = bytesToSize(data.sizeOfBaseImages);
                    // $scope.stats.sizeOfCompositeImages = bytesToSize(data.sizeOfCompositeImages);
                    $scope.stats.sizeOfFragments = bytesToSize(data.sizeOfFragments);
                    $scope.stats.compositeImageStorageSpace = bytesToSize(data.compositeImageStorageSpace);
                    $scope.stats.reductionRatioPercentage = Math.round(data.reductionRatioPercentage * 100) / 100;
                },
                function(failure) {
                    //alert("Offline VMI Redistribution error");
                    console.log("Offline VMI Redistribution error");
                }
            );

        },
        function(failure) {
            //alert("Offline VMI Redistribution error");
            console.log("Offline VMI Redistribution error");
        }
    );

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ';
    };

    // waitingDialog.show();
});