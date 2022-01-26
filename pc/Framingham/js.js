var min_age_fram = 20;
var max_age_fram = 79;

var min_age = 30;
var max_age = 75;

function UpdateNonDiabetic()
{
	//input values
	var age_now				= parseFloat(document.getElementById("cAge").value);	
	
	age_now = Math.max(age_now,min_age_fram);
	age_now = Math.min(age_now,max_age_fram);
	document.getElementById("cAge").value = age_now;
	
	var female 				= (document.getElementById("cMale").checked)?0:1;
	var smoking 			= (document.getElementById("cCurSmoker").checked)?1:0;	
	var treated_bp 			= (document.getElementById("cTreated").checked)?1:0;			
	var systolic 			= parseFloat(document.getElementById("cSystolic").value);	
	var total_chol 			= parseFloat(document.getElementById("cCholesterol").value);
	var hdl_chol 			= parseFloat(document.getElementById("cHDL").value);			
    
	UpdateFraminghamChart(female, smoking, systolic, treated_bp, total_chol, hdl_chol, age_now);	
	
	WriteScript( age_now, female, smoking, systolic, treated_bp, total_chol, hdl_chol )
	
	document.getElementById('subject').value = (GetFraminghamCHDRiskPoints(age_now, female, smoking, systolic, treated_bp, total_chol, hdl_chol)*100).toFixed(1)+'% CHD outcome/10y' ;
							
}		

function UpdateDiabetic()
{
	//input values
	var age_now				= parseFloat(document.getElementById("cAge").value);	
	
	age_now = Math.max(age_now,min_age);
	age_now = Math.min(age_now,max_age);
	document.getElementById("cAge").value = age_now;
	
	var female 				= (document.getElementById("cMale").checked)?0:1;
	var ethnicity 			= (document.getElementById("cAfroCaribbean").checked)?1:0;
	var smoking 			= (document.getElementById("cCurSmoker").checked)?1:0;
	var diabetes_duration	= parseFloat(document.getElementById("cDuration").value);
	var atrial 				= (document.getElementById("cAtrialNo").checked)?0:1;				
	var systolic 			= parseFloat(document.getElementById("cSystolic").value);
	var alc 				= parseFloat(document.getElementById("cALC").value);		
	var total_chol 			= parseFloat(document.getElementById("cCholesterol").value);
	var hdl_chol 			= parseFloat(document.getElementById("cHDL").value);	
	var predict_length 		= 10;//parseFloat(document.getElementById("cPredictionLength").value);		
    
	var age_at_diagnosis 	= age_now - diabetes_duration;			
	var lipid_ratio 		= total_chol / hdl_chol;
    
	UpdateUKPDSChart( age_at_diagnosis, female, ethnicity, smoking, alc, systolic, lipid_ratio, atrial, diabetes_duration );	
	
	WriteScriptDiabetic( age_at_diagnosis, female, ethnicity, smoking, alc, systolic, lipid_ratio, atrial, diabetes_duration );		
    
	//CHD
    
	var chd_risk = GetUKPDSCHDRisk(age_at_diagnosis, female, ethnicity, smoking, alc, systolic, lipid_ratio, diabetes_duration, predict_length)	
	document.getElementById('subject').value = (chd_risk*100).toFixed(1)+'% CHD outcome/10y' ;
    
	//FATAL CHD
    
	//Risk of fatal MI in t years �= sum ( (risk of MI in year i) * ( MI case fatality in year i ) )
    
	var fatal_chd_risk = 0.0;
    
	for ( var t = 0; t < predict_length; ++t )
	{
		var chd_risk_t = GetUKPDSCHDRisk(age_at_diagnosis, female, ethnicity, smoking, alc, systolic, lipid_ratio, diabetes_duration + t, 1);
		var case_fatality_t = GetUKPDSFatalCHDRisk(age_at_diagnosis, alc, systolic, diabetes_duration + t);
		fatal_chd_risk += (chd_risk_t * case_fatality_t);
	}			
	
	//STROKE
    
	var stroke_risk = GetUKPDSStrokeRisk(age_at_diagnosis, female, smoking, atrial, systolic, lipid_ratio, diabetes_duration, predict_length)
    
	//FATAL STROKE
	
	var fatal_stroke_risk = GetUKPDSFatalStrokeRisk(systolic, 0); // should we not ask about previous stroke?			
    
}		

///////////////////// UKPDS CHD  /////////////////////

function GetUKPDSCHDRisk(age_at_diagnosis, female, ethnicity, smoking, alc, systolic, lipid_ratio, diabetes_duration, predict_length)
{
	
	var chd_q0 = 0.0112		//intercept
	var chd_b1 = 1.059 		//Risk ratio for one year of age at diagnosis of diabetes
	var chd_b2 = 0.525 		//Risk ratio for female sex
	var chd_b3 = 0.390 		//Risk ratio for Afro-Caribbean ethnicity
	var chd_b4 = 1.350		//Risk ratio for smoking
	var chd_b5 = 1.183		//Risk ratio for 1 % increase in alc
	var chd_b6 = 1.088 		//Risk ratio for 10 mmHg increase in systolic blood pressure
	var chd_b7 = 3.845		//Risk ratio for unit increase in logarithm of lipid ratio
	var chd_d = 1.078		//Risk ratio for each year increase in duration of diagnosed diabetes
    
	//from appendix
	/*Conversely, users may have estimates less precise than our own, such as a single measurement of HbA�c where we 
	have used a mean of two values. In this case the  parameter values in Table 3 would be over-estimates, and β5, β6, and β7 
	should be decreased to 1.144, 1.073 and 3.11 respectively */
    
	/*
     var chd_b5 = 1.144		//Risk ratio for 1 % increase in ALC
     var chd_b6 = 1.073 		//Risk ratio for 10 mmHg increase in systolic blood pressure
     var chd_b7 = 3.11		//Risk ratio for unit increase in logarithm of lipid ratio
     
     var chd_b5 = 1.250		//Risk ratio for 1 % increase in ALC
     var chd_b6 = 1.111 		//Risk ratio for 10 mmHg increase in systolic blood pressure
     var chd_b7 = 5.171		//Risk ratio for unit increase in logarithm of lipid ratio
     */
	
	var chd_b1out = Math.pow(chd_b1, (age_at_diagnosis - 55)); 
	var chd_b2out = Math.pow(chd_b2, female);
	var chd_b3out = Math.pow(chd_b3, ethnicity);
	var chd_b4out = Math.pow(chd_b4, smoking);
	var chd_b5out = Math.pow(chd_b5, (alc - 6.72));
	var chd_b6out = Math.pow(chd_b6, ((systolic - 135.7)/10));
	var chd_b7out = Math.pow(chd_b7, (Math.log(lipid_ratio) - 1.59));
	
	var chd_q = chd_q0 * chd_b1out * chd_b2out * chd_b3out * chd_b4out * chd_b5out * chd_b6out * chd_b7out;
    
	var chd_risk = 1.0 - Math.exp( -chd_q*Math.pow(chd_d, diabetes_duration)*((1 - Math.pow(chd_d,predict_length))/(1 - chd_d)));
	
	return chd_risk;
}

///////////////////// UKPDS STROKE  /////////////////////

function GetUKPDSStrokeRisk(age_at_diagnosis, female, smoking, atrial, systolic, lipid_ratio, diabetes_duration, predict_length)
{
	var stroke_q0 = 0.00186	//intercept
	var stroke_b1 = 1.092 	//Risk ratio for one year of age at diagnosis of diabetes
	var stroke_b2 = 0.700 	//Risk ratio for female sex
	var stroke_b3 = 1.547	//Risk ratio for smoking
	var stroke_b4 = 8.554	//Risk ratio for atrial fibrillation
	var stroke_b5 = 1.122 	//Risk ratio for 10 mmHg increase in systolic blood pressure
	var stroke_b6 = 1.138	//Risk ratio for unit increase in lipid ratio
	var stroke_d = 1.145	//Risk ratio for each year increase in duration of diagnosed diabetes
	
	var stroke_b1out = Math.pow(stroke_b1, (age_at_diagnosis - 55)); 
	var stroke_b2out = Math.pow(stroke_b2, female);
	var stroke_b3out = Math.pow(stroke_b3, smoking);
	var stroke_b4out = Math.pow(stroke_b4, atrial);
	var stroke_b5out = Math.pow(stroke_b5, ((systolic - 135.5)/10));
	var stroke_b6out = Math.pow(stroke_b6, (lipid_ratio - 5.11));
	
	var stroke_q = stroke_q0 * stroke_b1out * stroke_b2out * stroke_b3out * stroke_b4out * stroke_b5out * stroke_b6out;
    
	var stroke_risk = 1.0 - Math.exp( -stroke_q*Math.pow(stroke_d, diabetes_duration)*((1 - Math.pow(stroke_d,predict_length))/(1 - stroke_d)));
	
	return stroke_risk;
}

///////////////////// UKPDS FATAL CHD  /////////////////////

