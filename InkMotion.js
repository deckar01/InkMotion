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
var Anchor = function(project, pointable){
	
	this.x = Math.round(project.position.x);
	this.y = Math.round(project.position.y);
	this.distance = project.distance;
	this.direction = pointable.direction();
	this.velocity = pointable.tipVelocity();
}
var Boundary = function(b, w, h){
	
	this.width = w;
	this.height = h;
	
	if(b[0] < 0) this.left = 0;
	else if(b[0] > this.width) this.left = this.width;
	else this.left = b[0];
	
	if(b[1] < 0) this.right = 0;
	else if(b[1] > this.width) this.right = this.width;
	else this.right = b[1];
	
	if(b[2] < 0) this.top = 0;
	else if(b[2] > this.height) this.top = this.height;
	else this.top = b[2];
	
	if(b[3] < 0) this.bottom = 0;
	else if(b[3] > this.height) this.bottom = this.height;
	else this.bottom = b[3];
}

Boundary.prototype.update = function(b){
	
	var change = false;
	
	if(b[0] < this.left){
		if(b[0] < 0) this.left = 0;
		else if(b[0] > this.width) this.left = this.width;
		else this.left = b[0];
		change = true;
	}
	if(b[1] > this.right){
		if(b[1] < 0) this.right = 0;
		else if(b[1] > this.width) this.right = this.width;
		else this.right = b[1];
		change = true;
	}
	if(b[2] < this.top){
		if(b[2] < 0) this.top = 0;
		else if(b[2] > this.height) this.top = this.height;
		else this.top = b[2];
		change = true;
	}
	if(b[3] > this.bottom){
		if(b[3] < 0) this.bottom = 0;
		else if(b[3] > this.height) this.bottom = this.height;
		else this.bottom = b[3];
		change = true;
	}
	
	return change;
}

Boundary.prototype.toString = function(){
	return JSON.stringify([this.left, this.right, this.top, this.bottom]);
}
var Brush = function(){};

Brush.prototype = {
	
	start : function(context, anchor){
		
	},
	
	draw : function(context, startAnchor, endAnchor){
		
	}
};

var DistanceBrush = new Brush();

DistanceBrush.minSize = 0;
DistanceBrush.maxSize = 10;
DistanceBrush.id = 0;

DistanceBrush.start = function(context, anchor){

	var size = (1 - anchor.distance)*(this.maxSize - this.minSize) + this.minSize;
	
	context.beginPath();
	context.arc(anchor.x, anchor.y, size, 0, 2 * Math.PI, false);
	context.fill();
	
	return [anchor.x-size, anchor.x+size, anchor.y-size, anchor.y+size];
}

DistanceBrush.draw = function(context, startAnchor, endAnchor){
	
	var startSize = (1 - startAnchor.distance)*(this.maxSize - this.minSize) + this.minSize;
	var endSize = (1 - endAnchor.distance)*(this.maxSize - this.minSize) + this.minSize;
	
	var startVector = new Leap.Vector([startAnchor.x, startAnchor.y, 0]);
	var endVector = new Leap.Vector([endAnchor.x, endAnchor.y, 0]);
	
	var line = endVector.minus(startVector);
	var ortho = new Leap.Vector([line.y, -line.x, 0]);
	ortho = ortho.normalized();
	var startOrtho = ortho.multiply(startSize);
	ortho = ortho.multiply(endSize);
	
	var start = endVector.plus(ortho);
	context.beginPath();
	
	var pos = start;
	context.moveTo(pos.x, pos.y);
	
	pos = endVector.minus(ortho);
	context.lineTo(pos.x, pos.y);
	
	pos = startVector.minus(startOrtho);
	context.lineTo(pos.x, pos.y);
	
	pos = startVector.plus(startOrtho);
	context.lineTo(pos.x, pos.y);
	
	pos = start;
	context.lineTo(pos.x, pos.y);
	
	context.fill();
	
	context.beginPath();
	context.arc(endVector.x, endVector.y, endSize, 0, 2 * Math.PI, false);
	context.fill();
	
	var boundary1 = [startAnchor.x-startSize, startAnchor.x+startSize, startAnchor.y-startSize, startAnchor.y+startSize];
	var boundary2 = [endAnchor.x-endSize, endAnchor.x+endSize, endAnchor.y-endSize, endAnchor.y+endSize];
	
	return [boundary1, boundary2];
	
};

var TiltBrush = new Brush();

