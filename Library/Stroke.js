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
	
	this.brush.start(this.context, anchor);
};

Stroke.prototype = {
	
	update : function(anchor){
		
		this.brush.draw(this.context, this.lastAnchor, anchor);
		this.path.push(anchor);
		this.lastAnchor = anchor;
	},
	
	finalize : function(context){
		
	}
};