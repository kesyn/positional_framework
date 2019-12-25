/**
 * Created by zhangtong from KESYN SOFTWARE on 2016/9/4.
 */

"use strict";
// import * as $ from 'jquery';
var queue = [];
var currentIntervals = [];

export default class Animator{
    constructor(app){
        this.app = app;
    }
    fadeOut(dom, callback, keep) {
        for (var i = 0; i < $(dom).length; i++) {
            var d = $($(dom)[i]);
            d.removeClass(d.attr("currentAnimation"))
        }
        $(dom).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
           $(this).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend')
            if (!keep) {
                $(this).remove();
            }
            if (callback) callback();
            callback = null;
        }).addClass("fadeOut animated slow").show();
    }
    runCssAnimation(id, style, callback, during) {

        var classTobeAdd = " animated "
        if (during) {
            during = parseInt(during * 100) / 100
            //during*=app.options.rate;
            var classname = "duration" + ("" + during).replace(".", "_")
            var name = "." + classname
            var value = "-webkit-animation-duration:" + during + "s;animation-duration:" + during + "s;";
            if(this.app.tempClasses == null){
                this.app.tempClasses = new Array();
            }
            if (this.app.tempClasses[name] == null) {

                $("body").append($('<style>' + name + '{' + value + '}</style>'))
                this.app.tempClasses[name] = value;
            }
            classTobeAdd += classname;
        }
        var currentanimation = $(id).attr("currentAnimation");
        if(currentanimation == null)currentanimation = "";
        $(id).attr("currentAnimation", style + classTobeAdd)
        $(id).removeClass(currentanimation).show().one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend')
            if (callback) { callback(); callback = null; };
        }).addClass(style + classTobeAdd);
    }
    handleOutAnimation(callback = ()=>{}){
        var totalTime = 0;
        var children = $("#"+this.app.currentPage.id).find("*");
        for(var i=0;i<children.length;i++){
            var child = $(children[i]);
            //console.log(child[0]);
            var out = child.attr("out");
            if(out=="[]")continue;
            //console.log(out);
            var time = child.attr("time");

            if(time){
                time = parseFloat(time);
            }
            if(time>totalTime){
                totalTime = time;
            }
        }
        this.runOutAnimation(children);
        this.app.tools.timeout(callback,totalTime*1000);
    }

    handleWidgetOutAnimation(id, callback = ()=>{}){
        var totalTime = 0.01;
        var children = $("#"+id).find("*");
        for(var i=0;i<children.length;i++){
            var child = $(children[i]);
            //console.log(child[0]);
            var out = child.attr("out");
            if(out=="[]")continue;
            //console.log(out);
            var time = child.attr("time");

            if(time){
                time = parseFloat(time);
            }
            if(time>totalTime){
                totalTime = time;
            }
        }
        this.runOutAnimation(children, false);
        this.app.tools.timeout(callback,totalTime*1000);
    }
    waitQueue(){
        if(queue.length == 0){
            for(var i=0;i<currentIntervals.length;i++){
                var interval = currentIntervals[i];
                clearInterval(interval);
                currentIntervals = [];
            }
            return;
        }
        var tmpQueue = []
        while(queue.length>0) {
            var tobe = queue.shift();
            if(tobe.animation.t.indexOf("fade")>=0){
                $(tobe.child).css("opacity", 0);
            }
            if(tobe.animation.t=="zoomIn"){
                $(tobe.child).css("opacity", 0);
            }
            if ($(tobe.child).css("display") == "none") {
                tmpQueue.push(tobe);
            }
            else{
                (function(_tobe) {
                    if (_tobe.animation.t == "fadeIn") {
                        // setTimeout(function () {
                            $(_tobe.child).delay(_tobe.animation.d*1000).animate({opacity: 1}, _tobe.animation.i*1000)
                        // }, _tobe.animation.d*1000);
                    }

                    if (_tobe.animation.t == "fadeInUp") {
                        $(_tobe.child).css({marginTop: "+=" + $(_tobe.child).height()})
                        // setTimeout(function () {
                            $(_tobe.child).delay(_tobe.animation.d*1000).animate({opacity: 1, marginTop: "-=" + $(_tobe.child).height()}, _tobe.animation.i*1000)
                        // }, _tobe.animation.d*1000);
                    }
                    if (_tobe.animation.t == "slideInRight") {
                        $(_tobe.child).css({left: "+=" + $(_tobe.child).width()})
                        // setTimeout(function () {
                        $(_tobe.child).delay(_tobe.animation.d*1000).animate({opacity: 1, left: "-=" + $(_tobe.child).width()}, _tobe.animation.i*1000)
                        // }, _tobe.animation.d*1000);
                    }

                    if (_tobe.animation.t == "fadeInDown") {
                        $(_tobe.child).css({top: "-=" + $(_tobe.child).height()})
                        // setTimeout(function () {
                            $(_tobe.child).delay( _tobe.animation.d*1000).animate({opacity: 1, top: "+=" + $(_tobe.child).height()}, _tobe.animation.i*1000)
                        // }, _tobe.animation.d*1000);
                    }
                    var size = {
                        w: $(_tobe.child).width(),
                        h: $(_tobe.child).height()
                    };
                    if(_tobe.animation.t == "zoomIn"){
                        $(_tobe.child).css({
                            top: "+=" + size.h/6,
                            left: "+=" + size.w/6,
                            width: size.w/3,
                            height: size.h/3
                        })
                        $(_tobe.child).delay( _tobe.animation.d*1000).animate({
                            top: "-=" + size.h/6,
                            left: "-=" + size.w/6,
                            width: size.w,
                            height: size.h,
                            opacity: 1
                        }, _tobe.animation.i*1000 )
                    }
                })(tobe)
            }
        }
        queue = tmpQueue;
    }
    handleAnimationIE9(dom){
        var app = this.app;
        var self = this;
        var children = $(dom).find("*");
        if(children.length == 0){
            if(dom.indexOf("#")==0) {
                children = [dom]
            }
            else{
                children = $(dom)
            }
        }
        for (var x = 0; x < children.length; x++) {
            var child = children[x];
            var animation = $(child).attr("ani");
            if(animation==null)continue;
            var childAnimations = eval("(" + animation + ")");
            for (var i = 0; i < childAnimations.length; i++) {
                var childAnimation = childAnimations[i];
                queue.push({
                    child: child,
                    animation: childAnimation
                });
            }
        }
        currentIntervals.push(setInterval(this.waitQueue, 50));
    }
    handleAnimation(dom){
        if(navigator.appName.indexOf("Internet Explorer")!=-1){     //yeah, he's using IE
            if(navigator.appVersion.indexOf("MSIE 9")>=0){
                return this.handleAnimationIE9(dom);
            }
        }
        var app = this.app;
        var self = this;
        var children = $(dom).find("*");
        var addClassStyle = (name, value) => {
            if (app.tempClasses[name] == null) {
                $("body").append($('<style>' + name + '{' + value + '}</style>'))
                app.tempClasses[name] = value;
            }
        }
        for (var x = 0; x < children.length; x++) {
            var inanimations = [];
            var outanimations = [];
            var waitanimations = [];
            var child = children[x];
            for (var i = 0; i < self.app.plugins.targetAtAnimation.length; i++) {
                var plugin = self.app.plugins.targetAtAnimation[i];
                var func = eval("(" + plugin.func + ")");
                func(child)
            }
            var animation = $(child).attr("ani");
            var attr_index = $(child).attr("index");
            var index = 1;
            if (attr_index != null) {
                index = parseInt(attr_index);
            }
            window.aniindex = index;

            child.enabled = false;
            if (animation) {
                var childAnimations = eval("(" + animation + ")");
                for (var i = 0; i < childAnimations.length; i++) {
                    var time = 0;
                    var classToBeAdd = ""
                    var anicate = "in";
                    var childAnimation = childAnimations[i];
                    if (childAnimation.cate) {
                        anicate = childAnimation.cate
                    }
                    if (childAnimation.c) {
                        anicate = childAnimation.c
                    }
                    if (childAnimation.type) {
                        classToBeAdd += (" " + childAnimation.type + " animated")
                    }
                    if (childAnimation.t) {
                        classToBeAdd += (" " + childAnimation.t + " animated")

                    }
                    if(childAnimation.d<=0){
                        classToBeAdd=classToBeAdd.replace(" animated", "")
                    }
                    if (childAnimation.interval>0) {
                        childAnimation.interval *= app.options.rate;
                        time+=childAnimation.interval
                        var classname = "during" + ("" + childAnimation.interval).replace(".", "_")
                        addClassStyle("." + classname, "-webkit-animation-duration:" + childAnimation.interval + "s;animation-duration:" + childAnimation.interval + "s;");
                        classToBeAdd += (" " + classname);
                    }
                    if (childAnimation.i>0) {
                        childAnimation.i *= app.options.rate;
                        time+=childAnimation.i
                        var classname = "during" + ("" + childAnimation.i).replace(".", "_")
                        addClassStyle("." + classname, "-webkit-animation-duration:" + childAnimation.i + "s;animation-duration:" + childAnimation.i + "s;");
                        classToBeAdd += (" " + classname);
                    }
                    if (childAnimation.delay>0) {
                        childAnimation.delay *= app.options.rate;
                        time+=childAnimation.delay
                        var classname = "delay" + ("" + childAnimation.delay).replace(".", "_")
                        addClassStyle("." + classname, "-webkit-animation-delay:" + childAnimation.delay + "s;animation-delay:" + childAnimation.delay + "s;");
                        classToBeAdd += (" " + classname);
                    }
                    if (childAnimation.d>0) {
                        childAnimation.d *= app.options.rate;
                        time+=childAnimation.d
                        var classname = "delay" + ("" + childAnimation.d).replace(".", "_")
                        addClassStyle("." + classname, "-webkit-animation-delay:" + childAnimation.d + "s;animation-delay:" + childAnimation.d + "s;");
                        classToBeAdd += (" " + classname);
                    }
                    if (childAnimation.infinite) {
                        classToBeAdd += (" infinite")
                    }
                    var tobePushed = {
                        ani: classToBeAdd
                    };
                    tobePushed.id = "";
                    if (childAnimation.id) {
                        tobePushed.id = childAnimation.id;
                    }
                    tobePushed.time = time;
                    switch (anicate) {
                        case "in":
                            inanimations.push(tobePushed);
                            break;
                        case "out":
                            outanimations.push(tobePushed);
                            break;
                        case "wait":
                            waitanimations.push(tobePushed);
                            break;
                    }
                }
                $(child).attr("time", time);
                $(child).attr("in", JSON.stringify(inanimations));
                $(child).attr("out", JSON.stringify(outanimations));
                $(child).attr("wait", JSON.stringify(waitanimations));
                $(child).attr("in_index", -1);

                // console.log(waitanimations)

                var runInAnimation = () => {
                    if (inanimations.length) {
                        var currentIndex = $(child).attr("in_index");
                        currentIndex++;
                        var inanis = eval("(" + $(child).attr("in") + ")");
                        var firstIn = inanis[currentIndex].ani;
                        var c= $(child).attr("currentAnimation");
                        $(child).removeClass(firstIn)
                        $(child).removeAttr(firstIn);
                        $(child).attr("currentAnimation", firstIn);
                        $(child).removeClass(c).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            //console.log("ANIMATING")
                            $(this).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend')
                            if ($(this).attr("indone")) return;
                            var currentIndex = $(this).attr("in_index");
                            var currentAnimation = $(this).attr("currentAnimation")
                            var inanis = eval("(" + $(this).attr("in") + ")");

                            if (currentIndex == inanis.length - 1) {
                                $(this).attr("indone", true);
                                return;
                            }
                            // $(this).removeClass(currentAnimation)
                            // $(this).removeAttr(currentAnimation);
                            //runInAnimation(this);
                        }).show().addClass(firstIn);
                    }
                }
                runInAnimation();
            }
        }
    }
    runOutAnimation(dom, removeElements = true) {
        dom = $(dom);
        for (var i = 0; i < dom.length; i++) {
            var d = dom[i];
            var out = $(d).attr("out");
            if(out=="[]")continue;
            $(d).removeClass($(d).attr("currentAnimation"));
            $(d).removeAttr("currentAnimation");
            //从简走一个
            var o = $(d).attr("out");
            if(o==null)continue;
            var outAnimations = eval("(" + o + ")");

            if (outAnimations.length) {
                var c = $(d).attr("currentAnimation");
                $(d).attr("currentAnimation", outAnimations[0].ani)
                $(d).removeClass(c).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

                    $(this).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend')
                    // if(removeElements)$(this).remove();
                    // else{
                    //     //$(this).hide();
                    //     // $(this).removeClass($(this).attr("currentAnimation"));
                    //     // $(this).removeAttr("currentAnimation");
                    // }
                }).show().addClass(outAnimations[0].ani);

            }
        }
    }
    remove(dom, show=true){
        var result = $(dom).removeClass($(dom).attr("currentanimation"));
        if(show){
            result = result.show().css("opacity",1);
        }
        return result;
    }
    runWaitAnimation(dom, id, callback, removeElements) {
        dom = $(dom);
        var time = 0.01;
        for (var i = 0; i < dom.length; i++) {
            var d = dom[i];
            $(d).removeClass($(d).attr("currentAnimation"));
            $(d).removeAttr("currentAnimation");
            var waitAnimations = eval("(" + $(d).attr("wait") + ")");

            var index = 0;
            if (id != null) {
                if (id != "") {
                    for (var i = 0; i < waitAnimations.length; i++) {
                        if (waitAnimations[i].id == id) {
                            index = i;
                            break;
                        }
                    }
                }
            }
            var t = waitAnimations[index].time;
            if(t>time){
                time = t;
            }
            $(d).attr("currentAnimation", waitAnimations[index].ani)
            $(d).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend')
                if(removeElements)$(this).remove();
            }).show().addClass(waitAnimations[index].ani);;
            this.app.tools.timeout(callback, time*1000);
        }
    }

}