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
    });



    //海图
    var projection = new ol.proj.get("EPSG:3857");
    var projectionExtent = projection.getExtent();
    var height = ol.extent.getHeight(projectionExtent);
    var width = ol.extent.getWidth(projectionExtent);
    var tileSize = [256,256];
    var maxResolution = Math.max(width / tileSize[0], height / tileSize[1]);
    var length = 18 + 1;
    var resolutions = new Array(length);
    for (var z = 0; z < length; ++z) {
        resolutions[z] = maxResolution / Math.pow(2, z);
    }
    var tilegrid = new ol.tilegrid.TileGrid({
        origin: [projectionExtent[0]+1450,projectionExtent[3]+22500],
        tileSize:tileSize,
        resolutions: resolutions
    });


    Layer.haiTuLayer= new ol.layer.Tile({
        visible:false,
        extent: projectionExtent,
        source: new ol.source.XYZ({
            //crossOrigin: 'anonymous',
            projection: projection,
            tileGrid: tilegrid,
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
    //风
    Layer.windLayer=new ol.layer.Tile({
        visible: true,
        source: new ol.source.XYZ({
            //crossOrigin: 'anonymous',
            url: 'http://218.241.183.164:7919/Wind_20161021_00_20161021_00?REQUEST=GetTile&X={x}&Y={y}&Z={z}'
        })
    });
    //气压
    Layer.pressureLayer=new ol.layer.Tile({
        visible: true,
        source: new ol.source.XYZ({
            //crossOrigin: 'anonymous',
            url: 'http://218.241.183.164:7919/Pressure_20161021_00_20161021_00?REQUEST=GetTile&X={x}&Y={y}&Z={z}'
        })
    });
    //500mb
    Layer._500MBLayer=new ol.layer.Tile({
        visible: true,
        source: new ol.source.XYZ({
            //crossOrigin: 'anonymous',
            url: 'http://218.241.183.164:7919/500MB_20161021_00_20161021_00?REQUEST=GetTile&X={x}&Y={y}&Z={z}'
        })
    });
    //浪高
    Layer.waveHeightLayer=new ol.layer.Tile({
        visible: true,
        source: new ol.source.XYZ({
            //crossOrigin: 'anonymous',
            url: 'http://218.241.183.164:7919/WaveHeight_20161021_00_20161021_00?REQUEST=GetTile&X={x}&Y={y}&Z={z}'
        })
    });
    //涌
    Layer.swellLayer=new ol.layer.Tile({
        visible: true,
        source: new ol.source.XYZ({
            //crossOrigin: 'anonymous',
            url: 'http://218.241.183.164:7919/Swell_20161021_00_20161021_00?REQUEST=GetTile&X={x}&Y={y}&Z={z}'
        })
    });
    //洋流
    Layer.currentLayer=new ol.layer.Tile({
        visible: true,
        source: new ol.source.XYZ({
            //crossOrigin: 'anonymous',
            url: 'http://218.241.183.164:7919/Current_20161021_00_20161021_00?REQUEST=GetTile&X={x}&Y={y}&Z={z}'
        })
    });
    //海温
    Layer.seaTempLayer=new ol.layer.Tile({
        visible: true,
        source: new ol.source.XYZ({
            //crossOrigin: 'anonymous',
            url: 'http://218.241.183.164:7919/SeaTemp_20161021_00_20161021_00?REQUEST=GetTile&X={x}&Y={y}&Z={z}'
        })
    });
    //海温
    Layer.visibilityLayer=new ol.layer.Tile({
        visible: true,
        source: new ol.source.XYZ({
            //crossOrigin: 'anonymous',
            url: 'http://218.241.183.164:7919/Visibility_20161021_00_20161021_00?REQUEST=GetTile&X={x}&Y={y}&Z={z}'
        })
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
                LAYERS: 'ships:ta_pos_latest_new'
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
