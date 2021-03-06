self.importScripts('hitbox.js');

container = new Container();

self.onmessage = function (event) {
	switch(event.data[0]){
		case 'add':
			container.addChildren(event.data[1]);
			break;
		case 'move':
			var child = container.getByUID(event.data[1].uID)
			child.x = event.data[1].x;
			child.y = event.data[1].y;
			break;
		case 'remove':
			container.removeChildren(event.data[1]);
			break;
		case 'ignoreHit':
			var child = container.getByUID(event.data[1].uID)
			child.wasHit = false;
			break;
	}
};

setTimeout(function() {
	test();
}, 1);

function test(){
	setTimeout(function() {
		for(var i = 0; i < container.children.length; i++){
			if(isOutOfBorder(container.children[i])){
				this.postMessage(["outOfBorder", container.children[i].uID]);
				container.children[i].wasHit == true;;
			}else{
				for(var j = i + 1; j < container.children.length; j++){
					if(container.children[i].wasHit == false & container.children[j].wasHit == false){
						if(hitTestRectangle(container.children[i], container.children[j])){
							container.children[i].wasHit == true;
							this.postMessage(["collision", container.children[i].uID, container.children[j].uID]);
						}
					}
				}
			}
		}
		test();
	}, 10);
}
function isOutOfBorder(object) {
	if(object.x <= -100 | object.x >= 2100 | object.y <= -100 | object.y >= 2100)
		return true;
}
	
function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x;
  r1.centerY = r1.y;
  r2.centerX = r2.x;
  r2.centerY = r2.y;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};