
function plotFiveBox(options){
    var $container = $(options.container);
    var rangeX = options.xAxis.rule.end - options.xAxis.rule.start;
    var rangeY = options.yAxis.rule.end - options.yAxis.rule.start;

    var stage = new Konva.Stage({
      container: options.container,
      width: $container.width(), 
      height: $container.height()
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
        addPoint: function (data){
            var p = this.pixelPointByVal(data.x, data.y);
            var rangePoint = this.pixelPointByVal(rangeX, rangeY);

            var point = new Konva.Circle({
                x: this.mainRect.x() + p.x, 
                y:  this.mainRect.y() + ((rangePoint.y - p.y)),
                radius: data.radius ? data.radius : 2,
                fill: data.fill ? data.fill : 'black',
                stroke: data.stroke ? data.stroke : 'red', 
                strokeWidth: data.strokeWidth ? data.strokeWidth : 1, 
            });
            
            this.mainLayer.add(point);
            return point;
        }, 
        /**
         * Retorna um Path de um retangulo a partir de pontos de escala
         * @param {Number} vx posicao inicial horizontal do retangulo na escala horizontal
         * @param {Number} vy posicao inicial vertical do retangulo na escala horizontal
         * @param {Number} vw largura do retangulo na escala horizontal
         * @param {Number} vh altura do retangulo na escala horizontal
         */
        drawBox: function (box){
            var overlaps = getOverlaps(box, this.options.boxes);

            var rangePoint = this.pixelPointByVal(rangeX, rangeY);
            
            var p = this.pixelPointByVal(box.x, box.y);
            var s = this.pixelPointByVal(box.w, box.h);
            
            var rect = {
                    x: this.mainRect.x() + p.x, 
                    y:  this.mainRect.y() + ((rangePoint.y - s.y)),
                    width: s.x - p.x, 
                    height: (s.y - p.y)
            };

            var boxRect = new Konva.Rect({x: 0, y: 0, width: rect.width, height: rect.height});
            
            boxRect.data = box;
            boxRect.fill(box.fill ? box.fill : 'grey');
            boxRect.stroke(box.stroke ? box.stroke : null);
            boxRect.strokeWidth(box.strokeWidth ? box.strokeWidth : null);
            
            var group = new Konva.Group(rect);
            
            if(overlaps.length>0){
                group.clipFunc = function(ctx) {
                    for (var ov = 0; ov < overlaps.length; ov++) {
                        var overlap = overlaps[ov].overlapedArea;
                        ctx.rect({
                            x: overlap.x,
                            y: overlap.y,
                            width: overlap.w,
                            height: overlap.h
                        });
                    }
                };
                
            }
            group.add(boxRect);
            this.mainLayer.add(group);
            


            return group;
        },
        clear: function(){
            
            this.stage.clear();
            this.stage.clearCache();
            this.stage.children.clear();
            this.stage.children.removeChildren();
            //this.stage.removeAll();
            
            this.mainLayer = new Konva.Layer();

            this.mainRect = new Konva.Rect({
                x: 40, y: 10, width: $container.width() - 100, height: $container.height() - 50, 
                fill: 'grey', 
                stroke: 'red'
            });
            this.stage.add(this.mainLayer);

        },
        updateBoxes: function(){
            
            for(var b = 0; b < options.boxes.length; b++){
                var box = options.boxes[b];
                var rect = this.drawBox(box);
                
                rect.data = box;
                
                if(box.events){
                    for(var evt in box.events){
                        rect.on(evt, box.events[evt]);
                    }
                }

                var title = new Konva.Text({
                    text: box.title,
                    fontSize: 30,
                    fontFamily: 'Calibri',
                    fill: 'green'
                });

                title.x(rect.x()+((rect.width()/2)-(title.textWidth/2)));
                title.y(rect.y()+((rect.height()/2)-(title.textHeight/2)));
                this.mainLayer.add(title);
            }

        },
        update: function(){
            this.clear();

            this.updateBoxes();


            // draw grid
            for(var x = options.xAxis.rule.start; x < options.xAxis.rule.end; x+=options.xAxis.rule.step){
                var line = this.addLine(x, 0, x, options.yAxis.rule.end, options.grid.stroke.x);
                
                var ruleXText = new Konva.Text({
                    text: Math.round(x * 100) / 100,
                    y: this.mainRect.y() + this.mainRect.height(),
                    fontSize: 12,
                    fontFamily: 'Calibri',
                    fill: 'black'
                });
                ruleXText.x(line.attrs.points[0] - (ruleXText.width()/2));
                this.mainLayer.add(ruleXText);
            }

            for(var y = options.yAxis.rule.start; y < options.yAxis.rule.end + options.yAxis.rule.step; y+=options.yAxis.rule.step){
                var line = this.addLine(0, y, options.xAxis.rule.end, y, options.grid.stroke.y);

                var ruleYText = new Konva.Text({
                    text: (options.yAxis.rule.end - options.yAxis.rule.start) - y,
                    fontSize: 12,
                    fontFamily: 'Calibri',
                    fill: 'black'
                });
                ruleYText.x(this.mainRect.x() - (ruleYText.width() + 5));
                ruleYText.y(line.attrs.points[1] - (ruleYText.height()/2));
                this.mainLayer.add(ruleYText);
            }

            for(var d = 0; d < options.data.length; d++){
                var dataItem = options.data[d];
                dataItem.point = null;
                
                var point = this.addPoint(dataItem);
                point.data = dataItem;
                dataItem.point = point;

            }

            this.stage.add(this.mainLayer);

            this.stage.draw();
        }, 

        addBoxEvent: function(event, callback){

        }
    }


    $container.resize(function(){
        fiveBox.stage.width($container.width());
        fiveBox.stage.height($container.height());

        fiveBox.update();
    });

    fiveBox.update();

    return fiveBox;



}




