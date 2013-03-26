var Layer = function(w,h){
	
	this.width = w;
	this.height = h;
	
	this.canvas = document.createElement("canvas");
	this.canvas.classList.add("layer");
	this.canvas.width = w;
	this.canvas.height = h;
	this.context = this.canvas.getContext("2d");
	
	this.staticCanvas = document.createElement("canvas");
	this.staticCanvas.classList.add("layer");
	this.staticCanvas.width = w;
	this.staticCanvas.height = h;
	this.staticContext = this.staticCanvas.getContext("2d");
	
	this.globalCompositeOperation = "source-over";
	this.fillStyle = "#000000";
	// TODO: FillStyle
	
	this.history = [];
	this.progress = {};
	this.discard = [];
	
	this.clears = [];
	this.lastClear = -1;
	
	this.needsRender = false;
};

Layer.prototype = {
	
	clear : function(){
		this.staticContext.clearRect(0, 0, this.width, this.height);
		this.lastClear = this.history.length;
		this.clears.push(this.lastClear);
		this.history.push("clear");
		this.needsRender = true;
	},
	
	processAnchor : function(id, anchor, brush){
		var stroke = this.progress[id];
		var inRange = (Math.abs(anchor.distance) <= 1);
		
		if(stroke){
			if(inRange) stroke.update(anchor);
			if(!inRange || anchor.y > this.height || anchor.x < 0 || anchor.x > this.width || anchor.y < 0) this.finalizeStroke(id);
		}
		else{
			if(inRange && anchor.y <= this.height && anchor.x >= 0 && anchor.x <= this.width && anchor.y >= 0)
				this.progress[id] = new Stroke(this.canvas, this.globalCompositeOperation, this.fillStyle, brush, anchor);
		}
		
		this.needsRender = true;
	},
	
	finalizeStroke : function(id){
		var stroke = this.progress[id];
		stroke.finalize();
		this.staticContext.globalCompositeOperation = stroke.globalCompositeOperation;
		this.staticContext.drawImage(stroke.canvas, 0, 0);
		this.history.push(stroke);
		delete this.progress[id];
		
		this.needsRender = true;
	},
	
	renderProgress : function(){
		
		if(this.needsRender){
			this.context.clearRect(0, 0, this.width, this.height);
			this.context.globalCompositeOperation = "source-over";
			this.context.drawImage(this.staticCanvas, 0, 0);
			for(var id in this.progress){
				this.context.globalCompositeOperation = this.progress[id].globalCompositeOperation;
				this.context.drawImage(this.progress[id].canvas, 0, 0);
			}
			
			this.needsRender = false;
		}
	},
	
	undo : function(){
	
		var action = this.history.pop();
		
		if(action){
			this.discard.push(action);
			
			if(action == "clear"){
				this.clears.pop();
				this.lastClear = this.clears[this.clears.length-1] || -1;
			}
			
			this.staticContext.clearRect(0, 0, this.width, this.height);
			
			for(var index = this.lastClear+1; index < this.history.length; index++){
				this.staticContext.globalCompositeOperation = this.history[index].globalCompositeOperation;
				this.staticContext.drawImage(this.history[index].canvas, 0, 0);
			}
			
			this.needsRender = true;
		}
	},
	
	redo : function(){
		
		var action = this.discard.pop();
		
		if(action){
			this.history.push(action);
			
			if(action == "clear"){
				this.staticContext.clearRect(0, 0, this.width, this.height);
				this.lastClear = this.history.length - 1;
				this.clears.push(this.lastClear);
			}
			else{
				this.staticContext.globalCompositeOperation = action.globalCompositeOperation;
				this.staticContext.drawImage(action.canvas, 0, 0);
			}
			
			this.needsRender = true;
		}
	}
}