var Menu = function(){
	
	this.items = [];
	this.nav = document.createElement("nav");
	this.ul = document.createElement("ul");
	this.nav.appendChild(this.ul);
	document.body.appendChild(this.nav);
};

Menu.prototype = {
	
	init: function(){
		$(this.nav).find("li").each(function(){
			if($(this).find("ul").length > 0){
				$(this).mouseenter(function(){ $(this).find("ul").stop(true, true).slideDown(); });
				$(this).mouseleave(function(){ $(this).find("ul").stop(true, true).slideUp(); });
			}
		})
	},
	
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
};

Item.prototype = {
	
	addItem: function(title){
		var item = new Item(title);
		if(this.items.length==0){
			this.ul = document.createElement("ul");
			this.li.appendChild(this.ul);
		}
		this.items.push(item);
		this.ul.appendChild(item.li);
		
		return item;
	}
}