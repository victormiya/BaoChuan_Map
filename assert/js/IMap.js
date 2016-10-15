//底图类型
var baseMap={
    ocean:1,
    streetMap:2,
    sateMap:3
};
//气象类型
/*var weatheaType={
    气压:1,
    500mb:2,
    风:3,
    浪高:4,
    涌:5,
    洋流:6,
    海温:7,
    能见度:8
};*/

//海图，街道图，卫星图切换
function baseMapSwitch(basemap)
{
    switch(basemap){
        case baseMap.sateMap:
            Layer.streetLayer.setVisible(true);
            Layer.sateLayer.setVisible(false);
            Layer.haiTuLayer.setVisible(false);
            break;
        case baseMap.sateMap:
            Layer.streetLayer.setVisible(false);
            Layer.sateLayer.setVisible(true);
            Layer.haiTuLayer.setVisible(false);
            break;
        case baseMap.ocean:
            Layer.streetLayer.setVisible(false);
            Layer.sateLayer.setVisible(false);
            Layer.haiTuLayer.setVisible(true);
            break;
    }
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
    Source.taifeng.clear();
    Layer.taifeng.setVisible(true);
    //暂时测试使用
    $.ajax({
        url:'a.json',
        type:'get',
        success:function(data) {
            //='0'的是当前卫星点
            var arr=data.result.filter(function(item,index){
                if(index>0){
                    if((item.lon-data.result[index-1].lon)<-180)
                        item.lon+=360;
                    else if((item.lon-data.result[index-1].lon)>180)
                        item.lon-=360;
                }
                return item.timeDif==='0';
            });
            arr.forEach(function(item,index){
                item.yubao=data.result.filter(function(item1,index){
                    return item1.timeDif!=='0'&&item1.typhoonTime==item.typhoonTime&&item1!==item //找到与当前点时间一致的
                })
            });
            //绘制当前台风经过的实际点线
            drawTyphoon(arr,false);
            var current=arr[arr.length-1];
            //最后一个点是当前台风点
            var center=ol.proj.fromLonLat([current.lon, current.lat]);
            mapOverLay.taifeng.setPosition(center);
            //显示最后一个点的预报点和线路
            var yubao=current.yubao;
            drawTyphoon(yubao,true);
            //加载暴风圈，烈风圈
            var rad_neq34kt=parseInt(current.rad_neq34kt);//烈风圈
            var rad_neq50kt=parseInt(current.rad_neq50kt);//暴风圈
            var liefeng=new ol.Feature({
                geometry:new ol.geom.Circle(center,rad_neq34kt*1000)
            });
            var baofeng=new ol.Feature({
                geometry:new ol.geom.Circle(center,rad_neq50kt*1000)
            });
            liefeng.setStyle(liefengStyle);
            baofeng.setStyle(baofengStyle);
            Source.taifeng.addFeatures([liefeng,baofeng]);
        }
    });
}
//隐藏台风图层
function hideTaiFeng()
{
    Layer.taifeng.setVisible(false);
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

//20万船分布图展示或隐藏
function showAllShips(visible){
    if(visible)//加载20万船只分布图
    {
        if(!hasLayerInMap(Layer.wmsship))
            map.addLayer(Layer.wmsship);
    }
    else
    {
        if(hasLayerInMap(Layer.wmsship))
            map.removeLayer(Layer.wmsship);
    }
}
