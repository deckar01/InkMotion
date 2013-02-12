var Menu = function(){
	
	this.items = [];
	this.ul = document.createElement("ul");
	this.ul.classList.add("dropdown");
};

Menu.prototype = {
	
	addItem: function(title){
		var item = new Item(title);
		this.items.push(item);
		this.ul.appendChild(item.li);
		
		return item;
	}
};

var Item = function(title){
	
	this.items = [];
	this.title = title;
	this.li = document.createElement("li");
	this.link = document.createElement("a");
	this.link.href = "#";
	this.link.innerHTML = title;
	this.li.appendChild(this.link);
	this.ul = document.createElement("ul");
	this.li.appendChild(this.ul);
	
	var me = this;
	this.li.onmouseover = function(){ me.show(); };
	this.li.onmouseout = this.ul.onclick = function(){ me.hide(); };
};

Item.prototype = {
	
	addItem: function(title){
	
		var item = new Item(title);
		this.items.push(item);
		this.ul.appendChild(item.li);
		
		return item;
	},
	
	show : function(){
		this.li.classList.add("hover");
		this.ul.style.visibility = "visible";
	},
	
	hide : function(){
		this.li.classList.remove("hover");
		this.ul.style.visibility = "hidden";
	}
}