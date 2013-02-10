var Menu = function(){
	
	this.items = [];
	this.ul = document.createElement("ul");
	this.ul.classList.add("dropdown");
	document.body.appendChild(this.ul);
};

Menu.prototype = {
	
	init: function(){
		$(function(){
			$("ul.dropdown li").hover(function(){
				$(this).addClass("hover");
				$('ul:first',this).css('visibility', 'visible');
			}, function(){
				$(this).removeClass("hover");
				$('ul:first',this).css('visibility', 'hidden');
			});
			$("ul.dropdown li ul li:has(ul)").find("a:first").append(" &raquo; ");
		});
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