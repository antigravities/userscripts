// ==UserScript==
// @name         Sub Adder
// @namespace    https://alexandra.moe/
// @version      0.2
// @description  Add subs on SteamDB or the Steam store to your Barter.vg library with one click
// @author       Alexandra Frock <https://alexandra.moe/>
// @match        *://store.steampowered.com/sub/*
// @match        *://steamdb.info/sub/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    if( GM_getValue('BarterID', 'none') == "none" ){
        var id = null;
        while( id === null ){
            id = prompt("Hello! Please enter your Barter ID below so that the Sub Adder userscript can work. It is found in your offers URL. For example, if my offers URL started with https://barter.vg/u/578/o/, my Barter ID would be 578.", "578");
        }
        GM_setValue('BarterID', id);
    }
    
    var id = GM_getValue('BarterID', 'none');
    
    var warning = "";

    var type = window.location.href.split("/")[2] == "store.steampowered.com" ? "steam" : "steamdb";
    
    if( type == "steamdb" && document.getElementById("apps") === null ) return;
    
    GM_xmlhttpRequest({
        method: "GET",
        url: window.location.href.split("/")[0] + "//store.steampowered.com/dynamicstore/userdata",
        onload: function(resp){
            
            var userdata = JSON.parse(resp.responseText);
            if( userdata.rgOwnedPackages.indexOf(parseInt(window.location.href.split("?")[0].split("/")[4])) == -1 ) warning="you do not own this package";
            
            var items = [];
            
            if( type == "steam" ){
                Array.prototype.slice.call(document.getElementsByClassName("tab_item_overlay")).forEach(function(v){
                    items.push(v.href.split("/")[4]);
                });
            } else if( type == "steamdb" ){
                Array.prototype.slice.call(document.getElementById("apps").children[1].children[1].children).forEach(function(v,k){
                    items.push(v.getAttribute("data-appid"));
                });
            }
            
            items.forEach(function(v){
               if( userdata.rgOwnedApps.indexOf(parseInt(v)) == -1 ) warning="you do not own all of the apps in this package";
            });
            
            items = items.join(",");

            var formTemplate = "<form action='https://barter.vg/u/" + id + "/l/e/#modified' method='POST' id='barterPOSTform'><input type='hidden' name='bulk_AppIDs' value='" + items + "'></input>{{button}}<input type='hidden' name='action' value='Edit'></input><input type='hidden' name='change_attempted' value=1></input><input type='hidden' name='add_from' value='AppIDs'></input></form>";
            
            if( type == "steam" ){
                var button = "<input type='submit' class='btnv6_blue_hoverfade btn_medium' value='Add this sub to your Barter.vg library'";
                if( warning.length > 0 ) button+=" data-store-tooltip='<b style=\"color: red;\">Warning: " + warning + "</span>'";
                button += "></input>";
                document.getElementsByClassName("block responsive_apppage_details_right")[0].innerHTML+=formTemplate.replace("{{button}}", button);
                BindStoreTooltip($J(".btn_medium"));
            } else if( type == "steamdb" ){
                var button = "<a href='#' onClick='document.getElementById(\"barterPOSTform\").submit();'";
                if( warning.length > 0 ) button+=" class='tooltipped' aria-label='Warning: " + warning + "'";
                document.getElementsByClassName("pagehead-actions")[0].innerHTML+=button + ">Add this sub to your Barter.vg library</a>" + formTemplate.replace("{{button}}", "");
            }
        }
    });

})();
