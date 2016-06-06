define(function() {
	'use strict';

	var Ukulele = function() {
		this.init();
	}

	Ukulele.prototype = {
		init: function() {
			console.log('init ukulele!');

			this._initEventHandler();
		},

		run: function() {
      require(['editor/tabsinstance'], function(tabsInstance) {
        tabsInstance.load();
      });
		},

		_getUrlParams: function() {
			var params = {};
	    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
	    	params[key] = value;
	    });

			return params;
		},

		_initEventHandler: function() {
			var self = this;
			$('.tab').click(function() {
				var id = $(this).attr('data-tab');
				self._selectActiveTab(id);
				return false;
			});
		},

		_selectActiveTab: function(tabId) {
			$('.tab.active').removeClass('active');
			$('section').removeClass('hidden').addClass('hidden');
			$('section#' + tabId).removeClass('hidden');

			$('a.tab[data-tab="' + tabId + '"]').addClass('active');

			$('#ktg').trigger('autosize');

			if (tabId === 'editor') {
				$('.active .tabblock').focus();
			}
		},
	}

	return new Ukulele();
});