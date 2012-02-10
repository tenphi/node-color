With this module you can simple manipulate with color`s parameters.

Just create one:

```javascript
var color = require('color');

color('#39f');
color([51, 153, 255]); // rgb
color([114, .5, .5], 'hsl'); // hsl
```

You can also set additional parameter for opacity:

```javascript
var clr = color([51, 153, 255, .5]); // 50% opacity
```

Now you can use LESS-like API for change color parameters:

```javascript
clr.lighten(.1); // return a color which is 10% *lighter* than base color
clr.darken(.1); // return a color which is 10% *darker* than base color

clr.saturate(.1);    // return a color 10% *more* saturated than base color
clr.desaturate(.1);  // return a color 10% *less* saturated than base color

clr.fadein(.1);      // return a color 10% *less* transparent than base color
clr.fadeout(.1);     // return a color 10% *more* transparent than base color
clr.fade(.5);        // return base color with 50% transparency

clr.spin(10);         // return a color with a 10 degree larger in hue than base color
clr.spin(-10);        // return a color with a 10 degree smaller hue than base color

clr.mix(clr2);    // return a mix of base color and other color
```

Now, you can fetch your color:

```javascript
color('#33f').toString(); // "#3399ff"
color('#33f') + ''; // "#3399ff"
color('#33f').hex(); // "#3399ff"
color('#33f').rgb(); // rgb(50, 50, 255)
color([50, 50, 255, .5]); // rgba(50, 50, 255, 0.5)
```

It's not all! Also you have a really nice function that can calculate and set real (visible) lightness of your color. This value between 0 to 360. Check this out:

```javascript
color('#39f').luminance(); // 144.8760297633808
color('#39f').luminance(200).hex(); // "#9fcfff"
```

It can be very useful!
Luminance calculating by following formula: `Math.sqrt(red*red*.241 + green*green*.691+blue*blue*.068);`

Color module can store your colors. For example, this is some Twitter Bootstrap colors that defined by default:

```javascript
color({
    black: '#000',
    grayDarker: '#222',
    grayDark: '#333',
    gray: '#555',
    grayLight: '#999',
    grayLighter: '#eee',
    white: '#fff',

    blue: '#049cdb',
    green: '#46a546',
    red: '#9d261d',
    yellow: '#ffc40d',
    orange: '#f89406',
    pink: '#c3325f',
    purple: '#7a43b6'
});

_.color('myColor', '#303639'); /* store one color */
```

And then select them by their names:

```javascript
color('purple').lighten(.1).hex(); // "#8752bf"
```

Enjoy!