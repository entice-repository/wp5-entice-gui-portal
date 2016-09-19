
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

/*
 * =================================================================================
 * This file is part of: ENTICe Image Portal (GUI)
 * Release version: 0.2
 * =================================================================================
 * Developer: Polona Štefanič, University of Ljubljana, Slovenia
 *  *
 * The project leading to this application has received funding
 * from the European Union's Horizon 2020 research and innovation
 * programme under grant agreement No 644179.
 *
 * Copyright 2016
 * Contact: Vlado Stankovski (vlado.stankovski@fgg.uni-lj.si),
 *         Polona Štefanič (polona.stefanic@fgg.uni-lj.si)
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


app.controller('appController', function($scope, authService, $location, $window) {

    $scope.getStateName = function() {
        return $scope.$state.current.name;
    };

    /* calls function isAuthenticated */
    $scope.isAuthenticated = function() {
        return authService.isAuthenticated();
    };

    /* Return userId */
    $scope.getUserId = function() {
        var user = authService.get("user");
        return user.id;
    };

    /* Returns username from current user */
    $scope.getUsername = function() {
        var user = authService.get("user");
        return user.username;
    };

    /* if user is authenticated (logged in) it calls function logout() to log out user and redirects to start page */
    $scope.logout = function() {
        if (authService.isAuthenticated()) {
            authService.logout();
            $location.path('/');
            $window.location.reload();
        }
    };

    $scope.avatar = [
        {id:1, name: "Alpine Linux", img: "images/avatars/alpine_logo.png"},
        {id:2, name: "Apache Server", img: "images/avatars/apache_logo.png"},
        {id:3, name: "Cassandra", img: "images/avatars/cassandra_logo.png"},
        {id:4, name: "CentOS", img: "images/avatars/centos_logo.png"},
        {id:5, name: "Debian", img: "images/avatars/debian_logo.png"},
        {id:6, name: "Default logo", img: "images/avatars/default_logo.jpg"},
        {id:7, name: "Docker", img: "images/avatars/docker_logo.png"},
        {id:8, name: "Fedora", img: "images/avatars/fedora_logo.png"},
        {id:9, name: "Joomla", img: "images/avatars/joomla_logo.png"},
        {id:10, name: "Kubernetes", img: "images/avatars/kubernetes_logo.png"},
        {id:11, name: "MongoDB", img: "images/avatars/mongodb_logo.png"},
        {id:12, name: "NGinx", img: "images/avatars/nginx_logo.png"},
        {id:13, name: "OpenSuse", img: "images/avatars/opensuse_logo.png"},
        {id:14, name: "Redis", img: "images/avatars/redis_logo.png"},
        {id:15, name: "Ubuntu", img: "images/avatars/ubuntu_logo.png"},
        {id:16, name: "Wordpress", img: "images/avatars/wordpress_logo.png"},
        {id:17, name: "Python", img: "images/avatars/python_logo.png"},
        {id:18, name: "NodeJS", img: "images/avatars/nodejs_logo.png"},
        {id:19, name: "Tomcat", img: "images/avatars/tomcat_logo.png"},
        {id:20, name: "Lamp", img: "images/avatars/lamp_logo.png"},
        {id:21, name: "MySQL", img: "images/avatars/mysql_logo.png"},
        {id:22, name: "Java", img: "images/avatars/java_logo.png"}
    ];

    /* Loops through the array of avatars and if imageId equals to avatarId it returns path */
    $scope.getImagePath = function(avatarId){
        for(var i=0; i<$scope.avatar.length; i++) {
            if($scope.avatar[i].id == avatarId){
                return $scope.avatar[i].img;
            }
        }
    };

    /* CATEGORIES */
    $scope.tags = [
        {id: 0, tag: "alfresco", image_number: 0},
        {id: 1, tag: "alpine", image_number: 0},
        {id: 2, tag: "CentOS", image_number: 0},
        {id: 3, tag: "CMS", image_number: 0},
        {id: 4, tag: "containers", image_number: 0},
        {id: 5, tag: "ffmpeg", image_number: 0},
        {id: 6, tag: "ffserver", image_number: 0},
        {id: 7, tag: "HTTP", image_number: 0},
        {id: 8, tag: "java", image_number: 0},
        {id: 9, tag: "linux", image_number: 0},
        {id: 10, tag: "lucene", image_number: 0},
        {id: 11, tag: "MySQL", image_number: 0},
        {id: 12, tag: "OS", image_number: 0},
        {id: 13, tag: "PHP", image_number: 0},
        {id: 14, tag: "project-management", image_number: 0},
        {id: 15, tag: "rancher", image_number: 0},
        {id: 16, tag: "redmine", image_number: 0},
        {id: 17, tag: "debian", image_number: 0},
        {id: 18, tag: "solr", image_number: 0},
        {id: 19, tag: "tomcat", image_number: 0},
        {id: 20, tag: "ubuntu", image_number: 0},
        {id: 21, tag: "video-streaming", image_number: 0},
        {id: 22, tag: "web-server", image_number: 0},
        {id: 23, tag: "wordpress", image_number: 0},
        {id: 25, tag: "Misc", image_number: 0}
    ];


    $scope.formatSizeUnits = function(bytes) {
        if      (bytes>=1073741824) { bytes = (bytes/1073741824).toFixed(2) +' TB'; }
        else if (bytes>=1048576)    { bytes = (bytes/1048576).toFixed(2) +' GB'; }
        else if (bytes>=1024)       { bytes = (bytes/1024).toFixed(2) +' MB'; }
        else if (bytes>1)           { bytes = bytes + ' bytes'; }
        else if (bytes==1)          { bytes = bytes + ' byte'; }
        else                        { bytes = '-'; }
        return bytes;
    };

    $scope.msToTime = function (duration) {
        var milliseconds = parseInt((duration%1000)/100)
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }
});
