class Container {

	constructor() {
		this.children = [];
	}

	addChildren(child) {
		this.children.push(child);
	}
	
	removeChildren(object) {
		for(var i = 0; i < this.children.length; i++){
			if(object.uID == this.children[i].uID){
				this.children.splice(i, 1);
			}
		}
	}
	getByUID(uID){
		for (const child of this.children) {
			if(child.uID == uID){
				return child;
			}
		}
	}
}

class Child {
	constructor(object) {
		this.x = object.x;
		this.y = object.y;
		this.width = object.width;
		this.height = object.height;
		this.wasHit = false;
		this.color = object.color;
		this.uID = object.uID;
	}
}