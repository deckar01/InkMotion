var ctx = app.page.background.context;

ctx.fillStyle = "rgba(0,0,0,1)";
ctx.beginPath();
ctx.rect(0, 0, app.page.width, app.page.height);
ctx.fill();

for(var i=0; i<1000; i++){
  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 255, 255, "+(Math.random()*.5)+")";
  ctx.arc(Math.random()*app.page.width, Math.random()*app.page.height, Math.random()*2, 0, 2*Math.PI, false);
  ctx.fill();
}

ctx = app.page.activeLayer().context;

var grd = ctx.createRadialGradient(app.page.width/2 + 80, app.page.height/2 - 80, 10, app.page.width/2 + 80, app.page.height/2 - 80, app.page.height/4 + 80);
grd.addColorStop(0, '#004CB3');
grd.addColorStop(1, '#002A80');
ctx.fillStyle = grd;
ctx.beginPath();
ctx.arc(app.page.width/2, app.page.height/2, app.page.height/4, 0, 2*Math.PI, false);
ctx.fill();