// Save Tabs
document.getElementById('save-tabs').addEventListener('click', function() {
    var groupName = document.getElementById('group-name').value;
    if (groupName == null || groupName == "") {
        return;
    }
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        var tabsData = [];
        for (var i = 0; i < tabs.length; i++) {
            tabsData.push({
                'title': tabs[i].title,
                'url': tabs[i].url
            });
        }
        chrome.storage.local.get(groupName, function(result) {
            if (result[groupName]) {
                var currentTabs = JSON.parse(result[groupName]);
                currentTabs = currentTabs.concat(tabsData);
                chrome.storage.local.set({[groupName]: JSON.stringify(currentTabs)});
            } else {
                chrome.storage.local.set({[groupName]: JSON.stringify(tabsData)});
            }
    });
});
});

document.getElementById('view-groups').addEventListener('click', function() {
    chrome.storage.local.get(null, function(items) {
        var tabGroups = document.getElementById('tab-groups');
        tabGroups.innerHTML = '';
        for (var key in items) {
            var group = JSON.parse(items[key]);
            var groupContainer = document.createElement('div');
            groupContainer.innerHTML = '<h3>' + key + '</h3><button class="delete-group" data-group-name="' + key + '"><img src="./delete.png" alt="delete"></button>';
            var groupLinks = document.createElement('ul');
            group.forEach(function(tab, index) {
                var groupLink = document.createElement('li');
                groupLink.innerHTML = '<input type="checkbox" class="tab-checkbox" id="tab-' + index + '"><label for="tab-' + index + '">' + tab.title + '</label>';
                groupLinks.appendChild(groupLink);
            });
            groupContainer.appendChild(groupLinks);
            tabGroups.appendChild(groupContainer);
        }
        // Delete Group
      var deleteButtons = document.getElementsByClassName('delete-group');
      for (var i = 0; i < deleteButtons.length; i++) {
          deleteButtons[i].addEventListener('click', function() {
              var groupName = this.getAttribute('data-group-name');
              chrome.storage.local.remove(groupName);
              location.reload();
          });
      }
    //delete-selected
    document.getElementById('delete-selected').addEventListener('click', function() {
        //var groupName = this.dataset.groupname;
        var groupName = document.getElementById('group-name').value;
        chrome.storage.local.get(groupName, function(result) {
            if(result[groupName]){
              var currentTabs = JSON.parse(result[groupName]);
              var checkboxes = document.getElementsByClassName('tab-checkbox');
              for (var i = 0; i < checkboxes.length; i++) {
                  if (checkboxes[i].checked) {
                      currentTabs = currentTabs.filter(tab => !(tab.title === checkboxes[i].dataset.title && tab.url === checkboxes[i].dataset.url));
                  }
              }
              chrome.storage.local.set({[groupName]: JSON.stringify(currentTabs)});
              location.reload();
            }else{
              console.log("Group not found in storage");
            }
        });
    });

        // Restore Tabs
        var restoreButtons = document.getElementsByClassName('restore-group');
        for (var i = 0; i < restoreButtons.length; i++) {
            restoreButtons[i].addEventListener('click', function() {
                var groupName = this.getAttribute('data-group-name');
                chrome.storage.local.get(groupName, function(result) {
                    var tabs = JSON.parse(result[groupName]);
                    chrome.windows.create({
                        'url': tabs.map(tab => tab.url),
                        'focused': true,
                        'type': 'normal'
                    });
                });
            });
        }
                // Delete Group
        var deleteButtons = document.getElementsByClassName('delete-group');
        for (var i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', function() {
                var groupName = this.getAttribute('data-group-name');
                chrome.storage.local.remove(groupName);
                location.reload();
                });
            }
                // Export JSON
        var exportButtons = document.getElementsByClassName('export-json');
        for (var i = 0; i < exportButtons.length; i++) {
            exportButtons[i].addEventListener('click', function() {
                var groupName = this.getAttribute('data-group-name');
                var json = JSON.stringify(items[groupName]);
                var blob = new Blob([json], {type: "application/json"});
                var filename = groupName + ".json";
                chrome.downloads.download({
                    url: URL.createObjectURL(blob),
                    filename: filename
                });
            });
        }
    });
});
// Dark Mode Switch
document.getElementById('dark-mode-switch').addEventListener('change', function() {
    if(this.checked) {
    document.body.classList.add('dark-mode');
    } else {
    document.body.classList.remove('dark-mode');
    }
});
