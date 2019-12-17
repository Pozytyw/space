//Listener keyup
document.addEventListener('keydown', function(event) {
	if(!event.repeat)
	switch(event.code){
		case 'KeyW':
			pressUp();
			break;
		case 'KeyD':
			pressRight();
			break;
		case 'KeyA':
			pressLeft();
			break;
		case 'KeyJ':
			pressShoot();
			break;
		case 'ArrowUp':
			pressUp1();
			break;
		case 'ArrowRight':
			pressRight1();
			break;
		case 'ArrowLeft':
			pressLeft1();
			break;
		case 'NumpadAdd':
			pressShoot1();
			break;
	}
});
//Listener keydown
window.addEventListener('keyup', function(event) {
	if(!event.repeat)
	switch(event.code){
		case 'KeyW':
			releaseUp();
			break;
		case 'KeyD':
			releaseRight();
			break;
		case 'KeyA':
			releaseLeft();
			break;
		case 'KeyJ':
			releaseShoot();
			break;
		case 'ArrowUp':
			releaseUp1();
			break;
		case 'ArrowRight':
			releaseRight1();
			break;
		case 'ArrowLeft':
			releaseLeft1();
			break;
		case 'NumpadAdd':
			releaseShoot1();
			break;
	}
});