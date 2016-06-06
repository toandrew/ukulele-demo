define(function() {
	'use strict';

	function nvl(value1, value2) {
		return value1 ? value1 : value2;
	}

	function sluggify(text) {
		return text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
	}

	$.fn.exists = function () {
		return this.length !== 0;
	}

	function sortObj(arr) {
		// Setup Arrays
		var sortedKeys = new Array();
		var sortedObj = {};

		// Separate keys and sort them
		for (var i in arr) {
			sortedKeys.push(i);
		}
		sortedKeys.sort();

		// Reconstruct sorted obj based on keys
		for (var i in sortedKeys) {
			sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
		}

		return sortedObj;
	}

	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	String.prototype.removeCharAt = function (index) {
		return this.substr(0, index) + this.substr(index + 1);
	}

	String.prototype.replaceAt = function(index, char) {
		return this.substr(0, index) + char + this.substr(index + char.length);
	}

	function objectSize (obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				size++;	
			} 
		}

		return size;
	};

	return {
		nvl: nvl,
		sluggify: sluggify,
		sortObj: sortObj,
		isNumber: isNumber,
		objectSize: objectSize
	};
});