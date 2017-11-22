/**
 * Created by BHZXZbaibing on 2017/5/23.
 */
$(function(){

    //收缩
    add_file();

    //收缩
    project_server_upload_file_shrink();

})

//添加文件
function add_file(){
    for(var i = 0 ; i < 1;i++){
        var add_file_html = ' <div class="add_file_'+i+'"> ' +
            '<div class="form-group clear" style="width: 100%;display: inline-block"> ' +
            '<label for="" class="control-label col-lg-2">数据库名称</label> ' +
            '<div class="col-lg-9">' +
            '<input class=" form-control" id="data_base_name" name="project_name" minlength="2" type="text" required="">' +
            '</div>' +
            '<a href="javascript:void(0)" class="col-lg-1 shrink" onOff="on" style="float: right">' +
            '<span>收起</span> ' +
            '<i class="fa fa-angle-double-down"></i>' +
            '</a> ' +
        /*    ' <div class="progress progress-striped col-lg-3">' +
            ' <div class="percent">40%</div> ' +
            '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%"> ' +
            '<span class="sr-only">40% Complete (success)</span> </div>' +*/
            '</div> ' +
/*            '<button type="button" class="btn btn-default col-lg-1">暂停</button> ' +
            '<button type="button" class="btn btn-default col-lg-1" style="display: none">下载</button> ' +
            '<button type="button" class="btn btn-default col-lg-1">删除</button> ' +*/

            '</div> ' +
            '<div class="form"> ' +
            /*'<div class="form-group clear"> <label for="project_name" class="control-label col-lg-2">项目名称</label> ' +
            '<div class="col-lg-10"> ' +
            '<input class=" form-control project_name" id="project_name" name="project_name" minlength="2" type="text" required="">' +
            '</div> ' +
            '</div> ' +
            '<div class="form-group clear"> ' +
            '<label for="" class="control-label col-lg-2">相关人</label> ' +
            '<div class="col-lg-10"> ' +
            '<select class="form-control" id="related_person" name="project_type"> ' +
            '<option value="">请选择</option> ' +
            '</select>' +
            '</div> ' +
            '</div> ' +*/
            '<div class="form-group clear"> ' +
            '<label for="" class="control-label col-lg-2">概述</label> ' +
            '<div class="col-lg-10"> ' +
            '<textarea class="form-control " id="ccomment" name="comment" required=""></textarea> ' +
            '</div> ' +
            '</div> ' +
            /*'<div class="form-group clear"> ' +
            '<div class="col-lg-2"></div> ' +
            '<label class="col-lg-10"> ' +
            '<input type="checkbox" name="optionsRadios" id="optionsRadios1" value="1" checked>保存为大事记 </label> ' +
            '</div>' +
            '</div> ' +*/
            '</div>';

        $('.modal-body').append(add_file_html);

        $("#project_name").bind("change", function() {
            var vals =  $(this).val();
            var optionHtml = ''
            $.ajax({
                url: "http://" + location.host + "/project/project_database/get_user?" + new Date(),
                type: "POST",
                data:{'project_name':vals},
                dataType: "json",
                async: false,
                success: function (data) {
                    optionHtml += '<option value="">请选择</option>';
                    $.each(data,function(k,v){
                        optionHtml += '<option value="'+v.uid+'">'+ v.true_name +'</option>';
                    });
                    $('#related_person').html(optionHtml);
                }
            })
        });
        //上传
        batch_addition();

    }

}

//上传
function batch_addition(){
    $('.batch_addition').unbind().bind('click',function(){
        var baseName  = $('#data_base_name').val();
/*        var projectName  = $('#project_name').val();
        var relatedPerson  = $('#related_person').val();
        var relatedPersonname  = $('#related_person option:selected').text();*/
        var comment  = $('#ccomment').val();
        // var options  = $('#optionsRadios1').prop('checked') == true? 1 : null;
        $.ajax({
            url: "http://" + location.host + "/project/project_database/upload_server_database?" + new Date(),
            type: "POST",
            data:{
                'database_name':baseName,
                // 'project_name':projectName,
                // 'database_user':relatedPerson,
                // 'database_user_name':relatedPersonname,
                'database_sum':comment,
                'source_adds':original_file_url,
                'target_adds':object_file_url,
                // 'is_memorabilia':options
            },
            dataType: "json",
            success: function (data) {
                block(data.message,1000);
                if(data['code']<400) {
                    $("#jqGridList").jqGrid('setGridParam', {
                        datatype: 'json',
                        postData: {dataText: headersText},
                        page: 1
                    }).trigger("reloadGrid");
                    $('#database_management').find('a').click();
                }
            }
        });
    });

}

//收缩
function project_server_upload_file_shrink(){
    $('.shrink').unbind().bind('click',function(){

        if($(this).attr('onOff') == 'off'){
            $(this).parents('.add_file_0').siblings('.form').show(100);
            $(this).find('span').html('收起');
            $(this).find('i').removeClass('fa-angle-double-down');
            $(this).find('i').addClass('fa-angle-double-up');
            $(this).attr('onOff','on');
        }else if($(this).attr('onOff') == 'on'){
            $(this).parents('.add_file_0').siblings('.form').hide(100);
            $(this).find('span').html('展开');
            $(this).find('i').removeClass('fa-angle-double-up');
            $(this).find('i').addClass('fa-angle-double-down');
            $(this).attr('onOff','off');
        }

    })
}