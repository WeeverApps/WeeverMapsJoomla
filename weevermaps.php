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

jimport('joomla.plugin.plugin');

class plgContentWeeverMaps extends JPlugin {

	public 		$pluginName 				= "weevermaps";
	public 		$pluginNameHumanReadable;
	public  	$pluginVersion 				= "0.2";
	public		$pluginLongVersion 			= "Version 0.1.1 \"Amundsen\" (beta)";
	public  	$pluginReleaseDate 			= "January 24, 2012";
	public  	$joomlaVersion;
	
	private		$geoData;
	private		$inputString				= array();
	private		$_com						= "com_content";

	public function __construct(&$subject, $config) 
	{
		
		$app =& JFactory::getApplication();
		
		if( !$app->isAdmin() )
			return false;
		
		JPlugin::loadLanguage('plg_content_'.$this->pluginName, JPATH_ADMINISTRATOR);
		
		$this->pluginNameHumanReadable = JText::_('WEEVERMAPS_PLG_NAME');
		
		$version = new JVersion;
		$this->joomlaVersion = substr($version->getShortVersion(), 0, 3);
		
		if( JRequest::getVar("view") != "article" || JRequest::getVar("layout") != "edit" )
			return false;
		
		// Javascript localization assignment. All localized Javascript strings must register here.
		
		if($this->joomlaVersion == '1.5')
		{

			// Joomla 1.5 does not support Javascript localization. This adds support.

			include_once JPATH_PLUGINS.DS.'content'.DS.'weevermaps'.DS.'jsjtext15.php';
			
			jsJText::script('WEEVERMAPS_CONFIRM_CLOSE');
			jsJText::script('WEEVERMAPS_ERROR_NO_RESULTS');
			jsJText::load();
		
		}
		else
		{
		
			JText::script('WEEVERMAPS_CONFIRM_CLOSE');
			JText::script('WEEVERMAPS_ERROR_NO_RESULTS');
			
		}
		
		if( $id = JRequest::getVar("id") )
		{
			$this->getGeoData($id);
			$this->implodeGeoData();
		}
		
		include JPATH_PLUGINS.DS.'content'.DS.'weevermaps'.DS.'view.html.php';
		
		parent::__construct($subject, $params);
		
	}
	
	
	private function implodeGeoData() 
	{
	
		foreach( (array) $this->geoData as $k=>$v )
		{
		
			$point = array();
			$_ds = $_ds;
			
			$this->convertToLatLong($v);
			
			$this->inputString['longitude'] 	.= $v->longitude 	. $_ds;
			$this->inputString['latitude'] 		.= $v->latitude 	. $_ds;
			$this->inputString['address'] 		.= $v->address 		. $_ds;
			$this->inputString['label'] 		.= $v->label 		. $_ds;
			$this->inputString['marker'] 		.= $v->marker 		. $_ds;
			$this->inputString['kml'] 			.= $v->kml 			. $_ds;
		
		}
	
	}
	
	
	private function convertToLatLong(&$obj) {
	
		$point = rtrim( ltrim( $obj->location, "(POINT" ), ")" );
		$point = explode(" ", $point);
		$obj->latitude = $point[0];
		$obj->longitude = $point[1];
	
	}
	
	
	private function getGeoData($id)
	{
	
		$db = &JFactory::getDBO();
		
		$query = "SELECT component_id, AsText(location) AS location, address, label, kml, marker".
				"FROM
					#__weever_maps ".
				"WHERE
					component = ".$db->quote($this->_com)." 
					AND
					component_id = ".$db->quote($id);
					
		$db->setQuery($query);
		$this->geoData = $db->loadObjectList();
	
	}

	
	public function onAfterContentSave(&$article, $isNew) 
	{
	
		$_ds = ";";

		if($this->joomlaVersion == '1.5')
		{
		
			// K2 for Joomla 1.5 stores $item->plugin as INI string rather than JSON
			// ... and Joomla 1.5 has its own INI parsing class, JRegistry.
		
			$registry	= new JRegistry();
			$registry->loadINI($item->plugins);
			$geoData	= $registry->toObject( );
			
		}
		else 
		{
		
			// K2 for Joomla 1.6+ is normal.
		
			$geoData = json_decode($item->plugins);
			
		}
		
		if($geoData->weevermapsk2altitude_item == "wxdebug") 
		{
		
			print_r($item->plugins);
			print_r($geoData);

		}
			
		
		$geoLatArray = 		explode( 	$_ds, rtrim( JRequest::getVar("wx-latitude-val"), 	$_ds) 	);
		$geoLongArray = 	explode( 	$_ds, rtrim( JRequest::getVar("wx-longitude-val"), 	$_ds) 	);
		$geoAddressArray = 	explode( 	$_ds, rtrim( JRequest::getVar("wx-address-val"), 	$_ds) 	);
		$geoLabelArray = 	explode( 	$_ds, rtrim( JRequest::getVar("wx-label-val"), 		$_ds) 	);
		$geoMarkerArray = 	explode( 	$_ds, rtrim( JRequest::getVar("wx-marker-val"), 	$_ds) 	);
		
		$db = &JFactory::getDBO();
		
		$query = " 	DELETE FROM #__weever_maps 
					WHERE
						component_id = ".$db->quote($item->id)."
						AND
						component = ".$db->quote($this->_com);
						
	
		$db->setQuery($query);
		$db->query();
		
		foreach( (array) $geoLatArray as $k=>$v )
		{
		
			$query = " 	INSERT  ".
					"	INTO	#__weever_maps ".
					"	(component_id, component, location, address, label, marker) ".
					"	VALUES ('".$item->id."', ".$db->quote($this->_com).", 
							GeomFromText(' POINT(".$geoLatArray[$k]." ".$geoLongArray[$k].") '),
							".$db->quote($geoAddressArray[$k]).", 
							".$db->quote($geoLabelArray[$k]).", 
							".$db->quote($geoMarkerArray[$k]).")";
						
		
			$db->setQuery($query);
			$db->query();
		
		}
		
		if($geoData->weevermapsk2kml_item = rtrim( JRequest::getVar("wx-kml-val"), $_ds) )
		{
			
			$query = " 	INSERT  ".
					"	INTO	#__weever_maps ".
					"	(component_id, component, kml) ".
					"	VALUES ('".$item->id."', ".$db->quote($this->_com).", ".$db->quote($geoData->weevermapsk2kml_item).")";
			
			$db->setQuery($query);
			$db->query();
			

		}
		
		
	}

	
} 



