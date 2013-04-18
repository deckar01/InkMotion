var Anchor = function(project, pointable){
	
	this.x = Math.round(project.position.x);
	this.y = Math.round(project.position.y);
	this.distance = project.distance;
	this.direction = pointable.direction();
	this.velocity = pointable.tipVelocity();
}