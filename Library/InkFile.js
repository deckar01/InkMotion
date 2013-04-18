var InkFile = function(page){
	
	this._data = [];
	
	for(var i in page.layers){
		this._data.push(page.layers[i].history);
	}
}

InkFile.prototype = {
	
	tostring : function(){
		return JSON.stringify(this._data);
	}
}