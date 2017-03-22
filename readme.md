# BOX-CHART-JS

## About
This lib is based on [KonvaJs](https://konvajs.github.io/)

## Pre-reqs
1. NodeJs
2. Bower


## Getting started

> bower i -s box-chart-js

## Using

```javascript
var plot = plotFiveBox(options);
```
> principal properties like ```stage```, ```mainLayer``` and ```mainRect``` from **KonvaJs**


## Default configuration

```html
<div id="myCanvas" style="width: 100%; height: 100%"></div>

<script src="bower/jquery/dist/jquery.min.js"></script>
<script src="bower/javascript-detect-element-resize/jquery.resize.js"></script>
<script src="bower/konva/konva.min.js"></script>
<script src="bower/overlap-js/overlap.js"></script>

<script type="text/javascript" src="five-box-chart.js"></script>

<script type="text/javascript">
    var options = {
        container: '#myCanvas', 
        xAxis: {
            text: 'text X axis here',
            rule:{
                start: 0.0, 
                end: 1.0,
                step: 0.1
            }
        }, 
        yAxis: {
            text: 'text Y axis here',
            rule:{
                start: 0, 
                end: 140,
                step: 10
            }
        }, 
        data: [
            {id: 0, x: 1, y: 1, text: null}
        ],
        boxes: [
            {x: 0, y: 0, w: 0.6, h: 90, fill: '#FFFF7F', text: 'E', events:{mouseenter: showInside}}, 
            {x: 0.6, y: 0, w: 1, h: 90, fill: '#FF7F7F', text: 'D', events:{mouseenter: showInside}}, 
            {x: 0, y: 90, w: 0.6, h: 140, fill: '#F2F2F2', text: 'C', events:{mouseenter: showInside}}, 
            {x: 0.6, y: 90, w: 1, h: 140, fill: '#7F7FFF', text: 'B', events:{mouseenter: showInside}}, 
            {x: 0.9, y: 130, w: 1, h: 140, fill: '#7FBF7F', text: 'A', events:{mouseenter: showInside}}, 
            //{x: 0, y: 0, w: 0.4, h: 60, fill: 'grey'}, 
            //{x: 0.5, y: 0, w: 0.9, h: 60, fill: 'blue'}, 
        ], 
        grid: {
            stroke:{x: '#C1C2C3', y: '#C1C2C3'}
        }
    };
    
    var _lastMouseBox = null;
    function showInside(evt){

        //alert(evt.currentTarget.data.text);
        var boxData = evt.currentTarget.data;
        if(_lastMouseBox==boxData) return;
        _lastMouseBox=boxData;


        
        for (var p = 0; p < plot.options.data.length; p++) {
            var data = plot.options.data[p];
            var point = data.point;
            data.h = 1;
            data.w = 1;

            var selected = false;
            if(boxData.text=='B'){
                var boxA = plot.options.boxes[4];
                selected = isCollision(data, boxData) && !isCollision(data, boxA);
            }else{
                selected = isCollision(data, boxData);
            }

            //point.fill((selected?'pink': data.fill));
            point.radius((selected?5: 2));
            
        }
        //console.log('update');
        plot.stage.draw();
    }
    function randomData(){
        var data = [];
        var length = Math.floor(Math.random() * 2000);
        for(var i = 0; i < length; i++){
            data.push({ 
                x: Math.floor(Math.random() * 1000)/1000, 
                y: Math.floor(Math.random() * 140), 
                radius: 2, fill: 'black'
            });
        }
        return data;
    }

    options.data = randomData();
    var plot = plotFiveBox(options);

    function isCollision(rect1, rect2){
        if (rect1.x >= rect2.x && rect1.x <= rect2.x + rect2.w &&
            rect1.y >= rect2.y && rect1.y <= rect2.y + rect2.h) {
            return true;
        }
        return false;
    }



</script>



```