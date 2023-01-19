// Save Tabs
document.getElementById('save-tabs').addEventListener('click', function() {
    var groupName = prompt("Enter group name:");
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
        chrome.storage.local.set({[groupName]: JSON.stringify(tabsData)});
    });
});

// View Groups
document.getElementById('view-groups').addEventListener('click', function() {
    chrome.storage.local.get(null, function(items) {
        var tabGroups = document.getElementById('tab-groups');
        tabGroups.innerHTML = '';
        for (var key in items) {
            var group = JSON.parse(items[key]);
            var groupContainer = document.createElement('div');
            groupContainer.innerHTML = '<h3>' + key + '</h3><button class="restore-group" data-group-name="' + key + '"><img src="./restore.png" alt="restore"></button> <button class="delete-group" data-group-name="' + key + '"><img src="./delete.png" alt="delete"></button><button class="export-json" data-group-name="' + key + '"><img src="./export.png" alt="export"></button>';
            var groupLinks = document.createElement('ul');
            group.forEach(function(tab) {
                var groupLink = document.createElement('li');
                groupLink.innerHTML = '<a href="' + tab.url + '" target="_blank">' + tab.title + '</a>';
                groupLinks.appendChild(groupLink);
            });
            groupContainer.appendChild(groupLinks);
            tabGroups.appendChild(groupContainer);
        }
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