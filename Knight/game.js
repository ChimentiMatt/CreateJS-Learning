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
        {src: "sprite.png", id: "knight"},
		{src: "slime.png", id: "slime"}
	];

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);

    loader.loadManifest(manifest, true, "./assets/");
}

function handleComplete() {

	var spriteSheet = new createjs.SpriteSheet({
			images: [loader.getResult("knight")],
            framerate: 5,
			frames: [
				// x, y, width, height, imageIndex*, regX*, regY*
				
				// attack
				[0, 0, 96, 80, 0, 0, 0],
				[96, 0, 96, 80, 0, 0, 0],
				[192, 0, 96, 80, 0, 0, 0],
				[288, 0, 96, 80, 0, 0, 0],
				[384, 0, 96, 80, 0, 0, 0],
				[480, 0, 96, 80, 0, 0, 0],
				[576, 0, 96, 80, 0, 0, 0],
				[672, 0, 96, 80, 0, 0, 0],
				// idle
				[768, 0, 63, 80, 0, 0, 0],
				[865, 0, 63, 80, 0, 0, 0],
				[962, 0, 63, 80, 0, 0, 0],
				[1059, 0, 63, 80, 0, 0, 0],
				// run
				[1152, 0, 80, 80, 0, 0, 0],
				[1248, 0, 80, 80, 0, 0, 0],
				[1344, 0, 80, 80, 0, 0, 0],
				[1440, 0, 80, 80, 0, 0, 0],
				[1536, 0, 80, 80, 0, 0, 0],
				[1632, 0, 80, 80, 0, 0, 0],
				[1728, 0, 80, 80, 0, 0, 0],
				[1824, 0, 80, 80, 0, 0, 0]
			],
        
			animations: {
				// , next: "idle"
				"attack": { "frames": [0, 1, 2, 3, 4, 5, 6, 7], next: "idle" },
				"idle": { "frames":[8, 9, 10, 11]  },
				"run": { "frames": [12, 13, 14, 15, 16, 17, 18, 19] }
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
