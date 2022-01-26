function getQueryVariable(variable, query) {
    "use strict";
    var vars = query.split('&'),
        i,
        pair;
    
    for (i = 0; i < vars.length; i += 1) {
        pair = vars[i].split('=');
        
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
        
    }
    
}

(function populateFraminghamForm() {
    "use strict";
    var queryin = window.location.search.substring(1),
        d = new Date(),
        curr_date = d.toDateString();

    document.getElementById("cDate").value = curr_date;
    document.getElementById("cAge").value = getQueryVariable("age", queryin);
    document.getElementById("cCholesterol").value = getQueryVariable("chol", queryin);
    document.getElementById("cHDL").value = getQueryVariable("hdl", queryin);
    document.getElementById("cLDL").value = getQueryVariable("ldl", queryin);
    document.getElementById("cSystolic").value = getQueryVariable("systolic", queryin);

    if (getQueryVariable("smoker", queryin) === "yes") {
        document.getElementById("cCurSmoker").checked = true;
    }

    if (getQueryVariable("sex", queryin) === "F") {
        document.getElementById("cFemale").checked = true;
    }

    //UpdateNonDiabetic() is from OSCAR in the js.js file
    //UpdateNonDiabetic();
}());