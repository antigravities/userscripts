// ==UserScript==
// @name         Researched
// @namespace    https://alexandra.moe/
// @version      0.1
// @description  Better searching for Barter.vg
// @author       Alexandra Frock <https://alexandra.moe>
// @match        https://barter.vg/*
// @grant        none
// @updateURL    https://github.com/antigravities/userscripts/raw/master/researched.user.js
// ==/UserScript==

(function() {
    'use strict';

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
                q.focus();
                loaded = true;
                sb.innerHTML = "Start typing to search " + items.length + " items";
            });
            xhr.responseType = "document";
            xhr.open("GET", "https://barter.vg/search?q=view+all+Steam");
            xhr.send();
        }

        document.getElementById("q").addEventListener("focus", function(){
            if( blur !== null ) clearTimeout(blur);

            sb.style.display = "block";
            document.getElementById("signin").style.display = "none";

            if( items.length === 0 && ! lock ){
                q.disabled = "true";
                sb.innerText = "Indexing, please wait...";
                lock = true;
                getItems();
            }

        });

        document.getElementById("q").addEventListener("blur", function(){
            if( ! loaded ) return;
            setTimeout(function(){
                sb.style.display = "none";
                document.getElementById("signin").style.display = "block";
            }, 100);
        });

        q.addEventListener("keyup", function(){
            if( to !== null ) clearTimeout(to);

            if( q.value.trim() === "" ){
                sb.innerText = "Start typing to search " + items.length + " items";
                return;
            }

            sb.innerText = "Searching...";

            to = setTimeout(function(){

                var search = fuse.search(q.value.trim());
                var html = search.length + " results<br>";

                var limit = search.length <= 10 ? search.length : 10;

                for( var i=0; i<limit; i++) {
                    html+="<a href='https://barter.vg/i/" + search[i].b + "'>" + search[i].n + "</a><br>";
                }

                if( search.length > 10 ){
                    html+="<a href='https://barter.vg/search?q=" + encodeURIComponent(q.value.trim()) + "'>and " + (search.length-10) + " more...</a>";
                }

                sb.innerHTML = html;

                to = null;
            }, 500);
        });
    });
})();
