//处理地图交互
var draw;
function addInteraction() {
    draw = new ol.interaction.Draw({
        source: Source.measureSource,
        type: 'Circle'
    });

    draw.on("drawstart",onStartDraw);
    draw.on("drawend",onAddFeature);

    map.addInteraction(draw);
}

function onStartDraw(e) {
    map.on("singleclick",getFirstPoint);
    map.on("pointermove",getAzimuth);
}


function onAddFeature(e) {
    map.un("pointermove",getAzimuth);
    map.on('singleclick',catchEndpt);
    var geom=e.feature.getGeometry();
    var center=geom.getCenter();
    //var startpt = ol.proj.transform(center, sourceProj, 'EPSG:4326');
    //var radius=geom.getRadius();
    function catchEndpt(evt) {
        var endpt1 = evt.coordinate;
        var endpt = ol.proj.transform(endpt1, sourceProj, 'EPSG:4326');
        radiusline=new ol.geom.LineString([center,endpt1]);
        var feature = new ol.Feature({
            geometry: radiusline,
            labelPoint: new ol.geom.Point(endpt),
            name: 'Radius'
        });
        feature.setStyle(measureStyle);
        Source.measureSource.addFeature(feature);
        map.un("singleclick",catchEndpt);

        measureTooltipElement.className = 'tooltip tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        //map.removeInteraction(draw);
        //ol.Observable.unByKey(listener);
    }
}


