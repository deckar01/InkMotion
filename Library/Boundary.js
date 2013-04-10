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