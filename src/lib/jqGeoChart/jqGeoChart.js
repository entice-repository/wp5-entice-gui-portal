/**
* JSPath
*
* Copyright (c) 2015 Eric Grange (zarglu@gmail.com)
* Licensed under MPL 1.1
* https://www.mozilla.org/MPL/1.1/
*
* @version 1.0.0
*/
(function () {

   function jqGeoChart(data, options) {

      options = $.extend({
         map: 'jqGeoChart.WorldMap.txt',
         datalessColor: '#ccc',
         colorAxis: {
            colors: [{h:338,s:98,l:40}, {h:194, s:66, l:21}]

         },
         tooltip: {
            style: {
               "position": "absolute",
               "display": "none",
               "background-color": "#fff",
               "border": "1px solid #aaa",
               "box-shadow": "1px 1px 2px #aaa",
               "padding": "5px"
            }
         }
      }, options);

      if (!options.mapData) {
         var container = this;
         $.ajax({
            url: options.map,
            success: function (d) {
               options.mapData = d;
               container.geoChart(data, options);
            },
            dataType: 'text'
         });
         return;
      }

      var tooltip = $('<div></div>').css(options.tooltip.style);
      $('body').append(tooltip);

      function mapHoverIn(e) {
         var g = $(this), cc = g.attr('cc');
         if (cc) {
            tooltip.html(g.attr('title'));
            mapMouseMove(e);
            tooltip.show();
         } else tooltip.hide();
      }
      function mapHoverOut() {
         tooltip.hide();
      }
      function mapMouseMove(e) {
         if (tooltip) {
            tooltip.css({left: (e.pageX + 20) + "px", top: (e.pageY + 10) + "px"});
         }
      }

      var svg = $(options.mapData);
      this.empty().append(svg);
      svg.mousemove(mapMouseMove).css('fill', options.datalessColor);

      var min = Infinity, max = -min, v, cols = options.colorAxis.colors;
      for (var cc in data) {
         v = data[cc][0];
         if (v<min) min = v;
         if (v>max) max = v;
      }
      var g = svg.children(), f = max-min;
      if (f) f = 1/f;
      for (var i=0; i<g.length; i++) {
         var cc = g[i].getAttribute('cc');
         if (data[cc] !== undefined) {
            v = (data[cc][0]-min)*f;
            $(g[i])
                .css('fill',
                    'hsl(' + (cols[1].h*v+cols[0].h*(1-v)) + ','
                    + (cols[1].s*v+cols[0].s*(1-v)) + '%,'
                    + (cols[1].l*v+cols[0].l*(1-v)) + '%)')
                .hover(mapHoverIn, mapHoverOut)
                .attr('title', data[cc][1]);
         }
      }
   }

   $.fn.extend({
      geoChart: jqGeoChart
   });

})();