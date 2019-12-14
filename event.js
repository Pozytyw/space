//Listener keyup
document.addEventListener('keydown', function(event) {
	switch(event.code){
		case 'ArrowUp':
			pressUp()
			break;
		case 'ArrowRight':
			pressRight()
			break;
		case 'ArrowLeft':
			pressLeft()
			break;
		case 'Space':
			pressSpace()
			break;
	}
});
//Listener keydown
document.addEventListener('keyup', function(event) {
	switch(event.code){
		case 'ArrowUp':
			releaseUp();
			break;
		case 'ArrowRight':
			releaseRight();
			break;
		case 'ArrowLeft':
			releaseLeft();
			break;
		case 'Space':
			releaseSpace()
			break;
	}
});