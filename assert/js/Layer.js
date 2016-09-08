var Layer={};
var Source={};
function layerinit()
{
    //街道图
    Layer.streetLayer=new ol.layer.Tile({
        visible: true,
        source: new ol.source.XYZ({
            url: 'http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2szh-CN!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965'
        })
    });
    //卫星图
    Layer.sateLayer=new ol.layer.Group({
        visible:false,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'http://mt{0-1}.google.cn/maps/vt?lyrs=s@198&hl=zh-CN&gl=CN&&x={x}&y={y}&z={z}'
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009253!3m9!2szh-CN!3sCN!5e18!12m1!1e50!12m3!1e37!2m1!1ssmartmaps!4e0&token=2064'
                })
            })
        ]
    })
    //海图
    Layer.haiTuLayer= new ol.layer.Tile({
        visible:false,
        source: new ol.source.XYZ({
            tileUrlFunction: function (xyz, obj1, obj2) {
                if (!xyz) {
                    return "";
                }
                var z = xyz[0]-2;
                var x = Math.abs(xyz[1]);
                var y = Math.abs(xyz[2]+1);
                x='C'+padLeft(8,x.toString(16));
                y='R'+padLeft(8,y.toString(16));
                z='L'+padLeft(2,z);
                return "http://enc-cmap.myships.com/ChartMap/"+z+"/"+y+"/"+x+".jpg";
            }
        })
    })
    //测量图层
    Source.measureSource=new ol.source.Vector();
    Layer.measureLayer=new ol.layer.Vector({
        source: Source.measureSource,
        style: measureStyle
    });
    //绘制图层
    Source.drawSource=new ol.source.Vector();
    Layer.drawLayer=new ol.layer.Vector({
        source: Source.drawSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0)',
                lineDash: [10, 10],
                width: 2
            })
        })
    });
    //临时标注图层

    //矢量船图层


    //切片船图层
    Layer.aa= new ol.layer.Tile({
        visible:true,
        source: new ol.source.XYZ({
            tileUrlFunction: function (xyz, obj1, obj2) {
                if (!xyz) {
                    return "";
                }
                var z=xyz[0];
                var x=Math.abs(xyz[1]);
                var y=Math.abs(xyz[2]);
                var xyz1=convert(z,x,y);
                x=xyz1[0];
                y=xyz1[1];
                z=xyz1[2];
                var shift = z / 2;
                var half = 2 << shift;
                var digits = 1;
                if (half > 10)
                    digits = parseInt(Math.log(half)/Math.log(10)) + 1;
                var halfx = parseInt(x / half);
                var halfy = parseInt(y / half);
                x=parseInt(x);
                y=parseInt(y)+1;
                var url="http://localhost:8090/cite_road/EPSG_900913_"+padLeft(2,z)+"/"+padLeft(digits,halfx)+"_"+padLeft(digits,halfy)+"/"+padLeft(2*digits,x)+"_"+padLeft(2*digits,y)+".png";
                //console.log(url);
                return url;
            }
        })
    })
}

//余位补齐
function padLeft(num, val) {
    return (new Array(num).join('0') + val).slice(-num);
}


function convert(zoomLevel, x, y) {

    var extent = Math.pow(2, zoomLevel);

    if (x < 0 || x > extent - 1) {
        console.log("The X coordinate is not sane: " + x);
        return;
    }

    if (y < 0 || y > extent - 1) {
        console.log("The Y coordinate is not sane: " + y);
        return;
    }

    var gridLoc = [x, extent - y - 1, zoomLevel];

    return gridLoc;
}
