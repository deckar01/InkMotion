var Brush = function(){};

Brush.prototype = {
	
	start : function(){
		
	},
	
	stroke : function(lastProject, nextProject, context){
		
	},
	
	end : function(){
		
	}
};

var PressureBrush = new Brush();

PressureBrush.activeDistance = 40;
PressureBrush.minSize = 0;
PressureBrush.maxSize = 10;

PressureBrush.start = function(project, context){
	
	if(project.distance > this.activeDistance || project.distance < -this.activeDistance) return;
	
	var hit = project.position;
	var size = (1 - project.distance/this.activeDistance)*(this.maxSize - this.minSize) + this.minSize;
	
	context.beginPath();
	try{
		context.arc(hit.x, hit.y, size, 0, 2 * Math.PI, false);
	}
	catch(e){
		console.log(size);
	}
	context.fill();
};

PressureBrush.stroke = function(lastProject, nextProject, context){
	
	if(lastProject.distance > this.activeDistance || nextProject.distance > this.activeDistance || lastProject.distance < -this.activeDistance || nextProject.distance < -this.activeDistance) return;
		
	var lastHit = lastProject.position;
	var nextHit = nextProject.position;
	
	var lastSize = (1 - lastProject.distance/this.activeDistance)*(this.maxSize - this.minSize) + this.minSize;
	var nextSize = (1 - nextProject.distance/this.activeDistance)*(this.maxSize - this.minSize) + this.minSize;
	
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
	try{
		context.arc(nextHit.x, nextHit.y, nextSize, 0, 2 * Math.PI, false);
	}
	catch(e){
		console.log(nextSize);
	}
	context.fill();
	
};