# jqGeoChart

Implements a minimalistic vector map representation plugin for jQuery.

Once minified/compress, it is less than 1.5 kB of JavaScript and less than 22kB of data for the default world map. Loads and displays almost instantly.

Documentation
-------------

Invoke geoChart() method on a jQuery object, parameters are data & options

```javascript
$('#map').geoChart({
      us: [10, 'United States: 10'],
      fr: [5, 'France: 5'],
      cn: [0, 'China: 0']
   });
```

![worldmap-default.png](https://bitbucket.org/repo/yj7Kk9/images/1429834907-worldmap-default.png)

Default options:

```javascript
{
  map: 'jqGeoChart.WorldMap.txt',
  datalessColor: '#eee',
  colorAxis: {
	 colors: [{h:110,s:90,l:90}, {h:110,s:80,l:25}]
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
}
```