function GetUKPDSFatalCHDRisk(age_now, alc, systolic, predict_length)
{				
	var fatal_chd_risk = 1.0 / ( 1 + Math.exp(
                                              0.713 
                                              - ( 0.048 * ( age_now - 55 ) ) 
                                              - ( 0.178 * ( alc - 6.86 ) ) 
                                              - ( 0.141 * ( systolic - 141 ) / 10 )
                                              - ( 0.104 * predict_length ) ) );
	
	return fatal_chd_risk;
}

///////////////////// UKPDS FATAL STROKE  /////////////////////

function GetUKPDSFatalStrokeRisk(systolic, atrial)
{				
	var fatal_stroke_risk = 1.0 / ( 1 + Math.exp(
                                                 1.684 
                                                 - ( 0.249 * ( systolic - 144 ) / 10 )
                                                 - ( 2.210 * atrial ) ) );
	
	return fatal_stroke_risk;
}

///////////////////// FRAMINGHAM CHD  /////////////////////

/*
 function GetFraminghamCHDRisk(age, female, smoking, systolic, lipid_ratio, predict_length)
 {			
 var chd_theta0 	= 0.9145;
 var chd_theta1 	= -0.2784;
 var chd_b0		= 15.5305;
 var chd_b1		= 28.4441;	// female
 var chd_b2		= -1.4792;	// log(age)
 var chd_b3		= 0;		// log(age)^2
 var chd_b4		= -14.4588;	// log(age)*female
 var chd_b5		= 1.8515;	// log(age)^2*female
 var chd_b6		= -0.9119;	// log(SPB)
 var chd_b7		= -0.2767;	// smoking
 var chd_b8		= -0.7181;	// log(total_c/hdl_c)
 
 var chd_b1out = chd_b1 * female;
 var chd_b2out = chd_b2 * Math.log(age);
 var chd_b3out = chd_b3 * Math.log(age) * Math.log(age);
 var chd_b4out = chd_b4 * Math.log(age) * female;
 var chd_b5out = chd_b5 * Math.log(age) * Math.log(age) * female;
 var chd_b6out = chd_b6 * Math.log(systolic);
 var chd_b7out = chd_b7 * smoking;
 var chd_b8out = chd_b8 * Math.log(lipid_ratio);
 
 var mean = chd_b0 + chd_b1out + chd_b2out + chd_b3out + chd_b4out + chd_b5out + chd_b6out + chd_b7out + chd_b8out;
 
 var log_var = chd_theta0 + chd_theta1 * mean;
 
 var u = (Math.log(predict_length) - mean ) / Math.exp(log_var);
 
 var chd_risk = 1.0 - Math.exp( -Math.exp( u ) );
 
 return chd_risk;
 }
 */

function GetFraminghamCHDRiskPoints(age, female, smoking, systolic, treated_bp, chol, hdl_chol)
{			
    var age_points = 0;
    
    if ( age >= 20 && age <= 34 )
    {
        age_points = (female == 1) ? -7 : -9;
    }
    else if ( age <= 39 )
    {
        age_points = (female == 1) ? -3 : -4;
    }
    else if ( age <= 44 )
    {
        age_points = (female == 1) ? 0 : 0;
    }
    else if ( age <= 49 )
    {
        age_points = (female == 1) ? 3 : 3;
    }
    else if ( age <= 54 )
    {
        age_points = (female == 1) ? 6 : 6;
    }
    else if ( age <= 59 )
    {
        age_points = (female == 1) ? 8 : 8;
    }
    else if ( age <= 64 )
    {
        age_points = (female == 1) ? 10 : 10;
    }
    else if ( age <= 69 )
    {
        age_points = (female == 1) ? 12 : 11;
    }
    else if ( age <= 74 )
    {
        age_points = (female == 1) ? 14 : 12;
    }
    else if ( age <= 79 )
    {
        age_points = (female == 1) ? 16 : 13;
    }
    
    var chol_points = 0;
    var smoking_points = 0;
    
    if ( age >= 20 && age <= 39 )
    {
        if ( smoking == 1 )
            smoking_points = (female == 1) ? 9 : 8;
        if ( chol <= 4.14 )
            chol_points = 0;
        else if ( chol <= 5.19 )
            chol_points = (female == 1) ? 4 : 4;
        else if ( chol <= 6.19 )
            chol_points = (female == 1) ? 8 : 7;
        else if ( chol <= 7.2 )
            chol_points = (female == 1) ? 11 : 9;
        else
            chol_points = (female == 1) ? 13 : 11;
    }
    else if ( age <= 49 )
    {
        if ( smoking == 1 )
            smoking_points = (female == 1) ? 7 : 5;
        
        if ( chol <= 4.14 )
            chol_points = 0;
        else if ( chol <= 5.19 )
            chol_points = (female == 1) ? 3 : 3;
        else if ( chol <= 6.19 )
            chol_points = (female == 1) ? 6 : 5;
        else if ( chol <= 7.2 )
            chol_points = (female == 1) ? 8 : 6;
        else
            chol_points = (female == 1) ? 10 : 8;
    }
    else if ( age <= 59 )
    {
        if ( smoking == 1 )
            smoking_points = (female == 1) ? 4 : 3;
        
        if ( chol <= 4.14 )
            chol_points = 0;
        else if ( chol <= 5.19 )
            chol_points = (female == 1) ? 2 : 2;
        else if ( chol <= 6.19 )
            chol_points = (female == 1) ? 4 : 3;
        else if ( chol <= 7.2 )
            chol_points = (female == 1) ? 5 : 4;
        else
            chol_points = (female == 1) ? 7 : 5;
    }
    else if ( age <= 69 )
    {
        if ( smoking == 1 )
            smoking_points = (female == 1) ? 2 : 1;
        
        if ( chol <= 4.14 )
            chol_points = 0;
        else if ( chol <= 5.19 )
            chol_points = (female == 1) ? 1 : 1;
        else if ( chol <= 6.19 )
            chol_points = (female == 1) ? 2 : 1;
        else if ( chol <= 7.2 )
            chol_points = (female == 1) ? 3 : 2;
        else
            chol_points = (female == 1) ? 4 : 3;
    }
    else if ( age <= 79 )
    {
        if ( smoking == 1 )
            smoking_points = (female == 1) ? 1 : 1;
        
        if ( chol <= 4.14 )
            chol_points = 0;
        else if ( chol <= 5.19 )
            chol_points = (female == 1) ? 1 : 0;
        else if ( chol <= 6.19 )
            chol_points = (female == 1) ? 1 : 0;
        else if ( chol <= 7.2 )
            chol_points = (female == 1) ? 2 : 1;
        else
            chol_points = (female == 1) ? 2 : 1;
    }
    
    var hdl_points = 0;
    
    if ( hdl_chol >= 1.55 )
        hdl_points = -1;
    else if ( hdl_chol > 1.3 )
        hdl_points = 0;
    else if ( hdl_chol > 1.04 )
        hdl_points = 1;
    else
        hdl_points = 2;
    
    var systolic_points = 0;
    
    if ( treated_bp == 0 )
    {
        //untreated bp
        if ( systolic < 120 )
            systolic_points = (female == 1) ? 0 : 0;
        else if ( systolic < 129 ) 
            systolic_points = (female == 1) ? 1 : 0;
        else if ( systolic < 139 ) 
            systolic_points = (female == 1) ? 2 : 1;
        else if ( systolic < 159 ) 
            systolic_points = (female == 1) ? 3 : 1;
        else 
            systolic_points = (female == 1) ? 4 : 2;
    }
    else
    {
        //treated bp        
        if ( systolic < 120 )
            systolic_points = (female == 1) ? 0 : 0;
        else if ( systolic < 129 ) 
            systolic_points = (female == 1) ? 3 : 1;
        else if ( systolic < 139 ) 
            systolic_points = (female == 1) ? 4 : 2;
        else if ( systolic < 159 ) 
            systolic_points = (female == 1) ? 5 : 2;
        else 
            systolic_points = (female == 1) ? 6 : 3;
    }
    
    var total_points = age_points + chol_points + smoking_points + hdl_points + systolic_points;
    
    if ( female == 0 )
    {
        //male
        if ( total_points <= 4 )
            return 0.01;
        else if ( total_points <= 6 )
            return 0.02;
        else if ( total_points <= 7 )
            return 0.03;
        else if ( total_points <= 8 )
            return 0.04;
        else if ( total_points <= 9 )
            return 0.05;
        else if ( total_points <= 10 )
            return 0.06;
        else if ( total_points <= 11 )
            return 0.08;
        else if ( total_points <= 12 )
            return 0.10;
        else if ( total_points <= 13 )
            return 0.12;
        else if ( total_points <= 14 )
            return 0.16;
        else if ( total_points <= 15 )
            return 0.20;
        else if ( total_points <= 16 )
            return 0.25;
        else
            return 0.30;
    }
    else
    {
        //female
        if ( total_points <= 12 )
            return 0.01;
        else if ( total_points <= 14 )
            return 0.02;
        else if ( total_points <= 15 )
            return 0.03;
        else if ( total_points <= 16 )
            return 0.04;
        else if ( total_points <= 17 )
            return 0.05;
        else if ( total_points <= 18 )
            return 0.06;
        else if ( total_points <= 19 )
            return 0.08;
        else if ( total_points <= 20 )
            return 0.11;
        else if ( total_points <= 21 )
            return 0.14;
        else if ( total_points <= 22 )
            return 0.17;
        else if ( total_points <= 23 )
            return 0.22;
        else if ( total_points <= 24 )
            return 0.27;
        else
            return 0.30;
    }
}

