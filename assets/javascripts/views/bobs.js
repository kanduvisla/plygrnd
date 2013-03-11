// Infinity Bobs

siteApp.views.push({
    name            : "Infinty Bobs",
    slug            : "bobs",
    // Variables used by this view:
    vars            : {
        step   : null,
        images : [],
        count  : 8,
        currentCount : 0,
        complexity : 4
    },
    // Initialisation:
    initFunction    : function(ctx, vars){
        vars.step = new StepGenerator(vars.complexity, 0, 0.025, 0.7, 1.3);
        vars.images = [];
        vars.currentCount = 0;
        vars.rand = .5 + Math.random();

        // create ghost canvasses:
        for(var i=0; i<vars.count; i++)
        {
            var canvas = document.createElement('canvas');
            canvas.width = ctx.width;
            canvas.height = ctx.height;
            vars.images.push(canvas);
            document.body.appendChild(canvas);
            canvas.style.display = 'none';
        }
    },
    // Un-initialisation:
    unInitFunction  : function(ctx, vars){
        // Remove the ghost canvasses:
        for(var i in vars.images) {
            document.body.removeChild(vars.images[i]);
        }
    },
    // Stepping function:
    stepFunction    : function(ctx, vars){
        vars.step.step();
        ctx.clearRect(0, 0, ctx.width, ctx.height);

        // get the correct image:
        var imageFrom = vars.images[vars.currentCount];

        // draw on this image:
        var ctxFrom = imageFrom.getContext('2d');
        var xy = vars.step.getXY(0, ctx.width/(vars.complexity * 2), ctx.height/(vars.complexity * 2));

        // Calculate color:
        var red   = Math.floor(128 + Math.sin(vars.step.steps[0]) * 127);
        var green = Math.floor(128 + Math.sin(vars.step.steps[1]) * 127);
        var blue  = Math.floor(128 + Math.sin(vars.step.steps[2]) * 127);
        var color = 'rgba(' + red + ',' + green + ',' + blue + ', 1)';

        ctxFrom.fillStyle = color;
        ctxFrom.strokeStyle = '#000';
        ctxFrom.lineWidth = 2;
        ctxFrom.beginPath();
        ctxFrom.arc(
            ctx.width/2 + xy.x,
            ctx.height/2 + xy.y,
            20, 0, Math.PI*2, true);
        ctxFrom.fill();
        ctxFrom.stroke();

        // draw the image:
        ctx.drawImage(imageFrom, 0, 0);

        vars.currentCount++;
        if(vars.currentCount == vars.count) { vars.currentCount = 0; }
    }
});