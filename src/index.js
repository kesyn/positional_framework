import Files from './files';
import Pages from '../pages/index';
// import * as $ from 'jquery';
// window.$=$;
import Plugins from './plugins'
import {screenSize} from './helpers'
require('jquery.transit');
require('./share')
import 'weui';
import weui from 'weui.js'
window.weui = weui;
require("es6-promise").polyfill();
window.sounds = require('./sound').sounds;
//
// var VConsole = require('vconsole');
// var vConsole = new VConsole();

var u = navigator.userAgent.toLowerCase();
window.isAndroid = u.indexOf('android') > -1 || u.indexOf('adr') > -1;
window.isiOS = !!u.match(/iphone|ipad|ipod/);
window.getQueryVariable = function(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
};
if(!window.avatar){
    // window.avatar = require("../sources/empty.jpg")
}
window.ie9 = false;
window.ie = (navigator.appName.indexOf("Internet Explorer")!=-1);
if(navigator.appName.indexOf("Internet Explorer")!=-1){     //yeah, he's using IE
    if(navigator.appVersion.indexOf("MSIE 9")>=0){
        window.ie9 = true;
    }
}
import Positional from './Positional';
import PageService from './PageService';
import Animator from './Animator';
import Tools from './Tools'
import Loader from './Loader';
import '../styles/index.css';
import 'animate.css'
import * as $ from "jquery";
var u = navigator.userAgent;
// import VConsole from 'vconsole/dist/vconsole.min.js'
// let vConsole = new VConsole()
window.App = {
    plugins: Plugins,
    options: {rate: 1},
    tempClasses: []
};
window.weui = weui;
window.showAlert = function(msg, callback){
    weui.alert(msg, callback);
}
window.showConfirm = function(msg, yes, no){
    weui.confirm(msg, yes, no);
}

window.shareUrl = "";
window.shareImg = "";
if(location.href.indexOf("beta")>=0){
    shareUrl = "https://beta.ia.qq.com/641013123/"

}
else{
    shareUrl = "https://amway2019.ia.qq.com/"
}
window.shareImg = shareUrl + require('../sources/share.jpg')

window.handleErr = function(data){
    if(data.code == 0){
        return true;
    }
    else{
        if(data.code == 101){
            showAlert(data.message, function(){
                AMWAY.appLogin();
            });
        }
        else {
            showAlert(data.message);
        }
    }
}
window.playFrame = function(prefix, min, max, target, interval,infinite,callback){
    var currentFrame = 0
    if(!interval){
        interval = 150
    }
    frames[prefix] = window.currentInterval = setInterval(function(){
        
        $(target).attr("src", prefix[currentFrame]);
        currentFrame++;
        if(!infinite && currentFrame>max){
            clearInterval(window.currentInterval);
            callback();
            return;
        }
        if(currentFrame>max)currentFrame = 0;
    }, interval);
}
window.playFrameCss = function(prefix, min, max, target, interval){
    var currentFrame = 0
    if(!interval){
        interval = 150
    }
    frames[prefix] = window.currentInterval = setInterval(function(){
        if(currentFrame>max)currentFrame = 1;
        // $(target).attr("src", "sources/" + prefix + currentFrame + ".png");
        for(var i=min;i<=max;i++){
            $(target).removeClass(prefix + i);
        }
        $(target).addClass(prefix + currentFrame);
        currentFrame++;
        if(currentFrame>max){
            clearInterval(window.currentInterval)
        }
    }, interval);
}

