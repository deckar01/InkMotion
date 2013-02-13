var Brush = function(){};

Brush.prototype = {
	
	start : function(pointable, context, screen){
		
	},
	
	stroke : function(pointable, lastPointable, context, screen){
		
	},
	
	end : function(){
		
	}
};

var DistanceBrush = new Brush();

DistanceBrush.activeDistance = 40;
DistanceBrush.minSize = 0;
DistanceBrush.maxSize = 10;

DistanceBrush.stroke = function(pointable, lastPointable, context, screen){

	var nextProject = pointable.project;
	var lastProject = lastPointable.project;
	
	if(Math.abs(lastProject.distance) > this.activeDistance || Math.abs(nextProject.distance) > this.activeDistance) return;
		
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

TiltBrush.stroke = function(pointable, lastPointable, context, screen){

	var nextProject = pointable.project;
	var lastProject = lastPointable.project;
	
	if(Math.abs(lastProject.distance) > this.activeDistance || Math.abs(nextProject.distance) > this.activeDistance) return;
		
	var lastHit = lastProject.position;
	var nextHit = nextProject.position;
	
	var lastTilt = 2*lastPointable.direction().angleTo(screen.normal())/Math.PI;
	var lastSize = lastTilt*(this.maxSize - this.minSize) + this.minSize;
	var nextTilt = 2*pointable.direction().angleTo(screen.normal())/Math.PI;
	var nextSize = nextTilt*(this.maxSize - this.minSize) + this.minSize;
	
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