// http://www.w3.org/TR/InkML/

var InkFile = function(page){
	
	this.doc = document.implementation.createDocument("http://www.w3.org/2003/InkML", "ink", null);
	this.root = this.doc.documentElement;
	
	this.format([['X','integer'],['Y','integer'],['F','decimal']]);
	
	// TODO: Build traces from strokes
	this.load(page);
}

InkFile.prototype = {
	
	format : function(channels){
		
		var format = this.doc.createElement("traceFormat");
		
		for(i in channels){
			var channel = channels[i];
			
			var node = this.doc.createElement("channel");
			node.setAttribute("name", channel[0]);
			node.setAttribute("type", channel[1]);
			
			var mapping = this.doc.createElement("mapping");
			mapping.setAttribute("type", "identity");
			
			node.appendChild(mapping);
			format.appendChild(node);
		}
		
		this.root.appendChild(format);
	},
	
	load : function(page){
		
		for(var i in page.layers){
			var layer = page.layers[i];
			var node = this.doc.createElement("layer");
			
			for(var j in layer.history){
				var stroke = layer.history[j];
				var trace = this.doc.createElement("trace");
				var text = this.doc.createTextNode("");;
				
				var k;
				for(k=0; k < stroke.path.length-1; k++){
					var anchor = stroke.path[k];
					text.textContent += anchor.x + " " + anchor.y + " " + anchor.distance.toFixed(5) + ", ";
				}
				var anchor = stroke.path[k];
				text.textContent += anchor.x + " " + anchor.y + " " + anchor.distance.toFixed(5);
				
				trace.appendChild(text);
				node.appendChild(trace);
			}
			
			this.root.appendChild(node);
		}
	},
	
	tostring : function(){
		return (new XMLSerializer()).serializeToString(this.root);
	}
}