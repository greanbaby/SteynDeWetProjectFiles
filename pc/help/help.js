var helpHeader = '<section><article><div class="sectionTitle" id="helpdescr"><h1>',
    helpMainTop = '</h1></div><div class="sectionContent" id="helpsection"><p>',
    helpMainBottom = '</p></div></article><div class="clear"></div></section>',
    helpAgeScreening = 'As you get older you will be due for various health screening tests such as colonoscopy.',
    helpBMI = 'Body Mass Index target is less than 32.',
    helpBP = 'Blood Pressure target is less than 130/80.',
    helpChol = 'Total Cholesterol umol/L',
    helpCR = 'Creatinine umol/L<br>Target is 50-120',
    helpGFR = 'Glomerular filtration rate (GFR) is a test used to check how well the kidneys are working.<br>Target is greater than 59',
    helpGHT = 'Good Health Team is a multi-disciplinary group of health professionals.',
    helpHbA1c = 'Hemoglobin A1c %<br>Target is less than 7%',
    helpHDL = 'HDL Cholesterol mmol/L',
    helpLDL = 'LDL Cholesterol mmol/L<br>Target is less than 3',
    helpMACR = 'Microalbumin/Creatinine Ratio mg/mmol<br>Target is less than 2',
    helpMAUR = 'Microalbumin, Urine mg/L<br>Target is less than 21',
    helpTrig = 'Triglyceride mmol/L<br>Target is less than 2.31',
    queryin = window.location.search.substring(1);

if (isNaN(queryin)) {
    queryin = queryin.toUpperCase();
} else {
    queryin = "HELP";
}

document.title = queryin;
document.getElementById('topmainArea').innerHTML = '<div id="name">' +
    '<a href="#" onClick="window.close()">Close Help</a>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;' +
    '<a href="#" onClick="window.location.assign(\'help.html?help\')">Show All Help</a><br>' +
    '<h2 class="quickFade delayThree" id="helpname"></h2></div><div class="clear"></div>';

switch (queryin) {
case "AGE":
    document.getElementById('mainArea').innerHTML = helpHeader + 'Health Screening:' + helpMainTop + helpAgeScreening + helpMainBottom;
    break;

case "BMI":
    document.getElementById('mainArea').innerHTML = helpHeader + 'Body Mass Index:' + helpMainTop + helpBMI + helpMainBottom;
    break;

case "BP":
    document.getElementById('mainArea').innerHTML = helpHeader + 'Blood Pressure:' + helpMainTop + helpBP + helpMainBottom;
    break;

case "CHOL":
    document.getElementById('mainArea').innerHTML = helpHeader + 'Total Cholesterol:' + helpMainTop + helpChol + helpMainBottom;
    break;

case "CR":
    document.getElementById('mainArea').innerHTML = helpHeader + 'Creatinine:' + helpMainTop + helpCR + helpMainBottom;
    break;

case "GFR":
    document.getElementById('mainArea').innerHTML = helpHeader + 'GFR Estimated:' + helpMainTop + helpGFR + helpMainBottom;
    break;

case "GHT":
    document.getElementById('mainArea').innerHTML = helpHeader + 'Good Health Team:' + helpMainTop + helpGHT + helpMainBottom;
    break;

case "HBA1C":
    document.getElementById('mainArea').innerHTML = helpHeader + 'Hemoglobin A1c:' + helpMainTop + helpHbA1c + helpMainBottom;
    break;

case "HDL":
    document.getElementById('mainArea').innerHTML = helpHeader + 'The Good Cholesterol<br><br>HDL Cholesterol:' + helpMainTop + helpHDL + helpMainBottom;
    break;

case "LDL":
    document.getElementById('mainArea').innerHTML = helpHeader + 'The Bad Cholesterol<br><br>LDL Cholesterol:' + helpMainTop + helpLDL + helpMainBottom;
    break;

case "MACR":
    document.getElementById('mainArea').innerHTML = helpHeader + 'Ma/Creatinine Ratio:' + helpMainTop + helpMACR + helpMainBottom;
    break;

case "MAUR":
    document.getElementById('mainArea').innerHTML = helpHeader + 'Microalbumin, Urine:' + helpMainTop + helpMAUR + helpMainBottom;
    break;

case "TRIG":
    document.getElementById('mainArea').innerHTML = helpHeader + 'Triglyceride:' + helpMainTop + helpTrig + helpMainBottom;
    break;

default:
    document.getElementById('mainArea').innerHTML = helpHeader + 'Help:' + helpMainTop + '<a href="http://pc.sgin.info">pc.sgin.info</a> Help</p>' + '<p><a href="help.html?AGE">Age Based Health Screening</a></p>' + '<p><a href="help.html?BP">Blood Pressure</a></p>' + '<p><a href="help.html?BMI">Body Mass Index</a></p>' + '<p><a href="help.html?CHOL">Cholesterol</a></p>' + '<p><a href="help.html?CR">Creatinine</a></p>' + '<p><a href="help.html?GFR">GFR Estimated</a></p>' + '<p><a href="help.html?GHT">Good Health Team</a></p>' + '<p><a href="help.html?HBA1C">Hemoglobin A1c</a></p>' + '<p><a href="help.html?HDL">HDL Cholesterol</a></p>' + '<p><a href="help.html?LDL">LDL Cholesterol</a></p>' + '<p><a href="help.html?MACR">Microalbumin/Creatinine Ratio</a></p>' + '<p><a href="help.html?MAUR">Microalbumin Urine</a></p>' + '<p><a href="help.html?TRIG">Triglyceride</a></p>' + helpMainBottom;
}