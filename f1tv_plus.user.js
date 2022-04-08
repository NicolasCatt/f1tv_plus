// ==UserScript==
// @name         F1TV+
// @namespace    https://najdek.github.io/f1tv_plus/
// @version      1.3a
// @description  A few improvements to F1TV
// @author       Mateusz Najdek
// @match        https://f1tv.formula1.com/*
// @grant        GM.xmlHttpRequest
// @connect      raw.githubusercontent.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==
(function() {
    'use strict';

    var smVersion = "1.3a";
    //<updateDescription></updateDescription>

    var smUpdateUrl = "https://raw.githubusercontent.com/najdek/f1tv_plus/v1/f1tv_plus.user.js";
    var smSyncDataUrl = "https://raw.githubusercontent.com/najdek/f1tv_plus/v1/sync_offsets.json";


    if (window.location.hash == "#sm-popup") {

        var smHtml = "<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; z-index: 999;'>" +
            "<img style='display: block; margin: 50vh auto auto auto; transform: translateY(-50%);' src='https://f1tv.formula1.com/static/3adbb5b25a6603f282796363a74f8cf3.png'>" +
            "</div>" +
            "<style>" +
            "body {overflow: hidden;}" +
            ".inset-video-item-image-container {position: fixed !important; z-index: 1000; top: 0; left: 0; height: 100%; width: 100%; background-color: #000;}" +
            ".inset-video-item-image {margin-top: 50vh; transform: translateY(-50%);}" +
            ".inset-video-item-play-action-container {width: 100%;}" +
            "</style>";
        document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smHtml);

    } else {

        function smLoad() {
            var smBtnHtml = "<div id='sm-menu' style='display: none;'>" +
                "<a id='sm-btn-popup' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Open popout'>" +
                "<span style='display: inline-block; font-size: 12px;'>POPOUT</span></a>" +
                "<a id='sm-btn-theater' role='button' class='btn btn--transparent' style='color: #000; margin: 6px;' title='Toggle theater mode'>" +
                "<span style='display: inline-block; font-size: 12px;'>THEATER</span></a>" +
                "</div>" +
                "<style>.global-header-nav .global-header-links ul { display: none; }" +
                ".global-header { display: block !important; }" +
                ".navbar button.navbar-toggler { position: fixed; top: 8px; color: #000 !important; background-color: #fff; }" +
                "@media (max-width: 991.98px) {" +
                ".header .navbar { padding: 0; }" +
                ".header .navbar .navbar-brand { display: none !important; }" +
                ".global-header-f1tvicon { display: none; }" +
                ".global-header-f-links { display: none; }" +
                ".global-header .global-header-actions { display: none; }" +
                "#sm-btn-url { margin-left: 60px !important; }" +
                "}" +
                "</style>";
            document.getElementsByClassName("global-header-nav")[0].insertAdjacentHTML("beforeend", smBtnHtml);

            var smFooterHtml = "<div style='width: 100%; background-color: #18485f; font-size: 16px; color: #fff; padding: 20px; margin-top: 20px; text-align: center;'>" +
                "F1TV+ v" + smVersion + "<a style='margin-left: 20px; color: #d3dfff;' href='https://github.com/najdek/f1tv_plus' target='_blank'>" +
                "<svg style='padding: 4px 0px 6px 0px;' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/></svg>" +
                "Source code</a>" +
                "</div>" +
                "<style> .full-footer { padding-bottom: 0 !important; } </style>";
            document.getElementsByClassName("full-footer")[0].insertAdjacentHTML("beforeend", smFooterHtml);

            document.getElementById("sm-btn-popup").addEventListener("click", function() {
                window.open(document.location.href.replace("action=play", "") + "#sm-popup", Date.now(), "width=1280,height=720");
                $("video").trigger("pause");
            });

            document.getElementById("sm-btn-theater").addEventListener("click", function() {
                if (!document.getElementById("sm-theater-style")) {
                    var smHtml = "<div id='sm-theater-style'>" +
                        "<style>" +
                        "#sm-btn-theater { background-color: #ffc1c1; }" +
                        ".vod-detail-page .container-lg:first-of-type { width: 100%; max-width: 100%; }" +
                        ".vod-detail-page .container-lg:first-of-type .col-xl-10.offset-xl-1 { margin: 0; width: 100%; max-width: 100%; flex: 0 0 100%; }" +
                        ".inset-video-item-container { margin-top: 0 !important; }" +
                        ".inset-video-item-image-container { max-height: calc(100vh - 100px); }" +
                        ".inset-video-item-play-action-container { width: 100%; }" +
                        ".sticky-header-wrapper.is-menu { margin-bottom: 94px; }" +
                        "nav.navbar { height: auto !important; }" +
                        "</style>" +
                        "</div>";
                    document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", smHtml);
                } else {
                    document.getElementById("sm-theater-style").outerHTML = "";
                }
            });
            document.getElementById("sm-btn-theater").click();
            setInterval(function() {
                if (window.location.href.includes("detail/")) {
                    document.getElementById("sm-menu").style.display = "inline-block";
                } else {
                    document.getElementById("sm-menu").style.display = "none";
                }
            }, 1000);
        }

        var smInitRetryCount = 0;
        (function smInit() {
            setTimeout(function() {
                if ((document.getElementsByClassName("global-header-nav").length > 0) && (document.getElementsByClassName("full-footer").length > 0)) {
                    smLoad();
                } else {
                    if (smInitRetryCount < 60) {
                        smInitRetryCount += 1;
                        smInit();
                    } else {
                        smLoad();
                    }
                }
            }, 500);
        }());

    }

})();
