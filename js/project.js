//全局对象
var AMWAY = {};

//网络不给力
var netError = {
	"code": 108,
	"message": "网络不给力,请稍后重试"
};

//gtk
function getGTK(){
    return ""
}

//判断是否登录 true/false
AMWAY.checkLogin = function(options){
    var jsonStr = {
        "code":window.logined?0:101,
        "message":"未登录",
        "data":
            {
                "answerChance" : 1
            }
    };
    options.callback(jsonStr);
}


//授权登录
AMWAY.appLogin = function(url){
    if(!window.logined) {
        location.href = "https://omgmkt.qq.com/wx/auth?url=" + encodeURIComponent(url);
        location.href = url;
    }
    window.logined = true;
}

/*
 3.3提交答题信息
 参数说明
 options = {
     answers	: 'A,B,C,A,B,C,A,B,C,A,B,C,A,B,C', //答题结果
     pitPercent : '20',  	//掉坑指数
     callback: function(){  //回调
     }
 }
*/
AMWAY.saveAnswer = function(options){
    var jsonStr = {
        "code":0,
        "message":"success",
        "data":
        {
            "rankNum" :"50",   //战胜50%的网友
            "token":"b7a3c569bd6a0dd8db94ddf5be892d4d" //答题唯一标识
        }
    };
    options.callback(jsonStr);
}


/*
 3.4上传作品
 参数说明
 options = {
     base64str: 'xxxxxxx', //图片流base64str
     type 	  : 0,  	   //模版类型 0默认1自选图片
     callback: function(){  //回调
     }
 }
*/
AMWAY.savePoster = function(options){
    var jsonStr = {
        "code":0,
        "message":"success",
        "data":{
            "fileId": 100,
			"imageUrl":"https://huodongfiles-1252591134.file.myqcloud.com/641013123/5de9f05407744c1cbbc26d9cd3a07ca41573721400486.png"
		}
    };
    setTimeout(function(){
        options.callback(jsonStr);
    }, 2000)
}



/*
* 分享
* 从左至右 分享链接 标题 内容 分享朋友圈 分享图
* */
AMWAY.initShare = function(share_url, share_title, share_summary, share_content, share_img){
	var share_obj = {
		title: share_title,
		desc: share_summary,
		timeLineTitle: share_content,
		img: share_img,
		url: share_url,
		onSuccess: function(res){
		},
		onCancel: function (res){
		}
	};
	// h5e.share.init(share_obj);
};


/*
 3.6开始抽奖
 参数说明
 options = {
	 token	 :	"b7a3c569bd6a0dd8db94ddf5be892d4d", //抽奖标识
     callback: function(){ //回调
     }
 }
*/
AMWAY.lottery = function(options){
    var x = (~~(Math.random()*10000))%2;
    var p = ["一等奖", "二等奖", "三等奖"];

    p = p[(~~(Math.random()*10000))%3]
    var jsonStr = {
        "code"    :x==0?0:109,
        "message" :"success",
        "data": {
			"lotteryName" :p   //中奖奖品名称
        }
    };
    // var jsonStr = {
    //     code: 103,
    //     message: "访问出错"
    // }
    options.callback(jsonStr);
}


/*
 保存用户leads信息
 参数说明
 options = {
     name   : '姓名',
     mobile : '13800138001',
	 addr   : '上海市xxxx',
     callback: function(){ //回调
     }
 }
*/
AMWAY.saveLeads = function(options){
    var jsonStr = {
        "code":0,
        "message":"success"
    };
    options.callback(jsonStr);
}

/*
 查看作品详情
 参数说明
 options = {
     fileId  : '1', //作品id
     callback: function(){ //回调
     }
 }
*/
AMWAY.getFileInfo = function(options){
    var jsonStr = {
        "code":0,
        "message":"success",
		"data":{
			// "imageUrl":"https://omgai-1300437995.cos.ap-chongqing.myqcloud.com/share.png"
            "imageUrl": "https://omgai-1300437995.cos.ap-chongqing.myqcloud.com/share2.jpg"
            // "imageUrl" : "https://huodongfiles-1252591134.file.myqcloud.com/641013123/5de9f05407744c1cbbc26d9cd3a07ca41573721400486.png"
		}
    };
    options.callback(jsonStr);
}