(function writeDiabeticDetails() {
    "use strict";
    var queryin = window.location.search.substring(1),
        numnav = 0,
        nextnav = 0,
        prevnav = 0,
        currentVal = "",
        diaSingle,
        property;

    if (isNaN(queryin)) {
        queryin = "1";
    }

    if (parseInt(queryin, 10) < 1) {
        queryin = "1";
    }

    numnav = parseInt(queryin, 10);

    //diab defined in diab.js
    if (numnav > diab.length) {
        numnav = diab.length;
        queryin = numnav.toString();
    }

    nextnav = numnav + 1;
    prevnav = numnav - 1;

    if (numnav > 1) {
        document.getElementById("previn").href = "din.html?" + prevnav.toString();
    }

    document.getElementById("nextin").href = "din.html?" + nextnav.toString();
    document.getElementById("FakeName").innerHTML = "Diabetic Patient " + queryin;
    document.getElementById("diavg").innerHTML = "Average diabetic patient visits in one year: 9.74";
    document.getElementById("diupd").innerHTML = "Dr. De Wet; Updated 10-Feb-16; &nbsp;Date format dd-mmm-yy";

    diaSingle = diab[numnav - 1];
    for (property in diaSingle) {
        if (diaSingle.hasOwnProperty(property)) {
            if (property !== "ProblemList" &&
                    property !== "Medications" &&
                    property !== "FakeName" &&
                    property !== "HbA1c_" &&
                    property !== "A1c_d" &&
                    property !== "A1c_2" &&
                    property !== "A1c_2d" &&
                    property !== "A1c_3" &&
                    property !== "A1c_3d" &&
                    property !== "GHTLast" &&
                    property !== "A1cS" &&
                    property !== "Num") {
                currentVal = document.getElementById("diavals").innerHTML;
                if (property === "BP" ||
                        property === "BMI" ||
                        property === "Visits" ||
                        property === "Smoking") {
                    document.getElementById("diavals").innerHTML = currentVal + "<div class='col-xs-4 col-sm-3 col-md-2 col-lg-1' id='" + property + "'><div class='box'><p class='header'>" + property + "<br><b>" + (diaSingle[property] === null ? "&nbsp;" : diaSingle[property]) + "</b></p></div></div>";
                } else {
                    document.getElementById("diavals").innerHTML = currentVal + "<div class='col-xs-4 col-sm-3 col-md-2 col-lg-1' id='" + property + "'><div class='box'><p class='header'>" + property + "<br>" + diaSingle[property] + "</p></div></div>";
                }
            }
        }
    }

    document.getElementById("diaproblems").innerHTML = diaSingle.ProblemList;
    document.getElementById("diameds").innerHTML = diaSingle.Medications;

    //genCVURL() defined in ../genf.js
    document.getElementById("dinote").innerHTML = '<a href="' + genCVURL() + '" target="_blank"><button class="btn btn-primary" id="btnFramingham">Framingham Heart Risk Calculator</button></a><br>What is shown is NOT all parameters being considered in your health, we are only sharing a small amount of data here.';
    document.getElementById("minifram").src = genCVURL() + "#miniframhere";
}());