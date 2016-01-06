var Menu = Class.$extend({
	__init__: function(){
		this.tempDom = element("temp-dom");
		this.levelList = element("level-list").children;
		this.saveButton = element("compile-level");
	},

	hideTemp : function(){
		element("temp-dom").style.display = "none";
		element("compile-level").style.display = "none";
	},

	highlight: function(index){
		for (var i = 0; i < element("level-list").children.length; i++) { element("level-list").children[i].style.background = "#555" }
    	element("level-list").children[index].style.background = "#fff"
	},

	showTemp: function(){
		for (var i = 0; i < element("level-list").children.length; i++) { element("level-list").children[i].style.background = "#555" }
		element("temp-dom").style.background = "#fff"
		element("temp-dom").style.display = "block";
		element("compile-level").style.display = "block"
	},

	addTemp: function(){
		var li = document.createElement("li")
		li.id = "temp-dom"
		li.innerHTML = "<em>Unsaved Temporary Level</em>"
		li.style.display = "none";
		element("level-list").appendChild(li)
		element("compile-level").style.display = "none"
	}
});
