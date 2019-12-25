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
	}
});