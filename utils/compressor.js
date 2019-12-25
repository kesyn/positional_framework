var fs = require('fs');
var glob = require('glob');
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
    var imgs = $("img.cal");
    for(var i = 0; i<imgs.length; i++){
        var img = imgs.eq(i);
        var src = img.attr("src");
        var position = img.attr("position");

        var file = {...files[src]};
        if(position) {
            position = position.replace(/\*/g, "+'*'+").replace(/\//g, "+'/'+");
            var p = eval("(" + position + ")");
            if(p.cx!=null){
                file.cx = p.cx;
            }
            if(p.cy!=null){
                file.cy = p.cy;
            }
            if(p.x!=null){
                file.x = p.x;
            }
            if(p.y!=null){
                file.y = p.y;
            }
            if(p.bottom!=null){
                file.bottom = p.bottom;
            }
            if(p.right!=null){
                file.right = p.right;
            }
            if(p.width!=null){
                file.width = p.width;
            }
            if(p.height!=null){
                file.height = p.height;
            }
            for(var key in file){
                if(typeof file[key] == "undefined"){
                    delete file[key];
                }
                if(file[key] == null){
                    delete file[key];
                }
            }
        }
        delete file.file
        var json = JSON.stringify(file).replace(/"/g, "");
        img.attr("position", json);
    }
    var html = ($("body").html());
    fs.writeFileSync(f, html, 'utf8')
}

