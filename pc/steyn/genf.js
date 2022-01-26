function genCVURL() {
    "use strict";
	//read from the html document and create a URL to autofill the Framingham.html form
    var strFinalStr = "../../Framingham/Framingham.html",
        ageVal = document.getElementById("Age").innerHTML,
        totalChol = document.getElementById("TotalChol").innerHTML,
        cholHDL = document.getElementById("HDL").innerHTML,
        cholLDL = document.getElementById("LDL").innerHTML,
        bpVal = document.getElementById("BP").innerHTML,
        readVal = document.getElementById("Smoking").innerHTML,
        sexVal = document.getElementById("Sex").innerHTML,
        smokerVal = "",
        mySplitBP;

    ageVal = ageVal.slice(ageVal.indexOf("Age<br>") + 7, ageVal.indexOf("</p>"));
    strFinalStr = strFinalStr + '?age=' + ageVal;
    totalChol = totalChol.slice(totalChol.indexOf("<b>") + 3, totalChol.indexOf("</b>"));
    strFinalStr = strFinalStr + '&chol=' + totalChol;
    cholHDL = cholHDL.slice(cholHDL.indexOf("<b>") + 3, cholHDL.indexOf("</b>"));
    strFinalStr = strFinalStr + '&hdl=' + cholHDL;
    cholLDL = cholLDL.slice(cholLDL.indexOf("<b>") + 3, cholLDL.indexOf("</b>"));
    strFinalStr = strFinalStr + '&ldl=' + cholLDL;
    bpVal = bpVal.slice(bpVal.indexOf("<b>") + 3, bpVal.indexOf("</b>"));
    mySplitBP = bpVal.split('/');
    strFinalStr = strFinalStr + '&systolic=' + mySplitBP[0];
    sexVal = sexVal.slice(sexVal.indexOf("Sex<br>") + 7, sexVal.indexOf("</p>"));
    strFinalStr = strFinalStr + '&sex=' + sexVal;
    
    if (readVal.indexOf("Smoker") > -1) {

        if (readVal.indexOf("Non Smoker") > -1) {
            smokerVal = "";
        } else {
            smokerVal = "yes";
        }
        
    } else {
        
        if (readVal.indexOf("<b></b>") > -1) {
            smokerVal = "";
        } else {
            //Quit > 1 Year || Quit < 1 Year
            smokerVal = "";
        }

    }
    
    strFinalStr = strFinalStr + '&smoker=' + smokerVal;
    
    return strFinalStr;
}