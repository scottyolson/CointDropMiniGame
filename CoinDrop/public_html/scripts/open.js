/* 
 *By: Scott Olson
 *Date: Feb. 17, 2014
 */

COINGAME.playSound = function() {
    var sound = new Audio('sounds/beep-08b.mp3');
    sound.play();
};

COINGAME.playCashSound = function() {
    var sound = new Audio('sounds/CashRegisterSound.mp3');
    sound.play();
};

COINGAME.playLevelUp = function() {
    var sound = new Audio('sounds/LevelUP.wav');
    sound.play();
};

COINGAME.playBuzzer = function() {
    var sound = new Audio('sounds/Buzzer.mp3');
    sound.play();
};

COINGAME.update = function(elapsedTime, mouse) {
    mouse.update(elapsedTime);
};

COINGAME.render = function(elapsedTime) {
    COINGAME.graphics.clear();

    COINGAME.textures.pigTexture.draw();
    COINGAME.textures.score.draw();
    //COINGAME.textures.startButton.draw();
};

COINGAME.initialize = function() {
    'use strict';
    console.log('coin game initializing...');
    //add mouse listener
    //
    var mouseClick = false;
    var mouse = COINGAME.input.Mouse();

    mouse.registerCommand('mousedown', function(e, elapsedTime) {
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
        if(COINGAME.inCircle(startSpecs.center.x, startSpecs.center.y, mouseX, mouseY, startSpecs.width/2)){
            COINGAME.graphics.clear();
            COINGAME.levelOne.init();
            play = true;
        }
        if(COINGAME.inCircle(creditSpecs.center.x, creditSpecs.center.y, mouseX, mouseY, creditSpecs.width/2))
            COINGAME.textures.credits.draw();
        mouseClick = true;
    });

    mouse.registerCommand('mouseup', function(e, elapsedTime) {
        mouseClick = false;
        //find what was clicked
    });

    COINGAME.update = function(elapsedTime, mouse) {
        //if start clicked then  start game   COINGAME.levelOne.init();
        mouse.update(elapsedTime);
    };

    COINGAME.render = function(elapsedTime) {
        COINGAME.textures.startButton.draw();
        COINGAME.textures.creditsButton.draw();
    };

    //Game loop
    function gameLoop(time) {
        var elapsedTime = (time - COINGAME.prevTime);
        COINGAME.prevTime = time;

        COINGAME.update(elapsedTime, mouse);
        COINGAME.render(elapsedTime);
        if(!play)
            requestAnimationFrame(gameLoop);
    }
    ;

    COINGAME.textures.pigTexture = COINGAME.graphics.Texture({
        image: COINGAME.images['images/Piggy-Bank.png'],
        center: {x: 850, y: 50},
        width: 100, height: 100,
        rotation: 0,
        moveRate: 100,
        rotateRate: 3.14159
    });//note to self, what is inside the {} is the spec on the texture call

    var startSpecs = {
        image: COINGAME.images['images/green-start-button.png'],
        center: {x: 450, y: 300},
        width: 100, height: 100,
        rotation: 0,
        moveRate: 0,
        rotateRate: 3.14159
    };
    
    var creditSpecs = {
        image: COINGAME.images['images/credits_button.jpg'],
        center: {x: 450, y: 400},
        width: 100, height: 50,
        rotation: 0,
        moveRate: 0,
        rotateRate: 0
    };

    COINGAME.textures.startButton = COINGAME.graphics.Texture(startSpecs);
    COINGAME.textures.creditsButton = COINGAME.graphics.Texture(creditSpecs);

    COINGAME.totalScore = {
        text: 0,
        font: '40px Arial, sans-serif',
        fill: 'rgba(250, 0, 0, 1)',
        stroke: 'rgba(255, 0, 0, 1)',
        pos: {x: 800, y: 100},
        rotation: 0

    };
    
    COINGAME.textures.credits = COINGAME.graphics.Text({
        text: 'By: Scott Olson',
        font: '60px Arial, sans-serif',
        fill: 'rgba(250, 0, 0, 1)',
        stroke: 'rgba(255, 0, 0, 1)',
        pos: {x: 450, y: 100},
        rotation: 0

    });

    COINGAME.textures.score = COINGAME.graphics.Text(COINGAME.totalScore);
    var play = false;
    COINGAME.prevTime = performance.now();
    requestAnimationFrame(gameLoop);
};