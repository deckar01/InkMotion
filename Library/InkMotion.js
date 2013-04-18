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