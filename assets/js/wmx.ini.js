var wmx = wmx || {};

// define localized text strings
wmx.localText = []

wmx.localText["WEEVERMAPS_ERROR_NO_RESULTS"] 			=	'WEEVERMAPS_ERROR_NO_RESULTS';
wmx.localText["WEEVERMAPS_CONFIRM_CLOSE"] 				=	'WEEVERMAPS_CONFIRM_CLOSE';

// set the localization object
wmx._txt = function(text) {	Joomla.JText._( wmx.localText[text] ); }

// input fields for form
wmx.inputField = {

	latitude: '#pluginsweevermapsk2latitude_item',
	longitude: '#pluginsweevermapsk2longitude_item',
	address: '#pluginsweevermapsk2address_item',
	label: '#pluginsweevermapsk2label_item',
	marker: '#pluginsweevermapsk2marker_item',
	kml: '#pluginsweevermapsk2kml_item'

}