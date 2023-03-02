var stage, canvas, w, h, loader;
var knight, slime, scoreText;
var score = 0;
var pressedSpace = 0;
var pressedRight = 0;
var pressedLeft = 0;
var pressedUp = 0;
var leftOffset = 100;
var knightWidth = 80;
var knightHeight = 66;
var facing = "right";
var falling = false
var enemies = []
var platformsArray = []

var color = 0xFFFFFF;
var lineThickness = 1;
var healthBar = new createjs.Shape();
var dead = false;
var invincible = false;
var totalHealth = 500;

function init() {
	canvas = document.getElementById("testCanvas")
	stage = new createjs.Stage("testCanvas");
	// stage.setClearColor("#4ACFF1");

	// grab canvas width and height for later calculations:
	w = stage.canvas.width;
	h = stage.canvas.height;

	manifest = [
        {src: "v1.png", id: "knight"},
		{src: "slime.png", id: "slime"}
	];

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);

    loader.loadManifest(manifest, true, "./assets/");
	createScore()
	createHeathBar()
	generatePlatforms()
}

function handleComplete() {
	makeSprites()

	stage.addChild(knight, healthBar);

	for (let i = 0; i < platformsArray.length; i++){
		stage.addChild(platformsArray[i])
	}

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	
	createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.addEventListener("tick", tick);
	slimeMovement()
    stage.update();
}




function tick(event) {
	if (!dead){
		takeDamageOnCollision()
		attack()
		idle()
		run()
		jump()
	}
	stage.update(event);

	gravity()


}

function keyPressed(e) {
	cxc = e.keyCode;

	// Right Arrow
	if (cxc === 39 && knight.currentAnimation !== "attack"){
		if (facing === "left") {
			knight.x -= knightWidth
		}
		facing = "right";	
		pressedRight = 1;
		knight.scaleX = 1
	}
	// Left Arrow
	else if (cxc === 37 && knight.currentAnimation !== "attack"){
		if (facing === "right") {
			knight.x += knightWidth
		}
		facing = "left";	
		pressedLeft = 1
		knight.scaleX = -1
	}
	// Up Arrow || Jump
	else if (cxc === 38){
		pressedUp = 1
	}
	// Space bar || attack
	else if (cxc === 32){
		pressedSpace = 1
	}
}

function keyUp(e){
	cxc = e.keyCode;
	// console.log(cxc)

	// Right Arrow
	if (cxc === 39){
		pressedRight = 0;
	}
	// Left Arrow
	else if (cxc === 37){
		pressedLeft = 0;
	}
	else if (cxc === 38){
		pressedUp = 0
	}
	// Space bar
	else if (cxc === 32){
		pressedSpace = 0
	}
}

function run() {
	if (pressedRight === 1){
		pressedLeft = 0;

		// stops repeating of animation on continues run
		if (knight.currentAnimation !== "run" && knight.currentAnimation !== "jump" && knight.currentAnimation !== "fall" ){
			knight.gotoAndPlay("run");
		}
		// createjs.Tween.get(knight, {override: true}).to({ x: knight.x + 10}, 100)
		knight.x += 5;

        createjs.Ticker.addEventListener("tick", stage);
	}

	else if (pressedLeft === 1){
		pressedRight = 0;
		// stops repeating of animation on continues run
		if (knight.currentAnimation !== "run" && knight.currentAnimation !== "jump" && knight.currentAnimation !== "fall" ){
			knight.gotoAndPlay("run");
		}
		// createjs.Tween.get(knight, {override: true}).to({ x: knight.x - 10}, 100)
		knight.x -= 5

		createjs.Ticker.addEventListener("tick", stage);
	}
};