///////////////////// FRAMINGHAM Stroke  /////////////////////

function GetFraminghamStrokeRisk(age, female, smoking, systolic, lipid_ratio, predict_length)
{			
	var stroke_theta0 	= -0.4312;
	var stroke_theta1 	= 0;
	var stroke_b0		= 26.5116;
	var stroke_b1		= 0.2019;	// female
	var stroke_b2		= -2.3741;	// log(age)
	var stroke_b3		= 0;		// log(age)^2
	var stroke_b4		= 0;		// log(age)*female
	var stroke_b5		= 0;		// log(age)^2*female
	var stroke_b6		= -2.4643;	// log(SPB)
	var stroke_b7		= -0.3914;	// smoking
	var stroke_b8		= -0.0229;	// log(total_c/hdl_c)
	
	var stroke_b1out = stroke_b1 * female;
	var stroke_b2out = stroke_b2 * Math.log(age);
	var stroke_b3out = stroke_b3 * Math.log(age) * Math.log(age);
	var stroke_b4out = stroke_b4 * Math.log(age) * female;
	var stroke_b5out = stroke_b5 * Math.log(age) * Math.log(age) * female;
	var stroke_b6out = stroke_b6 * Math.log(systolic);
	var stroke_b7out = stroke_b7 * smoking;
	var stroke_b8out = stroke_b8 * Math.log(lipid_ratio);
    
	var mean = stroke_b0 + stroke_b1out + stroke_b2out + stroke_b3out + stroke_b4out + stroke_b5out + stroke_b6out + stroke_b7out + stroke_b8out;
	
	var log_var = stroke_theta0 + stroke_theta1 * mean;
	
	var u = (Math.log(predict_length) - mean ) / Math.exp(log_var);
    
	var stroke_risk = 1.0 - Math.exp( -Math.exp( u ) );
	
	return stroke_risk;
}

///////////////////// FRAMINGHAM CHART  /////////////////////


var LOW_RISK_COLOR = "#BDEBCA";
var MED_RISK_COLOR = "#DFD487";
var HIGH_RISK_COLOR = "#EC7963";	

var base_text_size = "13px"
var base_text_color = "#5c4d46"
var highlight_text_size = "17px";
var highlight_text_color = "#000";

function UpdateFraminghamChart(female, smoking, systolic, treated_bp, total_chol, hdl_chol, age_now )
{										    
    var systolic_offset = systolic % 10;
    if ( systolic_offset >  5 )
    {
        systolic_offset -= 10;
    }
    
    var total_chol_offset = total_chol - Math.floor(total_chol);
    if ( total_chol_offset >  0.5 )
    {
        total_chol_offset -= 1;
    }      
	
	//edges								
	for (b = 2; b <= 8; ++b)
	{        
        var greater_less_than = (b==2)?"&le;":((b==8)?"&ge;":"");
		var bp = 80 + b*10 + systolic_offset; //90, 100, 110...
        document.getElementById("bp"+b).innerHTML = greater_less_than + bp.toFixed(1);	
		document.getElementById("bp"+b).style.fontWeight = "normal";
		document.getElementById("bp"+b).style.fontSize = base_text_size;
		document.getElementById("bp"+b).style.color = base_text_color;
	}				
	for (c = 1; c <= 5; ++c)
	{
        var chol = c + 3 + total_chol_offset; //4, 5, 6...
        document.getElementById("c"+c).innerHTML = chol.toFixed(1);	
		document.getElementById("c"+c).style.fontWeight = "normal";
		document.getElementById("c"+c).style.fontSize = base_text_size;
		document.getElementById("c"+c).style.color = base_text_color;
	}  
	
	var lipid_ratio = total_chol / hdl_chol;			
	
	for (b = 2; b <= 8; ++b)
	{
		var bp = 80 + b*10 + systolic_offset; //90, 100, 110, ...
		
		for (c = 1; c <= 5; ++c)
		{		
            //var chol = 3.5 + c*0.5; //4, 4.5, 5, ...		
			var chol = c + 3 + total_chol_offset; //4, 5, 6, ...		
            
			var cur_elem = "bp"+b+"c"+c;
			var chd_result = GetFraminghamCHDRiskPoints(age_now, female, smoking, bp, treated_bp, chol, hdl_chol);
			//var chd_result = GetFraminghamCHDRisk(age_now, female, smoking, bp, chol, predict_length);
			//var stroke_result = GetFraminghamStrokeRisk(age_now, female, smoking, bp, chol, predict_length);
			var result = chd_result;// + stroke_result;	
			var val = (result*100).toFixed(0);

			if ( val < 10 )
				document.getElementById(cur_elem).style.backgroundColor = LOW_RISK_COLOR;
			else if ( val < 20 )
				document.getElementById(cur_elem).style.backgroundColor = MED_RISK_COLOR;
			else
				document.getElementById(cur_elem).style.backgroundColor = HIGH_RISK_COLOR;
			var greater_than = (val>=30)?"&ge;":"";	
			document.getElementById(cur_elem).innerHTML = greater_than + val + "%";	
			document.getElementById(cur_elem).style.fontWeight = "normal";	
			document.getElementById(cur_elem).style.fontSize = base_text_size;
			document.getElementById(cur_elem).style.color = base_text_color;
		}
	}
	
	var bp;
	if ( systolic <= 105 ) { bp = "bp2"; }
	else if ( systolic <= 115 ) { bp = "bp3"; }
	else if ( systolic <= 125 ) { bp = "bp4"; }
	else if ( systolic <= 135 ) { bp = "bp5"; }
	else if ( systolic <= 145 ) { bp = "bp6"; }
	else if ( systolic <= 155 ) { bp = "bp7"; }
	else { bp = "bp8"; }
	
	document.getElementById(bp).style.fontWeight = "bold"; // highlight BP on edge
	document.getElementById(bp).style.fontSize = highlight_text_size;
	document.getElementById(bp).style.color = highlight_text_color;
    
	var chol;
	if ( total_chol <= 4.5 ) { chol = "c1"; }
	else if ( total_chol <= 5.5 ) { chol = "c2"; }
	else if ( total_chol <= 6.5 ) { chol = "c3"; }
	else if ( total_chol <= 7.5 ) { chol = "c4"; }
	else { chol = "c5"; }
	
	document.getElementById(chol).style.fontWeight = "bold"; // highlight chol on edge
	document.getElementById(chol).style.fontSize = highlight_text_size;
	document.getElementById(chol).style.color = highlight_text_color;
	
	var combined = bp+chol;
	
	document.getElementById(combined).style.fontWeight = "bold"; // highlight appropriate entry
	document.getElementById(combined).style.fontSize = highlight_text_size;
	document.getElementById(combined).style.color = highlight_text_color;
	
	
}

