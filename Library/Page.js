var Page = function(w,h){
	this.width = w;
	this.height = h;
	this.background = new Layer(w,h);
	this.layers = [new Layer(w,h)];
};