var stage, loader, flappy, pipeCreator, score, scoreText;
var started;
var hitbox;

function init() {
    stage = new createjs.Stage("gameCanvas");

    // the createjs way of doing update()
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", stage);

    var background = new createjs.Shape();
    background.graphics.beginLinearGradientFill(["#2573BB", "#6CB8DA", "#567A32"], [0, 0.85, 1], 0, 0, 0, 480)
    .drawRect(0, 0, 320, 480);
    background.x = 0;
    background.y = 0;
    background.name = "background";
    background.cache(0, 0, 320, 480);

    stage.addChild(background);

    // images
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
    started = false
    createClouds();
    createFlappy();
    createScore();
    jumpListener = stage.on("stagemousedown", jumpFlappy);
    createjs.Ticker.addEventListener("tick", checkCollision)
    hitbox = new createjs.Shape();
    stage.addChild(hitbox)
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
        var directionMultiplier = i % 2 == 0 ? -1 : 1; // if even backwards, else forward
        var originalX = clouds[i].x;
        createjs.Tween.get(clouds[i], { loop: true})
        .to({ x: clouds[i].x - (200 * directionMultiplier)}, 3000, createjs.Ease.getPowInOut(2))
        .to({ x: originalX }, 3000, createjs.Ease.getPowInOut(2))
        stage.addChild(clouds[i])
    }
}

function createFlappy() {
    flappy = new createjs.Bitmap(loader.getResult("flappy"))
    flappy.regX = flappy.image.width / 2;
    flappy.regY = flappy.image.height / 2;
    flappy.x = stage.canvas.width / 2;
    flappy.y = stage.canvas.height / 2;
    stage.addChild(flappy);
}

function jumpFlappy() {
    if (!started){
        startGame()
    }
    createjs.Tween.get(flappy, { override: true })
    .to({ y: flappy.y - 60, rotation: -10 }, 500, createjs.Ease.getPowOut(2))
    .to({ y: stage.canvas.height + (flappy.image.width / 2), rotation: 30 }, 1500, createjs.Ease.getPowIn(2))
    .call(gameOver) // call happens when previous tween finishes, or basically when Flappy hits the ground
}

function createPipes() {
    var topPipe, bottomPipe
    var position = Math.floor(Math.random() * 280 + 100)

    topPipe = new createjs.Bitmap(loader.getResult("pipe"));
    topPipe.y = position - 75;
    topPipe.x = stage.canvas.width + (topPipe.image.width /2)
    topPipe.rotation = 180;
    topPipe.name = "pipe";

    bottomPipe = new createjs.Bitmap(loader.getResult("pipe"));
    bottomPipe.y = position + 75;
    bottomPipe.x = stage.canvas.width + (bottomPipe.image.width /2)
    bottomPipe.skewY = 180; // mirrors the image
    bottomPipe.name = "pipe";

    topPipe.regX = bottomPipe.regX = topPipe.image.width / 2;

    createjs.Tween.get(topPipe).to({ x: 0 - topPipe.image.width}, 10000)
    .call(function() {removePipe(topPipe); })
    .addEventListener("change", updatePipe);

    createjs.Tween.get(bottomPipe).to({ x: 0 - bottomPipe.image.width}, 10000)
    .call(function() {removePipe(bottomPipe); });

    var scoreIndex = stage.getChildIndex(scoreText);
    
    // if no index specified use addChild()
    stage.addChildAt(bottomPipe, topPipe, scoreIndex);
}

function removePipe(pipe) {
    stage.removeChild(pipe);
}

function updatePipe(event) {
    var pipeUpdated = event.target.target;
    if ((pipeUpdated.x - pipeUpdated.regX + pipeUpdated.image.width) < (flappy.x - flappy.regX)){
        event.target.removeEventListener("change", updatePipe);
        incrementScore();
    }
}

function createScore() {
    score = 0;
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

function startGame() {
    started = true;
    createPipes();
    pipeCreator = setInterval(createPipes, 5000)
}

function checkCollision() {
    var leftX = flappy.x - flappy.regX + 5;
    var leftY = flappy.y - flappy.regY + 5;
    var points = [
        new createjs.Point(leftX, leftY),
        new createjs.Point(leftX + flappy.image.width - 10, leftY),
        new createjs.Point(leftX, leftY + flappy.image.height - 10),
        new createjs.Point(leftX + flappy.image.width -10, leftY + flappy.image.height -10)
    ];

    // draw hitbox for debugging
    // hitbox.graphics.clear().beginStroke("black");
    // hitbox.graphics.moveTo(points[0].x, points[0].y).lineTo(points[2].x, points[2].y).lineTo(points[3].x, points[3].y)
    // .lineTo(points[1].x, points[1].y).lineTo(points[0].x, points[0].y)

    for (var i = 0; i < points.length; i++){
        var objects = stage.getObjectsUnderPoint(points[i].x, points[i].y);
        if (objects.filter((object) => object.name == "pipe").length > 0){
            gameOver();
            return;
        }
    }
}

function gameOver() {
  createjs.Tween.removeAllTweens();
  stage.off("stagemousedown", jumpListener);
  clearInterval(pipeCreator);
  createjs.Ticker.removeEventListener("tick", checkCollision)
  setTimeout(function () {
    stage.on("stagemousedown", resetGame, null, true);
  }, 2000)
}

function resetGame() {
    var childrenToRemove = stage.children.filter((child) => child.name != "background");
    for (var i = 0; i < childrenToRemove.length; i++) {
        stage.removeChild(childrenToRemove[i])
    }
    handleComplete();
}