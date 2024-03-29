chrome.runtime.onInstalled.addListener(async () => {
    fetch("tags.txt").then(response => response.text()).then(data => {
        var Tags = data.split('\n');
        chrome.storage.local.set({ Tags });
    });
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete'){
        if (
            tab.url.includes("https://censored.booru.org/index.php?page=post") || 
            tab.url == "https://censored.booru.org/index.php" ||
            tab.url == "https://censored.booru.org"
        ) {
            if(tab.url.includes("https://censored.booru.org/index.php?page=post&s=list")){
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    function: markAnimated
                });
            }
            if(tab.url.includes("https://censored.booru.org/index.php?page=post&s=view")){
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    function: resizeImg
                });
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    function: saucenao
                });
            }
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: searchPlus
            });
        }else if(
            tab.url.includes("https://censored.booru.org/index.php?page=favorites&s=view") ||
            tab.url.includes("https://censored.booru.org/index.php?page=account_profile")
        ){
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: markAnimated
            });
        }
    }
})

function markAnimated(){
    chrome.storage.local.get({
        animated : true
    }, function(items) {
        if(items.animated){
            var imgs = document.getElementsByTagName("img");
            for(var img of imgs){
                if(img.title.includes("animated")){
                    img.classList.add("cen-plus-animated");
                }
            }
        }
    });
}

function resizeImg(){
    //resize image
    chrome.storage.local.get({
        resize : true
    }, function(items) {
        if(items.resize){
            var img = document.getElementsByTagName("img")[0];
            if(img.classList.contains("cen-plus-resize")){
                return;
            }
            var resize_info = document.createElement("a");
            resize_info.setAttribute("href", "#");
            function undo_resize(){
                img.classList.remove("css-resize");
                resize_info.innerHTML = "This image is full-sized. Resize to fit screen?"
                resize_info.onclick = do_resize;
            }
            function do_resize(){
                img.classList.add("css-resize");
                resize_info.innerHTML = "This image is resized. Reset to 100% ?"
                resize_info.onclick = undo_resize;
            }
            do_resize();
                            
            img.parentNode.parentNode.insertBefore(resize_info, img.parentNode);
            img.classList.add("cen-plus-resize");
            img.classList.add("css-resize");
        }
    });
}

function saucenao(){
    var img = document.getElementsByTagName("img")[0];
    if(img.classList.contains("saucenao")){
        return;
    }
    img.classList.add("saucenao");
    var saucenao_info = document.createElement("a");
    saucenao_info.innerHTML = "Find Sauce";
    saucenao_info.href = "https://saucenao.com/search.php?url="+encodeURIComponent(img.src);
    img.parentNode.parentNode.insertBefore(saucenao_info, img.parentNode);
    var sep = document.createElement("b");
    sep.innerHTML = ' | ';
    img.parentNode.parentNode.insertBefore(sep, img.parentNode);
}

// https://www.w3schools.com/howto/howto_js_autocomplete.asp modified
function searchPlus(){
    function autocomplete (inp, arr, filter, no_prefix, amount) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i;
            var val = this.value.split(" ").pop();
            var base_val = this.value.substr(0, this.value.length - val.length)
            if(val[0] == "-"){
                base_val += "-";
                val = val.substr(1);
            }
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "-autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            var found = 0;
            var index = 0;
            while(found < amount && index < arr.length){
                var hay = arr[index]
                if(no_prefix){
                    var prefix = ["artist:", "character:", "series:", "editor:"];
                    for (var item of prefix){
                        hay = hay.replace(item, "");
                    }
                }
                match = findMatch(hay, val, filter)
                if(match.length){
                    b = document.createElement("a");
                    var col = ["_censoring", "censored_", "censor_request", "artist", "artist_request", "character", 
                        "character_request", "series", "series_request", "editor", "caption"];
                    for (var item of col){
                        if(arr[index].includes(item)){
                            b.className = item;
                        }
                    }
                    var strong = false;
                    b.innerHTML = "";
                    for(i of match){
                        if(strong){
                            b.innerHTML += "<strong>"+i+"</strong>";
                        }else{
                            b.innerHTML += i;
                        }
                        strong = !strong;
                    }
                    b.innerHTML += "<input type='hidden' value='" + arr[index] + "'>";
                    b.setAttribute("href", "https://censored.booru.org/index.php?page=post&s=list&tags=" + arr[index]);
                    b.addEventListener("click", function(e) {
                        e.preventDefault();
                        console.log(this.getElementsByTagName("input"))
                        /*insert the value for the autocomplete text field:*/
                        inp.value = base_val + this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                    a.appendChild(document.createElement("br"))
                    found++;
                }
                index++;
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "-autocomplete-list");
            if (x) x = x.getElementsByTagName("a");
            switch(e.keyCode){
                case 40://arrow DOWN key
                    currentFocus++;
                    addActive(x);
                    break;
                case 38://arrow UP key
                    currentFocus--;
                    addActive(x);
                    break;
                case 13://ENTER key
                    if (currentFocus > -1) {
                        e.preventDefault();
                        /*and simulate a click on the "active" item:*/
                        if (x) x[currentFocus].click();
                        currentFocus = -1;
                    }
                    break;
            }
        });
        function findMatch(hay, needle, filter){
            /*return list of string switching between matched and unmatch parts
            when there is no match return empty list*/
            if(hay.length < needle.length){
                return [];
            }
            switch(filter){
                case "from_start":
                    if(hay.toLowerCase().substr(0, needle.length) == needle.toLowerCase()){
                        return ["", hay.substr(0,needle.length), hay.substr(needle.length)]
                    }
                    break;
                case "match":
                    var i = hay.toLowerCase().indexOf(needle.toLowerCase());
                    if(i != -1){
                        return [hay.substr(0,i), hay.substr(i,needle.length), hay.substr(i+needle.length)]
                    }
                    break;
                case "loose_match":
                    var result = [];
                    var j = 0;
                    for(var i of needle){
                        result.push("");
                        while(j < hay.length && hay[j].toLowerCase() != i.toLowerCase()){
                            result[result.length-1] += hay[j]
                            j++
                        }
                        result.push(i);
                        j++
                        if(j >= hay.length){return [];}
                    }
                    result.push(hay.substr(j));
                    return result;
            }
            return [];
        }
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
            }
        }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    var searchbar = "stags";
    if(document.getElementById(searchbar) == null){
        searchbar = "tags"
    }

    document.getElementById(searchbar).parentElement.autocomplete = "off";

    var inp = document.getElementById(searchbar);
    var wrap = document.createElement("div");
    wrap.className = "autocomplete";
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(inp);

    chrome.storage.local.get({
        Tags     : null, 
        filter   : "match",
        no_prefix: true,
        amount   : 30
    }, function(items) {
        autocomplete(document.getElementById(searchbar), items.Tags, items.filter, items.no_prefix, items.amount)
    });
}
