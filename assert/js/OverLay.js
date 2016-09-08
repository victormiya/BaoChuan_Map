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
function showPopup(coor,feature)
{
    if(feature==undefined) {
        closePopup();
        return;
    }
    var properties=feature.get
    var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
        coor, 'EPSG:3857', 'EPSG:4326'));
    mapElement.popupContentElement.innerHTML = '<h3>宗地信息</h3><p>地籍号:'+feature.get('djh')+'</p>'+
        '<p>通讯地址:'+feature.get('txdz')+'</p>'+
        '<p>土地坐落:'+feature.get('tdzl')+'</p>'+
        '<p>土地用途:'+feature.get('tdyt')+'</p>'+
        '<p>实测面积:'+feature.get('scmj').toFixed(2)+'</p>'+
        '<p>发证面积:'+feature.get('fzmj').toFixed(2)+'</p>'+
        '<p>权利人:'+feature.get('bzzjrxm')+'</p>';
    mapOverLay.popupOverlay.setPosition(coor);

}