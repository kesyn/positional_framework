import Pages from '../pages/'
const files = {}
const populate = function(file){
    if(typeof file === 'string'){
        if(file.indexOf("data:")<0){
            files[file] = {file}
        }
        return;
    }
    if(typeof file.length != 'undefined'){
        for(const f of file){
            populate(f);
        }
    }
}

for(const key in Pages){
    const page = Pages[key];

    const imgs = $(page.Html).find("img");
    for(let i=0;i<imgs.length;i++){
        const img = $(imgs[i]).attr("src");
        populate(img);
    }

    for(const file of page.files){
        populate(file);
    }
}
export default files;