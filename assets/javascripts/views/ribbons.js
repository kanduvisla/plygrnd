// Ribbons

siteApp.views.push({
    name            : "Ribbons",
    // Variables used by this view:
    vars            : {
        step  : [],
        inc   : [],
        div   : [],
        steps : 4,
        size  : 600
    },
    // Initialisation:
    initFunction    : function(ctx, vars){
        for(var i = 0; i < vars.steps; i++)
        {
            vars.step.push(Math.random() * Math.PI);
            vars.inc.push(Math.random() * 0.1);
            vars.div.push(.7 + Math.random() * .6);
        }
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
    // Stepping function:
    stepFunction    : function(ctx, vars){
        var i;
        var leftX  = 0;
        var leftY  = 0;
        var rightX = 0;
        var rightY = 0;
        // Increase the counters:
        for(i = 0; i < vars.steps; i++)
        {
            vars.step[i] += vars.inc[i];
        }
        // Calculate X + Y;
        for(i = 0; i < vars.steps; i++)
        {
            leftX += Math.sin(vars.step[i]) * ctx.width / 4;
            leftY += Math.cos(vars.step[i] * vars.div[i]) * ctx.height / 4;
        }
        vars.drawCircle(ctx.width / 2 + leftX, ctx.height / 2 + leftY, 2, '#fff');
    }
});