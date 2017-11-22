/**
 * Created by BHZXZbaibing on 2017/8/9.
 */
var num = 0;
var onOff = 'off';
var oState = 1;
var fid = '';
var level = 1;
var idArr = [],idAttr = ['全部文件'];
var usid = $('.centereds').attr('uid');
var screens = '';
$(function () {

    $('.olHead .fileSize').hide();

    $('.olHead .fileTime').hide();

    if (auth.length != 0) {
        $('.fileBtn').html('');
        var a = '';
        $.each(auth, function (index, dome) {

            if (dome.type == 'add') {
                a += '<button type="button" class="btn btn-primary fileLocal" id="fileLocal"><i class="fa fa-upload"></i>&nbsp;本地上传</button>';
            } else if (dome.type == 'create') {
                a += '<button type="button" class="btn btn-primary newFile" id="newFile"><i class="fa fa-folder-o"></i>&nbsp;新建文件夹</button>';
                a += '<button type="button" class="btn btn-primary filedScreen" id="filedAll" screen=""><i class="fa fa-file-pdf-o"></i>&nbsp;全部文件</button>';
                a += '<button type="button" class="btn btn-primary filedScreen" id="filedDoc" screen="1"><i class="fa fa-file-pdf-o"></i>&nbsp;文档</button>';
                a += '<button type="button" class="btn btn-primary filedScreen" id="fileImage" screen="2"><i class="fa fa-file-image-o"></i>&nbsp;图片</button>';
                a += '<button type="button" class="btn btn-primary filedScreen" id="fileVideo" screen="3"><i class="fa fa-file-movie-o"></i>&nbsp;视频</button>';
            } else if (dome.type == 'export') {
                a += '<button type="button" class="btn btn-primary hideBtn downloadFile" id="downloadFile">下载</button>';
            }else if (dome.type == 'delete') {
                a += '<button type="button" class="btn btn-primary hideBtn deleteFile" id="deleteFile"><i class="fa fa-trash-o"></i>&nbsp;删除</button>';
            } else if (dome.type == 'edit') {
                a += '<button type="button" class="btn btn-primary hideBtn renameFile" id="renameFile">重命名</button>';
            }

        });
        a += '<i class="fa fa-align-justify switch" id="switch"></i>';
        $('.fileBtn').append(a);
    }

    $('.files').height($('#main-content').outerHeight(true) -$('#file .headers ').outerHeight(true)-79)

    $(".files").mCustomScrollbar({
        live:true,
        theme:"minimal",
        scrollInertia:0
    });

    //图表切换
    $('.switch').unbind().bind('click',function(){
        $('.hideBtn').hide();
        if(oState == 0){
            $(this).removeClass('fa-align-justify');

            $(this).addClass('fa-th-large');

            $('.olHead .fileSize').hide();

            $('.olHead .fileTime').hide();

            num = 0;

            $('.olHead .fileName .checkbox').prop('checked',false);

            $('.olHead .asbfGB3b').html('文件夹');

            oState = 1;
        }else{
            $(this).removeClass('fa-th-large');

            $(this).addClass('fa-align-justify');

            $('.olHead .fileSize').show();

            $('.olHead .fileTime').show();

            num = 0;

            $('.olHead .fileName .checkbox').prop('checked',false);

            $('.olHead .asbfGB3b').html('文件夹');

            oState = 0;
        }

        //初始化数据
        ajaxData(fid,level,oState,screens);
    });
    
    $('.filedScreen').unbind().bind('click',function () {
        screens = $(this).attr('screen');
        $(this).addClass('active');
        $(this).siblings('.filedScreen').removeClass('active');
        num = 0;
        onOff = 'off';
        oState = 1;
        fid = '';
        level = 1;
        idArr = [];
        idAttr = ['全部文件'];

        $('.EgMMec').show();

        $('.FuIxtL').hide();
        
        //初始化数据
        ajaxData(fid,level,oState,screens);
    });
    $('.filedScreen').eq(0).click()
});

//新建文件夹
function newFile(fId,levels,oStates) {

    $('.newFile').unbind().bind('click',function(){
        if(!$(this).is('.disabled')){
            if (oStates == 0) {
                var newF = '<ol class="olBody" onOff="off" types="1" levels="' + levels + '">' +
                    '<ul class="clear">' +
                    '<li class="fileName"> ' +
                    '<div class="text"> ' +
                    '<input type="checkbox" class="checkbox form-control">' +
                    '<img src="assets/img/Folder_24.png" class="fileImg">' +
                    '<input class="GadHyA" type="text" value="新建文件夹">' +
                    '<span class="onOff">' +
                    '<i class="fa fa-check check"></i>' +
                    '<i class="fa fa-times times"></i>' +
                    '</span>' +
                    '</div>' +
                    '</li>' +
                    '<li class="fileSize">--</li>' +
                    '<li class="fileTime">--</li>' +
                    '</ul>' +
                    '</ol>';
            } else {
                var newF = '<ol class="olBody olStyle" onOff="off" types="1" levels="' + levels + '">' +
                    '<ul class="clear">' +
                    '<li class="fileName"> ' +
                    '<div class="text"> ' +
                    '<i class="fa fa-check-circle uuzMABv"></i>' +
                    '<input type="checkbox" class="checkbox form-control">' +
                    '<img src="assets/img/Folder_54.png" class="fileImg">' +
                    '<input class="GadHyA" type="text" value="新建文件夹">' +
                    '<span class="onOff">' +
                    '<i class="fa fa-check check"></i>' +
                    '<i class="fa fa-times times"></i>' +
                    '</span>' +
                    '</div>' +
                    '</li>' +
                    '<li class="fileSize">--</li>' +
                    '<li class="fileTime">--</li>' +
                    '</ul>' +
                    '</ol>';
            }

            $('.ulBody').prepend(newF);

            //文件夹操作
            operationFile(fId, levels, oStates);
        }
    });

}