function UpdateUKPDSChart(age_at_diagnosis, female, ethnicity, smoking, a1c, systolic, lipid_ratio, atrial, diabetes_duration)
{				    
    var systolic_offset = systolic % 10;
    if ( systolic_offset >  5 )
    {
        systolic_offset -= 10;
    }
    
    var a1c_offset = a1c - Math.floor(a1c);
    if ( a1c_offset >  0.5 )
    {
        a1c_offset -= 1;
    }
    
    var lipid_ratio_offset = lipid_ratio - Math.floor(lipid_ratio);
    if ( lipid_ratio_offset >  0.5 )
    {
        lipid_ratio_offset -= 1;
    }
    
	//clear edges								
	for (b = 0; b <= 3; ++b)
	{
        var greater_less_than = (b==0)?"&le;":((b==3)?"&ge;":"");
		var bp = 100 + b*20 + systolic_offset; //100, 120, 140...
        document.getElementById("UKPDS_bp"+b).innerHTML = greater_less_than + bp.toFixed(1);	
		document.getElementById("UKPDS_bp"+b).style.fontWeight = "normal";
		document.getElementById("UKPDS_bp"+b).style.fontSize = base_text_size;
		document.getElementById("UKPDS_bp"+b).style.color = base_text_color;
        
		for (c = 1; c <= 3; ++c)
		{
            var chol = c + 3 + lipid_ratio_offset; //4, 5, 6...
            document.getElementById("UKPDS_bp"+b+"c"+c).innerHTML = chol.toFixed(1);	
			document.getElementById("UKPDS_bp"+b+"c"+c).style.fontWeight = "normal";
			document.getElementById("UKPDS_bp"+b+"c"+c).style.fontSize = base_text_size;
			document.getElementById("UKPDS_bp"+b+"c"+c).style.color = base_text_color;
		}
	}
	for (h = 1; h <= 4; ++h)
	{
        var hb = 4 + h + a1c_offset; //4, 5, 6...
        document.getElementById("UKPDS_h"+h).innerHTML = hb.toFixed(1);	
		document.getElementById("UKPDS_h"+h).style.fontWeight = "normal";
		document.getElementById("UKPDS_h"+h).style.fontSize = base_text_size;
		document.getElementById("UKPDS_h"+h).style.color = base_text_color;
	}
	
	//fill table + set bg color			
	
	for (b = 0; b <= 3; ++b)
	{
		var cur_bp = 100 + b*20 + systolic_offset; // 120, 140, 160, ...
		for (c = 1; c <= 3; ++c)
		{
			var cur_chol_ratio = 3 + c + lipid_ratio_offset; // 4, 5, 6, ...
			for (h = 1; h <= 4; ++h )
			{
				var cur_a1c = 4 + h + a1c_offset; // 5, 6, 7, ...
				var chd_result = GetUKPDSCHDRisk(age_at_diagnosis, female, ethnicity, smoking, cur_a1c, cur_bp, cur_chol_ratio, diabetes_duration, 10);
				//var stroke_result = GetUKPDSStrokeRisk(age_at_diagnosis, female, smoking, atrial, cur_bp, cur_chol_ratio, diabetes_duration, 10)
                
				var result = chd_result;// + stroke_result;
				
				var cur_elem = "UKPDS_bp"+b+"c"+c+"h"+h;	
				var val = (result*100).toFixed(1);
				document.getElementById(cur_elem).innerHTML = val + "%";
                
				document.getElementById(cur_elem).style.fontWeight = "normal";	
				document.getElementById(cur_elem).style.fontSize = base_text_size;	
				document.getElementById(cur_elem).style.color = base_text_color;			
				
				//bg color
				
				if ( val <= 10 )
					document.getElementById(cur_elem).style.backgroundColor = LOW_RISK_COLOR;
				else if ( val <= 20 )
					document.getElementById(cur_elem).style.backgroundColor = MED_RISK_COLOR;
				else
					document.getElementById(cur_elem).style.backgroundColor = HIGH_RISK_COLOR;		
			}
		}
	}
	
	
	//highlight appropriate entry
    
	var bp;
	if ( systolic <= 110 ) { bp = "bp0"; }
	else if ( systolic <= 130 ) { bp = "bp1"; }
	else if ( systolic <= 149 ) { bp = "bp2"; }
	else if ( systolic >= 150 ) { bp = "bp3"; }
	
	document.getElementById("UKPDS_" + bp).style.fontWeight = "bold"; 
	document.getElementById("UKPDS_" + bp).style.fontSize = highlight_text_size;
	document.getElementById("UKPDS_" + bp).style.color = highlight_text_color;
    	
	var chol;
	if ( lipid_ratio <= 4.5 ) { chol = "c1"; }
	else if ( lipid_ratio <= 5.5 ) { chol = "c2"; }
	else if ( lipid_ratio <= 6.5 ) { chol = "c3"; }
	
	document.getElementById("UKPDS_" + bp + chol).style.fontWeight = "bold"; 
	document.getElementById("UKPDS_" + bp + chol).style.fontSize = highlight_text_size; 
	document.getElementById("UKPDS_" + bp + chol).style.color = highlight_text_color; 
    	
	var hba1c;
	if ( a1c <= 5.5 ) { hba1c = "h1"; }
	else if ( a1c <= 6.5 ) { hba1c = "h2"; }
	else if ( a1c <= 7.5 ) { hba1c = "h3"; }
	else if ( a1c <= 8.5 ) { hba1c = "h4"; }
	
	document.getElementById("UKPDS_" + hba1c).style.fontWeight = "bold"; 
	document.getElementById("UKPDS_" + hba1c).style.fontSize = highlight_text_size; 
	document.getElementById("UKPDS_" + hba1c).style.color = highlight_text_color; 
	
	var combined = bp+chol+hba1c;
	document.getElementById("UKPDS_" + combined).style.fontWeight = "bold"; // highlight appropriate entry
	document.getElementById("UKPDS_" + combined).style.fontSize = highlight_text_size; 
	document.getElementById("UKPDS_" + combined).style.color = highlight_text_color; 
	
}

function WriteFootnotes(isDiabetic)
{
	var script = "";
	
	script += "<h2>Footnotes and sources</h2>";
	
	script += "<ol id=\"footnotes\"><li id=\"footnote1\"><b>Absolute risk reduction</b> is the decrease in chance of an event over a time period. <b>Relative risk reduction</b>, however, compares risk change between two groups, using the starting group as the baseline. For example, if we have a group with a 10 year risk of an event that goes from 4% to 1%, we have an absolute risk reduction of 4 - 1 = 3%, but a relative risk reduction of 75%, as we came down three percentage points of our starting four, or 3/4. Consider that if instead the 10 year risk of an event went from 40% to 10%, we would have a much more substantial absolute risk reduction of 30%, but still a relative risk reduction of 75% (as we came 30 percentage points down from our starting 40, which is 30/40 or again 3/4).</li>";
    
	script += "<li id=\"footnote2\">Primary and secondary prevention of myocardial infarction and strokes: an update of randomly allocated, controlled trials. <a href=\"http://www.ncbi.nlm.nih.gov/pubmed/8104243\">J Hypertens Suppl. 1993 Jun;11(4):S61-73.</a></li>";
    
	if ( isDiabetic )
	{
		script += "<li id=\"footnote3\">Efficacy of cholesterol-lowering therapy in 18,686 people with diabetes in 14 randomised trials of statins: a meta-analysis. <a href=\"http://www.ncbi.nlm.nih.gov/pubmed/18191683\">Lancet. 2008 Jan 12;371(9607):94-5.</a></li>";	
	}
	else
	{
		script += "<li id=\"footnote3\">Using Framingham for primary prevention cardiovascular risk assessment. <a href=\"http://ti.ubc.ca/en/node/152\">Therapeutics Letter, issue 63, March - April 2007</a></li>";
	}

	script += "<li id=\"footnote4\">Aspirin in the primary and secondary prevention of vascular disease: collaborative meta-analysis of individual participant data from randomised trials. <a href=\"http://www.lancet.com/journals/lancet/article/PIIS0140-6736(09)60503-1/abstract\">Lancet. 2009 May 30;373(9678):1849-60.</a></li>";

	script += "<li id=\"footnote5\">Mounting debate over aspirin use in primary prevention should prompt new talks with patients. <a href=\"http://www.theheart.org/article/1032601.do\">theheart.org Dec 9, 2009.</a></li>";
	
	script += "</ol>";
	
	return script;	
}

var good_a1c = 5;
var good_systolic = 120;
var good_lipid_ratio = 4;
var good_chol = 4;
var good_hdl = 1.5;
var good_smoking = 0;
var good_atrial = 0;
var good_treated_bp = 0;

