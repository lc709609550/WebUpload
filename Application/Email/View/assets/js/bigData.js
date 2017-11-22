/**
 * Created by BHZXZbaibing on 2017/8/21.
 */
$(function(){
    $('.bigDataType .bigDataContent').height($('.bigDataType .bigDataLegend').parent().outerHeight(true)-$('.bigDataType .bigDataLegend').outerHeight(true)-20);
    $('.bigDataCase .bigDataContent').height($('.bigDataCase .bigDataLegend').parent().outerHeight(true)-$('.bigDataCase .bigDataLegend').outerHeight(true)-20);
    $('.bigEquipmentType .bigDataContent').height($('.bigEquipmentType .bigDataLegend').parent().outerHeight(true)-$('.bigEquipmentType .bigDataLegend').outerHeight(true)-20);
    $('.projectSegment .bigDataContent').height($('.projectSegment .bigDataLegend').parent().outerHeight(true)-$('.projectSegment .bigDataLegend').outerHeight(true)-20);
    $('.projectStatistics .bigDataContent').height($('.projectStatistics .bigDataLegend').parent().outerHeight(true)-$('.projectStatistics .bigDataLegend').outerHeight(true)-20);
    //数据类型统计
    dataCount();

    //echarts 地图
    chartsMap();

    //故障案例统计
    bigDataCase();

    //设备类型统计
    bigEquipmentType();

    //项目分布
    projectSegment();

    //项目统计
    projectStatistics();

    $('.corner').unbind().bind('click',function(){
        location.href = '/ui/main.html';
    })

});

