define(['editor/tabsection', 'app/utils'], function(TabsSection, Utils) {
	'use strict';

	var Editor = function(song) {
		this._init(song);
	}

	function getOffsetFromId(id) {
		var matches = id.match(/\[(.*?)\]/);

		if (matches) {
			return parseInt(matches[1]);
		}

		return -1;
	}

	Editor.prototype = {
		setEditorMode: function(editorMode, showSongInfo) {
			if (editorMode) {
				if (!showSongInfo) {
					$("#songdata").hide();
				}

				$("a[data-tab='file']").hide();
				$("#header-title").hide();
				$("#footer-title").show();
			}
		},

		reset: function(deleteInfo) {
			if(typeof(deleteInfo) === 'undefined') {
				deleteInfo = true;
			}

			this.numSections = 0;
			this.htmlSections = [];

			$("#text-editor-base").append($("#tabs-context-menu").hide());
			$("#text-editor-base").append($("#empty-context-menu").show());

			$("#text-editor").html("");
			$("#pretty-tab").html("");

			if (deleteInfo) {
				$("#songdata #song,#songdata #artist,#songdata #transcriber").val("").change();
			} else {
				$("#songdata #song,#songdata #artist,#songdata #transcriber").val("");
			}

			this.updateText();
	  },

		appendLoadedSection: function(id, type, data) {
			var newId = id;
			var prevId = newId - 1;

			var typeNode = $("[id='block']." + type);
			var newNode = typeNode.clone();

			var newPrettyNode;
			if (this.numSections == 0) {
				$("#text-editor").append(newNode);
				newPrettyNode = $('<div data-id="0"></div>');
	 			$("#pretty-tab").append(newPrettyNode);
			} else {
				newPrettyNode = $('<div data-id="' + newId + '"></div>');
				newPrettyNode.insertAfter($("#pretty-tab div[data-id='" + prevId + "']"));
				var obj = $("[id='block[" + prevId + "]']");
				newNode.insertAfter(obj);
			}

			newPrettyNode = newPrettyNode[0];

			newNode.attr("id","block[" + this.numSections + "]");
			newNode.attr("data-id", this.numSections);
			newNode.show();

			if ($("#empty-context-menu").is(":visible")) {
				this.contextMenu = $("#empty-context-menu").clone();
				this.contextMenu.attr("id", "context-menu");
				this.contextMenu.show();
				$("#empty-context-menu").hide();
				this.contextMenu.find("#remove_section").show();
			}
			else {
				this.contextMenu = $("#context-menu");
			}

			var td = null;
			var newSection = null;

			if (type == "text") {
				newNode.find("textarea").autosize().focus();
				newSection = new KORDS.TABSEDITOR.TextSection(newNode, newPrettyNode, this,data);
			} else if (type == "tabs") {
				this.contextMenu.find("#add_text").show();
				newSection = new KORDS.TABSEDITOR.TabsSection(newNode, newPrettyNode, this,data);
				td = newNode.find("td[data-col='0'][data-row='0']");
			} else if (type == "youtube") {
				this.contextMenu.find("#add_text").show();
				newSection = new KORDS.TABSEDITOR.YoutubeSection(newNode, newPrettyNode, this,data);
			} else {
				alert("NO TYPE");
			}

			this.htmlSections.splice(newId, 0, newSection);

			newNode.append(this.contextMenu);
			this.reOrderIds();
			this.setActiveSection(newNode,td);
			this.updateText();

			this.numSections++;
		},

		load: function(song) {
			this.reset(false);

			this.song = song;

			$("#songdata #song").val(this.song.data.info.title).change();
			$("#songdata #artist").val(this.song.data.info.artist).change();
			$("#songdata #transcriber").val(this.song.data.info.transcriber).change();

			var len = this.song.data.sections.length;
			for (var i = 0; i < len; i++) {
				var section = this.song.data.sections[i];
				this.appendLoadedSection(i, section.type, section);
			}
		},

		loadFromParser: function(sections) {
			var prevNode = null;
			if ($("#empty-context-menu").is(":visible")) {
				this.contextMenu = $("#empty-context-menu").clone();
				this.contextMenu.attr("id", "context-menu");
				this.contextMenu.show();
				$("#empty-context-menu").hide();
				this.contextMenu.find("#remove_section").show();
			}

			for (var i = 0; i < sections.length; i++) {
				var typeNode = $("[id='block']." + sections[i].type);
				var newNode = typeNode.clone();

				if (this.numSections == 0) {
					$("#text-editor").append(newNode);
				} else {
					newNode.insertAfter(prevNode);
				}

				newNode.attr("id","block[" + this.numSections + "]");
				newNode.attr("data-id", this.numSections);
				newNode.show();
				newNode.append(this.contextMenu);
				prevNode = newNode;

				if (sections[i].type == "text") {
					newNode.find("textarea").val(sections[i].val).autosize();
					this.htmlSections.push(new KORDS.TABSEDITOR.TextSection(newNode, this.updateText));
				} else {
					for (var j = 0; j < sections[i].val.length; j++) {
						var rowHtml = newNode.find("tr:eq(" + j +")");
						var line = sections[i].val[j];
						for (var k = 0; k < line.length; k++) {
							var modifiers=['h', 'p', 's', 'b', 'v', '/', '\\'];

							if (line[k] != "-") {
								var val = line[k];
								if (modifiers.indexOf(line[k]) == -1) {
									val = parseInt(line[k], 25);
									//console.log("NO Está",line[k]);
								} else {
									//console.log("Está",line[k]);
								}
								rowHtml.find("td:eq(" + (k + 1) + ")").html(val);
							}
						}
					}
					this.htmlSections.push(new KORDS.TABSEDITOR.TabsSection(newNode,this));
				}

				this.numSections++;
			}
		},

		setActiveSection: function(sectionHtml, td) {
			$(".tabsection.active").find(".active_cell").removeClass("active_cell");
			$(".tabsection.active").find(".active_column").removeClass("active_column");
			$(".tabsection.active").removeClass("active");

			sectionHtml.addClass("active");

			$("#menu-tabs-text").insertBefore(sectionHtml);
			$("#menu-tabs-text").show();

			if (td) {
				var id = sectionHtml.attr("data-id");
				this.htmlSections[id].updateCurrentCursor(td.attr("data-col"), td.attr("data-row"));
			}

			if (sectionHtml.hasClass("tabs")) {
				$("#tabs-context-menu").show().insertBefore(sectionHtml);
			} else {
				$("#tabs-context-menu").hide();
			}
		},

		getCurrentSection: function() {
			var active=$(".tabsection.active");
			if (active.length > 0) {
				var id = getOffsetFromId(active.attr("id"));
				return this.htmlSections[id];
			}

			return null;
		},

		//@fixme Use current section
		onKeyDown: function(e) {
			var active = $(".tabsection.active");
			if (active.length > 0) {
				var id = getOffsetFromId(active.attr("id"));
				return this.htmlSections[id].onKeyDown(e);
			}

			return true;
		},

		paint: function() {
			for (var s in this.htmlSections) {
				//console.log(">>>>>>>>",s);
				this.htmlSections[s].paint();
			}
		},

		changeSongTitle: function(value) {
			if (value == "") {  
				value=null;
			}

			this.song.data.info.title = value;
			$("#title_song").html(value);
			this.updateText();
		},

		changeSongArtist: function(value) {
			if (value == ""){
				value = null;
			}

			this.song.data.info.artist = value;
			$("#title_artist").html(value);

			this.updateText();
		},

		changeSongTranscriber: function(value) {
			if (value == "") {
				value=null;
			}

			this.song.data.info.transcriber = value;

			$("#title_transcriber").html(value);

			this.updateText();
		},

		updateText: function() {
			var text = "";
			if (this.song.data.info.title != null) {
				text += "SONG: " + this.song.data.info.title + "\n";
			}

			if (this.song.data.info.artist != null) {
				text += "ARTIST: " + this.song.data.info.artist + "\n";
			}

			if (this.song.data.info.artist !=null) {
				text += "TRANSCRIBED BY: " + this.song.data.info.transcriber + "\n";
			}
			text += "\n";

			for (var i in this.htmlSections) {
				text += this.htmlSections[i].getText() + "\n";
			}

			$("#ascii-text").val(text);

			this.paint();
		},

		addSection: function(obj, type) {
			var parentId = parseInt(obj.attr("data-id"));
			var newId = Utils.isNumber(parentId) ? parentId + 1 : 0;

			var typeNode = $("[id='block']." + type);
			var newNode = typeNode.clone();

			var newPrettyNode;
			if (this.numSections == 0) {
				$("#text-editor").append(newNode);
				newPrettyNode = $('<div data-id="0"></div>');
	 			$("#pretty-tab").append(newPrettyNode);
			} else {
				newPrettyNode = $('<div data-id="' + newId + '"></div>');
				newPrettyNode.insertAfter($("#pretty-tab div[data-id='" + parentId + "']"));
				newNode.insertAfter(obj);
			}

			newPrettyNode = newPrettyNode[0];

			newNode.attr("id", "block[" + this.numSections + "]");
			newNode.attr("data-id", this.numSections);
			newNode.show();

			if ($("#empty-context-menu").is(":visible")) {
				this.contextMenu = $("#empty-context-menu").clone();
				this.contextMenu.attr("id", "context-menu");
				this.contextMenu.show();
				$("#empty-context-menu").hide();
				this.contextMenu.find("#remove_section").show();
			} else {
				this.contextMenu = $("#context-menu");
			}

			var td = null;
			var newSection = null;

			if (type == "text") {
				newNode.find("textarea").autosize().focus();
				newSection = new TextSection(newNode, newPrettyNode,this);
			} else if (type == "tabs") {
				this.contextMenu.find("#add_text").show();
				newSection = new TabsSection.TabsSection(newNode, newPrettyNode, this);
				td = newNode.find("td[data-col='0'][data-row='0']");
			} else if (type == "youtube") {
				this.contextMenu.find("#add_text").show();
				newSection = new YoutubeSection(newNode, newPrettyNode,this);
			} else {
				alert("NO TYPE");
			}

			this.song.addSection(newId, newSection.sectionData);
			this.htmlSections.splice(newId, 0, newSection);
			//console.log(type,newId,this.htmlSections);

			newNode.append(this.contextMenu);
			this.reOrderIds();
			this.setActiveSection(newNode, td);
			this.updateText();

			//newNode[0].scrollIntoView(true);
			//$("#scroll").scrollTo('100%');
			//http://plugins.jquery.com/project/ScrollTo
			$(".hover").removeClass("hover");
			this.numSections++;
		},

		removeSection: function(obj) {
			var sectionId = obj.attr("data-id");

			this.htmlSections[sectionId].removeHtml();
			this.htmlSections.splice(sectionId, 1);

			this.numSections--;

			var next = obj.next(".tabsection");
			if (!next.exists()) {
				next = obj.prevAll(".tabsection:first");
			}

			if (obj.hasClass("hover")) {
				if (next) {
					next.addClass("hover");
					next.append($("#context-menu"));
				} else {
					$("#text-editor").append($("#context-menu"));
				}
			}

			if (obj.hasClass("active")) {
				if (next) {
					this.setActiveSection(next);
				} else {
					this.setActiveSection(obj.prev());
				}
			}

			obj.remove();
			this.reOrderIds();
			this.updateText();

			if (this.numSections == 0) {
				$("#empty-context-menu").show();
			}
		},

		reOrderIds: function () {
			$(".tabsection:visible").each(function(index, element) {
				$(element).attr("id", "block[" + index + "]");
				$(element).attr("data-id", index);
			});
		},

		_init: function(song) {
			this.showSongInfo = true;

			this.song = song;
			this.numSections = 0;
			this.htmlSections = [];

			this.contextMenu = null;

			// create element !!!!!!!!!!!!
			this.prettyDivId = "pretty-tab";
			this.prettyTabsDiv = document.getElementById(this.prettyDivId);

			this.prevActiveTabBlock = null;

			TabsSection.insertTabBlock();

			// Insert chords
			var html = '';
			for (var mode in UkuConstants.chords) {
				html += '<optgroup label="' + mode + '"/>';
				for (var chord in UkuConstants.chords[mode]){
					html += '<option mode="' + mode + '" value="' + chord + '">' + chord + '</option>';
				}
			}
			$("#chords").html(html);

			this._initEventHandler();
		},

		_initEventHandler: function() {
			var self = this;

			//@fixme put everything together
	    $(document).on("click", "#add_youtube", function() {
				self.addSection($(this).parents(".tabsection"), 'youtube');
				return false;
			});

	    $(document).on("click", "#add_text", function() {
				self.addSection($(this).parents(".tabsection"), 'text');
				return false;
			});

			$(document).on("click", "#add_tabs", function() {
				self.addSection($(this).parents(".tabsection"), 'tabs');

				$(".active .tabblock").focus();
				return false;
			});

			$(document).on("click", ".tabblock tr.string td", function() {
				self.setActiveSection($(this).parents(".tabsection"), $(this));
		  });

			$(document).on("focus", ".tabtext", function() {
				self.setActiveSection($(this).parents(".tabsection"));
			});

			$(document).on("blur", ".tabtext", function() {
				//$(this).parents(".tabsection").removeClass("active");
				//$("#context-menu").hide();
			});

			$(document).on("mouseenter", "div.tabsection", function() {
				$(this).removeClass("hover").addClass("hover");
				$(this).find(".tabs-editor-context-menu").show();
				$(this).append($("#context-menu").show());
				if ($(this).hasClass("text")) {
					self.contextMenu.find("#add_text").hide();
				}
				else {
					self.contextMenu.find("#add_text").show();
				}
			});

			$(document).on("mouseleave", "div.tabsection", function() {
				$(this).removeClass("hover");
				$("#context-menu").hide();
			});

			$(document).on("click", "#remove_section", function() {
				self.removeSection($(this).parents(".tabsection"));
			});

			$("#insert-chords").click(function() {
				var id = parseInt($(".tabsection.active").attr("data-id"));
				var selected = $("#chords").find(":selected");
				self.htmlSections[id].insertChord(selected.attr("value"),selected.attr("mode"));
				self.prevActiveTabBlock.focus();
				return false;
			});

			$(".modifier").click(function() {
				var id=parseInt($(".tabsection.active").attr("data-id"));
				self.htmlSections[id].insertModifier($(this).attr("data-modifier"));
				return false;
			});

			$(document).on("blur", ".tabblock", function(e) {
				self.prevActiveTabBlock = $(this);
			});

			//@fixme
			$(document).on("keydown", ".tabblock", function(e) {
				return tabsInstance.tabsEditor.onKeyDown(e);
    	});

			$(document).on("keyup", ".tabtext", function(e) {
				return tabsInstance.tabsEditor.onKeyDown(e);
    	});

			$(document).on('click', '.youtube_edit', function() {
				var parent = $(this).parents(".tabsection");
				$(".youtube_edit_data", parent).show();
				$(".youtube_title", parent).hide();
				return false;
			});

	    $(document).on('click', '.loadyoutube', function() {
				self.setActiveSection($(this).parents(".tabsection"));
	    	self.getCurrentSection().loadYoutubeLink();
		    return false;
	    });

	    $("#songdata #song").change(function() {
				self.changeSongTitle($(this).val());
			});

			$("#songdata #artist").change(function() {
				self.changeSongArtist($(this).val());
			});

			$("#songdata #transcriber").change(function() {
				self.changeSongTranscriber($(this).val());
			});

			$("#lfingers a").click(function() {
				var id = parseInt($(".tabsection.active").attr("data-id"));
				var finger = $(this).attr("data-modifier").replace("lfinger", "");
				self.htmlSections[id].setLFingerValue(finger);
				return false;
			});

			$("#open-tabtext").click(function() {
				var id = parseInt($(".tabsection.active").attr("data-id"));
				self.htmlSections[id].showTextDialog();
				return false;
			});

			$(".colmodifier").click(function() {
				var id = parseInt($(".tabsection.active").attr("data-id"));
				self.htmlSections[id].insertColumnModifier($(this).attr("data-modifier"));
				return false;
			});

			$("#parse_tab").click(function(){
				var parser = new KORDS.TABS.TabParser($("#text").val());
				self.loadFromParser(parser.parse());
				return false;
			});
		}
	}

	return Editor;
});