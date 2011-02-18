/**
 * display search assistant
 *
 * @author	Torben Brodt
 * @copyright	2010 easy-coding.de
 * @license	GNU General Public License <http://opensource.org/licenses/gpl-3.0.html>
 * @package	de.easy-coding.wcf.refassistant
 */
function Refassistant() {
	this.searchHandler = '';
	this.searchTerms = '';

	this.search = function(searchHandler, searchTerms) {
		this.searchHandler = searchHandler;
		this.searchTerms = searchTerms;
	};
	
	this.addCss = function(rules) {
		var head = document.getElementsByTagName('head')[0],
		style = document.createElement('style'),
		rules = document.createTextNode(rules);

		style.type = 'text/css';
		if(style.styleSheet)
			style.styleSheet.cssText = rules.nodeValue;
		else style.appendChild(rules);
		head.appendChild(style);
	};
	
	this.displayResults = function(items) {
		var d = document.getElementById('refAssistantResults');
		d.style.display = 'none';
		if(items.length > 0) {
			d.innerHTML += '<div style="float:right;width:120px;height:60px;"></div>';
		}
		
		var desclength, titlelength;
		for(var i=0; i<items.length; i++) {
			var d2 = document.createElement('a');
			d2.href = items[i].link;
			if(_gaq) {
				d2.onclick = function(href) {
					return function() {
						_gaq.push(['_trackEvent', 'search', 'refassistant', href]);
					};
				}(items[i].link);
			}
			d2.style.display = 'block';
			
			
			if(i % 2 == 0) {
				d2.style.backgroundColor = '#333';
			}
			
			desclength = 155;
			titlelength = 70;
			if(items[i].img) {
				desclength -= 15;
				titlelength -= 15;
			}
			if(i == 0) {
				desclength -= 30;
				titlelength -= 10;
			}
			d2.style.padding = '10px';
			
			d2.innerHTML = 
				(items[i].img ? '<img src="'+items[i].img+'" style="width:80px;height:60px; float:left; margin-right:5px;" />' : '')+
				'<b>'+items[i].title.substr(0, titlelength)+'..</b><br />'+
				'<span>'+items[i].description.substr(0, desclength)+'..</span>'+
				(items[i].img ? '<br style="clear:both" />' : '');
			d.appendChild(d2);
		}
		Effect.BlindDown(d);

	};
	
	this.loadResults = function() {
		var url = this.searchHandler.replace(/{searchTerms}/, escape(this.searchTerms));
		var ajaxRequest = new AjaxRequest();
		ajaxRequest.openGet(url + SID_ARG_2ND, function (ref) {
			return function() {
				function getXMLText(dom, node) {
					dom = dom.getElementsByTagName(node);
					if(dom.length) {
						dom = dom[0].firstChild
						if(dom) {
							return dom.nodeValue;
						}
					}
					return null;
				};

				if (ajaxRequest.xmlHttpRequest.readyState == 4 && ajaxRequest.xmlHttpRequest.status == 200) {
					var items = ajaxRequest.xmlHttpRequest.responseXML.getElementsByTagName('item');
					var items2 = [];
					for(var i=0; i<items.length; i++) {
						items2.push({
							title: getXMLText(items[i], 'title'),
							description: getXMLText(items[i], 'description'),
							link: getXMLText(items[i], 'link'),
							img: getXMLText(items[i], 'img'),
						});
					}
					ref.displayResults(items2);
				};
			};
		}(this));
	}
	
	this.display = function() {
		var searchInputCss = '-webkit-border-radius: 12px;-moz-border-radius: 12px;border-radius: 12px;border-top-left-radius: 12px 12px;border-top-right-radius: 12px 12px;border-bottom-right-radius: 12px 12px;border-bottom-left-radius: 12px 12px;padding-left: 23px;width: 26em;background-repeat: no-repeat;background-position: 2px center;margin-right:10px;';
	
		var assistantStyle = 'background-color: rgb(34, 34, 34); width: 468px; color: rgb(255, 255, 255); position: fixed; bottom: 0px; right: 30px;background-repeat: no-repeat;background-position: right 10px;';

		// head region
		this.addCss('#refAssistant a {'+
		'color:#fff;text-decoration:none;'+
		'}'+
		'#refAssistantResults a:hover b {'+
		'text-decoration:underline;'+
		'}'+
		'#refAssistantFooter a:hover {'+
		'text-decoration:underline;'+
		'}');
		
		var d = document.createElement('div');
		d.style.position = 'relative';
		d.innerHTML = '<div id="refAssistant" style="'+assistantStyle+';">'+
		'<img src="'+RELATIVE_WCF_DIR+'images/searchAssistant.png" style="position:absolute;top:10px;right:10px">'+
		'<div style="padding:10px">'+
		'<a href="#" onclick="Effect.BlindUp(\'refAssistant\');return false"><img src="'+RELATIVE_WCF_DIR+'icon/minusS.png" style="position:absolute;top:10px;right:10px"></a>'+
			'Du hast noch weitere Fragen?'+
			'<form method="post" action="index.php?page=SolrSearch">'+
				'<input type="text" style="'+searchInputCss+';background-image:url('+RELATIVE_WCF_DIR+'icon/searchHeadS.png)" class="inputText" name="q" value="'+ this.searchTerms +'" autocomplete="off">'+
				'<input type="image" class="searchSubmit inputImage" src="'+RELATIVE_WCF_DIR+'/icon/submitS.png" alt="Absenden">'+
			'</form>'+
		'</div>'+
		'<div id="refAssistantResults">'+
		'</div>'+
		'<div style="background-color:#555;padding:5px" id="refAssistantFooter">'+
			'<div style="float:left">'+
				'<img src="'+RELATIVE_WCF_DIR+'icon/nextS.png" /> '+
				'<a href="index.php?page=SolrSearch&amp;q='+this.searchTerms+'">Weitere Ergebnisse laden</a>'+
			'</div>'+
			'<div style="float:left;padding-left:10px">'+
				'<img src="'+RELATIVE_WCF_DIR+'icon/addS.png" /> '+
				'<a href="index.php?form=ThreadAdd&amp;boardID=47">Frage stellen</a>'+
			'</div>'+
			'<div style="clear:both"></div>'+
		'</div>'+
		'';
		document.getElementsByTagName('body')[0].appendChild(d);

		if(this.searchTerms) {
	       		this.loadResults();
		}
	};
}