function dataCount(){
    //统计
    $.ajax({
        url: "http://" + location.host + "/personal/home/count?" + new Date(),
        type: "POST",
        dataType: "json",
        success: function (result) {
            /*'files_count' => $filesCount,
                'fault_case_count' => $faultCaseCount,
                'project_ed_count' => $projectEdCount,
                'project_ing_count' => $projectIngCount*/
            $('#structured_data').html(result.structured_data);
            $('#structured_data_unit').text(result.structured_data_unit);
            $('#files_count').html(result.files_count);
            $('#fault_case_count').html(result.fault_case_count);
            $('#project_ed_count').html(result.project_ed_count);
            $('#project_ing_count').html(result.project_ing_count);
        }
    })
}
//echarts 地图
function chartsMap() {
    var myChart = echarts.init(document.getElementById('map'));
    myChart.setOption({
        series: [{
            type: 'map',
            map: 'china'
        }]
    });
    var geoCoordMap = {
        '上海': [121.4648, 31.2891],
        '东莞': [113.8953, 22.901],
        '东营': [118.7073, 37.5513],
        '中山': [113.4229, 22.478],
        '临汾': [111.4783, 36.1615],
        '临沂': [118.3118, 35.2936],
        '丹东': [124.541, 40.4242],
        '丽水': [119.5642, 28.1854],
        '乌鲁木齐': [87.9236, 43.5883],
        '佛山': [112.8955, 23.1097],
        '保定': [115.0488, 39.0948],
        '兰州': [103.5901, 36.3043],
        '包头': [110.3467, 41.4899],
        '北京': [116.4551, 40.2539],
        '北海': [109.314, 21.6211],
        '南京': [118.8062, 31.9208],
        '南宁': [108.479, 23.1152],
        '南昌': [116.0046, 28.6633],
        '南通': [121.1023, 32.1625],
        '厦门': [118.1689, 24.6478],
        '台州': [121.1353, 28.6688],
        '东海': [124.1353, 27.6688],
        '合肥': [117.29, 32.0581],
        '呼和浩特': [111.4124, 40.4901],
        '咸阳': [108.4131, 34.8706],
        '哈尔滨': [127.9688, 45.368],
        '唐山': [118.4766, 39.6826],
        '嘉兴': [120.9155, 30.6354],
        '大同': [113.7854, 39.8035],
        '大连': [122.2229, 39.4409],
        '天津': [117.4219, 39.4189],
        '太原': [112.3352, 37.9413],
        '威海': [121.9482, 37.1393],
        '宁波': [121.5967, 29.6466],
        '宝鸡': [107.1826, 34.3433],
        '宿迁': [118.5535, 33.7775],
        '常州': [119.4543, 31.5582],
        '广州': [113.5107, 23.2196],
        '廊坊': [116.521, 39.0509],
        '延安': [109.1052, 36.4252],
        '张家口': [115.1477, 40.8527],
        '徐州': [117.5208, 34.3268],
        '德州': [116.6858, 37.2107],
        '惠州': [114.6204, 23.1647],
        '成都': [103.9526, 30.7617],
        '扬州': [119.4653, 32.8162],
        '承德': [117.5757, 41.4075],
        '拉萨': [91.1865, 30.1465],
        '无锡': [120.3442, 31.5527],
        '日照': [119.2786, 35.5023],
        '昆明': [102.9199, 25.4663],
        '杭州': [119.5313, 29.8773],
        '枣庄': [117.323, 34.8926],
        '柳州': [109.3799, 24.9774],
        '株洲': [113.5327, 27.0319],
        '武汉': [114.3896, 30.6628],
        '汕头': [117.1692, 23.3405],
        '江门': [112.6318, 22.1484],
        '沈阳': [123.1238, 42.1216],
        '沧州': [116.8286, 38.2104],
        '河源': [114.917, 23.9722],
        '泉州': [118.3228, 25.1147],
        '泰安': [117.0264, 36.0516],
        '泰州': [120.0586, 32.5525],
        '济南': [117.1582, 36.8701],
        '济宁': [116.8286, 35.3375],
        '海口': [110.3893, 19.8516],
        '淄博': [118.0371, 36.6064],
        '淮安': [118.927, 33.4039],
        '深圳': [114.5435, 22.5439],
        '清远': [112.9175, 24.3292],
        '温州': [120.498, 27.8119],
        '渭南': [109.7864, 35.0299],
        '湖州': [119.8608, 30.7782],
        '湘潭': [112.5439, 27.7075],
        '南海': [115.5439, 16.7075],
        '滨州': [117.8174, 37.4963],
        '潍坊': [119.0918, 36.524],
        '烟台': [120.7397, 37.5128],
        '玉溪': [101.9312, 23.8898],
        '珠海': [113.7305, 22.1155],
        '盐城': [120.2234, 33.5577],
        '盘锦': [121.9482, 41.0449],
        '石家庄': [114.4995, 38.1006],
        '福州': [119.4543, 25.9222],
        '秦皇岛': [119.2126, 40.0232],
        '绍兴': [120.564, 29.7565],
        '聊城': [115.9167, 36.4032],
        '肇庆': [112.1265, 23.5822],
        '舟山': [122.2559, 30.2234],
        '苏州': [120.6519, 31.3989],
        '莱芜': [117.6526, 36.2714],
        '菏泽': [115.6201, 35.2057],
        '营口': [122.4316, 40.4297],
        '葫芦岛': [120.1575, 40.578],
        '衡水': [115.8838, 37.7161],
        '衢州': [118.6853, 28.8666],
        '西宁': [101.4038, 36.8207],
        '西安': [109.1162, 34.2004],
        '贵阳': [106.6992, 26.7682],
        '连云港': [119.1248, 34.552],
        '邢台': [114.8071, 37.2821],
        '邯郸': [114.4775, 36.535],
        '郑州': [113.4668, 34.6234],
        '鄂尔多斯': [108.9734, 39.2487],
        '重庆': [107.7539, 30.1904],
        '金华': [120.0037, 29.1028],
        '铜川': [109.0393, 35.1947],
        '银川': [106.3586, 38.1775],
        '镇江': [119.4763, 31.9702],
        '长春': [125.8154, 44.2584],
        '长沙': [113.0823, 28.2568],
        '长治': [112.8625, 36.4746],
        '阳泉': [113.4778, 38.0951],
        '青岛': [120.4651, 36.3373],
        '韶关': [113.7964, 24.7028]
    };
    var BJData = [
        {name: '无锡',nameT: '无锡', value: 100},
        {name: '葫芦岛',nameT: '葫芦岛', value: 100},
        {name: '哈尔滨',nameT: '哈尔滨', value: 100},
        {name: '武汉',nameT: '武汉', value: 100},
        {name: '东海',nameT: '东海', value: 100},
        {name: '湘潭',nameT: '湘潭', value: 100},
        {name: '南海',nameT: '南海', value: 100},
        {name: '无锡',nameT: '北京', value: 100},
        {name: '葫芦岛',nameT: '北京', value: 100},
        {name: '哈尔滨',nameT: '北京', value: 100},
        {name: '武汉',nameT: '北京', value: 100},
        {name: '东海',nameT: '北京', value: 100},
        {name: '南海',nameT: '北京', value: 100},
        {name: '湘潭',nameT: '北京', value: 100}
    ];
    var color = ['#DBD428'];
    var series = [];

    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem.name];
            var toCoord = geoCoordMap[dataItem.nameT];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem.name,
                    toName: dataItem.name,
                    coords: [fromCoord, toCoord]
                });
            }
        }
        return res;
    };

    [['北京', BJData]].forEach(function (item, i) {
        series.push({
                name: item[0].name,
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 3
                },
                lineStyle: {
                    normal: {
                        color: '#D15553',
                        width:1,
                        curveness: 0.2
                    }
                },

                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data: convertData(item[1])
            },
            {
                name: item[0].name,
                type: 'lines',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbolSize: 2
                },
                lineStyle: {
                    normal: {
                        color: '#D15553',
                        width: 1,
                        opacity: 1,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },
            {
                name: '',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    return val[2] / 8;
                },
                itemStyle: {
                    normal: {
                        color: color[i],
                        background:'#000'
                    }
                },
                data:item[1].map(function (dataItem) {
                    return {
                        name: dataItem.nameT,
                        value: geoCoordMap[dataItem.nameT].concat([dataItem.value])
                    };
                })
            });
    });
    option = {
        width: '40%',
        height: '65%',
        title: {
            text: '',
            subtext: '',
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        toolbox: {
            show : true,
            // 'horizontal' ¦ 'vertical'
            x: '50%',  // 水平安放位置，默认为全图右对齐，可选为：

            y: '20%',
            feature : {
                mark : {show: false},
                dataView : {show: false, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'left',
                            max: 1548
                        }
                    }
                },
                restore : {show: true},
                saveAsImage : {show: false}
            }
        },
        legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data: [],
            textStyle: {
                color: '#fff'
            },
            selectedMode: 'single'
        },
        geo: {
            map: 'china',
            selectedMode : 'multiple',
            label: {
                normal: {
                    show: false,
                    textStyle: {
                        color: '#fff'
                    }
                },
                emphasis: {
                    show: true,

                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaStyle:{color:'green'},
                    areaColor: 'rgba(32,100,109,0.9)',
                    borderColor: '#fff'
                },
                emphasis: {
                    areaColor: '#FEE619'
                }
            }
        },
        series: series
    };
    myChart.setOption(option);
    myChart.on('click', function (param) {
        if(param.name == "东海"){
            window.open("http://172.16.1.63/jidian_app/");
        }else if(param.name == "南海"){
            window.open("http://172.16.1.62/ui/");
        }

    })

}

