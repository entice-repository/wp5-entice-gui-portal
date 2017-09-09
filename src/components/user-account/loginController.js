
app.controller('loginController', function($scope, $http, authService, $location, $window) {

    var login_url = SERVICES_URL + "gui/perform_user_login";

    $scope.data = {};

    $scope.isError = false;

    /**
     * It takes username and password from API and stores it into $scope.data.username and $scope.data.password
     * It connects to the URL, retrieves and stores data into data. If the data.success is true it means that the user is authorized to login and
     * authService is set to user, together with it's id, group and username.
     * After authorisation is successful, user is redirected to the starting page
     * If user is not authorized isError is set to true and an error message is shown
     * **/
    $scope.loginSubmit = function () {

        var url = login_url + "?username="+$scope.data.username+"&password="+$scope.data.password;

        $http.get(url).then(
            function(success){
                var data = success.data;
                if(data.success == "true"){
                    $scope.isError = false;
                    authService.set("user", { id:data.id, group:data.group, username:$scope.data.username });
                    $location.path('/');
                    // $window.location.reload();
                } else {
                    $scope.isError = true;
                }
            },
            function(error){
                alert("An error occured. Check all input fields.");
                console.log(error);
            }
        );
    }
});
