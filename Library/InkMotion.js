var InkMotion = function(){
	this.div = document.getElementById("InkMotion");
	this.page = new Page(window.innerWidth, window.innerHeight);
	this.div.appendChild(this.page.composite.canvas);
}