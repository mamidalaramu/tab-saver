chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      chrome.tabs.query({currentWindow: true}, function(tabs){
        var tabsData = [];
        for (var i = 0; i < tabs.length; i++) {
            tabsData.push({
                'title': tabs[i].title,
                'url': tabs[i].url
            });
        }
        chrome.storage.local.set({[request.groupName]: JSON.stringify(tabsData)});
      });
    }
  }
);
