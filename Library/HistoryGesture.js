var HistoryGesture = function(undo, redo){
	
	this.undo = undo;
	this.redo = redo;
	this.reset();
};

HistoryGesture.prototype = {
	
	reset : function(){
		this.gid = -1;
		this.progress = 0;
	},
	
	update : function(frame){
		
		if(this.gid == -1){
			var gestures = frame.gestures();
			if(gestures.count() > 1){
				var gesture = gestures[0];
				this.gid = gesture.id();
				if(gesture.normal().angleTo(gesture.pointable().direction()) > Math.PI/2) this.action = this.undo;
				else this.action = this.redo;
				this.progress = Math.floor(gesture.progress());
			}
			else this.reset();
		}
		else{
			var gesture = frame.gesture(this.gid);
			if(gesture.isValid()) this.apply(gesture);
			else this.reset();
		}
	},
	
	apply : function(gesture){
		while(this.progress < Math.floor(gesture.progress())){
			this.action();
			this.progress++;
		}
	}
};