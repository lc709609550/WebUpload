/**
 * Created by BHZXZbaibing on 2017/5/25.
 */

var nble = 0;

$(function(){

    //上传
    upload();

    //批量添加
    batch_addition();
})



//上传
function upload(){

    var $ = jQuery,
        uploader;
    var jsonVal;

    uploader = WebUploader.create({

        // 不压缩image
        resize: false,

        // swf文件路径
        swf: './assets/js/webuploader/Uploader.swf',

        // 文件接收服务端。
        server: "http://" + location.host + "/project/project_details/up?project_name=" + BHXZ_PROJECT.project_name,

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker',

        duplicate: true

    });


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

    var $btn = $('#ctlBtn'),
        list = $('#thelist'),
        state = 'pending';
    // 当有文件添加进来的时候
    uploader.on('filesQueued', function (file) {
        if(file.length > 20){
            art.dialog({
                content: '文件选择过多！请重新选择！',
                ok: function () {
                },
                cancelVal: '关闭',
                cancel: true //为true等价于function(){}
            }).time(3);

            return false;
        }else{
            $.each(file,function(k,v){

                var add_file_html = '<div  id="' + v.id + '" class="item"> ' +
                    '<div class="form-group clear"> ' +
                    '<label for="" class="control-label col-lg-1">标题</label> ' +
                    '<div class="col-lg-4">' +
                    '<input value="' + v.name + '" class=" form-control title_input" id="project_name" name="project_name" minlength="2" type="text" required="">' +
                    '</div>' +
                    '<p class="state" style="display: inline-block;float: left;">等待上传...</p>' +
                    '<button type="button" class="btn btn-default col-lg-1" style="display: none">下载</button> ' +
                    '<button type="button" class="btn btn-default col-lg-1 file_remove" file_e="'+ v.id +'">删除</button> ' +
                    '<a href="javascript:void(0)" class="col-lg-1 shrink" onOff="off"><span>展开</span> ' +
                    '<i class="fa fa-angle-double-down"></i></a> </div> <div class="form" style="display: none;"> ' +
                    '<div class="form-group clear"> <label class="control-label col-lg-1">分类</label> ' +
                    '<div class="col-lg-11"> ' +
                    '<input class=" form-control classification_input" minlength="2" type="text" required="" value="' + BHXZ_PROJECT.project_task_name + '" disabled>' +
                    '</div> ' +
                    '</div> ' +
                    '<div class="form-group clear"> ' +
                    '<label for="" class="control-label col-lg-1">所属设备</label> ' +
                    '<div class="col-lg-11"> ' +
                    '<div class="owned_equipment" ></div>' +
                    '</div> ' +
                    '</div> ' +
                    '<div class="form-group clear"> ' +
                    '<label for="" class="control-label col-lg-1">简介</label> ' +
                    '<div class="col-lg-11"> ' +
                    '<textarea class="form-control briefing_input" id="comment" name="comment" required="">' + v.name + '</textarea> ' +
                    '</div> ' +
                    '</div> ' +
                    '<div class="form-group clear"> ' +
                    '<div class="col-lg-1"></div> ' +
                    '<label class="col-lg-11"> ' +
                    '<input type="checkbox" name="memorabilia" id="memorabilia" class="memorabilia">保存为大事记 </label> ' +
                    '</div>' +
                    '</div> ' +
                    '</div>';
                list.append(add_file_html);

                project_upload_file_shrink();
                if (nble == 0) {
                    $('#thelist>div').eq(0).find('.shrink').click();
                    nble = 1;
                }

                $('#' + v.id + ' .owned_equipment').jstree({
                    core: {
                        check_callback: true,
                        data: jsonVal
                        /*data : {
                         'url': function (node) {
                         return node.id === '#' ?
                         "http://" + location.host + "/v1/tree/get_unit_info?group_name=中国石化&company_name=扬子石化&factory_name=化工厂" :
                         "http://" + location.host + "/v1/tree/get_equipment_uuid?group_name=中国石化&company_name=扬子石化&factory_name=化工厂&"+node.id;
                         },
                         'data': function (node) {
                         console.log(node);
                         return {'id': node.id};
                         }
                         }*/
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
                $('#' + v.id + ' .owned_equipment').on('changed.jstree', function (e, data) {
                    var nodes = $('#' + v.id + ' .owned_equipment').jstree().get_checked(true);
                    v.statusText = '';
                    $.each(nodes, function (key, val) {
                        v.statusText += val.original.equipment_uuid + ',';
                    })
                });
            })
            //删除
            $('.file_remove').unbind().bind('click',function(){
                $(this).parents('.item').remove();
                files =  $(this).attr('file_e');
                nble = 0;
                uploader.removeFile(files);
            });
        }
    });

    uploader.on('uploadSuccess', function (file, ret, hds) {

        if(ret.state == 1){
            $.ajax({
                url: "http://" + location.host + "/project/project_details/save_file?" + new Date(),
                type: "POST",
                async: false,
                data: {
                    'p_id': BHXZ_PROJECT.project_details,
                    'j_id': BHXZ_PROJECT.project_satge,
                    't_id': BHXZ_PROJECT.project_task,
                    'parent_id': BHXZ_PROJECT.project_parent,
                    'file_size': ret.size,
                    'file_type': ret.type,
                    'thumbpath': ret.thumb,
                    'oldfilename': $('#' + file.id + ' .title_input').val(),
                    'filepath': ret.url,
                    'classification': $('#' + file.id + ' .classification_input').val(),
                    'owned_equipment': file.statusText || attrs.statusText || '',
                    'introduction': $('#' + file.id + ' .briefing_input').val(),
                    'memorabilia': $('#' + file.id + ' .memorabilia[type="checkbox"]').is(':checked') ? 1 : 0
                },
                dataType: "json",
                error: function () {

                },
                success: function (result) {
                    if (result.code > 400) {
                        $('#' + file.id).find('p.state').text(ret.info);
                    } else {
                        $('#' + file.id).find('p.state').text('上传成功');
                        jQuery("#project_details_jqGridList").trigger("reloadGrid");

                        uploader.removeFile(file.id);
                    }
                    $(this).removeClass('fileupload-processing');
                }

            });
        }else{
            $('#' + file.id).find('p.state').text(ret.info);
            return false;
        }
        return false;
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css('width', percentage * 100 + '%');
    });

    uploader.on('uploadError', function (file) {
        $('#' + file.id).find('p.state').text('上传出错');
        uploader.reset();
    });

    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').fadeOut();
    });

    $btn.on('click', function () {
        if (state === 'uploading') {
            uploader.stop();
        } else {
            uploader.upload();
        }
    });


}


//收缩
function project_upload_file_shrink() {

    $('.shrink').unbind().bind('click', function () {
        if ($(this).attr('onOff') == 'off') {
            $(this).parent().siblings('.form').show(100);
            $(this).find('span').html('收起');
            $(this).find('i').removeClass('fa-angle-double-down');
            $(this).find('i').addClass('fa-angle-double-up');
            $(this).attr('onOff', 'on');
        } else if ($(this).attr('onOff') == 'on') {
            $(this).parent().siblings('.form').hide(100);
            $(this).find('span').html('展开');
            $(this).find('i').removeClass('fa-angle-double-up');
            $(this).find('i').addClass('fa-angle-double-down');
            $(this).attr('onOff', 'off');
        }

    })

}


//批量添加
function batch_addition(){
    $('.batch_addition').unbind().bind('click',function(){
        $('.modalContent').html('');
        $.ajax({
            'url': './project_server_upload_batch_addition.html',
            "type": "GET",
            'success': function (data) {
                $('.modalContent').html(data);
                $('#project_type').val(BHXZ_PROJECT.project_task_name);
                $('#project_server_upload_batch_addition').modal('show');
            }
        });
    });

}