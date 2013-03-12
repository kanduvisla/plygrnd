// Multiple dots that react to the mouse v2:

siteApp.views.push({
    name            : "Dots 2",
    slug            : "dots-2",
    // Variables used by this view:
    vars            : {
        steps: null,
        currentX: 0,
        currentY: 0
    },
    // Initialisation:
    initFunction    : function(ctx, vars){
        vars.steps = new StepGenerator(4, 0, 0.02, 0.7, 1.3);
        vars.prevDistances = {};
    },
    // Un-initialisation:
    unInitFunction  : function(ctx, vars){},
    // Stepping function:
    stepFunction    : function(ctx, vars){
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        var stepSize = ctx.width / 30;
        var stepsX = ctx.width / stepSize;
        var stepsY = ctx.height / stepSize;

        ctx.fillStyle = '#fff';

        // Adds a simple ease to the mouse:
        vars.currentX += (vars.mousePosition.x - vars.currentX) / 20;
        vars.currentY += (vars.mousePosition.y - vars.currentY) / 20;

        vars.steps.step();

        var size = ctx.width/1.5;

        for(var y = 0; y < stepsY; y ++)
        {
            for(var x = 0; x < stepsX; x ++)
            {
                var cX = (y%2 * stepSize / 2) + (x * stepSize);
                var cY = y * stepSize;

                // outside:
                var rad = Math.atan2(cX - vars.currentX, cY - vars.currentY);

                // distance:
                var distance = Math.sqrt(
                    Math.pow(vars.currentX - cX, 2) + Math.pow(vars.currentY - cY, 2)
                );

                var offset = Math.max(0, (size/2) - distance);
                var p = offset/size;
                p*=1-p;
                offset = (size/2) * p;

                var stepXY = vars.steps.getXY((y*stepsX)+(x*3), offset, offset);

                var dX = stepXY.x + cX + Math.sin(rad) * (offset);
                var dY = stepXY.y + cY + Math.cos(rad) * (offset);

                ctx.beginPath();
                ctx.drawCircle(dX, dY, distance/100);
                ctx.fill();
            }
        }
    }
});