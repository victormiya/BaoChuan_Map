
//工具条设置，仅仅供单元测试使用
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



