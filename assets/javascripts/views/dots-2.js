// Multiple dots that react to the mouse v2:

siteApp.views.push({
    name            : "Dots 2",
    // Variables used by this view:
    vars            : {

    },
    // Initialisation:
    initFunction    : function(ctx, vars){
        vars.drawCircle = function(x, y, radius, color)
        {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        };
        vars.prevDistances = {};
    },
    // Stepping function:
    stepFunction    : function(ctx, vars){
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        var stepSize = ctx.width / 15;
        var stepsX = ctx.width / stepSize;
        var stepsY = ctx.height / stepSize;

        for(var y = 0; y < stepsY; y ++)
        {
            for(var x = 0; x < stepsX; x ++)
            {
                var cX = (y%2 * stepSize / 2) + (x * stepSize);
                var cY = y * stepSize;

                // outside:
                var rad = Math.atan2(cX - vars.mousePosition.x, cY - vars.mousePosition.y);

                // distance:
                var distance = Math.sqrt(
                    Math.pow(vars.mousePosition.x - cX, 2) + Math.pow(vars.mousePosition.y - cY, 2)
                );

                var offset = Math.max(0, 400 - distance);
                var p = offset/800;
                p*=1-p;
                offset = 400 * p;

                var dX = cX + Math.sin(rad) * offset;
                var dY = cY + Math.cos(rad) * offset;

                vars.drawCircle(dX, dY, distance/100, '#fff');
            }
        }
    }
});