// Basic view
// Single dot:

siteApp.views.push({
    name            : "Basic View",
    // Variables used by this view:
    vars            : {
        step : 0
    },
    // Initialisation:
    initFunction    : function(vars){
        vars.step = 0;
    },
    // Stepping function:
    stepFunction    : function(vars){
        vars.step ++;
        console.log(vars.step);
    }
});