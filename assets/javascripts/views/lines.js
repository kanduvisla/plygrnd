// Play with a line:

siteApp.views.push({
    name            : "Lines",
    slug            : "lines",
    // Variables used by this view:
    vars            : {
        step : 0,
        segments : 10
    },
    // Initialisation:
    initFunction    : function(ctx, vars){
        vars.step = 0;
    },
    // Stepping function:
    stepFunction    : function(ctx, vars){
        // Clear first:
        ctx.clearRect(0, 0, ctx.width, ctx.height);

        vars.step += 0.01;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();

        var fromX = 0;
        var fromY = ctx.height/2;
        ctx.moveTo(fromX, fromY);
        var segmentWidth = ctx.width / (vars.segments);

        var points = [];

        for(var i=1; i<vars.segments; i++)
        {

            var p = i/vars.segments;
            if(p>.5) { p = 1-p; }

            var x = i * segmentWidth;
            var y = (ctx.height/2) + (Math.sin(vars.step + i) * (100 * p));
            // ctx.lineTo(i * segmentWidth, y);

            points.push({x: x, y: y});

            fromX = x;
            fromY = y;
        }
        points.push({x: ctx.width, y: ctx.height/2});

        ctx.curveThrough(points);

        // ctx.lineTo(ctx.width, ctx.height/2);
        ctx.stroke();
    }
});