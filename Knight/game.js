var stage, w, h, loader;
var sky, knight, slime;
var pressedSpace = 0;
var pressedRight = 0;
var pressedLeft = 0;
var leftOffset = 100;
var knightWidth = 80;
var facing = "right";

function init() {
	
	stage = new createjs.StageGL("testCanvas");

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
}

function handleComplete() {
	console.log()

	var spriteSheet = new createjs.SpriteSheet({
			images: [loader.getResult("knight")],
            framerate: 5,
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
				"dead": { "frames": [8, 9, 10, 11, 12, 13, 14, 15] },
				"idle": { "frames": [16, 17, 18, 19]  },
				"jump": { "frames": [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
				"run": { "frames": [31, 32, 33, 34, 35, 36, 37, 38]  }
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
	slime = new createjs.Sprite(slimeSpriteSheet, "slime");
	slime.y = 430;
	slime.x = 350
	slime.scaleY = 2
	slime.scaleX = 2
	console.log(slime)


	stage.addChild(knight, slime);

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	stage.update(event);

	attack()
	idle()
	run()

}

function keyPressed(e) {
	cxc = e.keyCode;

	if (cxc === 39 && knight.currentAnimation !== "attack"){
		if (facing === "left") {
			knight.x -= knightWidth
		}
		facing = "right";	
		pressedRight = 1;
		// knight.skewY = 0;
		knight.scaleX = 1
	}
	else if (cxc === 37 && knight.currentAnimation !== "attack"){
		if (facing === "right") {
			knight.x += knightWidth
		}
		facing = "left";	
		pressedLeft = 1
		// knight.skewY = 180;
		knight.scaleX = -1
	}
	else if (cxc === 32){
		pressedSpace = 1
	}
}

function keyUp(e){
	cxc = e.keyCode;
	// Right Arrow
	if (cxc === 39){
		pressedRight = 0;
	}
	// Left Arrow
	else if (cxc === 37){
		pressedLeft = 0;
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
		if (knight.currentAnimation !== "run"){
			knight.gotoAndPlay("run");
		}
		createjs.Tween.get(knight, {override: true}).to({ x: knight.x + 10}, 100)

        createjs.Ticker.addEventListener("tick", stage);
	}

	else if (pressedLeft === 1){
		pressedRight = 0;
		// stops repeating of animation on continues run
		if (knight.currentAnimation !== "run"){
			knight.gotoAndPlay("run");
		}

		createjs.Tween.get(knight, {override: true}).to({ x: knight.x - 10}, 100)

		createjs.Ticker.addEventListener("tick", stage);
	}
};

function attack() {
	if (pressedSpace === 1){
		pressedSpace = 0
		if (knight.currentAnimation !== "attack"){
			knight.gotoAndPlay("attack");
			checkCollision()
		}

	}
};

function idle() {
	if (knight.currentAnimation === "run"){
		if (pressedRight === 0 && pressedLeft === 0){

			knight.gotoAndPlay("idle");
		}
	}
}

function checkCollision() {
	if (facing === "right"){
		if (knight.x >= slime.x - knightWidth && knight.x <= slime.x){
			console.log('hit')
		}
	}
	else if (facing === "left"){
		if (knight.x - leftOffset >= slime.x - knightWidth && knight.x - leftOffset <= slime.x){
			console.log('hit')
		}
	}

}