TiltBrush.minSize = 0;
TiltBrush.maxSize = 40;
TiltBrush.id = 1;

TiltBrush.start = function(context, anchor){
	
	var tilt = 2*anchor.direction.angleTo(this.normal)/Math.PI;
	var size = tilt*(this.maxSize - this.minSize) + this.minSize;
	
	context.beginPath();
	context.arc(anchor.x, anchor.y, size, 0, 2 * Math.PI, false);
	context.fill();
	
	return [anchor.x-size, anchor.x+size, anchor.y-size, anchor.y+size];
}

TiltBrush.draw = function(context, startAnchor, endAnchor){
	
	var startTilt = 2*startAnchor.direction.angleTo(this.normal)/Math.PI;
	var startSize = startTilt*(this.maxSize - this.minSize) + this.minSize;
	var endTilt = 2*endAnchor.direction.angleTo(this.normal)/Math.PI;
	var endSize = endTilt*(this.maxSize - this.minSize) + this.minSize;
	
	var startVector = new Leap.Vector([startAnchor.x, startAnchor.y, 0]);
	var endVector = new Leap.Vector([endAnchor.x, endAnchor.y, 0]);
	
	var line = endVector.minus(startVector);
	var ortho = new Leap.Vector([line.y, -line.x, 0]);
	ortho = ortho.normalized();
	var startOrtho = ortho.multiply(startSize);
	ortho = ortho.multiply(endSize);
	
	var start = endVector.plus(ortho);
	context.beginPath();
	
	var pos = start;
	context.moveTo(pos.x, pos.y);
	
	pos = endVector.minus(ortho);
	context.lineTo(pos.x, pos.y);
	
	pos = startVector.minus(startOrtho);
	context.lineTo(pos.x, pos.y);
	
	pos = startVector.plus(startOrtho);
	context.lineTo(pos.x, pos.y);
	
	pos = start;
	context.lineTo(pos.x, pos.y);
	
	context.fill();
	
	context.beginPath();
	context.arc(endVector.x, endVector.y, endSize, 0, 2 * Math.PI, false);
	context.fill();
	
	var boundary1 = [startAnchor.x-startSize, startAnchor.x+startSize, startAnchor.y-startSize, startAnchor.y+startSize];
	var boundary2 = [endAnchor.x-endSize, endAnchor.x+endSize, endAnchor.y-endSize, endAnchor.y+endSize];
	
	return [boundary1, boundary2];
	
};

var BubbleBrush = new Brush();

BubbleBrush.minSize = 0;
BubbleBrush.maxSize = 10;
BubbleBrush.id = 2;

BubbleBrush.start = function(context, anchor){

	var size = (1 - anchor.distance)*(this.maxSize - this.minSize) + this.minSize;
	
	context.beginPath();
	context.arc(anchor.x, anchor.y, size, 0, 2 * Math.PI, false);
	context.fill();
	
	return [anchor.x-size, anchor.x+size, anchor.y-size, anchor.y+size];
}

BubbleBrush.draw = function(context, startAnchor, endAnchor){
	
	var endSize = (1 - endAnchor.distance)*(this.maxSize - this.minSize) + this.minSize;

	context.beginPath();
	context.arc(endAnchor.x, endAnchor.y, endSize, 0, 2 * Math.PI, false);
	context.fill();
	
	var boundary = [endAnchor.x-endSize, endAnchor.x+endSize, endAnchor.y-endSize, endAnchor.y+endSize];
	
	return [boundary];
};

var SpeedBrush = new Brush();

SpeedBrush.minSize = 1;
SpeedBrush.maxSize = 10;
SpeedBrush.maxSpeed = 1200;
SpeedBrush.id = 3;

SpeedBrush.start = function(context, anchor){
	
	var speed = anchor.velocity.magnitude()/this.maxSpeed;
	if(speed > 1) speed = 1;
	var size = (1 - speed)*(this.maxSize - this.minSize) + this.minSize;
	
	context.beginPath();
	context.arc(anchor.x, anchor.y, size, 0, 2 * Math.PI, false);
	context.fill();
	
	return [anchor.x-size, anchor.x+size, anchor.y-size, anchor.y+size];
}

