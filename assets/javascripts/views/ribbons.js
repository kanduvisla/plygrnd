// Ribbons

siteApp.views.push({
    name            : "Ribbons",
    slug            : "ribbons",
    // Variables used by this view:
    vars            : {
        steps : 3,
        size  : 600,
        stepGen : null
    },
    // Initialisation:
    initFunction    : function(ctx, vars){
        vars.stepGen = new StepGenerator(vars.steps, 0, 0.1, 0.7, 1.3);

        ctx.clearRect(0, 0, ctx.width, ctx.height);
        vars.size /= vars.steps;
        // for debugging:
        vars.drawCircle = function(x, y, radius, color)
        {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        };
    },
    // Un-initialisation:
    unInitFunction  : function(ctx, vars){},
    // Stepping function:
    stepFunction    : function(ctx, vars){
        var i;
        var leftX  = 0;
        var leftY  = 0;
        var rightX = 0;
        var rightY = 0;

        var rightX2= 0;     // needed for calculating distanceTo
        var rightY2= 0;     // needed for calculating distanceTo

        var w = ctx.width / (vars.steps + 1);
        var h = ctx.height / (vars.steps + 1);

        vars.stepGen.step();

        var leftXY = vars.stepGen.getXY(0, w, h);
        var rightXY = vars.stepGen.getXY(1, w, h);
        var rightXY2 = vars.stepGen.getXY(2, w, h);

        leftX = leftXY.x;
        leftY = leftXY.y;
        rightX = rightXY.x;
        rightY = rightXY.y;
        rightX2 = rightXY2.x;
        rightY2 = rightXY2.y;

        // vars.drawCircle(ctx.width / 2 + leftX, ctx.height / 2 + leftY, 2, '#fff');

        // Center:
        leftX += ctx.width / 2;
        leftY += ctx.height / 2;
        rightX += ctx.width / 2;
        rightY += ctx.height / 2;
        rightX2 += ctx.width / 2;
        rightY2 += ctx.height / 2;

        // Guide:
/*
        ctx.beginPath();
        ctx.moveTo(leftX, leftY);
        ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
        ctx.lineTo(rightX, rightY);
        ctx.stroke();
*/

        // Direction:
        var rad = Math.atan2(rightY - leftY, leftX - rightX);

        // Distance:
        var distanceFrom = Math.sqrt(
            Math.pow(rightX - leftX, 2) + Math.pow(rightY - leftY, 2)
        );

        var distanceTo = Math.sqrt(
            Math.pow(rightX2 - rightX, 2) + Math.pow(rightY2 - rightY, 2)
        );

        // Calculate the positions:
        var topLeft = {
            x: leftX + Math.sin(rad) * distanceFrom,
            y: leftY + Math.cos(rad) * distanceFrom
        };

        var bottomLeft = {
            x: leftX + Math.sin(rad + Math.PI) * distanceFrom,
            y: leftY + Math.cos(rad + Math.PI) * distanceFrom
        };

        var topRight = {
            x: rightX + Math.sin(rad) * distanceTo,
            y: rightY + Math.cos(rad) * distanceTo
        };

        var bottomRight = {
            x: rightX + Math.sin(rad + Math.PI) * distanceTo,
            y: rightY + Math.cos(rad + Math.PI) * distanceTo
        };

        // Calculate color:
        var red   = Math.floor(128 + Math.sin(vars.stepGen.steps[0]) * 127);
        var green = Math.floor(128 + Math.sin(vars.stepGen.steps[1]) * 127);
        var blue  = Math.floor(128 + Math.sin(vars.stepGen.steps[2]) * 127);

        var color = 'rgba(' + red + ',' + green + ',' + blue + ', 1)';

        // Draw:
        ctx.beginPath();
        ctx.moveTo(topLeft.x, topLeft.y);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.lineJoin = 'round';
        ctx.lineTo(topRight.x, topRight.y);
        ctx.lineTo(bottomRight.x, bottomRight.y);
        ctx.lineTo(bottomLeft.x, bottomLeft.y);
        ctx.lineTo(topLeft.x, topLeft.y);
        ctx.stroke();
        ctx.fill();


    }
});