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


app.controller('buildRecipesController', function($http, $scope, $interval) {
    var build_recipes = SERVICES_URL + "sztaki/execute_image_build";
    var get_status_url = SERVICES_URL + "sztaki/get_builder_status?show_result=false"; // builder_id=98395aa7-6e10-4f6b-8f01-b5bb64605e9c
    var get_result_url = SERVICES_URL + "sztaki/get_builder_status?show_result=true";  // builder_id=98395aa7-6e10-4f6b-8f01-b5bb64605e9c


    var get_recipe_builds = SERVICES_URL + "sztaki/get_recipe_refreshed_builds";
    //var cancel_recipe_build = SERVICES_URL + "sztaki/delete_builder?builder_id=    &cancel_execution=true"; // cancelation

    var cancel_recipe_build = SERVICES_URL + "sztaki/delete_builder?cancel_execution=true"; //builder_id=    &
    var delete_recipe_build = SERVICES_URL + "sztaki/delete_builder";

    //$scope.recipes = {};

    $scope.recipes = [];
    $scope.active = 0;

    var interval_function = function(){
        $http.get(get_recipe_builds).then(
            function(success) {
                $scope.recipes = success.data;
            },
            function(failure) {
                //alert("Get Pareto request error");
                console.log("Get Pareto request error");
            }
        );
    };

    interval_function();

    /* GET REQUEST */
    $scope.intervals.push($interval(function(){
        interval_function();
    }, 10000));


    $scope.deleteRecipe = function(id){
        $http.get(delete_recipe_build+"?builder_id="+id).then(
            function(success) {
                interval_function();
            },
            function(failure) {
            }
        );
    };

    $scope.cancelRecipe = function(id){
        $http.get(cancel_recipe_build+"&builder_id="+id).then(
            function(success) {
                interval_function();
            },
            function(failure) {
            }
        );
    };

    // var delete_created_vmi = SERVICES_URL + "http://193.2.72.90:7070/JerseyREST/rest/sztaki/delete_builder";

    /* Data, which is collected from the GUI  */
    $scope.data = {
        "build":  {
            "module": "packer",
            "version": "1.0",
            "input": {
                "zipurl": "https://s3.lpds.sztaki.hu/atisu/entice/wp3/recipes/wordpress-build-20160913a.zip"
            }
        },

        "test": {
            "module": "exec-internal",
            "version": "1.0",
            "input": {
                "command": "run_test.sh",
                "zipurl": "http://smith.s3.lpds.sztaki.hu/Entice/recipes/packer-test-for-wordpress.zip"
            }
        }
    };

    $scope.submitForm = function() {
        waitingDialog.show();

        $http.post(build_recipes, $scope.data).then(
            function(success) {
                console.log(success);
                waitingDialog.hide();

                interval_function();
                $scope.active = 1;
            },
            function(error) {
                alert("An error occured");
                waitingDialog.hide();
            }
        );
    };


    /* Initialization */
    /*
    $scope.statusInterval = null;
    $scope.status = {};
    $scope.result = {};
    $scope.active = 0;
    $scope.interval = null;

    $scope.submitForm = function() {
        waitingDialog.show();

        $http.post(build_recipes, $scope.data).then(
            function(success) {
                console.log(success);
                waitingDialog.hide();

                var request_id = success.data.result.request_id;

                $scope.active = 1;

                var status_function = function() {
                    $http.get(get_status_url+"&builder_id="+request_id).then(
                        function(success){
                            $scope.status = success.data.result;

                            if($scope.result.request_status == "finished") {
                                $interval.cancel($scope.interval);

                                $http.get(get_result_url+"&builder_id="+request_id).then(
                                    function(success) {
                                        $scope.result = success.data.result;
                                        console.log($scope.result);
                                    },
                                    function(error) {
                                        //alert("Building recipe error");
                                        console.log("Building recipe error");
                                    }
                                );
                            }
                        },
                        function(error){
                            //alert("Building recipe error");
                            console.log("Building recipe error");
                        }
                    );
                };

                status_function();

                $scope.interval = $interval(function() {
                    status_function();
                }, 5000);

            },
            function(error) {
                alert("An error occured");
                waitingDialog.hide();
            }
        );
    }
    */

});



/* get_builder_status
* {
 status: "ok",
 message: "",
 result: {
 request_status: "init",
 outcome:: "undefined",
 request_id: "afd4c3a5-3f08-4adf-a99f-bd463f6b2833"
 }
 }
*
* */

/*

 STATUS, RESULT: curl -X GET https://entice.lpds.sztaki.hu:5443/api/imagebuilder/build/<request_id>
 DELETE: curl -X DELETE https://entice.lpds.sztaki.hu:5443/api/imagebuilder/build/<request_id>/result
 CANCEL: curl -X DELETE https://entice.lpds.sztaki.hu:5443/api/imagebuilder/build/<request_id>

* */

