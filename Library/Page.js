var Page = function(w,h){
	
	this.width = w;
	this.height = h;
	this.background = new Layer(w,h);
	this.layers = [new Layer(w,h)];
	this.composite = new Layer(w,h);
};

Page.prototype = {
	
	addLayer : function(){
		var layer = new Layer(this.width, this.height);
		this.layers.push(layer);
		return layer;
	},
	
	flatten : function(){
		var ctx = this.composite.context;
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.drawImage(this.background.canvas, 0, 0);
		for(index in this.layers) ctx.drawImage(this.layers[index].canvas, 0, 0);
	}
}