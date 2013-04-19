var Stroke = function(canvas, gco, fillStyle, brush, anchor){
	
	this.brush = brush;
	this.path = [anchor];
	this.lastAnchor = anchor;
	
	this.canvas = document.createElement("canvas");
	this.canvas.width = canvas.width;
	this.canvas.height = canvas.height;
	
	this.context = this.canvas.getContext("2d");
	this.globalCompositeOperation = gco;
	this.fillStyle = fillStyle;
	this.context.fillStyle = fillStyle;
	
	var boundary = this.brush.start(this.context, anchor);
	this.boundary = new Boundary(boundary, canvas.width, canvas.height);
	this.x = this.boundary.left;
	this.y = this.boundary.top;
	this.width = this.boundary.right - this.x;
	this.height = this.boundary.bottom - this.y;
};

Stroke.prototype = {
	
	update : function(anchor){
		
		var boundaries = this.brush.draw(this.context, this.lastAnchor, anchor);
		
		var changed = false;
		for(i in boundaries) changed = this.boundary.update(boundaries[i]) || changed;
		
		if(changed){
			this.x = this.boundary.left;
			this.y = this.boundary.top;
			this.width = this.boundary.right - this.x;
			this.height = this.boundary.bottom - this.y;
		}
		
		this.path.push(anchor);
		this.lastAnchor = anchor;
	},
	
	finalize : function(context){
		
	},
	
	trash : function(){
		delete this.canvas;
		delete this.context;
	},
	
	rebuild : function(canvas){
		this.canvas = document.createElement("canvas");
		this.canvas.width = canvas.width;
		this.canvas.height = canvas.height;
		
		this.context = this.canvas.getContext("2d");
		this.context.fillStyle = this.fillStyle;
		
		this.brush.start(this.context, this.path[0]);
		
		for(var i=1; i<this.path.length; i++){
			this.brush.draw(this.context, this.path[i-1], this.path[i]);
		}
		this.lastAnchor = this.path[i-1];
		
	},
	
	visible : function(){
		return this.width > 0 && this.height > 0;
	}
};