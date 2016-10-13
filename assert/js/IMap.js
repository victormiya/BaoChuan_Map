﻿//底图类型
var baseMap={
    ocean:1,
    streetMap:2,
    sateMap:3
};
//气象类型
var weatheaType={

};

//海图，街道图，卫星图切换
function baseMapSwitch(basemap)
{

}

//叠加气象信息
function showWeatherLayer(weatheatype)
{

}
//隐藏气象信息
function hideWeatherLayer()
{

}

//绘制台风图层
function showTaiFeng()
{
    //暂时测试使用
    $.ajax({
        url:'a.json',
        type:'get',
        success:function(data) {
            var line=[];
            //='0'的是当前卫星点
            var arr=data.result.filter(function(item,index){
                return item.timeDif==='0'
            });
            //>0是预报点
            for(var i=0;i<arr.length;i++) {
                line.push(ol.proj.fromLonLat([arr[i].lon, arr[i].lat]));
                mapOverLay.taifeng.setPosition(ol.proj.fromLonLat([arr[i].lon, arr[i].lat]));
            }
            var feature=new ol.Feature({
                geometry:new ol.geom.LineString(line)
            });
            Source.drawSource.addFeature(feature);
        }
    });
}
//隐藏台风图层
function hideTaiFeng()
{

}

//测量方位
function measurePosition()
{
    measureinit();
    map.on('pointermove', measureMoveHandler);
    addMeasureinteraction('Circle');
}

//测量面
function measureArea()
{
    measureinit();
    map.on('pointermove', measureMoveHandler);
    addMeasureinteraction('Polygon');
}
//测量距离
function measureDistance()
{
    measureinit();
    map.on('pointermove', measureMoveHandler);
    addMeasureinteraction('LineString');
}

//绘制标记
function drawMark()
{
    var draw =new ol.interaction.Draw({
        type:'Polygon',
        source:vectorSource
    });
    map.addInteraction(draw);
}

//屏幕截图
function mapPrint()
{
    _print();

}
//更新特定船舶实时位置
function updateShipLocate(shipid,locate)
{

}

//显示某些船
function showShipbyCodes(shipCodes)
{


}
//隐藏某些船舶
function hideShipbyCodes(shipCodes)
{

}


