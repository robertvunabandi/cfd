let alphabetTexts = "abcdefghijklmnopqrstuvwxyz0123456789";
let alphabetColor = "0123456789abcdef";

function generateRandomColor() {
	let r = generateRandomString(2,2, alphabetColor);
	let g = generateRandomString(2,2, alphabetColor);
	let b = generateRandomString(2,2, alphabetColor);
	return "#" + r + g + b;
}

function generateRandomString(minLength, maxLength, alphabet) {
	let length = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
	let string = "";
	for (let i = 0; i < length; i += 1) {
		string += generateRandomLetter(alphabet);
	}
	return string;
}

function generateRandomLetter(alphabet) {
	let randomAlphabetIndex = Math.floor(Math.random() * alphabet.length);
	return alphabet[randomAlphabetIndex];
}


window.addEventListener("load", main);
function main() {
	// add stuff here
	let randomString = document.getElementById("random-string");
	randomString.addEventListener("click", function() {
		randomString.innerText = generateRandomString(4, 13, alphabetTexts);	
		randomString.style.color = generateRandomColor();
	});
}