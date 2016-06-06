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
        'editor': '../app/editor',
        'jquery': 'jquery-1.9.1.min',
        'painter': '../app/painter'
    },

    'shim': {
        'jquery-ui-1.9.2.custom.min': ['jquery'],
        'jquery.autosize-min': ['jquery'],
        'Blob': {
            exports: 'Blob'
        }, 
        'FileSaver.min': {
            exports: 'saveAs'
        }
    }
});

// Start the main app logic.
requirejs(['jquery', 'jquery-ui-1.9.2.custom.min', 'jquery.autosize-min', 'FileSaver.min'], function($) {
    $(document).ready(function(){
        require(['app/ukulele'], function(Ukulele) {
            Ukulele.run();
        });
    });
});