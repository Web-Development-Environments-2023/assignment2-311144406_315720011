var context;

//Game Board
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var direction;

//DOM Control
var currElement;

//Log In and Registration
var users = {};
var username;
var password;
var fullName;
var email;
var birthDate;
var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

//Configurations
var keyUp;
var keyDown;
var keyLeft;
var keyRight;
var color60Ball;
var color30Ball;
var color10Ball;
var ballAmount;
var gameTime;
var mobAmount;



$(document).ready(function() {
	users["k"] = ["k", "K Mistirio", "K@kmail.kom", "1/1/90"];
	context = canvas.getContext("2d");
	currElement = document.getElementById("welcome");
	currElement.style.display = "block";
});

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	direction = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 1 && j == 1) ||
				(i == 1 && j == 2) ||
				(i == 1 && j == 3) ||
				(i == 1 && j == 4) ||
				(i == 1 && j == 6) ||
				(i == 1 && j == 7) ||
				(i == 1 && j == 8) ||

				(i == 3 && j == 1) ||
				(i == 3 && j == 2) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 3 && j == 6) ||
				(i == 3 && j == 7) ||
				(i == 3 && j == 8) ||

				(i == 5 && j == 1) ||
				(i == 5 && j == 2) ||
				(i == 5 && j == 3) ||
				(i == 5 && j == 4) ||
				(i == 5 && j == 5) ||
				(i == 5 && j == 6) ||
				(i == 5 && j == 7) ||
				(i == 5 && j == 9) ||

				(i == 6 && j == 2) ||
				(i == 7 && j == 2) ||
				(i == 8 && j == 2) ||

				(i == 7 && j == 4) ||
				(i == 8 && j == 4) ||
				(i == 9 && j == 4) ||
				(i == 7 && j == 6) ||
				(i == 8 && j == 6) ||
				(i == 8 && j == 7) ||
				(i == 8 && j == 8) ||
				(i == 7 && j == 8)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			switch(board[i][j]){
				case(2):{
					context.beginPath();
					context.arc(center.x, center.y, 30, (0.15 + 0.5*(direction - 1)) * Math.PI, (1.85 + 0.5*(direction - 1)) * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					
					if(direction % 2 == 1){
						context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
					}
					else{
						context.arc(center.x - 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
					}

					context.fillStyle = "black"; //color
					context.fill();
				}
				break;
				case(1):{
					context.beginPath();
					context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				}
				break;
				case(4):{
					context.beginPath();
					context.rect(center.x - 30, center.y - 30, 60, 60);
					context.fillStyle = "grey"; //color
					context.fill();
				}
				break;
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	switch(x){
		case(1):{
			direction = 4;
			if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
				shape.j--;
			}
		}
		break;
		case(2):{
			direction = 2;
			if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
				shape.j++;
			}
		}
		break;
		case(3):{
			direction = 3;
			if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
				shape.i--;
			}
		}
		break;
		case(4):{
			direction = 1;
			if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
				shape.i++;
			}
		}
		break;
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}


}

function showWelcome() {
	currElement.style.display = "none";
	currElement = document.getElementById("welcome");
	currElement.style.display = "block";
}

function showRegistration() {
	currElement.style.display = "none";
	currElement = document.getElementById("register");
	currElement.style.display = "block";
}

function register(){
	username = document.getElementById("regUsername").value;
	password = document.getElementById("regPassword").value;
	fullName = document.getElementById("regFullName").value;
	email = document.getElementById("regEmail").value;
	birthDate = document.getElementById("refBirthDate").value;

	if(username == '' || password == '' || fullName == '' || email == '' || birthDate == ''){
		alert("Please enter all fields");
	}
	else if(users[username] != null){
		alert("Username already exists");
	}
	else if(password.length < 6 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)){
		alert("Password must be 6 characterslong and contain both numbers and letters");
	}
	else if(/\d/.test(fullName)){
		alert("Name cannot contain numbers");
	}
	else if(!emailRegex.test(email)){
		alert("Invalid email address");
	}
	else{
		users[username] = [password, fullName, email, birthDate];
		alert("User succesfully created");
		showLogIn();
	}
}

$(document).ready(function() {
						  
	$(function() {
		$( "#refBirthDate" ).datepicker();
	});
})

function showLogIn() {
	currElement.style.display = "none";
	currElement = document.getElementById("login");
	currElement.style.display = "block";
}

function login(){
	username = document.getElementById("logUsername").value;
	password = document.getElementById("logPassword").value;
	if(username == '' || password == ''){
		alert("Please enter all fields");
	}
	else if(users[username] == null || users[username][0] != password){
		alert("Invalid Username or Password");
	}
	else{
		fullName = users[username][1];
		email = users[username][2];
		birthDate = users[username][3];
		showConfig();
	}
}

function showConfig(){
	color60Ball = "yellow";
	color30Ball = "red";
	color10Ball = "black";
	keyUp;
	keyDown;
	keyLeft;
	keyRight;
	
	currElement.style.display = "none";
	currElement = document.getElementById("config");
	currElement.style.display = "block";
}

function changeKeyUp(){

}

function changeKeyDwon(){
	
}

function changeKeyLeft(){
	
}

function changeKeyRight(){
	
}

function changeColor60(){
	
}

function changeColor30(){
	
}

function changeColor10(){
	
}

function RandomConfig(){
	
}


function saveConfig(){
	ballAmount = document.getElementById("ballAmount").value;
	gameTime = document.getElementById("gameTime").value;
	mobAmount = document.getElementById("mobAmount").value;
	showGame();
}




function showGame(){
	currElement.style.display = "none";
	currElement = document.getElementById("game");
	currElement.style.display = "block";
	Start();

}



function openAbout() {
	document.getElementById("About").showModal();
}

function closeAbout() {
	document.getElementById("About").close();
}