//文件夹操作
function operationFile(fId,levels,oStates){
    //确认
    $('.check').unbind().bind('click',function(){
        var fileName = $(this).parents('.onOff').siblings('.GadHyA').val();
        var filethis = $(this);
        $.ajax({
            url: "http://" + location.host + "/project/files/save?" + new Date(),
            type: "POST",
            async: false,
            data: {'name':fileName,'f_id':fId,'level':levels},
            dataType: "json",
            error:function(){

            },
            success: function(data){
                block(data.message,1000);
                if(data['code']<400) {
                    filethis.parents('.onOff').siblings('.checkbox').val(data.f_id);
                    filethis.parents('.onOff').siblings('.GadHyA').remove();
                    filethis.parents('.text').append('<a href="javascript:void(0);" class="asbfGB3b" title="'+fileName+'">'+fileName+'</a>');
                    filethis.parents('.onOff').remove();

                    ajaxData(fid,level,oState,screens);
                }
            }
        });
        //全选功能
        selectedFile(oStates);

        //单选功能
        radioFile(oStates);

        //双击事件
        doubleClickFile();

        //重命名
        renameFile();

        //删除事件
        deleteFile();

        //复制到
        copyToFile();

        //移动到
        moveToFile();

        //上传文件
        uploadFile();

        //下载
        downloadFile();
    });
    //取消
    $('.times').unbind().bind('click',function(){
        $(this).parents('.olBody').remove();
    })
}

