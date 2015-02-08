
'use strict';

function hideLinks() {

  var blackoutStyle = document.createElement('style'),
    	blackoutCSS = '';

  blackoutStyle.type = 'text/css';

  chrome.storage.sync.get('blockedLinks', function(item) {

    for (var i = item.blockedLinks.length - 1; i > 0; i--) {

      blackoutCSS += 'a[href^="http://' + item.blockedLinks[i] + '"], a[href^="https://' + item.blockedLinks[i] + '"], a[href^="http://www.' + item.blockedLinks[i] + '"], a[href^="https://www.' + item.blockedLinks[i] + '"], ';

      // facebook
      blackoutCSS += 'a[href^="http://l.facebook.com/l.php?u=http%3A%2F%2F' + encodeURI(item.blockedLinks[i]) + '"], a[href^="http://l.facebook.com/l.php?u=http%3A%2F%2Fwww.' + encodeURI(item.blockedLinks[i]) + '"], a[href^="http://l.facebook.com/l.php?u=https%3A%2F%2F' + encodeURI(item.blockedLinks[i]) + '"], a[href^="http://l.facebook.com/l.php?u=https%3A%2F%2Fwww.' + encodeURI(item.blockedLinks[i]) + '"], ';

      // twitter
      blackoutCSS += 'a[title^="http://' + encodeURI(item.blockedLinks[i]) + '"][href^="http://t.co"], a[title^="http://www.' + encodeURI(item.blockedLinks[i]) + '"][href^="http://t.co"], a[title^="https://' + encodeURI(item.blockedLinks[i]) + '"], a[title^="https://www.' + encodeURI(item.blockedLinks[i]) + '"][href^="http://t.co"] ';

      blackoutCSS += '{display:none !important}';

    };

    blackoutStyle.appendChild(document.createTextNode(blackoutCSS));
    
    if ($('#boring-placeholder').length) {
    	$('#boring-placeholder').empty();
    } else {
    	$('body').prepend('<div id="boring-placeholder" style="margin:0;padding:0;width:0;height:0"></div>');
    }
    $('#boring-placeholder').append(blackoutStyle);

  })
}

 
//init

document.addEventListener('DOMContentLoaded', function(tab) {
  chrome.tabs.executeScript({
    code: hideLinks()
  });
}); 

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace == 'sync' && changes.blockedLinks.newValue) {
    hideLinks();
  }
});

hideLinks();

