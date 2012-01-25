var wmx = wmx || {};

wmx.txt = {};

// define localized text strings
wmx.localText = {

	"WEEVERMAPS_ERROR_NO_RESULTS": 	'WEEVERMAPS_ERROR_NO_RESULTS',
	"WEEVERMAPS_CONFIRM_CLOSE": 	'WEEVERMAPS_CONFIRM_CLOSE'
	
};

// input fields for form
wmx.inputField = {

	latitude: '#pluginsweevermapsk2latitude_item',
	longitude: '#pluginsweevermapsk2longitude_item',
	address: '#pluginsweevermapsk2address_item',
	label: '#pluginsweevermapsk2label_item',
	marker: '#pluginsweevermapsk2marker_item',
	kml: '#pluginsweevermapsk2kml_item'

}

// definitions set at document ready

jQuery(document).ready(function(){ 

	// our localized text object loader
	wmx._textLoader = Joomla.JText;

});

