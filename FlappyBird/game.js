var stage, loader;

function init() {
    stage = new createjs.StageGL("gameCanvas");

    var background = new createjs.Shape();
    background.graphics.beginLinearGradientFill(["#2573BB", "#6CB8DA", "#567A32"], [0, 0.85, 1], 0, 0, 0, 480)
    .drawRect(0, 0, 320, 480);
    background.x = 0;
    background.y = 0;
    background.name = "background";
    background.cache(0, 0, 320, 480);

    stage.addChild(background);

    stage.update();


    // load images
    var manifest = [
        {"src": "cloud.png", "id": "cloud"},
        {"src": "flappy.png", "id": "flappy"},
        {"src": "pipe.png", "id": "pipe"},
    ];

    loader = new createjs.LoadQueue(true)
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "./img/");

}

function handleComplete() { 
    createClouds();
}

function createClouds() {

    var clouds = [];
    for (let i = 0; i < 3; i++) {
        clouds.push(new createjs.Bitmap(loader.getResult("cloud")))
    }

    clouds[0].x = 40;
    clouds[0].y = 40;
    clouds[1].x = 140;
    clouds[1].y = 70;    
    clouds[2].x = 100;
    clouds[2].y = 130;

    for (let i = 0; i < 3; i++) {
        stage.addChild(clouds[i])
    }

    stage.update()
}