
function perByVal(max, val){
    return (val*100)/max;
}
function valByPer(max, per){
    return ((max * per)/100);
}

function posByVal(px, maxVal, val){
    return valByPer(px, perByVal(maxVal, val));
}


function plotFiveBox(options){

    var $container = $(options.container);
    var rangeX = options.xAxis.rule.end - options.xAxis.rule.start;
    var rangeY = options.yAxis.rule.end - options.yAxis.rule.start;

    var stage = new Konva.Stage({
      container: options.container,
      width: $container.width(), 
      height: $container.height()
    });

    var mainRect = new Konva.Rect({
        x: 40, y: 10, width: $container.width() - 100, height: $container.height() - 50, 
        fill: 'grey', 
        stroke: 'red'
    });
    var mainLayer = new Konva.Layer();
    

    /**
     * retorna as coordenadas x, y em pixels relativo ao mainRect a partir de um valor nas respectivas escalas informadas em xAxis e yAxis
     * @param {*} x 
     * @param {*} y 
     */    
    function pixelPointByVal(x, y){
        return {
                x: posByVal(mainRect.width(), (options.xAxis.rule.end - options.xAxis.rule.start), x), 
                y: posByVal(mainRect.height(), (options.yAxis.rule.end - options.yAxis.rule.start), y)
        };
    }
    function addLine(x1, y1, x2, y2, stroke, strokeWidth){
        var p1 = pixelPointByVal(x1, y1);
        var p2 = pixelPointByVal(x2, y2);

        return mainLayer.add(new Konva.Line({
            points: [p1.x + mainRect.x(), p1.y + mainRect.y(), p2.x + mainRect.x(), p2.y+ mainRect.y()], 
            stroke: stroke ? stroke : 'red', 
            strokeWidth: strokeWidth ? strokeWidth : 1, 
        }));
    }

    // draw grid
    for(var x = options.xAxis.rule.start; x < options.xAxis.rule.end; x+=options.xAxis.rule.step){
        addLine(x, 0, x, options.yAxis.rule.end, options.grid.stroke.x);
    }

    for(var y = options.yAxis.rule.start; y < options.yAxis.rule.end + options.yAxis.rule.step; y+=options.yAxis.rule.step){
        addLine(0, y, options.xAxis.rule.end, y, options.grid.stroke.y);
    }

    /**
     * Retorna um Path de um retangulo a partir de pontos de escala
     * @param {Number} vx posicao inicial horizontal do retangulo na escala horizontal
     * @param {Number} vy posicao inicial vertical do retangulo na escala horizontal
     * @param {Number} vw largura do retangulo na escala horizontal
     * @param {Number} vh altura do retangulo na escala horizontal
     */
    function rectByValue(vx, vy, vw, vh, fill, stroke, strokeWidth){
        var rangePoint = pixelPointByVal(rangeX, rangeY);
        
        var p = pixelPointByVal(vx, vy);
        var s = pixelPointByVal(vw, vh);
        var layer = new Konva.Layer();

        var rect = new Konva.Rect({
                x: mainRect.x() + p.x, 
                //y: (rangePoint.y - (s.y - p.y)) + mainRect.y(),
                y:  mainRect.y() + ((rangePoint.y - s.y)),
                width: s.x - p.x, 
                height: (s.y - p.y), 
                fill: (fill ? fill : 'grey'), 
                stroke: (stroke ? stroke : null), 
                strokeWidth: (strokeWidth ? strokeWidth : null)
        });
        layer.add(rect);
        stage.add(layer);

        return layer;
    }


    for(var b = 0; b < options.boxes.length; b++){
        var box = options.boxes[b];
        rectByValue(box.x, box.y, box.w, box.h, box.fill);
    }



    stage.add(mainLayer);

}