function WriteScript( age_now, female, smoking, systolic, treated_bp, total_chol, hdl_chol )							
{					
    var lipid_ratio = total_chol / hdl_chol;
	var formatDecimals = 1;
    
	//var their_chd_risk = GetFraminghamCHDRisk(age_now, female, smoking, systolic, lipid_ratio, 10);			
	//var base_chd_risk = GetFraminghamCHDRisk(age_now, female, good_smoking, good_systolic, good_lipid_ratio, 10);	
    
	var their_chd_risk = GetFraminghamCHDRiskPoints(age_now, female, smoking, systolic, treated_bp, total_chol, hdl_chol);			
	var base_chd_risk = GetFraminghamCHDRiskPoints(age_now, female, good_smoking, good_systolic, good_treated_bp, good_chol, good_hdl);	
	
	var their_chd_risk_formatted = (their_chd_risk*100).toFixed(formatDecimals);
	document.getElementById('m$FRAM#value').value=their_chd_risk_formatted;
	document.getElementById('m$FRAM#dateObserved').value=document.getElementById('m$TCHL#dateObserved').value;
	
	var base_chd_risk_formatted = (base_chd_risk*100).toFixed(formatDecimals);
	
	var their_stroke_risk = GetFraminghamStrokeRisk(age_now, female, smoking, systolic, lipid_ratio, 10);
	var base_stroke_risk = GetFraminghamStrokeRisk(age_now, female, good_smoking, good_systolic, good_lipid_ratio, 10);
	
	var their_stroke_risk_formatted = (their_stroke_risk*100).toFixed(formatDecimals);
	var base_stroke_risk_formatted = (base_stroke_risk*100).toFixed(formatDecimals);
    
	var their_risk = their_chd_risk + their_stroke_risk;
	var base_risk = base_chd_risk + base_stroke_risk;
	
	var their_risk_formatted = (their_risk*100).toFixed(formatDecimals);
	var base_risk_formatted = (base_risk*100).toFixed(formatDecimals);
	
	////////////////////////////////////////////////
	// blood pressure treatment
	
	var their_chd_risk_treated_bp = GetFraminghamCHDRiskPoints(age_now, female, smoking, good_systolic, 1, total_chol, hdl_chol);	
	//var their_chd_risk_treated_bp = GetFraminghamCHDRisk(age_now, female, smoking, good_systolic, lipid_ratio, 10);		
	var their_stroke_risk_treated_bp = GetFraminghamStrokeRisk(age_now, female, smoking, good_systolic, lipid_ratio, 10);
	
	var their_chd_risk_treated_bp_formatted = (their_chd_risk_treated_bp*100).toFixed(formatDecimals);
	var their_stroke_risk_treated_bp_formatted = (their_stroke_risk_treated_bp*100).toFixed(formatDecimals);
	
	var their_absolute_chd_risk_reduction_bp = their_chd_risk_formatted - their_chd_risk_treated_bp_formatted;
	var their_absolute_stroke_risk_reduction_bp = their_stroke_risk_formatted - their_stroke_risk_treated_bp_formatted;
	
	var their_absolute_chd_risk_reduction_formatted_bp = (their_absolute_chd_risk_reduction_bp).toFixed(formatDecimals);
	var their_absolute_stroke_risk_reduction_formatted_bp = (their_absolute_stroke_risk_reduction_bp).toFixed(formatDecimals);
	
	var their_relative_chd_risk_reduction_bp = (their_chd_risk_formatted - their_chd_risk_treated_bp_formatted)/their_chd_risk_formatted;
	var their_relative_stroke_risk_reduction_bp = (their_stroke_risk_formatted - their_stroke_risk_treated_bp_formatted)/their_stroke_risk_formatted;
	
	var their_relative_chd_risk_reduction_formatted_bp = (their_relative_chd_risk_reduction_bp*100).toFixed(formatDecimals);
	var their_relative_stroke_risk_reduction_formatted_bp = (their_relative_stroke_risk_reduction_bp*100).toFixed(formatDecimals);
	
	//trials
	
	var their_chd_risk_treated_bp_trials = their_chd_risk*0.8; //reduced by 20% relative
	var their_stroke_risk_treated_bp_trials = their_stroke_risk*0.6; //reduced by 40% relative
	
	var their_chd_risk_treated_bp_trials_formatted = (their_chd_risk_treated_bp_trials*100).toFixed(formatDecimals);
	var their_stroke_risk_treated_bp_trials_formatted = (their_stroke_risk_treated_bp_trials*100).toFixed(formatDecimals);
	
	var their_absolute_chd_risk_reduction_bp_trials = their_chd_risk_formatted - their_chd_risk_treated_bp_trials_formatted;
	var their_absolute_stroke_risk_reduction_bp_trials = their_stroke_risk_formatted - their_stroke_risk_treated_bp_trials_formatted;
	
	var their_absolute_chd_risk_reduction_formatted_bp_trials = (their_absolute_chd_risk_reduction_bp_trials).toFixed(formatDecimals);
	var their_absolute_stroke_risk_reduction_formatted_bp_trials = (their_absolute_stroke_risk_reduction_bp_trials).toFixed(formatDecimals);
	
	////////////////////////////////////////////////
	// cholesterol treatment
	
	var max_chd_benefit = 0.02; //max reduction in CHD risk is 2% (no change for stroke)
	
	//var their_chd_risk_treated_chol = GetFraminghamCHDRisk(age_now, female, smoking, systolic, good_lipid_ratio, 10);
	var their_chd_risk_treated_chol = GetFraminghamCHDRiskPoints(age_now, female, smoking, systolic, treated_bp, good_chol, good_hdl);
	
	if ( ( their_chd_risk - their_chd_risk_treated_chol ) > max_chd_benefit )
	{
		their_chd_risk_treated_chol = their_chd_risk - max_chd_benefit; 
	}
	
	var their_chd_risk_treated_chol_formatted = (their_chd_risk_treated_chol*100).toFixed(formatDecimals);
	
	var their_absolute_chd_risk_reduction_chol = their_chd_risk_formatted - their_chd_risk_treated_chol_formatted;
	
	var their_absolute_chd_risk_reduction_formatted_chol = (their_absolute_chd_risk_reduction_chol).toFixed(formatDecimals);
	
	var their_relative_chd_risk_reduction_chol = (their_chd_risk_formatted - their_chd_risk_treated_chol_formatted)/their_chd_risk_formatted;
	
	var their_relative_chd_risk_reduction_formatted_chol = (their_relative_chd_risk_reduction_chol*100).toFixed(formatDecimals);
	
	//trials
	
	var their_chd_risk_treated_chol_trials = their_chd_risk*0.75; //reduced by 26% relative
	
	var their_chd_risk_treated_chol_trials_formatted = (their_chd_risk_treated_chol_trials*100).toFixed(formatDecimals);
	
	var their_absolute_chd_risk_reduction_treated_chol_trials = their_chd_risk_formatted - their_chd_risk_treated_chol_trials_formatted;
	
	var their_absolute_chd_risk_reduction_formatted_treated_chol_trials = (their_absolute_chd_risk_reduction_treated_chol_trials).toFixed(formatDecimals);
	
	
	////////////////////////////////////////////////
	// script			
	
	var script = "";
	
	//script += "<h2 class=\"nobar\">Summary</h2>";
	
	script += "<p>The average risk of coronary heart disease (CHD) over the next 10 years for a ";
	script += ( female == 1 ) ? "woman" : "man";
	script += " of your age is " + base_chd_risk_formatted + "%, while the average risk of stroke over the next 10 years for a ";
	script += ( female == 1 ) ? "woman" : "man"; 
	script += " of your age is " + base_stroke_risk_formatted + "%.</p>";
	
	script += "<p>With your combination of risk factors, your risk of coronary heart disease the next 10 years is " + their_chd_risk_formatted + "%. Your risk of stroke over the next 10 years is " + their_stroke_risk_formatted + "%.</p>";	
	
	script += "<p>Everyone has different personal thoughts about risk. A key principle of evidence-based medicine is that decisions about ";
	script += "treatment need to be individualized to each patient depending on their clinical circumstances and values.</p>"
	
	script += "<p>The interventions discussed below are all in the category of preventive interventions. Patient life expectancy and quality of life considerations must also be factored into decision making about any interventions.</p>";
	
	var showTreatBPAdvice = (systolic >= 140);
	var showTreatCholAdvice = true;//(lipid_ratio > 4);
	
	if ( showTreatBPAdvice ) // only give advice is systolic bp is high
	{
		script += "<h2>Benefits of lowering blood pessure</h2>";
		
		/*
         script += "<h3>Using the calculator</h3>";
         
         script += "<ul>If your blood pressure was 120 mmHg your: "
         script += "<li>10 year risk of coronary heart disease would go from <b>" + their_chd_risk_formatted + "%</b> to <b>" + their_chd_risk_treated_bp_formatted + "%</b></li>";
         script += "<li>10 year risk of stroke would go from <b>" + their_stroke_risk_formatted + "%</b> to <b>" + their_stroke_risk_treated_bp_formatted + "%</b></li></ul>";
         
         script += "<ul>Another way to explain these changes in risk are as absolute and relative risk reductions<sup><a href=\"#footnote1\">1</a></sup>:";
         script += "<li>For coronary heart disease, going from " + their_chd_risk_formatted + "% to " + their_chd_risk_treated_bp_formatted + "% is an absolute risk reduction of <b>" + their_absolute_chd_risk_reduction_formatted_bp + "%</b>, or a relative risk reduction of <b>" + their_relative_chd_risk_reduction_formatted_bp + "%</b></li>";
         script += "<li>For stroke, going from " + their_stroke_risk_formatted + "% to " + their_stroke_risk_treated_bp_formatted + "% is an absolute risk reduction of <b>" + their_absolute_stroke_risk_reduction_formatted_bp + "%</b>, or a relative risk reduction of <b>" + their_relative_stroke_risk_reduction_formatted_bp + "%</b></li></ul>";
         */
		
		script += "<h3>Using data from clinical trials</h3>";
		
		script += "<ul>Clinical trials have shown lowering blood pressure reduces relative coronary heart disease risk by 20% and stroke by 40%<sup><a href=\"#footnote2\">2</a></sup>. Using this data your:";
		script += "<li>10 year risk of coronary heart disease would go from <b>" + their_chd_risk_formatted + "%</b> to <b>" + their_chd_risk_treated_bp_trials_formatted + "%</b></li>";
		script += "<li>10 year risk of stroke would go from <b>" + their_stroke_risk_formatted + "%</b> to <b>" + their_stroke_risk_treated_bp_trials_formatted + "%</b></li></ul>";
        
		script += "<ul>Another way to explain these changes in risk is as an absolute risk reductions<sup><a href=\"#footnote1\">1</a></sup>:";
		script += "<li>For coronary heart disease, going from " + their_chd_risk_formatted + "% to " + their_chd_risk_treated_bp_trials_formatted + "% is an absolute risk reduction of <b>" + their_absolute_chd_risk_reduction_formatted_bp_trials + "%</b></li>";
		script += "<li>For stroke, going from " + their_stroke_risk_formatted + "% to " + their_stroke_risk_treated_bp_trials_formatted + "% is an absolute risk reduction of <b>" + their_absolute_stroke_risk_reduction_formatted_bp_trials + "%</b></li></ul>";
        
		script += "<h3>What do guidelines say?</h3>";
		
		script += "<p><b>BC Guidelines</b> suggest the benefits of pharmacologic treatment in people with mild hypertension (an average blood pressure between 140/90 and 160/100), and a 10-year CHD risk of less than 20%, are unclear. Use clinical judgement when recommending therapy for this patient group.</p>";
		
		script += "<p>Although some guidelines still suggest low-dose ASA therapy in higher risk subgroups of asymptomatic patients, more detailed recent evidence by the origional authors now shows no net effect on stroke.  The effect on MIs for primary prevention was a rate reduction of 0.05% pa without a change in vascular mortality.  However an increased rate on major GI and extracranial bleeds at 0.03% pa makes it a treatment that potentially harms some patients who would never develop vascular disease.<sup><a href=\"#footnote4\">4</a></sup></p>";

	}				
	
	if ( showTreatCholAdvice )
	{
		script += "<h2>Benefits of lowering cholesterol</h2>";	
        
		if ( female == 1 )
		{
			script += "<p>As a woman who has not had a previous heart attack, the evidence for the benefit of cholesterol lowering medication on coronary heart disease <b>is not clear</b>. Evidence suggests there is no benefit on the risk of a stroke.</p>";
		}
		else
		{				
			/*
             script += "<h3>Using the calculator</h3>";
             
             script += "<p>If your ratio of total cholesteral / HDL cholesterol was 4, we take your 10 year risk of coronary heart disease from <b>" + their_chd_risk_formatted + "%</b> to <b>" + their_chd_risk_treated_chol_formatted + "%</b>. Evidence suggests there is no benefit on the risk of a stroke.</p>";
             
             script += "<p>Another way to explain these changes in risk are as absolute and relative risk reductions<sup><a href=\"#footnote1\">1</a></sup>: for coronary heart disease, going from " + their_chd_risk_formatted + "% to " + their_chd_risk_treated_chol_formatted + "% is an absolute risk reduction of <b>" + their_absolute_chd_risk_reduction_formatted_chol + "%</b>, or a relative risk reduction of <b>" + their_relative_chd_risk_reduction_formatted_chol + "%</b></p>";
             */
			
			script += "<h3>Using data from clinical trials</h3>";
			
			script += "<p>Clinical trials have shown lowering cholesterol reduces relative coronary heart disease risk by 25%<sup><a href=\"#footnote3\">3</a></sup>. Using this data your 10 year risk of coronary heart disease would go from <b>" + their_chd_risk_formatted + "%</b> to <b>" + their_chd_risk_treated_chol_trials_formatted + "%</b>. Evidence suggests there is no benefit on the risk of a stroke.</p>";
            
			script += "<p>Another way to explain this change in risk is as an absolute risk reduction<sup><a href=\"#footnote1\">1</a></sup>: for coronary heart disease, going from " + their_chd_risk_formatted + "% to " + their_chd_risk_treated_chol_trials_formatted + "% is an absolute risk reduction of <b>" + their_absolute_chd_risk_reduction_formatted_treated_chol_trials + "%</b></p>";
			
			script += "<h3>What do guidelines say?</h3>";
            
			script += "<ul><b>BC Guidelines</b> suggest calculating 10 year risk of CHD with the Framingham calculator. These guidelines have selected the following ranges of risk and picked some associated lipid targets";
			script += "<li>&gt;20% 10-year CHD risk (high risk) = target LDL &lt; 2.5</li>";
			script += "<li>10 - 19%  10-year CHD risk (moderate risk) = target LDL &lt; 3.5</li></ul>";
			
			script += "<p><b>UK Hypertension Guidelines</b>  suggest considering statin treatment as a complementary means of further reducing cardiovascular risk in people with treated hypertension whose baseline 10 year cardiovascular disease risk is estimated to be &ge; 20%, irrespective of baseline cholesterol values.</p>";
            
			script += "<h3>Is there debate?</h3>";
            
			script += "<p>Yes. As the <b>UK guidelines</b> note: \"The setting of a risk threshold for treatment is ultimately a value judgement. Therapy is not automatically proposed for all people with abnormal lipid profiles.\"</p>";
            
			script += "<p>There is also much debate in the literature about whether or not the evidence supports the concept of treating to specific lipid targets. There is similar debate about whether or not the evidence supports that there is any benefit for the use of statins  for primary prevention of heart disease in women. For a more detailed discussion for use of statins for primary vs secondary preventions see <a target=\"_blank\" href=\"http://www.evidocs.ca/overview.php\">www.evidocs.ca/overview.php</a></p>";
            
			script += "<p>Different guidelines make different recommendations. Guidelines change over time. Evidence is in flux. Potential harms as well as benefits must be taken into account in any decision to treat. Patient values must be taken into account.</p>";		
			
		}
	}
	
	
	if ( showTreatBPAdvice && showTreatCholAdvice )
	{
		script += "<h2>Combining blood pressure and cholesterol treatments</h2>";
        
		script += "<p>What is the effect of treating both your blood pressure and cholesterol? We don't know for sure: hopefully it is somewhat additive but our evidence is not clear.</p>";
	}			
	
	script += "<h2>Lifestyle changes</h2>";
	
	if ( smoking == 1 )
	{
		script += "<p>The three most important things you can do to decrease your risk of a wide range of health problems (including heart disease) are <b>quit smoking</b>, <b>excercise</b>, and <b>eat a healthy diet</b>. ";	
	}
	else
	{
		script += "<p>The two most important things you can do to decrease your risk of a wide range of health problems (including heart disease) are <b>exercise</b> and <b>eat a healthy diet</b>. ";
	}	
	
	script += "For a general overview of the relative benefits of lifestyle changes and medications in improving outcomes see <a href=\"http://www.evidocs.ca/overview.php\">www.evidocs.ca/overview.php</a></p>"
	
	if ( smoking == 1 )
	{
		script += "<h3>Quitting smoking</h3>";
		script += "<ul>The benefits of quitting smoking include";
		script += "<li><b>A greatly reduced risk of premature death</b>: quitting lowers your risk of dying early by 50% within 5 years of quitting.  After 15 years the risk is the same as if you had never smoked <a target=\"blank\" href=\"http://bc.quitnet.com/library/guides/quitnet/B/footnotes.jtml#3\">[source]</a></li>";	
		script += "<li><b>A reduced risk of lung cancer, emphysema, and bronchitis:</b> your risk of lung cancer drops by 30%-50% after 10 years of being smoke-free.</li>";	
		script += "<li><b>A reduced risk of coronary heart disease:</b> the potential for smoking-related heart disease is cut in half one year after quitting. Within 15 years the risk is the same as that of someone who never smoked.</li></ul>";	
		script += "<p>See <a target=\"_blank\" href=\"http://www.quitnow.ca\">www.quitnow.ca</a></p>"
	}
	
	script += "<h3>Exercise</h3>";
	
	script += "<p>Exercise like regular walking has proven benefits for reducing risk of heart disease, cancer, and improving mood. BC CVD guideline recommends walking 30 to 60 minutes 4 to 7 times per week. You deserve to live longer and feel better. As the slogan says, just do it. See <a target=\"_blank\" href=\"http://www.actnowbc.ca/EN/healthy_living_tip_sheets/physical_activity/\">www.actnowbc.ca</a></p>";
    
	script += "<h2>Calculator Limitations</h2>";
	
	script += "<ul>What are some limitations of using a Framingham calculator?";
	script += "<li>no risk prediction beyond 12 years</li>";
	script += "<li>no confidence intervals around the estimate</li>";
	script += "<li>less accurate for patients with extremes of risk factors</li>";
	script += "<li> if your patient is \"dissimilar\" to the U.S. population studied, risk assessment is more inaccurate</li></ul>";
	
	script += "<p>Also, it is a common practice to enter post-treatment numbers into risk calculators, and then present the new risk numbers as post-treatment risk. This approach does not match the findings from clinical trials.</p>";
	
	script += WriteFootnotes(false);	
	
	script += "<p>&nbsp;</p>";
	
	var out = document.getElementById("theScript");
	out.innerHTML = script;
}