window.App.tools = new Tools(window.App);
window.App.animator = new Animator(window.App);
window.os =(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1)?"android":"ios";
var reset = ()=>{
    
    // return;
    if(window.os=="ios")return document.getElementsByName('viewport')[0].setAttribute('content', 'width=750, user-scalable=no');
    var get_target_densitydpi = 750 / document.documentElement.clientWidth * 160;
    if (get_target_densitydpi < 70)
        get_target_densitydpi = 70;
    var targetDensitydpi = 'target-densitydpi=' + get_target_densitydpi + ', width=750, user-scalable=no';
    try {
        document.getElementsByName('viewport')[0].setAttribute('content', targetDensitydpi);
    }
    catch{

    }
    // $(".fixed_back").css("position", "fixed").width(window.innerWidth).height(window.innerHeight);
}
reset();
var lastW = window.innerWidth;
var lastH = window.innerHeight;
var resetMask = (needResize) => {
    $('input[type="file"]').css("opacity", 0)
    if(lastH!=window.innerHeight)
        lastH = window.innerHeight;
    if(window.innerWidth>window.innerHeight){
        if(isAndroid || isiOS){
            if(window.orientation!=0) {
                $("#cover").show();
            }
        }
    }
    else{
        $("#cover").hide();
    }
    if(lastW!=window.innerWidth||needResize){
        var targetLength_1 = window.innerWidth;

        var targetLength_2 = window.innerHeight;
        // alert("innerWidth:"+window.innerWidth+",innerHeight:"+window.innerHeight+",scale:"+window.devicePixelRatio);
        if(window.allowRotate){
            if (targetLength_1 > targetLength_2) {
                window.stageWidth = targetLength_2;
                window.stageHeight = targetLength_1;
            }
            else {
                window.stageWidth = targetLength_1;
                window.stageHeight = targetLength_2;
            }
        }
        else{
            window.stageWidth = targetLength_1;
            window.stageHeight = targetLength_2;
        }
        if(!isAndroid&&!isiOS){
            window.stageHeight = window.innerHeight;
            window.stageWidth = window.innerHeight*750/1334;
        }
        else{

        }
        $(".centerFull").width(window.stageWidth).height(window.stageHeight);
        $("#page").css({left: window.innerWidth/2 - window.stageWidth/2})
        $("#loading").css({left: window.innerWidth/2 - window.stageWidth/2});
        // alert(window.innerHeight);
        lastW = window.innerWidth;
        //TODO:
        $("#page").width(window.stageWidth).height(window.sgateHeight);
        if(window.App.positional) {
            window.App.positional.drawElements(".cal")
            // console.log("reset")
            window.w = function (width) {
                var scale = window.stageWidth / 750;
                return width * scale;
            };
        }
        // alert("called")
    }
};
resetMask();
setInterval(resetMask, 100)
setTimeout(function(){
    reset();
    resetMask(true);
},200);
window.isqqnews = function () {
    var isnews = false;
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/qqnews/i) == "qqnews") {
        isnews = true;
    } else {
        isnews = false
    }
    return isnews;
};
window.isqq = function () {
    var isnews = false;
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/qq/i) == "qq") {
        isnews = true;
    } else {
        isnews = false
    }
    return isnews;
};
window.isweixin = function () {
    var isnews = false;
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i) == "micromessenger") {
        isnews = true;
    } else {
        isnews = false
    }
    return isnews;
};
window.onload = function(){
    if(location.href.indexOf("ia")>=0) {
        $("body").append($("<script>").attr("src", "//appmedia.gtimg.com/media/631007208/appin/h5e.2.1.1.js")
            .attr("id", "h5e-node").attr("arg", window.h5eArg)
        );
    }
    $("body").append($("<script>").attr("src", "js/project.js"));
    setTimeout(function(){
        reset();
        resetMask(true);
    },200)
    reset();
    resetMask();
    if(isqqnews()){
        $("body").append($("<script>").attr("src", "//mat1.gtimg.com/www/js/newsapp/jsapi/news.js"));
        var tencentIntev = setInterval(function(){
            if(window.TencentNews){
                window.TencentNews.setTitle("那些刷屏的营养谣言");
                clearInterval(tencentIntev)
            }
        }, 100)
    }

    var interval = setInterval(function(){
        if(typeof h5e != 'undefined') {
            AMWAY.initShare(window.shareUrl, "99%的网友栽在了这里。", "这些专坑中国人的“健康建议”，你能识别吗？", "这些专坑中国人的“健康建议”，你能识别吗？"
                , window.shareImg);
            clearInterval(interval);
        }
    }, 100);
};
$("document").ready(function(){
    window.soundsloaded = false;
    var re = window.App.tools.getQueryStr("re");
    if(!re) {
        $("#loading").show();
    }
    if(!ie) {
        sounds.whenLoaded = function(){
            window.soundsloaded = true;
        };
        sounds.load([
            require('../sources/a.mp3'),
            require('../sources/b.mp3'),
            require('../sources/music.mp3')
        ])

        window.sounds.a = sounds[require('../sources/a.mp3')];
        window.sounds.b = sounds[require('../sources/b.mp3')];
        window.sounds.music = sounds[require('../sources/music.mp3')];
        window.sounds.music.loop = true;
    }
    window.playSound = function(id){
        if (typeof WeixinJSBridge != 'undefined' && WeixinJSBridge != null) {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                // window.sounds[id].pause();
                window.sounds[id].playFrom(0)
            });
        }
        else{
            // window.sounds[id].pause();
            window.sounds[id].playFrom(0);
        }
    }
    window.stopSound = function(){
        window.sounds.music.pause();
    }

    window.playing = false;
    $("#page").on("touchmove", function(evt){
        evt.preventDefault();
    })
    $("body").append($(` <audio id="music" loop preload="auto">
        <source src="${require('../sources/music.mp3')}" type="audio/mpeg"/>
    </audio>`).css({position:'absolute', top: -10000}))
        .append($(` <audio id="a" preload="auto">
        <source src="${require('../sources/a.mp3')}" type="audio/mpeg"/>
    </audio>`).css({position:'absolute', top: -10000})).append($(` <audio id="b" preload="auto">
        <source src="${require('../sources/b.mp3')}" type="audio/mpeg"/>
    </audio>`).css({position:'absolute', top: -10000}))
    // var loadingQueue = new createjs.LoadQueue()
    // loadingQueue.installPlugin(createjs.Sound);
    // createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    // loadingQueue.loadFile({
    //     id: "a",
    //     src: require('../sources/a.mp3')
    // });
    // loadingQueue.loadFile({
    //     id: "b",
    //     src: require('../sources/b.mp3')
    // });
    reset();
    var targetLength_1 = window.innerWidth;
    var targetLength_2 = window.innerHeight;
    if(window.allowRotate){
        if (targetLength_1 > targetLength_2) {
            window.stageWidth = targetLength_2;
            window.stageHeight = targetLength_1;
        }
        else {
            window.stageWidth = targetLength_1;
            window.stageHeight = targetLength_2;
        }
    }
    else{
        window.stageWidth = targetLength_1;
        window.stageHeight = targetLength_2;
    }

    window.w = function(width){
        var scale = window.stageWidth/750;
        return width * scale;
    };
    if(!isAndroid&&!isiOS){
        window.stageHeight = window.innerHeight;
        window.stageWidth = window.innerHeight*750/1334;
    }
    $(".centerFull").width(window.stageWidth).height(window.stageHeight);
    $("#page").css({left: window.innerWidth/2 - window.stageWidth/2})
    $("#loading").css({left: window.innerWidth/2 - window.stageWidth/2})

    var positional = new Positional(Files);
    if(!re) {
        $(".loadingitem").show();
    }
    positional.drawElements(".cal");
    positional.fullScreen("#page")
    window.App.positional = positional;

    var pageService = new PageService(Pages);
    window.App.pageService = pageService;
    var loader = new Loader(Files);
    
    loader.start(function(){

        var a = $("#a")[0];
        var music = $("#music")[0];
        var b = $("#b")[0];

        $("#musicbtn").on("click", function(){
            window.playing = !window.playing;
            if(playing){
                $(this).attr("src", require('../sources/musicon.png'));
                // sounds[require('../sources/music.mp3')].loop = true;
                // sounds[require('../sources/music.mp3')].play();
                if(ie) {
                    music.play();
                }
                else{
                    playSound("music");
                }

            }
            else{
                $(this).attr("src", require('../sources/musicoff.png'));
                // sounds[require('../sources/music.mp3')].pause();
                // sounds[require('../sources/a.mp3')].pause();
                if(ie) {
                    music.pause();
                    a.pause();
                    b.pause();
                }
                else{
                    window.stopSound()
                }
            }
        })
        var soundsInterval = setInterval(function(){
            if(window.soundsloaded||ie){
                if(!re) {
                    setTimeout(function () {
                        pageService.start();
                        // $(".coverleft").addClass("slideOutLeft animated fast")
                        // $(".coverright").addClass("slideOutRight animated fast")
                        $("#loading").remove();
                    }, 1000)
                }
                else{
                    pageService.start();
                    $("#loading").remove();
                }
                clearInterval(soundsInterval);
            }
        }, 10)

    },function (progress){
        $("#loadingText").text(~~(progress * 100) + "%");
        
    })
    if(isAndroid||isiOS){
        $("body").append($(`<style>
.weui-dialog{
    width:600px;
    border-radius: 6px;
}

.weui-dialog__bd{
    font-size: 30px!important;
    padding: 2.7em 40px 1.7em!important;
}
.weui-dialog__ft{
    line-height: 96px!important;
    font-size: 36px!important;
}
.weui-mask_transparent{
    background-color: rgba(0,0,0,0.5)
}
.weui-toast {
    width: 240px;
    height: 240px;
    top: 50%;
}
.weui-toast__content{
font-size: 28px;
}
</style>`))
    }


    // window.offset = function(l1, l2, l3){
    //     if(window.innerHeight<1200){
    //         return l1;
    //     }
    //     if(window.innerHeight<1400){
    //         return l2;
    //     }
    //     if(window.innerHeight>1400){
    //         return l3;
    //     }
    // }
    // MtaH5.clickStat("exceptionlogs");
});
// window.onresize = function () {
//     // if(window.orientation==0)return;
//     // resetMask(true);
//     // console.log("resize")
// }
window.addEventListener('pageshow', function () {
    if(window.currentPage == "page1") {
        setTimeout(function () {
            resetMask(true);
            window.App.positional.drawElements(".cal")
            window.pages.Page1.load();
        }, 200)
    }

})
// $('body').on('touchend',function(e) {
//     e.preventDefault();
// })
document.addEventListener('dblclick', function (e) { e.preventDefault();
});