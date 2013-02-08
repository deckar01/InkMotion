var Brush = function(){};

Brush.prototype = {
	
	start : function(pointable, context, screen){
		
	},
	
	stroke : function(pointable, lastPointable, context, screen){
		
	},
	
	end : function(){
		
	}
};

var PressureBrush = new Brush();

PressureBrush.activeDistance = 40;
PressureBrush.minSize = 0;
PressureBrush.maxSize = 10;

PressureBrush.stroke = function(pointable, lastPointable, context, screen){

	var nextProject = pointable.project;
	var lastProject = lastPointable.project;
	
	if(lastProject.distance > this.activeDistance || nextProject.distance > this.activeDistance) return;
		
	var lastHit = lastProject.position;
	var nextHit = nextProject.position;
	
	var lastSize = (1 - lastProject.distance/this.activeDistance)*(this.maxSize - this.minSize) + this.minSize;
	var nextSize = (1 - nextProject.distance/this.activeDistance)*(this.maxSize - this.minSize) + this.minSize;
	
	context.beginPath();
	context.arc(lastHit.x, lastHit.y, lastSize, 0, 2 * Math.PI, false);
	context.fill();
	
	var stroke = nextHit.minus(lastHit);
	var ortho = new Leap.Vector([stroke.y, -stroke.x, 0]);
	ortho = ortho.normalized();
	var lastOrtho = ortho.multiply(lastSize);
	ortho = ortho.multiply(nextSize);
	
	var start = nextHit.plus(ortho);
	context.beginPath();
	
	var pos = start;
	context.moveTo(pos.x, pos.y);
	
	pos = nextHit.minus(ortho);
	context.lineTo(pos.x, pos.y);
	
	pos = lastHit.minus(lastOrtho);
	context.lineTo(pos.x, pos.y);
	
	pos = lastHit.plus(lastOrtho);
	context.lineTo(pos.x, pos.y);
	
	pos = start;
	context.lineTo(pos.x, pos.y);
	
	context.fill();
	
	context.beginPath();
	context.arc(nextHit.x, nextHit.y, nextSize, 0, 2 * Math.PI, false);
	context.fill();
	
};

var TiltBrush = new Brush();

TiltBrush.activeDistance = 40;
TiltBrush.minSize = 0;
TiltBrush.maxSize = 10;

TiltBrush.start = function(pointable, context, screen){

	var project = pointable.project;
	
	if(project.distance > this.activeDistance) return;
	
	var hit = project.position;
	var tilt = 2*pointable.direction().angleTo(screen.normal())/Math.PI;
	var size = tilt*(this.maxSize - this.minSize) + this.minSize;
	
	context.beginPath();
	try{
		context.arc(hit.x, hit.y, size, 0, 2 * Math.PI, false);
	}
	catch(e){
		console.log(size);
	}
	context.fill();
};

TiltBrush.stroke = function(pointable, lastPointable, context, screen){

	var nextProject = pointable.project;
	var lastProject = lastPointable.project;
	
	if(lastProject.distance > this.activeDistance || nextProject.distance > this.activeDistance) return;
		
	var lastHit = lastProject.position;
	var nextHit = nextProject.position;
	
	var lastTilt = 2*lastPointable.direction().angleTo(screen.normal())/Math.PI;
	var lastSize = lastTilt*(this.maxSize - this.minSize) + this.minSize;
	var nextTilt = 2*pointable.direction().angleTo(screen.normal())/Math.PI;
	var nextSize = nextTilt*(this.maxSize - this.minSize) + this.minSize;
	
	var stroke = nextHit.minus(lastHit);
	var ortho = new Leap.Vector([stroke.y, -stroke.x, 0]);
	ortho = ortho.normalized();
	var lastOrtho = ortho.multiply(lastSize);
	ortho = ortho.multiply(nextSize);
	
	var start = nextHit.plus(ortho);
	context.beginPath();
	
	var pos = start;
	context.moveTo(pos.x, pos.y);
	
	pos = nextHit.minus(ortho);
	context.lineTo(pos.x, pos.y);
	
	pos = lastHit.minus(lastOrtho);
	context.lineTo(pos.x, pos.y);
	
	pos = lastHit.plus(lastOrtho);
	context.lineTo(pos.x, pos.y);
	
	pos = start;
	context.lineTo(pos.x, pos.y);
	
	context.fill();
	
	context.beginPath();
	context.arc(nextHit.x, nextHit.y, nextSize, 0, 2 * Math.PI, false);
	context.fill();
	
};