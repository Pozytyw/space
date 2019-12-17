class Container {

	constructor() {
		this.children = [];
	}

	addChildren(child) {
		this.children.push(child);
	}
	
	removeChildren(index) {
		this.children.splice(index, 1);
	}
}

class Child {
	constructor(object) {
		this.x = object.x;
		this.y = object.y;
		this.width = object.width;
		this.height = object.height;
		this.color = object.color;
	}
}