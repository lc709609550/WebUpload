/**
 * Created by BHZXZbaibing on 2017/5/23.
 */
var statusText,jsonVal;
$(function(){

    //添加文件
    add_file();

})

//添加文件
function add_file(){

    $.ajax({
        url: "http://" + location.host + "/project/project_details/get_project_unit?" + new Date(),
        type: "POST",
        async: false,
        data: {
            'group_name': BHXZ_PROJECT.group_name,
            'company_name': BHXZ_PROJECT.company_name,
            'factory_name': BHXZ_PROJECT.project_name
        },
        dataType: "json",
        error: function () {

        },
        success: function (result) {
            jsonVal = result;
            return false;
        }
    });

    for(var i = 0 ; i < 1;i++){

        var add_file_html = '<div  id="add_file_'+i+'" class="item"> ' +
            '<div class="form-group clear"> ' +
            '<label for="" class="control-label col-lg-2">标题</label> ' +
            '<div class="col-lg-8">' +
            '<input value="" class=" form-control title_input" id="project_name" name="project_name" minlength="2" type="text" required="">' +

            '</div>' +
            '<a href="javascript:void(0)" class="col-lg-2 shrink" onOff="on"><span>收起</span> ' +
            '<i class="fa fa-angle-double-down"></i></a> ' +
            '</div> ' +
            '<div class="form"> ' +
            '<div class="form-group clear"> <label class="control-label col-lg-2">分类</label> ' +
            '<div class="col-lg-10"> ' +
            '<input class=" form-control classification_input" minlength="2" type="text" required="" value="">' +
            '</div> ' +
            '</div> ' +
            '<div class="form-group clear"> ' +
            '<label for="" class="control-label col-lg-2">所属设备</label> ' +
            '<div class="col-lg-10"> ' +
            '<div class="owned_equipment" ></div>' +
            '</div> ' +
            '</div> ' +
            '<div class="form-group clear"> ' +
            '<label for="" class="control-label col-lg-2">简介</label> ' +
            '<div class="col-lg-10"> ' +
            '<textarea class="form-control briefing_input" id="comment" name="comment" required=""></textarea> ' +
            '</div> ' +
            '</div> ' +
            '<div class="form-group clear"> ' +
            '<div class="col-lg-2"></div> ' +
            '<label class="col-lg-10"> ' +
            '<input type="checkbox" name="memorabilia" id="memorabilia" class="memorabilia">保存为大事记 </label> ' +
            '</div>' +
            '</div> ' +
            '</div>';
        $('.modal-body').append(add_file_html);

        $('#add_file_'+i+' .owned_equipment').jstree({
            core: {
                check_callback: true,
                data: jsonVal
            },
            checkbox: {
                // 禁用级联选中
                'three_state': true,
                'cascade': 'undetermined' //有三个选项，up, down, undetermined; 使用前需要先禁用three_state
            },
            plugins: ['checkbox', 'search'], //如果使用checkbox效率会降低, 'wholerow'会把线隐藏掉
            contextmenu: {
                "items": {
                    "create": null,
                    "multiple": true, // 允许多选
                    "rename": null,
                    "remove": null,
                    "ccp": null
                }
            }
        });

        $('#add_file_'+i+' .owned_equipment').on('changed.jstree', function (e, data) {
            var nodes = $('#add_file_'+i+' .owned_equipment').jstree().get_checked(true);
            statusText = '';
            $.each(nodes, function (key, val) {
                statusText += val.original.equipment_uuid + ',';
            })
        });

        //收缩
        project_server_upload_file_shrink();

        //上传
        batch_addition();

    }

}

//上传
function batch_addition(){
    $('.batch_addition').unbind().bind('click',function(){
        var baseName  = $('#data_base_name').val();
        var projectName  = $('#project_name').val();
        var relatedPerson  = $('#related_person').val();
        var relatedPersonname  = $('#related_person option:selected').text();
        var comment  = $('#ccomment').val();
        var options = $('#optionsRadios1').prop('checked') == true? 1 : null;

        $.ajax({
            url: "http://" + location.host + "/project/project_details/save_file?" + new Date(),
            type: "POST",
            async: false,
            data: {
                'p_id': BHXZ_PROJECT.project_details,
                'j_id': BHXZ_PROJECT.project_satge,
                't_id': BHXZ_PROJECT.project_task,
                'parent_id': BHXZ_PROJECT.project_parent,
                'file_size': '',
                'file_type': '',
                'thumbpath': '',
                'oldfilename': baseName,
                'filepath': object_file_url,
                'classification': '',
                // 'owned_equipment': file.statusText || attrs.statusText || '',
                'introduction': comment,
                'memorabilia': options ? 1 : 0
            },
            dataType: "json",
            error: function () {

            },
            success: function (result) {
                if (result.code > 400) {
                    block('失败!',1000);
                } else {
                    jQuery("#project_details_jqGridList").trigger("reloadGrid");
                }
            }

        });

    });

}

//收缩
function project_server_upload_file_shrink(){
    $('.shrink').unbind().bind('click',function(){

        if($(this).attr('onOff') == 'off'){
            $(this).parent().siblings('.form').show(100);
            $(this).find('span').html('收起');
            $(this).find('i').removeClass('fa-angle-double-down');
            $(this).find('i').addClass('fa-angle-double-up');
            $(this).attr('onOff','on');
        }else if($(this).attr('onOff') == 'on'){
            $(this).parent().siblings('.form').hide(100);
            $(this).find('span').html('展开');
            $(this).find('i').removeClass('fa-angle-double-up');
            $(this).find('i').addClass('fa-angle-double-down');
            $(this).attr('onOff','off');
        }

    })
}