//全选功能
function selectedFile(oStates){
    $('.olHead .fileName .checkbox').unbind().bind('click',function(){


        $.each($('.ulBody .olBody'),function(k,v){
            if( $(v).attr('types') == 1 && !$(v).find('.checkbox').is(":checked")){
                $('.renameFile').addClass('disabled');
                $('.deleteFile').addClass('disabled');
                $('.downloadFile').addClass('disabled');
                return false;
            }else{
                $('.renameFile').removeClass('disabled');
                $('.deleteFile').removeClass('disabled');
                $('.downloadFile').removeClass('disabled');
            }
        });

        if($(this).is(":checked")){

            $('.ulBody .checkbox').prop('checked',true);

            $('.olBody').attr('onOff','on');

            onOff = 'on';

            if(oStates == 0) {

                $('.ulBody .olBody').css({'background': '#f6faff'});

            }else if(oStates == 1){

                $('.ulBody .olBody').css({'background-color': '#f1f5fa','border': '1px solid #90c3fd','border-radius': '5px'});
                $('.ulBody .olBody').find('.uuzMABv').show();
                $('.ulBody .olBody').find('.uuzMABv').css({'color':'#574ab8','opacity':'1'});

            }

            num = $('.ulBody .checkbox').length;

            $('.olHead .asbfGB3b').html('已选中'+num+'个文件/文件夹');
            if(num != 0){
                $('.hideBtn').show();
            }
            $.each($('.ulBody .olBody'),function(k,v) {
                if(k > 1){
                    $('.renameFile').addClass('disabled');
                    $('.deleteFile').addClass('disabled');
                    return false;
                }else{
                    $('.renameFile').removeClass('disabled');
                    $('.deleteFile').removeClass('disabled');
                }
            });
        }else{

            num = 0;

            $('.ulBody .checkbox').prop('checked',false);

            $('.olBody').attr('onOff','off');

            if(oState == 0) {

                $('.ulBody .olBody').css({'background':'#fff'});

            }else if(oState == 1){

                $('.ulBody .olBody').css({'background-color': '#fff','border': '1px solid #fff','border-radius': '5px'});
                $('.ulBody .olBody').find('.uuzMABv').hide();
                $('.ulBody .olBody').find('.uuzMABv').css({'color':'#3b8cff','opacity':'0.5'});

            }

            $('.olHead .asbfGB3b').html('文件夹');

            $('.hideBtn').hide();

            $('.renameFile').removeClass('disabled');
            $('.deleteFile').removeClass('disabled');
        }
    });
}
//单选功能
function radioFile(oStates){

    $('.olBody').unbind('click').bind({
        'click':function(){
            if($(this).attr('onOff') == 'off'){

                $(this).find('.checkbox').prop('checked',true);

                $(this).attr('onOff','on');

            }else if($(this).attr('onOff') == 'on'){

                $(this).find('.checkbox').prop('checked',false);

                $(this).attr('onOff','off');

            }

            var disText = $(this).find('.asbfGB3b').text();

            $.each($('.ulBody .olBody'),function(k,v){
                if( $(v).attr('types') == 1 && $(v).find('.checkbox').is(":checked")){
                    $('.renameFile').addClass('disabled');
                    $('.downloadFile').addClass('disabled');
                    return false;
                }else{
                    $('.renameFile').removeClass('disabled');
                    $('.deleteFile').removeClass('disabled');
                    $('.downloadFile').removeClass('disabled');
                }
            });

            if($(this).find('.checkbox').is(":checked")){

                num++;

                if(oStates == 0){
                    $(this).css({'background':'#f6faff'});
                }else{
                    $(this).find('.uuzMABv').show();
                    $(this).find('.uuzMABv').css({'color':'#574ab8','opacity':'1'});
                    $(this).css({'background-color':'#f1f5fa','border':'1px solid #90c3fd','border-radius': '5px'});
                }

                $('.olHead .asbfGB3b').html('已选中'+num+'个文件/文件夹');

                $('.hideBtn').show();

                var len = $('.ulBody .olBody').length;

                if(num == len){

                    $('.olHead .fileName .checkbox').prop('checked',true);

                }
                if(num == 1){
                    if(idAttr.length > 1 && idAttr[1] =='实验记录' || idAttr[1] =='故障记录' || idAttr[1] =='检维修记录' || idAttr[1] =='电子图档'){
                        $.each($('.ulBody .olBody'),function(k,v){
                            if( $(v).find('.checkbox').is(":checked")){
                                if( $(v).attr('types') == 0){
                                    if($(v).attr('userId') == usid){
                                        $('.renameFile').removeClass('disabled');
                                        $('.deleteFile').removeClass('disabled');
                                    }else{
                                        $('.renameFile').addClass('disabled');
                                        $('.deleteFile').addClass('disabled');
                                    }
                                }else{
                                    $('.renameFile').addClass('disabled');
                                    $('.deleteFile').addClass('disabled');
                                }
                            }
                        });
                    }else{
                        $.each($('.ulBody .olBody'),function(k,v){
                            if( $(v).find('.checkbox').is(":checked")){
                                if( $(v).attr('types') == 1){
                                    if($(v).find('.asbfGB3b').text()=='实验记录' || $(v).find('.asbfGB3b').text()=='故障记录' || $(v).find('.asbfGB3b').text()=='检维修记录' || $(v).find('.asbfGB3b').text()=='电子图档'){
                                        $('.renameFile').addClass('disabled');
                                        $('.deleteFile').addClass('disabled');
                                    }else{
                                        $('.renameFile').removeClass('disabled');
                                        $('.deleteFile').removeClass('disabled');
                                    }
                                }else{

                                    $('.renameFile').removeClass('disabled');
                                    $('.deleteFile').removeClass('disabled');
                                }
                            }
                        });
                    }
                }else{
                    $('.renameFile').addClass('disabled');
                    $('.deleteFile').addClass('disabled');
                }
            }else{
                num--;
                if(num == 1){
                    if(idAttr.length > 1 && idAttr[1] =='实验记录' || idAttr[1] =='故障记录' || idAttr[1] =='检维修记录' || idAttr[1] =='电子图档'){
                        $.each($('.ulBody .olBody'),function(k,v){
                            if( $(v).find('.checkbox').is(":checked")){
                                if( $(v).attr('types') == 0){
                                    if($(v).attr('userId') == usid){
                                        $('.renameFile').removeClass('disabled');
                                        $('.deleteFile').removeClass('disabled');
                                    }else{
                                        $('.renameFile').addClass('disabled');
                                        $('.deleteFile').addClass('disabled');
                                    }
                                }else{
                                    $('.renameFile').addClass('disabled');
                                    $('.deleteFile').addClass('disabled');
                                }
                            }
                        });
                    }else{
                        $.each($('.ulBody .olBody'),function(k,v){
                            if( $(v).find('.checkbox').is(":checked")){
                                if( $(v).attr('types') == 1){
                                    if($(v).find('.asbfGB3b').text()=='实验记录' || $(v).find('.asbfGB3b').text()=='故障记录' || $(v).find('.asbfGB3b').text()=='检维修记录' || $(v).find('.asbfGB3b').text()=='电子图档'){
                                        $('.renameFile').addClass('disabled');
                                        $('.deleteFile').addClass('disabled');
                                    }else{
                                        $('.renameFile').removeClass('disabled');
                                        $('.deleteFile').removeClass('disabled');
                                    }
                                }else{
                                    $('.renameFile').removeClass('disabled');
                                    $('.deleteFile').removeClass('disabled');
                                }
                            }
                        });
                    }
                }else{
                    $('.renameFile').addClass('disabled');
                    $('.deleteFile').addClass('disabled');
                }
                var len = $('.ulBody .olBody').length;

                if(onOff == 'on' || num != len){

                    $('.olHead .fileName .checkbox').prop('checked',false);

                    onOff = 'off';
                }

                if(num != 0){

                    $('.olHead .asbfGB3b').html('已选中'+num+'个文件/文件夹');

                }else{

                    $('.olHead .asbfGB3b').html('文件夹');

                    $('.hideBtn').hide();
                }
                if(oStates == 0) {
                    $(this).css({'background': '#fff'});

                }else{
                    $(this).find('.uuzMABv').hide();
                    $(this).find('.uuzMABv').css({'color':'#3b8cff','opacity':'0.5'});
                    $(this).css({'background-color': '#fff','border': '1px solid #fff','border-radius': '5px'});
                }

            }
        },
        'mouseover':function(){
            if(oStates == 0){
                $(this).css({'background':'#f6faff'});
            }else{
                $(this).css({'background-color':'#f1f5fa','border':'1px solid #90c3fd','border-radius': '5px'});
                $(this).find('.uuzMABv').show();
            }
        },
        'mouseout':function() {
            if ($(this).attr('onOff') == 'off') {
                if (oStates == 0) {
                    $(this).css({'background': '#fff'});

                } else {
                    $(this).css({'background-color': '#fff', 'border': '1px solid #fff', 'border-radius': '5px'});
                    $(this).find('.uuzMABv').hide();
                }
            }
        }
    });

    //点击文件在线预览
    $('.olBody .fileName .text .asbfGB3b').unbind().bind({
        'click':function () {
            if($(this).attr('filepath') != 'null' ){
                var filetype = $(this).attr('filetype').split('/')[0];
                if(filetype == 'application') {
                    var filepath = $(this).attr('filepath');
                    $.ajax({

                        url: "http://" + location.host + "/search/index/read_pdf?" + new Date(),
                        type: "POST",
                        data: {'hrefs': filepath},
                        success: function (result) {
                            if (result.code === 200) {
                                var taskattr = filepath.split(".");
                                window.open("/ui/pdf.html?pdf="+taskattr[0]+'.pdf');
                            } else {
                                block(result.msg,2000);
                            }

                        }
                    });
                }else if(filetype == 'video'){
                    var file_url = $(this).attr('filepath');
                    var file_img = $(this).attr('thumbpath');
                    var file_title = $(this).attr('title');
                    $('.modalWrap').html('');
                    $.ajax({
                        'url': './project_details_video.html',
                        "type": "GET",
                        'success': function (data) {
                            $('.modalWrap').html(data);
                            $('.modal-title').html(file_title);
                            $(document).ready(function () {
                                $("#jquery_jplayer_1").jPlayer({
                                    ready: function () {
                                        $(this).jPlayer("setMedia", {
                                            title: "Big Buck Bunny",
                                            m4v: file_url,
                                            poster: file_img
                                        });
                                    },
                                    swfPath: "assets/js/jPlayer/dist/jplayer",
                                    supplied: "webmv, ogv, m4v",
                                    size: {
                                        width: "751px",
                                        height: "350px",
                                        cssClass: "jp-video-360p"
                                    },
                                    useStateClassSkin: true,
                                    autoBlur: false,
                                    smoothPlayBar: true,
                                    keyEnabled: true,
                                    remainingDuration: true,
                                    toggleDuration: true
                                });

                            });
                            $('#project_details_videoModel').modal('show');

                            $('#project_details_videoModel').on('hidden.bs.modal', function () {
                                $('#project_details_video').html('');
                            })
                        }
                    });
                }

            }
        },
        'mouseover':function () {
            $(this).css('color','#3794ff');
        },
        'mouseout':function () {
            $(this).css('color','#333333');
        }
    })
}

