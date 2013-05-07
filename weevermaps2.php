<?php
/*	
*	Weever Geotagger, for Joomla
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

defined('_JEXEC') or die;

# Joomla 3.0 nonsense
if( !defined('DS') )
	define( 'DS', DIRECTORY_SEPARATOR );

jimport('joomla.plugin.plugin');

class plgWeeverWeeverMaps2 extends JPlugin {

	public 		$pluginName 				= "weevermaps2";
	public 		$pluginNameHumanReadable;
	public  	$pluginVersion 				= "0.3";
	public		$pluginLongVersion 			= "Version 0.3 \"Da Gama\" (beta)";
	public  	$pluginReleaseDate 			= "February 22, 2013";
	public  	$joomlaVersion;
	
	private		$geoData;
	private		$inputString				= array(
													'longitude' => 0,
													'latitude' 	=> 0,
													'address'	=> null,
													'label'		=> null,
													'marker'	=> null,
													'kml'		=> null
												);
	private		$_com						= "com_weever";

	public function __construct(&$subject, $config) 
	{
		
		$app 		= JFactory::getApplication();
		$option 	= JRequest::getCmd('option');

		JPlugin::loadLanguage('plg_weever_'.$this->pluginName, JPATH_ADMINISTRATOR);
		
		$this->pluginNameHumanReadable = JText::_('WEEVERMAPS2_PLG_NAME');
		
		$version 				= new JVersion;
		$this->joomlaVersion 	= substr($version->getShortVersion(), 0, 3);
		
		if( strstr(JRequest::getVar("task"), "ajax") || strstr(JRequest::getVar("task"), "upload") )
			return false;
		
		// Javascript localization assignment. All localized Javascript strings must register here.
		if($this->joomlaVersion == '1.5')
		{

			// Joomla 1.5 does not support Javascript localization. This adds support.

			include_once JPATH_PLUGINS.DS.'weever'.DS.'weevermaps2'.DS.'jsjtext15.php';
			
			jsJText::script('WEEVERMAPS2_CONFIRM_CLOSE');
			jsJText::script('WEEVERMAPS2_ERROR_NO_RESULTS');
			jsJText::load();
		
		}
		else
		{
		
			JText::script('WEEVERMAPS2_CONFIRM_CLOSE');
			JText::script('WEEVERMAPS2_ERROR_NO_RESULTS');
			
		}
		
		if( $id = JRequest::getVar("id") )
		{
			$this->getGeoData($id);
			$this->implodeGeoData();
		}
		
		include JPATH_PLUGINS.DS.'weever'.DS.'weevermaps2'.DS.'view.html.php';
		
		parent::__construct($subject, $config);
		
	}
	
	
	private function implodeGeoData() 
	{
	
		foreach( (array) $this->geoData as $k=>$v )
		{
		
			$point = array();
			$_ds = ";";
			
			$this->convertToLatLong($v);
			
			$this->inputString['longitude'] 	.= $v->longitude 	. $_ds;
			$this->inputString['latitude'] 		.= $v->latitude 	. $_ds;
			$this->inputString['address'] 		.= $v->address 		. $_ds;
			$this->inputString['label'] 		.= $v->label 		. $_ds;
			$this->inputString['marker'] 		.= $v->marker 		. $_ds;
			$this->inputString['kml'] 			.= $v->kml 			. $_ds;
		
		}
	
	}
	
	
	private function convertToLatLong(&$obj) 
	{
	
		$point = rtrim( ltrim( $obj->location, "(POINT" ), ")" );
		$point = explode(" ", $point);
		$obj->latitude = $point[0];
		$obj->longitude = $point[1];
	
	}
	
	
	private function getGeoData($id)
	{
	
		$db = JFactory::getDBO();
		
		$query = "SELECT component_id, AsText(location) AS location, address, label, kml, marker ".
				"FROM
					#__weever_maps ".
				"WHERE
					component = ".$db->quote($this->_com)." 
					AND
					component_id = ".$db->quote($id);
					
		$db->setQuery($query);
		$this->geoData = $db->loadObjectList();
	
	}
	
} 



