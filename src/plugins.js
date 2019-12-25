"use strict";

let plugins = {
    targetAtPosition: [],
    targetAtAnimation:[]
}
for (var i = 0; i < plugins.targetAtPosition.length; i++) {
    let element = plugins.targetAtPosition[i];
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.src = element.file;
    script.type = 'text/javascript';
    head.appendChild(script);
}
for (var i = 0; i < plugins.targetAtAnimation.length; i++) {
    let element = plugins.targetAtAnimation[i];
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.src = element.file;
    script.type = 'text/javascript';
    head.appendChild(script);
}
export default plugins;