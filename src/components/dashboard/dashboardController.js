app.controller('repositoriesController', function ($scope, $http, authService, growl) {
    /* GET  / POST REQUESTS */
    var get_pareto = SERVICES_URL + "gui/get_newest_pareto?stage=2";

    var get_statistics = SERVICES_URL + "gui/get_statistics_data";
    var get_offline_redistribution = SERVICES_URL + "gui/trigger_offline_redistribution?selected_point_index=";

    var getUserId = function () {
        var user = authService.get("user");
        return user.id;
    };

    $scope.statistics = {};

    $http.get(get_statistics + "?show_admin_data=true&user_id=" + getUserId()).then(
        function (success) {
            var data = success.data;
            $scope.statistics = data;
        },
        function (failure) {
            //alert("Offline VMI Redistribution error");
            console.log("Offline VMI Redistribution error");
        }
    );

    $scope.executeRedistributionAction = function () {
        // alert("point index: " + $scope.pareto.index);

        $http.get(get_offline_redistribution + $scope.pareto.index).then(
            function (data) {
                // console.log("result redistribution: " + data);
                if (data.error) $scope.popUpToastr("warning", data.error);
                else $scope.popUpToastr("success", data.success);

            },
            function (failure) {
                $scope.popUpToastr("error", "Redistribution error");
                console.log(failure);
                waitingDialog.hide();
            }
        );
    };

    waitingDialog.show();

    $scope.pareto = {
        id: null,
        x: 0,
        y: 0,
        index: 0
    };

    //$scope.isChart = false;
    // $scope.showChart = function () {
    $http.get(get_pareto).then(
        function (success) {
            var data = success.data;
            $scope.pareto.id = data.id;
            $scope.objectives = data.objectives;
            var objectives = $scope.objectives;

            waitingDialog.hide();

            $scope.paretoChart.data = [];
            $scope.paretoChart.data.push(['', 'Transfer Time', 'Cost', 'Reliability']);
            for (var i = 0; i < objectives.length; i++) {
                $scope.paretoChart.data.push(['', objectives[i][0] * -1 + 1, objectives[i][1], objectives[i][2]]);
            }

            $scope.isChart = true;
        },
        function (failure) {
            //alert("Get Pareto error");
            console.log("Get pareto error");

            waitingDialog.hide();
        }
    );
    // };

    /* PLOT BUBBLE CHART */
    $scope.paretoChart = {
        type: "BubbleChart",
        data: [],
        options: {
            title: 'Pareto front for Multi-objective optimization',
            hAxis: {title: 'Cost  (EUR / GB)'},
            vAxis: {title: 'Transfer Time (Sec / GB)'},
            bubble: {
                textStyle: {
                    fontSize: 5
                }
            },
            sizeAxis: {minValue: 5, maxSize: 17},
            colors: ['purple']
        }
    };

    $scope.paretoChartSelect = function (selectedItem) {
        var row = $scope.objectives[selectedItem.row];
        $scope.pareto.x = row[0];
        $scope.pareto.y = row[1];
        $scope.pareto.index = selectedItem.row;
        console.log($scope.pareto.index)
    };

    /* NOTIFICATIONS */
    $scope.popUpToastr = function (type, msg) {
        var config = {};
        switch (type) {
            case "success":
                growl.success(msg, config);
                break;
            case "error":
                growl.error(msg, config);
                break;
            case "warning":
                growl.warning(msg, config);
                break;
            case "info":
                growl.info(msg, config);
                break;
            default:
                growl.info(msg, config);
        }
    };
});

/*
    $scope.chartObject = {
        type: "BubbleChart",
        /*data: [
         ['', 'First dimension', 'Second dimension', 'Data', 'More data'],
         ['',    80.66,              1.67,      'Data 1',         33739900],
         ['',    79.84,              1.36,      'Data 2',         81902307],
         ['',    78.6,               1.84,      'Data 2',         5523095],
         ['',    72.73,              2.78,      'Data 3',         79716203],
         ['',    80.05,              2.05,      'Data 2',         61801570],
         ['',    72.49,              1.7,       'Data 3',         73137148],
         ['',    68.09,              4.77,      'Data 3',         31090763],
         ['',    81.55,              2.96,      'Data 3',         7485600],
         ['',    68.6,               1.54,      'Data 2',         141850000],
         ['',    78.09,              2.05,      'Data 1',         307007000]
         ],
         */
/*data: [
            ['', 'Cost level', 'Performance level'],
            ['',    159.830496,             413338908890269.25],
            ['',    144.12591,              949792382617064.1],
            ['',    145.870864,             850285665635932.0],
            ['',    151.105726,             629936055864321.2],
            ['',    154.595634,             526760602500833.06],
            ['',    147.615818,             800183524009299.1],
            ['',    147.61581800000002,     750778948654799.9],
            ['',    152.85068,              576862744127466.0],
            ['',    156.340588,             481196549158218.25],
            ['',    158.085542,             445006658808343.44],
            ['',    149.36077200000003,     686466998114843.1],
            ['',    149.360772,             700676807028167.0],
            ['',    152.85067999999998,     626267319481965.1]
        ],

        options : {
            title: 'Pareto front for Multi-objective optimization',
            hAxis: {title: 'Cost level (EUR / MB)'},
            vAxis: {title: 'Performance level (Sec / MB)'},
            bubble: {
                textStyle: {
                    fontSize: 5,
                    color: 'green'
                }
            }
        }
    };*/
/* $scope.scoinPrice = {
 type: "LineChart",
 displayed: true,
 data : [
 ["Date", "Repo number", "Repo performance", {
 'type': 'string',
 'role': 'style'
 }]
 ],
 options: {
 chartArea: {'width': '100%', 'height': '80%'},
 legend: 'none',
 pointSize: 6,
 series: {
 0: {targetAxisIndex: 1, curveType: 'function', lineWidth: 1, color: "yellow"},
 1: {targetAxisIndex: 0, pointShape: 'circle', lineWidth: 1, color:"white"}
 },
 vAxes: {
 0: { },
 1: { }
 },
 hAxis: {
 ticks: [],
 gridlines: {
 color: 'transparent'
 },
 baselineColor: 'white',
 textStyle:{color: 'white', bold: false}
 },
 vAxis: {
 gridlines: {
 color: 'transparent'
 },
 baselineColor: 'white'
 },
 backgroundColor : "transparent"
 }
 };

 for(var c=0; c<31; c++){
 $scope.scoinPrice.options.hAxis.ticks.push(c);
 var value = parseFloat(Math.floor((Math.random() * 10.9999) + 1.9999));
 $scope.scoinPrice.data.push([c, value, value, 'point {stroke-width: 1;  stroke-color: white; fill-color: #2AAC9C }']);
 }
 */
