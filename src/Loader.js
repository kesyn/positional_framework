var preloader = require('preloader')
var useXHR = true;
if(navigator.appName.indexOf("Internet Explorer")!=-1){     //yeah, he's using IE
    if(navigator.appVersion.indexOf("MSIE 9")>=0||navigator.appVersion.indexOf("MSIE 10")>=0){
        useXHR = false
    }
}
const loader = preloader({xhrImages: useXHR})
window.loader = loader;
var current = 0;
export default class {
    constructor(files){
        var keys = Object.keys(files);
        for(var i=0;i<keys.length;i++){
            var key = keys[i];
            if(key.indexOf("data:")==0){
                delete files[key];
            }
        }
        // console.log(files);
        this.files = files;
    }

    start(callback, loading){
        loader.on('progress', function(progress){
            if(progress>current){
                loading(progress);
                current = progress;
            }
            // if(loading){
            //     loading(progress);
            // }
        })
        loader.on("complete", function(){
            if(callback){
                callback();
            }
        })
        var keys = Object.keys(this.files);
        for(var i=0;i<keys.length;i++){
            var file = keys[i];
            loader.add(this.files[file].file);
        }
        loader.load();
    }
}