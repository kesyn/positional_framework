import Impetus from "impetus";

export default class Scroller{
    constructor(id, htmlStr, initData, options ){
        this.$dom = $(id);
        this.$html = $(htmlStr);
        this.data = initData;
        this.queueWindow = [];

        this.content = this.$html.find("#scroll_body").html();

        this.$html.find("#scroll_body").remove();

        this.$dom.append(this.$html);

        this.options = options;
        if(!this.options.queueLength){
            this.options.queueLength = 5;
        }

        for(let i=0;i<this.options.queueLength&&i<this.data.length;i++){
            // var item = initData[i];
            $("#scroll_container").append($(this.content).attr("id", "CONTAINER__" + i).addClass("tobeMoved"));
            // ko.cleanNode($("#" + "CONTAINER__" + i)[0])
            // ko.applyBindings(item, $("#" + "CONTAINER__" + i)[0]);
            // this.queueWindow.push(item);
            // item.domId = "#" + "CONTAINER__" + i;
        }

        for(var i=0;i<initData.length;i++){
            var data = initData[i];
            var nextIndex = i+1;
            if(nextIndex < initData.length){
                data.next = initData[nextIndex];
                initData[nextIndex].last = data
            }
            else{

            }
        }

        var self = this;
        var lastMomentDistance = 0;
        new Impetus({
            source: this.$dom[0],
            update: function(x, y){
                if(lastMomentDistance == null){
                    lastMomentDistance = y;
                }
                var delta = y - lastMomentDistance;
                self.moveDelta(delta);
                lastMomentDistance = y;
            }
        });
        this.$dom.on("touchend", function(){
            if(self.data.length - self.queueWindow[self.queueWindow.length - 1].index<10){
                self.options.loadDownMore(function(data){
                    if(!data.length)return;
                    self.data[self.data.length - 1].next = data[0];
                    data[0].last = self.data[self.data.length - 1];
                    for(var i=0;i<data.length;i++){
                        var item = data[i];
                        if(i+1<data.length){
                            var next = data[i+1];
                            item.next = next;
                            next.last = item;
                        }
                        self.data.push(item);
                    }

                })
            }
        })
        this.init();
    }
    init(){
        var totalHeight = 0;
        this.data[0].isTop = true;
        for(var i=0;i<this.data.length;i++){
            var item = this.data[i];
            if(totalHeight<window.innerHeight){
                item.y = totalHeight;
                var tobeMoved = $(".tobeMoved").eq(0);
                tobeMoved.removeClass("tobeMoved");
                item.domId = "#" + tobeMoved.attr("id");
                ko.cleanNode($(item.domId)[0]);
                ko.applyBindings(item, $(item.domId)[0]);
                $(item.domId).css("transform", `translate3d(0, ${item.y}px, 0)`);
                totalHeight += item.height;
                this.queueWindow.push(item);
            }
            else{
                break;
            }
        }
    }
    moveDelta(delta){
        if(this.queueWindow[0].isTop){
            if(this.queueWindow[0].y + delta >= 0) {
                delta = -this.queueWindow[0].y;
            }
        }
        if(this.queueWindow[this.queueWindow.length - 1].isEnd){
            if(this.queueWindow[this.queueWindow.length - 1].y + this.queueWindow[this.queueWindow.length - 1].height + delta <= window.innerHeight){
                delta = window.innerHeight - (this.queueWindow[this.queueWindow.length - 1].y + this.queueWindow[this.queueWindow.length - 1].height);
            }
        }

        for(var i=0;i<this.queueWindow.length;i++){
            var item = this.queueWindow[i];
            $(item.domId).css("transform", `translate3d(0, ${item.y + delta}px , 0)`).show();
            item.y += delta;
        }

        var lastOneId = this.queueWindow[this.queueWindow.length - 1].domId;
        var offsetLast = $(lastOneId).offset();
        if(offsetLast.top + $(lastOneId).height() < window.innerHeight){
            var firstNext = $(".tobeMoved").eq(0);
            firstNext.removeClass("tobeMoved");
            var next = this.queueWindow[this.queueWindow.length-1].next;
            ko.cleanNode(firstNext[0]);
            ko.applyBindings(next, firstNext[0]);
            next.y = offsetLast.top + $(lastOneId).height();
            this.queueWindow.push(next);
            next.domId = "#" + firstNext.attr("id");

            $(this.queueWindow[this.queueWindow.length-1].domId).css("transform", `translate3d(0, ${offsetLast.top + $(lastOneId).height()}px, 0)`).show();
        }

        var firstOneId = this.queueWindow[0].domId;
        var offsetFirst = $(firstOneId).offset();

        if(offsetFirst.top + $(firstOneId).height() < 0){
            var shifted = this.queueWindow.shift();
            shifted.domId = null;
            $(firstOneId).addClass("tobeMoved").hide();
            ko.cleanNode($(firstOneId)[0]);
        }

        if(offsetLast.top > window.innerHeight){
            var popped = this.queueWindow.pop();
            $(lastOneId).addClass("tobeMoved").hide();
            popped.domId = null;
            ko.cleanNode($(lastOneId)[0]);
        }

        if(offsetFirst.top>0){
            var firstLast = $(".tobeMoved").eq(0);
            firstLast.removeClass("tobeMoved");
            var lastOne = this.queueWindow[0].last;
            ko.cleanNode(firstLast[0]);
            ko.applyBindings(lastOne, firstLast[0]);
            lastOne.domId = "#" + firstLast.attr("id");
            lastOne.y = offsetFirst.top - $(lastOne.domId).height();
            this.queueWindow.unshift(lastOne);
            firstLast.css("transform", `translate3d(0, ${offsetFirst.top - $(lastOne.domId).height()}px, 0)`).show();
        }

    }


}