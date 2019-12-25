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
    constructor(files){
        this.files = files;
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
        var scale = window.stageWidth/750;
        var evalWithContainer = function(value){
            try {
                if (containerSize) {
                    value = value.replace(/window\.innerWidth/g, "containerSize.width").replace(/window\.innerHeight/g, "containerSize.height")
                        .replace(/window\.stageWidth/g, "containerSize.width").replace(/window\.stageHeight/g, "containerSize.height")
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
        var file = null;
        if(src){
            if(src.indexOf("blob") == 0){
                src = window.blobDict[src];
            }
            file = this.files[src];
        }
        // console.log(file)
        var offset = {
            // cx: $(element).attr("cx"),
            // cy: $(element).attr("cy"),
            // bottom: $(element).attr("bottom"),
            // right: $(element).attr("right"),
            // x: $(element).attr("x") ? evalWithContainer($(element).attr("x")) : 0,
            // y: $(element).attr("y") ? evalWithContainer($(element).attr("y")) : 0,
            // cx: file&&file.cx,
            // cy: file&&file.cy,
            // bottom: file&&file.cy,
            // right: file&&file.right,
            // x: file&&file.x,
            // y: file&&file.y,
            fontSize: $(element).attr("fontSize"),
            color: $(element).attr("color"),
            alpha: $(element).attr("alpha"),
            skip: $(element).attr("skipCal"),
            scale: $(element).attr("scale")
        };

        if(file){
            offset.cx = file.cx;
            offset.cy = file.cy;
            offset.x = file.x;
            offset.y = file.y;
            offset.bottom = file.bottom;
            offset.right = file.right;
        }



        if($(element).attr("cx")!=null){
            offset.cx = evalWithContainer($(element).attr("cx"))
        }
        if($(element).attr("cy")!=null){
            offset.cy = evalWithContainer($(element).attr("cy"))
        }
        if($(element).attr("bottom")!=null){
            offset.bottom = evalWithContainer($(element).attr("bottom"))
        }
        if($(element).attr("right")!=null){
            offset.right = evalWithContainer($(element).attr("right"))
        }
        if($(element).attr("x")!=null){
            offset.x = evalWithContainer($(element).attr("x"))
        }
        if($(element).attr("y")!=null){
            offset.y = evalWithContainer($(element).attr("y"))
        }
        if(file){
            offset.width = evalWithContainer(file.width);
            offset.height = evalWithContainer(file.height);
        }
        if($(element).attr("w")){
            offset.width = evalWithContainer($(element).attr("w"));
            // console.log(eval($(element).attr("w")), eval($(element).attr("h")))
        }
        if($(element).attr("h")){
            offset.height = evalWithContainer($(element).attr("h"))
            // console.log(eval($(element).attr("w")), eval($(element).attr("h")))
        }
        if($(element).attr("position")!=null){
            offset = {...offset, ...evalWithContainer("(" + $(element).attr("position") + ")")};

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
        if(offset.bottom){
            top = designSize.height - offset.height + top;
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
        if(!offset.skip) {
            // alert("not skip")
            // console.log(src);
            // console.log(offset);
            $(element).width(offset.width).height(offset.height).css("position", "absolute").css("opacity", opacity).css({
                left: offset.x,
                top: offset.y
            });
        }
        else{
            // alert("skip")
            // console.log("skip")
            $(element).width(offset.width).height(offset.height)
        }
    }
}