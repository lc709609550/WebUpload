/*
 * 实时报警统计JS,BaiBing
 * Date:2017-02-21
 */

var BHXZ = {}

BHXZ.jqGrid = function(jqGridR){
    var jqGrids = {
        ID: '',
        idPager: '',
        url: '',
        avpostdatas: {},
        dataTypes: "json",
        styleUIs: 'Bootstrap',
        hoverrows:true,
        viewrecords: true,
        multiselect: false,
        rownumbers: false,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        numberS: true, //显示行号
        autoScroll:true,
        heights: "100%",
        loRowNumber:100,
        pgtexts: "第{0}页 共{1}页",
        loaduis: 'enable',
        colNames: [],
        colModel: [],
        loads: function(){},
        onDbClick: function(){},
        onClick: function(){},
        gridComplete:function(){},
        searchs: true,//是否启用查询
        subGrids: false,//是否启用子表格
        subGridUrl:'',
        subGridModel:[],
        subGridRowExpanded:function(){}
    }

    $.extend(jqGrids,jqGridR);

    jqGrids.ID.jqGrid({
        url: jqGrids.url,
        postData: jqGrids.avpostdatas,
        datatype: jqGrids.dataTypes,
        styleUI: jqGrids.styleUIs,
        hoverrows:jqGrids.hoverrows ,
        colNames: jqGrids.colNames,
        colModel: jqGrids.colModel,
        viewrecords: jqGrids.viewrecords,
        multiselect: jqGrids.multiselect,
        rownumbers: jqGrids.rownumbers,
        autoheight:jqGrids.autoheight, //自动拉伸高度
        autowidth:jqGrids.autowidth, //自动拉伸宽度
        autoScroll: jqGrids.autoScroll,
        height: jqGrids.heights,
        rowNum: jqGrids.loRowNumber,
        pgtext: jqGrids.pgtexts,
        pager: jqGrids.idPager,//分页控件的id
        loadui: jqGrids.loaduis,
        loadComplete: jqGrids.loads,//获取数据
        ondblClickRow: jqGrids.onDbClick,//双击
        onCellSelect: jqGrids.onClick,//单机
        gridComplete:jqGrids.gridComplete,
        subGrid: jqGrids.subGrids,//是否启用子表格
        subGridUrl: jqGrids.subGridUrl,
        subGridModel: jqGrids.subGridModel,
        subGridRowExpanded:jqGrids.subGridRowExpanded
    });

    jqGrids.ID.jqGrid('navGrid',jqGrids.idPager,{edit:false,add:false,del:false,search:jqGrids.searchs},{},{},{},{multipleSearch:true});

    // 设置jqgrid的宽度
    $(window).bind('resize', function () {
        var width = $('.jqGrid_wrapper').width();
        jqGrids.ID.setGridWidth(width);
    });

    $('.tooltips').bind('click',function(){
        var width = $('.jqGrid_wrapper').width();
        jqGrids.ID.setGridWidth(width);
    })
}
