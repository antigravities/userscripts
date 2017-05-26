// ==UserScript==
// @name         Researched
// @namespace    https://alexandra.moe/
// @version      0.2
// @description  Better searching for Barter.vg
// @author       Alexandra Frock <https://alexandra.moe>
// @match        https://barter.vg/*
// @grant        none
// @updateURL    https://github.com/antigravities/userscripts/raw/master/researched.user.js
// ==/UserScript==

(function() {

    var fuse = document.createElement("script");
    fuse.src = "https://cdnjs.cloudflare.com/ajax/libs/fuse.js/2.6.1/fuse.min.js";
    document.getElementsByTagName("head")[0].appendChild(fuse);

    fuse.addEventListener("load", function(){
        var sb = document.createElement("div");
        sb.id = "searchResults";
        sb.setAttribute("style", "text-align: center;");
        sb.style.display = "none";
        document.getElementById("searchForm").appendChild(sb);

        var items = [];
        var lock = false;
        var fuse = null;
        var to = null;
        var blur = null;
        var loaded = false;
        var sb2 = null;
        var ins = null;
        var loadingTriggeredBySearchBox = true;

        function getItems(){
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function(){
                Array.prototype.slice.call(this.responseXML.getElementsByClassName("searchResults")[0].getElementsByTagName("li")).forEach(function(v, k){
                    var bid = v.children[0].getAttribute("href").split("/")[4];
                    var name = v.children[0].innerText.trim();
                    items.push({n: name, b: bid});
                });

                var fopts = {
                    shouldSort: true,
                    threshold: 0.3,
                    maxPatternLength: 32,
                    minMatchCharLength: 2,
                    keys: [ "n", "b" ]
                };

                fuse = new Fuse(items, fopts);

                q.removeAttribute("disabled");
                
                if( loadingTriggeredBySearchBox ) q.focus();
                else ins.focus();

                if( ins !== null ){
                    ins.removeAttribute("disabled");
                }

                loaded = true;
                if( loadingTriggeredBySearchBox ) sb.innerHTML = "Start typing to search " + items.length + " items";
                else sb2.innerHTML = "Start typing to search " + items.length + " items";
            });
            xhr.responseType = "document";
            xhr.open("GET", "https://barter.vg/search?q=view+all+Steam");
            xhr.send();
        }

        function getAppropriateElement(e){
            if( e.srcElement.tagName == "TEXTAREA" ) return sb2;
            else return sb;
        }

        function isFromTextArea(e){
            return e.srcElement.tagName == "TEXTAREA";
        }

        function focus(e){
            if( blur !== null ) clearTimeout(blur);

            var sb = getAppropriateElement(e);

            if( ! isFromTextArea(e) ){
                document.getElementById("signin").style.display = "none";
                sb.style.display = "block";
            }

            if( items.length === 0 && ! lock ){
                q.disabled = "true";
                if( ins !== null ) ins.disabled = "true";
                sb.innerText = "Indexing, please wait...";
                lock = true;
                loadingTriggeredBySearchBox = ! isFromTextArea(e);
                getItems();
            }

        }

        function blurF(e){
            if( ! loaded ) return;

            setTimeout(function(){
                sb.style.display = "none";
                document.getElementById("signin").style.display = "block";
            }, 100);
        }

        rebuild = function(x){
            var y = ins.value.split("\n");
            y[y.length-1]=decodeURIComponent(x);
            ins.value = y.join("\n");
        };
        
        function keyup(e){
            if( to !== null ) clearTimeout(to);

            var srch = "";
            
            if( isFromTextArea(e) ){
                var asplod = ins.value.trim().split("\n");
                srch = asplod[asplod.length-1];
            } else {
                srch = q.value.trim();
            }
            
            if( srch === "" ){
                getAppropriateElement(e).innerText = "Start typing to search " + items.length + " items";
                return;
            }

            getAppropriateElement(e).innerText = "Searching...";

            to = setTimeout(function(){

                var search = fuse.search(srch);
                var html = search.length + " results<br>";

                var limit = search.length <= 10 ? search.length : 10;

                for( var i=0; i<limit; i++) {
                    if( ! isFromTextArea(e) ) html+="<a href='https://barter.vg/i/" + search[i].b + "'>" + search[i].n + "</a><br>";
                    else html+="<a onClick=\"rebuild(\'" + encodeURIComponent(search[i].n) + "\');\">" + search[i].n + "</a><br>";
                }

                if( search.length > 10 && ! isFromTextArea(e) ){
                    html+="<a href='https://barter.vg/search?q=" + encodeURIComponent(q.value.trim()) + "'>and " + (search.length-10) + " more...</a>";
                }

                getAppropriateElement(e).innerHTML = html;

                to = null;
            }, 500);
        }

        q.addEventListener("focus", focus);
        q.addEventListener("blur", blurF);
        q.addEventListener("keyup", keyup);

        var webloc = window.location.toString().split("/");

        if( webloc.length >= 7 && webloc[6] == "e" ){
            ins = document.getElementsByTagName("textarea")[0];

            ins.addEventListener("focus", focus);
            //ins.addEventListener("blur", blurF);
            ins.addEventListener("keyup", keyup);

            sb2 = document.createElement("div");
            sb2.style.align = "center";
            sb2.style["background-color"] = "white";
            sb2.style.opacity = "0.9";
            sb2.style.float = "left";

            ins.parentNode.insertBefore(sb2, ins.nextSibling);
        }
    });
})();
