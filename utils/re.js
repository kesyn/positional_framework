var fs = require('fs');
var pages = require('../pages.json');
// var page1 = pages[0];
// for(var img of page1.images) {
//     if(!img.cy){
//         img.re = true;
//         img.cy = true;
//         img.bottom = false;
//     }
// }
// fs.writeFileSync("pages.json", JSON.stringify(pages, null, 4), 'utf8');
for(var page of pages){
    for(var img of page.images) {
        if(img.id.indexOf("_b")>=0){
            img.re = true;
            img.cy = false;
            img.bottom = true;
        }
        if(img.id.indexOf("_t")>=0){
            img.re = true;
            img.cy = false;
            img.bottom = false;
        }
        if(img.id.indexOf("_c")>=0){
            img.re = true;
            img.cy = true;
            img.bottom = false;
        }
    }
}
fs.writeFileSync("pages.json", JSON.stringify(pages, null, 4), 'utf8');