//故障案例统计
function bigDataCase(){
    $.ajax({
        url: "http://" + location.host + "/personal/home/fault_type_count?" + new Date(),
        type: "POST",
        dataType: "json",
        success: function (result) {
            var dateA = [];
            var dateB = [];
            $.each(result,function(k,v){
                dateA.push(k);
                dateB.push({value:v, name:k});

            });
            var myChart = echarts.init(document.getElementById('bigDataCase'), 'infographic');
            option = {
                width: '100%',
                height: '100%',
                title : {
                    text: '',
                    subtext: '',
                    x:'center'
                },

                legend: {
                    x : 'center',
                    y : 'bottom',
                    data:dateA,
                    textStyle: {
                        color: '#fff'
                    }
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: false},
                        dataView : {show: false, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore : {show: false},
                        saveAsImage : {show: false}
                    }
                },
                calculable : true,
                readOnly:false,
                series : [
                    {
                        name:'来源于',
                        type:'pie',
                        radius : ['5%', '60%'],
                        center: ['40%', '40%'],
                        avoidLabelOverlap: false,

                        textStyle: {
                            background: '#fff'
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },

                            normal:{
                                label:{
                                    show: true,
                                    formatter: '{c}个',
                                    textStyle: {
                                        color: '#fff'
                                    },
                                    position: 'inside'
                                },
                                labelLine :{show:false}
                            }
                        },
                        data:dateB
                    }
                ]
            };
            myChart.setOption(option);
        }
    });
}

