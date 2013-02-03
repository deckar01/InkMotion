var InkMotion = function(){
	
	this.page = new Page(window.innerWidth, window.innerHeight);
	
	this.listener = new Leap.Listener();
	
	var me = this;
	this.listener.onConnect = function(controller){ me._onConnect(controller); };
	
	this.controller = new Leap.Controller("ws://localhost:6437/");
	this.controller.addListener(this.listener);
	
	this.brush = PressureBrush;
};

InkMotion.prototype = {
	
	_onFrame : function(controller) {
		
		var pointables = controller.frame().pointables();
		var count = pointables.count();
		
		var lastFrame = controller.frame(1);
		
		this.page.foreground.context.clearRect(0, 0, this.page.width, this.page.height);
		
		for(var index = 0; index < count; index++){
			var pointable = pointables[index];
			
			pointable.project = this.screen.intersect(pointable, true);
			
			if(pointable.project){
				// TODO: Determine which element the pointable is interacting with and propagate interaction
				var fade = (200-pointable.project.distance)/200;
				if(fade>1) fade = 1;
				else if(fade<0) fade = 0;
				
				this.page.foreground.context.beginPath();
				this.page.foreground.context.arc(pointable.project.position.x, pointable.project.position.y, 10*(1-fade), 0, 2 * Math.PI, false);
				this.page.foreground.context.fillStyle = 'rgba(180,180,180,'+fade+')';
				this.page.foreground.context.fill();
				this.page.foreground.context.beginPath();
				this.page.foreground.context.arc(pointable.project.position.x, pointable.project.position.y, 2.5*(1-fade), 0, 2 * Math.PI, false);
				this.page.foreground.context.fillStyle = 'rgba(255,255,255,'+fade+')';
				this.page.foreground.context.fill();
					
				var lastPointable = lastFrame.pointable(pointable.id());
				
				if(lastPointable.isValid() && lastPointable.project) this.brush.stroke(lastPointable.project, pointable.project, this.page.activeLayer().context);
				else this.brush.start(pointable.project, this.page.activeLayer().context);
			}
		}
	},
	
	_onConnect : function(controller) {
		var me = this;
		
		this.calibrate = new Leap.Calibrate(this.controller);
		this.calibrate.onComplete = function(screen){
			me.screen = screen;
			setTimeout(function(){ me.listener.onFrame = function(controller){ me._onFrame(controller); }; }, 1500);
		}
	}
}