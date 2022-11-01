chrome.runtime.onInstalled.addListener(async () => {
    fetch("123.txt").then(response => response.text()).then(data => {
        var Tags = data.split('\n');
        chrome.storage.local.set({ Tags });
    });
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && (
        tab.url.includes("https://censored.booru.org/index.php?page=post") || 
        tab.url == "https://censored.booru.org/index.php"
    )) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: searchPlus
        });
    }
})

// https://www.w3schools.com/howto/howto_js_autocomplete.asp modified
function searchPlus(){
    function autocomplete (inp, arr, filter, amount) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i;
            var val = this.value.split(" ");
            val = val[val.length -1];
            var base_val = this.value.substr(0, this.value.length - val.length)
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            var found = 0;
            var index = 0;
            while(found < amount && index < arr.length){
                match = findMatch(arr[index], val, filter)
                if(match.length){
                    b = document.createElement("DIV");
                    var col = ["_censoring", "censored_", "censor_request", "artist", "artist_request", "character", "character_request", "series", "series_request", "editor", "caption"];
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
                    b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = base_val + this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                    found++;
                }
                index++;
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
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
                        while(hay[j].toLowerCase() != i.toLowerCase()){
                            result[result.length-1] += hay[j]
                            j++
                            if(j >= hay.length){
                                return [];
                            }
                        }
                        result.push(i);
                    }
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
        Tags  : null, 
        filter: "match",
        amount: 30
    }, function(items) {
        autocomplete(document.getElementById(searchbar), items.Tags, items.filter, items.amount)
    });
}