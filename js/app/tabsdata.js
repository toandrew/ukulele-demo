define(function(){
	'use strict';

	var TabsData = {};

	TabsData.NoteCell = function() {
		this.note = UkuConstants.EMPTY_NOTE;
	}

	TabsData.EmptySection = function() {
		this.type = null;
	}

	TabsData.YoutubeSection = function() {
		this.youtubeId = '';
		this.videoTitle = '';
		this.type = 'youtube';
	}

	TabsData.TextSection = function() {
		this.type = 'text';
		this.text ='';
	}

	TabsData.TabSection = function() {
		this.type = 'tabs';
		this.data = {
			'numstrings': UkuConstants.getTabBlockNumStrings(),
			'numcolumns': UkuConstants.getTabBlockLength(),
			'tuning': UkuConstants.tabBlockNotes,
			'strings': new Array(UkuConstants.getTabBlockNumStrings()),
			'colmodifiers': {},
			'barlines': {}
		};

		for (var i = 0; i < UkuConstants.getTabBlockNumStrings(); i++) {
			this.data['strings'][i] = {};
		}

		for (var i = 0; i < UkuConstants.topColumnModifiers.length; i++) {
			this.data['colmodifiers'][UkuConstants.topColumnModifiers[i]] = {};
		}

		for (var i = 0; i < UkuConstants.bottomColumnModifiers.length; i++) {
			this.data['colmodifiers'][UkuConstants.bottomColumnModifiers[i]] = {};
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

	return {
		NoteCell: TabsData.NoteCell,
		EmptySection: TabsData.EmptySection,
		YoutubeSection: TabsData.YoutubeSection,
		TextSection: TabsData.TextSection,
		Song: TabsData.Song,
		TabSection: TabsData.TabSection
	} 
});