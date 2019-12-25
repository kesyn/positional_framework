/**
 * Created by zhangtong from KESYN SOFTWARE on 2016/9/4.
 */

"use strict";
var lasttimeoutPage = null;
var tempindex = 1;
export default class Tools {
    constructor(app){
        this.app = app;
    }
    timeout(func, time) {
        if(func == null)return;
        lasttimeoutPage = this.app.currentPage;
        var ltp = lasttimeoutPage;
        setTimeout(function () {
            if (ltp != null) {
                if (this.app.currentPage == ltp) {
                    func();
                    lasttimeoutPage = null;
                } else {
                    lasttimeoutPage = null;
                }
            }
        }, time)
    }
    on(dom, event, handler){
        $(dom).off(event);
            $(dom).on(event, function(ev){

                if(parseFloat($(this).css("opacity"))>0) {
                    handler(this, ev.originalEvent.touches[0])
                }
            });
    }

    bindData(pageid, data, computedData) {
        new Vue({
            el: pageid,
            data: data,
            methods: [],
            computed: computedData
        })
    }

    getQueryStr(param) {
        var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2].replace(/\+/g, '%20'));
        }
        return '';
    }

    log(text) {
        $("#log").text(text);
        console.log(text);
    }

    getTempId() {
        window.tempindex++;
        return "TMPC" + window.tempindex;
    }

    resetViewport() {
        var get_target_densitydpi = 750 / document.documentElement.clientWidth * 160;
        if (get_target_densitydpi < 70)
            get_target_densitydpi = 70;
        var targetDensitydpi = 'target-densitydpi=' + get_target_densitydpi + ', width=750, user-scalable=no';
        document.getElementsByName('viewport')[0].setAttribute('content', targetDensitydpi);
    }

    get(key, json=false){
        if(json){
            return Cookies.getJSON(key);
        }
        return Cookies.get(key);
    }
    set(key, val, expires=null){
        if(!expires) {
            Cookies.set(key, val);
        }
        else{
            Cookies.set(key, val, {expires:expires});
        }
    }
}
