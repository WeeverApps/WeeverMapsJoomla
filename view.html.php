<?php
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
defined('_JEXEC') or die;

$document = &JFactory::getDocument();

$document->addScript( '/media'.DS.'plg_weevermaps'.DS.'js'.DS.'jquery.js' );
$document->addScript( '/media'.DS.'plg_weevermaps'.DS.'js'.DS.'jquery-ui.js' );
$document->addScript( 'http://maps.googleapis.com/maps/api/js?sensor=false' );
$document->addScript( '/media'.DS.'plg_weevermaps'.DS.'js'.DS.'markerwithlabel.js' );
$document->addScript( '/media'.DS.'plg_weevermaps'.DS.'js'.DS.'wmx.ini.js' );
$document->addScript( '/media'.DS.'plg_weevermaps'.DS.'js'.DS.'wmx.js' );
$document->addScript( '/media'.DS.'plg_weevermaps'.DS.'js'.DS.'jq.joomla.js' );
$document->addScript( '/media'.DS.'plg_weevermaps'.DS.'js'.DS.'jq.ready.js' );

$document->addStyleSheet(DS.'media'.DS.'plg_weevermaps'.DS.'css'.DS.'wmx.css', 'text/css', null, array());
$document->addStyleSheet(DS.'media'.DS.'plg_weevermaps'.DS.'css'.DS.'wmx.joomla.css', 'text/css', null, array());
$document->addStyleSheet(DS.'media'.DS.'plg_weevermaps'.DS.'css'.DS.'jquery.ui.css', 'text/css', null, array());

// First, Joomla-specific hidden HTML..
// Loads values into hidden inputs, will be picked up by jQuery and dumped into other hidden tags within the form element.

?>

<input type='hidden' id='wmx-latitude-val' name='wmx_latitude_val' value='<?php echo $this->inputString['latitude']; ?>' />
<input type='hidden' id='wmx-longitude-val' name='wmx_longitude_val' value='<?php echo $this->inputString['longitude']; ?>' />
<input type='hidden' id='wmx-address-val' name='wmx_address_val' value='<?php echo $this->inputString['address']; ?>' />
<input type='hidden' id='wmx-label-val' name='wmx_label_val' value='<?php echo $this->inputString['label']; ?>' />
<input type='hidden' id='wmx-marker-val' name='wmx_marker_val' value='<?php echo $this->inputString['marker']; ?>' />
<input type='hidden' id='wmx-kml-val' name='wmx_kml_val' value='<?php echo $this->inputString['kml']; ?>' />

<?php 

// Followed by standard core HTML

?>

