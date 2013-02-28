// app.js
// main 'app' that runs the site.

"use strict";

var App = function()
{
    var _this = this;       // Reference to root object;
    this.views = [];        // Array with views
    this.totalViews = {
        inserted : 0,
        loaded   : 0
    };    // Counter to keep track if all views are loaded.
    this.currentView = 0;   // CurrentView

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
        _this.currentView = _this.views.length - 1;
        _this.playView(_this.currentView);
        // Setup the loop:
        setInterval(function(){
            _this.views[_this.currentView].stepFunction(_this.ctx, _this.views[_this.currentView].vars);
        }, 1000/60); // 60 fps.
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
        // Initialize the current view:
        _this.views[_this.currentView].initFunction(_this.ctx, _this.views[_this.currentView].vars);
    };



};