var fs = require('fs');
var sizeOf = require('image-size');
var glob = require('glob');
var pages = require('../pages.json');
var tobeChanged = {};
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
            delete img.re;
            tobeChanged["." + img.id] = {
                x: img.x,
                y: img.y,
                width: img.width,
                height: img.height,
                cx: img.cx,
                cy: img.cy,
                bottom: img.bottom,
                right: img.right
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
fs.writeFileSync('pages.json', JSON.stringify(pages, null, 4), 'utf8')
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


var lines = fs.readFileSync('src/files.js', 'utf8');
const cheerio = require('cheerio')

lines = lines.replace(/import /g, "var ").replace(/ from /g, " = ");
lines = lines.replace("export default files;", "");
eval(lines);
var window = {
    stageWidth: "window.stageWidth",
    stageHeight: "window.stageHeight"
}


for(var f of glob.sync("pages/*.html")){
    const $ = cheerio.load(fs.readFileSync(f, 'utf8'), {
        decodeEntities: false
    });
    var changed = false;
    for(var className in tobeChanged){
        var json = JSON.stringify(tobeChanged[className]).replace(/"/g, "");
        console.log(className)
        $(className).attr("position", json);
        changed = true;
    }
    // var imgs = $("img.cal");
    // for(var i = 0; i<imgs.length; i++){
    //     var img = imgs.eq(i);
    //     var src = img.attr("src");
    //     var position = img.attr("position");
    //
    //     var file = {...files[src]};
    //     if(position) {
    //         position = position.replace(/\*/g, "+'*'+").replace(/\//g, "+'/'+");
    //         for(var key in file){
    //             if(typeof file[key] == "undefined"){
    //                 delete file[key];
    //             }
    //             if(file[key] == null){
    //                 delete file[key];
    //             }
    //         }
    //     }
    //     delete file.file
    //     var json = JSON.stringify(file).replace(/"/g, "");
    //     console.log(json);
    //     img.attr("position", json);
    // }
    if(changed) {
        var html = ($("body").html());
        console.log(f)
        fs.writeFileSync(f, html, 'utf8')
    }
}

