const imgCount = 23;

const imgSrcList = getAllImgSrcArray();
let img1List;
let img2List;

//References to HTML elements:
const imgElements = document.getElementById('image-container').getElementsByTagName('img');
const matchButton = document.getElementById('match-button');
const startPlayingButton = document.getElementById('play-button');
const playAgainButton = document.getElementById('play-again-button');
const scoreCounter = document.getElementById('score-counter');
const timeCounter = document.getElementById('time-counter');
const statusContainers = document.getElementsByClassName('status-container');

let globalImgIndex = imgCount + 1;
//Set one higher than image count so generateImages() gets triggered on launch
let score;
let timeRemaining;
let imgDelay = 600;
let pauseDelay = 2500;
let justLaunched = true;
let gamePaused;
let gameEnded;

let imgInterval;
let timeInterval;

matchButton.addEventListener("click", matchButtonClicked);
startPlayingButton.addEventListener("click", matchButtonClicked);
playAgainButton.addEventListener("click", matchButtonClicked);
window.addEventListener("keydown", function (event) {
	if (event.defaultPrevented) {
	  return; // Do nothing if the event was already processed
	}
	if (event.key == ' ' || event.key == 'Enter') matchButtonClicked();
	// Cancel the default action to avoid it being handled twice
	event.preventDefault();
}, true);


//Called at the beginning of a game, sets up stuff before the game starts.
function initialSetup() {
	timeRemaining = 609;
	gamePaused = false;
	gameEnded = false;
	score = 0;
	imgInterval = setInterval(changeImages, imgDelay);
	timeInterval = setInterval(processTimer, 100);
	imgElements[0].src = getImageOfIndex(Math.floor(Math.random() * imgCount) + 1);
	imgElements[1].src = getImageOfIndex(Math.floor(Math.random() * imgCount) + 1);
	scoreCounter.innerText = score;
	timeCounter.innerText = timeRemaining + ' s';
	matchButton.innerText = "Match!"
	matchButton.style.backgroundColor = '#ffc048';
	for (let element of statusContainers) {
		element.style.display = 'block';
	}
}


//Called in an interval, handles changing displayed images
function changeImages() {
	if (gamePaused) {
		clearInterval(imgInterval)
		imgInterval = setInterval(changeImages, imgDelay);
		timeInterval = setInterval(processTimer, 100);
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
	if (justLaunched) {
		justLaunched = false;
		document.getElementById('start-container').style.display = 'none';
		document.getElementById('game-container').style.display = 'block';
		initialSetup();
		return;
	}
	if (gameEnded) {
		document.getElementById('endscreen-container').style.display = 'none';
		document.getElementById('game-container').style.display = 'block';
		initialSetup();
		return;
	}

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


//Returns an array of all available img sources
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


//Called with the timer interval, decreases timer, etc.
function processTimer() {
	timeRemaining -= 1;
	timeCounter.innerText = parseInt(timeRemaining/10) + ' s';

	if (timeRemaining <= 0) {
		clearInterval(imgInterval);
		clearInterval(timeInterval);
		gameEnded = true;
		gamePaused = false;
		playAgainButton.style.backgroundColor = '#d2dae2';
		document.getElementById('game-container').style.display = 'none';
		document.getElementById('endscreen-container').style.display = 'block';
		document.getElementById('final-score').innerText = score;
		for (let element of statusContainers) {
			element.style.display = 'none';
		}
	}
}