//双击事件
function doubleClickFile(){
    $('.olBody').unbind('dblclick').bind('dblclick',function(){

        $('.renameFile').removeClass('disabled');

        if($(this).attr('types') == 1){

            var nameFile = $(this).find('.asbfGB3b').text();

            fid = $(this).find('.checkbox').val();

            level = $(this).attr('levels');

            level++;

            idArr.push(fid);

            ajaxData(fid,level,oState,screens);

            num = 0;

            $('.olHead .asbfGB3b').html('文件夹');

            $('.olHead .fileName .checkbox').prop('checked',false);

            $('.ulBody').html('');

            $('.EgMMec').hide();

            $('.FuIxtL').show();

            $('.hideBtn').hide();

            var titleHtml= '';

            idAttr.push(nameFile);

            $('.FuIxtL').html('');

            titleHtml +=' <li><a data-deep="-1" href="javascript:void(0);" class="returnFli">返回上一级</a><span class="EKIHPEb">&nbsp;|&nbsp;</span></li>';

            for(var i = 0;i < idAttr.length;i++){
                if(i != idAttr.length-1){

                    titleHtml += '<li node-type="tbAudfb">' +
                        '<a href="javascript:void(0);" title="'+idAttr[i]+'" data-deep="0" class="returnMain" numbers="'+i+'">'+idAttr[i]+'</a>' +
                        '<span class="KLxwHFb">&gt;</span>' +
                        '</li>';

                }else{
                    titleHtml += '<li node-type="tbAudfb">' +
                        '<span class="aFile">'+idAttr[i]+'</span> ' +
                        '</li>';
                }
            }
            $('.FuIxtL').html(titleHtml);
        }
    })
}

