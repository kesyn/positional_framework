// import * as $ from 'jquery'
window.blobDict = {};
export default class {
    constructor(pages){
        this.pages = pages;
        this.currentPage = ""
    }
    goto(page){
        var self = this;
        if(page.preload)
            page.preload();
        var html = page.Html;
        var $html = $(html);
        var $imgs = $html.find("img");
        for(var i=0;i<$imgs.length;i++){
            var src = $imgs.eq(i).attr("src");
            if(src.length>2&&src.indexOf("data")!=0){
                if(!src)continue;
                // console.log(src)
                var newSrc = window.loader.get(src).getAttribute("src");
                $imgs.eq(i).attr("src", newSrc);
                window.blobDict[newSrc] = src;
            }
        }
        var last = self.currentPage;
        ko.cleanNode($("#"+last)[0]);
        // $("#page").append($html[0].outerHTML);
        // $($html[0].outerHTML).insertBefore("#musicbtn")
        $("#page").append($html[0].outerHTML)
        $("#" + page.id).hide();
        $("#" + last).remove();
        $("#" + page.id).fadeIn(200, function(){

        })
        
        var data = new page.data();
        ko.applyBindings(data, $("#" + page.id)[0]);
        page.load(data);
        window.App.positional.drawElements(".cal");
        this.currentPage = page.id;
    }
    start(page){
        if(!page){
            var tp = window.App.tools.getQueryStr("tp");
            page = this.pages.Page1;

            if(tp){
                page = window.pages[tp];
            }
            if(page.preload)
                page.preload();
            var html = page.Html;
            var $html = $(html);
            var $imgs = $html.find("img");
            for(var i=0;i<$imgs.length;i++){
                var src = $imgs.eq(i).attr("src");
                if(!src)continue;
                // console.log(src);
                if(src.length>2&&src.indexOf("data")!=0){
                    var newSrc = window.loader.get(src).getAttribute("src");
                    $imgs.eq(i).attr("src", newSrc);
                    window.blobDict[newSrc] = src;
                }
            }

            // $($html[0].outerHTML).insertBefore("#musicbtn")
            $("#page").append($html[0].outerHTML)
            var data = new page.data();
            ko.applyBindings(data, $("#" + page.id)[0]);
            page.load(data);
            this.currentPage = page.id;
        }
        window.App.positional.drawElements(".cal");
        // $("#page").fadeIn(100, 'linear', ()=>{})
    }
}