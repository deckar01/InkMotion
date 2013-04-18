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
	
	this.cache = [];
	
	this.history = [];
	this.progress = {};
	this.discard = [];
	
	this.clears = [];
	this.lastClear = -1;
	
	this.needsRender = false;
};

Layer.prototype = {
	
	clear : function(){
		this.addCache();
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
			else this.finalizeStroke(id);
		}
		else{
			if(inRange){
				this.progress[id] = new Stroke(this.canvas, this.globalCompositeOperation, this.fillStyle, brush, anchor);
			}
		}
		
		this.needsRender = true;
	},
	
	finalizeStroke : function(id){
		var stroke = this.progress[id];
		stroke.finalize();
		if(stroke.visible()){
			this.addCache();
			this.staticContext.globalCompositeOperation = stroke.globalCompositeOperation;
			this.staticContext.drawImage(stroke.canvas, stroke.x, stroke.y, stroke.width, stroke.height, stroke.x, stroke.y, stroke.width, stroke.height);
			stroke.trash();
			this.history.push(stroke);
			this.needsRender = true;
		}
		
		delete this.progress[id];
	},
	
	addCache : function(){
		var cache = document.createElement("canvas");
		cache.width = this.width;
		cache.height = this.height;
		var cacheContext = cache.getContext("2d");
		cacheContext.globalCompositeOperation = "source-over";
		cacheContext.drawImage(this.staticCanvas, 0, 0);
		this.cache.push(cache);
	},
	
	renderProgress : function(){
		
		if(this.needsRender){
			this.context.clearRect(0, 0, this.width, this.height);
			this.context.globalCompositeOperation = "source-over";
			this.context.drawImage(this.staticCanvas, 0, 0);
			for(var id in this.progress){
				var stroke = this.progress[id];
				if(stroke.visible()){
					this.context.globalCompositeOperation = stroke.globalCompositeOperation;
					this.context.drawImage(stroke.canvas, stroke.x, stroke.y, stroke.width, stroke.height, stroke.x, stroke.y, stroke.width, stroke.height);
				}
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
			this.staticContext.globalCompositeOperation = "source-over";
			
			var cache = this.cache.pop();
			this.staticContext.drawImage(cache, 0, 0);
			
			this.needsRender = true;
		}
	},
	
	redo : function(){
		
		var action = this.discard.pop();
		
		if(action){
			this.history.push(action);
			this.addCache();
			
			if(action == "clear"){
				this.staticContext.clearRect(0, 0, this.width, this.height);
				this.lastClear = this.history.length - 1;
				this.clears.push(this.lastClear);
			}
			else{
				action.rebuild(this.canvas);
				this.staticContext.globalCompositeOperation = action.globalCompositeOperation;
				this.staticContext.drawImage(action.canvas, action.x, action.y, action.width, action.height, action.x, action.y, action.width, action.height);
				action.trash();
			}
			
			this.needsRender = true;
		}
	}
}