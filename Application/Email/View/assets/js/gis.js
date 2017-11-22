/**
 * Created by BHZXZbaibing on 2017/5/9.
 */
var vectorLayer=null;
var vectorSource=null;
var markers = null;
var map=null;
$(function () {

    //初始化GIS地图高度计算
/*    var docH = $('#sidebar').height();
    var headerH = $('.header').height();
    $('#map').height(docH - headerH - 1);*/

    //地图缩放
    map_zoom();

    //GIS构建地图
    GisEvent();

    //故障案例
    highchartEvent();

})

//GIS构建地图
function GisEvent() {

    $('#map').unbind().bind('mousewheel',function(){
        return false;
    });

    /**
     * Create an overlay to anchor the popup to the map.
     */

    var controls = new Array();


    // //缩放控件
    // var zoomSliderControl = new ol.control.ZoomSlider({});
    //
    // controls.push(zoomSliderControl);
    if( $('.centereds').attr('uid') == 1){
        var mousePositionControl = new ol.control.MousePosition({
            className: 'custom-mouse-position',
            target: document.getElementById('location'),
            coordinateFormat: ol.coordinate.createStringXY(5),//保留5位小数
            undefinedHTML: ' '
        });
        controls.push(mousePositionControl);
    }

    //复位控件
    var zoomToExtentControl = new ol.control.ZoomToExtent({
        extent: [-7800000.40459,-17685864.40459, -18571955.55842, -17571955.55842]
    });

    controls.push(zoomToExtentControl);
    var view = new ol.View({

        projection:"EPSG:3857", //投影，默认的投影是球墨卡托（EPSG：3857),以米为单位
        center: ol.proj.transform([-118.34, -82.8], "EPSG:4326","EPSG:3857"),
        zoom: 5, //默认级别
        minZoom: 5, //可用的缩放级别
        maxZoom: 8,//可用的缩放级别
        extent:[-17685864.40459,-19685864.40459, -10571955.55842, -15571955.55842],

    });
    map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: '../static/tile/{z}/{x}/{-y}.png'
                })
            })
            // new ol.layer.Tile({
            //     source: new ol.source.TileDebug({
            //         projection: 'EPSG:3857',
            //         tileGrid: osmSource.getTileGrid()
            //     })
            // })
        ],
        target: 'map',
        controls: ol.control.defaults({
            attribution: false,
        }).extend(controls),
        view: view
    });

    markers = markerBlock();

    map.addLayer(markers);

    var element = document.getElementById('popup');

    var popup = new ol.Overlay({
        element: element,
        positioning: 'bottom-center',
        autoPan: true,
        position:'10px',
        autoPanAnimation: {
            duration: 250
        },
        stopEvent: false,
        //offset: [2, -25]
    });


    map.addOverlay(popup);


    var target = map.getTarget();

    var jTarget = typeof target === "string" ? $("#" + target) : $(target);

    // change mouse cursor when over marker
    map.on('dblclick', function(evt) {
        evt.preventDefault();
    })
    //鼠标移入移出事件
    $(map.getViewport()).on('mousemove', function (e) {

        var pixel = map.getEventPixel(e.originalEvent);

        var hit = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            return feature;
        });

        if (hit) {
            jTarget.css({"cursor": "pointer"});
        } else {
            jTarget.css("cursor", "");
        }
    })

    // display popup on click
    map.on('click', function(evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
        });

        if (feature) {

            var coordinates = feature.getGeometry().getCoordinates();

            var lstrCaption = '<div class="jqGrids"><table id="jqGridList"></table><div id="jqGridPager"></div></div>';

                $(element).find('.alarm_status').html('' + feature.getProperties().name + '项目信息');
                $(element).find('#popup-content').html(lstrCaption);

                popup.setPosition(coordinates);

                //绘制表格
                $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
                $("#jqGridList").jqGrid({
                    url: "http://" + location.host + "/personal/project/get_gis_project?" + new Date(),
                    mtype: "GET",
                    postData: {'name': feature.getProperties().city},
                    styleUI: 'Bootstrap',
                    datatype: "json",
                    colModel: [
                        {label: 'id', name: 'id', width: 100, 'align': 'center','hidden':true},
                        {label: 'parent_pro', name: 'parent_pro', width: 100, 'align': 'center','hidden':true},
                        {label: '项目名称', name: 'project_name', width: 100, 'align': 'center'},
                        {label: '项目负责人', name: 'true_name', width: 100, 'align': 'center'},
                        {label: '当前阶段', name: 'project_state', width: 100, 'align': 'center'}
                    ],
                    hoverrows: true,
                    height: '150',
                    width: "auto",
                    multiselect: false,//复选框
                    viewrecords: false,//显示记录
                    pginput: true,
                    pgtext: "第{0}页 / 共{1}页",
                    loaduis: 'enable',
                    rowNum: 4,
                    autoheight: true, //自动拉伸高度
                    autowidth: true, //自动拉伸宽度
                    pager: "#jqGridPager",
                    onSelectRow:function(rowid){
                        get_project(rowid);
                    },
                    loadComplete:function () {
                        $('#jqGridList tr').eq(1).click();
                    }
                });

                var closer = document.getElementById('popup-closer');

                closer.onclick = function () {
                    popup.setPosition(undefined);
                    closer.blur();
                    return false;
                };

            //平移
            //view.setCenter(coordinate)
        } /*else {

         $('#popup').popover('destroy');
         }*/
    });

}

function markerBlock(){


    //准备图层
    if(!sinadot_isValidObject(vectorLayer)){

        vectorLayer = new ol.layer.Vector();
    }


    //准备资源
    if(!sinadot_isValidObject(vectorSource)){

        vectorSource = new ol.source.Vector();
    }

    //添加marker
    $.getJSON("http://"+location.host+"/personal/gis/index?"+new Date(), function(data){

        var iconFeatureArray= vectorSource.getFeatures();

        if(iconFeatureArray.length>0){

            for(var i=0;i<iconFeatureArray.length;i++){

                vectorSource.removeFeature(iconFeatureArray[i]);
            }

        }

        if(data.length>0){

            for(var i=0; i<data.length;i++){
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point([data[i].x, data[i].y]),
                    name:data[i].name,
                    city:data[i].project_city,
                    population: 4000,
                    rainfall: 500
                });

                var num = data[i].project_city_num;
                var rad = data[i].gis_size/2;
                iconFeatureArray[i]=iconFeature;

                //var img_src='assets/img/pupu.png';

                var iconStyle = new ol.style.Style({

   /*                 image: new ol.style.Icon(({
                        anchor: [8,8],
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        rotateWithView: false,
                        size: [50,50],
                        opacity: 1,
                        scale: 0.9,
                        src: img_src
                    })),*/

                    image: new ol.style.Circle({
                        radius:rad,
                        opacity: 0.5,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(255,255,255,0.8)'
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(67,142,219,0.8)'
                        })
                    }),
                    text: new ol.style.Text({
                        text: ''+num+'',
                        fill: new ol.style.Fill({
                            color: '#fff'
                        })
                    }),

                    zIndex: 100000

                });


                iconFeature.setStyle(iconStyle);

                vectorSource.addFeature(iconFeature);

            }

            vectorLayer.setSource(vectorSource);

        }
    });

    return vectorLayer;

}
