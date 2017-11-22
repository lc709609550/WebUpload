/**
 * Created by BHZXZbaibing on 2017/6/15.
 */
var gis_tree_data = {};//设备层级
$(function(){

    admin_gis_table();

    $('#gis_cha').unbind().bind('click',function () {
        gis_cha();
    })

});

function gis_cha(){
    var city_name = $('#gis_search').val();

    var postData = {
           "city_name":city_name
           };
           var loSettings = {
               url: "http://"+location.host+"/admin/Gis/getInfo?"+new Date(),
               postData: postData,
               page: 1
           };
           $("#jqGridList").jqGrid('setGridParam', loSettings).trigger("reloadGrid");

}


//表格创建
function admin_gis_table() {
    //绘制表格
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var heights = $('#sidebar').height()  - 198;
    var jqTableH = heights - $('.headers').outerHeight(true);
    var tableNumber = Math.floor(jqTableH/35) < 5 ? 5 : Math.floor(jqTableH/35);

    $("#jqGridList").jqGrid({
        url: "http://"+location.host+"/admin/Gis/getInfo?"+new Date(),
        mtype: "GET",
        styleUI: 'Bootstrap',
        datatype: "json",
        colModel: [
            //{label: '序号', name: 'id', width: 25, align: 'center'},
            //{label: 'parent_id', name: 'parent', width: 15, align: 'center'},
            //{label: 'factory_uuid', name: 'factory_uuid', width: 15, align: 'center'},
            //{label: 'code', name: 'code', width: 15, align: 'center'},
            //{label: '集团名称', name: 'group_name', width: 15, align: 'center'},
            //{label: '公司名称', name: 'company_name', width: 15, align: 'center'},
            //{label: '分厂名称', name: 'factory_name', width: 15, align: 'center'},
            //{label: '名称', name: 'text', width: 15, align: 'center'},
            //{label: '装置', name: 'set_name', width: 15, align: 'center'},
            //{label: '设备名称', name: 'plant_name', width: 15, align: 'center'},
            //{label: '项目名称', name: 'project_name', align: 'center'},
            {label: '省份', name: 'province_name', align: 'center'},
            {label: '城市', name: 'name', align: 'center'},
            {label: '横坐标', name: 'x', align: 'center', editable: true, editrules: {number: true}},
            {label: '纵坐标', name: 'y', align: 'center', editable: true, editrules: {number: true}},
            //{label: '级别', name: 'level', width: 25, align: 'center'}
        ],
        // hoverrows: true,
        height: jqTableH,
        width: "auto",
        viewrecords: true,//显示记录
        pginput: true,
        pgtext: "第{0}页 / 共{1}页",
        loaduis: 'enable',
        rowNum: tableNumber,
        autoheight: true, //自动拉伸高度
        autowidth: true, //自动拉伸宽度
        pager: "#jqGridPager",
        cellEdit: true,
        cellSubmit: 'remote',
        rownumbers: true, //是否显示行数
        gridComplete:function(){
            $("#jqGridList").jqGrid('setLabel',0, '序号', 'labelstyle');
        },
        beforeSubmitCell :function (rowid, cellname, value, iRow, iCol){
            var Editdata = $("#jqGridList").jqGrid('getRowData', rowid);
            return {project_city:Editdata.project_city}
        },
        cellurl: "http://"+location.host+"/admin/Gis/edit",
        ondblClickRow:function() {

        },
        afterSaveCell: function (rowid, name, val, iRow, iCol) {
            $("#jqGrid  List").jqGrid().trigger("reloadGrid");
        }
    });
}

//function admin_gis_tree(){
//
//    $.ajax({
//        url: "http://"+location.host+"/Admin/Gis/get_tree?"+new Date(),
//        type: "POST",
//        async: false,
//        dataType: "json",
//        error:function(){
//        },
//        success: function(data){
//            if(data.code>400){
//
//            }else{
//                gis_tree_data = data;
//            }
//        }
//    })
//
//    $('#object_file_tree').jstree({
//        core : {
//            check_callback : true,
//            data :gis_tree_data
//        },
//        checkbox: {
//            // 禁用级联选中
//            'three_state': true,
//            'cascade': 'undetermined' //有三个选项，up, down, undetermined; 使用前需要先禁用three_state
//        },
//        plugins : ["wholerow","contextmenu"],
//        contextmenu: {
//            "items": {
//                "create": null,
//                "multiple": false, // 允许多选
//                "rename": null,
//                "remove": null,
//                "ccp": null
//            }
//        }
//    });
//    $('#object_file_tree').on('changed.jstree',function(e,data){
//        //当前选中节点的id
//
//        //console.log( data.instance.get_node(data.selected[0]).original.code);
//        //console.log(data.instance.get_node(data.selected[0]).id);
//        var domId = data.instance.get_node(data.selected[0]).id;
//        var code = data.instance.get_node(data.selected[0]).original.code;
//        //当前选中节点的文本值
//        //console.log(data.instance.get_node(data.selected[0]).text);
//        var value = data.instance.get_node(data.selected[0]).text;
//            var postData = {
//                "id": domId,code:code
//            };
//            var loSettings = {
//                url: "http://"+location.host+"/admin/Gis/getInfo?"+new Date(),
//                postData: postData,
//                page: 1
//            };
//            $("#jqGridList").jqGrid('setGridParam', loSettings).trigger("reloadGrid");
//    });
//}