/*	
*	Weever Geotagger Core
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



jQuery(document).ready(function(){ 
	
	wmx.txt = {
	
		_: function(text) {
			return wmx._textLoader._(wmx.localText[text]);
		}
	
	}
 			
	jQuery('#wmx-address-geocode').click(function(event){
	
		wmx.address = jQuery('input#wmx-address-input').val();
		wmx.getGeocode(wmx.address, function() {
		
			wmx.mapCenter();
		
		});
	
	});
	
	jQuery('#wmx-address-input').click(function() {
	
		if(this.value == this.defaultValue)
	    {
			this.select();
		}
	
	});
	
	jQuery('#wmx-address-input').focus(function() {
	
		if(this.value == this.defaultValue)
	    {
			this.select();
		}
	
	});
	
	jQuery("input#wmx-address-input").bind("keyup", function (e) {
	
		var addressInput = jQuery("#wmx-address-input");
	
		if ( !addressInput.val() || addressInput.val() == addressInput[0].defaultValue )
			jQuery("#wmx-address-add-marker").attr("disabled","disabled");
		else
			jQuery("#wmx-address-add-marker").removeAttr("disabled");
			
	});
	
	jQuery("input#wmx-address-input").bind("keypress", function (e) {
	
	    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
	        jQuery('button#wmx-address-geocode').click();
	        return false;
	    } else {
	        return true;
	    }
	    
	});
	
	jQuery("input#wmx-marker-label-input").bind("keypress", function (e) {
	
	    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
	        jQuery('#wmx-marker-dialog').dialog('close');
	        return false;
	    } else {
	        return true;
	    }
	    
	});
	
	
	jQuery('#wmx-latlong-add-marker').click(function(event){
	
		wmx.position = new google.maps.LatLng( 
			jQuery('input#wmx-lat-hover').val(), 
			jQuery('input#wmx-long-hover').val() 
		);
	
		wmx.map.setCenter(wmx.position);
		wmx.addMarker(wmx.position);
		
		if(wmx.pin instanceof google.maps.Marker)
			wmx.pin.setMap(null);
	
	});
	
	jQuery('#wmx-latlong-location').click(function(event){
	
		wmx.position = new google.maps.LatLng( 
			jQuery('input#wmx-lat-hover').val(), 
			jQuery('input#wmx-long-hover').val() 
		);

		wmx.mapCenter();
	
	});

	jQuery('#wmx-address-add-marker').click(function(event){
	
		var address = jQuery('input#wmx-address-input').val();
		
		if(address == wmx.address)
		{
		
			wmx.map.setCenter(wmx.position);
			wmx.addMarker(wmx.position, address);
			
			if(wmx.pin instanceof google.maps.Marker)
				wmx.pin.setMap(null);
		
		}
		else 
		{
			
			wmx.getGeocode(wmx.address, function() {
			
				wmx.map.setCenter(wmx.position);
				wmx.addMarker(wmx.position);
				
				if(wmx.pin instanceof google.maps.Marker)
					wmx.pin.setMap(null);
			
			});
			
		}
		
	});


	jQuery("<div id='wmx-geocoder-launch'>GeoTag</div>").insertAfter("#jform_featured");

	jQuery('#wmx-marker-label-input').keyup(function(e) {
	
		if( jQuery('#wmx-marker-label-input').val() == "" ) {
		
			wmx.selectedMarker.set('labelContent', "");
			wmx.selectedMarker.set('labelStyle', {opacity: 0});
		
		} else {
		
			wmx.addLabel();
		
		}
	
	});
	
	jQuery('#wmx-marker-delete').click(function(e) {
	
		wmx.selectedMarker.setMap(null);
		wmx.removeMarker(wmx.selectedMarker);
		jQuery('#wmx-marker-dialog').dialog('close');
	
	});
	
	jQuery('#wmx-add-kml').click(function(e) {
	
		jQuery('#wmx-kml-dialog').dialog({
		
			resizable: false,
			height:140,
			modal: true,
			buttons: {
				"Load KML File": function() {
					
					if(wmx.KmlLayer instanceof google.maps.KmlLayer)
						wmx.KmlLayer.setMap(null);
						
					wmx.KmlLayer = new google.maps.KmlLayer( jQuery('#wmx-kml-url').val() )
					wmx.KmlLayer.setMap(wmx.map);
					
					jQuery( this ).dialog( "close" );
					
				},
				Cancel: function() {
					jQuery( this ).dialog( "close" );
				}
			}
		
		});
	
	});
	
	jQuery('#wmx-gps-location').click(function(e) {
	
		var success = function(position) {
		
			wmx.position = new google.maps.LatLng( 
				position.coords.latitude, 
				position.coords.longitude 
			);
			  
			wmx.mapCenter();
		
		}
		
		var error = function(msg) {
		
			alert('Error: ' + msg);
		
		}
	
		if (navigator.geolocation)		
			navigator.geolocation.getCurrentPosition(success, error);
		else
			alert('geolocation not supported');

	});
	
	jQuery('#wmx-about-plugin').click(function(e) {
	
		e.preventDefault();
		
		jQuery("#wmx-about-plugin-dialog").dialog({
			modal: true, 
			resizable: false,
			width: 'auto',
			height: 'auto',
			buttons: {
				Done: function() {
					jQuery(this).dialog( "close" );
				}		
			}
		}); 
	
	});
	
	jQuery('#wmx-geocoder-launch').click(function(e) {
	
		e.preventDefault();
		
		var loadDialog = function() {
					
			var	myOptions = {
			          center: new google.maps.LatLng(43.243603, -79.889074),
			          zoom: 8,
			          mapTypeId: google.maps.MapTypeId.ROADMAP
			        };
			        
			if(wmx.map instanceof google.maps.Map)
			{
			
				setTimeout(function() {
					google.maps.event.trigger(wmx.map, 'resize');
				}, 350);
				
			}
			else 
			{
				
				wmx.map = new google.maps.Map(document.getElementById("wmx-map"), myOptions);
				wmx.getSettings();
				
			}
				
			google.maps.event.addListener(wmx.map, 'mousemove', function(event) {
			
				document.getElementById('wmx-lat-hover').value = event.latLng.lat();
				document.getElementById('wmx-long-hover').value = event.latLng.lng();
			
			}); 
			
			google.maps.event.addListener(wmx.map, 'click', function(event) {
			
				wmx.addMarker(event.latLng);
				
			}); 
			
		}
		
	
		jQuery("#wmx-dialog").dialog({
			modal: true, 
			resizable: false,
			width: 'auto',
			height: 'auto',
			buttons: {
				Cancel: function() {
					jQuery(this).dialog( "close" );
				},
				"Save Changes": function() {
					wmx.saveSettings();
					jQuery(this).dialog( "close" );
					wmx.safeClose = false;
				},			
			},
			open: loadDialog(),
			beforeClose: function() {
			
				if(wmx.safeClose == undefined || wmx.safeClose == false)
					return confirm(wmx.txt._('WEEVERMAPS_CONFIRM_CLOSE'));
			
			}
		}); 
	
	
	});
		
	
	
});



