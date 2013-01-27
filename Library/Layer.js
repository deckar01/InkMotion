var Layer = function(w,h){
	this.width = w;
	this.height = h;
	this.canvas = document.createElement("canvas");
	this.context = this.canvas.getContext("2d");
	this.canvas.width = w;
	this.canvas.height = h;
};