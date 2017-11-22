/*
 * 实时报警统计JS,BaiBing
 * Date:2017-02-21
 */
var bhxz = {};

var avpostdata = {};


$(function(){
    $('#statEnav ul li a').unbind().bind('click',function(){
        var stateHtml =  $(this).find('em').html();
        $(this).parents('li').addClass('active');
        $(this).parents('li').siblings().removeClass('active');
        avpostdata = {
            state:stateHtml
        };
        bhxz.realTimeAlerting(avpostdata);
    });
    bhxz.realTimeAlerting(avpostdata);
});

//实时报警统计
bhxz.realTimeAlerting = function(avpostdata){

    //实时报警统计
    var height = $("#sidebar").height()-270;
    var loRowNumber = Math.floor(height/40) || 15;
    var colModel = [
        { name: 'company_name', index: 'company_name', width: 60 },
        { name: 'factory_name', index: 'factory_name', width: 60 },
        { name: 'equipment_name', index: 'equipment_name', width: 60 },
        { name: 'equipment_type_name', index: 'equipment_type_name', width: 60 },
        { name: 'alarm_alias', index: 'alarm_alias', width: 60 }
    ];

    BHXZ.colName(colModel);

    var jqGridR = {
        ID:$("#jqGridList"),
        idPager:'#jqGridPager',
        url:'/v1/plant/get_plant_info',
        avpostdatas: avpostdata,
        loRowNumber:loRowNumber,
        colNames:colNames,
        colModel:colModel,
        loads:function (data) {
            $('.gen-case span').html(data.records);
        },
        gridComplete:function(rowid){
            var ids = jQuery("#jqGridList").jqGrid("getDataIDs");
            var rowDatas =jqGridR.ID.jqGrid('getRowData', rowid);
            var modify = "";
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];

                    //"<a href=\"#\" style=\"color:#f60\" onclick=\"Delete(" + id + ")\">"+rowDatas[i].alarm_alias+"</a>"
                if(rowDatas[i].alarm_alias == '危险'){
                    modify = '<span class="label label-danger label-mini">'+rowDatas[i].alarm_alias+'</span>';
                }else if(rowDatas[i].alarm_alias == '报警'){
                    modify = '<span class="label label-warning label-mini">'+rowDatas[i].alarm_alias+'</span>';
                }else if(rowDatas[i].alarm_alias == '正常'){
                    modify = '<span class="label label-success label-mini">'+rowDatas[i].alarm_alias+'</span>';
                }else if(rowDatas[i].alarm_alias == '停车'){
                    modify = '<span class="label label-primary label-mini">'+rowDatas[i].alarm_alias+'</span>';
                }else if(rowDatas[i].alarm_alias == '断网'){
                    modify = '<span class="label label-default label-mini">'+rowDatas[i].alarm_alias+'</span>';
                }

                jQuery("#jqGridList").jqGrid("setRowData", id, { alarm_alias: modify });
            }
        },
        onClick:function(rowid){
            //var rowDatas =jqGridR.ID.jqGrid('getRowData', rowid);
        }
    }

    BHXZ.jqGrid(jqGridR);
}