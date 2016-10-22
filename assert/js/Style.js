//测量样式
var measureStyle=new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0)',
        lineDash: [10, 10],
        width: 2
    })
});

//台风经过样式
var typhoonStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: '#ffb61e'
    }),
    stroke: new ol.style.Stroke({
        color: '#ffb61e',
        width: 2
    }),
    image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
            color: '#ffb61e'
        })
    })
});
//台风预报样式
var typhoonFutureStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: '#ed5736'
    }),
    stroke: new ol.style.Stroke({
        color: '#ed5736',
        lineDash: [10, 10],
        width: 2
    }),
    image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
            color: '#ed5736'
        })
    })
});
//暴风圈
var baofengStyle=new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.2)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgb(255,0,0)',
        width: 2
    })
});

//烈风圈
var liefengStyle=new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(0,0,255,0.1)'
    }),
    stroke: new ol.style.Stroke({
        color: 'rgb(0,0,255)',
        width: 2
    })
});

//标注样式
var drawGeomStyleFunction=function(feature,resolution){
    var type=feature.get('type');
    switch(type){
        case drawStyleType['测试点1']:

            break;
        case drawStyleType['测试点2']:

            break;
        case drawStyleType['测试线1']:

            break;
        case drawStyleType['测试线2']:

            break;
        case drawStyleType['测试面1']:

            break;
        case drawStyleType['测试面2']:

            break;
    }
}



