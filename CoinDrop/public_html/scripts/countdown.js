/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
COINGAME.countDown = (function() {
    //spec parameter is a graphics.Text object with added properties
    function Clock(spec) {
        var that = {};
        that.update = function(elapsedTime) {
            //if(spec.text < 1)
            //don't display clock
            if (elapsedTime - spec.timeStamp >= spec.interval) {
                spec.text--;
                spec.timeStamp = performance.now();
                COINGAME.playSound();
            }
            if (spec.text < 1){
                spec.text = '';
                spec.stop = true;
            }
        };

        that.draw = function() {
            var clock = COINGAME.graphics.Text({
                text: spec.text,
                font: '70px Arial, sans-serif',
                fill: 'rgba(0, 0, 255, 1)',
                stroke: 'rgba(255, 0, 0, 1)',
                pos: {x: 450, y: 300},
                rotation: 0
            });
            clock.draw();
        };
        
        that.done = function(){
            return spec.stop;
        };

        return that;
    }
    return {
        Clock: Clock
    };
}());

COINGAME.createCountdown = function() {
    //create text to send to make new clock
    COINGAME.textures.clock = COINGAME.countDown.Clock({
        text: 3,
        interval: 1000,
        timeStamp: performance.now(),
        stop : false
    });
    COINGAME.playSound();
};
