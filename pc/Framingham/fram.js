function start(){
  document.getElementById("putR").innerHTML = '<h1>Your Results - Heart Age:</h1><table id="FraminghamChart"><tbody><tr><td colspan="12">Framingham Ten-Year Coronary Heart Disease Risk</td></tr><tr><td rowspan="2"><a name="miniframhere"></a>Systolic BP</td><td colspan="5">Total Cholesterol</td></tr><tr><td id="c1">4</td><td id="c2">5</td><td id="c3">6</td><td id="c4">7</td><td id="c5">8</td></tr><tr><td id="bp2"></td><td id="bp2c1"><br /></td><td id="bp2c2"><br /></td><td id="bp2c3"><br /></td><td id="bp2c4"><br /></td><td id="bp2c5"><br /></td></tr><tr><td id="bp3">110</td><td id="bp3c1"><br /></td><td id="bp3c2"><br /></td><td id="bp3c3"><br /></td><td id="bp3c4"><br /></td><td id="bp3c5"><br /></td></tr><tr><td id="bp4">120</td><td id="bp4c1"><br /></td><td id="bp4c2"><br /></td><td id="bp4c3"><br /></td><td id="bp4c4"><br /></td><td id="bp4c5"><br /></td></tr><tr><td id="bp5">130</td><td id="bp5c1"><br /></td><td id="bp5c2"><br /></td><td id="bp5c3"><br /></td><td id="bp5c4"><br /></td><td id="bp5c5"><br /></td></tr><tr><td id="bp6">140</td><td id="bp6c1"><br /></td><td id="bp6c2"><br /></td><td id="bp6c3"><br /></td><td id="bp6c4"><br /></td><td id="bp6c5"><br /></td></tr><tr><td id="bp7">150</td><td id="bp7c1"><br /></td><td id="bp7c2"><br /></td><td id="bp7c3"><br /></td><td id="bp7c4"><br /></td><td id="bp7c5"><br /></td></tr><tr><td id="bp8"></td><td id="bp8c1"><br /></td><td id="bp8c2"><br /></td><td id="bp8c3"><br /></td><td id="bp8c4"><br /></td><td id="bp8c5"><br /></td></tr></tbody></table>';
  
     var lert=""; 
     var A1C=document.getElementById('A1C').value; 
     if ((A1C*1)<1) {A1C=A1C*100};  //if stored as actual value convert to percent
     if (A1C>6.4) {lert += " In the absesnce of Iron or B12 deficiency, Alcoholism, CRF, Splenectomy, Chronic Opiates, an A1C of "+A1C+"% is diagnostic of Diabetes.  If so you may want the UKPDS calculator instead."};
     var history = document.getElementById('history').value.toLowerCase();
     if (history.indexOf('diabet')>-1){lert += " This patient appears to have a history of diabetes."};
     if ((history.indexOf('heart')>-1)||(history.indexOf('stent')>-1)||(history.indexOf('coronary')>-1)){lert += " Your patient may already have a history of heart disease."};
     if (history.indexOf('ischemi')>-1){lert += " Your patient may already have a history of ischemia."};
     if (lert.length>0){alert("WARNING\nThis form is meant for primary prevention in non diabetics.  While this algorithm is unreliable the calculator may be inappropriate for this patient." + lert)};

     //second load the form with values that need to be derived
     checkGender();
     UpdateBP();
     checkBPRx(); 
     checkSmoker(); 
     Update();
    }

    function checkGender(){
        if (document.getElementById('PatientGender').value == 'M'){
            document.getElementById('cMale').checked = true;
        }else if (document.getElementById('PatientGender').value == 'F'){
            document.getElementById('cFemale').checked = true;
        }
        return;
    }

    function checkBPRx(){
        if (document.getElementById('BPRx').value == 'Y'){
            document.getElementById('cTreated').checked = true;
        }
        return;
    }

    function checkSmoker(){
        return;
    }

    function UpdateBP(){
        return;
    }

    function Update(){
        if ((document.getElementById('cSystolic').value > '')&&(document.getElementById('cCholesterol').value >0)){
            UpdateNonDiabetic();
        }
        return;
    }