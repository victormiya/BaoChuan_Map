var Layer={};
var Source={};
function layerinit()
{
    //街道图
    Layer.streetLayer=new ol.layer.Tile({
        visible: true,
        source: new ol.source.XYZ({
            crossOrigin: 'anonymous',
            url: 'http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2szh-CN!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965'
        })
    });
    //卫星图
    Layer.sateLayer=new ol.layer.Group({
        visible:false,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    crossOrigin: 'anonymous',
                    url: 'http://mt{0-1}.google.cn/maps/vt?lyrs=s@198&hl=zh-CN&gl=CN&&x={x}&y={y}&z={z}'
                })
            }),
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    crossOrigin: 'anonymous',
                    url: 'http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009253!3m9!2szh-CN!3sCN!5e18!12m1!1e50!12m3!1e37!2m1!1ssmartmaps!4e0&token=2064'
                })
            })
        ]
    })
    //海图
    Layer.haiTuLayer= new ol.layer.Tile({
        visible:false,
        source: new ol.source.XYZ({
            crossOrigin: 'anonymous',
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
        source: Source.drawSource
    });
    //临时标注图层

    //矢量船图层
    Layer.shipAll=new ol.layer.Vector({
        source:  new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: function(extent) {
                return 'http://112.126.89.175:8080/geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=ships:ta_pos_latest_new&' +
                    'outputFormat=application/json&srsname=EPSG:3857&' +
                    'bbox=' + extent.join(',') + ',EPSG:3857';
            },
            strategy: ol.loadingstrategy.bbox
        }),
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    //栅格船图层
    Layer.wmsship = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            crossOrigin: 'anonymous',
            url: 'http://112.126.89.175:8080/geoserver/gwc/service/wms',
            params: {'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                tiled: true,
                STYLES: '',
                LAYERS: 'ships:ta_pos_latest_new',
            }
        })
    });
    //台风图层
    Source.taifeng=new ol.source.Vector();
    Layer.taifeng=new ol.layer.Vector({
        source: Source.taifeng,
        style: function(feature,res){
            var style;
            var timeDif=parseInt(feature.get('timeDif'));
            if(timeDif==0)//当前点
                style=typhoonStyle;
            else//预报点
                style=typhoonFutureStyle;
            return [style];
        }
    });
}

//余位补齐
function padLeft(num, val) {
    return (new Array(num).join('0') + val).slice(-num);
}