SpeedBrush.draw = function(context, startAnchor, endAnchor){
	
	var startSpeed = startAnchor.velocity.magnitude()/this.maxSpeed;
	if(startSpeed > 1) startSpeed = 1;
	var startSize = (1 - startSpeed)*(this.maxSize - this.minSize) + this.minSize;
	
	var endSpeed = endAnchor.velocity.magnitude()/this.maxSpeed;
	if(endSpeed > 1) endSpeed = 1;
	var endSize = (1 - endSpeed)*(this.maxSize - this.minSize) + this.minSize;
	
	var startVector = new Leap.Vector([startAnchor.x, startAnchor.y, 0]);
	var endVector = new Leap.Vector([endAnchor.x, endAnchor.y, 0]);
	
	var line = endVector.minus(startVector);
	var ortho = new Leap.Vector([line.y, -line.x, 0]);
	ortho = ortho.normalized();
	var startOrtho = ortho.multiply(startSize);
	ortho = ortho.multiply(endSize);
	
	var start = endVector.plus(ortho);
	context.beginPath();
	
	var pos = start;
	context.moveTo(pos.x, pos.y);
	
	pos = endVector.minus(ortho);
	context.lineTo(pos.x, pos.y);
	
	pos = startVector.minus(startOrtho);
	context.lineTo(pos.x, pos.y);
	
	pos = startVector.plus(startOrtho);
	context.lineTo(pos.x, pos.y);
	
	pos = start;
	context.lineTo(pos.x, pos.y);
	
	context.fill();
	
	context.beginPath();
	context.arc(endVector.x, endVector.y, endSize, 0, 2 * Math.PI, false);
	context.fill();
	
	var drip = 0;
	if(endSpeed < 0.01 && Math.random() < 0.05){
		drip = Math.random()*40;
		context.beginPath();
		context.moveTo(endVector.x, endVector.y);
		context.lineTo(endVector.x, endVector.y+endSize+drip);
		context.lineWidth = '2px';
		context.strokeStyle = context.fillStyle;
		context.stroke();
	}
	
	var boundary1 = [startAnchor.x-startSize, startAnchor.x+startSize, startAnchor.y-startSize, startAnchor.y+startSize];
	var boundary2 = [endAnchor.x-endSize, endAnchor.x+endSize, endAnchor.y-endSize, endAnchor.y+endSize+drip];
	
	return [boundary1, boundary2];
	
};


var HistoryGesture = function(undo, redo){
	
	this.undo = undo;
	this.redo = redo;
	this.reset();
};

HistoryGesture.prototype = {
	
	reset : function(){
		this.gid = -1;
		this.progress = 0;
	},
	
	update : function(frame){
		
		if(this.gid == -1){
			var gestures = frame.gestures();
			if(gestures.count() > 1){
				var gesture = gestures[0];
				this.gid = gesture.id();
				if(gesture.normal().angleTo(gesture.pointable().direction()) > Math.PI/2) this.action = this.undo;
				else this.action = this.redo;
				this.progress = Math.floor(gesture.progress());
			}
			else this.reset();
		}
		else{
			var gesture = frame.gesture(this.gid);
			if(gesture.isValid()) this.apply(gesture);
			else this.reset();
		}
	},
	
	apply : function(gesture){
		while(this.progress < Math.floor(gesture.progress())){
			this.action();
			this.progress++;
		}
	}
};
var InkFile = function(page){
	
	this._data = [];
	
	for(var i in page.layers){
		this._data.push(page.layers[i].history);
	}
}

InkFile.prototype = {
	
	tostring : function(){
		return JSON.stringify(this._data);
	}
}
var InkMotion = function(){
	
	var me = this;
	this.div = document.getElementById("InkMotion");
	this.div.oncontextmenu = function(){ me._contextMenu(); return false; };
	
	this.page = new Page(window.innerWidth, window.innerHeight, this);
	this.pageDiv = document.createElement("div");
	this.pageDiv.appendChild(this.page.div);
	this.div.appendChild(this.pageDiv);
	
	this.HistoryGesture = new HistoryGesture(function(){me._undo();}, function(){me._redo();});
	
	this.foreground = new Layer(window.innerWidth, window.innerHeight);
	this.div.appendChild(this.foreground.canvas);
	
	this._buildMenu();
	this.div.appendChild(this.menu.ul);
	
	this.listener = new Leap.Listener();
	this.listener.onConnect = function(controller){ me._onConnect(controller); };
	
	this.controller = new Leap.Controller("ws://localhost:6437/");
	this.controller.addListener(this.listener);
	this.controller.enableGesture("circle", true);
	
	setTimeout(function(){ if(!me.controller.isConnected()) me._showYoutube(); }, 2000);
	
	this.brush = DistanceBrush;
	this.activeDistance = 40;
	
	this.projection = function(pointable){ return this.screen.intersect(pointable, true); };
};

