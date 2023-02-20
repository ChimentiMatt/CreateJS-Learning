var stage, w, h, loader;
var sky, knight, ground, hill, hill2;

function init() {
	
	stage = new createjs.StageGL("testCanvas");

	// grab canvas width and height for later calculations:
	w = stage.canvas.width;
	h = stage.canvas.height;

	manifest = [
        {src: "runandattack.png", id: "knight"},
	];

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);

    loader.loadManifest(manifest, true, "./assets/");
}

function handleComplete() {

	var spriteSheet = new createjs.SpriteSheet({
			images: [loader.getResult("knight")],
            framerate: 15,
			frames: [
				[1, 1, 63, 67, 0, -15, -10],
				[1, 70, 56, 46, 0, -7, -19],
				[59, 70, 37, 46, 0, -32, -19],
				[66, 1, 56, 65, 0, -32, 0],
				[98, 68, 56, 47, 0, -7, -18],
				[124, 1, 37, 62, 0, -30, -3],
				[156, 65, 36, 51, 0, -25, -16],
				[163, 1, 34, 51, 0, -27, -17],
				[194, 54, 34, 51, 0, -27, -16],
				[199, 1, 34, 51, 0, -27, -15],
				[230, 54, 32, 51, 0, -29, -18],
				[235, 1, 31, 51, 0, -31, -18],
				[264, 54, 31, 51, 0, -30, -17],
				[268, 1, 30, 51, 0, -31, -17],
				[300, 1, 37, 50, 0, -30, -15],
				[300, 53, 37, 50, 0, -30, -15]
			],
            
            animations: {
                run: { "frames": [7, 6, 10, 13, 8, 9, 11, 12] },
				attack: {"frames": [2, 3, 5, 14, 15, 0, 1, 4] , next: "run"
				}
            },
		});
        knight = new createjs.Sprite(spriteSheet, "run");
        knight.y = 35;

	stage.addChild(knight);

	// stage.addEventListener("stagemousedown", attack);
	window.addEventListener("keydown", movement);

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	// knight.x = 100;
	// knight.y = 200;

	stage.update(event);
}

function movement(event) {
	let newX = knight.x + 10
	console.log(event)
	if (event.key === "ArrowRight"){
		createjs.Tween.get(knight, {override: true}).to({ x: newX}, 100)

        createjs.Ticker.addEventListener("tick", stage);
	}
	else if (event.code === "Space"){
		attack()
	}
};

function attack() {
	knight.gotoAndPlay("attack");
}

