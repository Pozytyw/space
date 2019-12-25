//Create global variables, aliases, enums, workers
	//Enums
	const Direction = Object.freeze({
		'N':0,
		'E':1,
		'S':2,
		'W':3,
	})
	//create worker collisions
	var worker = new Worker("collisions.js");
	
	//Variables
	let width = 2000;
	let height = 2000;
	let mainContainer;
	let rocket, state, blob;
	var maxV = 20;
	var maxBulletV = 20;
	var objectsMoveable = [];
	
	//Aliases
	let Application = PIXI.Application,
		loader = PIXI.loader,
		resources = PIXI.loader.resources,
		Sprite = PIXI.Sprite;

//Create a Pixi Application
	let app = new Application(document.body.clientWidth * 0.99, window.innerHeight * 0.97,{                    
		antialias: true, 
		transparent: false, 
		resolution: 1
	  }
	);
	
	//Add the canvas that Pixi automatically created for you to the HTML document
	document.body.appendChild(app.view);

	//load an image and run the `setup` function when it's done
	loader
		.add(["images/rocket.png", "images/blob.png", "images/bullet.png", "images/background.png"])
		.load(setup);

	//This `setup` function will run when the image has loaded
	function setup() {
		//Create main conteiner
		mainContainer = new PIXI.Container();
		xContainer = new PIXI.Container();
		app.stage.addChild(mainContainer);
		
		//Set static size to mainContainer
		mainContainer.addChild(new PIXI.Sprite(new PIXI.RenderTexture.create(width, height)));
		
		//Add background
		mainContainer.addChild(new Sprite(resources["images/background.png"].texture));

		//Create the `rocket` object 
		rocket = new Sprite(resources["images/rocket.png"].texture);
		moveable(rocket);
		objectsMoveable.push(rocket);
		mainContainer.addChild(rocket);
		addMessage(rocket);
		
		//Create the `blob` sprite 
		createBlob();
		
		worker.addEventListener("message", function (event) {
			switch(event.data[0]){
				case 'collision':
					if(objectsMoveable[event.data[1]].color != objectsMoveable[event.data[2]].color){
						//mainContainer.removeChild(objectsMoveable[event.data[2]]);
						//mainContainer.removeChild(objectsMoveable[event.data[1]]);
						
						//removeMessage(event.data[2]);
						//removeMessage(event.data[1]);
						//objectsMoveable.splice(event.data[2], 1)
						//objectsMoveable.splice(event.data[1], 1)
						objectsMoveable[event.data[1]].velocity = 0;
						objectsMoveable[event.data[2]].velocity = 0;
					}else{
						ignoreHitMessage(event.data[1]);
						ignoreHitMessage(event.data[2]);
					}
				break;
				case 'outOfBorder':
					mainContainer.removeChild(objectsMoveable[event.data[1]]);
					removeMessage(event.data[1]);
					objectsMoveable.splice(event.data[1], 1)
				break;
			}
			
		}, false);
		
		//Set the game state
		state = play;

		//Start the game loop
		app.ticker.add(delta => gameLoop(delta));
	}

	function gameLoop(delta){
		//update the current game state:
		state();
	}
	//PLAY FUNCTION its main loop function
	function play() {
		//move all moveable
		objectsMoveable.forEach(object => moveObject(object));
		
		//shoot if is shooting
		if(rocket.isShooting)
			shoot(rocket);
		mainContainer.y = rocket.y * -1 + 360;
		mainContainer.x = rocket.x * -1 + 240;
	}

//functions using when detec keydown event for player 1
//Up
function pressUp(){
	rocket.velocity = -1 * maxV;
}
function releaseUp(){
	rocket.velocity = 0;
}

//Right
function pressRight(){
	rocket.twist = 1;
}
function releaseRight(){
	if(rocket.twist == 1)
		rocket.twist = 0;
}

//Left
function pressLeft(){
	rocket.twist = -1;
}
function releaseLeft(){
	if(rocket.twist == -1)
		rocket.twist = 0;
}

//Shoot
function pressShoot(){
	rocket.isShooting = true;
}
function releaseShoot(){
	rocket.isShooting = false;
}
	
