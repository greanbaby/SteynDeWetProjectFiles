function helpMoreInfo() {
    "use strict";
    var div = document.getElementById('BMI'),
        helpurl = '<div class="hlpbottom"><a href="../../help/help.html?';
    
    document.getElementById('btnhelpinfo').style.visibility = 'hidden';
    div.innerHTML = div.innerHTML + helpurl + 'BMI" target="_blank">Body Mass Index</a><br>Target: 22-32</div>';
    div = document.getElementById('Age');
    div.innerHTML = div.innerHTML + helpurl + 'AGE" target="_blank">Age Based Screening</a></div>';
    div = document.getElementById('BP');
    div.innerHTML = div.innerHTML + helpurl + 'BP" target="_blank">Blood Pressure</a><br>Target: Less than 130/80</div>';
    div = document.getElementById('Smoking');
    
    if (div.innerHTML.indexOf("Smoker") > -1) {
    
        if (div.innerHTML.indexOf("Non Smoker") > -1) {
            div.innerHTML = div.innerHTML + "<div class='hlpbottom'>Congrats!<br>Non Smoker.</div>";
        } else {
            div.innerHTML = div.innerHTML + "<div class='hlpbottom'>Please don't smoke. Seriously.</div>";
        }
        
    } else {
        
        if (div.innerHTML.indexOf("<b></b>") > -1) {
            div.innerHTML = div.innerHTML + "<div class='hlpbottom'>Smoking status unknown.</div>";
        } else {
            //Quit > 1 Year || Quit < 1 Year
            div.innerHTML = div.innerHTML + "<div class='hlpbottom'>Congrats!<br>Non Smoker.</div>";
        }
        
    }
    
    div = document.getElementById('HbA1c');
    div.innerHTML = div.innerHTML + helpurl + 'HBA1C" target="_blank">HbA1c</a> target is 7 or less.</div>';
    div = document.getElementById('TotalChol');
    div.innerHTML = div.innerHTML + '<div class="hlpbottom"><a href="' + helpurl + 'CHOL" target="_blank">Total Cholesterol</a></div>';
    div = document.getElementById('HDL');
    div.innerHTML = div.innerHTML + helpurl + 'HDL" target="_blank">HDL Cholesterol</a><br>HDL is good cholesterol</div>';
    div = document.getElementById('LDL');
    div.innerHTML = div.innerHTML + helpurl + 'LDL" target="_blank">LDL Cholesterol</a><br>Target is below 3</div>';
    div = document.getElementById('Trig');
    div.innerHTML = div.innerHTML + helpurl + 'TRIG" target="_blank">Triglyceride</a><br>Target is below 2.31</div>';
    div = document.getElementById('HbA1c_2');
    div.innerHTML = div.innerHTML + '<div class="hlpbottom">2nd most recent A1c</div>';
    div = document.getElementById('Visits');
    div.innerHTML = div.innerHTML + '<div class="hlpbottom">All visits in 1 year including ER and GHT</div>';
    
    div = document.getElementById('cvbtn');
    //genCVURL() defined in ../genf.js
    div.innerHTML = '<a href="' + genCVURL() + '" target="_blank"><button class="btn btn-primary" id="btnFramingham">Framingham Heart Risk Calculator</button></a>';
}