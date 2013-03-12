// app.js
// main 'app' that runs the site.

"use strict";

var App = function()
{
    // Check for older browsers:
    if(!document.addEventListener) {
        document.write('Your browser is a little bit special');
        return;
    }
    
    var _this = this;                   // Reference to root object;
    this.views = [];                    // Array with views
    this.totalViews = [];               // Counter to keep track if all views are loaded.
    this.currentView = 0;               // CurrentView
    this.mousePosition = {x: 0, y: 0};  // Mouse position (can be used by views)
    this.frameRate = 60;
    this.mouseDown = false;
    this.click = false;

    // Create canvas object:
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);

    // Context Object:
    this.ctx = this.canvas.getContext('2d');

    // Resize function:
    this.resize = function(){
        _this.ctx.width  = _this.canvas.width  = document.body.clientWidth;
        _this.ctx.height = _this.canvas.height = document.body.clientHeight;
    };

    // And bind it to the window:
    window.addEventListener('resize', this.resize);
    this.resize();

    // Mouse position (can be used by views):
    window.addEventListener('mousemove', function(e){
        _this.mousePosition.x = e.clientX;
        _this.mousePosition.y = e.clientY;
    });

    this.canvas.addEventListener('touchmove', function(e){
        e.preventDefault();
        _this.mousePosition.x = e.touches[0].clientX;
        _this.mousePosition.y = e.touches[0].clientY;
    });

    this.canvas.addEventListener('mousedown', function(e){
        e.preventDefault();
        _this.mouseDown = true;
        _this.click = true;
    });

    this.canvas.addEventListener('mouseup', function(e){
        e.preventDefault();
        _this.mouseDown = false;
        _this.click = false;
    });

    this.canvas.addEventListener('touchstart', function(e){
        e.preventDefault();
        _this.mouseDown = true;
        _this.click = true;
    });

    this.canvas.addEventListener('touchend', function(e){
        e.preventDefault();
        _this.mouseDown = false;
        _this.click = false;
    });

    // Add extra functions to the context object:
    this.ctx.lineThrough = function(points)
    {
        for(var i in points) {
            this.lineTo(points[i].x, points[i].y);
        }
    };

    this.ctx.curveThrough = function(points)
    {
            for (var i = 1; i < points.length - 2; i ++)
            {
                var xc = (points[i].x + points[i + 1].x) / 2;
                var yc = (points[i].y + points[i + 1].y) / 2;
                this.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            // curve through the last two points
            this.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
    };

    this.ctx.direction = function(x1, y1, x2, y2)
    {
        return Math.atan2(y2 - y1, x2 - x1);
    };

    this.ctx.distance = function(x1, y1, x2, y2)
    {
        return Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
        );
    };

    this.ctx.drawCircle = function(x, y, radius)
    {
         this.arc(x, y, radius, 0, Math.PI*2, true);
    };

    // Pager function:
    this.pager = document.createElement('nav');
    document.body.appendChild(this.pager);

    this.buildPager = function()
    {
        for(var i in _this.views)
        {
            // Create an anchor, which loads the specific view:
            var anchor = document.createElement('a');
            anchor.innerText = parseInt(i) + 1;
            anchor.setAttribute('data-view', i);
            anchor.setAttribute('title', _this.views[i].name);
            anchor.addEventListener('click', function(e){
                e.preventDefault();
                _this.playView(this.getAttribute('data-view'));
            });
            _this.pager.appendChild(anchor);
        }
    };

    // Views functions:
    this.addView = function(file)
    {
        // Create a slug:
        var a = file.split('/');
        var slug = a[a.length-1].replace('.js', '');
        // Create the script tag:
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src  = file;
        script.setAttribute('data-slug', slug);
        _this.totalViews.push({
            order: _this.totalViews.length,
            slug: slug,
            loaded: false
        });
        // Event when the script is loaded:
        script.addEventListener('load', function(e){
            var slug = e.srcElement.getAttribute('data-slug');
            for(var i in _this.totalViews)
            {
                if(_this.totalViews[i].slug == slug) {
                    _this.totalViews[i].loaded = true;
                }
            }
        });
        document.body.appendChild(script);
    };

    // Check if all is loaded and start if so:
    this.load = function()
    {
        var intervalTimeout = 0;
        var intervalID = setInterval(function(){
            intervalTimeout++;
            if(intervalTimeout == 300) {
                // waited for 30 seconds. Something is clearly wrong.
                alert('Time out! Is your Internet connection thát slow?!?');
                clearInterval(intervalID);
            }
            // Check if all views are loaded:
            var allLoaded = true;
            for(var i in _this.totalViews)
            {
                if(_this.totalViews[i].loaded == false) { allLoaded = false; }
            }
            if(allLoaded) {
                // All views are loaded.
                var newViews = [];
                for(var i in _this.totalViews) {
                    var currentSlug = _this.totalViews[i].slug;
                    for(var j in _this.views) {
                        if(_this.views[j].slug == currentSlug) {
                            newViews.push(_this.views[j]);
                        }
                    }
                }
                _this.views = newViews;

                // Clear interval:
                clearInterval(intervalID);

                // Build the pager:
                _this.buildPager();

                // Start the app:
                _this.start();
            }
        }, 250);
    };

    // Start function:
    this.start = function()
    {
        // Get the right view:
        if(window.location.hash != '') {
            var currentHash = window.location.hash.replace('#', '');
            for(var i in _this.views) {
                if(_this.views[i].slug == currentHash) {
                    _this.currentView = i;
                }
            }
        } else {
            _this.currentView = _this.views.length - 1;
        }
        _this.playView(_this.currentView);
        // Setup the loop:
        setInterval(function(){
            // Pass on some variables:
            _this.views[_this.currentView].vars.mousePosition = _this.mousePosition;
            _this.views[_this.currentView].vars.mouseDown = _this.mouseDown;
            _this.views[_this.currentView].vars.click = _this.click;
            _this.click = false;
            // Make that step:
            _this.views[_this.currentView].stepFunction(_this.ctx, _this.views[_this.currentView].vars);
        }, 1000 / _this.frameRate); // default = 60 fps.
    };

    this.playView = function(viewNr)
    {
        // Un-initialize the current view:
        try {
            _this.views[_this.currentView].unInitFunction(_this.ctx, _this.views[_this.currentView].vars);
        } catch(e) {}
        // Go further with the requested view from here:
        _this.currentView = viewNr;
        // Remove the class of the active view:
        if(this.pager.querySelector('a.active')) {
            this.pager.querySelector('a.active').className = '';
        }
        // And add it to the new view!
        this.pager.querySelector("a[data-view='" + _this.currentView + "']").className = 'active'
        // Set the hash:
        window.location.hash = _this.views[_this.currentView].slug;
        // Initialize the current view:
        _this.views[_this.currentView].initFunction(_this.ctx, _this.views[_this.currentView].vars);
    };

};

