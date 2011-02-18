<?php
//import wcf event listener
require_once(WCF_DIR.'lib/system/event/EventListener.class.php');

/**
 * welcomes users from search engines with some other result pages
 *
 * @license	GNU General Public License <http://opensource.org/licenses/gpl-3.0.html>
 * @package	de.easy-coding.wcf.refassistant
 */
class RefassistantListener implements EventListener {
	private static $called = false;
	
	/**
	 *
	 */
	protected static function getQuery() {
		if(!isset($_SERVER['HTTP_REFERER']) || empty($_SERVER['HTTP_REFERER'])) {
			// no referer set
			return false;
		} else if(!preg_match('/\.(google|yahoo|bing)\./', $_SERVER['HTTP_REFERER'])) {
			// no known search engine as source
			return false;
		} else if(!($query = @parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY))) {
			// no query parameters
			return false;
		}
		
		@parse_str($query, $output);
		
		if(!isset($output['q'])) {
			return false;
		}
		
		$q = $output['q'];
		$q = preg_replace('/(site:[^ ]+)/', '', $q);

		return StringUtil::trim($q);
	}

	/**
	 * @see EventListener::execute()
	 */
	public function execute($eventObj, $className, $eventName) {
		if(!self::$called) {
			self::$called = true;
			
			$keyword = self::getQuery();
			if($keyword) {
				WCF::getTPL()->assign(array(
					'refassistant_keyword' => $keyword,
					'refassistant_url' => PAGE_URL.'/index.php?page=SolrSearch&format=atom&num=3&q={searchTerms}',
				));
				WCF::getTPL()->append(array(
					'specialStyles' => WCF::getTPL()->fetch('refassistant')
				));
			}
		}
	}
}
?>
