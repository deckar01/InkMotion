Graffiti = function(){
	
	var img=new Image();
	img.src="http://goo.gl/aHWR0";

	img.onload=function(){
		app.page.background.staticContext.drawImage(img,0,0,app.page.width,img.height*app.page.width/img.width);
		app.page.background.needsRender = true;
		app.page.background.renderProgress();
	};
}