InkMotion.prototype = {
	
	_onFrame : function(controller) {
		
		var layer = this.page.activeLayer();
		
		var frame = controller.frame();
		var pointables = frame.pointables();
		var count = pointables.count();
		
		if(Object.keys(layer.progress).length == 0) this.HistoryGesture.update(frame);
		else this.HistoryGesture.reset();
		
		for(var id in layer.progress){
			if(!frame.pointable(id).isValid()) layer.finalizeStroke(id);
		}
		
		this.screen.offset();
		
		for(var index = 0; index < count; index++){
			var pointable = pointables[index];
			var project = this.projection(pointable, true);
			
			if(project){
				project.distance /= this.activeDistance;
				var anchor = new Anchor(project, pointable);
				layer.processAnchor(pointable.id(), anchor, this.brush);
			}
		}
	},
	
	_renderCursors : function(){
		
		var frame = this.controller.frame();
		var pointables = frame.pointables();
		var count = pointables.count();
		if(count == 0){
			if(this.needsRender == false) return;
			else this.needsRender = false;
		}
		else this.needsRender = true;
		
		this.foreground.context.clearRect(0, 0, this.foreground.width, this.foreground.height);
		
		for(var index = 0; index < count; index++){
			var pointable = pointables[index];
			var project = this.projection(pointable, true);
			
			if(project){
				
				var fade = (200 - project.distance + this.activeDistance)/200;
				if(fade>1) fade = 1;
				else if(fade<0) fade = 0;
				
				this.foreground.context.beginPath();
				this.foreground.context.arc(project.position.x, project.position.y, 2+10*(1-fade), 0, 2 * Math.PI, false);
				this.foreground.context.fillStyle = 'rgba(0,0,0,'+fade+')';
				this.foreground.context.fill();
				this.foreground.context.beginPath();
				this.foreground.context.arc(project.position.x, project.position.y, 1+4*(1-fade), 0, 2 * Math.PI, false);
				this.foreground.context.fillStyle = 'rgb(255,255,255)';
				this.foreground.context.fill();
			}
		}
	},
	
	_onConnect : function(controller){
		
		var youtube = document.getElementById("youtube");
		if(youtube) document.body.removeChild(youtube);
		
		if(this.calibrate || this.screen) return;
		var me = this;
		
		if(this.controller.calibratedScreens().empty()){
			this.calibrate = new Leap.Calibrate(this.controller);
			this.calibrate.onComplete = function(screen){
				me.screen = screen;
				delete me.calibrate;
				setTimeout(function(){ me.listener.onFrame = function(controller){ me._onFrame(controller); }; }, 1500);
				me.renderLoop = function(){
					requestAnimFrame(me.renderLoop);
					me.page.activeLayer().renderProgress();
					me._renderCursors();
				};
				me.renderLoop();
			}
		}
		else{
			this.screen = this.controller.calibratedScreens()[0];
			this.listener.onFrame = function(controller){ me._onFrame(controller); };
			this.renderLoop = function(){
				requestAnimFrame(me.renderLoop);
				me.page.activeLayer().renderProgress();
				me._renderCursors();
			};
			this.renderLoop();
			
			var mainMenu = this.menu.items[0];
			mainMenu.show();
			setTimeout(function(){ mainMenu.hide(); }, 3000);
		}
	},
	
	_recalibrate : function(){
		if(this.calibrate || !this.controller.isConnected()) return;
		if(!confirm("Are you sure?\nRecalibration takes a few seconds.")) return;
		this.listener.onFrame = function(controller){ };
		this.renderLoop = function(){ };
		this.foreground.context.clearRect(0, 0, this.foreground.width, this.foreground.height);
		delete this.screen;
		this.controller.calibratedScreens().clear();
		this._onConnect(this.controller);
	},
	
	_newPage : function(){
		if(!confirm("Are you sure?\nUnsaved changes will be lost.")) return;
		this.pageDiv.removeChild(this.page.div);
		delete this.page;
		this.page = new Page(window.innerWidth, window.innerHeight, this);
		this.pageDiv.appendChild(this.page.div);
	},
	
	_savePage : function(){
		var data = (new InkFile(this.page)).tostring();
		var blob = new Blob([data], { "type" : "application/octet-binary" });
		var URL = webkitURL.createObjectURL(blob);
		window.open(URL, '_blank');
	},
	
	_exportPage : function(){
		//take apart data URL
		var parts = this.page.flatten().canvas.toDataURL().match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/);

		//assume base64 encoding
		var binStr = atob(parts[3]);

		//convert to binary in ArrayBuffer
		var buf = new ArrayBuffer(binStr.length);
		var view = new Uint8Array(buf);
		for(var i = 0; i < view.length; i++)
		  view[i] = binStr.charCodeAt(i);

		var blob = new Blob([view], {'type': parts[1]});
		var URL = webkitURL.createObjectURL(blob);
		window.open(URL, '_blank');
	},
	
	_brushFill : function(){
		this.page.activeLayer().fillStyle = window.prompt("Fill style:", this.page.activeLayer().fillStyle);
	},
	
	_undo : function(){
		this.page.activeLayer().undo();
	},
	
	_redo : function(){
		this.page.activeLayer().redo();
	},
	
	_buildMenu : function(){
		var me = this;
		this.menu = new Menu();
		
		var logo = this.menu.addItem("<img src='./Images/logo.png' />");
		var viewSource = logo.addItem("View Source");
		viewSource.link.href = "https://www.github.com/deckar01/InkMotion/";
		viewSource.link.target = "_blank";
		logo.addItem("Recalibrate").link.onclick = function(){ me._recalibrate(); };
		
		var file = this.menu.addItem("File");
		file.addItem("New").link.onclick = function(){ me._newPage(); };
		file.addItem("Open");
		file.addItem("Save").link.onclick = function(){ me._savePage(); };
		file.addItem("Export").link.onclick = function(){ me._exportPage(); };
		
		var page = this.menu.addItem("Page");
		page.addItem("Add Layer").link.onclick = function(){ me.page.addLayer(); };
		page.addItem("Clear Layer").link.onclick = function(){ me.page.activeLayer().clear(); };
		page.addItem("Undo").link.onclick = function(){ me._undo(); };
		page.addItem("Redo").link.onclick = function(){ me._redo(); };
		
		var brush = this.menu.addItem("Brush");
		brush.addItem("Fill Style").link.onclick = function(){ me._brushFill(); };
		var action = brush.addItem("Action");
		action.addItem("Draw").link.onclick = function(){ me.page.activeLayer().globalCompositeOperation = "source-over"; };
		action.addItem("Draw On").link.onclick = function(){ me.page.activeLayer().globalCompositeOperation = "source-atop"; };
		action.addItem("Draw Behind").link.onclick = function(){ me.page.activeLayer().globalCompositeOperation = "destination-over"; };
		action.addItem("Erase").link.onclick = function(){ me.page.activeLayer().globalCompositeOperation = "destination-out"; };
		var type = brush.addItem("Type");
		type.addItem("Distance").link.onclick = function(){ me.brush = DistanceBrush; };
		type.addItem("Tilt").link.onclick = function(){ TiltBrush.normal = Leap.Vector.zero().minus(me.screen.normal()); me.brush = TiltBrush; };
		type.addItem("Bubble").link.onclick = function(){ me.brush = BubbleBrush; };
		type.addItem("Speed").link.onclick = function(){ me.brush = SpeedBrush; };
		var tracking = brush.addItem("Tracking");
		tracking.addItem("Directional").link.onclick = function(){ me.projection = function(pointable){ return this.screen.intersect(pointable, true); }; };
		tracking.addItem("Positional").link.onclick = function(){ me.projection = function(pointable){ return this.screen.project(pointable, true); }; };
		
		var themes = this.menu.addItem("Themes");
		themes.addItem("None").link.onclick = function(){ me.page.background.clear(); app.page.background.renderProgress();};
		themes.addItem("Space").link.onclick = Space;
		themes.addItem("Ocean").link.onclick = Ocean;
		themes.addItem("Graffiti").link.onclick = Graffiti;
		
		//var help = this.menu.addItem("Help");
		//help.addItem("Controls").link.onclick = function(){ me._showControls(); }
		//help.addItem("Tutorial").link.onclick = function(){ me._showTutorial(); }
	},
	
	_contextMenu : function(){
		
	},
	
	_showYoutube : function(){
		var div = document.createElement("div");
		div.id = "youtube";
		div.classList.add("youtube");
		div.innerHTML += 'If you have a Leap Motion, ensure it is connected and the Leap application is running.<br/><iframe width="853" height="480" src="http://www.youtube.com/embed/TBHGjIBmBaQ?autoplay=1" frameborder="0" allowfullscreen></iframe>';
		document.body.appendChild(div);
	}
}
var Layer = function(w,h){
	
	this.width = w;
	this.height = h;
	
	this.canvas = document.createElement("canvas");
	this.canvas.classList.add("layer");
	this.canvas.width = w;
	this.canvas.height = h;
	this.context = this.canvas.getContext("2d");
	
	this.staticCanvas = document.createElement("canvas");
	this.staticCanvas.classList.add("layer");
	this.staticCanvas.width = w;
	this.staticCanvas.height = h;
	this.staticContext = this.staticCanvas.getContext("2d");
	
	this.globalCompositeOperation = "source-over";
	this.fillStyle = "#000000";
	// TODO: FillStyle
	
	this.cache = [];
	
	this.history = [];
	this.progress = {};
	this.discard = [];
	
	this.clears = [];
	this.lastClear = -1;
	
	this.needsRender = false;
};

