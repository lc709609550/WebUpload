var lstrRet = 0;
var G_Login = 0;
var G_bMainWindowShowCalled = false;
var G_bMainWindowCreated = 0;
/*var BHSession = {
    username: "管理员",
    userid: "mgr",
    password: "111"
};*/
var loContainer = document.getElementById('childBox');

var ClientVar = {
    "midwareOnlineGroup": "{$midwareOnlineGroup}",
    "midwareOfflineGroup": "{$midwareOfflineGroup}",
    "midwareOnLine": "{$midwareOnLine}",
    "midwareOffLine": "{$midwareOffLine}",
    "G_NONE_MIDWAR":false
};


$(function () {
    checkData();
});

function getClientPaintSize() {

    var lnHeight = (document.documentElement.clientHeight == 0) ? document.body.clientHeight : document.documentElement.clientHeight;
    var lnWidth = (document.documentElement.clientWidth == 0) ? document.body.clientWidth : document.documentElement.clientWidth;

    lnHeight = (lnHeight - 65);

    return {
        'width': lnWidth,
        'height': lnHeight
    };
}

//初始化加载客户端
function checkData() {

    G_oObject = document.getElementById('DrawingControl');

    if (!sinadot_isValidObject(G_oObject)) {

        var size = getClientPaintSize();

        var lnHeight = size.height;
        var lnWidth = size.width;

        obj = document.createElement("object");
        obj.setAttribute("width", "100%");
        obj.setAttribute("height", "" + (lnHeight));
        obj.setAttribute("codeBase", "BHClient.CAB#version=1,0,0,001");
        obj.setAttribute("classid", "CLSID:38C9B0EC-68CD-4C30-AC74-B1A1FE18841A");
        obj.id = "DrawingControl";

        loContainer.appendChild(obj);

        window.setTimeout(checkData, 200);
        return false;
    }

    var lstrRet = 0;

    try {

        lstrRet = G_oObject.GetParameter("inited");
        G_oObject.SetAppMode(1);

    } catch (e) {

        alert("客户端初始化失败，请确认是否正确安装客户端插件");
        return false;
    }

    //进行登陆操作
    if (lstrRet == 1) {

        if (!G_Login) {
            client_login();
            return;
        }
        //插件的创建登陆完成，进入渲染过程
        window.setTimeout(CheckMainWindowStatus, 100);
    } else {
        window.setTimeout(checkData, 200);
    }
}

//监测系统代码开始
function CheckMainWindowStatus() {

    if (!G_bMainWindowShowCalled) {
        G_bMainWindowShowCalled = true;
        G_oObject.ShowMainWindow();
    }

    if (sinadot_isValidObject(G_oObject)) {

        lstrRet = G_oObject.GetParameter("MainWindowCreated");

        if (lstrRet != 1) {
            window.setTimeout(CheckMainWindowStatus, 200);
            return;

        } else {

            G_bMainWindowCreated = 1;
            G_oObject.ShowSpecPlant(8);//设置显示的设备分类

            //显示客户端
            try {
                G_oObject.ShowWindowEx(1);
            } catch (e) {

            }


            if (G_bMainWindowCreated) {

                var lbLoginRet = 0;

                try {

                    if (astrCompany != "" && astrFactory != "" && astrPlant != "" && startTime != "" && endTime != "") {

                        G_oObject.SwitchPlant4(astrCompany, astrFactory, astrPlant, "报警查询", startTime, endTime);
                    }

                }
                catch (e) {

                }

                lbLoginRet = G_oObject.SetFocus();
            }
        }

    } else {
        window.setTimeout(checkData(), 200);
    }
}


/**
 * 客户端登陆
 * 只验证后台配置的第一个在线中间件
 */

function client_login() {
    var idd = $('.centereds').attr('uid');
/*    G_oObject.SetParameter("Online_Category", ClientVar.midwareOnlineGroup); //在线功能组*/
    G_oObject.SetParameter("Online_Category", "系统,风电专用图谱,案例库系统,旋转机械专用图谱,往复机械专用图谱,柴油发动机专用图谱,机泵专用图谱,在线报告报表,报警统计"); //在线功能组
    //在线中间件信息
    if (ClientVar.midwareOnLine.length > 0) {
        var midwareOnLineArr = ClientVar.midwareOnLine.split('##');
        var onlineServerNum = midwareOnLineArr.length;
    }
    $.ajax({
        url: "http://"+location.host+"/index/Client/index?"+new Date(),
        type: "POST",
        data:{uid:idd},
        async: false,
        dataType: "json",
        error:function(){
        },
        success: function (result) {

            if (result.length > 0){

                G_oObject.SetParameter("ip",""+ result[0].serverIp+","+ result[0].serverPort+"/TCP");
                //遍历设置在线中间件
                for (var i = 0; i < result.length; i++) {

                    G_oObject.SetOnlineInfo(""+ result[i].serverIp+","+ result[i].serverPort+"/TCP",result[i].userName, result[i].pass, result[i].linkType);

                }

                //发送登陆指令
                G_Login = G_oObject.Login(result[0].userName, result[0].pass);

            } else {
                ClientVar.G_NONE_MIDWAR = true;
                alert("没有配置中间信息");
            }

        }
    });
/*    G_oObject.SetParameter("ip", "172.16.1.133,17001/TCP");


    G_oObject.SetOnlineInfo("172.16.1.133,17001/TCP", "mgr", "111", 0);

    //发送登陆指令
    G_Login = G_oObject.Login("mgr", "111");*/

    window.setTimeout(checkData, 200);
}


//检测对象是否存在
function sinadot_isValidObject(aObj) {

    if (typeof (aObj) == "undefined" || aObj == null) {
        return false;
    }

    return true;
}
