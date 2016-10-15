
//工具条设置，仅仅供单元测试使用
function setToolBar(){
    //UI按钮交互
  
	//平移
    $("#btnPan").click(function () {

    });

    //测量
    $("#btnMeasure").click(function () {
        measureDistance();
    });
    //测面
    $("#btnMeasureArea").click(function () {
        measureArea();
    });

    //电子方位角
    $("#btnangle").click(function () {
        measurePosition();
    });

    //展示20万船
    $("#btn20万").click(function () {
        showAllShips(true);
    });
    $("#btnprint").click(function () {
        mapPrint();
    });

    //测试台风
    $("#btntaifeng").click(function () {
        showTaiFeng();
    });
    $("#layerselect").change(function (e) {
        var lable= e.currentTarget.selectedOptions[0].text;
        switch(lable){
            case '谷歌街道图':
                baseMapSwitch(baseMap.streetMap);
                break;
            case '谷歌卫星图':
                baseMapSwitch(baseMap.sateMap);
                break;
            case '海图':
                baseMapSwitch(baseMap.ocean);
                break;
        }
    });



	$("btnClass").tooltip();
};