//设备类型统计
function bigEquipmentType(){
    $.ajax({
        url: "http://" + location.host + "/personal/home/equipment_type_count?" + new Date(),
        type: "POST",
        dataType: "json",
        success: function (result) {
            var dateA = [];
            var dateB = [];
            $.each(result,function(k,v){
                dateA.push(k);
                dateB.push({value:v, name:k});
            });
            var myChart = echarts.init(document.getElementById('bigEquipmentType'), 'infographic');
            option = {
                width: '55%',
                height: '100%',
                title : {
                    text: '',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    mark : {show: false},
                    dataView : {show: false, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore : {show: false},
                    saveAsImage : {show: false}
                },
                calculable : true,
                grid: {
                    x:100,
                    y: 0
                },
                xAxis : [
                    {
                        show:true,
                        type : 'value',
                        boundaryGap : false,
                        data : ['10','20','30','40','50','60','70','80','90','100'],
                        splitLine:{
                            show:false
                        },
                        axisTick:{
                            show:false
                        },
                        axisLine:{
                            show:false
                        },
                        axisLabel:{
                            interval : 150
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        scale: true,
                        show:true,
                        splitLine:{
                            show:false,
                            lineStyle:{
                                color:"#fff",
                                type:"solid"
                            }
                        },
                        data : dateA,
                        axisLabel:{
                            textStyle:{
                                color:"#fff"
                            }
                        },

                        axisLine:{
                            show:false
                        },
                        axisTick:{
                            show:false
                        },
                        lineStyle: {

                            color: '#483d8b',

                            type: 'dashed',

                            width: 1

                        }
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'bar',
                        barMaxWidth:25,//最大宽度
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{
                                barBorderRadius:51,
                                borderColor: '#66697C',
                                barBorderWidth: 1,

                                label:{
                                    show: true,
                                    formatter: '{c}台',
                                    textStyle: {
                                        color: '#fff'
                                    },
                                    position: 'right'
                                },
                                labelLine :{show:false},
                                color: function(params) {

                                    var index = params.dataIndex;
                                    var alternateNumber = 5;

                                    var newColor="";
                                    var colorList = ['#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                        '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                        '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                    ];

                                    if(index < alternateNumber){

                                        newColor = colorList[index];

                                    }else{

                                        var rowNumber=Math.floor(index/alternateNumber);

                                        newColor = colorList[index-rowNumber*alternateNumber];
                                    }
                                    return newColor
                                }
                            }

                        },
                        data:dateB,
                        barGap:1
                    }
                ]
            };
            myChart.setOption(option);
        }
    });

}

//项目分布
function projectSegment(){


    $.ajax({
        url: "http://" + location.host + "/personal/home/project_distribution?" + new Date(),
        type: "POST",
        dataType: "json",
        success: function (result) {
            var myChart = echarts.init(document.getElementById('projectSegment'), 'infographic');
            var dateA = [];
            var dateB = [];
            var dateC = [];
            var nuaa = 0;
            $.each(result,function(k,v){
                dateA.push(k);
                dateB.push(v.cou);
                dateC.push(v.ing);
                nuaa++;
                //if(nuaa == 4){
                //    return false;
                //}
            });

            option = {
                width: '70%',
                height: '89%',
                title : {
                    text: '',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['总数','进行中'],
                    x : 'center',
                    y : 'bottom',
                    textStyle: {
                        color: '#fff'
                    }
                },
                toolbox: {
                    mark : {show: false},
                    dataView : {show: false, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore : {show: false},
                    saveAsImage : {show: false}
                },
                calculable : true,
                grid: {
                    x: 60,
                    y: 0
                },
                xAxis : [
                    {
                        show:true,
                        type : 'value',
                        boundaryGap : false,
                        data : [],
                        splitLine:{
                            show:false
                        },
                        axisTick:{
                            show:false,
                            length:110
                        },
                        axisLine:{
                            show:false
                        },
                        axisLabel:{
                            interval : 150
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        scale: true,
                        show:true,
                        splitLine:{
                            show:false,
                            lineStyle:{
                                color:"#fff",
                                type:"solid"
                            }
                        },
                        data : dateA,
                        axisLabel:{
                            textStyle:{
                                color:"#fff"
                            }
                        },

                        axisLine:{
                            show:false
                        },
                        axisTick:{
                            show:false
                        },
                        lineStyle: {

                            color: '#483d8b',

                            type: 'dashed',

                            width: 1

                        }
                    }
                ],
                series : [
                    {
                        name:'总数',
                        type:'bar',
                        barMaxWidth:25,//最大宽度
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{
                                barBorderRadius:50,
                                borderColor: '#66697C',
                                barBorderWidth: 2,
                                label:{
                                    show: true,
                                    formatter: '{c}个',
                                    textStyle: {
                                        color: '#fff'
                                    },
                                    position: 'right'
                                },
                                labelLine :{show:false},
                                color:'#FBF320'
                            }
                        },
                        data:dateB
                    },
                    {
                        name: '进行中',
                        type: 'bar',
                        barMaxWidth:25,//最大宽度
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{
                                barBorderRadius:50,
                                borderColor: '#66697C',
                                barBorderWidth: 2,
                                label:{
                                    show: true,
                                    formatter: '{c}个',
                                    textStyle: {
                                        color: '#fff'
                                    },
                                    position: 'right'
                                },
                                labelLine :{show:false},
                                color:'#65F5F3'
                            }
                        },
                        data: dateC,
                        barGap:1
                    }
                ]
            };
            myChart.setOption(option);
        }
    });

}

//项目统计
function projectStatistics(){
    $.ajax({
        url: "http://" + location.host + "/personal/home/project_total?" + new Date(),
        type: "POST",
        dataType: "json",
        success: function (result) {
            var dateA = [];
            var dateB = [];
            $.each(result,function(k,v){
                dateA.push(k);
                dateB.push(v);
            });
            var myChart = echarts.init(document.getElementById('projectStatistics'), 'infographic');
            option = {
                width: '88%',
                height: '80%',
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[],
                    x : 'center',
                    y : 'bottom',
                    textStyle: {
                        color: '#fff'
                    }
                },
                toolbox: {
                    mark : {show: false},
                    dataView : {show: false, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore : {show: false},
                    saveAsImage : {show: false}
                },
                calculable : true,
                grid: {
                    x: 15,
                    y: 15,
                    y2:15,
                    x2:0
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data :dateA,
                        axisLabel:{
                            textStyle:{
                                color:"#fff"
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel:{
                            textStyle:{
                                color:"#fff"
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'line',
                        smooth: true,
                        stack: '总量',
                        data:dateB,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal:{
                                barBorderRadius:50,
                                borderColor: '#66697C',
                                barBorderWidth: 2,
                                label:{
                                    show: true,
                                    formatter: '',
                                    textStyle: {
                                        color: '#fff'
                                    },
                                    position: 'inside'
                                },
                                labelLine :{show:false},
                                color:'#65F5F3'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    });
}