Layer.prototype = {
	
	clear : function(){
		this.addCache();
		this.staticContext.clearRect(0, 0, this.width, this.height);
		this.lastClear = this.history.length;
		this.clears.push(this.lastClear);
		this.history.push("clear");
		this.needsRender = true;
	},
	
	processAnchor : function(id, anchor, brush){
		var stroke = this.progress[id];
		var inRange = (Math.abs(anchor.distance) <= 1);
		
		if(stroke){
			if(inRange) stroke.update(anchor);
			else this.finalizeStroke(id);
		}
		else{
			if(inRange){
				this.progress[id] = new Stroke(this.canvas, this.globalCompositeOperation, this.fillStyle, brush, anchor);
			}
		}
		
		this.needsRender = true;
	},
	
	finalizeStroke : function(id){
		var stroke = this.progress[id];
		stroke.finalize();
		if(stroke.visible()){
			this.addCache();
			this.staticContext.globalCompositeOperation = stroke.globalCompositeOperation;
			this.staticContext.drawImage(stroke.canvas, stroke.x, stroke.y, stroke.width, stroke.height, stroke.x, stroke.y, stroke.width, stroke.height);
			stroke.trash();
			this.history.push(stroke);
			this.needsRender = true;
		}
		
		delete this.progress[id];
	},
	
	addCache : function(){
		var cache = document.createElement("canvas");
		cache.width = this.width;
		cache.height = this.height;
		var cacheContext = cache.getContext("2d");
		cacheContext.globalCompositeOperation = "source-over";
		cacheContext.drawImage(this.staticCanvas, 0, 0);
		this.cache.push(cache);
	},
	
	renderProgress : function(){
		
		if(this.needsRender){
			this.context.clearRect(0, 0, this.width, this.height);
			this.context.globalCompositeOperation = "source-over";
			this.context.drawImage(this.staticCanvas, 0, 0);
			for(var id in this.progress){
				var stroke = this.progress[id];
				if(stroke.visible()){
					this.context.globalCompositeOperation = stroke.globalCompositeOperation;
					this.context.drawImage(stroke.canvas, stroke.x, stroke.y, stroke.width, stroke.height, stroke.x, stroke.y, stroke.width, stroke.height);
				}
			}
			
			this.needsRender = false;
		}
	},
	
	undo : function(){
	
		var action = this.history.pop();
		
		if(action){
			this.discard.push(action);
			
			if(action == "clear"){
				this.clears.pop();
				this.lastClear = this.clears[this.clears.length-1] || -1;
			}
			
			this.staticContext.clearRect(0, 0, this.width, this.height);
			this.staticContext.globalCompositeOperation = "source-over";
			
			var cache = this.cache.pop();
			this.staticContext.drawImage(cache, 0, 0);
			
			this.needsRender = true;
		}
	},
	
	redo : function(){
		
		var action = this.discard.pop();
		
		if(action){
			this.history.push(action);
			this.addCache();
			
			if(action == "clear"){
				this.staticContext.clearRect(0, 0, this.width, this.height);
				this.lastClear = this.history.length - 1;
				this.clears.push(this.lastClear);
			}
			else{
				action.rebuild(this.canvas);
				this.staticContext.globalCompositeOperation = action.globalCompositeOperation;
				this.staticContext.drawImage(action.canvas, action.x, action.y, action.width, action.height, action.x, action.y, action.width, action.height);
				action.trash();
			}
			
			this.needsRender = true;
		}
	}
}
var Menu = function(){
	
	this.items = [];
	this.ul = document.createElement("ul");
	this.ul.classList.add("dropdown");
};

