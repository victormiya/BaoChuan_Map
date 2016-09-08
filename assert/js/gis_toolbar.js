
//工具条设置
function setToolBar(){
    //UI按钮交互
  
	//平移
    $("#btnPan").click(function () {
        buttoninit();
    });

    //测量
    $("#btnMeasure").click(function () {
        buttoninit();
        measureLength();
    });
    //测面
    $("#btnMeasureArea").click(function () {
        buttoninit();
        measureArea();
    });
	$("btnClass").tooltip();
};


function buttoninit()
{
    //移除测量移动提示
    map.un('pointermove', measureMoveHandler);
    //移除测量
    map.removeInteraction(measureinteraction);
    mapOverLay.measureHelpTooltip.setPosition(undefined);

}

//测量
function measureLength() {
    map.on('pointermove', measureMoveHandler);
    addMeasureinteraction('LineString');
}
//测面
function measureArea() {
    map.on('pointermove', measureMoveHandler);
    addMeasureinteraction('Polygon');
}



//地图输出
function print()
{
    var exportPNGElement=document.getElementById("export-png");
    if ('download' in exportPNGElement) {
            map.once('postcompose', function (event) {
                var canvas = event.context.canvas;
                exportPNGElement.href = canvas.toDataURL('image/png');
                exportPNGElement.click();
            });
            map.renderSync();
    }
}










var measureVar={
    wgs84Sphere:new ol.Sphere(6378137),
    sketch:null,
    geodesic:false,
    continuePolygonMsg:'点击开始绘制面',
    continueLineMsg:'点击开始绘制线'
};
var measureMoveHandler = function(evt) {
    if (evt.dragging) {
        return;
    }
    var helpMsg = '点击开始绘制';
    var tooltipCoord = evt.coordinate;
    if (measureVar.sketch) {
        var output;
        var geom = (measureVar.sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            output = formatArea( (geom));
            helpMsg = measureVar.continuePolygonMsg;
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof ol.geom.LineString) {
            output = formatLength((geom));
            helpMsg = measureVar.continueLineMsg;
            tooltipCoord = geom.getLastCoordinate();
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
//清楚测量结果
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
        length = Math.round(line.getLength() * 100) / 100;
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
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
}



function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
}




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
    measureVar.sketch = null;
}


