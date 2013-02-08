var img=new Image();
img.src="http://goo.gl/aHWR0";

img.onload=function(){
  app.page.background.context.drawImage(img,0,0,app.page.width,img.height*app.page.width/img.width);
};