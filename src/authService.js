
app.service('authService', ['$window', function ($window) {
    return {
        /* He stores user and returns true, if the right user; calls get function */
        isAuthenticated : function() {
            var user = this.get("user");
            return user != false;
        },

        /* if user is stored in local storage it deletes him from local storage */
        logout: function(){
            if ( $window.localStorage.getItem("user") )  {
                $window.localStorage.removeItem("user");
            }
        },

        /* Cookie for user */
        get: function (key) {
            if ( $window.localStorage.getItem(key) )  {
                return angular.fromJson( $window.localStorage.getItem(key) ) ;
            }
            return false;
        },
        set: function (key, val) {
            if (val === undefined) {
                $window.localStorage.removeItem(key);
            } else {
                $window.localStorage.setItem( key, angular.toJson(val) );
            }
            return $window.localStorage.getItem(key);
        }
    }
}]);
