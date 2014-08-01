		
var x = 1;


var styleCache = {};
var vectorLayer = new ol.layer.Vector({
		source: new ol.source.GeoJSON({
			projection: 'EPSG:3857',
			url: 'geo/world.geo.json'
		}),
		style: function(feature, resolution) {
			var text = resolution < 5000 ? feature.get('name') : '';
			if (!styleCache[text]) {
				 styleCache[text] = [new ol.style.Style({
						fill: new ol.style.Fill({
								color: 'rgba(255, 255, 255, 0.6)'
						}),
						stroke: new ol.style.Stroke({
								color: '#319FD3',
								width: 1
						}),
						text: new ol.style.Text({
								font: '12px Calibri,sans-serif',
								text: text,
								fill: new ol.style.Fill({
									color: '#000'
								}),
								stroke: new ol.style.Stroke({
									color: '#fff',
									width: 3
								})
						})
				 })];
			}
			return styleCache[text];
		}
});

var map = new ol.Map({
	controls: ol.control.defaults().extend([
		new ol.control.FullScreen()
	]),
		layers: [
		// new ol.layer.Tile({
		// 	 source: new ol.source.MapQuest({layer: 'sat'})
		// }),
		// new ol.layer.Tile({
		//	 source: new ol.source.Stamen({
		//	 layer: 'toner'
		//	 })
		// }),
		new ol.layer.Tile({
		source: new ol.source.OSM()
		}),
			vectorLayer
		],
		target: 'osm',
		view: new ol.View({
			center: [0, 0],
			zoom: 2
		})
});

var highlightStyleCache = {};

var featureOverlay = new ol.FeatureOverlay({
		map: map,
		style: function(feature, resolution) {
			var text = resolution < 5000 ? feature.get('name') : '';
			if (!highlightStyleCache[text]) {
				 highlightStyleCache[text] = [new ol.style.Style({
						stroke: new ol.style.Stroke({
								color: '#f00',
								width: 1
						}),
						fill: new ol.style.Fill({
								color: 'rgba(255,0,0,0.1)'
						}),
						text: new ol.style.Text({
								font: '12px Calibri,sans-serif',
								text: text,
								fill: new ol.style.Fill({
									color: '#000'
								}),
								stroke: new ol.style.Stroke({
									color: '#f00',
									width: 3
								})
						})
				 })];
			}
			return highlightStyleCache[text];
		}
});

var highlight;
var displayFeatureInfo = function(pixel) {

		var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
			return feature;
		});

		var info = document.getElementById('info');
		if (feature) {
			info.innerHTML = feature.getId() + ': ' + feature.get('name');
		} else {
			info.innerHTML = '&nbsp;';
		}

		if (feature !== highlight) {
			if (highlight) {
				 featureOverlay.removeFeature(highlight);
			}
			if (feature) {
				 featureOverlay.addFeature(feature);
			}
			highlight = feature;
		}

};

$(map.getViewport()).on('mousemove', function(evt) {
		var pixel = map.getEventPixel(evt.originalEvent);
		displayFeatureInfo(pixel);
});

map.on('click', function(evt) {
		displayFeatureInfo(evt.pixel);
});