<div id='wmx-dialog' class='wmx-ui' title='&lt;img id=&quot;wmx-logo&quot; src=&quot;/media/plg_weevermaps/images/weever.png&quot;&gt; <?php echo $this->pluginNameHumanReadable; ?> v<?php echo $this->pluginVersion; ?>'>
		<div id='wmx-address' class='wmx-ui'>
			<input type='text' class='wmx-ui' id='wmx-address-input' placeholder='<?php echo JText::_('WEEVERMAPS_ADDRESS_PLACEHOLDER'); ?>' value='<?php echo JText::_('WEEVERMAPS_ADDRESS_VALUE'); ?>' />
			<button class='wmx-ui' id='wmx-address-geocode'><?php echo JText::_('WEEVERMAPS_ADDRESS_GO'); ?></button> 
			<button class='wmx-ui' id='wmx-address-add-marker' disabled='disabled'><?php echo JText::_('WEEVERMAPS_ADDRESS_ADD_MARKER'); ?></button>
		</div>
		<div id='wmx-map' class='wmx-ui'>This will be a map.</div>
		<div id='wmx-map-console' class='wmx-ui'>
		
			<div id='wmx-instructions' class='wmx-ui'><span class='wmx-ui'><?php echo JText::_('WEEVERMAPS_INSTRUCTIONS'); ?></span></div>
			
			<div id='wmx-console-options' class='wmx-ui'>
			
				<div id='wmx-latlong-container' class='wmx-console-container-widget wmx-ui'>
				
					<div id='wmx-latlong-title' class='wmx-title wmx-ui'><?php echo JText::_('WEEVERMAPS_GPS_POSITION'); ?></div>
					
					<div id='wmx-latlong-stats-container' class='wmx-ui'>
						<div id='wmx-latitude' class='wmx-ui'>
							<div class='wmx-hover-label wmx-ui'><label for='wmx-lat-hover' class='wmx-ui'><?php echo JText::_('WEEVERMAPS_LAT_COLON'); ?></label></div>
							<input type='text' class='wmx-ui' id='wmx-lat-hover' />
						</div>
						
						<div id='wmx-longitude' class='wmx-ui'>
							<div class='wmx-hover-label wmx-ui'><label for='wmx-long-hover' class='wmx-ui'><?php echo JText::_('WEEVERMAPS_LONG_COLON'); ?></label></div>
							<input type='text' id='wmx-long-hover' class='wmx-ui' />
						</div>
					</div>
					
					<div id='wmx-gps-center' class='wmx-ui'>
						<button class='wmx-latlong-button wmx-ui' id='wmx-latlong-location'><?php echo JText::_('WEEVERMAPS_LAT_LONG_GO'); ?></button>
					</div>
					
					<div id='wmx-latlong-button-container' class='wmx-ui'>
						<button class='wmx-latlong-button wmx-ui' id='wmx-gps-location'><?php echo JText::_('WEEVERMAPS_MY_LOCATION'); ?></button> 
						<button class='wmx-latlong-button mwx-ui' id='wmx-latlong-add-marker'><?php echo JText::_('WEEVERMAPS_LAT_LONG_ADD_MARKER'); ?></button>
					</div>
					
				</div>
				
				<div id='wmx-marker-container' class='wmx-console-container-widget wmx-ui'>
				                <div class="wmx-title" id="wmx-latlong-title"><?php echo JText::_('WEEVERMAPS_MAP_MARKER'); ?></div>

					<div id='wmx-right-marker' class='wmx-ui'>				
						<img src='http://weeverapp.com/media/sprites/default-marker.png' id='wmx-marker-image' class='wmx-ui' />
                        <span id="wx-right-marker-description" class='wmx-ui'><?php echo JText::_('WEEVERMAPS_SUPPORT_INSTRUCTIONS'); ?></span>	
					</div>
					
					<div id='wmx-right-marker-buttons' class='wmx-ui'>
						<input type='hidden' name='wmx-marker-url' id='wmx-marker-url' class='wmx-ui' value='' />
						<button id='wmx-select-marker' class='wmx-ui'><?php echo JText::_('WEEVERMAPS_CHOOSE_MARKER_ICON'); ?></button><br />
					</div>
					
				</div>
				
				<div id='wmx-options-container' class='wmx-console-container-widget wmx-ui'>
					
					<div id='wmx-options-title' class='wmx-title wmx-ui'><?php echo JText::_('WEEVERMAPS_OTHER_OPTIONS'); ?></div>
				
					<button id='wmx-add-kml' class='wmx-ui'><?php echo JText::_('WEEVERMAPS_ADD_KML_FILE'); ?></button>
					<button id='wmx-about-plugin' class='wmx-ui'><?php echo JText::_('WEEVERMAPS_ABOUT_PLUGIN'); ?></button> 
					
				</div>
				
			</div>
			
		</div>
		
	</div>
	
	<div id='wmx-marker-dialog' class='wmx-ui' title='<?php echo JText::_('WEEVERMAPS_EDIT_MARKER'); ?>'>
		
		<div id='wmx-marker-dialog-options-container' class='wmx-ui'>
			<div class='wmx-title wmx-ui'><?php echo JText::_('WEEVERMAPS_MARKER_OPTIONS'); ?></div>
			<label class='wmx-marker-button' for='wmx-marker-label-input' class='wmx-ui'><?php echo JText::_('WEEVERMAPS_MARKER_LABEL_COLON'); ?></label>
			<input id='wmx-marker-label-input' type='text' class='wmx-marker-button wmx-ui'  placeholder='<?php echo JText::_('WEEVERMAPS_MARKER_LABEL'); ?>' /><br />
			<textarea id='mwx-marker-address-input' class='wmx-ui' placeholder='<?php echo JText::_('WEEVERMAPS_ADDRESS_PLACEHOLDER'); ?>'></textarea><br />
			<input type='button' id='wmx-marker-change-icon' class='wmx-marker-button wmx-ui' value='<?php echo JText::_('WEEVERMAPS_CHANGE_ICON_ELLIPSIS'); ?>' /><br />
			<input type='hidden' id='wmx-marker-icon' name='wmx-marker-icon' class='wmx-ui' value='' />
			<input type='button' id='wmx-marker-delete' class='wmx-marker-button wmx-ui' value='<?php echo JText::_('WEEVERMAPS_DELETE_MARKER'); ?>' />
		</div>
		
	</div>
	
	<div id='wmx-about-plugin-dialog' class='wmx-ui' title='<?php echo JText::_('WEEVERMAPS_ABOUT_PLUGIN'); ?>'>
	
		<div id='wmx-about-logo' class='wmx-ui'><img src='/media/plg_weevermaps/images/weever-logo.png' class='wmx-ui' /></div>
		<h3 class='wmx-ui'><?php echo $this->pluginNameHumanReadable; ?>, <?php echo $this->pluginLongVersion; ?></h3>
		<div id='wmx-about-text' class='wmx-ui'>
			<?php echo JText::_('WEEVERMAPS_ABOUT_PLUGIN_TEXT'); ?>
			<p class='wmx-ui'><?php echo JText::_('WEEVERMAPS_RELEASED')." ".$this->pluginReleaseDate; ?></p>
		</div>
	
	</div>
	
	
	<div id='wmx-kml-dialog' class='wmx-ui' title='<?php echo JText::_('WEEVERMAPS_ADD_KML_FILE'); ?>'>
		
		<div id='wmx-kml-dialog-container' class='wmx-ui'>
			<input type='text' class='wmx-ui' id='wmx-kml-url' value='' placeholder='http://' /><br />
			<!--button id='wmx-kml-media'><?php echo JText::_('WEEVERMAPS_FILE_FROM_SERVER_ELLIPSIS'); ?></button-->
			<span class='wmx-ui'><?php echo JText::_('WEEVERMAPS_KML_INSTRUCTIONS'); ?></span>
		</div>
		
	</div>
	
	<div id='wmx-close-dialog' class='wmx-ui' title='<?php echo JText::_('WEEVERMAPS_ARE_YOU_SURE'); ?>'>
		
		<div class='wmx-ui'>
			<?php echo JText::_('WEEVERMAPS_CONFIRM_CLOSE'); ?>
		</div>
		
	</div>