var StepGenerator = function(complexity, minInc, maxInc, minMul, maxMul)
{
    this.steps       = [];
    this.incs        = [];
    this.multipliers = [];
    this.complexity  = complexity;

    var _this = this;

    // Defaults:
    if(minInc == null) { minInc = 0; }
    if(maxInc == null) { maxInc = .1; }
    if(minMul == null) { minMul = .7; }
    if(maxMul == null) { maxMul = 1.3; }

    // Initialise:
    for(var i = 0; i < this.complexity; i++)
    {
        this.steps.push(Math.random() * Math.PI);
        this.incs.push(minInc + Math.random() * (maxInc - minInc));
        this.multipliers.push(minMul + Math.random() * (maxMul - minMul));
    }

    this.step = function()
    {
        // Increase the counters:
        for(var i = 0; i < _this.complexity; i++)
        {
            _this.steps[i] += _this.incs[i];
        }
    };

    // Step XY-function:
    this.getXY = function(offset, w, h)
    {
        if(offset == null) { offset = 0; }

        var xValue = 0;
        var yValue = 0;

        // Calculate XY:
        for(var i = 0; i < _this.complexity; i++)
        {
            xValue += Math.sin(_this.steps[i] + (_this.incs[i] * offset)) * w;
            yValue += Math.cos((_this.steps[i] + (_this.incs[i] * offset)) * _this.multipliers[i]) * h;
        }
        // Return it:
        return {
            x: xValue,
            y: yValue
        };
    };
};