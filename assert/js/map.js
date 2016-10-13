var map;
var geoserverhost='http://192.168.0.67:8090/geoserver';
var geojsonFormat=new ol.format.GeoJSON({defaultDataProjection:'epsg:2364'});
function init() {
    setToolBar();
    overlayInit();
    layerinit();
    map = new ol.Map({
        controls: [],
        layers: [
            Layer.sateLayer, Layer.streetLayer,Layer.haiTuLayer,
            Layer.measureLayer,Layer.ship,Layer.drawLayer
        ],
        target: 'map',
        overlays: [mapOverLay.measureTooltip, mapOverLay.measureHelpTooltip,
            mapOverLay.popupOverlay,mapOverLay.taifeng],
        view: new ol.View({
            center: ol.proj.fromLonLat([119.4157,32.4]),
            zoom: 2
        })
    });
    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('location'),
        undefinedHTML: '&nbsp;'
    });
    map.getView().on('change:resolution', function(evt) {
        var resolution = evt.target.get('resolution');
        var units = map.getView().getProjection().getUnits();
        var dpi = 25.4 / 0.28;
        var mpu = ol.proj.METERS_PER_UNIT[units];
        var scale = resolution * mpu * 39.37 * dpi;
        if (scale >= 9500 && scale <= 950000) {
            scale = Math.round(scale / 1000) + "K";
        } else if (scale >= 950000) {
            scale = Math.round(scale / 1000000) + "M";
        } else {
            scale = Math.round(scale);
        }
        document.getElementById('scale').innerHTML = "Scale = 1 : " + scale;
    });
    var zoomControl=new ol.control.Zoom({zoomInTipLabel:'放 大',zoomOutTipLabel:'缩 小'});
    map.addControl(zoomControl);
    map.addControl(mousePositionControl);
    $('.ol-zoom-in, .ol-zoom-out').tooltip({
        placement: 'right'
    });
    var fullcontrol=new ol.control.FullScreen({
        tipLabel:'全屏'
    });
    map.addControl(fullcontrol);
    test();
}


var  measureinteraction;
//测量层
function addMeasureinteraction(type)
{
    if(measureinteraction!==undefined)
        map.removeInteraction(measureinteraction);
    measureinteraction= new ol.interaction.Draw({
        source: Source.measureSource,
        type: type,
        style: measureStyle
    });
    measureinteraction.on('drawstart',measureStart);
    measureinteraction.on('drawend',measureEnd);
 
    map.addInteraction(measureinteraction);
}

