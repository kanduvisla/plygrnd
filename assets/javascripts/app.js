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
    this.totalViews = {
        inserted : 0,
        loaded   : 0
    };                                  // Counter to keep track if all views are loaded.
    this.currentView = 0;               // CurrentView
    this.mousePosition = {x: 0, y: 0};  // Mouse position (can be used by views)
    this.frameRate = 60;

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

    // Add extra functions to the context object:
    this.ctx.lineThrough = function(points)
    {
        for(var i in points) {
            this.lineTo(points[i].x, points[i].y);
        }
    };

    this.ctx.curveThrough = function(points)
    {
/*
        for(var i in points) {
            i = parseInt(i);
*/
            // this.lineTo(points[i].x, points[i].y);
            // Calculate direction:
            // var i2 = i < points.length - 2 ? i+1 : i;
            // var direction = this.direction(points[i2].x, points[i2].y, points[i].x, points[i].y);
            // needs work:
/*
            this.stroke();
            this.beginPath();
            this.drawCircle(points[i].x, points[i].y, 5);
            this.moveTo(points[i].x, points[i].y);
            this.strokeStyle = '#f00';
            this.lineTo(Math.sin(points[i].x + Math.sin(direction) * 25));
            this.strokeStyle = '#fff';
            this.moveTo(points[i].x, points[i].y);
            this.stroke();
*/

            // this.moveTo(points[0].x, points[0].y);

            for (var i = 1; i < points.length - 2; i ++)
            {
                var xc = (points[i].x + points[i + 1].x) / 2;
                var yc = (points[i].y + points[i + 1].y) / 2;
                this.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            // curve through the last two points
            this.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
//         }
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
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src  = file;
        _this.totalViews.inserted++;
        script.addEventListener('load', function(e){
            _this.totalViews.loaded++;
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
            if(_this.totalViews.inserted == _this.totalViews.loaded) {
                // All views are loaded.

                // Clear interval:
                clearInterval(intervalID);

                // Build the pager:
                _this.buildPager();

                // Start the app:
                _this.start();
            }
        }, 100);
    };

    // Start function:
    this.start = function()
    {
        // Get the right view:
        if(window.location.hash != '') {
            _this.currentView = parseInt(window.location.hash.replace('#', '')) - 1;
        } else {
            _this.currentView = _this.views.length - 1;
        }
        _this.playView(_this.currentView);
        // Setup the loop:
        setInterval(function(){
            _this.views[_this.currentView].vars.mousePosition = _this.mousePosition;
            _this.views[_this.currentView].stepFunction(_this.ctx, _this.views[_this.currentView].vars);
        }, 1000 / _this.frameRate); // default = 60 fps.
    };

    this.playView = function(viewNr)
    {
        _this.currentView = viewNr;
        // Remove the class of the active view:
        if(this.pager.querySelector('a.active')) {
            this.pager.querySelector('a.active').className = '';
        }
        // And add it to the new view!
        this.pager.querySelector("a[data-view='" + _this.currentView + "']").className = 'active'
        // Set the hash:
        window.location.hash = parseInt(viewNr) + 1;
        // Initialize the current view:
        _this.views[_this.currentView].initFunction(_this.ctx, _this.views[_this.currentView].vars);
    };



};