//返回事件
function returnEvent(){

    $('.returnFli').unbind().bind('click',function(){
        level--;
        $('.hideBtn').hide();

        idAttr.splice(level , 1);

        var titleHtml= '';

        $('.FuIxtL').html('');

        titleHtml +=' <li><a data-deep="-1" href="javascript:void(0);" class="returnFli">返回上一级</a><span class="EKIHPEb">&nbsp;|&nbsp;</span></li>';

        for(var i = 0;i < idAttr.length;i++){
            if(i != idAttr.length-1){
                titleHtml += '<li node-type="tbAudfb">' +
                    '<a href="javascript:void(0);" title="'+idAttr[i]+'" data-deep="0" class="returnMain" numbers="'+i+'">'+idAttr[i]+'</a>' +
                    '<span class="KLxwHFb">&gt;</span>' +
                    '</li>';
            }else{
                titleHtml += '<li node-type="tbAudfb">' +
                    '<span class="aFile">'+idAttr[i]+'</span> ' +
                    '</li>';
            }
        }
        $('.FuIxtL').html(titleHtml);

        //层级点击事件
        returnMain();
        num = 0;
        $('.olHead .fileName .checkbox').prop('checked',false);
        if(level !== 1){

            ajaxData(idArr[level-2],level,oState,screens);

            fid = idArr[level-2];

            idArr.pop();

        }else{

            fid = '';

            ajaxData(fid,level,oState,screens);

            idArr = [];

            idAttr = ['全部文件'];

            $('.EgMMec').show();

            $('.FuIxtL').hide();

            $('.olHead .asbfGB3b').html('文件夹');
        }
    });


}

//层级点击事件
function returnMain(){

    $('.returnMain').unbind().bind('click',function(){

        var numbers = parseInt($(this).attr('numbers'));

        if(numbers != 0){

            idAttr = idAttr.slice(0,parseInt(numbers)+1);

            var titleHtml= '';

            $('.FuIxtL').html('');

            titleHtml +=' <li><a data-deep="-1" href="javascript:void(0);" class="returnFli">返回上一级</a><span class="EKIHPEb">&nbsp;|&nbsp;</span></li>';

            for(var i = 0;i < idAttr.length;i++){
                if(i != idAttr.length-1){
                    titleHtml += '<li node-type="tbAudfb">' +
                        '<a href="javascript:void(0);" title="'+idAttr[i]+'" data-deep="0" class="returnMain" numbers="'+i+'">'+idAttr[i]+'</a>' +
                        '<span class="KLxwHFb">&gt;</span>' +
                        '</li>';
                }else{
                    titleHtml += '<li node-type="tbAudfb">' +
                        '<span class="aFile">'+idAttr[i]+'</span> ' +
                        '</li>';
                }
            }
            $('.FuIxtL').html(titleHtml);

            //初始化数据
            ajaxData(idArr[numbers-1],'',oState,screens);

            fid = idArr[numbers-1];

            level = numbers+1;

        }else{

            $('.EgMMec').show();

            $('.FuIxtL').hide();

            $('.hideBtn').hide();

            num = 0;

            $('.olHead .asbfGB3b').html('文件夹');

            idAttr = ['全部文件'];

            idArr = [];

            $('.olHead .fileName .checkbox').prop('checked',false);

            //初始化数据
            fid = '';
            ajaxData(fid,1,oState,screens);
        }

    });
}

//重命名
function renameFile(){

    $('.renameFile').unbind().bind('click',function(){

        if(!$(this).is('.disabled')){

            $('.hideBtn').addClass('disabled');

            $.each($('.ulBody .olBody'),function(k,v){

                if($(v).attr('onOff') == 'on'){

                    $(v).attr('onOff','on');

                    $('.hideBtn').show();

                    var aHtml = $(v).find('.text').find('a').html();

                    $(v).find('.text').find('a').remove();

                    var inputHtml = '<input class="GadHyA" type="text" value="'+aHtml+'">' +
                    '<span class="onOff">'+
                    '<i class="fa fa-check check"></i>'+
                    '<i class="fa fa-times times"></i>'+
                    '</span>';

                    $(v).find('.text').append(inputHtml);

                    $('.GadHyA').click(function(e){
                        e.stopPropagation();
                    });

                    //重命名操作
                    operationRename(aHtml);
                }
            })

        }
    })
}