function jump() {
	if (pressedUp === 1 && knight.currentAnimation !== "jump") {
		if (knight.currentAnimation !== "fall"){

			pressedUp = 0;
			knight.gotoAndPlay("jump");
			
			createjs.Tween.get(knight, {override: true})
			.to({y: knight.y - 100}, 600, createjs.Ease.getPowInOut(2))
			.call(fall)
		
		};
	};
	function fall() {
		knight.gotoAndPlay("fall");
		createjs.Tween.get(knight, {override: true})
		.to({y: knight.y + 100}, 600)
		.call(idleCheck)
	};
};

function idleCheck() {
	if (!falling){
		knight.gotoAndPlay("idle");
	};
};


function attack() {
	if (pressedSpace === 1 && knight.currentAnimation !== "jump"){
		pressedSpace = 0
		if (knight.currentAnimation !== "attack" && knight.currentAnimation !== "fall"){
			knight.gotoAndPlay("attack");
			
			let collisionIndex = weaponHitCheck()
			if (collisionIndex !== undefined){
				incrementScore()
				stage.removeChild(enemies[collisionIndex])
				enemies.splice(collisionIndex, 1)
			}
		}
	};
};

function takeDamageOnCollision() {
	let collisionIndex = slimeCheckCollision()
	// if player should take damage
	if (collisionIndex !== undefined){

		// if play not invincible and health above 0
		if (!invincible && totalHealth > 0){
			totalHealth -= 50;
			healthBar.graphics.instructions[1].w = totalHealth;
			invincible = true;
			setTimeout(removeInvincible, 500);
			let moved = 0
			if (facing === "left") {
				moved = 10
			}
			else{
				moved = -10
			}
		
			createjs.Tween.get(knight, {override: true})
			.to({ x: knight.x + moved}, 100);

			knight.gotoAndPlay("damaged");
		}
		else if (totalHealth <= 0){
			dead = true;
			knight.y += 15
			knight.gotoAndPlay("dying")
			
		}


	};
	function removeInvincible () {
		invincible = false;
	};
};

function idle() {
	if (knight.currentAnimation === "run"){
		if (pressedRight === 0 && pressedLeft === 0){
			knight.gotoAndPlay("idle");
		}
	}
};

function slimeCheckCollision() {
	for (let i = 0; i < enemies.length; i++){
	
		if (facing === "right"){
			if (knight.x >= enemies[i].x - knightWidth && knight.x <= enemies[i].x){
				if(knight.y === 400){
					return i
				}
			}
		}
		else if (facing === "left"){
			if (knight.x - leftOffset >= enemies[i].x - knightWidth && knight.x - leftOffset <= enemies[i].x){
				if(knight.y === 400){
					return i
				}
			}
		}
	}	
};

function weaponHitCheck() {
	for (let i = 0; i < enemies.length; i++){
	
		if (facing === "right"){
			if (knight.x >= enemies[i].x - 110 && knight.x <= enemies[i].x){
				if(knight.y === 400){
					return i
				}
			}
		}
		else if (facing === "left"){
			if (knight.x - leftOffset >= enemies[i].x - knightWidth && knight.x - leftOffset <= enemies[i].x + 55){
				if(knight.y === 400){
					return i
				}
			}
		}
	}	
};


function slimeMovement() {
	for (let i = 0; i < enemies.length; i++){
		let movementRange = Math.floor(Math.random() * (200 + 100) - 100)

		createjs.Tween.get(enemies[i], {override: true, loop: true})
		.to({ x: enemies[i].x + movementRange}, 1000)
		.to({ x: enemies[i].x }, 1000);
	}
}

function createScore() {
    scoreText = new createjs.Text(score, "bold 48px Arial", "#FFFFFF");
    scoreText.textAlign = "center";
    scoreText.textBaseline = "middle";
    scoreText.x = 40;
    scoreText.y = 40;
    var bounds = scoreText.getBounds();
    scoreText.cache(-40, -40, bounds.width * 3 + Math.abs(bounds.x), bounds.height + Math.abs(bounds.y));

    scoreTextOutline = scoreText.clone();
    scoreTextOutline.color = "#000000";
    scoreTextOutline.outline = 2;
    bounds = scoreTextOutline.getBounds();
    scoreTextOutline.cache(-40, -40, bounds.width * 3 + Math.abs(bounds.x), bounds.height + Math.abs(bounds.y));

    stage.addChild(scoreText, scoreTextOutline);
}

