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
            Layer.measureLayer
        ],
        target: 'map',
        overlays: [mapOverLay.measureTooltip, mapOverLay.measureHelpTooltip, mapOverLay.popupOverlay],
        view: new ol.View({
            center: ol.proj.fromLonLat([119.4157,32.4]),
            zoom: 2
        })
    });
    map.addControl(new ol.control.MapScale());

    var fullcontrol = new ol.control.FullScreen({
        tipLabel: '全屏'
    });
    map.addControl(fullcontrol);

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

