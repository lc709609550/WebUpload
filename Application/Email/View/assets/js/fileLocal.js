/**
 * Created by BHZXZbaibing on 2017/8/11.
 */
var nble = 0;
var attrs = {};
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
        server: "http://" + location.host + "/project/files/up?"+ new Date(),

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#picker',

        duplicate: true

    });


    $.ajax({
        url: "http://" + location.host + "/project/files/get_project_unit?" + new Date(),
        type: "POST",
        async: false,
        data: {

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
        state = 'pending',
        nums = 0;
    var add_file_html = '';
    var type_array = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf','gif','jpeg','jpg','png','ico','mp4','3gp','avi','wmv','rm','rmvb','flv','mkv'];
    // $.inArray()
    // 当有文件添加进来的时候
    uploader.on('filesQueued', function (file) {
        nums+= file.length;
        if(nums > 20){
            block('文件选择过多！请重新选择！',1000);
            nums = nums - file.length;
            return false;
        }else{
            $.each(file,function(k,v){
                if(v.size < 1024*1024*50){
                    if ($.inArray(v.ext.toLowerCase(), type_array) != -1){
                        add_file_html = '<div  id="' + v.id + '" class="item"  qualified="0"> ' +
                            '<div class="form-group clear"> ' +
                            '<label for="" class="control-label col-lg-1">标题</label> ' +
                            '<div class="col-lg-4">' +
                            '<input value="' + v.name + '" class=" form-control title_input" minlength="2" type="text" required="">' +
                            '</div>' +
                            '<p class="state" style="display: inline-block;float: left;">等待上传...</p>' +
                            '<button type="button" class="btn btn-default col-lg-1" style="display: none">下载</button> ' +
                            '<button type="button" class="btn btn-default col-lg-1 file_remove" file_e="'+ v.id +'">删除</button> ' +
                            '<a href="javascript:void(0)" class="col-lg-1 shrink" onOff="off"><span>展开</span> ' +
                            '<i class="fa fa-angle-double-down"></i>' +
                            '</a> ' +
                            '</div> ' +
                            '<div class="form" style="display: none;"> ' +
                            '<div class="form-group clear" style="35px"> ' +
                            '<label for="" class="control-label col-lg-1">简介</label> ' +
                            '<div class="col-lg-11"> ' +
                            '<textarea class="form-control briefing_input" id="comment" name="comment" required="" style="height:85px">' + v.name + '</textarea> ' +
                            '</div> ' +
                            '</div> ' +
                            '</div> ' +
                            '</div>';
                    }else {
                        add_file_html = '<div  id="' + v.id + '" class="item"  qualified="1"> ' +
                            '<div class="form-group clear"> ' +
                            '<label for="" class="control-label col-lg-1">标题</label> ' +
                            '<div class="col-lg-4">' +
                            '<input value="' + v.name + '" class=" form-control title_input" minlength="2" type="text" required="">' +
                            '</div>' +
                            '<p class="state" style="display: inline-block;float: left;">文件类型不符请重新选取...</p>' +
                            '<button type="button" class="btn btn-default col-lg-1" style="display: none">下载</button> ' +
                            '<button type="button" class="btn btn-default col-lg-1 file_remove" file_e="'+ v.id +'">删除</button> ' +
                            '<a href="javascript:void(0)" class="col-lg-1 shrink" onOff="off"><span>展开</span> ' +
                            '<i class="fa fa-angle-double-down"></i>' +
                            '</a> ' +
                            '</div> ' +
                            '<div class="form" style="display: none;"> ' +
                            '<div class="form-group clear" style="35px"> ' +
                            '<label for="" class="control-label col-lg-1">简介</label> ' +
                            '<div class="col-lg-11"> ' +
                            '<textarea class="form-control briefing_input" id="comment" name="comment" required="" style="height:85px">' + v.name + '</textarea> ' +
                            '</div> ' +
                            '</div> ' +
                            '</div> ' +
                            '</div>';
                    }

                }else{
                    add_file_html = '<div  id="' + v.id + '" class="item"  qualified="1"> ' +
                        '<div class="form-group clear"> ' +
                        '<label for="" class="control-label col-lg-1">标题</label> ' +
                        '<div class="col-lg-4">' +
                        '<input value="' + v.name + '" class=" form-control title_input" minlength="2" type="text" required="">' +
                        '</div>' +
                        '<p class="state" style="display: inline-block;float: left;" >文件过大请重新选取...</p>' +
                        '<button type="button" class="btn btn-default col-lg-1" style="display: none">下载</button> ' +
                        '<button type="button" class="btn btn-default col-lg-1 file_remove" file_e="'+ v.id +'">删除</button> ' +
                        '<a href="javascript:void(0)" class="col-lg-1 shrink" onOff="off"><span>展开</span> ' +
                        '<i class="fa fa-angle-double-down"></i>' +
                        '</a> ' +
                        '</div> ' +
                        '<div class="form" style="display: none;"> ' +
                        '<div class="form-group clear" style="35px"> ' +
                        '<label for="" class="control-label col-lg-1">简介</label> ' +
                        '<div class="col-lg-11"> ' +
                        '<textarea class="form-control briefing_input" id="comment" name="comment" required="" style="height:85px">' + v.name + '</textarea> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div>';
                }
                list.append(add_file_html);
                $.each($('#thelist').find('.item'),function(k,v){
                    if($(v).attr('qualified') == 1){
                        $('#ctlBtn').addClass('disabled');
                        return false;
                    }else{
                        $('#ctlBtn').removeClass('disabled');
                    }
                })
                project_upload_file_shrink();

                if (nble == 0) {
                    $('#thelist>div').eq(0).find('.shrink').click();
                    nble = 1;
                }

                $('#' + v.id + ' .owned_equipment').jstree({
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
                $('#' + v.id + ' .owned_equipment').on('changed.jstree', function (e, data) {
                    var nodes = $('#' + v.id + ' .owned_equipment').jstree().get_checked(true);
                    v.statusText = '';
                    $.each(nodes, function (key, val) {
                        v.statusText += val.original.equipment_uuid + ',';
                    })
                });
            });
            //删除
            $('.file_remove').unbind().bind('click',function(){
                nums--;
                $.each($('#thelist').find('.item'),function(k,v){
                    if(k == 0){
                        $('#ctlBtn').addClass('disabled');
                    }else{
                        if($(v).attr('qualified') == 1){
                            $('#ctlBtn').addClass('disabled');
                            return false;
                        }else{
                            $('#ctlBtn').removeClass('disabled');
                        }
                    }
                })
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
                url: "http://" + location.host + "/project/files/save_file?" + new Date(),
                type: "POST",
                async: false,
                data: {
                    'parent_id': fid,
                    'file_size': ret.size,
                    'file_type': ret.type,
                    'thumbpath': ret.thumb,
                    'ext_type': ret.ext_type,
                    'oldfilename': $('#' + file.id + ' .title_input').val(),
                    'filepath': ret.url,
                    'model': 'files',
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
    uploader.on('uploadFinished', function () {
        //初始化数据
        ajaxData(fid,level,oState);
    });
    $btn.on('click', function () {
        var setTrue = true;
        $('#thelist input').each(function (k,v) {
            var name = $(v).val();
            if(name == ''){
                block('文件名不能为空!','1000');
                setTrue = false;
                return false;
            }
            var d=/\.[^\.]+$/.exec(name);
            if(!d){
                block('请确认文件后缀名!','1000');
                setTrue = false;
                return false;
            }
        });

        if(!setTrue){
           return false;
        }
        if(!$(this).is('.disabled')){
            if (state === 'uploading') {
                uploader.stop();
            } else {
                uploader.upload();
            }
        }
    });


}


//批量添加
function batch_addition() {

    $('.batch_addition').unbind().bind('click', function () {
        if(!$(this).is('.disabled')){
            $('.modalContent').html('');
            $.ajax({
                'url': './batchUploadFile.html',
                "type": "GET",
                'success': function (data) {
                    $('.modalContent').html(data);
                    $('#batchUploadFile').modal('show');
                }
            });
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
