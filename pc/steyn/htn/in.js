(function writeHypertensionDetails() {
    "use strict";
    var queryin = window.location.search.substring(1),
        numnav = 0,
        nextnav = 0,
        prevnav = 0,
        currentVal = "",
        htnSingle,
        property;

    if (isNaN(queryin)) {
        queryin = "1";
    }

    if (parseInt(queryin, 10) < 1) {
        queryin = "1";
    }

    numnav = parseInt(queryin, 10);

    //htns defined in htns.js
    if (numnav > htns.length) {
        numnav = htns.length;
        queryin = numnav.toString();
    }

    nextnav = numnav + 1;
    prevnav = numnav - 1;

    if (numnav > 1) {
        document.getElementById("previn").href = "in.html?" + prevnav.toString();
    }

    document.getElementById("nextin").href = "in.html?" + nextnav.toString();
    document.getElementById("FakeName").innerHTML = "Hypertensive Patient Q" + queryin;
    document.getElementById("htnavg").innerHTML = "Average hypertensive patient visits in one year: 7.98";
    document.getElementById("htnupd").innerHTML = "Dr. De Wet; Updated 10-Feb-16; &nbsp;Date format dd-mmm-yy";

    htnSingle = htns[numnav - 1];
    for (property in htnSingle) {
        if (htnSingle.hasOwnProperty(property)) {
            if (property !== "ProblemList" &&
                    property !== "Medications" &&
                    property !== "FakeName" &&
                    property !== "BPr" &&
                    property !== "BPDate" &&
                    property !== "BPr2" &&
                    property !== "BP2Date" &&
                    property !== "BPr3" &&
                    property !== "BP3Date" &&
                    property !== "GHTLast" &&
                    property !== "BPS" &&
                    property !== "Sys1" &&
                    property !== "Dia1" &&
                    property !== "Sys2" &&
                    property !== "Dia2" &&
                    property !== "Num") {
                currentVal = document.getElementById("htnvals").innerHTML;
                if (property === "BMI" ||
                        property === "Visits" ||
                        property === "Smoking") {
                    document.getElementById("htnvals").innerHTML = currentVal + "<div class='col-xs-4 col-sm-3 col-md-2 col-lg-1' id='" + property + "'><div class='box'><p class='header'>" + property + "<br><b>" + (htnSingle[property] === null ? "&nbsp;" : htnSingle[property]) + "</b></p></div></div>";
                } else {
                    document.getElementById("htnvals").innerHTML = currentVal + "<div class='col-xs-4 col-sm-3 col-md-2 col-lg-1' id='" + property + "'><div class='box'><p class='header'>" + property + "<br>" + htnSingle[property] + "</p></div></div>";
                }
            }
        }
    }

    document.getElementById("htnproblems").innerHTML = htnSingle.ProblemList;
    document.getElementById("htnmeds").innerHTML = htnSingle.Medications;

    //genCVURL() defined in ../genf.js
    document.getElementById("htnnote").innerHTML = '<a href="' + genCVURL() + '" target="_blank"><button class="btn btn-primary" id="btnFramingham">Framingham Heart Risk Calculator</button></a><br>What is shown is NOT all parameters being considered in your health, we are only sharing a small amount of data here.';
    document.getElementById("minifram").src = genCVURL() + "#miniframhere";
}());