//重命名操作
function operationRename(aHtml){
    //确认
    $('.check').unbind().bind('click',function(){

        var fileName = $(this).parents('.onOff').siblings('.GadHyA').val();

        var ids = $(this).parents('.onOff').siblings('.checkbox').val();

        var filethis = $(this);

        $.ajax({
            url: "http://" + location.host + "/project/files/update?" + new Date(),
            type: "POST",
            async: false,
            data: {'oldfilename':fileName,'f_id':ids},
            dataType: "json",
            error:function(){

            },
            success: function(data){
                block(data.message,1000);
                if(data['code']<400) {
                    filethis.parents('.onOff').siblings('.GadHyA').remove();
                    filethis.parents('.text').append('<a href="javascript:void(0);" class="asbfGB3b" title="'+fileName+'">'+fileName+'</a>');
                    filethis.parents('.onOff').remove();
                    $('.hideBtn').removeClass('disabled');
                    //初始化数据
                    ajaxData(fid,level,oState,screens);
                }
            }
        });

    });
    //取消
    $('.times').unbind().bind('click',function(){
        var filethis = $(this);
        filethis.parents('.onOff').siblings('.GadHyA').remove();
        filethis.parents('.text').append('<a href="javascript:void(0);" class="asbfGB3b" title="'+aHtml+'">'+aHtml+'</a>');
        filethis.parents('.onOff').remove();
        $('.hideBtn').removeClass('disabled');
    })
}

