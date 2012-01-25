/*	
*	Weever Geotagger for K2
*	(c) 2012 Weever Apps Inc. <http://www.weeverapps.com/>
*
*	Author: 	Robert Gerald Porter <rob@weeverapps.com>
*	Version: 	0.2
*   License: 	GPL v3.0
*
*   This extension is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This extension is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details <http://www.gnu.org/licenses/>.
*
*/

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

