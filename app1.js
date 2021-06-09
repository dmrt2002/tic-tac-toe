var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
var x = document.getElementById("myAudio"); 
var y = document.getElementById("myAudio1"); 
var z = document.getElementById("myAudio2");
var button = document.querySelector("#button");
var score1 = document.querySelector(".score1");
var score2 = document.querySelector(".score2");
var score3 = document.querySelector(".score3");
var message = document.querySelector(".endgame .text");

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

function initialisation(){
	score1 = 0;
	score2 = 0;
	score3 = 0;
}

initialisation();


const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	if(message.innerText === "You lose!"){
		score3 += 1;
		document.querySelector("#s3").innerHTML = score3;
		if( button.innerText === "OFF"){
			function Restart(){
				z.play();
			}
			Restart();
		} else {
			z.muted = true;
		}
		document.querySelector(".endgame").style.display = "none";
		origBoard = Array.from(Array(9).keys());
		for (var i = 0; i < cells.length; i++) {
			cells[i].innerText = '';
			cells[i].style.removeProperty('background-color');
			cells[i].addEventListener('click', turnClick, false);
		}
	} else if(message.innerText === "Tie Game!") {
		score2 += 1;
		document.querySelector("#s2").innerHTML = score2;
		if( button.innerText === "OFF"){
			function Restart(){
				z.play();
			}
			Restart();
		} else {
			z.muted = true;
		}
		document.querySelector(".endgame").style.display = "none";
		origBoard = Array.from(Array(9).keys());
		for (var i = 0; i < cells.length; i++) {
			cells[i].innerText = '';
			cells[i].style.removeProperty('background-color');
			cells[i].addEventListener('click', turnClick, false);
		}
	} else {
		if( button.innerText === "OFF"){
			function Restart(){
				z.play();
			}
			Restart();
		} else {
			z.muted = true;
		}
		document.querySelector(".endgame").style.display = "none";
		origBoard = Array.from(Array(9).keys());
		for (var i = 0; i < cells.length; i++) {
			cells[i].innerText = '';
			cells[i].style.removeProperty('background-color');
			cells[i].addEventListener('click', turnClick, false);
		}
	}
	}
	

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id , huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!");
	var winner = gameWon.player;
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	message.innerText = who;
	if( button.innerText === "OFF"){
		function gameover(){
			y.play();
		}
		gameover();
	} else {
		y.muted = true;
	}
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function tiescore() {
	score2.innerText += 1;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}



function playpause() {
	if(button.innerText === "OFF"){
		x.muted = true;
		y.muted = true;
		z.muted = true;
		button.innerText = "ON"
	} else if(button.innerText === "ON") {
		button.innerText = "OFF";
		repeat();
	}
}

function repeat(){
	x.muted = false;
	y.muted = false;
	z.muted = false;
}

function playAudio() { 
	if(button.innerText === "OFF"){
		x.play();
	} else if (button.innerText === "ON") {
		x.muted = true;
	}
  } 


