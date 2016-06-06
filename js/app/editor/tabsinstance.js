define(['app/tabsdata', 'editor/tabeditor'], function(TabsData, Editor) {
	'use strict';

	var TabsInstance = function() {
		this.song = new TabsData.Song;
		this.tabsEditor = new Editor(this.song);
	}

	TabsInstance.prototype = {
		load: function(data) {
			if (data) {
				this.song.load(data);
			}

			if (this.tabsEditor) {
				this.tabsEditor.load(this.song);
			}
		},

		reset: function() {
			this.song = new TabsData.Song;
			this.tabsEditor.reset();
		},

		_initEventHandler: function() {
		}
	}

	return new TabsInstance();
});