app.controller('virtualImageStatisticsController', function($scope, $http, authService) {
    /* GET  / POST REQUESTS */
    var get_pareto = SERVICES_URL + "gui/get_newest_pareto?stage=2";

    var get_statistics = SERVICES_URL + "gui/get_statistics_data";

    var getUserId = function(){
        var user = authService.get("user");
        return user.id;
    };

    $scope.statistics = {};

    $http.get(get_statistics+"?show_admin_data=true&user_id="+getUserId()).then(
        function(success) {
            var data = success.data;
            $scope.statistics = data;
        },
        function(failure) {
            //alert("Offline VMI Redistribution error");
            console.log("Offline VMI Redistribution error");
        }
    );

    // waitingDialog.show();
});