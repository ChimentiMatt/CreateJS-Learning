var stage, w, h, loader;
var sky, knight, ground, hill, hill2;

function init() {

	stage = new createjs.StageGL("testCanvas");

	// grab canvas width and height for later calculations:
	w = stage.canvas.width;
	h = stage.canvas.height;

	manifest = [
        {src: "run.png", id: "knight"},
	];

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "./assets/");
}

function handleComplete() {

	var spriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("knight")],
            "framerate": 20,
            "frames": [
                [1, 1, 36, 51, 0, -25, -16],
                [39, 1, 34, 51, 0, -27, -17],
                [75, 1, 34, 51, 0, -27, -16],
                [111, 1, 34, 51, 0, -27, -15],
                [147, 1, 32, 51, 0, -29, -18],
                [181, 1, 31, 51, 0, -31, -18],
                [214, 1, 31, 51, 0, -30, -17],
                [247, 1, 30, 51, 0, -31, -17]
            ],
            
            "animations": {
                "newRun": { "frames": [1, 0, 4, 7, 2, 3, 5, 6] }
            },
		});
        knight = new createjs.Sprite(spriteSheet, "newRun");
        knight.y = 35;

	stage.addChild(knight);

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
}


function tick(event) {
	var deltaS = event.delta / 1000;

	// var grantW = grant.getBounds().width * grant.scaleX;
	// grant.x = (position >= w + grantW) ? -grantW : position;


	knight.x = 100;
	knight.y = 200;

	stage.update(event);
}