Menu.prototype = {
	
	addItem: function(title){
		var item = new Item(title);
		this.items.push(item);
		this.ul.appendChild(item.li);
		
		return item;
	}
};

var Item = function(title){
	
	this.items = [];
	this.title = title;
	this.li = document.createElement("li");
	this.link = document.createElement("a");
	this.link.href = "#";
	this.link.innerHTML = title;
	this.li.appendChild(this.link);
	this.ul = document.createElement("ul");
	this.li.appendChild(this.ul);
	
	var me = this;
	this.li.onmouseover = function(){ me.show(); };
	this.li.onmouseout = this.ul.onclick = function(){ me.hide(); };
};

Item.prototype = {
	
	addItem: function(title){
	
		var item = new Item(title);
		this.items.push(item);
		this.ul.appendChild(item.li);
		
		return item;
	},
	
	show : function(){
		this.li.classList.add("hover");
		this.ul.style.visibility = "visible";
	},
	
	hide : function(){
		this.li.classList.remove("hover");
		this.ul.style.visibility = "hidden";
	}
}
var Page = function(w,h){
	
	this.width = w;
	this.height = h;
	this.background = new Layer(w,h);
	this.layers = [new Layer(w,h)];
	this.composite = new Layer(w,h);
	
	this.activeIndex = 0;
	
	this.div = document.createElement("div");
	this.div.appendChild(this.background.canvas);
	this.div.appendChild(this.layers[0].canvas);
};

