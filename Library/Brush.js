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

