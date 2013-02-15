var InkMotion = function(){
	
	var me = this;
	this.div = document.getElementById("InkMotion");
	this.div.oncontextmenu = function(){ me._contextMenu(); return false; };
	
	this.page = new Page(window.innerWidth, window.innerHeight, this);
	this.pageDiv = document.createElement("div");
	this.pageDiv.appendChild(this.page.div);
	this.div.appendChild(this.pageDiv);
	
	this.foreground = new Layer(window.innerWidth, window.innerHeight);
	this.div.appendChild(this.foreground.canvas);
	
	this._buildMenu();
	this.div.appendChild(this.menu.ul);
	
	this.listener = new Leap.Listener();
	this.listener.onConnect = function(controller){ me._onConnect(controller); };
	
	this.controller = new Leap.Controller("ws://localhost:6437/");
	this.controller.addListener(this.listener);
	
	this.brush = DistanceBrush;
};

InkMotion.prototype = {
	
	_onFrame : function(controller) {
		
		var pointables = controller.frame().pointables();
		var count = pointables.count();
		
		var lastFrame = controller.frame(1);
		
		this.foreground.context.clearRect(0, 0, this.foreground.width, this.foreground.height);
		
		for(var index = 0; index < count; index++){
			var pointable = pointables[index];
			
			pointable.project = this.screen.intersect(pointable, true);
			
			if(pointable.project){
				// TODO: Determine which element the pointable is interacting with and propagate interaction
				var fade = (200-pointable.project.distance)/200;
				if(fade>1) fade = 1;
				else if(fade<0) fade = 0;
				
				this.foreground.context.beginPath();
				this.foreground.context.arc(pointable.project.position.x, pointable.project.position.y, 10*(1-fade), 0, 2 * Math.PI, false);
				this.foreground.context.fillStyle = 'rgba(0,0,0,'+fade+')';
				this.foreground.context.fill();
				this.foreground.context.beginPath();
				this.foreground.context.arc(pointable.project.position.x, pointable.project.position.y, 4*(1-fade), 0, 2 * Math.PI, false);
				this.foreground.context.fillStyle = 'rgba(255,255,255,'+fade*1.3+')';
				this.foreground.context.fill();
					
				var lastPointable = lastFrame.pointable(pointable.id());
				
				if(lastPointable.isValid() && lastPointable.project) this.brush.stroke(pointable, lastPointable, this.page.activeLayer().context, this.screen);
				else this.brush.start(pointable, this.page.activeLayer().context, this.screen);
			}
		}
	},
	
	_onConnect : function(controller){
		if(this.calibrate || this.screen) return;
		var me = this;
		
		this.calibrate = new Leap.Calibrate(this.controller);
		this.calibrate.onComplete = function(screen){
			me.screen = screen;
			delete me.calibrate;
			setTimeout(function(){ me.listener.onFrame = function(controller){ me._onFrame(controller); }; }, 1500);
		}
	},
	
	_recalibrate : function(){
		if(this.calibrate) return;
		if(!confirm("Are you sure?\nRecalibration takes a few seconds.")) return;
		this.listener.onFrame = function(controller){ };
		this.foreground.context.clearRect(0, 0, this.foreground.width, this.foreground.height);
		delete this.screen;
		this._onConnect(this.controller);
	},
	
	_newPage : function(){
		if(!confirm("Are you sure?\nUnsaved changes will be lost.")) return;
		this.pageDiv.removeChild(this.page.div);
		delete this.page;
		this.page = new Page(window.innerWidth, window.innerHeight, this);
		this.pageDiv.appendChild(this.page.div);
	},
	
	_exportPage : function(){
		window.open(this.page.flatten().canvas.toDataURL('png'), '_blank');
	},
	
	_brushFill : function(){
		this.page.activeLayer().context.fillStyle = window.prompt("Fill style:", this.page.activeLayer().context.fillStyle);
	},
	
	_buildMenu : function(){
		var me = this;
		this.menu = new Menu();
		
		var logo = this.menu.addItem("<img src='./Images/logo.png' />");
		logo.addItem("Recalibrate").link.onclick = function(){ me._recalibrate(); };
		
		var file = this.menu.addItem("File");
		file.addItem("New").link.onclick = function(){ me._newPage(); };
		file.addItem("Open");
		file.addItem("Save");
		file.addItem("Export").link.onclick = function(){ me._exportPage(); };
		
		var page = this.menu.addItem("Page");
		page.addItem("Add Layer").link.onclick = function(){ me.page.addLayer(); };
		page.addItem("Clear Layer").link.onclick = function(){ if(!confirm("Are you sure?\nUnsaved changes will be lost.")) return; me.page.activeLayer().clear(); };
		
		var brush = this.menu.addItem("Brush");
		brush.addItem("Fill Style").link.onclick = function(){ me._brushFill(); };
		var action = brush.addItem("Action");
		action.addItem("Draw").link.onclick = function(){ me.page.activeLayer().context.globalCompositeOperation = "source-over"; };
		action.addItem("Draw On").link.onclick = function(){ me.page.activeLayer().context.globalCompositeOperation = "source-atop"; };
		action.addItem("Draw Behind").link.onclick = function(){ me.page.activeLayer().context.globalCompositeOperation = "destination-over"; };
		action.addItem("Erase").link.onclick = function(){ me.page.activeLayer().context.globalCompositeOperation = "destination-out"; };
		var type = brush.addItem("Type");
		type.addItem("Distance").link.onclick = function(){ me.brush = DistanceBrush; };
		type.addItem("Tilt").link.onclick = function(){ me.brush = TiltBrush; };
		type.addItem("Bubble").link.onclick = function(){ me.brush = BubbleBrush; };
	},
	
	_contextMenu : function(){
		
	}
}