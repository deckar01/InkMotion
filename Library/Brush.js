var Brush = function(){};

Brush.prototype = {
	
	start : function(context, anchor){
		
	},
	
	draw : function(context, startAnchor, endAnchor){
		
	}
};

// TODO: Update brushes to new interface

var DistanceBrush = new Brush();

DistanceBrush.minSize = 0;
DistanceBrush.maxSize = 10;

DistanceBrush.start = function(context, anchor){

	var size = (1 - anchor.distance)*(this.maxSize - this.minSize) + this.minSize;
	
	context.beginPath();
	context.arc(anchor.x, anchor.y, size, 0, 2 * Math.PI, false);
	context.fill();
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
	
};

// var TiltBrush = new Brush();

// TiltBrush.activeDistance = 40;
// TiltBrush.minSize = 0;
// TiltBrush.maxSize = 10;

// TiltBrush.stroke = function(pointable, lastPointable, context, screen){

	// var nextProject = pointable.project;
	// var lastProject = lastPointable.project;
	
	// if(Math.abs(lastProject.distance) > this.activeDistance || Math.abs(nextProject.distance) > this.activeDistance) return;
		
	// var lastHit = lastProject.position;
	// var nextHit = nextProject.position;
	
	// var lastTilt = 2*lastPointable.direction().angleTo(screen.normal())/Math.PI;
	// var lastSize = lastTilt*(this.maxSize - this.minSize) + this.minSize;
	// var nextTilt = 2*pointable.direction().angleTo(screen.normal())/Math.PI;
	// var nextSize = nextTilt*(this.maxSize - this.minSize) + this.minSize;
	
	// context.beginPath();
	// context.arc(lastHit.x, lastHit.y, lastSize, 0, 2 * Math.PI, false);
	// context.fill();
	
	// var stroke = nextHit.minus(lastHit);
	// var ortho = new Leap.Vector([stroke.y, -stroke.x, 0]);
	// ortho = ortho.normalized();
	// var lastOrtho = ortho.multiply(lastSize);
	// ortho = ortho.multiply(nextSize);
	
	// var start = nextHit.plus(ortho);
	// context.beginPath();
	
	// var pos = start;
	// context.moveTo(pos.x, pos.y);
	
	// pos = nextHit.minus(ortho);
	// context.lineTo(pos.x, pos.y);
	
	// pos = lastHit.minus(lastOrtho);
	// context.lineTo(pos.x, pos.y);
	
	// pos = lastHit.plus(lastOrtho);
	// context.lineTo(pos.x, pos.y);
	
	// pos = start;
	// context.lineTo(pos.x, pos.y);
	
	// context.fill();
	
	// context.beginPath();
	// context.arc(nextHit.x, nextHit.y, nextSize, 0, 2 * Math.PI, false);
	// context.fill();
	
// };

var BubbleBrush = new Brush();

BubbleBrush.minSize = 0;
BubbleBrush.maxSize = 10;

BubbleBrush.start = function(context, anchor){

	var size = (1 - anchor.distance)*(this.maxSize - this.minSize) + this.minSize;
	
	context.beginPath();
	context.arc(anchor.x, anchor.y, size, 0, 2 * Math.PI, false);
	context.fill();
}

BubbleBrush.draw = function(context, startAnchor, endAnchor){
	
	var endSize = (1 - endAnchor.distance)*(this.maxSize - this.minSize) + this.minSize;

	context.beginPath();
	context.arc(endAnchor.x, endAnchor.y, endSize, 0, 2 * Math.PI, false);
	context.fill();
	
};