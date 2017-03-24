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

## JSF wrapper sample
```xhtml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:ui="http://xmlns.jcp.org/jsf/facelets"
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:composite="http://java.sun.com/jsf/composite"
      >
	  <composite:interface>
	  		
			<!-- <composite:attribute type="br.gov.sp.prodesp.sap.components.charts.box.BoxChartConfig" name="config" /> -->
			<composite:attribute name="id" />
			<composite:attribute name="widgetVar"  	   default="boxChart" />

			
			<composite:attribute name="xAxisText"     default=''/>
			<composite:attribute name="xAxisShowText" default='true'/>
			<composite:attribute name="xAxisShowRule"  default='true'/>
			<composite:attribute name="xAxisRuleStart" default="0.0" />
			<composite:attribute name="xAxisRuleEnd"   default="1.0" />
			<composite:attribute name="xAxisRuleStep"  default="0.1" />

			<composite:attribute name="yAxisText"     default=''/>
			<composite:attribute name="yAxisShowText" default='true'/>
			<composite:attribute name="yAxisShowRule"  default='true'/>
			<composite:attribute name="yAxisRuleStart" default="0.0" />
			<composite:attribute name="yAxisRuleEnd"   default="140" />
			<composite:attribute name="yAxisRuleStep"  default="10.0" />

			<composite:attribute name="data" />
			
			<composite:attribute name="boxes" />

			<composite:attribute name="xAxisRuleGroups" />
			<composite:attribute name="yAxisRuleGroups" />
			

	  </composite:interface>

	  <composite:implementation>
	  
		<div id="#{cc.attrs.id}" style="width:100%; height:100%" ></div>
		
			
		<!-- <ui:param name="app_root" value="#{facesContext.externalContext.requestContextPath}" />
		
		<ui:param name="resources_root"	value="#{facesContext.externalContext.requestContextPath}/resources" /> -->

        <!-- <script type="text/javascript" src="#{resources_root}/jsf-components/box-chart/bower/jquery/dist/jquery.min.js"></script> -->
        <script type="text/javascript" src="#{resources_root}/jsf-components/box-chart/bower/javascript-detect-element-resize/jquery.resize.js"></script>
        <script type="text/javascript" src="#{resources_root}/jsf-components/box-chart/bower/konva/konva.min.js"></script>
        <script type="text/javascript" src="#{resources_root}/jsf-components/box-chart/bower/overlap-js/overlap.js"></script>
        <script type="text/javascript" src="#{resources_root}/jsf-components/box-chart/bower/box-chart-js/five-box-chart.js"></script>
        
        <script type="text/javascript">
        	$(function(){
        		
	        	var #{cc.attrs.id}_options = {
	                container: '##{cc.attrs.id}', 
	                xAxis: {
	                    text: '#{cc.attrs.xAxisText}',
	                    showText: #{cc.attrs.xAxisShowText}, 
	                    showRule: #{cc.attrs.xAxisShowRule}, 
	                    rule:{
	                        start: #{cc.attrs.xAxisRuleStart}, 
	                        end: #{cc.attrs.xAxisRuleEnd},
	                        step: #{cc.attrs.xAxisRuleStep}, 
	                        groups:[
	    	    			    <ui:repeat var="xg" value="#{cc.attrs.xAxisRuleGroups}">
								    {x: #{xg.x}, w: #{xg.w}, fill: '#{xg.fill}', stroke: '#{xg.stroke}', text: '#{xg.text}', textFill: '#{xg.textFill}'},
							    </ui:repeat>
	                        ]
	                    }
	                }, 
	                yAxis: {
	                    text: '#{cc.attrs.yAxisText}',
	                    showText: #{cc.attrs.yAxisShowText}, 
	                    showRule: #{cc.attrs.yAxisShowRule}, 
	                    rule:{
	                        start: #{cc.attrs.yAxisRuleStart}, 
	                        end: #{cc.attrs.yAxisRuleEnd},
	                        step: #{cc.attrs.yAxisRuleStep}, 
	                        groups:[
	    	    			    <ui:repeat var="yg" value="#{cc.attrs.yAxisRuleGroups}">
								    {y: #{yg.y}, h: #{yg.h}, fill: '#{yg.fill}', stroke: '#{yg.stroke}', text: '#{yg.text}', textFill: '#{yg.textFill}'},
							    </ui:repeat>
	                        ]
	                    }
	                }, 
	                data: [
	    			    <ui:repeat var="data" value="#{cc.attrs.data}">
						    {text: '#{data.text}', x: #{data.x}, y: #{data.y}},
					    </ui:repeat>
	                ],
	                boxes: [
	    			    <ui:repeat var="b" value="#{cc.attrs.boxes}">
						    {x: #{b.x}, y: #{b.y}, w: #{b.w}, h: #{b.h}, fill: '#{b.fill}', stroke: '#{b.stroke}', text: '#{b.text}', textFill: '#{b.textFill}', events:{mouseenter: showInside}},
					    </ui:repeat>
	                ], 
	                grid: {
	                    stroke:{x: '#C1C2C3', y: '#C1C2C3'}
	                }
	            };
	        	
	        	
	        	
	        	var _lastMouseBox = null;
	            function showInside(evt){
	
	                //alert(evt.currentTarget.data.title);
	                var boxData = evt.currentTarget.data;
	                if(_lastMouseBox==boxData) return;
	                _lastMouseBox=boxData;
	
	
	                
	                for (var p = 0; p &lt; #{cc.attrs.widgetVar}.options.data.length; p++) {
	                    var data = #{cc.attrs.widgetVar}.options.data[p];
	                    var point = data.point;
	                    data.h = 0.001;
	                    data.w = 0.001;
	
	                    var selected = false;
	                    if(boxData.text=='B'){
	                        var boxA = #{cc.attrs.widgetVar}.options.boxes[4];
	                        selected = isCollision(data, boxData) &amp;&amp; !isCollision(data, boxA);
	                    }else{
	                        selected = isCollision(data, boxData);
	                    }
	
	                    //point.fill((selected?'pink': data.fill));
	                    point.radius((selected?5: 2));
	                    
	                }
	                //console.log('update');
	                #{cc.attrs.widgetVar}.stage.draw();
	            }
	            
	            
	            /* function randomData(){
	                var data = [];
	                var length = Math.floor(Math.random() * 2000);
	                for(var i = 0; i &lt; length; i++){
	                    data.push({ 
	                        x: Math.floor(Math.random() * 1000)/1000, 
	                        y: Math.floor(Math.random() * 140), 
	                        radius: 2, fill: 'black'
	                    });
	                }
	                return data;
	            }
	
	            #{cc.attrs.id}_options.data = randomData(); */
	            
	            
	            var #{cc.attrs.widgetVar} = plotFiveBox(#{cc.attrs.id}_options);
	            #{cc.attrs.widgetVar}.update();
	            
	            function isCollision(rect1, rect2){
	            	if (rect1.x &gt;= rect2.x &amp;&amp; rect1.x &lt;= rect2.w &amp;&amp;
	                    rect1.y &gt;= rect2.y &amp;&amp; rect1.y &lt;= rect2.h) {
		                console.log(rect1);
		                console.log(rect2);
	                    console.log(true);
	            		return true;
	                }
	                return false;
	            }
        	});
        	
        </script>
        
	  </composite:implementation>
</html>
```
