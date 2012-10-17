/*	
*	Weever Geotagger, for Joomla
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
var fieldid;

jQuery(document).ready(function(){ 

	jQuery('#wmx-select-marker').click(function(event) {
	
		fieldid = 'wmx-marker-url';	
		event.preventDefault();
		SqueezeBox.initialize();
		SqueezeBox.fromElement(this, {
			handler: 'iframe',
			url: 'index.php?option=com_media&view=images&tmpl=component&fieldid=wmx-marker-url',
			size: {x: 800, y: 434}
		});
		
	});


	jQuery('#wmx-marker-change-icon').click(function(event) {
	
		fieldid = 'wmx-marker-icon';
		event.preventDefault();
		SqueezeBox.initialize();
		SqueezeBox.fromElement(this, {
			handler: 'iframe',
			url: 'index.php?option=com_media&view=images&tmpl=component&fieldid=wmx-marker-icon',
			size: {x: 800, y: 434}
		});
		
	});
	
});


// override the com_media update function
// will be renamed via view.html.php footer script

var _jInsertFieldValue = function(value, id) {
	
	var image = "/"+value;
	
	if(fieldid == 'wmx-marker-url') {
		
		wmx.mapImages.icon = new google.maps.MarkerImage(
		                image,
		                new google.maps.Size(32, 37),
		                new google.maps.Point(0,0),
		                new google.maps.Point(16, 37),
		                new google.maps.Size(64, 37)
		              );
		              
		jQuery('#wmx-marker-image').attr('src', image);
	
	} 
	else if(fieldid == "wmx-marker-icon") {
	
		wmx.selectedMarker.setIcon(	
			new google.maps.MarkerImage(
		        image,
		        new google.maps.Size(32, 37),
		        new google.maps.Point(0,0),
		        new google.maps.Point(16, 37),
		        new google.maps.Size(64, 37)
		   )
		);
			
	}
	
	jInsertFieldValue_(value, id);
	
}
