var map;
var geoserverhost='http://192.168.0.67:8090/geoserver';
var geojsonFormat=new ol.format.GeoJSON({defaultDataProjection:'epsg:3857'});
function init() {
    setToolBar();
    overlayInit();
    layerinit();
    map = new ol.Map({
        controls: [],
        layers: [
            Layer.streetLayer,Layer.sateLayer,Layer.haiTuLayer,
            Layer.measureLayer,Layer.wmsship,Layer.taifeng,Layer.drawLayer
        ],
        target: 'map',
        overlays: [mapOverLay.measureTooltip, mapOverLay.measureHelpTooltip,
            mapOverLay.popupOverlay,mapOverLay.taifeng],
        view: new ol.View({
            center: ol.proj.fromLonLat([119.4157,32.4]),
            zoom: 2
        })
    });
    var select=new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        layers:[Layer.taifeng],
        filter:function(_feature){
            return _feature.getGeometry().getType()=='Point'
        }
    });
    select.on('select',function(e){
        showPopup(e.selected[0]);
    });
    map.addInteraction(select);

    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat:function(coor){
            if(coor[0]<-180)
                coor[0]=coor[0]+360;
            coor=[coor[0]%180,coor[1]];
            return ol.coordinate.createStringXY(4)(coor);
        },
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('location'),
        undefinedHTML: '&nbsp;'
    });
    map.getView().on('change:resolution', function(evt) {
        var zoom=map.getView().getZoom();
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
        if(zoom>10)//地图缩放等级超过10后，就切换 矢量图层
        {

            if(hasLayerInMap(Layer.wmsship))
                map.removeLayer(Layer.wmsship);
            if(!hasLayerInMap(Layer.shipAll))
                map.addLayer(Layer.shipAll);
        }
        else
        {
            if(hasLayerInMap(Layer.shipAll))
                map.removeLayer(Layer.shipAll);
            if(!hasLayerInMap(Layer.wmsship))
                map.addLayer(Layer.wmsship);
        }

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

