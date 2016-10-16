//工具
var tooltipCoord;
function measureinit()
{
    //移除测量移动提示
    map.un('pointermove', measureMoveHandler);
    //移除测量
    map.removeInteraction(measureinteraction);
    mapOverLay.measureHelpTooltip.setPosition(undefined);
}
var measureVar={
    wgs84Sphere:new ol.Sphere(6378137),
    sketch:null,
    geodesic:false,
    continuePolygonMsg:'点击开始绘制面',
    continueLineMsg:'点击开始绘制线',
    continueCircleMsg:'点击开始绘制电子方位'
};
var measureMoveHandler = function(evt) {
    if (evt.dragging) {
        return;
    }
    var helpMsg = '点击开始绘制';
    tooltipCoord = evt.coordinate;
    if (measureVar.sketch) {
        var output;
        var geom = (measureVar.sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            output = formatArea( geom);
            helpMsg = measureVar.continuePolygonMsg;
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof ol.geom.LineString) {
            output = formatLength(geom);
            helpMsg = measureVar.continueLineMsg;
            tooltipCoord = geom.getLastCoordinate();
        }
        else if(geom instanceof ol.geom.Circle) {
            output = formatAzimuth(geom);
            helpMsg = measureVar.continueCircleMsg;
        }
        showMeasureResult(output,tooltipCoord);
    }
    showMeasureHelp(helpMsg,evt.coordinate);
};


//显示测量结果
function showMeasureResult(innerHTML,coordinate)
{
    mapElement.measureTooltipElement.innerHTML= innerHTML;
    mapOverLay.measureTooltip.setPosition(coordinate);
}
//显示测量帮助提示
function showMeasureHelp(innerHTML,coordinate)
{
    mapElement.measureHelpTooltipElement.innerHTML= innerHTML;
    mapOverLay.measureHelpTooltip.setPosition(coordinate);
}
//清除测量结果
function clearMeaure()
{
    Source.measureSource.clear();
    mapElement.measureTooltipElement.innerHTML= "";
    mapOverLay.measureTooltip.setPosition(undefined);
    mapElement.measureHelpTooltipElement.innerHTML= "";
    mapOverLay.measureHelpTooltip.setPosition(undefined);
}
function changeMouseStyle(info)
{
    if(info)
        $("#map")[0].style.cursor = "pointer";
    else
        $("#map")[0].style.cursor = "";

}

var formatLength = function(line) {
    var length;
    if (measureVar.geodesic) {
        var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = map.getView().getProjection();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += measureVar.wgs84Sphere.haversineDistance(c1, c2);

        }
    } else {
        length = line.getLength();
    }
    var output;
    if (length > 1000) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + '千米<a onClick="clearMeaure()" onmouseover="changeMouseStyle(true)" onmouseout="changeMouseStyle(false)">✖</a>';
    } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + '米<a onClick="clearMeaure()" onmouseover="changeMouseStyle(true)" onmouseout="changeMouseStyle(false)">✖</a>';
    }
    return output;
};


var formatArea = function(polygon) {
    var area;
    if (measureVar.geodesic) {
        var sourceProj = map.getView().getProjection();
        var geom = (polygon.clone().transform(
            sourceProj, 'EPSG:4326'));
        var coordinates = geom.getLinearRing(0).getCoordinates();
        area = Math.abs(measureVar.wgs84Sphere.geodesicArea(coordinates));
    } else {
        area = polygon.getArea();
    }
    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + '千米<sup>2</sup><a onClick="clearMeaure()" onmouseover="changeMouseStyle(true)" onmouseout="changeMouseStyle(false)">✖</a>';
    } else {
        output = (Math.round(area * 100) / 100) +
            ' ' + '米<sup>2</sup><a onClick="clearMeaure()" onmouseover="changeMouseStyle(true)" onmouseout="changeMouseStyle(false)">✖</a>';
    }
    return output;
};

//测量开始
function measureStart(e)
{
    Source.measureSource.clear();
    mapElement.measureTooltipElement.className = 'measuretooltip tooltip-measure';
    mapOverLay.measureTooltip.setOffset([0, -15]);
    measureVar.sketch = e.feature;
}
//测量结束
function measureEnd(e)
{
    mapElement.measureTooltipElement.className = 'measuretooltip tooltip-static';
    mapOverLay.measureTooltip.setOffset([0, -7]);
    var geom=e.feature.getGeometry();
    if(geom instanceof ol.geom.Circle) {
        var center=geom.getCenter();
        var radiusLine=new ol.geom.LineString([center,tooltipCoord]);
        var radiusFeature=new ol.Feature({
            geometry: radiusLine
        })
        radiusFeature.setStyle(measureStyle);
        Source.measureSource.addFeature(radiusFeature);
    }
        measureVar.sketch = null;
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

function formatAzimuth(geom) {
    var P1=geom.getCenter();
    var P2=tooltipCoord;
    var X1=P1[0];
    var Y1=P1[1];
    var X2=P2[0];
    var Y2=P2[1];
    var deltaX=X2-X1;
    var deltaY=Y2-Y1;
    var azimuth=Math.atan(deltaY/deltaX);
    azimuth=180*azimuth/Math.PI;
    var last_azimuth=0;
    if(deltaX>0)
        last_azimuth=90-azimuth;
    else if(deltaX<0)
        last_azimuth=270-azimuth;
    else if(deltaX==0&&deltaY<0)
        last_azimuth=180;
    last_azimuth = parseFloat(last_azimuth).toFixed(4);
    P1=ol.proj.toLonLat(P1);
    P2=ol.proj.toLonLat(P2);
    var output_distance=measureVar.wgs84Sphere.haversineDistance(P1, P2);
    output_distance=0.5399568*(Math.round(output_distance / 1000 * 100) / 100);
    output_distance = parseFloat(output_distance).toFixed(2);
    var output="距离:"+output_distance+'海里'+'<br/>'+"方位:"+last_azimuth+'°<a onclick=clearMeaure() onmouseover="changeMouseStyle(true)" onmouseout="changeMouseStyle(false)">✖</a>';
    return output;
}


//判定图层是否存在map
//判断当前图层是否存在地图中
function hasLayerInMap(layer){
    var layers=map.getLayers();
    for(var i=0;i<layers.getLength();i++){
        var item=layers.item(i);
        if(item===layer)
            return true;
    }
    return false;
}

//根据台风点绘制 线点
function drawTyphoon(typhoonpts,isFuture,istemp){
    var typhoonLineFeatures=[];
    var count=typhoonpts.length;
    var _line=[];
    for(var i=0;i<count;i++) {
        var _coor=ol.proj.fromLonLat([typhoonpts[i].lon, typhoonpts[i].lat]);
        var _geom=new ol.geom.Point(_coor);
        var _feature=new ol.Feature();
        _feature.setProperties(typhoonpts[i]);
        _feature.setGeometry(_geom);
        if(istemp)
            _feature.set('temp',1);
        typhoonLineFeatures.push(_feature);
        _line.push(_coor);
    }
    //台风已经经过的线路
    var timeDif;
    if(isFuture)
        timeDif=2;
    else
        timeDif=0;
    var taifengLine=new ol.Feature({
        timeDif:timeDif,
        geometry:new ol.geom.LineString(_line)
    });
    if(istemp)
        taifengLine.set('temp',1);
    Source.taifeng.addFeature(taifengLine);
    Source.taifeng.addFeatures(typhoonLineFeatures);
}