const imgCount = 23;

const imgSrcList = getAllImgSrcArray();
let img1List;
let img2List;

//References to HTML elements:
const imgElements = document.getElementById('image-container').getElementsByTagName('img');
const matchButton = document.getElementById('match-button');
const scoreCounter = document.getElementById('score-counter');
const timeCounter = document.getElementById('time-counter');

let globalImgIndex = imgCount + 1;
//Set one higher than image count so generateImages() gets triggered on launch
let score = 0;
let timeRemaining = 60;
let imgDelay = 600;
let pauseDelay = 3000;
let gamePaused = false;

let imgInterval = setInterval(changeImages, imgDelay);
let timeInterval = setInterval(processTimer, 1000);

matchButton.addEventListener("click", matchButtonClicked);
window.addEventListener("keydown", function (event) {
	if (event.defaultPrevented) {
	  return; // Do nothing if the event was already processed
	}

	if (event.key == ' ' || event.key == 'Enter') matchButtonClicked();

	// Cancel the default action to avoid it being handled twice
	event.preventDefault();
}, true);
initialSetup();


//Called at the beginning, sets up stuff before the game starts.
function initialSetup() {
	imgElements[0].src = getImageOfIndex(Math.floor(Math.random() * imgCount) + 1);
	imgElements[1].src = getImageOfIndex(Math.floor(Math.random() * imgCount) + 1);
	scoreCounter.innerText = score;
	timeCounter.innerText = timeRemaining + ' s';
}


//Called in an interval, handles changing displayed images
function changeImages() {
	if (gamePaused) {
		clearInterval(imgInterval)
		imgInterval = setInterval(changeImages, imgDelay);
		timeInterval = setInterval(processTimer, 1000);
		matchButton.innerText = "Match!"
		matchButton.style.backgroundColor = '#ffc048';
		gamePaused = false;
	}
	if (globalImgIndex >= imgCount) {
		generateImageArrays();
		globalImgIndex = 1;
	}
	imgElements[0].src = img1List[globalImgIndex];
	imgElements[1].src = img2List[globalImgIndex];

	globalImgIndex++;
}


//Handles button click, increases/decreases score
function matchButtonClicked() {
	if (gamePaused) return;

	if (imgElements[0].src == imgElements[1].src) {
		score++;
		matchButton.innerText = "Correct!"
		matchButton.style.backgroundColor = '#0be881';
	}
	else {
		score--;
		matchButton.innerText = "Wrong."
		matchButton.style.backgroundColor = '#ff3f34';
	}
	scoreCounter.innerText = score;
	clearInterval(imgInterval);
	clearInterval(timeInterval);
	imgInterval = setInterval(changeImages, pauseDelay);
	gamePaused = true;
}


//Returns an array of allavailable img sources
function getAllImgSrcArray() {
	let output = [];
	for (let i = 1; i <= imgCount; i++) {
		output.push(getImageOfIndex(i));
	}
	return output;
}


//Returns image of the desired index
function getImageOfIndex(index) {
	return 'game-images/' + index.toString() + '.jpg';
}


//Generates arrays for the two images so the game is playable
function generateImageArrays() {
	img1List = [...imgSrcList];
	img2List = [...imgSrcList];
	shuffleArray(img1List);
	shuffleArray(img2List);
	let imageSrc = getImageOfIndex(Math.floor(Math.random() * imgCount) + 1);
	let index = Math.floor(Math.random() * 15) + 6;
	img1List[index] = imageSrc;
	img2List[index] = imageSrc;
}


//Shuffles an array
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}


//Called every second, decreases timer, etc.
function processTimer() {
	timeRemaining -= 1;
	timeCounter.innerText = timeRemaining + ' s';

	if (timeRemaining <= 0) {
		clearInterval(imgInterval);
		clearInterval(timeInterval);
		gamePaused = true;
		matchButton.innerText = "Game ended"
		matchButton.style.backgroundColor = '#d2dae2';
	}
}