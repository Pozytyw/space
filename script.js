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
	var maxV = 10;
	var maxBulletV = 20;
	//Aliases
	let Application = PIXI.Application,
		loader = PIXI.loader,
		resources = PIXI.loader.resources,
		Sprite = PIXI.Sprite;

//Create a Pixi Application
	let app = new Application({ 
		width: 1280, 
		height: 720,                       
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
		rocket.velocity = 0;
		rocket.wasRotation = 0;
		rocket.rotation = Math.PI / 4;
		rocket.scale.set(64 / rocket.width, 64 / rocket.height)
		rocket.pivot.x = rocket.width;
		rocket.pivot.y = rocket.height;
		rocket.direction = Direction.N;
		//Create the `blob` sprite 
		blob = new Sprite(resources["images/blob.png"].texture);
		blob.x = 400;
		blob.y = 350;
		mainContainer.addChild(rocket);
		mainContainer.addChild(blob);

		//Capture the keyboard arrow keys
		let left = keyboard("ArrowLeft"),
		up = keyboard("ArrowUp"),
		right = keyboard("ArrowRight"),
		space = keyboard("s");

		//Left
		left.press = () => {
			rocket.twist = -1;
		};
		left.release = () => {
			if(rocket.twist == -1)
				rocket.twist = 0;
		};
		//Right
		right.press = () => {
			rocket.twist = 1;
		};
		right.release = () => {
			if(rocket.twist == 1)
				rocket.twist = 0;
		};
		//Up
		up.press = () => {
			rocket.velocity = -1 * maxV;
		};
		up.release = () => {
			rocket.velocity = 0;
		};
		//Space
		space.press = () => {
			shoot(rocket);
		};

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
	
//The game's helper functions:
//The 'shoot' helper functions
function shoot(shooter){
		bullet = new Sprite(resources["images/bullet.png"].texture);
		bullet.x = shooter.x;
		bullet.y = shooter.y;
		bullet.wasRotation = shooter.wasRotation;
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
			object.rotation += - Math.PI / 36;
			object.wasRotation -= 5;

		//rotate object by 5deg in right
		}else if(object.twist > 0){
			object.rotation += Math.PI / 36;
			object.wasRotation += 5;
			
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
				vx = object.velocity * -1 * ((object.wasRotation / 5) * 0.0555555555);
				vy = object.velocity * (1 - Math.abs((object.wasRotation / 5) * 0.0555555555));
				break;
			case Direction.E:
				vx = object.velocity * -1 * (1 - Math.abs((object.wasRotation / 5) * 0.0555555555));
				vy = object.velocity * -1 * ((object.wasRotation / 5) * 0.0555555555);
				break;
			case Direction.S:
				vx = object.velocity * ((object.wasRotation / 5) * 0.0555555555);
				vy = object.velocity * -1 * (1 - Math.abs((object.wasRotation / 5) * 0.0555555555));
				break;
			case Direction.W:
				vx = object.velocity * (1 - Math.abs((object.wasRotation / 5) * 0.0555555555));
				vy = object.velocity * ((object.wasRotation / 5) * 0.0555555555);
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

//The 'keyboard' helper functions:
	function keyboard(value) {
	  let key = {};
	  key.value = value;
	  key.isDown = false;
	  key.isUp = true;
	  key.press = undefined;
	  key.release = undefined;
	  //The `downHandler`
	  key.downHandler = event => {
		if (event.key === key.value) {
		  if (key.isUp && key.press) key.press();
		  key.isDown = true;
		  key.isUp = false;
		  event.preventDefault();
		}
	  };

	  //The `upHandler`
	  key.upHandler = event => {
		if (event.key === key.value) {
		  if (key.isDown && key.release) key.release();
		  key.isDown = false;
		  key.isUp = true;
		  event.preventDefault();
		}
	  };

	  //Attach event listeners
	  const downListener = key.downHandler.bind(key);
	  const upListener = key.upHandler.bind(key);
	  
	  window.addEventListener(
		"keydown", downListener, false
	  );
	  window.addEventListener(
		"keyup", upListener, false
	  );
	  // Detach event listeners
	  key.unsubscribe = () => {
		window.removeEventListener("keydown", downListener);
		window.removeEventListener("keyup", upListener);
	  };
	  
	  return key;
	}