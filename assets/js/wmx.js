/*	
*	Weever Geotagger Core 
*	(c) 2012 Weever Apps Inc. <http://www.weeverapps.com/>
*
*	Author: 	Robert Gerald Porter <rob@weeverapps.com>
*	Version: 	0.3
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

Array.prototype.remove = function(){
    var what, a = arguments, L = a.length, ax;
    while(L && this.length){
        what = a[--L];
        while((ax= this.indexOf(what)) != -1){
            this.splice(ax, 1);
        }
    }
    return this;
}

// for IE8 and below
if(!Array.prototype.indexOf){
    Array.prototype.indexOf = function(what, i){
        i = i || 0;
        var L = this.length;
        while(i < L){
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    }
}


wmx.addMarker = function(position, address, labelContent, icon) {

	wmx.markers = wmx.markers || [];
	
	var	icon 	= icon || wmx.mapImages.icon,
		hash 	= Math.floor((position.lat() + position.lng()) * 10000);

	var marker = new MarkerWithLabel({
	
	       position: 		position,
	       draggable: 		true,
	       map: 			wmx.map,
	       icon: 			icon,
	       address: 		address,
	       labelId: '		wmx-label-'+hash
	       
	     });
	     
	if( labelContent ) 
		wmx.addLabel( marker, labelContent );
	     
	wmx.markers.push( marker );
	
	google.maps.event.addListener(
	    marker,
	    'drag',
	    function() {
	    
	    	marker.setIcon(wmx.mapImages.selected);
	    	
	    }
	);
	
	google.maps.event.addListener(
	    marker,
	    'dragend',
	    function() {
	    
	    	marker.setIcon(wmx.mapImages.icon);
	        jQuery('#wmx-long-hover').val( position.lng() );
	        jQuery('#wmx-lat-hover').val( position.lat() );
	        
	    }
	);
	
	google.maps.event.addListener(
	    marker,
	    'dblclick',
	    function() {

	        jQuery('#wmx-long-hover').val( position.lng() );
	        jQuery('#wmx-lat-hover').val( position.lat() );
	        
	        wmx.selectedMarker = marker;
	        
	        jQuery('#wmx-marker-dialog').dialog({
	        
	        	modal: 			true, 
	        	resizable: 		false,
	        	width: 			'auto',
	        	height: 		'auto',
	        	buttons: 		{
	        	
	        		"Done": 	function() {
	        		
	        			marker.set('address', jQuery('#mwx-marker-address-input').val() )
	        			jQuery(this).dialog( "close" );
	        			
	        		}
	        					
	        	},
	        	open: 			function(e, ui) {
	        	
	        		jQuery('#wmx-marker-label-input').val( marker.get('labelContent') );
	        		jQuery('#mwx-marker-address-input').val( marker.get('address') );
	        	
	        	}
	        		        	
	        });
	        
	    }
	    
	);
	
}

wmx.removeMarker = function(marker) {

	for(i=0; i<wmx.markers.length; i++) {
	
		if(wmx.markers[i] == marker)
			wmx.markers.remove(marker);
	
	}


}

wmx.addLabel = function(marker, labelContent) {

	var marker 			= marker || wmx.selectedMarker,
		labelContent 	= labelContent || jQuery('#wmx-marker-label-input').val(),
		hash 			= Math.floor((marker.position.lat() + marker.position.lng()) * 10000);
	
	marker.set('labelContent', labelContent );
	
	// Timeout for when launching window with pre-existing labels.
	setTimeout(function() {
	
		var point = ((jQuery('#wmx-label-'+hash).width() + 10) / 2) - 1;
		
		if(point < 5)
			point = 22;
		
		marker.set('labelAnchor', new google.maps.Point(point, 0));
		marker.set('labelClass', 'wmx-label');
		marker.set('labelStyle', {opacity: 0.75});
	
	}, 750);
	

}

wmx.getGeocode = function(address, callback) {
	
   	var geocoder = new google.maps.Geocoder();
   	var callback = callback;
   	
   	geocoder.geocode({'address': address}, function(results, status) {
   		
   		if(status == google.maps.GeocoderStatus.OK) {
   		
   			wmx.position = results[0].geometry.location;

   			callback();
   			
   		} else {
   		
   			console.log("Geocoding was not successful for the following reasons: " + status);
   			
   			if(status == "OVER_QUERY_LIMIT")
   			{
   				alert("Error: You have somehow reached the limit for geocoding addresses into coordinates. Wait a few seconds and try again.");
   				
   			}
   				
   			if(status == "ZERO_RESULTS")
   			{
   				alert(wmx.txt._('WEEVERMAPS2_ERROR_NO_RESULTS')+address);
   			}
   		
   		}
   			
   	});
}
 
 
wmx.mapCenter = function() {

	wmx.map.setCenter(wmx.position);
	
	if(wmx.pin instanceof google.maps.Marker)
		wmx.pin.setMap(null);
	
	wmx.pin = new google.maps.Marker({
	
	    position: 		wmx.position, 
	    map: 			wmx.map,
	    icon: 			wmx.mapImages.pin,
	    draggable:		false
	    
	});

}


wmx.setMarkerIconDefault = function(el) {

	var image = el.value;
	
	wmx.mapImages.icon = new google.maps.MarkerImage(
	                image,
	                new google.maps.Size(32, 37),
	                new google.maps.Point(0,0),
	                new google.maps.Point(16, 37),
	                new google.maps.Size(64, 37)
	              );
	              
	jQuery('#wmx-marker-image').attr('src', image); 

}


wmx.setMarkerIcon = function(el) {

	wmx.selectedMarker.setIcon(	
		new google.maps.MarkerImage(
	        el.value,
	        new google.maps.Size(32, 37),
	        new google.maps.Point(0,0),
	        new google.maps.Point(16, 37),
	        new google.maps.Size(64, 37)
	   )
	);

};

wmx.mapImages = {

	icon: new google.maps.MarkerImage(
	                'http://weeverapp.com/media/sprites/default-marker.png',
	                new google.maps.Size(32, 37),
	                new google.maps.Point(0,0),
	                new google.maps.Point(16, 37),
	                new google.maps.Size(64, 37)
	              ),              
	selected: new google.maps.MarkerImage(
	                'http://weeverapp.com/media/sprites/default-marker.png',
	                new google.maps.Size(32, 37),
	                new google.maps.Point(32,0),
	                new google.maps.Point(16, 37),
	                new google.maps.Size(64, 37)
	              ),
	pin: new google.maps.MarkerImage(
	                '/media/plg_WEEVERMAPS2/images/point.png',
	                new google.maps.Size(32, 31),
	                new google.maps.Point(0,0),
	                new google.maps.Point(16, 31)
	              )        
	                    
}

wmx.newMarkerImage = function(spriteUrl) {

	return new google.maps.MarkerImage(
	                spriteUrl,
	                new google.maps.Size(32, 37),
	                new google.maps.Point(0,0),
	                new google.maps.Point(16, 37),
	                new google.maps.Size(64, 37)
	              );

}

wmx.latLongBounds 	= new google.maps.LatLngBounds();

wmx.clearMap = function() {

	if( !!!wmx.markers )
		return;

	for( var i=0; i<wmx.markers.length; i++ ) {
	
		wmx.markers[i].setMap( null );
		
	}
	
	wmx.markers = [];
	
	!!wmx.KmlLayer && wmx.KmlLayer.setMap( null );
	
	wmx.latLongBounds 	= new google.maps.LatLngBounds();

}

wmx.getRemoteSettings	= function(callback) {

	var xmlhttp 		= new XMLHttpRequest(),
		xmlhttpCall		= Joomla.comWeeverConst.server + "api/v2/tabs/get_geo?tab_id=" + wmx.remoteId + "&app_key=" + wmx.remoteKey,
		geo,
		geoCallback		= function( responseText ) {
		
			geo = JSON.parse( responseText ).geo || null;
			
			if( !geo )
				return;
				
			if( !geo instanceof Array )
				geo = [geo];
				
			for( i = 0; i < geo.length; i++ ) {
			
				if( !!geo[i].kml ) {
				 
					jQuery('#wmx-kml-url').val( geo[i].kml );
					 
					wmx.KmlLayer = new google.maps.KmlLayer( jQuery('#wmx-kml-url').val() );
					
					wmx.KmlLayer.setMap( wmx.map );
					
				}

				if( !geo[i].latitude && !geo[i].longitude )
					continue;
			
				wmx.addMarker( 
				
					new google.maps.LatLng( 
					
						geo[i].latitude, 
						geo[i].longitude
						
					),
					null, // address line (unused)
					geo[i].label,
					wmx.newMarkerImage( geo[i].marker_url )						
				
				);
				
				wmx.latLongBounds.extend( new google.maps.LatLng( geo[i].latitude, geo[i].longitude) );
				
				setTimeout( callback, 350 );

			}
		
		};
	
	xmlhttp.open("GET", xmlhttpCall );	
	xmlhttp.send();


	xmlhttp.onreadystatechange = function()	{
	
		if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) 
			geoCallback( xmlhttp.responseText );
		
	}

}

wmx.getSettings = function() {

	var latitude 		= wmx.inputField.latitude,
		longitude 		= wmx.inputField.longitude,
		address	 		= wmx.inputField.address,
		label 			= wmx.inputField.label,
		markerId 		= wmx.inputField.marker,
		kml 			= wmx.inputField.kml,
		_dl 			= ";";
		
	jQuery('#wmx-kml-url').val( jQuery( kml ).val() );
	
	if( !jQuery( latitude ).val() )
		return;
		
	var latArray 	= jQuery( latitude ).val().split( _dl ),
		longArray 	= jQuery( longitude ).val().split( _dl ),
		addArray 	= jQuery( address ).val().split( _dl ),
		labelArray 	= jQuery( label ).val().split( _dl ),
		markArray 	= jQuery( markerId ).val().split( _dl );

	for( i=0; i < latArray.length; i++ ) {
	
		if(!latArray[i] && !longArray[i])
			continue;
	
		wmx.addMarker( new google.maps.LatLng( latArray[i], longArray[i]), addArray[i], labelArray[i], wmx.newMarkerImage(markArray[i]) );
		
		wmx.latLongBounds.extend( new google.maps.LatLng( latArray[i], longArray[i]) );
	
	}
	
	//wmx.map.fitBounds(wmx.latLongBounds);

}

wmx.confirmCloseDialog = function() {

	return confirm( wmx.txt._('WEEVERMAPS2_CONFIRM_CLOSE') );

}

wmx.saveRemoteSettings = function( saveCallback ) {

	var geo 			= [],
		xmlhttp 		= new XMLHttpRequest(),
		xmlhttpCall		= Joomla.comWeeverConst.server + "api/v2/tabs/set_geo?tab_id=" + wmx.remoteId + "&app_key=" + wmx.remoteKey;

	wmx.safeClose = true;
	
	if( wmx.markers === undefined )
		return true;
		
	for( i=0; i<wmx.markers.length; i++ ) {
	
		marker 	= wmx.markers[i];
		geo[i]	= {};
		
		geo[i].latitude 	= marker.position.lat();
		geo[i].longitude 	= marker.position.lng();
		geo[i].label		= marker.labelContent;
		geo[i].marker_url	= marker.icon.url;
		
		if( jQuery('#wmx-kml-url').val() ) {
		
			geo[i].kml = jQuery('#wmx-kml-url').val();
			
			jQuery('#wmx-kml-url').val( null );
		
		}
	
	}
	
	geoJson	= JSON.stringify( geo );
	
	if( !!geo.length )
		xmlhttpCall		+= "&geo=" + geoJson;
	else 
		xmlhttpCall		+= "&geo=";
	
	xmlhttp.open("GET", xmlhttpCall );	
	xmlhttp.send();
	
	jQuery('#wx-modal-error-text').html('');
	jQuery('#wx-modal-loading').fadeIn(200);
	jQuery('#wx-modal-loading-text').html(Joomla.JText._('WEEVER_JS_SAVING_CHANGES'));
	jQuery('#wx-modal-secondary-text').html(Joomla.JText._('WEEVER_JS_PLEASE_WAIT'));

	xmlhttp.onreadystatechange = function()	{
	
		if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) 
			saveCallback( xmlhttp.responseText );
		
	}

}

wmx.saveSettings = function() {

	wmx.safeClose = true;
	
	if( wmx.markers === undefined )
		return true;
		
	var latitude 	= wmx.inputField.latitude,
		longitude 	= wmx.inputField.longitude,
		address	 	= wmx.inputField.address,
		label 		= wmx.inputField.label,
		markerId 	= wmx.inputField.marker,
		kml 		= wmx.inputField.kml,
		_dl 		= ";",
		latVal = "", longVal = "", addVal = "", labelVal = "", markVal = "";

	for( i=0; i<wmx.markers.length; i++ ) {
	
		marker		= wmx.markers[i];
		latVal 		= latVal + marker.position.lat() + _dl;
		longVal 	= longVal + marker.position.lng() + _dl;
		
		if( marker.address != null )
			addVal = addVal + marker.address.replace(/;/, "") + _dl;
		else   
			addVal = addVal  + _dl;
			
		labelVal 	= labelVal + marker.labelContent.replace(/;/, "") + _dl;
		markVal 	= markVal + marker.icon.url + _dl;
	
	}
	
	jQuery(latitude).val( latVal );
	jQuery(longitude).val( longVal  );
	jQuery(address).val( addVal );
	jQuery(label).val( labelVal );
	jQuery(markerId).val( markVal );
	jQuery(kml).val( jQuery('#wmx-kml-url').val() );

}

wmx.openWindow		= function(e) {

	e.preventDefault();
			
	// if the class has been removed, do not continue
	if( !jQuery(this).hasClass(wmx.trigger.replace(".","")) )
		return;
		
	wmx.newTab = false;
		
	if( jQuery(this).hasClass("wx-geotag-new-item") )
		wmx.newTab = true;	
	
	var me = this;

	var loadDialog = function() {
				
		var	myOptions = {
		
	          center: 		new google.maps.LatLng(43.243603, -79.889074),
	          zoom: 		5,
	          mapTypeId:	google.maps.MapTypeId.ROADMAP
	          
	    };
		        
		if(wmx.map instanceof google.maps.Map)
		{
		
			callback = function() {
			
				google.maps.event.trigger(wmx.map, 'resize');
				wmx.map.fitBounds(wmx.latLongBounds);
				
				var zoom = wmx.map.getZoom();
				
				wmx.map.setZoom( zoom > wmx.maxZoom ? wmx.maxZoom : zoom );
				
			};
			
			if( !!wmx.remoteSource ) {
			
				wmx.remoteId = jQuery(me).attr( 'id' ).replace( wmx.remoteIdPrefix, "" );
				wmx.getRemoteSettings(callback);
			
			}
			
			else {
			
				setTimeout( callback, 350 );
				
			}
			
			
		}
		else 
		{
			
			wmx.map = new google.maps.Map(document.getElementById("wmx-map"), myOptions);
			
			var callback = function() {
			
				google.maps.event.trigger(wmx.map, 'resize');
				wmx.map.fitBounds(wmx.latLongBounds);
				
				var zoom = wmx.map.getZoom();
				
				wmx.map.setZoom( zoom > wmx.maxZoom ? wmx.maxZoom : zoom );
				
			};
			
			if( !!wmx.remoteSource ) {
			
				wmx.remoteId = jQuery(me).attr( 'id' ).replace( wmx.remoteIdPrefix, "" );
				wmx.getRemoteSettings(callback);
				
			} else {
			
				wmx.getSettings();
				
			}
			
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
	
		modal: 			true, 
		resizable: 		false,
		width: 			'auto',
		height: 		'auto',
		buttons: 		{
		
			"Cancel": 			function() {
			
				var me = this;
			
				if( !wmx.confirmCloseDialog() )
					return;
				
				else {
				
					wmx.clearMap();
					
					wmx.safeClose = true;
					
					setTimeout( function() {
					
						jQuery(me).dialog( "close" );
					
					}, 125);
					
				}
			
				
				
			},
			"Save Changes": 	function() {
			
				if( !!wmx.remoteSource && !wmx.newTab ) {
				
					var me = this;
									
					wmx.saveRemoteSettings( function( responseText ) {

						wmx.clearMap();

						jQuery(me).dialog( "close" );
						
						wmx.safeClose = false;
						
						jQuery('#wx-modal-secondary-text').html(Joomla.JText._('WEEVER_JS_APP_UPDATED'));
						setTimeout("document.location.reload(true);",20);
					
					});
					
					return;
					
				}
				else if( !!wmx.newTab ) {
				
					jQuery(this).dialog( "close" );
					
					wmx.safeClose = false;
				
				}
					
				wmx.saveSettings();
					
				jQuery(this).dialog( "close" );
				
				wmx.safeClose = false;
				
			}
					
		},
		open: 			loadDialog(),
		beforeClose: 	function() {
		
			if(!!wmx.safeClose)
				return true;
		
		}
		
	}); 

}

