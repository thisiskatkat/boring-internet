(function () {
  'use strict';

  // definitions

  function saveLink(linkToAdd) {

    chrome.storage.sync.get('blockedLinks', function (items) {   
      
      if (items.blockedLinks && items.blockedLinks.indexOf(linkToAdd) === -1) {
        items.blockedLinks.push(linkToAdd);
        chrome.storage.sync.set({
          'blockedLinks': items.blockedLinks
        });
        $('input[name="newlink"]').val('');

      }/* else {
        // TO DO: status bar
      }*/

    });
  }

  function removeLink(linkToRemove){

    chrome.storage.sync.get('blockedLinks', function (item) {

      var linkIndex = $.inArray( linkToRemove, item.blockedLinks);
      
      if (linkIndex > -1) {   
        
        item.blockedLinks.splice(linkIndex, 1);
        chrome.storage.sync.remove('blockedLinks');
        chrome.storage.sync.set({
          'blockedLinks': item.blockedLinks 
        });

        if (item.blockedLinks.length === 0){
          $('#links').empty(); 
        }

      }

    });
  }

  //function editLink(){} TO DO

  function listLinks() {
    
    chrome.storage.sync.get('blockedLinks', function (item) {
      
      if (!item.blockedLinks || item.blockedLinks === "") {
        chrome.storage.sync.set({
          'blockedLinks': []
        });
      } else {
        $('#links').empty();
        for (var i = item.blockedLinks.length-1; i > -1; i--) {
          $('#links').append('<li><input type="text" name="link[' + i +']" value="' + item.blockedLinks[i] + '"><span class="button remove" data-status="Link removed.">Remove</span></li>');
        }
        $('.remove').on( 'click', function (){
          var linkToRemove = $(this).prev().val();
          removeLink(linkToRemove); 

        });

      }  
    });
  }


  // init

  $('.add').on('click', function (){
    if ($('input[name="newlink"]').val() !== ""){
      saveLink($('input[name="newlink"]').val());
    }
  });
  $('input[name="newlink"]').keyup( function (e){
    if ($('input[name="newlink"]').val() !== "" && e.keyCode === 13){
      saveLink($('input[name="newlink"]').val());
    }
  });

  chrome.storage.onChanged.addListener( function (changes, namespace) {
    if (namespace == 'sync' && changes.blockedLinks.newValue){
      listLinks();
    }
  });

  listLinks();

}());