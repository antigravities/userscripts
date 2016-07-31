// ==UserScript==
// @name         ScreenshotFilter
// @namespace    https://antigraviti.es/
// @version      0.4
// @description  Hide Steam screenshots in the activity feed from games you specify
// @author       Alexandra "antigravities" F.
// @match        *://steamcommunity.com/*/home*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @updateURL    https://github.com/antigravities/userscripts/raw/master/screenshotfilter.user.js
// ==/UserScript==

(function(){
    var extAntigravities_FilterGames = [];
    
    if( GM_getValue("extAntigravities_Filter") !== undefined ) extAntigravities_FilterGames = JSON.parse(GM_getValue("extAntigravities_Filter"));

    var blotter_hide_screenshot = unsafeWindow.document.createElement("a");
    blotter_hide_screenshot.setAttribute("class", "blotter_hide_screenshot btn_grey_grey btn_small_thin");
    blotter_hide_screenshot.innerHTML = "<span>Add game to screenshot filter</span>";

    function extAntigravities_Filter(){
        Array.prototype.slice.call(unsafeWindow.document.getElementsByClassName("blotter_screenshot")).forEach(function(v,k){
            if( v.getElementsByTagName("a").length > 2 && extAntigravities_FilterGames.indexOf(v.getElementsByTagName("a")[2].innerText.trim()) > -1){
                var theA = unsafeWindow.document.createElement("a");
                theA.setAttribute("href", "#");
                theA.addEventListener("click", function(){
                    extAntigravities_FilterRemoveGame(v.getElementsByTagName("a")[0].innerText.trim());
                    unsafeWindow.history.go(0);
                    return false;
                });
                theA.innerText = "Refresh and show screenshots of this game";
                v.innerHTML = "A screenshot from " + v.getElementsByTagName("a")[2].outerHTML.trim() + " uploaded by " + v.getElementsByTagName("a")[1].outerHTML + " was hidden. ";
                v.appendChild(theA);
            }
        });

        Array.prototype.slice.call(unsafeWindow.document.getElementsByClassName("blotter_control_container")).forEach(function(v,k){
            if( v.parentElement.parentElement.getAttribute("class") == "blotter_screenshot" && v.getElementsByClassName("blotter_hide_screenshot").length < 1 ){
                var b = blotter_hide_screenshot.cloneNode(true);
                b.addEventListener("click", function(){
                    extAntigravities_FilterAddGame(v.parentElement.parentElement.getElementsByTagName("a")[2].innerText.trim());
                    return false;
                });
                v.insertBefore(b, v.getElementsByClassName("blotter_voters_names")[0]);
            }
        });
    }

    function extAntigravities_FilterRemoveGame(game){
        extAntigravities_FilterGames.splice(extAntigravities_FilterGames.indexOf(game), 1);
        GM_setValue("extAntigravities_Filter", JSON.stringify(extAntigravities_FilterGames));
        history.go(0);
    }

    function extAntigravities_FilterAddGame(game){
        extAntigravities_FilterGames.push(game);
        GM_setValue("extAntigravities_Filter", JSON.stringify(extAntigravities_FilterGames));
    }

    unsafeWindow.addEventListener("load", extAntigravities_Filter);
    setInterval(extAntigravities_Filter, 1000);
})();
