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