//The game's helper functions:
//create blob
function createBlob(){
	blob = new Sprite(resources["images/blob.png"].texture);
	moveable(blob);
	blob.color = "blue";
	do{
	blob.x = Math.floor(Math.random() * 10000 % 2000);
	blob.y = Math.floor(Math.random() * 10000 % 2000);
	}while(hitTestRectangle(blob, rocket));
	objectsMoveable.push(blob);
	mainContainer.addChild(blob);
	addMessage(blob);
}
//Function that create message "add"
function addMessage(object){
	let x = [];
	x.push("add");
	x.push(new Child(object));
	worker.postMessage(x);
}
//Function that create message "move"
function moveMessage(object){
	let x = [];
	x.push("move");
	x.push(mainContainer.getChildIndex(object));
	x.push(new Child(object));
	worker.postMessage(x);
}
//Function that create message "remove"
function removeMessage(index){
	let x = [];
	x.push("remove");
	x.push(index);
	worker.postMessage(x);
}
//Function that create message "remove"
function ignoreHitMessage(index){
	let x = [];
	x.push("ignoreHit");
	x.push(index);
	worker.postMessage(x);
}
//Function that transform object to be moveable
function moveable(object){
	object.red = "red"; 
	object.y = 1200; 
	object.x = 1200; 
	object.turnable = 3; 
	object.velocity = 0;
	object.wasRotation = 0;
	object.pivot.x = object.width / 2;
	object.pivot.y = object.height / 2;
	object.direction = Direction.N;
}
//The 'shoot' helper functions
function shoot(shooter){
		bullet = new Sprite(resources["images/bullet.png"].texture);
		moveable(bullet);
		bullet.x = shooter.x;
		bullet.y = shooter.y;
		bullet.wasRotation = shooter.wasRotation;
		bullet.rotation = shooter.rotation;
		bullet.velocity = -1 * maxBulletV;
		bullet.direction = shooter.direction;
		mainContainer.addChild(bullet);
		objectsMoveable.push(bullet);
		addMessage(bullet);
}

//The 'moveRocket' helper functions
function moveObject(object){
		//rotate object by 5deg in left
		if(object.twist < 0){
			object.rotation += - Math.PI / (180 /object.turnable);
			object.wasRotation -= object.turnable;

		}else if(object.twist > 0){
			object.rotation += Math.PI / (180 /object.turnable);
			object.wasRotation += object.turnable;
			
		}	
		//if object was rotation 90 deg, change direction
		if(object.wasRotation == 90){
			object.direction = changeDirection(object.direction, 1)
			object.wasRotation = 0;
			
		}
		if(object.wasRotation == -90){
			object.direction = changeDirection(object.direction, -1)
			object.wasRotation = 0;
			
		}
		
		var vx = 0;
		var vy = 0;
		switch(object.direction){
			case Direction.N:
				vx = object.velocity * -1 * ((object.wasRotation / object.turnable) * (object.turnable * 0.0111111111));
				vy = object.velocity * (1 - Math.abs((object.wasRotation / object.turnable) * (object.turnable * 0.0111111111)));
				break;
			case Direction.E:
				vx = object.velocity * -1 * (1 - Math.abs((object.wasRotation / object.turnable) * (object.turnable * 0.0111111111)));
				vy = object.velocity * -1 * ((object.wasRotation / object.turnable) * (object.turnable * 0.0111111111));
				break;
			case Direction.S:
				vx = object.velocity * ((object.wasRotation / object.turnable) * (object.turnable * 0.0111111111));
				vy = object.velocity * -1 * (1 - Math.abs((object.wasRotation / object.turnable) * (object.turnable * 0.0111111111)));
				break;
			case Direction.W:
				vx = object.velocity * (1 - Math.abs((object.wasRotation / object.turnable) * (object.turnable * 0.0111111111)));
				vy = object.velocity * ((object.wasRotation / object.turnable) * (object.turnable * 0.0111111111));
				break;
		}
		//move object if doesn't come out of bounds
		if(object == rocket){
		if(object.x + vx > 0 & object.x + vx < width + maxV)
			object.x += vx;
		if(object.y + vy > 0 & object.y + vy < height + maxV)
			object.y += vy;
		}else{
			object.x += vx;
			object.y += vy;
		}
		if(object.velocity < 0){
			moveMessage(object);
		}
		
}

//The 'changeDirection' helper functions, direction equal +1 = rotation right, -1 left, return current value
function changeDirection(value, direction) {
	if(direction == -1 & value == 0)
		return 3;
	else if(value == 3 & direction == 1)
			return 0;
		else
			return value + direction;
}

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

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