function incrementScore() {
    score++;
    scoreText.text = score;
    scoreTextOutline.text = score;
    scoreText.updateCache();
    scoreTextOutline.updateCache();
}

function makeSprites() {
	var spriteSheet = new createjs.SpriteSheet({
		images: [loader.getResult("knight")],
		framerate: 6,
		// x, y, width, height, imageIndex*, regX*, regY*
		"frames": [
			[0, 0, 96, 80, 0, 0, 0],
			[96, 0, 96, 80, 0, 0, 0],
			[192, 0, 96, 80, 0, 0, 0],
			[288, 0, 96, 80, 0, 0, 0],
			[384, 0, 96, 80, 0, 0, 0],
			[480, 0, 96, 80, 0, 0, 0],
			[576, 0, 96, 80, 0, 0, 0],
			[672, 0, 96, 80, 0, 0, 0],
			// dead
			[768, 0, 80, 54, 0, 0, 0],
			[864, 0, 80, 54, 0, 0, 0],
			[960, 0, 80, 54, 0, 0, 0],
			[1056, 0, 80, 54, 0, 0, 0],
			// run
			[1152, 0, 80, 54, 0, 0, 0],
			[0, 80, 80, 54, 0, 0, 0],
			[96, 80, 80, 54, 0, 0, 0],
			[192, 80, 80, 54, 0, 0, 0],
			// idle
			[288, 80, 63, 80, 0, 0, 0],
			[385, 80, 63, 80, 0, 0, 0],
			[482, 80, 63, 80, 0, 0, 0],
			[579, 80, 63, 80, 0, 0, 0],
			// jump
			[672, 80, 64, 64, 0, 0, 0],
			[768, 80, 64, 64, 0, 0, 0],
			[864, 80, 64, 64, 0, 0, 0],
			[960, 80, 64, 64, 0, 0, 0],
			[1056, 80, 64, 64, 0, 0, 0],
			[1152, 80, 64, 64, 0, 0, 0],
			[0, 160, 64, 64, 0, 0, 0],
			[96, 160, 64, 64, 0, 0, 0],
			[192, 160, 64, 64, 0, 0, 0],
			[288, 160, 64, 64, 0, 0, 0],
			[384, 160, 64, 64, 0, 0, 0],
			[480, 160, 80, 80, 0, 0, 0],
			[576, 160, 80, 80, 0, 0, 0],
			[672, 160, 80, 80, 0, 0, 0],
			[768, 160, 80, 80, 0, 0, 0],
			[864, 160, 80, 80, 0, 0, 0],
			[960, 160, 80, 80, 0, 0, 0],
			[1056, 160, 80, 80, 0, 0, 0],
			[1152, 160, 80, 80, 0, 0, 0]
		],
	
		animations: {
			// , next: "idle"
			"attack": { "frames": [0, 1, 2, 3, 4, 5, 6, 7], next: "idle" },
			"dying": { "frames": [8, 9, 10, 11, 12, 13, 14, 15], next: "dead" },
			"dead": { "frames": [15] },
			"idle": { "frames": [16, 17, 18, 19] },
			"jump": { "frames": [20, 21, 22, 23, 24, 25, 25, 25, 25, 25]},
			"fall": { "frames": [25]},
			"land": { "frames": [26, 27, 28, 29, 30], next: "idle" },
			"run": { "frames": [31, 32, 33, 34, 35, 36, 37, 38]  },
			"damaged": {"frames": [24, 24], next: "idle"}
		},
	});

	knight = new createjs.Sprite(spriteSheet, "idle");
	knight.y = 400;
	knight.x = 250

	var slimeSpriteSheet = new createjs.SpriteSheet({
		images: [loader.getResult("slime")],
		framerate: 5,
		frames: [
			[1, 1, 16, 12, 0, 0, -4],
			[1, 15, 16, 11, 0, 0, -5],
			[19, 1, 16, 11, 0, 0, -5],
			[19, 14, 14, 12, 0, -1, -4]
		],
		animations: {
			"slime": { "frames": [1, 2, 3, 0] }
		},
	})

	for (let i = 0; i < 2; i++){
		slime = new createjs.Sprite(slimeSpriteSheet, "slime");
		slime.y = 432;
		slime.x = Math.floor(Math.random() * ( 600 - 200)) + 200;
		slime.scaleY = 2
		slime.scaleX = 2
		enemies.push(slime)
	};

	for (let i = 0; i < enemies.length; i++){
		stage.addChild(enemies[i]);
	};
};

