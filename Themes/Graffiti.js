// Image provided by the generous Sally Pesavento
// http://all-free-download.com/free-photos/brick_wall_peeling_paint_199496_download.html
Graffiti = function(){
	
	var img=new Image();
	img.src="./Images/brick.jpg";

	img.onload=function(){
		app.page.background.staticContext.drawImage(img,0,0,app.page.width,img.height*app.page.width/img.width);
		app.page.background.needsRender = true;
		app.page.background.renderProgress();
	};
}