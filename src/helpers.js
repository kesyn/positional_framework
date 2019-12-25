export function size(size){
    var scale = window.stageWidth/750;

    return scale * size;
}

export function calWidth(height){

}

export function screenSize(){
    var a = window.innerWidth;
    var b = window.innerHeight;
    if(a>b){
        return {
            width:b,
            height:a,
            vertical: false
        }
    }
    else{
        return {
            width: a,
            height: b,
            vertical: true
        }
    }
}