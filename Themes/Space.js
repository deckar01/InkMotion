Space = function(){
	
	var ctx = app.page.background.staticContext;

	ctx.fillStyle = "rgba(0,0,0,1)";
	ctx.beginPath();
	ctx.rect(0, 0, app.page.width, app.page.height);
	ctx.fill();

	var x = app.page.width/2;
	var y = app.page.height/2;

	for(var i=0; i<2000; i++){
	  ctx.beginPath();
	  var energy = Math.round(255*Math.random());
	  var fade = Math.random()*.5;
	  ctx.fillStyle = "rgba("+energy+", "+Math.round(128-.5*energy)+", "+(255-energy)+", "+fade+")";
	  var size = Math.random()*2;
	  var angle = Math.random()*Math.PI*2;
	  var distance = Math.random()*x;
	  for(var j = 0; j < 5*size; j++){
		ctx.arc(x+Math.cos(angle)*distance, y+Math.sin(angle)*distance, size, 0, 2*Math.PI, false);
		ctx.fill();
		fade *= .8;
		ctx.fillStyle = "rgba("+energy+", "+Math.round(128-.5*energy)+", "+(255-energy)+", "+fade+")";
		
		distance *= 1.02;
		angle += .08;
	  }
	}
	
	app.page.background.needsRender = true;
	app.page.background.renderProgress();

	// ctx = app.page.activeLayer().context;

	// var grd = ctx.createRadialGradient(app.page.width/2 + 80, app.page.height/2 - 80, 10, app.page.width/2 + 80, app.page.height/2 - 80, app.page.height/4 + 80);
	// grd.addColorStop(0, '#004CB3');
	// grd.addColorStop(1, '#002A80');
	// ctx.fillStyle = grd;
	// ctx.beginPath();
	// ctx.arc(app.page.width/2, app.page.height/2, app.page.height/4, 0, 2*Math.PI, false);
	// ctx.fill();
}