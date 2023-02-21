var stage, w, h, loader;
var sky, knight, ground, hill, hill2;
var pressedSpace = 0;
var pressedRight = 0;
var pressedLeft = 0;
var facing = "right";

function init() {
	
	stage = new createjs.StageGL("testCanvas");

	// grab canvas width and height for later calculations:
	w = stage.canvas.width;
	h = stage.canvas.height;

	manifest = [
        {src: "sprite.png", id: "knight"},
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
				//
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
				"attack": { "frames": [0, 1, 2, 3, 4, 5, 6, 7], next: "idle" },
				"idle": { "frames":[8, 9, 10, 11]  },
				"run": { "frames": [12, 13, 14, 15, 16, 17, 18, 19] }
			},
	});
	knight = new createjs.Sprite(spriteSheet, "idle");
	knight.y = 400;
	knight.x = 250




	stage.addChild(knight);

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
			knight.x -= 100
		}
		facing = "right";	
		pressedRight = 1;
		knight.skewY = 0;
	}
	else if (cxc === 37 && knight.currentAnimation !== "attack"){
		if (facing === "right") {
			knight.x += 100
		}
		facing = "left";	
		pressedLeft = 1
		knight.skewY = 180;
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
		if (knight.currentAnimation !== "attack"){
			knight.gotoAndPlay("attack");
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