function gravity() {

	loopPlatforms()
};

function loopPlatforms() {
	let i = 0
	for (i = 0; i < platformsArray.length; i++){

		coordinates = { 
			lineTo : {x: platformsArray[i].graphics._instructions[2].x, y: platformsArray[i].graphics._instructions[1].y},
			moveTo : {x: platformsArray[i].graphics._instructions[1].x, y: platformsArray[i].graphics._instructions[2].y},
			id: i
		}

		if (edgeCheck(coordinates)){
			if (platformCheck(coordinates)){
				falling = true
			}
	
		}
	}

	for (let j = 0; j < platformsArray.length; j++){
		if (j ===i) {
			continue
		}
		if (platformCheck(coordinates) ){
			
			falling = false
			if (edgeCheck(coordinates)){
				falling = true
			}
		}
	}

	if (falling){
		// knight.y += 3
		knight.gotoAndPlay("fall")
		createjs.Tween.get(knight, {override: true})
		.to({y: knight.y + 10}, 65)
		.call(idleCheck)
		

	}
}


// Need rebuilding

// Loop over all edges. return true only if knight is between the x min and x max and a small amount of height for the platform
// then, in a different function, if this returned false, have knight fall  

function edgeCheck(coordinates) {
	let checkResults = false

	if (facing === "left"){

		// if beyond left edge or beyond line y
		if (knight.x < coordinates.lineTo.x + 30 || knight.y + knightHeight > coordinates.lineTo.y + lineThickness ){
			checkResults = true
		}
	}
	else if (facing === "right"){
		if (knight.x > coordinates.moveTo.x - 30  || knight.y + knightHeight > coordinates.lineTo.y + lineThickness ){
			checkResults = true
		}
	}
	// return false if no checks pass
	return checkResults
}

function platformCheck(coordinates) {
	let checkResults = false

	if (knight.y + knightHeight - coordinates.moveTo.y > -10 && knight.y + knightHeight - coordinates.moveTo.y < 10)
	{
		checkResults = true
	}

	// returns false if not near top of platform
	return 	checkResults
}


function generatePlatforms(){
	var startX =  200
	var startY = 465;
	var lineWidth = 500;

	let line = new createjs.Shape();

	line.graphics.setStrokeStyle(lineThickness);
	line.graphics.beginStroke(color);
	line.graphics.moveTo(startX + lineWidth, startY);

	line.graphics.lineTo(startX, startY);
	line.graphics.endStroke();
	platformsArray.push(line)

	// hard coded while debugging 
	let line2 = new createjs.Shape();

	line2.graphics.setStrokeStyle(lineThickness);
	line2.graphics.beginStroke(color);
	line2.graphics.moveTo(50 + lineWidth, 800);

	line2.graphics.lineTo(50, 800);
	line2.graphics.endStroke();
	platformsArray.push(line2)
}


function createHeathBar() {
	healthBar.graphics.beginFill('red');
	healthBar.graphics.drawRect(200, 30, totalHealth, 10);
	healthBar.graphics.endFill();
};
  