// Basic view
// Single dot:

siteApp.views.push({
    name            : "Basic View",
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
        vars.step ++;

    }
});