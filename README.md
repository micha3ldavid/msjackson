![Ms. Jackson](https://raw.githubusercontent.com/micha3ldavid/msjackson/master/src/images/logo.png)

[Codepen Demo](http://codepen.io/micha3ldavid/pen/GjAKPX)

## Are You Nasty?

Panic at the Disco might have you believing Ms. Jackson is a two-timing floosy of a woman, and she very well may be, but she's also the lady of choice for elemental-based grid systems.

### What is an Elemental Grid System?

An elemental grid system is one based on element sizes vs. the window. Grid systems today use media queries, which waterfall layout adjustments to your page based on window breakpoint sizes, creating the responsive layouts we all have grown to love. And most of the time this gets the job done. However, recently I have been receiving requests where clients want modules to be responsive to their containers instead of the window. This is the ultimate in decoupling web components and unfortunately CSS does not have a way of doing this as of yet.

### Enter Ms. Jackson

Ms. Jackson is two parts: CSS (or SCSS) and JavaScript. Both are light-weight but, working together, produce a strong, flexible element-based grid system. If you are using SASS/SCSS as your CSS language, you have complete control over the number of breakpoints, their names, column count, and gutters. If you're using standard CSS, I've put together two static files to use: one with four breakpoints and one with five, both of which are twelve column grids. On the JavaScript side, all you have to do is provide the breakpoint names and their size values and Ms. Jackson will do the rest.

### As Node Module

You can pull down the latest version of Ms. Jackson as a node module and reference your files from there if you like. To do so run the below npm bash command.

<pre>$ npm install msJackson</pre>

### Setting up your SCSS

Including msJackson.scss will not actually render anything. In order to have Ms. Jackson create the elemental grid system you must call her like in the code snippet below:

<pre>@mixin msJackson();</pre>

To customize Ms. Jackson's output, there are two things we can do. The first is to override her current configuation variables like in the first code sample below. The second way we can customize her output is to pass values in as parameters like in the second code sample below.

<pre>$msJackson-columns: 12 !default;
$msJackson-gutters: 30px !default;
$msJackson-breakpoints: xs, sm, md, lg, xl !default;</pre>

<pre>@mixin msJackson( (xs, sm, md, lg), 12, 30px ); </pre>

### Setting up your JavaScript

The second part of Ms. Jackson's magic rests with JavaScript. But don't worry, the script is fast, light-weight, and has no depenencies. The script can also be used as an AMD module, CommonJS module, mixed with Angular and even React. You can instanciate Ms. Jackson with the 'new' keyword and pass in up to two parameters, the first of which is required.

<pre>var mj = new msJackson([
	{ name: 'xs', value: '*' },
	{ name: 'sm', value: 480 },
	{ name: 'md', value: 720 },
	{ name: 'lg', value: 990 },
	{ name: 'xl', value: 1100 }
]);</pre>

If you only want Ms. Jackson on a perticular module(s) you can specify a selector as the first parameter:

<pre>var mj = new msJackson('#my-module', [
	{ name: 'xs', value: '*' },
	{ name: 'sm', value: 480 },
	{ name: 'md', value: 720 },
	{ name: 'lg', value: 990 },
	{ name: 'xl', value: 1100 }
]);</pre>

### Public API

There are a handful of helpful methods in place for interacting with Ms. Jackson. She's an easy lady, therefore her methods are easy to use as well.

*   
    #### query()

    Takes no arguments. This method will re-query selectors to watch onresize in it's given context. Useful when adding/removeing content. Default context is the document.

*   
    #### updateAll()

    Takes no arguments. Manually call update() on each element in Ms. Jacksons queue. This will re-calculate element sizes and reapply breakpoint classes if necessary.

*   
    #### update( el )

    Takes one argumemt, el, as a DOM Node (we do not rely on jQuery). You can call this method publicly and pass it any element you like, which it will then calculate and apply classes if necessary.

*   
    #### unwatch()

    Takes no arguments. Remove watching elements in the Ms. Jackson instance queue for size changes.

*   
    #### watch()

    Takes no arguments. Reapply the watch handler if removed by unwatch(), which measures elements in the Ms. Jackson instance queue and applies the necessary classes.
