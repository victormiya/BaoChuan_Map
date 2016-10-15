var mapElement={};
var mapOverLay={};
function overlayInit()
{
	 //测量结果
    mapElement.measureTooltipElement = document.getElementById('measure');
    mapOverLay.measureTooltip = new ol.Overlay(({
        element: mapElement.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    }));
    //测量帮助提示
    mapElement.measureHelpTooltipElement = document.getElementById('measurehelp');
    mapOverLay.measureHelpTooltip = new ol.Overlay({
        element: mapElement.measureHelpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
	//台风
    mapElement.taifengElement = document.getElementById('taifeng');
    mapOverLay.taifeng = new ol.Overlay({
        element: mapElement.taifengElement,
        //offset: [0, -15],
        positioning: 'center-center'
    });

   var popupElement = document.getElementById('popup');
    mapElement.popupContentElement = document.getElementById('popup-content');
    mapElement.popupCloseElement = document.getElementById('popup-closer');
    mapElement.popupCloseElement.onclick = closePopup;
    mapOverLay.popupOverlay = new ol.Overlay(({
        element:popupElement,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));

}


//关闭显示信息
function closePopup()
{
    mapOverLay.popupOverlay.setPosition(undefined);
    mapElement.popupCloseElement.blur();
    return false;
}
//显示popup信息
function showPopup(feature)
{
    if(feature==undefined) {
        closePopup();
        return;
    }
    //删除临时台风点线
    Source.taifeng.getFeatures().forEach(function(feature,index){
        if(feature.get('temp')==1)
            Source.taifeng.removeFeature(feature);
    });
    var coor=feature.getGeometry().getCoordinates();
    var timeDif=parseInt(feature.get('timeDif'));
    if(timeDif==0)
    {
        console.log(feature.get('yubao'));
        mapElement.popupContentElement.innerHTML = '<h3>台风信息</h3>'+
            '<p>台风名称:'+feature.get('enName')+'</p>'+
            '<p>中心位置:'+feature.get('lon')+' E '+feature.get('lat')+' N</p>'+
            '<p>最大风速:'+feature.get('maxWindSustain')+'（米/秒）</p>'+
            '<p>最低气压:'+feature.get('airPressure')+'（百帕）</p>'+
            '<p>移动方向:'+feature.get('moveDirection')+'</p>'+
            '<p>移动速度:'+feature.get('moveSpeed')+'（公里/时）</p>';
        //加载预报点
        var temp=feature.get('yubao');
        if(temp.length>0){
            drawTyphoon(temp,true,true);
        }
    }
    else
    {
        mapElement.popupContentElement.innerHTML = '<h3>台风信息</h3>'+
            '<p>台风名称:'+feature.get('enName')+'</p>'+
            '<p>预报时间:'+feature.get('typhoonTime')+'</p>'+
            '<p>预报时效:'+feature.get('timeDif')+'小时</p>'+
            '<p>到达时间:'+feature.get('typhoonForecastTime')+'</p>'+
            '<p>最大风速:'+feature.get('maxWindSustain')+'（米/秒）</p>'+
            '<p>最低气压:'+feature.get('airPressure')+'（百帕）</p>'+
            '<p>移动方向:'+feature.get('moveDirection')+'</p>'+
            '<p>移动速度:'+feature.get('moveSpeed')+'（公里/时）</p>';
    }
    mapOverLay.popupOverlay.setPosition(coor);
}