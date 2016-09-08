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
            Layer.measureLayer,Layer.aa
        ],
        target: 'map',
        overlays: [mapOverLay.measureTooltip, mapOverLay.measureHelpTooltip, mapOverLay.popupOverlay],
        view: new ol.View({
            center: ol.proj.fromLonLat([119.4157,32.4]),
            zoom: 2
        })
    });
    map.addControl(new ol.control.MapScale());
    var panZoom = new ol.control.PanZoom({
        imgPath: './plugin/ol3/PanZoom/resources/zoombar_black',
        slider: true
    });
    map.addControl(panZoom);
    var fullcontrol = new ol.control.FullScreen({
        tipLabel: '全屏'
    });
    map.addControl(fullcontrol);
    (function ($, h, c) {
        var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow";
        e[b] = 250;
        e[f] = true;
        $.event.special[j] = {
            setup: function () {
                if (!e[f] && this[k]) {
                    return false
                }
                var l = $(this);
                a = a.add(l);
                $.data(this, d, {w: l.width(), h: l.height()});
                if (a.length === 1) {
                    g()
                }
            }, teardown: function () {
                if (!e[f] && this[k]) {
                    return false
                }
                var l = $(this);
                a = a.not(l);
                l.removeData(d);
                if (!a.length) {
                    clearTimeout(i)
                }
            }, add: function (l) {
                if (!e[f] && this[k]) {
                    return false
                }
                var n;

                function m(s, o, p) {
                    var q = $(this), r = $.data(this, d);
                    r.w = o !== c ? o : q.width();
                    r.h = p !== c ? p : q.height();
                    n.apply(this, arguments)
                }

                if ($.isFunction(l)) {
                    n = l;
                    return m
                } else {
                    n = l.handler;
                    l.handler = m
                }
            }
        };
        function g() {
            i = h[k](function () {
                a.each(function () {
                    var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d);
                    if (m !== o.w || l !== o.h) {
                        n.trigger(j, [o.w = m, o.h = l])
                    }
                });
                g()
            }, e[b])
        }
    })(jQuery, this);
    //控制地图窗口拉伸地图不变形
    $('#map').resize(function () {
        map.updateSize();
    });


}


//根据查询条件选项键值对，构造查询条件
function getCQLFilter(options)
{
    var filter=[];
    for ( var key in options) {
        if (typeof (options [key])=="function")
            continue;
        else if(Object.prototype.toString.call(options [key])=="[object Array]")
        {
            var tempOr=[];
            for(var i=0;i<options [key].length;i++)
            {
                var str;
                if(typeof (options [key][i])=='string')
                    str=key+'=\''+options[key][i]+'\'';
                else
                    str=key+'='+options[key][i];
                tempOr.push(str);
            }
            filter.push('('+tempOr.join(' Or ')+')');
        }
        else
        if(typeof (options [key])=='string')
            filter.push(key+'=\''+options[key]+'\'');
        else
            filter.push(key+'='+options[key]);
    }
    filter =filter.join(' And ');
    return filter;
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

