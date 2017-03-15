
function plotFiveBox(options){
    var $container = $(options.container);
    var rangeX = options.xAxis.rule.end - options.xAxis.rule.start;
    var rangeY = options.yAxis.rule.end - options.yAxis.rule.start;

    var stage = new Konva.Stage({
      container: options.container,
      width: $container.width(), 
      height: $container.height()
    });

    var timeout = 0;
    $container.resize(function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            console.log(new Date());
            fiveBox.stage.width($container.width());
            fiveBox.stage.height($container.height());

            fiveBox.update();
        }, 500);
    });

    var fiveBox = {
        options: options, 

        $container: $container, 
        stage: stage, 
        mainRect: {}, 
        mainLayer: {}, 
        
        perByVal: function (max, val){
            return (val*100)/max;
        },
        valByPer: function (max, per){
            return ((max * per)/100);
        },
        posByVal: function (px, maxVal, val){
            return this.valByPer(px, this.perByVal(maxVal, val));
        }, 
        /**
         * retorna as coordenadas x, y em pixels relativo ao mainRect a partir de um valor nas respectivas escalas informadas em xAxis e yAxis
         * @param {*} x 
         * @param {*} y 
         */    
        pixelPointByVal: function (x, y){
            return {
                    x: this.posByVal(this.mainRect.width(), (options.xAxis.rule.end - options.xAxis.rule.start), x), 
                    y: this.posByVal(this.mainRect.height(), (options.yAxis.rule.end - options.yAxis.rule.start), y)
            };
        }, 
        addLine: function (x1, y1, x2, y2, stroke, strokeWidth){
            var p1 = this.pixelPointByVal(x1, y1);
            var p2 = this.pixelPointByVal(x2, y2);

            var line = new Konva.Line({
                points: [p1.x + this.mainRect.x(), p1.y + this.mainRect.y(), p2.x + this.mainRect.x(), p2.y+ this.mainRect.y()], 
                stroke: stroke ? stroke : 'red', 
                strokeWidth: strokeWidth ? strokeWidth : 1, 
            });
            
            this.mainLayer.add(line);
            return line;
        }, 
        /**
         * Retorna um Path de um retangulo a partir de pontos de escala
         * @param {Number} vx posicao inicial horizontal do retangulo na escala horizontal
         * @param {Number} vy posicao inicial vertical do retangulo na escala horizontal
         * @param {Number} vw largura do retangulo na escala horizontal
         * @param {Number} vh altura do retangulo na escala horizontal
         */
        rectByValue: function (vx, vy, vw, vh, fill, stroke, strokeWidth){
            var rangePoint = this.pixelPointByVal(rangeX, rangeY);
            
            var p = this.pixelPointByVal(vx, vy);
            var s = this.pixelPointByVal(vw, vh);
            var layer = new Konva.Layer();

            var rect = new Konva.Rect({
                    x: this.mainRect.x() + p.x, 
                    y:  this.mainRect.y() + ((rangePoint.y - s.y)),
                    width: s.x - p.x, 
                    height: (s.y - p.y), 
                    fill: (fill ? fill : 'grey'), 
                    stroke: (stroke ? stroke : null), 
                    strokeWidth: (strokeWidth ? strokeWidth : null)
            });
            layer.add(rect);
            
            this.stage.add(layer);

            return layer;
        },

        update: function(){
            this.stage.clear();
            this.stage.clearCache();
            
            this.mainLayer = new Konva.Layer();

            this.mainRect = new Konva.Rect({
                x: 40, y: 10, width: $container.width() - 100, height: $container.height() - 50, 
                fill: 'grey', 
                stroke: 'red'
            });


            for(var b = 0; b < options.boxes.length; b++){
                var box = options.boxes[b];
                this.rectByValue(box.x, box.y, box.w, box.h, box.fill);
            }

            // draw grid
            for(var x = options.xAxis.rule.start; x < options.xAxis.rule.end; x+=options.xAxis.rule.step){
                this.addLine(x, 0, x, options.yAxis.rule.end, options.grid.stroke.x);
            }

            for(var y = options.yAxis.rule.start; y < options.yAxis.rule.end + options.yAxis.rule.step; y+=options.yAxis.rule.step){
                this.addLine(0, y, options.xAxis.rule.end, y, options.grid.stroke.y);
            }

            this.stage.add(this.mainLayer);

        }
    }


    fiveBox.update();

    return fiveBox;



}




