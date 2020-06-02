/**
 * Created by zhangtong from KESYN SOFTWARE on 2016/9/4.
 */

"use strict";
// import * as $ from 'jquery';
var queue = [];
var currentIntervals = [];
var animations = {};
var styles = {};
export default class Animator{
    constructor(app){
        this.app = app;
    }

    initAnimations(page){

        animations[page] = {

        }
        var a = animations[page];
        var children = $(page).find("*");
        var styleStr = "";
        for (var x = 0; x < children.length; x++) {
            var child = $(children[x]);
            if(!child.attr("ani")){
                continue;
            }
            var childAnis = {}
            var anis = eval(`(${child.attr("ani")})`) ;
            for(var [index, animation] of anis.entries()){
                if(!a[animation.c]){
                    a[animation.c] = [];
                }
                if(!childAnis[animation.c]){
                    childAnis[animation.c] = [];
                }
                childAnis[animation.c].push(animation);

                if(!animation.t){
                    if(animation.from && animation.to){
                        var animationName = `${child.attr("id")}_${animation.c}_${index}`;
                        animation.t = animationName;
                        if(!styles[animationName]){
                            styles[animationName] = true;
                            const convertPx = (num)=>{
                                if((num+"").indexOf("%")>=0){
                                    return num;
                                }
                                return num + "px";
                            }
                            const generateStyle = (data)=>{
                                return `${data.alpha!=null?"opacity: "+ data.alpha + ";": ""}${data.x!=null||data.y!=null||data.scale!=null||data.rotate!=null?"-webkit-transform:"+`${data.x!=null||data.y!=null?`translate3d(${data.x!=null?convertPx(data.x):0},${data.y!=null?convertPx(data.y):0},0) `:""}${data.scale!=null?`scale3d(${data.scale},${data.scale},${data.scale}) `:""}${data.rotate!=null?`rotate(${data.rotate}deg) `:""}`+";":""}`
                            }
                            const midTime = [];
                            for(var k in animation){
                                if(k.indexOf("%")>=0){
                                    midTime.push({key: k, ani: animation[k]});
                                }
                            }

                            styleStr += `@-webkit-keyframes ${animationName}{from{${generateStyle(animation.from)}}${midTime.map(c=>{return `${c.key}{${generateStyle(c.ani)}}`}).join("")}to{${generateStyle(animation.to)}}}
`
                        }
                    }
                }

                // if(animation.t){
                //     var classname = `${animation.t}__${animation.d}__${animation.i}__${animation.infinite?"inf": ""}`;
                //     classname = classname.replace(/\./g, "");
                //     if(!styles[classname]){
                //         styles[classname] = `.`
                //     }
                // }
            }
            var classes = [];
            for(var key in childAnis){
                var anis = childAnis[key];
                var classname = anis.map(c=>`${c.t}__${c.d}__${c.i}__${c.infinite?"inf": ""}`).join("___").replace(/\./g, "");
                if(!styles[classname]){
                    styles[classname] = true;
                    styleStr += `.${classname}{-webkit-animation-name:${anis.map(c=>c.t).join(",")};-webkit-animation-delay:${anis.map(c=>c.d+"s").join(",")};-webkit-animation-duration:${anis.map(c=>c.i+"s").join(",")};-webkit-animation-iteration-count:${anis.map(c=>c.infinite?'infinite': 1).join(",")};-webkit-animation-timing-function:${anis.map(c=>c.f!=null?c.f: 'linear').join(",")};-webkit-animation-fill-mode:${anis.map((c,i)=>i===0?'both':'forwards').join(",")};}
`
                }
                child.attr("data-ani-"+key, classname);
                classes.push(classname);
            }
            child.attr("data-ani", classes.join(" "));
        }
        if(styleStr.length>0) {
            $("body").append(`<style>${styleStr}</style>`);
        }
    }

    runAnimation(page, cate){
        // var childAnis = animations[page][cate];
        var children = $(page).find("*");
        for (var x = 0; x < children.length; x++) {
            var child = $(children[x]);

            var className = child.attr("data-ani-" + cate);
            if(!className){
                continue;
            }
            child.hide().removeClass(child.attr("data-ani")).addClass(className).show();
        }
    }

    handleAnimation(page){
        if(!animations[page]){
            this.initAnimations(page);
        }
        this.runAnimation(page, "in");
    }


}