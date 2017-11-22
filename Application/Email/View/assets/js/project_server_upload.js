/**
 * Created by BHZXZbaibing on 2017/5/15.
 */

$(function () {
    //计算内容部分高度
    var sidebarH = $('#sidebar').height();
    $('#project_server_upload_content').height(sidebarH - 204);
    $('.file_Text').height(sidebarH - 292 - 45);

    if(file_type == 'file'){
        $('.start_uploading').unbind().bind('click',function(){
            $('.modalWrap').html('');
            $.ajax({
                'url': './project_upload_big.html',
                "type": "GET",
                'success': function (data) {
                    $('.modalWrap').html(data);
                    $('#project_upload_big').modal('show');
                }
            });
        });
    }else if(file_type == 'database'){
        $('.headers h2').html('导入数据库');
        $('#original_file .file_title  h5').html('选择源数据库<i class="fa fa-reply file_return"></i>');
        $('.start_uploading').unbind().bind('click',function(){
            $('.modalWrap').html('');
            $.ajax({
                'url': './project_server_upload_file.html',
                "type": "GET",
                'success': function (data) {
                    $('.modalWrap').html(data);
                    $('#project_server_upload_file').modal('show');
                }
            });
        });
    }


    getMenu(true);

    object_file(true);

    $('#addsbtn').click(function () {
        getMenu();
    });
    $('#adds').unbind().bind('keydown',function(){
        if(event.keyCode == "13")
        {
            getMenu();
        }
    });

    $('#object_file_addsbtn').click(function () {

        object_file();

    });

    $('#object_file_adds').unbind().bind('keydown',function(){
        if(event.keyCode == "13")
        {
            object_file();
        }
    });
});

//选择源文件文件夹请求
function getMenu(typess) {
    var adds = $('#adds').val();

    var addr;
    var adds_html = '';
    var num = 0;
    $.ajax({
        url: "http://" + location.host + "/project/project_database/get_source_menu?" + new Date(),
        type: "POST",
        data:{'adds':adds},
        dataType: "json",
        async: false,
        success: function (data) {

            $.each(data,function(k,v){
                if(typess){
                    adds_html += '<li class=""><a href="#">'+ v +'</a></li>';
                }else{
                    if(v.type == 0){
                        adds_html += '<li class="" types = "'+v.type+'"><img src="/ui/assets/img/Folder_24.png" title="" alt="" style="width: 16px;height: 16px; position: absolute;left: 10px;top: 16px;z-index:99;"/><a href="#" style="padding-left: 40px">'+ v.name +'</a></li>';
                    }else if(v.type == 1){
                        adds_html += '<li class="" types = "'+v.type+'"><img src="/ui/assets/img/Text_24.png" title="" alt="" style="width: 16px;height: 16px; position: absolute;left: 10px;top: 16px;z-index:99;"/><a href="#" style="padding-left: 40px">'+ v.name +'</a></li>';
                    }
                }


            });

            $('#original_file_Text ul').html(adds_html);

            original_file_Text(num,addr)
        }
    });
}
//选择源文件文件夹选中事件
function original_file_Text(num,addr){

    $('#original_file_Text ul li').unbind().bind('click',function(){
        if(num == 0){
            addr = $('#adds').val();
            num = 1;
        }

        var types = $(this).attr('types');

        $(this).siblings('li').removeClass('active');

        $(this).addClass('active');

        var aHtml = addr+ $(this).find('a').text()+'\\';

        $('#adds').val(aHtml);

        original_file_url = aHtml;

        if(types != 1){
            getMenu();
        }

    });

    $('#original_file .file_return').unbind().bind('click',function(){

        var return_a = $('#adds').val();

        var attrs = return_a.split('\\');

        var aHtml = '';

        var nu = 1;

        if(attrs.length > 2){
            nu = 2;
        };

        for(var i = 0; i < attrs.length - nu; i++){

          if(nu == 1){
              aHtml = '';
          }else{
              aHtml += attrs[i]+'\\';
          }

        }

        $('#adds').val(aHtml);

        if(aHtml == ''){
            getMenu(true);
        }else{
            getMenu();
        }

    });
}

//选择目标路径文件夹请求
function object_file(typess) {
    var addb = $('#object_file_adds').val();
    object_file_url = addb;
    var adda;
    var addb_html = '';
    var num = 0;
    $.ajax({
        url: "http://" + location.host + "/project/project_database/get_target_menu?" + new Date(),
        type: "POST",
        data:{'adds':addb},
        dataType: "json",
        async: false,
        success: function (data) {

            $.each(data,function(k,v){
                if(typess){
                    addb_html += '<li class=""><a href="#">'+ v +'</a></li>';
                }else{
                    if(v.type == 0){
                        addb_html += '<li class="" types = "'+v.type+'"><img src="/ui/assets/img/Folder_24.png" title="" alt="" style="width: 16px;height: 16px; position: absolute;left: 10px;top: 16px;z-index:99;"/><a href="#" style="padding-left: 40px">'+ v.name +'</a></li>';
                    }/*else if(v.type == 1){
                        addb_html += '<li class="" types = "'+v.type+'"><img src="/ui/assets/img/Text_24.png" title="" alt="" style="width: 16px;height: 16px; margin-right: 15px;display: inline-block"/><a href="#" style="display: inline-block;width: 60%">'+ v.name +'</a></li>';
                    }
*/
                }
            });

            $('#object_file_Text ul').html(addb_html);

            object_file_Text(num,adda);
        }
    });
}

//选择目标路径文件夹选中事件
function object_file_Text(num,adda){

    $('#object_file_Text ul li').unbind().bind('click',function(){
        if(num == 0){
            adda = $('#object_file_adds').val();
            num = 1;
        }

        var types = $(this).attr('types');

        $(this).siblings('li').removeClass('active');
        $(this).addClass('active');
        var aText = adda+ $(this).find('a').html()+'\\';

        $('#object_file_adds').val(aText);

        if(types != 1){

            object_file();

        }

    });

    $('#object_file .file_return').unbind().bind('click',function(){
        var return_a = $('#object_file_adds').val();
        var attrs = return_a.split('\\');
        var aHtml = '';
        var nu = 1;

        if(attrs.length > 2){
            nu = 2;
        };

        for(var i = 0; i < attrs.length - nu; i++){

            if(nu == 1){
                aHtml = '';
            }else{
                aHtml += attrs[i]+'\\';
            }


        }

        $('#object_file_adds').val(aHtml);

        if(aHtml == ''){
            object_file(true);
        }else{
            object_file();
        }

    });
}