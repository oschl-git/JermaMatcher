const imgCount = 23;

const imgSrcList = getAllImgSrcArray();
let img1List;
let img2List;

//References to HTML elements:
const imgElements = document.getElementById('image-container').getElementsByTagName('img');
const matchButton = document.getElementById('match-button');
const scoreCounter = document.getElementById('score-counter');

let imgInterval = setInterval(changeImages, 700);

let globalImgIndex = imgCount + 1;
//Set one higher than image count so generateImages() gets triggered on launch

let score = 0;

matchButton.addEventListener("click", matchButtonClicked);


//Called in an interval, handles changing displayed images
function changeImages() {
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
	if (imgElements[0].src == imgElements[1].src) score++;
	else score--;
	scoreCounter.innerText = score;
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