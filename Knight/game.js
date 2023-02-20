var stage, w, h, loader;
var sky, knight, ground, hill, hill2;
var pressedSpace = 0
var pressedRight = 0;

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
				[0, 0, 30, 51, 0, -31, -17],
				[30, 0, 31, 51, 0, -31, -18],
				[61, 0, 31, 51, 0, -30, -17],
				[92, 0, 32, 51, 0, -29, -18],
				[0, 51, 37, 46, 0, -32, -19],
				[37, 51, 34, 51, 0, -27, -17],
				[71, 51, 34, 51, 0, -27, -16],
				[0, 102, 34, 51, 0, -27, -15],
				[34, 102, 36, 51, 0, -25, -16],
				[70, 102, 37, 50, 0, -30, -15],
				[0, 153, 37, 50, 0, -30, -15],
				[37, 153, 37, 50, 0, -20, -15],
				[74, 153, 37, 50, 0, -21, -15],
				[0, 203, 37, 50, 0, -23, -15],
				[37, 203, 37, 51, 0, -22, -14],
				[74, 203, 37, 62, 0, -30, -3],
				[0, 265, 56, 46, 0, -7, -19],
				[56, 265, 56, 47, 0, -7, -18],
				[0, 312, 56, 65, 0, -32, 0],
				[56, 312, 63, 67, 0, -15, -10]
			],
        
			animations: {
				"run": { "frames": [5, 8, 3, 0, 6, 7, 1, 2]},
				"attack": { "frames": [4, 18, 15, 9, 10, 19, 16, 17] , next: "idle"},
				"idle": { "frames": [11, 12] }
			},
		});
        knight = new createjs.Sprite(spriteSheet, "idle");
        knight.y = 400;

	stage.addChild(knight);

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	stage.update(event);
	run()
	attack()
	idle()
}

function keyPressed(e) {
	cxc = e.keyCode;
	console.log(cxc)
	if (cxc === 39){
		pressedRight = 1;
	}
	else if (cxc === 32){
		pressedSpace = 1
	}
}

function keyUp(e){
	cxc = e.keyCode;
	if (cxc === 39){
		pressedRight = 0;
	}
	else if (cxc === 32){
		pressedSpace = 0
	}
}

function run() {
	if (pressedRight === 1){
		// stops repeating of animation on continues run
		if (knight.currentAnimation !== "run"){
			knight.gotoAndPlay("run");
		}
		createjs.Tween.get(knight, {override: true}).to({ x: knight.x + 10}, 100)

        createjs.Ticker.addEventListener("tick", stage);
	}

}

function attack() {
	if (pressedSpace === 1){
		if (knight.currentAnimation !== "Space"){
			knight.gotoAndPlay("attack");
		}
	}
};

function idle() {
	if (knight.currentAnimation === "run" && pressedRight === 0){
		knight.gotoAndPlay("idle");
	}
}