function WriteScriptDiabetic( age_at_diagnosis, female, ethnicity, smoking, alc, systolic, lipid_ratio, atrial, diabetes_duration )	
{
	var formatDecimals = 1;
	
	var their_chd_risk = GetUKPDSCHDRisk(age_at_diagnosis, female, ethnicity, smoking, alc, systolic, lipid_ratio, diabetes_duration, 10);
	var base_chd_risk = GetUKPDSCHDRisk(age_at_diagnosis, female, ethnicity, good_smoking, good_a1c, good_systolic, good_lipid_ratio, diabetes_duration, 10);
	
	var their_chd_risk_formatted = (their_chd_risk*100).toFixed(formatDecimals);
	var base_chd_risk_formatted = (base_chd_risk*100).toFixed(formatDecimals);
	
	var their_stroke_risk = GetUKPDSStrokeRisk(age_at_diagnosis, female, smoking, atrial, systolic, lipid_ratio, diabetes_duration, 10);
	var base_stroke_risk = GetUKPDSStrokeRisk(age_at_diagnosis, female, good_smoking, good_atrial, good_systolic, good_lipid_ratio, diabetes_duration, 10);
	
	var their_stroke_risk_formatted = (their_stroke_risk*100).toFixed(formatDecimals);
	var base_stroke_risk_formatted = (base_stroke_risk*100).toFixed(formatDecimals);
    
	var their_risk = their_chd_risk + their_stroke_risk;
	var base_risk = base_chd_risk + base_stroke_risk;
	
	var their_risk_formatted = (their_risk*100).toFixed(formatDecimals);
	var base_risk_formatted = (base_risk*100).toFixed(formatDecimals);
	
	////////////////////////////////////////////////
	// blood pressure treatment
	
	var their_chd_risk_treated_bp = GetUKPDSCHDRisk(age_at_diagnosis, female, ethnicity, smoking, alc, good_systolic, lipid_ratio, diabetes_duration, 10);
	var their_stroke_risk_treated_bp = GetUKPDSStrokeRisk(age_at_diagnosis, female, smoking, atrial, good_systolic, lipid_ratio, diabetes_duration, 10);
	
	var their_chd_risk_treated_bp_formatted = (their_chd_risk_treated_bp*100).toFixed(formatDecimals);
	var their_stroke_risk_treated_bp_formatted = (their_stroke_risk_treated_bp*100).toFixed(formatDecimals);
	
	var their_absolute_chd_risk_reduction_bp = their_chd_risk_formatted - their_chd_risk_treated_bp_formatted;
	var their_absolute_stroke_risk_reduction_bp = their_stroke_risk_formatted - their_stroke_risk_treated_bp_formatted;
	
	var their_absolute_chd_risk_reduction_formatted_bp = (their_absolute_chd_risk_reduction_bp).toFixed(formatDecimals);
	var their_absolute_stroke_risk_reduction_formatted_bp = (their_absolute_stroke_risk_reduction_bp).toFixed(formatDecimals);
	
	var their_relative_chd_risk_reduction_bp = (their_chd_risk_formatted - their_chd_risk_treated_bp_formatted)/their_chd_risk_formatted;
	var their_relative_stroke_risk_reduction_bp = (their_stroke_risk_formatted - their_stroke_risk_treated_bp_formatted)/their_stroke_risk_formatted;
	
	var their_relative_chd_risk_reduction_formatted_bp = (their_relative_chd_risk_reduction_bp*100).toFixed(formatDecimals);
	var their_relative_stroke_risk_reduction_formatted_bp = (their_relative_stroke_risk_reduction_bp*100).toFixed(formatDecimals);
	
	//trials
	
	var their_chd_risk_treated_bp_trials = their_chd_risk*0.8; //reduced by 20% relative
	var their_stroke_risk_treated_bp_trials = their_stroke_risk*0.6; //reduced by 40% relative
	
	var their_chd_risk_treated_bp_trials_formatted = (their_chd_risk_treated_bp_trials*100).toFixed(formatDecimals);
	var their_stroke_risk_treated_bp_trials_formatted = (their_stroke_risk_treated_bp_trials*100).toFixed(formatDecimals);
	
	var their_absolute_chd_risk_reduction_bp_trials = their_chd_risk_formatted - their_chd_risk_treated_bp_trials_formatted;
	var their_absolute_stroke_risk_reduction_bp_trials = their_stroke_risk_formatted - their_stroke_risk_treated_bp_trials_formatted;
	
	var their_absolute_chd_risk_reduction_formatted_bp_trials = (their_absolute_chd_risk_reduction_bp_trials).toFixed(formatDecimals);
	var their_absolute_stroke_risk_reduction_formatted_bp_trials = (their_absolute_stroke_risk_reduction_bp_trials).toFixed(formatDecimals);
	
	////////////////////////////////////////////////
	// cholesterol treatment
	
	var max_chd_benefit = 0.02; //max reduction in CHD risk for diabetics is 2%
	var max_stroke_benefit = 0.015; //max reduction in stroke risk for diabetics is 1.5%
	
	var their_chd_risk_treated_chol = GetUKPDSCHDRisk(age_at_diagnosis, female, ethnicity, smoking, alc, systolic, good_lipid_ratio, diabetes_duration, 10);
	var their_stroke_risk_treated_chol = GetUKPDSStrokeRisk(age_at_diagnosis, female, smoking, atrial, systolic, good_lipid_ratio, diabetes_duration, 10);
	
	if ( ( their_chd_risk - their_chd_risk_treated_chol ) > max_chd_benefit )
	{
		their_chd_risk_treated_chol = their_chd_risk - max_chd_benefit; 
	}
	
	if ( ( their_stroke_risk - their_stroke_risk_treated_chol ) > max_stroke_benefit )
	{
		their_stroke_risk_treated_chol = their_stroke_risk - max_stroke_benefit; //max reduction in stroke risk for diabetics is 15%
	}
	
	var their_chd_risk_treated_chol_formatted = (their_chd_risk_treated_chol*100).toFixed(formatDecimals);
	var their_stroke_risk_treated_chol_formatted = (their_stroke_risk_treated_chol*100).toFixed(formatDecimals);
	
	var their_absolute_chd_risk_reduction_chol = their_chd_risk_formatted - their_chd_risk_treated_chol_formatted;
	var their_absolute_stroke_risk_reduction_chol = their_stroke_risk_formatted - their_stroke_risk_treated_chol_formatted;
	
	var their_absolute_chd_risk_reduction_formatted_chol = (their_absolute_chd_risk_reduction_chol).toFixed(formatDecimals);
	var their_absolute_stroke_risk_reduction_formatted_chol = (their_absolute_stroke_risk_reduction_chol).toFixed(formatDecimals);
	
	var their_relative_chd_risk_reduction_chol = (their_chd_risk_formatted - their_chd_risk_treated_chol_formatted)/their_chd_risk_formatted;
	var their_relative_stroke_risk_reduction_chol = (their_stroke_risk_formatted - their_stroke_risk_treated_chol_formatted)/their_stroke_risk_formatted;
	
	var their_relative_chd_risk_reduction_formatted_chol = (their_relative_chd_risk_reduction_chol*100).toFixed(formatDecimals);
	var their_relative_stroke_risk_reduction_formatted_chol = (their_relative_stroke_risk_reduction_chol*100).toFixed(formatDecimals);
	
	//trials
	
	var their_chd_risk_treated_chol_trials = their_chd_risk*0.8; //reduced by 20% relative
	
	var their_chd_risk_treated_chol_trials_formatted = (their_chd_risk_treated_chol_trials*100).toFixed(formatDecimals);
	
	var their_absolute_chd_risk_reduction_treated_chol_trials = their_chd_risk_formatted - their_chd_risk_treated_chol_trials_formatted;
	
	var their_absolute_chd_risk_reduction_formatted_treated_chol_trials = (their_absolute_chd_risk_reduction_treated_chol_trials).toFixed(formatDecimals);
	
	// script
	
	var script = "";
	
	script += "<h2 class=\"nobar\">Summary</h2>";
	
	script += "<p>The average risk of coronary heart disease (CHD) over the next 10 years for a ";
	script += ( female == 1 ) ? "woman" : "man";
	script += " of your age is " + base_chd_risk_formatted + "%, while the average risk of stroke over the next 10 years for a ";
    script += ( female == 1 ) ? "woman" : "man";
    script += " of your age is " + base_stroke_risk_formatted + "%.</p>";
	
	script += "<p>With your combination of risk factors, your risk of coronary heart disease and stroke over the next 10 years is " + their_chd_risk_formatted + "%. Your risk of stroke over the next 10 years is " + their_stroke_risk_formatted + "%.</p>";	
	
	script += "<p>Everyone has different personal thoughts about risk. A key principle of evidence-based medicine is that decisions about ";
	script += "treatment need to be individualized to each patient depending on their clinical circumstances and values.</p>"
	
	script += "<p>The interventions discussed below are all in the category of preventive interventions. Patient life expectancy and quality of life considerations must also be factored into decision making about any interventions.</p>";
	
	var showTreatBPAdvice = (systolic >= 140);
	var showTreatCholAdvice = true;//(lipid_ratio > 4);
	
	if ( showTreatBPAdvice ) // only give advice is systolic bp is high
	{
		script += "<h2>Benefits of lowering blood pessure</h2>";
		
		/*
         script += "<h3>Using the calculator</h3>";
         
         script += "<ul>If your blood pressure was 120 mmHg your: "
         script += "<li>10 year risk of coronary heart disease would go from <b>" + their_chd_risk_formatted + "%</b> to <b>" + their_chd_risk_treated_bp_formatted + "%</b></li>";
         script += "<li>10 year risk of stroke would go from <b>" + their_stroke_risk_formatted + "%</b> to <b>" + their_stroke_risk_treated_bp_formatted + "%</b></li></ul>";
         
         script += "<ul>Another way to explain these changes in risk are as absolute and relative risk reductions<sup><a href=\"#footnote1\">1</a></sup>:";
         script += "<li>For coronary heart disease, going from " + their_chd_risk_formatted + "% to " + their_chd_risk_treated_bp_formatted + "% is an absolute risk reduction of <b>" + their_absolute_chd_risk_reduction_formatted_bp + "%</b>, or a relative risk reduction of <b>" + their_relative_chd_risk_reduction_formatted_bp + "%</b></li>";
         script += "<li>For stroke, going from " + their_stroke_risk_formatted + "% to " + their_stroke_risk_treated_bp_formatted + "% is an absolute risk reduction of <b>" + their_absolute_stroke_risk_reduction_formatted_bp + "%</b>, or a relative risk reduction of <b>" + their_relative_stroke_risk_reduction_formatted_bp + "%</b></li></ul>";
         */
        
		//TODO NEED NUMBERS to calculate from above
		script += "<h3>Using data from clinical trials</h3>";
		
		script += "<ul>Clinical trials have shown lowering blood pressure reduces relative coronary heart disease risk by 20% and stroke by 40%<sup><a href=\"#footnote2\">2</a></sup>. Using this data your:";
		script += "<li>10 year risk of coronary heart disease would go from <b>" + their_chd_risk_formatted + "%</b> to <b>" + their_chd_risk_treated_bp_trials_formatted + "%</b></li>";
		script += "<li>10 year risk of stroke would go from <b>" + their_stroke_risk_formatted + "%</b> to <b>" + their_stroke_risk_treated_bp_trials_formatted + "%</b></li></ul>";
        
		script += "<ul>Another way to explain these changes in risk is as an absolute risk reductions<sup><a href=\"#footnote1\">1</a></sup>:";
		script += "<li>For coronary heart disease, going from " + their_chd_risk_formatted + "% to " + their_chd_risk_treated_bp_trials_formatted + "% is an absolute risk reduction of <b>" + their_absolute_chd_risk_reduction_formatted_bp_trials + "%</b></li>";
		script += "<li>For stroke, going from " + their_stroke_risk_formatted + "% to " + their_stroke_risk_treated_bp_trials_formatted + "% is an absolute risk reduction of <b>" + their_absolute_stroke_risk_reduction_formatted_bp_trials + "%</b></li></ul>";
        
		script += "<h3>What do guidelines say?</h3>";
		
		script += "<p><b>BC Guidelines</b> suggest the benefits of pharmacologic treatment in people with mild hypertension (an average blood pressure between 140/90 and 160/100), and a 10-year CHD risk of less than 20%, are unclear. Use clinical judgement when recommending therapy for this patient group.</p>";
		
		script += "<p>Although some guidelines suggest consideration should also be given to the addition of low-dose ASA therapy in subgroups of patients, more recent and detailed evidence from the researchers who made the initial ASA recommendations, suggests that the risks of ASA largely outweigh the benefits in Primary Prevention.<sup><a href=\"#footnote4\">4</a></sup></p>"; 
	}		
	
	if ( showTreatCholAdvice )
	{
		script += "<h2>Benefits of lowering cholesterol</h2>";	
        
		/*
         script += "<h3>Using the calculator</h3>";
         
         script += "<ul>If your ratio of total cholesteral / HDL cholesterol was 4 your:";
         script += "<li>10 year risk risk of coronary heart disease would go from <b>" + their_chd_risk_formatted + "%</b> to <b>" + their_chd_risk_treated_chol_formatted + "%</b></li>";
         script += "<li>10 year risk risk of stroke would go from <b>" + their_stroke_risk_formatted + "%</b> to <b>" + their_stroke_risk_treated_chol_formatted + "%</b></li></ul>";
         
         script += "<ul>Another way to explain these changes in risk are as absolute and relative risk reductions<sup><a href=\"#footnote1\">1</a></sup>:";
         script += "<li>For coronary heart disease, going from " + their_chd_risk_formatted + "% to " + their_chd_risk_treated_chol_formatted + "% is an absolute risk reduction of <b>" + their_absolute_chd_risk_reduction_formatted_chol + "%</b>, or a relative risk reduction of <b>" + their_relative_chd_risk_reduction_formatted_chol + "%</b></li>";
         script += "<li>For stroke, going from " + their_stroke_risk_formatted + "% to " + their_stroke_risk_treated_chol_formatted + "% is an absolute risk reduction of <b>" + their_absolute_stroke_risk_reduction_formatted_chol + "%</b>, or a relative risk reduction of <b>" + their_relative_stroke_risk_reduction_formatted_chol + "%</b></li></ul>";
         */
		
		script += "<h3>Using data from clinical trials</h3>";		
		
		script += "<ul>Clinical trials have shown lowering cholesterol reduces relative coronary heart disease risk by 20%<sup><a href=\"#footnote3\">3</a></sup>. Using this data your 10 year risk of coronary heart disease would go from <b>" + their_chd_risk_formatted + "%</b> to <b>" + their_chd_risk_treated_chol_trials_formatted + "%</b>. Evidence suggests there is no benefit on the risk of a stroke.</p>";			
        
		script += "<ul>Another way to explain this change in risk is as an absolute risk reduction<sup><a href=\"#footnote1\">1</a></sup>: for coronary heart disease, going from " + their_chd_risk_formatted + "% to " + their_chd_risk_treated_chol_trials_formatted + "% is an absolute risk reduction of <b>" + their_absolute_chd_risk_reduction_formatted_treated_chol_trials + "%</b></p>";	
        
		script += "<h3>What do guidelines say?</h3>";
        
		script += "<ul><b>BC Guidelines</b> suggest calculating 10 year risk of CHD with the UKPDS calculator. These guidelines have selected the following ranges of risk and picked some associated lipid targets";
		script += "<li>&gt;20% 10-year CHD risk (high risk) = target LDL &lt; 2.5</li>";
		script += "<li>10 - 19%  10-year CHD risk (moderate risk) = target LDL &lt; 3.5</li></ul>";
        
		script += "<p><b>UK Guidelines</b> for treatment of lipids in Type 2 Diabetess suggest consideration of treatment to lower lipids in patients whose 10-year coronary event risk is assessed as above 15%, taking into account the known limitations of the risk assessment.</p>";
        
		script += "<h3>Is there debate?</h3>";
		
		script += "<p>Yes. As the <b>UK guidelines</b> note: \"The setting of a risk threshold for treatment is ultimately a value judgement. Therapy is not automatically proposed for all people with abnormal lipid profiles.\"</p>";
        
        script += "<p>There is also much debate in the literature about whether or not the evidence supports the concept of treating to specific lipid targets. There is similar debate about whether or not the evidence supports that there is any benefit for the use of statins  for primary prevention of heart disease in women. For a more detailed discussion for use of statins for primary vs secondary preventions see <a target=\"_blank\" href=\"http://www.evidocs.ca/overview.php\">www.evidocs.ca/overview.php</a></p>"
        
		script += "<p>Guidelines change over time. Evidence is in flux. Potential harms as well as benefits must be taken into account in any decision to treat. Patient values must be taken into account.</p>";
	}
	
    
    
	if ( showTreatBPAdvice && showTreatCholAdvice )
	{
		script += "<h2>Combining blood pressure and cholesterol treatments</h2>";
        
		script += "<p>What is the effect of treating both your blood pressure and cholesterol? We don't know for sure: hopefully it is somewhat additive but our evidence is not clear.</p>";
	}
	
	script += "<h2>Lifestyle changes</h2>";
	
	if ( smoking == 1 )
	{
		script += "<p>The three most important things you can do to decrease your risk of a wide range of health problems (including heart disease) are <b>quit smoking</b>, <b>excercise</b>, and <b>eat a healthy diet</b>. ";	
	}
	else
	{
		script += "<p>The two most important things you can do to decrease your risk of a wide range of health problems (including heart disease) are <b>exercise</b> and <b>eat a healthy diet</b>. ";
	}	
	
	script += "For a general overview of the relative benefits of lifestyle changes and medications in improving outcomes see <a href=\"http://www.evidocs.ca/overview.php\">www.evidocs.ca/overview.php</a></p>"
	
	if ( smoking == 1 )
	{
		script += "<h3>Quitting smoking</h3>";
		script += "<ul>The benefits of quitting smoking include";
		script += "<li><b>A greatly reduced risk of premature death</b>: quitting lowers your risk of dying early by 50% within 5 years of quitting.  After 15 years the risk is the same as if you had never smoked <a target=\"blank\" href=\"http://bc.quitnet.com/library/guides/quitnet/B/footnotes.jtml#3\">[source]</a></li>";	
		script += "<li><b>A reduced risk of lung cancer, emphysema, and bronchitis:</b> your risk of lung cancer drops by 30%-50% after 10 years of being smoke-free.</li>";	
		script += "<li><b>A reduced risk of coronary heart disease:</b> the potential for smoking-related heart disease is cut in half one year after quitting. Within 15 years the risk is the same as that of someone who never smoked.</li></ul>";	
		script += "<p>See <a target=\"_blank\" href=\"http://www.quitnow.ca\">www.quitnow.ca</a></p>"
	}
	
	script += "<h3>Exercise</h3>";
	
	script += "<p>Exercise like regular walking has proven benefits for reducing risk of heart disease, cancer, and improving mood. BC CVD guideline recommends walking 30 to 60 minutes 4 to 7 times per week. You deserve to live longer and feel better. As the slogan says, just do it. See <a target=\"_blank\" href=\"http://www.actnowbc.ca/EN/healthy_living_tip_sheets/physical_activity/\">www.actnowbc.ca</a></p>";		
    
	script += "<h2>Calculator Limitations</h2>";
	
	script += "<p>It is a common practice to enter post-treatment numbers into risk calculators, and then present the new risk numbers as post-treatment risk. This approach does not match the findings from clinical trials.</p>";
    
	script += WriteFootnotes(true);	
	
	script += "<p>&nbsp;</p>";
	
	var out = document.getElementById("theScript");
	out.innerHTML = script;
	
}


