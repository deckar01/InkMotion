var Layer = function(w,h){
	
	this.width = w;
	this.height = h;
	
	this.canvas = document.createElement("canvas");
	this.canvas.classList.add("layer");
	this.canvas.width = w;
	this.canvas.height = h;
	
	this.context = this.canvas.getContext("2d");
};