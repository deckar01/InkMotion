Ocean = function(){
	
	var ctx=app.page.background.staticContext;
	var g=ctx.createLinearGradient(0,0,0,app.page.height);
	g.addColorStop(0, 'rgba(15,70,230,1)');
	g.addColorStop(1, 'rgba(10,20,110,1)');
	ctx.beginPath();
	ctx.fillStyle=g;
	ctx.rect(0,0,app.page.width,app.page.height);
	ctx.fill();
	for(var i=0; i<500; i++){
	  ctx.beginPath();
	  ctx.fillStyle = "rgba(255, 255, 255, "+(Math.random()*.2)+")";
	  ctx.arc(Math.random()*app.page.width, Math.random()*app.page.height, Math.random()*15, 0, 2*Math.PI, false);
	  ctx.fill();
	}
	
	app.page.background.needsRender = true;
	app.page.background.renderProgress();
	
	app.page.activeLayer().fillStyle='rgba(10,125,255,.25)';
}