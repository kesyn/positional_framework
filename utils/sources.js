var fs = require('fs');
var sizeOf = require('image-size');
var glob = require('glob');
var pages = require('../pages.json');

var files = [];

for(var page of pages){
    var imgs = page.images;
    var docWidth = page.width;
    var docHeight = page.height;
    for(var img of imgs){
        if(img.re){
            var layerInfo = img.layer;
            img.x = layerInfo.left;
            img.y = layerInfo.top;
            img.width = layerInfo.width;
            img.height = layerInfo.height;
            if(img.cx){
                img.x = layerInfo.left + layerInfo.width/2 - docWidth/2;
            }
            if(img.cy){
                img.y = layerInfo.top + layerInfo.height/2 - docHeight/2;
            }
            if(img.bottom){
                img.y = layerInfo.bottom - docHeight;
            }
            if(img.right){
                img.x = layerInfo.right - 750;
            }
        }
        files.push({
            name: 'sources/' + img.pageName + "/" + img.id + ".png",
            width: img.width,
            height: img.height,
            x: img.x,
            y: img.y,
            cx: img.cx,
            cy: img.cy,
            bottom: img.bottom,
            right: img.right
        })
    }
}
for(var file of glob.sync("sources/*")){
    if(file.indexOf("png")>=0||file.indexOf("jpg")>=0||file.indexOf("gif")>=0){
        var size = sizeOf(file);
        var has = false;

        for(var f of files){
            if(f.name == file){
                has = true;
            }
        }

        if(has)continue;
        files.push({
            name: file,
            width: size.width,
            height: size.height
        })
    }
}
var js = `
${files.map(c=>{
    return `import Image_${c.name.replace("sources/","").replace("/", "_").replace("-", "_").replace(".png", "").replace(".jpg", "").replace(".gif", "")} from '../${c.name}';
`
}).join("")}
var files = {};
${files.map(c => {
    return `files[Image_${c.name.replace("sources/","").replace("/", "_").replace("-", "_").replace(".png", "").replace(".jpg", "").replace(".gif", "")}] = {
    file: Image_${c.name.replace("sources/","").replace("/", "_").replace("-", "_").replace(".png", "").replace(".jpg", "").replace(".gif", "")},
    width: "${c.width}",
    height: "${c.height}",
    x: ${c.x},
    y: ${c.y},
    cx: ${c.cx},
    cy: ${c.cy},
    bottom: ${c.bottom},
    right: ${c.right},
};
`
}).join("")}
var keys = Object.keys(files);
for(var i=0;i<keys.length;i++){
    var key = keys[i];
    if(key.indexOf("data:")==0){
        delete files[key];
    }
}
export default files;
`;
fs.writeFileSync("src/files.js", js, 'utf8')