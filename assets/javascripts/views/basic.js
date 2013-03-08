// Basic view
// Single dot:

siteApp.views.push({
    name            : "Basic View",
    slug            : "basic",
    // Variables used by this view:
    vars            : {
        step : 0
    },
    // Initialisation:
    initFunction    : function(ctx, vars){
        vars.step = 0;
    },
    // Stepping function:
    stepFunction    : function(ctx, vars){
        vars.step += 0.01;
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.beginPath();
        ctx.arc(ctx.width/2, ctx.height/2, 100 + Math.sin(vars.step) * 50, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
});