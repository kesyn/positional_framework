// import * as $ from 'jquery'
window.resetBlob = function(arr){
    for(var i=0;i<arr.length;i++){
        var src = arr[i];
        var blob = window.loader.get(src).getAttribute("src");
        arr[i] = blob;
    }
}
window.resetAllBlob = function(arr){
    for(var i=0;i<arr.length;i++){
        resetBlob(arr[i]);
    }
}

window.offset = function(l1, l2, l3, l4){
    var scale = window.stageWidth/750;
    window.stageScale = scale;

    var targetHeight = 750*window.stageHeight/window.stageWidth;
    // console.log(targetHeight)
    if(targetHeight<1200){
        return l1;
    }
    if(targetHeight<1250){
        return l2;
    }
    if(targetHeight<1400){
        return l3;
    }
    if(targetHeight>1400){
        return l4
    }
}
export default class {
    constructor(){
    }

    fullScreen(query){

        var doms = document.querySelectorAll(query);
        for (var i=0;i<doms.length; i++) {
            var element = doms[i];
            $(element).width(window.stageWidth).height(window.stageHeight);
        }
    }

    drawElements(selector, containerSize){
        var doms = document.querySelectorAll(selector);
        for (var i=0;i<doms.length; i++) {
            var element = doms[i];
            this.drawElement(element, containerSize);
        }
    }
    drawElement(element, containerSize){
        var limitSize = {
            width: $(".limit").width(),
            height: $(".limit").height(),
            top: $(".limit").offset().top,
            left: $(".limit").offset().left
        }
        var scale = window.stageWidth/750;
        var style = $(element).attr("_style");
        if(style){

            style = eval("(" + style + ")");
            $(element).css(style);
            $(element).removeAttr("_style");
        }
        if($(element).attr("position")==null){
            return;
        }
        var evalWithContainer = function(value){
            try {
                if (containerSize) {
                    if(typeof value == "string") {
                        value = value.replace(/window\.innerWidth/g, "containerSize.width").replace(/window\.innerHeight/g, "containerSize.height")
                            .replace(/window\.stageWidth/g, "containerSize.width").replace(/window\.stageHeight/g, "containerSize.height")
                    }
                }
                var result = eval(value);
                return result;
            }
            catch (e) {
                // console.log(value)
                throw e;
            }
        }
        window.stageScale = scale;

        window.handleSprites = function(sprite){
            var result = {};
            var frames = sprite.frames;
            for(var i=0;i<frames.length;i++){
                var frame = frames[i]
                result[frame.filename.replace("png.png", "").replace(".png", "")] = {
                    x: -w(frame.frame.x),
                    y: -w(frame.frame.y),
                    w: w(frame.frame.w),
                    h: w(frame.frame.h),
                    offset: {
                        x: w(frame.spriteSourceSize.x),
                        y: w(frame.spriteSourceSize.y)
                    }
                }
            }
            return result;
        }

        var src = $(element).attr("src");

        var offset = {
        };

        var out = true;
        if($(element).attr("position")!=null){
            var positionStr = $(element).attr("position");
            var tmpStr = positionStr
            .replace(/window\.fullWidth/g, "window.stageWidth/window.stageScale")
            .replace(/window\.fullHeight/g, "window.stageHeight/window.stageScale")
            .replace(/fullWidth/g, "window.stageWidth/window.stageScale")
            .replace(/fullHeight/g, "window.stageHeight/window.stageScale");
            
            if(!eval('(' + tmpStr + ')').out){
                positionStr = positionStr.replace(/fullWidth/g, limitSize.width).replace(/fullHeight/g, limitSize.height)
                .replace(/window\.fullWidth/g, limitSize.width).replace(/window\.fullHeight/g, limitSize.height)
                out = false;
            }
            positionStr = positionStr
                .replace(/window\.fullWidth/g, "window.stageWidth/window.stageScale")
                .replace(/window\.fullHeight/g, "window.stageHeight/window.stageScale")
                .replace(/fullWidth/g, "window.stageWidth/window.stageScale")
                .replace(/fullHeight/g, "window.stageHeight/window.stageScale")
            
            offset = {...offset, ...evalWithContainer("(" + positionStr + ")")};
        }
        if(offset.scale){
            offset.scale = evalWithContainer(offset.scale)
            // console.log(offset.scale)
            offset.width *= offset.scale;
            offset.height *= offset.scale;
        }

        // console.log(offset)
        // console.log(!!$(element).attr("bottom"));

        var designSize = {width: window.stageWidth, height: window.stageHeight}
        if(!out){
            designSize = limitSize;
        }
        if(containerSize){designSize = containerSize;}
        // console.log(scale)
        
        if(offset.color){
            $(element).css("color", offset.color)
        }

        offset.width = offset.width*scale;
        offset.height = offset.height*scale;
        offset.x *= scale;
        offset.y *= scale;
        // console.log(offset)
        var left = 0;
        var top = 0;
        if(!offset.width&&!offset.height){
            offset.width = designSize.width;
            offset.height = designSize.height;
        }
        if(offset.x){
            left = offset.x;
        }
        if(offset.y){
            top = offset.y;
        }
        if(offset.cx){
            left = designSize.width/2-offset.width/2+left;
            //top = designSize.height/2-offset.height/2+top;
        }
        if(offset.cy){
            // left = designSize.width/2-offset.width/2+left;
            top = designSize.height/2-offset.height/2+top;
        }
        var bottom = 0;
        if(offset.bottom){
            top = designSize.height - offset.height + top;
            bottom = designSize.height-top-offset.height
            // console.log("t " + top);
        }
        if(offset.right){
            left = designSize.width - offset.width + left;
        }
        offset.x = left;
        offset.y = top;
        if(src&&src.indexOf("logo")>=0){
            // console.log(offset.y)
        }
        var opacity = 1;
        if(offset.alpha){
            opacity = offset.alpha;
        }
        if(offset.fontSize){
            $(element).css("font-size", (offset.fontSize*scale)+"px")
            $(element).css("line-height", offset.height + "px")
        }
        if(offset.height){
            offset.height = Math.ceil(offset.height);
        }
        if(offset.width){
            offset.width = Math.ceil(offset.width);
        }
        if(offset.height<=0){
            offset.height = "auto"
        }
        if(offset.width<=0){
            offset.height = "auto"
        }
        if(offset.stretch){
            console.log(offset.design);
            offset.height = designSize.height - offset.design[2]*scale - (offset.design[4]*scale - offset.design[3]*scale);
        }
        if(!out){ 
            offset.y += limitSize.top;
            if(offset.bottom){
                bottom = bottom + (window.stageHeight - limitSize.top - limitSize.height)
            }
        }
        if(!offset.skip) {
            // alert("not skip")
            // console.log(src);
            // console.log(offset);
            if(offset.bottom) {
                $(element).width(offset.width).height(offset.height).css("position", "absolute").css("opacity", opacity).css({
                    left: offset.x,
                    bottom: bottom
                });
            }
            else{
                $(element).width(offset.width).height(offset.height).css("position", "absolute").css("opacity", opacity).css({
                    left: offset.x,
                    top: offset.y
                });
            }
        }
        else{
            // alert("skip")
            // console.log("skip")
            $(element).width(offset.width).height(offset.height)
        }
    }
}