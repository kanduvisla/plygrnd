// Basic view
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
                var cX = (y%2 * 25) + (x * 50);
                var cY = y * 50;

                vars.drawCircle(cX, cY, 2, '#fff');
                // Calculate direction angle from mouse:

                // inside:
                // var rad = Math.atan2(vars.mousePosition.x - cX, vars.mousePosition.y - cY);

                // outside:
                var rad = Math.atan2(cX - vars.mousePosition.x, cY - vars.mousePosition.y);

                // distance:
                var distance = Math.sqrt(
                    Math.pow(vars.mousePosition.x - cX, 2) + Math.pow(vars.mousePosition.y - cY, 2)
                );

                var dX = cX + Math.sin(rad * Math.PI / 3) * distance;
                var dY = cY + Math.cos(rad * Math.PI / 3) * distance;

                ctx.strokeStyle = '#0f0';
                ctx.beginPath();
                ctx.moveTo(cX, cY);
                ctx.lineTo(dX, dY);
                ctx.stroke();

                vars.drawCircle(dX, dY, 1, '#f00');
            }
        }
    }
});