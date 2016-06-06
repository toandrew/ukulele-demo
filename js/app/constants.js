(function (exports) {
	var UkuConstants = {
		defaultNumMeasuresPerStave: 4,
		defaultNumNotesPerMeasure: 12,
		maxFrets: 24,
		//tabBlockLength: this.defaultNumNotesPerMeasure * this.defaultNumMeasuresPerStave + this.defaultNumMeasuresPerStave - 1, // Num notes per stave + barlines$.parseXML('XML');
		tabBlockText: "",
		tabBlockNotes: ["E", "B", "G", "D", "A", "E"],
		//tabBlockNumStrings: this.tabBlockNotes.length,
		topColumnModifiers: ["text", "accents", "arrows"],
		bottomColumnModifiers: ["rfingers"],

		TYPE_NOTE: 0,
		TYPE_LFINGER: 1,
		TYPE_BOTH: 2,

		EMPTY_NOTE: "",
		EMPTY_NOTE_HTML: "",

		staveWidth: 800,

		chords: {
			"Major": {
				"A": "002220",
				"A#": "688766",
				"B": "799877",
				"C": "032010",
				"C#": "99ABB9",
				"D": "XX0232",
				"D#": "BBCDDB",
				"E": "022100",
				"F": "133211",
				"F#": "244322",
				"G": "320003",
			},
			"Minor": {
				"Am": "002210",
				"Am#": "X13321",
				"Bm": "X24432",
				"Cm": "XX5543",
				"Cm#": "X46654",
				"Dm": "XX0231",
				"Dm#": "2X134X",
				"Em": "022000",
				"Fm": "XX3111",
				"Fm#": "244222",
				"Gm": "XX5333",
				"Gm#": "X21144"
			}
		},

		getTabBlockLength: function() {
			return UkuConstants.defaultNumNotesPerMeasure * UkuConstants.defaultNumMeasuresPerStave + UkuConstants.defaultNumMeasuresPerStave - 1;
		},

		getTabBlockNumStrings: function() {
			return UkuConstants.tabBlockNotes.length;
		}
	}
	
	exports.UkuConstants = UkuConstants;
})(window);