//删除事件
function deleteFile(){
    $('.deleteFile').unbind().bind('click',function(){
        if(!$(this).is('.disabled')) {
            var selr = new Array();
            $.each($('.ulBody .olBody'), function (k, v) {
                if ($(v).attr('onOff') == 'on') {
                    selr.push($(v).find('.fileName .checkbox').val());
                }
            })


            if (selr.length == 0) {
                artDialog.alert('请选择要删除的一条数据!');
                return false;
            } else if (selr.length > 1) {
                artDialog.alert('只能删除一条!');
                return false;
            } else {
                art.dialog({
                    content: '是否删除此条记录！',
                    icon: 'warning',
                    ok: function () {
                        if (!isEmpty(selr)) {
                            $.ajax({
                                url: "http://" + location.host + "/project/files/delete?" + new Date(),
                                type: "POST",
                                async: false,
                                data: {ids: selr},
                                dataType: "json",
                                success: function (result) {
                                    block(result.message, 1000);
                                    if (result.code < 400) {
                                        //初始化数据
                                        ajaxData(fid,level,oState,screens);
                                        if($('.olHead .fileName .checkbox').is(':checked')){
                                            $('.olHead .fileName .checkbox').click();
                                        }
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus) {
                                    artDialog.alert("页面请求错误，请联系系统管理员！\n" + textStatus);
                                }

                            })
                        }
                    },
                    cancelVal: '取消',
                    cancel: true //为true等价于function(){}
                });
            }
        }
    });
}

//复制到
function copyToFile(){
    $('.copyToFile').unbind().bind('click',function(){
        $('.modalWrap').html('');
        $.ajax({
            'url': './copy_fo_file.html',
            "type": "GET",
            'async': true,
            'success': function (data) {
                $('.modalWrap').html(data);
                var selr = new Array();
                $.each($('.ulBody .olBody'), function (k, v) {
                    if ($(v).attr('onOff') == 'on') {
                        selr.push($(v).find('.fileName .checkbox').val());
                    }
                });
                var title = 1;
                project_file_grade(title);
                // project_file_tree(treedata, title);
                $('#fileModal').modal('show');
            }
        });
        return false;
    })
}

//移动到
function moveToFile(){
    $('.moveToFile').unbind().bind('click',function(){
        $('.modalWrap').html('');
        $.ajax({
            'url': './move_to_file.html',
            "type": "GET",
            'async': true,
            'success': function (data) {
                $('.modalWrap').html(data);
                var selr = new Array();
                $.each($('.ulBody .olBody'), function (k, v) {
                    if ($(v).attr('onOff') == 'on') {
                        selr.push($(v).find('.fileName .checkbox').val());
                    }
                });
                var title = 0;
                project_file_grade(title);
                // project_file_tree(treedata, title);
                $('#fileModal').modal('show');
            }
        });
        return false;
    })
}

//上传文件
function uploadFile(){

    $('.fileLocal').unbind().bind('click',function(){
        if(!$(this).is('.disabled')) {
            $('.modalWrap').html('');
            $.ajax({
                'url': './uploadFile.html',
                "type": "GET",
                'async': true,
                'success': function (data) {
                    $('.modalWrap').html(data);
                    $('#fileLocal').modal('show');
                }
            });
            return false;
        }
    })
}
//下载
function downloadFile(){
    $('.downloadFile').unbind().bind('click',function(){
        if(!$(this).is('.disabled')){
            var selr = new Array();
            $.each($('.ulBody .olBody'), function (k, v) {
                if ($(v).attr('onOff') == 'on') {
                    selr.push($(v).find('.fileName .checkbox').val());
                }
            });
            if(selr.length == 0){
                artDialog.alert('请选择要下载的一条或多条数据!');
                return false;
            }
            $.ajax({
                url: "http://" + location.host + "/project/files/get_file_down?" + new Date(),
                type: "POST",
                async: false,
                data: {ids: selr},
                dataType: "json",
                success: function (result) {
                    if (result.status == 'success') {
                        window.location.href = result.url;
                    }
                },
                error: function (XMLHttpRequest, textStatus) {
                    artDialog.alert("页面请求错误，请联系系统管理员！\n" + textStatus);
                }

            })
        }
    })
}
//层级
function ajaxData(fid,levels,oStates,screens){
    $('.ulBody').html('');
    $.ajax({
        url: "http://" + location.host + "/project/files/index?" + new Date(),
        type: "POST",
        data: {f_id:fid,ext_type:screens},
        dataType: "json",
        error:function(){

        },
        success: function(data){
            num = 0;
            $('.olHead .asbfGB3b').html('文件夹');
            $('.hideBtn').hide();
            if(data.rows.length >= 0) {
                var fileContent = '';
                if(oStates == 0) {
                    $.each(data.rows, function (k, v) {

                        var filetype = v.file_type != null ? v.file_type.split('/')[0] : '';

                        if (v.type == 0) {
                            fileContent += '<ol class="olBody" onOff="off" types="' + v.type + '" levels="' + v.level + '" userId="'+ v.userid+'" >' +
                                '<ul class="clear">' +
                                '<li class="fileName"> ' +
                                '<div class="text"> ' +
                                '<input type="checkbox" class="checkbox form-control" value="' + v.f_id + '">';

                            if(filetype == 'image'){
                                fileContent +=  '<img src="assets/img/Picture_24.png" class="fileImg">' +
                                                '<a href="' + v.filepath + '" class="asbfGB3b" filetype="' + v.file_type + '"  filepath="' + v.filepath + '" title="' + v.oldfilename + '" target="_blank" >' + v.oldfilename + '</a>';
                            }else if(filetype == 'video'){
                                fileContent +=  '<img src="assets/img/Video_24.png" class="fileImg">' +
                                                '<a href="javascript:void(0);" class="asbfGB3b" filetype="' + v.file_type + '"  filepath="' + v.filepath + '" thumbpath="' + v.thumbpath + '" title="' + v.oldfilename + '">' + v.oldfilename + '</a>';
                            }else{
                                fileContent +=  '<img src="assets/img/Text_54.png" class="fileImg">' +
                                                '<a href="javascript:void(0);" class="asbfGB3b" filetype="' + v.file_type + '"  filepath="' + v.filepath + '" title="' + v.oldfilename + '">' + v.oldfilename + '</a>';
                            }

                            fileContent += '</div>' +
                                '</li>' +
                                '<li class="fileSize">' + v.file_size + '</li>' +
                                '<li class="fileTime">' + v.update_time + '</li>' +
                                '</ul>' +
                                '</ol>';
                        } else {
                            fileContent += '<ol class="olBody" onOff="off" types="' + v.type + '" levels="' + v.level + '">' +
                                '<ul class="clear">' +
                                '<li class="fileName"> ' +
                                '<div class="text"> ' +
                                '<input type="checkbox" class="checkbox form-control" value="' + v.f_id + '">';
                            if(v.sor != null) {
                                fileContent += '<img src="assets/img/Folder_241.png" class="fileImg">';
                            }else{
                                fileContent += '<img src="assets/img/Folder_24.png" class="fileImg">';
                            }
                            fileContent += '<a href="javascript:void(0);" class="asbfGB3b" filetype="' + v.file_type + '"  filepath="' + v.filepath + '" title="' + v.oldfilename + '">' + v.oldfilename + '</a>' +
                                '</div>' +
                                '</li>' +
                                '<li class="fileSize">--</li>' +
                                '<li class="fileTime">' + v.update_time + '</li>' +
                                '</ul>' +
                                '</ol>';
                        }

                    });
                }else if(oStates == 1){
                    $.each(data.rows, function (k, v) {

                        var filetype = v.file_type != null ? v.file_type.split('/')[0] : '';

                        if (v.type == 0) {

                            fileContent += '<ol class="olBody olStyle" onOff="off" types="' + v.type + '" levels="' + v.level + '" userId="'+ v.userid+'" >' +
                                '<ul class="clear">' +
                                '<li class="fileName"> ' +
                                '<div class="text"> ' +
                                '<i class="fa fa-check-circle uuzMABv"></i>'+
                                '<input type="checkbox" class="checkbox form-control" value="' + v.f_id + '">';
                            if(filetype == 'image'){
                                fileContent +=  '<img src="'+ v.thumbpath+'" class="fileImg">' +
                                                '<a href="' + v.filepath + '" class="asbfGB3b" filetype="' + v.file_type + '"  filepath="' + v.filepath + '" title="' + v.oldfilename + '"  target="_blank" >' + v.oldfilename + '</a>';
                            }else if(filetype == 'video'){
                                fileContent +=  '<img src="'+ v.thumbpath+'" class="fileImg">' +
                                                '<a href="javascript:void(0);" class="asbfGB3b" filetype="' + v.file_type + '"  filepath="' + v.filepath + '" thumbpath="' + v.thumbpath + '" title="' + v.oldfilename + '">' + v.oldfilename + '</a>';
                            }else{
                                fileContent +=  '<img src="assets/img/Text_54.png" class="fileImg">' +
                                                '<a href="javascript:void(0);" class="asbfGB3b" filetype="' + v.file_type + '"  filepath="' + v.filepath + '" title="' + v.oldfilename + '">' + v.oldfilename + '</a>';
                            }
                            fileContent += '</div>' +
                                '</li>' +
                                '<li class="fileSize">' + v.file_size + '</li>' +
                                '<li class="fileTime">' + v.update_time + '</li>' +
                                '</ul>' +
                                '</ol>';
                        } else {
                            fileContent += '<ol class="olBody olStyle" onOff="off" types="' + v.type + '" levels="' + v.level + '">' +
                                '<ul class="clear">' +
                                '<li class="fileName"> ' +
                                '<div class="text"> ' +
                                '<i class="fa fa-check-circle uuzMABv"></i>'+
                                '<input type="checkbox" class="checkbox form-control" value="' + v.f_id + '">';
                            if(v.sor != null) {
                                fileContent += '<img src="assets/img/Folder_541.png" class="fileImg">';
                            }else{
                                fileContent += '<img src="assets/img/Folder_54.png" class="fileImg">';
                            }
                            fileContent += '<a href="javascript:void(0);" class="asbfGB3b" title="' + v.oldfilename + '">' + v.oldfilename + '</a>' +
                                '</div>' +
                                '</li>' +
                                '<li class="fileSize">--</li>' +
                                '<li class="fileTime">' + v.update_time + '</li>' +
                                '</ul>' +
                                '</ol>';
                        }

                    });
                }
                $('.ulBody').html(fileContent);

                if(idAttr[1] =='实验记录' || idAttr[1] =='故障记录' || idAttr[1] =='检维修记录' || idAttr[1] =='电子图档'){
                    $('.newFile').addClass('disabled');
                    if(level == 2){
                        $('.fileLocal').addClass('disabled');
                    }else{
                        $('.fileLocal').removeClass('disabled');
                        //上传文件
                        uploadFile();
                    }
                }else{
                    $('.fileLocal').removeClass('disabled');
                    $('.newFile').removeClass('disabled');
                    //新建文件夹
                    newFile(fid,levels,oStates);
                    //上传文件
                    uploadFile();
                }

                //全选功能
                selectedFile(oStates);

                //单选功能
                radioFile(oStates);

                //双击事件
                doubleClickFile();

                //重命名
                renameFile();

                //删除事件
                deleteFile();

                //复制到
                copyToFile();

                //移动到
                moveToFile();

                //返回事件
                returnEvent();

                returnMain();

                //下载
                downloadFile();
            }
        }
    });
}

function project_file_grade(title) {
    // var result;
    var titles;
    if (title == 0) {
        titles = "移动到";
    } else {
        titles = "复制到";
    }
    $('#project_file_title').html(titles);
    /*$.ajax({
        url: "http://" + location.host + "/project/files/project_file_grade?" + new Date(),
        type: "POST",
        async: false,
        data: {},
        dataType: "json",
        error: function () {

        },
        success: function (results) {
            result = results;

            $('.btn_subset').hide();
        }
    });
    return result;*/

    $('#project_file_tree').jstree({
        core: {
            check_callback: true,
            data: treedata
        },
        plugins: ["wholerow", "contextmenu"],
        "contextmenu": {
            "items": {
                "create": null,
                "rename": null,
                "remove": null,
                "ccp": null
            }
        }
    }).on("ready.jstree", function (e, data) {
        data.instance.open_all();
    });

    $('#project_file_tree').on('changed.jstree', function (e, data) {
        //当前选中节点的id
        var parent_id = data.node.original.parent_id;
        $('#addSaveTree').unbind('click').on('click', function () {
            var ids = $("#project_details_jqGridList").jqGrid('getGridParam', 'selarrrow');
            $.ajax({
                url: "http://" + location.host + "/project/files/project_file_change?" + new Date(),
                type: "POST",
                async: false,
                data: {
                    'f_id': ids,
                    'parent_id': parent_id,
                    'title': title
                },
                dataType: "json",
                error: function () {

                },
                success: function (result) {
                    block(result.message, 1000);
                    if (result.code < 400) {
                        $('#fileTreeModal').modal('hide');
                        $('.btn_subset').hide();
                    }
                }
            });
        });
    });
}
