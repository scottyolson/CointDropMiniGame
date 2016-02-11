COINGAME.levelThree = {};

COINGAME.levelThree.init = function() {
    //these are used for creating new coins after the clock is clicked
    var US = 8,
            Roman = 2,
            Canada = 3;

    var coins = [];
    ///add coins to an array to shift through in particle system
    coins.push({
        img: COINGAME.images['images/Clock.png'],
        size: 50,
        value: 0
    });
    for (i = 0; i < 15; i++)
        coins.push({
            img: COINGAME.images['images/Coin-US-Dollary.png'],
            size: 70,
            value: 10
        });
    for (i = 0; i < 10; i++)
        coins.push({
            img: COINGAME.images['images/Coin-Canadian-Dollar.png'],
            size: 90,
            value: -1
        });
    for (var i = 0; i < 4; i++)
        coins.push({
            img: COINGAME.images['images/Coin-Roman.png'],
            size: 50,
            value: 50
        });

    COINGAME.textures.coinDropSystem = coinDropSystem({
        image: COINGAME.images['images/Dollar-Sign.png'],
        size: {mean: 50, stdev: 0},
        center: {x: 500, y: 0},
        speed: {mean: 3, stdev: 2},
        lifetime: {mean: 5, stdev: 1},
        moveRate: 10
    },
    COINGAME.graphics
            );

    // Particle system for dollar signs
    COINGAME.dollarParticleSpec = {
        image: COINGAME.images['images/Dollar-Sign.png'],
        center: {x: 300, y: 300},
        speed: {mean: 100, stdev: 25},
        lifetime: {mean: 1, stdev: 1}
    };

    var dollarParticles = particleSystem(COINGAME.dollarParticleSpec, COINGAME.graphics);

    //add mouse listeners
    //
    var mouseClick = false;
    var mouse = COINGAME.input.Mouse();

    mouse.registerCommand('mousedown', function(e, elapsedTime) {
        mouseClick = true;
        //find what was clicked
        //offset logic found at http://stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas
        var mouseX, mouseY;
        if (e.offsetX) {
            mouseX = e.offsetX;
            mouseY = e.offsetY;
        }
        else if (e.layerX) {
            mouseX = e.layerX;
            mouseY = e.layerY;
        }
        ///find if mouse x and y are in any radii'
        COINGAME.textures.coinDropSystem.findParticle(mouseX, mouseY);
    });

    mouse.registerCommand('mouseup', function(e, elapsedTime) {
        mouseClick = false;
    });

    //update the game varialbles
    //
    COINGAME.levelThree.update = function(elapsedTime, mouse) {
        mouse.update(elapsedTime);
        if (!COINGAME.textures.clock.done()) {
            COINGAME.textures.clock.update(performance.now());
        }
        else {
            COINGAME.textures.coinDropSystem.update(elapsedTime / 1000);
            var coinIndex = Random.nextRandomIndex(coins);
            var randInt = Random.nextRandomInt(200, 300);
            //only create coins every certain number of seconds seconds    
            if (Math.floor(COINGAME.prevTime - COINGAME.startTime) % randInt > 0 && Math.floor(COINGAME.prevTime - COINGAME.startTime) % randInt < 8 && coins.length > 0) {
                COINGAME.textures.coinDropSystem.moveOver(elapsedTime);
                COINGAME.startTime = COINGAME.prevTime;
                COINGAME.textures.coinDropSystem.create(coins, coinIndex);
            }
            if (COINGAME.addCoinsBool) {
                console.log(coins.length)
                COINGAME.addCoins(coins, US, Canada, Roman);
                console.log(coins.length);
                COINGAME.addCoinsBool = false;
            }
            if (COINGAME.hitCount > 0) {
                for (var i = 0; i < 5; i++)
                    dollarParticles.create();
                COINGAME.hitCount = 0;
            }
            if (COINGAME.textures.coinDropSystem.noMoreParticles() && coins.length < 1)
                COINGAME.levelThree.play = false;
            dollarParticles.update(elapsedTime / 1000);
        }
    };

    //render game variables
    //    
    COINGAME.levelThree.render = function(elapsedTime) {
        COINGAME.graphics.clear();
        if (!COINGAME.textures.clock.done())
            COINGAME.textures.clock.draw();

        COINGAME.textures.pigTexture.draw();
        COINGAME.textures.score.draw();
        COINGAME.textures.coinDropSystem.render();
        dollarParticles.render();
    };

    //level one game loop
    function gameLoop(time) {
        var elapsedTime = (time - COINGAME.prevTime);
        COINGAME.prevTime = time;

        COINGAME.levelThree.update(elapsedTime, mouse);
        COINGAME.levelThree.render(elapsedTime);
        //once coins.length and particles object are empty you can move to next level or redo level if score is less than 100
        if (COINGAME.levelThree.play) {
            requestAnimationFrame(gameLoop);
        }
        else {
            //move to new level or replay level
            if (COINGAME.totalScore.text >= 100) {
                COINGAME.textures.gameOver = COINGAME.graphics.Text({
                    text: 'Game Over, refresh for new game',
                    font: '60px Arial, sans-serif',
                    fill: 'rgba(250, 0, 0, 1)',
                    stroke: 'rgba(255, 0, 0, 1)',
                    pos: {x: 10, y: 100},
                    rotation: 0

                });
                COINGAME.textures.gameOver.draw();
            }
            else
                COINGAME.levelThree.init();
        }
    }
    ;

    //initialize gameplay variables
    setTimeout(function() {
        var levelThree = COINGAME.graphics.Text({
            text: 'LEVEL 3!',
            font: '90px Arial, sans-serif',
            fill: 'rgba(150, 0, 0, 1)',
            stroke: 'rgba(255, 0, 0, 1)',
            pos: {x: 450, y: 300},
            rotation: 0
        });
        levelThree.draw();
    }, 3000);

    COINGAME.createCountdown();
    COINGAME.prevTime = performance.now();
    COINGAME.startTime = COINGAME.prevTime;
    COINGAME.levelThree.play = true;
    COINGAME.levelThree.score = 0;
    COINGAME.addCoinsBool = false;
    COINGAME.hitCount = 0;
    requestAnimationFrame(gameLoop);
};