let mix = require('laravel-mix');

mix.setPublicPath('./../focalpoint/');
mix.js('app.js', 'assets/js/focalpoint.js');
mix.sass('app.scss', 'assets/css/focalpoint.css');
