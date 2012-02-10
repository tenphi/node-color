var color = require('../lib/color');

console.log(color('#3399ff') + '');
console.assert(color('#3399ff') + '' === '#3399ff', 'Color hex defining failed');
console.log(color('#3399ff').rgb() + '');
console.assert(color('#3399ff').rgb() === 'rgb(51, 153, 255)', 'Rgb convertion failed');
console.log(color([51, 153, 255]).rgb());
console.assert(color([51, 153, 255]).rgb() === 'rgb(51, 153, 255)', 'Color rgb defining failed');
console.log(color([120, .5, .5], 'hsl').hsl());
console.assert(color([120, .5, .5], 'hsl').hsl() == 'hsl(120, 50%, 50%)', 'Color hsl defining failed');

console.log(color([120, .5, .5], 'hsl').lighten(.2).hsl());
console.assert(color([120, .5, .5], 'hsl').lighten(.2).hsl() == 'hsl(120, 50%, 60%)', 'Lighten failed');
console.log(color([120, .5, .5], 'hsl').darken(.2).hsl());
console.assert(color([120, .5, .5], 'hsl').darken(.2).hsl() == 'hsl(120, 50%, 40%)', 'Darken failed');

console.log(color([120, .5, .5], 'hsl').saturate(.2).hsl());
console.assert(color([120, .5, .5], 'hsl').saturate(.2).hsl() == 'hsl(120, 60%, 50%)', 'Saturate failed');
console.log(color([120, .5, .5], 'hsl').desaturate(.2).hsl());
console.assert(color([120, .5, .5], 'hsl').desaturate(.2).hsl() == 'hsl(120, 40%, 50%)', 'Desaturate failed');

console.log(color([120, .5, .5], 'hsl').spin(10).hsl());
console.assert(color([120, .5, .5], 'hsl').spin(10).hsl() == 'hsl(130, 50%, 50%)', 'Saturate failed');
console.log(color([120, .5, .5], 'hsl').spin(-10).hsl());
console.assert(color([120, .5, .5], 'hsl').spin(-10).hsl() == 'hsl(110, 50%, 50%)', 'Desaturate failed');

console.log(color([120, .5, .5, .5], 'hsl').fadein(.2).hsl());
console.assert(color([120, .5, .5, .5], 'hsl').fadein(.2).hsl() == 'hsl(120, 50%, 50%, 40%)', 'Fadein failed');
console.log(color([120, .5, .5, .5], 'hsl').fadeout(.2).hsl());
console.assert(color([120, .5, .5, .5], 'hsl').fadeout(.2).hsl() == 'hsl(120, 50%, 50%, 60%)', 'Fadeout failed');