// Multiple dots that react to the mouse:

siteApp.views.push({
    name            : "Dots",
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
    },
    // Stepping function:
    stepFunction    : function(ctx, vars){
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        var stepsX = ctx.width / 50;
        var stepsY = ctx.height / 50;

        for(var y = 0; y < stepsY; y ++)
        {
            for(var x = 0; x < stepsX; x ++)
            {
                var cX = x * 50;
                var cY = y * 50;

                vars.drawCircle(cX, cY, 2.5, '#fff');
                // Calculate direction angle from mouse:

                // inside:
                var rad = Math.atan2(vars.mousePosition.x - cX, vars.mousePosition.y - cY);

                var dX = cX + Math.sin(rad) * 5;
                var dY = cY + Math.cos(rad) * 5;

                vars.drawCircle(dX, dY, 2.5, '#f00');
            }
        }
    }
});