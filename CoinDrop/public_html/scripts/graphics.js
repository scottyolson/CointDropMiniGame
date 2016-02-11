COINGAME.graphics = (function() {
    'use strict';

    var canvas = document.getElementById('mainCanvas'),
            context = canvas.getContext('2d');

    ///Code adapted from Dean Mathias
    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function clear() {
        context.clear();
    }
    
    //------------------------------------------------------------------
    //
    // Expose an ability to draw an image/texture on the canvas.
    //
    //------------------------------------------------------------------
    function drawImage(spec) {
        context.save();

        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);

        context.drawImage(
                spec.image,
                spec.center.x - spec.size / 2,
                spec.center.y - spec.size / 2,
                spec.size, spec.size);

        context.restore();
    }

    //create texture for client code for rendering, also Dean :)
    function Texture(spec) {
        var that = {};

        that.moveDown = function(elapsedTime) {
            spec.center.y += spec.moveRate * (elapsedTime / 1000);
        };

        that.draw = function() {
            context.save();

            context.translate(spec.center.x, spec.center.y);
            context.rotate(spec.rotation);
            context.translate(-spec.center.x, -spec.center.y);

            context.drawImage(
                    spec.image,
                    spec.center.x - spec.width / 2,
                    spec.center.y - spec.height / 2,
                    spec.width,
                    spec.height);
            context.restore();
        };

        return that;
    }

    //code for rendering text
    function Text(spec) {
        var that = {};

        that.updateRotation = function(angle) {
            spec.rotation += angle;
        };

        function measureTextHeight(spec) {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;

            var height = context.measureText('C').width;

            context.restore();

            return height;
        }

        function measureTextWidth(spec) {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;

            var width = context.measureText(spec.text).width;

            context.restore();

            return width;
        }

        that.draw = function() {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;
            context.textBaseline = 'top';

            context.translate(spec.pos.x + that.width / 2, spec.pos.y + that.height / 2);
            context.rotate(spec.rotation);
            context.translate(-(spec.pos.x + that.width / 2), -(spec.pos.y + that.height / 2));

            context.fillText(spec.text, spec.pos.x, spec.pos.y);
            context.strokeText(spec.text, spec.pos.x, spec.pos.y);

            context.restore();
        };

        that.height = measureTextHeight(spec);
        that.width = measureTextWidth(spec);
        that.pos = spec.pos;

        return that;
    }

    return{
        clear : clear,
        drawImage : drawImage,
        Texture : Texture,
        Text : Text
    };
}());//end COINGAME.graphic


