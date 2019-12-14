//Create global variables, aliases, enums
	//Enums
	let width = 2000;
	let height = 2000;
	let mainContainer;
	const Direction = Object.freeze({
		'N':0,
		'E':1,
		'S':2,
		'W':3,
	})
	
	//Variables
	let rocket, state, blob;
	var bullets = [];
	var maxV = parseInt(prompt("Podaj maksymalna predkosc"));
	var maxBulletV = 20;
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
		app.stage.addChild(mainContainer);

		//Set static size to mainContainer
		mainContainer.addChild(new PIXI.Sprite(new PIXI.RenderTexture.create(width, height)));
		mainContainer.addChild(new Sprite(resources["images/background.png"].texture));

		//Create the `rocket` object 
		rocket = new Sprite(resources["images/rocket.png"].texture);
		rocket.y = 128; 
		rocket.x = 128; 
		rocket.turnable = parseInt(prompt("Podaj tunrable")); 
		rocket.velocity = 0;
		rocket.wasRotation = 0;
		rocket.pivot.x = rocket.width / 2;
		rocket.pivot.y = rocket.height / 2;
		rocket.direction = Direction.N;
		//Create the `blob` sprite 
		blob = new Sprite(resources["images/blob.png"].texture);
		blob.x = 400;
		blob.y = 350;
		mainContainer.addChild(rocket);
		mainContainer.addChild(blob);

		//Set the game state
		state = play;

		//Start the game loop
		app.ticker.add(delta => gameLoop(delta));
	}

	function gameLoop(delta){
	  //update the current game state:
	  state(delta);
	}
	//PLAY FUNCTION its main loop function
	function play(delta) {
		//move rocket
		moveObject(rocket);
		
		//shoot if is shooting
		if(rocket.isShooting)
			shoot(rocket);
			
		//move all bullets and remove bullets, which out of bounds
		for(var i = 0; i < bullets.length; i++){
			moveObject(bullets[i]);
			if(hitTestRectangle(blob, bullets[i])){
				var x = Math.floor(Math.random() * 10000);
				blob.y = x % (height * 0.98);
				blob.x = x % (width * 0.98);
			}
			//destroy bullets when come out of bounds
			if(bullets[i].x > width - maxBulletV | bullets[i].x < maxBulletV | bullets[i].y > height - maxBulletV | bullets[i].y < maxBulletV){
				mainContainer.removeChild(bullets[i]);
				bullets.splice(i, 1);
			}
		}
		mainContainer.y = rocket.y * -1 + 360;
		mainContainer.x = rocket.x * -1 + 240;
	}

//functions using when detec keydown event
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

//Space
function pressSpace(){
	rocket.isShooting = true;
}
function releaseSpace(){
	rocket.isShooting = false;
}
	
//The game's helper functions:
//The 'shoot' helper functions
function shoot(shooter){
		bullet = new Sprite(resources["images/bullet.png"].texture);
		bullet.x = shooter.x;
		bullet.y = shooter.y;
		bullet.wasRotation = shooter.wasRotation;
		bullet.turnable = shooter.turnable;
		bullet.rotation = shooter.rotation;
		bullet.velocity = -1 * maxBulletV;
		bullet.direction = shooter.direction;
		bullets.push(bullet);
		mainContainer.addChild(bullet);
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
		if(object.x + vx > 0 & object.x + vx < width + maxV)
			object.x += vx;
		if(object.y + vy > 0 & object.y + vy < height + maxV)
			object.y += vy;
		
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