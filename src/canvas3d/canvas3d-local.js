/* 
 * This file aggregates all the src/ files at runtime
 * You just need to source this file. The src/ files will be loaded and aggregated and evaluated like a final build of a crafty is
 * When using this, Crafty does not need to be rebuilt after every change to a file
 *
 * WARNING!!!
 * This file is to be used for local development of Crafty ONLY. It does a number of Bad Things to achieve its goals, 
 * and should not be used in a production environment for any reason.
 *
 * There are issues when running this from a file:// URL. The default behavior is to disallow file access from other files.
 * Good browsers have workarounds for people who Know What They're Doing(tm). 
 *
 * Firefox:
 * Go to about:config. Click past the Warranty notice.
 * Find security.fileuri.scrict_origin_policy and set it to false
 *
 * Chrome:
 * Launch Chrome with the following flag:
 * --allow-file-access-from-files
 * 
 */

(function (window) {
	var include = [
		'intro',
		'vertex',
		'vector',
		'polygon',
		'projection',
		'painter',
		'zbuffer',
		'execute',
		'outro'
	],
	l = include.length, i, tr = new XMLHttpRequest(), output = '', url, base = '', scripts = document.getElementsByTagName('script');
	for (i=0; i<scripts.length; i++) {
		if (scripts[i].src.indexOf('canvas3d.js') != -1) {
			base = scripts[i].src.replace('canvas3d.js', '');
			break;
		}
	}	
	
	for (i=0; i<l; i++) {
		url = base+include[i]+'.js';
		tr.open("GET", url, false);
		try {
			tr.send(null);
		}
		catch (e) {
			console.log(e);
			alert("Your security settings prevent access to the local file-system. \n\r Access to restricted URI denied code 1012");
			break;
		}
		output += tr.responseText;
	}
	
	output += "\n//@ sourceURL=canvas3d.js";
	
	eval(output);
})(window);
