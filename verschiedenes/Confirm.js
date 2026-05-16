// www.jjam.de - Confirmbox mit JavaScript - Version 20.12.2002

//Nur für IE 5+ und NN 6+

ie5=(document.getElementById&&document.all&&document.styleSheets)?1:0;

nn6=(document.getElementById&&!document.all)?1:0;


if(ie5||nn6) {

	if(ie5) cs=2,th=30;
	else cs=0,th=20;
	//wg. Layout


	document.write(
		"<div style='position:absolute;top:-500;left:0;z-index:100' id='confirm'>"+
			"<table style='border-style:outset;border-width:2;border-color:#E6E6CD;background-color:#F5F5DC' cellpadding='5' cellspacing='"+cs+"' width='"+confirmWidth+"' height='"+confirmHeight+"' onmousedown='getxyRelativ()' onmousemove='moveConfirm()' onmouseup='moveStatus=0'>"+
				"<tr><td height='"+th+"' bgcolor='#DEDEC5'>"+confirmTitle+"</td></tr>"+
				"<tr><td>"+confirmText+"</td></tr>"+
				"<tr><td height='50' align='center'>"+
					"<input style='background-color:#E9E9CF;border-width:1;font-weight:bold' type='button' value='&nbsp; &nbsp; OK &nbsp; &nbsp;' onclick='okConfirm()' onfocus='if(this.blur)this.blur()'>"+
					"&nbsp;&nbsp;"+
					"<input style='background-color:#E9E9CF;border-width:1;font-weight:bold' type='button' value='Abbrechen' onclick='abortConfirm()' onfocus='if(this.blur)this.blur()'>"+
				"</td></tr>"+
			"</table>"+
		"</div>"
	);

}


//Box anzeigen

function showConfirm() {

	moveStatus=0;

	xConfirm=xConfirmStart, yConfirm=yConfirmStart;

	if(ie5) {

		document.getElementById("confirm").style.left=xConfirm+document.body.scrollLeft;

		document.getElementById("confirm").style.top=yConfirm+document.body.scrollTop;

	}

	else if(nn6) {

		document.getElementById("confirm").style.left=xConfirm+window.pageXOffset;

		document.getElementById("confirm").style.top=yConfirm+window.pageYOffset;

	}

	else confirmAlternative();

}


//Relative Mausposition auf der Box ermitteln

function getxyRelativ() {

	moveStatus=1;

	if(ie5) {

		xRelativ=event.clientX-xConfirm;

		yRelativ=event.clientY-yConfirm;

	}

}


//Box bewegen (nur IE)

var xRelativ, yRelativ;

function moveConfirm() {

	if(ie5&&moveStatus>0) {

		xConfirm=document.getElementById("confirm").style.left=event.clientX+document.body.scrollLeft-xRelativ;

		yConfirm=document.getElementById("confirm").style.top=event.clientY+document.body.scrollTop-yRelativ;

	}

}