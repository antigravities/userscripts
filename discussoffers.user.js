// ==UserScript==
// @name         Discuss Offers
// @namespace    https://alexandra.moe/
// @version      1.0
// @description  Discuss offers with other Lestrade's users using a template. Intended to be used until the comments system is implemented.
// @author       Alexandra antigravities
// @match        https://lestrades.com/offer/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
    var templates = {};
    
    // CHANGE TEMPLATES HERE
    templates.Declined = "Hi! I declined your [url={{offer-url}}]offer[/url] because:\n\n{{reason}}\n\nThanks for the offer anyway! Feel free to send me another!\n\n-Alex";
    templates.Accepted = "Hi, I just wanted to discuss something with you about this [url={{offer-url}}]offer[/url]:\n\n{{reason}}\n\nThanks!\n-Alex"
    templates.Unread = templates.Accepted;
    templates.Completed = templates.Completed;
    templates.Canceled = templates.Accepted;
    templates.Pending = templates.Pending;

    var window = unsafeWindow;
    var st = document.getElementsByTagName("h2")[0];
    var oto;
    if( document.getElementsByTagName("strong")[0].children[0].href.toString() == document.getElementById("userbox").children[0].href.toString() ) oto = document.getElementsByTagName("strong")[1].children[0].getAttribute("data-id");
    else oto = document.getElementsByTagName("strong")[0].children[0].getAttribute("data-id");
    var tmpl = templates[st.innerText.split("current status: ")[1]];
    st.innerHTML += "<br><br><input type='text' id='reason'></input><form action='/pm/?sa=send2' method='post'><input type='hidden' name='" + window.we_sessvar + "' value='" + window.we_sessid + "'></input><input type='hidden' name='subject' value='Re: your offer #" + window.location.toString().split("/")[4] + "'></input><input type='hidden' name='recipient_to[]' value='" + oto + "'></input><input type='hidden' id='m_message' name='message' value=\"" +
    tmpl.replace("{{offer-url}}", window.location.toString()) + "\"/><input type='submit' value='Discuss this offer' onclick=\"document.getElementById('m_message').value=document.getElementById('m_message').value.replace('{{reason}}', document.getElementById('reason').value);\"></input></form>";
})();
