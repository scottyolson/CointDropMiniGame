/* Modified particlSystem
 * 
 */
/* 
 from Dr. James Dean Mathias' example
 modified by Scott Olson
 */
/*jslint browser: true, white: true, plusplus: true */
/*global Random */
function coinDropSystem(spec, graphics) {
    'use strict';
    var that = {},
            nextName = 1, // unique identifier for the next particle
            particles = {};	// Set of all active particles

    //------------------------------------------------------------------
    //
    // This creates one new particle
    //
    //------------------------------------------------------------------
    that.create = function(coins, coinIndex) {
        var p = {
            image: coins[coinIndex].img,
            size: coins[coinIndex].size, //Random.nextGaussian(spec.size.mean, spec.size.stdev),
            center: {x: spec.center.x, y: spec.center.y},
            direction: {x: 0, y: 45}, //Random.nextCircleVector(),
            speed: Math.abs(Random.nextGaussian(spec.speed.mean, spec.speed.stdev)), // pixels per second
            rotation: 0,
            lifetime: 10, // How long the particle should live, in seconds
            alive: 0, // How long the particle has been alive, in seconds
            value: coins[coinIndex].value
        };
        //remove coin from array
        coins.splice(coinIndex, 1);
        //console.log(coins.length);

        //
        // Ensure we have a valid size - gaussian numbers can be negative
        p.size = Math.max(1, p.size);
        //
        // Same thing with lifetime
        p.lifetime = Math.max(0.01, p.lifetime);
        //
        // Assign a unique name to each particle
        particles[nextName++] = p;
    };

    ///moveParticle system side to side
    that.moveOver = function(elapsedTime) {
        spec.center.x = Random.nextGaussian(450, 400);
        //don't drop over pig
        if (spec.center.x > 750 || spec.center.x < 10)
            spec.center.x = Random.nextGaussian(200, 200);
    };

    //------------------------------------------------------------------
    //
    // Update the state of all particles.  This includes remove any that 
    // have exceeded their lifetime.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        var removeMe = [],
                value,
                particle;
        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                //
                // Update how long it has been alive
                particle.alive += elapsedTime;

                //
                // Update its position
                particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
                particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

                //
                // Rotate proportional to its speed
                particle.rotation += particle.speed / 300;

                //
                // If the lifetime has expired, identify it for removal
                if (particle.alive > particle.lifetime) {
                    removeMe.push(value);
                }
            }
        }

        //
        // Remove all of the expired particles
        for (particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;
    };

    //finds if the mouse clicked event is over any of our objects
    //
    that.findParticle = function(mouseX, mouseY) {
        var removeMe = [],
                value,
                particle;
        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                //
                // check if mousex and y are in the diameter of the particle
                if (COINGAME.inCircle(particle.center.x, particle.center.y, mouseX, mouseY, particle.size / 2)) {
                    removeMe.push(value);
                    //add particle.value to the score
                    if (particle.value === -1){
                        //canadian
                        COINGAME.totalScore.text = 0;
                        COINGAME.playBuzzer();
                    }
                    else if (particle.value === 0){
                        //clock, add more coins
                        COINGAME.addCoinsBool = true;
                        COINGAME.playLevelUp();
                    }
                    else{
                        COINGAME.totalScore.text += particle.value;
                        COINGAME.dollarParticleSpec.center.x = mouseX;
                        COINGAME.dollarParticleSpec.center.y = mouseY;
                        COINGAME.playCashSound();
                        COINGAME.hitCount++;
                    }
                }
            }
        }
        //remove all clicked on particles
        for (particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;
    };

    //function that tells us if the particles{} object has anymore properties
    //
    that.noMoreParticles = function() {
        var count = 0,
                value;
        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                count++;
            }
        }
        if (count > 0)
            return false;
        else
            return true;
    };

    //------------------------------------------------------------------
    //
    // Render all particles
    //
    //------------------------------------------------------------------
    that.render = function() {
        var value,
                particle;

        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                graphics.drawImage(particle);
            }
        }
    };
    return that;
}

COINGAME.addCoins = function(coins, US, Canada, Roman) {
    ///add coins to an array to shift through in particle system
    for (i = 0; i < US; i++)
        coins.push({
            img: COINGAME.images['images/Coin-US-Dollary.png'],
            size: 70,
            value: 10
        });
    for (i = 0; i < Canada; i++)
        coins.push({
            img: COINGAME.images['images/Coin-Canadian-Dollar.png'],
            size: 90,
            value: -1
        });
    for (var i = 0; i < Roman; i++)
        coins.push({
            img: COINGAME.images['images/Coin-Roman.png'],
            size: 40,
            value: 50
        });
};
