// Saves options to chrome.storage
function save_options() {
  var sorting   = document.querySelector("input[name=sorting]:checked").value;
  var filter    = document.querySelector("input[name=filter]:checked").value;
  var no_prefix = document.getElementById('no_prefix').checked;
  var amount    = document.getElementById('amount').value;
  var resize    = document.getElementById('resize').checked;
  var animated  = document.getElementById('animated').checked;
  chrome.storage.local.set({
    sorting  : sorting,
    filter   : filter,
    no_prefix: no_prefix,
    amount   : amount,
    resize   : resize,
    animated : animated
  });
  fetch("tags.txt").then(response => response.text()).then(data => {
    var Tags = data.split('\n');
    if(sorting == "abc"){
      Tags.sort();
    }
    chrome.storage.local.set({ Tags });
});
}

// Restores the preferences stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get({
    sorting  : "123",
    filter   : "from_start",
    no_prefix: true,
    amount   : 30,
    resize   : true,
    animated : true
  }, function(items) {
    document.getElementById(items.sorting).checked = true;
    document.getElementById(items.filter).checked = true;
    document.getElementById('no_prefix').checked = items.no_prefix;
    document.getElementById('amount').value = items.amount;
    document.getElementById('resize').checked = items.resize;
    document.getElementById('animated').checked = items.animated;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);