Page.prototype = {
	
	addLayer : function(){
		var layer = new Layer(this.width, this.height);
		this.activeIndex = this.layers.length;
		this.layers.push(layer);
		this.div.appendChild(layer.canvas);
		return layer;
	},
	
	flatten : function(){
		var ctx = this.composite.context;
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.drawImage(this.background.canvas, 0, 0);
		for(index in this.layers) ctx.drawImage(this.layers[index].canvas, 0, 0);
		return this.composite;
	},
	
	activeLayer : function(){
		return this.layers[this.activeIndex];
	}
};
var Stroke = function(canvas, gco, fillStyle, brush, anchor){
	
	this.brush = brush;
	this.path = [anchor];
	this.lastAnchor = anchor;
	
	this.canvas = document.createElement("canvas");
	this.canvas.width = canvas.width;
	this.canvas.height = canvas.height;
	
	this.context = this.canvas.getContext("2d");
	this.globalCompositeOperation = gco;
	this.fillStyle = fillStyle;
	this.context.fillStyle = fillStyle;
	
	var boundary = this.brush.start(this.context, anchor);
	this.boundary = new Boundary(boundary, canvas.width, canvas.height);
	this.x = this.boundary.left;
	this.y = this.boundary.top;
	this.width = this.boundary.right - this.x;
	this.height = this.boundary.bottom - this.y;
};

Stroke.prototype = {
	
	update : function(anchor){
		
		var boundaries = this.brush.draw(this.context, this.lastAnchor, anchor);
		
		var changed = false;
		for(i in boundaries) changed = this.boundary.update(boundaries[i]) || changed;
		
		if(changed){
			this.x = this.boundary.left;
			this.y = this.boundary.top;
			this.width = this.boundary.right - this.x;
			this.height = this.boundary.bottom - this.y;
		}
		
		this.path.push(anchor);
		this.lastAnchor = anchor;
	},
	
	finalize : function(context){
		
	},
	
	trash : function(){
		delete this.canvas;
		delete this.context;
	},
	
	rebuild : function(canvas){
		this.canvas = document.createElement("canvas");
		this.canvas.width = canvas.width;
		this.canvas.height = canvas.height;
		
		this.context = this.canvas.getContext("2d");
		this.context.fillStyle = this.fillStyle;
		
		this.brush.start(this.context, this.path[0]);
		
		for(var i=1; i<this.path.length; i++){
			this.brush.draw(this.context, this.path[i-1], this.path[i]);
		}
		this.lastAnchor = this.path[i-1];
		
	},
	
	visible : function(){
		return this.width > 0 && this.height > 0;
	}
};
