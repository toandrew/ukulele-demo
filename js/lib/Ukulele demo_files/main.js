console.log('haha');

requirejs.config({
    //By default load any module IDs from js/lib
    'baseUrl': 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    'paths': {
        'app': '../app',
        'jquery': 'jquery-1.9.1.min'
    },

    'shim': {
        'jquery-ui-1.9.2.custom.min': ['jquery'],
        'jquery.autosize-min': ['jquery']
    }
});

// Start the main app logic.
requirejs(['jquery', 'jquery-ui-1.9.2.custom.min', 'jquery.autosize-min'], function($) {
    console.log('haha');
    //$('#transcriber').value = 'aa';
});