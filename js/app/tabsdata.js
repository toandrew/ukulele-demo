define(function(){
	'use strict';

	var TabsData = {};

	TabsData.NoteCell = function() {
		this.note = EMPTY_NOTE;
	}

	TabsData.EmptySection = function() {
		this.type = null;
	}

	TabsData.YoutubeSection = function() {
		this.youtubeId = '';
		this.videoTitle = '';
		this.type ='youtube';
	}

	TabsData.TextSection = function() {
		this.type = 'text';
		this.text ='';
	}

	TabsData.TabSection = function() {
		this.type = 'tabs';
		this.data = {
			'numstrings': tabBlockNumStrings,
			'numcolumns': tabBlockLength,
			'tuning': tabBlockNotes,
			'strings': new Array(tabBlockNumStrings),
			'colmodifiers': {},
			'barlines': {}
		};

		for (var i = 0; i < tabBlockNumStrings; i++) {
			this.data['strings'][i] = {};
		}

		for (var i = 0; i < topColumnModifiers.length; i++) {
			this.data['colmodifiers'][topColumnModifiers[i]] = {};
		}

		for (var i = 0; i < bottomColumnModifiers.length; i++) {
			this.data['colmodifiers'][bottomColumnModifiers[i]] = {};
		}
	}

	TabsData.VideoSection = function() {
		this.type = 'video';
	}

	TabsData.AudioSection = function() {
		this.type = 'audio';
	}

	TabsData.Song = function() {
		this.data = {
			'info': {
				'title': null,
				'artist': null,
				'transcriber': null
			},

			'sections': []
		};
	}

	TabsData.Song.prototype = {
		addSection: function(id, newSection) {
			this.data.sections.splice(id, 0, newSection);
		},

		load: function(data) {
			this.data = JSON.parse(data);
		},

		save: function() {
			return JSON.stringify(this.data, undefined, 2);
		}
	}

	return TabsData;
});