// Life

siteApp.views.push({
    name            : "Life",
    slug            : "life",
    // Variables used by this view:
    vars            : {
        creatures: [],
        worldWidth: 0,
        worldHeight: 0
    },
    // Initialisation:
    initFunction    : function(ctx, vars){
        vars.creatures = [];
        vars.worldWidth = ctx.width/10;
        vars.worldHeight = ctx.height/10;
        vars.createCreature = function(x, y)
        {
            if(!vars.creatures[y]) { vars.creatures[y] = []; }
            if(!vars.creatures[y][x]) {
                // The creature variables are stored in an object:
                vars.creatures[y][x] =  {
                    age: 0,
                    max_age: 50 + Math.round(Math.random() * 100),
                    creates_offspring: Math.random() <.8,
                    offspring_tries: Math.ceil(Math.random() * 5),
                    dying: false
                };
            }
        };

        // Draw some random creatures to begin with:
        for(var i=0; i<10; i++) {
            vars.createCreature(
                Math.floor(Math.random() * vars.worldWidth),
                Math.floor(Math.random() * vars.worldHeight)
            );
        }
    },
    // Un-initialisation:
    unInitFunction  : function(ctx, vars){},
    // Stepping function:
    stepFunction    : function(ctx, vars){
        ctx.clearRect(0, 0, ctx.width, ctx.height);

        // Check if a creature is created:
        if(vars.mouseDown)
        {
            var xPos = Math.floor((vars.mousePosition.x) / 10);
            var yPos = Math.floor((vars.mousePosition.y) / 10);
            vars.createCreature(xPos, yPos);
        }

        // Draw the world:
        for(var y= 0; y<vars.worldWidth; y++)
        {
            for(var x= 0; x<vars.worldWidth; x++)
            {
                if(vars.creatures[y] && vars.creatures[y][x])
                {
                    // Draw the creature:
                    var creature = vars.creatures[y][x];
                    creature.age++;
                    var p = creature.age / creature.max_age;
                    if(p == 1) {
                        creature.dying = true;
                    }
                    if(creature.dying)
                    {
                        // creature dies
                        p = 1 - ((creature.age - creature.max_age) / 30);
                        if(p <= 0) {
                            p = 0;
                            // unset the creature:
                            vars.creatures[y][x] = null;
                        }
                    } else {
                        // creature creates offspring?
                        if(creature.creates_offspring && !creature.offspring_tries == 0 &&
                            creature.age >= 18 && creature.age <= 35)
                        {
                            creature.offspring_tries--;
                            var whereX = -1 + Math.round(Math.random() * 2);
                            var whereY = -1 + Math.round(Math.random() * 2);
                            vars.createCreature(x + whereX, y + whereY);
                        }
                    }
                    var tint = Math.floor(p * 256);
                    var color = 'rgba(' + tint + ',' + tint + ',' + tint + ',1)';

                    // draw the creature:
                    ctx.fillStyle = color;
                    ctx.fillRect(x*10, y*10, 10, 10);

                } else {
                    // Draw a gray dot:
                    ctx.fillStyle = '#000';
                    ctx.fillRect(x*10, y*10, 10, 10);
                }
            }
        }
    }
});