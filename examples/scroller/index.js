var html = require('./index.html');
import * as $ from 'jquery'
import {
    size
} from '../../src/helpers'
import 'animate.css'
import Scroller from '../../src/Scroller'
export default class {
    constructor() {
        this.id = 'page1';
        this.Html = html;
        this.files = [];
    }
    data() {

    }
    load() {
        window.App.animator.handleAnimation("#page1");
        var contents = [];

        var getColor = function(index){
            var color = index%1000;
            return Math.floor(Math.random()*16777215).toString(16);
        };

        var i = 0;
        for(i=0;i<20;i++){
            contents.push({
                id: "C" + i,
                data: 'hello ' + i,
                height: w(500),
                index: i,
                backgroundColor: "#" + getColor(i)
            });
        }
        // contents[contents.length-1].isEnd = false;
        var scroller = new Scroller("#scroller", require('./Scroller.html'), contents, {
            loadDownMore: function(callback){
                var newContents = [];
                for(var i=contents.length;i<contents.length+20;i++){
                    newContents.push({
                        id: "C" + i,
                        data: 'hello ' + i,
                        index: i,
                        height: w(500),
                        backgroundColor: "#" + getColor(i)
                    })
                }
                callback(newContents)
            }
        })
    }
}