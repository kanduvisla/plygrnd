// app.js
// main 'app' that runs the site.

"use strict";

var App = function()
{
    var _this = this;       // Reference to root object;
    this.views = [];        // Array with views

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
            console.log(_this.views[i]);
        }
    };

    // Views functions:
    this.addView = function(file)
    {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src  = file;
        document.body.appendChild(script);
    };

};