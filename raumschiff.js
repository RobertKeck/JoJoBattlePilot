function raumschiff(basis, rot, gruen, gelb, typ){
	//this.basis = basis;
	this.datenSindAktuell = 1;
  	this.alpha = Math.PI; /* Winkel zwischen der y-Achse und der Schiffsrichtung */


  	this.red = rot; 
    this.green = gruen; 
    this.blue = gelb; 
  
  	this.energie = START_ENERGIE;

	this.farbe = "rgb("+ this.red + "," + this.green + "," + this.blue + ")";
	this.untergrundFarbe = untergrundfarbe;
	this.punkte = 0;
	this.anzSchuesseAbgeschossen = 0;
  	this.v = new koordinate(0.0, 0.0); /* Geschwindigkeit */
  	
  	/**
  	 * Bei einer Explosion ist der Wert explosionsTimer gesetzt und zaehlt langsam gegen 0. Solange die explosionsTimer >= 0 , wird das
  	 * Raumschiff nicht gezeichnet und auch nicht an die Mitspieler gesendet.
  	 */
  	this.explosionsTimer = -1; 
  	
  	/**
  	 * Die Gravitationswelle darf nicht zu oft erzeugt werden duerfen, sonst ist sie zu maechtig.
  	 * Nur wenn der Time auf -1 steht, kann geschossen werden.
  	 */
  	this.gravitationsTimer = -1; 
	this.spielerID = basis.spielerID;
	this.spielername = basis.spielername;
	this.s = new koordinate(0, 0); // Raumschiffachse, um die sich das Raumschiff dreht
    this.typ = typ;  // Der Typ bestimmt die Raumschiffform
	this.polygon = new polygon(typ);
	 this.berechneEcken = berechneEcken;
	 this.zeichneZentriert = zeichneZentriert;
	 this.zeichneZentriertClassicRaumschiff = zeichneZentriertClassicRaumschiff;
	 this.zeichneZentriertGrafikRaumschiff = zeichneZentriertGrafikRaumschiff;
	 this.zeichneRelativ = zeichneRelativ;
	 this.zeichneRelativClassicRaumschiff = zeichneRelativClassicRaumschiff;
	 this.zeichneRelativGrafikRaumschiff = zeichneRelativGrafikRaumschiff;
	 this.bewegung = bewegung;
	 this.istRaumschiffInMauer = istRaumschiffInMauer;
	 this.istRaumschiffGetroffen = istRaumschiffGetroffen;
	 this.addGeschwindigkeit = addGeschwindigkeit;
	 this.dreheRaumschiff = dreheRaumschiff;
	 this.getSerialisierteDaten = getSerialisierteDaten;
	 this.setSerialisierteDaten = setSerialisierteDaten;
	 this.positioniereRaumschiffAufBasis = positioniereRaumschiffAufBasis;
	 this.kollidiertMitRaumschiff = kollidiertMitRaumschiff;
	 this.getAbstandImQuadrat = getAbstandImQuadrat;
	 this.getAbstand = getAbstand;
	 this.raumschiffPralltAb = raumschiffPralltAb;
	 this.raumschiffPralltVonEckeAb = raumschiffPralltVonEckeAb;
	 this.istMauerEckeInRaumschiff = istMauerEckeInRaumschiff;
	 this.raumschiffPralltVonMauerAb = raumschiffPralltVonMauerAb;
	 this.raumschiffPralltAnHorizontalerMauerAb = raumschiffPralltAnHorizontalerMauerAb;
	 this.raumschiffPralltAnVertikalerMauerAb = raumschiffPralltAnVertikalerMauerAb;
	 this.raumschiffPralltAnDiagonaleLinksObenRechtsUntenAb = raumschiffPralltAnDiagonaleLinksObenRechtsUntenAb;
	 this.raumschiffPralltAnDiagonaleLinksUntenRechtsObenAb = raumschiffPralltAnDiagonaleLinksUntenRechtsObenAb;
	 this.partikelInSchiff = function(partikelArray){
			if (partikelArray.length > 0){
				for (var i = partikelArray.length -1; i >= 0; i--){
					if (partikelArray[i].lebenszyklen > SCHUSS_LEBENSZYKLEN - v_max && partikelArray[i].spielerID == this.spielerID){
						break;
					}
					if (this.punktInSchiff(partikelArray[i].x, partikelArray[i].y, partikelArray[i].v_x, partikelArray[i].v_y) == true){												  
				    		return partikelArray[i];
				  	}
				}
			}
			return null;
	 }	
	 this.punktInSchiff = punktInSchiff;
	 this.basisWechsel = basisWechsel;
	 this.bewegungRueckgaengig = bewegungRueckgaengig;
	 
	 // Die Ecken a, b und c des Raumschiffs werden nicht uebergeben, sondern berechnet
	 this.berechneEcken();
}
function basisWechsel(){
	var neueBasis = meinSpiel.getBasis(this);
	// Wenn sich der Schwerpunkt des Raumschiffs innerhalb einer Basis befindet, kann diese uebernommen werden
	if (neueBasis != null){
		var vorbesitzerID = neueBasis.spielerID;
		var vorbesitzerName = neueBasis.spielername;
		if (vorbesitzerID == this.spielerID){
			return; // die Basis gehoert mir schon
		}
		else{
			meinSpiel.setBasisLeer(this.spielerID);
			neueBasis.spielerID = this.spielerID;
			neueBasis.spielername = this.spielername;
			meinSpiel.weiseBasisZu(neueBasis);
			if (vorbesitzerID != "unbesetzt"){
					freieBasis = meinSpiel.getFreieBasis();
					freieBasis.spielerID = vorbesitzerID;
					freieBasis.spielername = vorbesitzerName;
					meinSpiel.weiseBasisZu(freieBasis);			
					sendBasisWechsel(vorbesitzerID, vorbesitzerName, meinSpiel.spiel_id, freieBasis);
			}
			sendBasisWechsel(this.spielerID, this.spielername, meinSpiel.spiel_id, neueBasis);
		}
	}
}
function positioniereRaumschiffAufBasis(){
	var basis = meinSpiel.getBasisBySpielerID(this.spielerID);
	this.s.x = basis.koordinate.x * feldgroesse - feldgroesse/2;
	this.s.y = basis.koordinate.y * feldgroesse - feldgroesse/2;
	this.v.x = 0.0;
	this.v.y = 0.0;
	this.alpha = Math.PI;
	this.berechneEcken();
	
}	
	
		
/**
 * Berechne die Koordinaten der Ecken des Raumschiffs in Abhaengigkeit vom Schwerpunkt s, der Raumschiffrichtung alpha, und den Winkeln der Ecken (zwischen x-Achse und Linie(schwerpunkt, ecke))
 */
function berechneEcken(){
	this.polygon.berechneEckenKoordinaten(this.s, this.alpha);
}

/**
 * Wenn es sich um das eigene Raumschiff handelt, wird das Raumschiff (der Schwerpunkt s) immer zentriert 
 * im Bildschirmmittelpunkt gezeichnet
 */
function zeichneZentriert(derContext){


    if (this.typ.indexOf("classic") != -1){
		this.zeichneZentriertClassicRaumschiff(derContext);
	}
	else{
		this.zeichneZentriertGrafikRaumschiff(derContext);
	}
	
	// Zeichne EnergieBalken
	derContext.beginPath();
	derContext.strokeStyle = "#7F7F7F"
	derContext.strokeRect( spielfeldausschnitt_x / 2 - feldgroesse_view, spielfeldausschnitt_y / 2 - 2*feldgroesse_view , 2*feldgroesse_view, 7*feldgroesse_view_faktor);			
	derContext.stroke();	
	derContext.fillStyle =  this.farbe;
	derContext.fillRect(spielfeldausschnitt_x / 2 - feldgroesse_view -1, spielfeldausschnitt_y / 2 - 2*feldgroesse_view + 1, ( (2*feldgroesse_view - 2) * this.energie / START_ENERGIE)  , feldgroesse_view_faktor*6);			
	derContext.fill();
	
}	
function zeichneZentriertClassicRaumschiff(derContext){
	
	var mitte_x = this.s.x * feldgroesse_view_faktor - spielfeldausschnitt_x / 2;
	var mitte_y = this.s.y * feldgroesse_view_faktor - spielfeldausschnitt_y / 2;
	
	zeichneRaumschiff(derContext, this.polygon, mitte_x, mitte_y);
	
}
function zeichneZentriertGrafikRaumschiff(derContext){
	var canvasRaumschiff = document.getElementById("canvas_Raumschiff_1");
	canvasRaumschiff.width=feldgroesse_view;
	canvasRaumschiff.height=feldgroesse_view;
	canvasRaumschiff.style.left= (spielfeldausschnitt_x - feldgroesse_view)/ 2  +"px";
	canvasRaumschiff.style.top= (spielfeldausschnitt_y - feldgroesse_view)/ 2   +"px";
	
	var contextRaumschiff = canvasRaumschiff.getContext("2d");
	contextRaumschiff.translate(feldgroesse_view/2, feldgroesse_view/2);
	contextRaumschiff.rotate(Math.PI + this.alpha);
	contextRaumschiff.translate(-feldgroesse_view/2, -feldgroesse_view/2);

    //contextRaumschiff.drawImage(imgRaumschiff2, 0, 0 , feldgroesse_view, feldgroesse_view);
	

	for (var i = 0; i < alleRaumschiffBilder.length; i++){
		if (alleRaumschiffBilder[i].typ == this.typ){
			contextRaumschiff.drawImage(alleRaumschiffBilder[i].image, 0, 0 , feldgroesse_view, feldgroesse_view);
		}
	}
	
	
	
}		 

/**
 * Wenn es sich um ein fremdes Raumschiff handelt, wird immer relativ zum eigenen Raumschiff (Schwerpunkt s) 
 * und relativ zum Bildschirmmittelpunkt gezeichnet.
 */
function zeichneRelativ(context, s, raumschiffNr){

	var relativerSchwerpunkt = erzeugeRelativeKoordinate(this.s, s);
	var relativeEcken = new Array();

	for (var i = 0; i < this.polygon.eckenArray.length; i++){			
		relativeEcken.push(erzeugeRelativeKoordinate(this.polygon.eckenArray[i].koordinate, s));
	}


	if (isRaumschiff_rechts_Ausserhalb(relativeEcken)){
		for (var i = 0; i < relativeEcken.length; i++){			
			relativeEcken[i].x -= meinSpiel.map.max_pixel_x * feldgroesse_view_faktor;
		}
		relativerSchwerpunkt.x -= meinSpiel.map.max_pixel_x * feldgroesse_view_faktor;
	}

	if (isRaumschiff_links_Ausserhalb(relativeEcken)){
		for (var i = 0; i < relativeEcken.length; i++){			
			relativeEcken[i].x += meinSpiel.map.max_pixel_x * feldgroesse_view_faktor;
		}
		relativerSchwerpunkt.x += meinSpiel.map.max_pixel_x * feldgroesse_view_faktor;
	}
	if (isRaumschiff_unten_Ausserhalb(relativeEcken)){
		for (var i = 0; i < relativeEcken.length; i++){			
			relativeEcken[i].y -= meinSpiel.map.max_pixel_y * feldgroesse_view_faktor;
		}
		relativerSchwerpunkt.y -= meinSpiel.map.max_pixel_y * feldgroesse_view_faktor;
	}
	if (isRaumschiff_oben_Ausserhalb(relativeEcken)){
		for (var i = 0; i < relativeEcken.length; i++){			
			relativeEcken[i].y += meinSpiel.map.max_pixel_y * feldgroesse_view_faktor;
		}
		relativerSchwerpunkt.y += meinSpiel.map.max_pixel_y * feldgroesse_view_faktor;
	}
	
	
    if (this.typ.indexOf("classic") != -1){
		this.zeichneRelativClassicRaumschiff(context, s, raumschiffNr, relativerSchwerpunkt, relativeEcken);
	}
	else{
		this.zeichneRelativGrafikRaumschiff(context, s, raumschiffNr, relativerSchwerpunkt);
	}	
	context.fillStyle =  this.farbe;
	context.fillText(this.spielername,1 * (relativerSchwerpunkt.x - this.spielername.length * 3) , 1 * (relativerSchwerpunkt.y + 25*feldgroesse_view_faktor));			

}
function zeichneRelativClassicRaumschiff(context, s, raumschiffNr, relativerSchwerpunkt, relativeEcken){


	context.beginPath();
	
	context.moveTo( relativeEcken[0].x ,  relativeEcken[0].y );
	
	for (var i = 1; i < relativeEcken.length; i++){
		 context.lineTo(relativeEcken[i].x ,  relativeEcken[i].y );
	}
	context.lineTo( relativeEcken[0].x ,  relativeEcken[0].y );
	context.closePath();
	context.fillStyle =  this.farbe;    
	
	context.fill();
	
	context.strokeStyle = "#7F7F7F";
	context.stroke();
	
	
	
}	
function zeichneRelativGrafikRaumschiff(context, s, raumschiffNr, relativerSchwerpunkt){

	
	if ((relativerSchwerpunkt.x - feldgroesse_view < spielfeldausschnitt_x)
			&& 
		(relativerSchwerpunkt.y - feldgroesse_view < spielfeldausschnitt_y)){	
	
				var canvasRaumschiff = document.getElementById("canvas_Raumschiff_"+raumschiffNr);
				canvasRaumschiff.width=feldgroesse_view;
				canvasRaumschiff.height=feldgroesse_view;

				
				canvasRaumschiff.style.left= relativerSchwerpunkt.x- feldgroesse_view/ 2 + "px";
				canvasRaumschiff.style.top= relativerSchwerpunkt.y- feldgroesse_view/ 2 + "px";

	
						
				var contextRaumschiff = canvasRaumschiff.getContext("2d");
				contextRaumschiff.translate(feldgroesse_view/2, feldgroesse_view/2);
				contextRaumschiff.rotate(Math.PI + this.alpha);
				contextRaumschiff.translate(-feldgroesse_view/2, -feldgroesse_view/2);

				
				for (var i = 0; i < alleRaumschiffBilder.length; i++){
					if (alleRaumschiffBilder[i].typ == this.typ){
						contextRaumschiff.drawImage(alleRaumschiffBilder[i].image, 0, 0 , feldgroesse_view, feldgroesse_view);
					}
				}	
	}
	
}
/**
 * erzeuge Koordinate, die relativ zum eigenen Raumschiff (Schwerpunkt s) liegt.
 */
/* 
function erzeugeRelativeKoordinateRaumschiff(koord_abs, s){
	var x_relativ = (koord_abs.x - s.x) * feldgroesse + spielfeldausschnitt_x / 2 - 1;
	var y_relativ = (koord_abs.y - s.y) * feldgroesse + spielfeldausschnitt_y / 2 - 1;	

	return new koordinate(x_relativ, y_relativ);
}
*/
/**
 * Wenn alle relativen EckenKoordinaten rechts ausserhalb der Kartebreite sind, dann return true, sonst false
 */
function isRaumschiff_rechts_Ausserhalb(relativeEcken){
	for (var i = 0; i < relativeEcken.length; i++){	
		if (relativeEcken[i].x <= meinSpiel.map.max_pixel_x * feldgroesse_view_faktor){
			return false;
		}
	}
	return true;
}

/**
 * Wenn alle relativen EckenKoordinaten links ausserhalb der Kartebreite sind, dann return true, sonst false
 */
function isRaumschiff_links_Ausserhalb(relativeEcken){
	for (var i = 0; i < relativeEcken.length; i++){	
		if (relativeEcken[i].x >= 0){
			return false;
		}
	}
	return true;
}
/**
 * Wenn alle relativen EckenKoordinaten oben ausserhalb der Kartehoehe sind, dann return true, sonst false
 */
function isRaumschiff_oben_Ausserhalb(relativeEcken){
	for (var i = 0; i < relativeEcken.length; i++){	
		if (relativeEcken[i].y >= 0){
			return false;
		}
	}
	return true;
}
/**
 * Wenn alle relativen EckenKoordinaten unten ausserhalb der Kartehoehe sind, dann return true, sonst false
 */
function isRaumschiff_unten_Ausserhalb(relativeEcken){
	for (var i = 0; i < relativeEcken.length; i++){	
		if (relativeEcken[i].y <= meinSpiel.map.max_pixel_y * feldgroesse_view_faktor){
			return false;
		}
	}
	return true;
}

function bewegung(erdanziehung){
	this.v.y += erdanziehung;

  	if (this.v.x > v_max){
  		this.v.x = v_max;
  	}
  	if (this.v.y > v_max){
  		this.v.y = v_max;
  	}
  	if (this.v.x < -v_max){
  		this.v.x = -v_max;
  	}
  	if (this.v.y < -v_max){
  		this.v.y = -v_max;
  	}
					  	    	  	
  	this.s.x += this.v.x;
  	this.s.y += this.v.y;
  	if(this.s.x > meinSpiel.map.max_pixel_x){
  		this.s.x -= meinSpiel.map.max_pixel_x;
  	}
  	if(this.s.x < 0){
  		this.s.x += meinSpiel.map.max_pixel_x;
  	}
  	if(this.s.y > meinSpiel.map.max_pixel_y){
  		this.s.y -= meinSpiel.map.max_pixel_y;
  	}
  	if(this.s.y < 0){
  		this.s.y += meinSpiel.map.max_pixel_y;
  	}
}	
/**
 * Wenn eine der  Ecken des Raumschiffs in einer Mauer ist, dann wird die Mauerart zurueckgegeben, sonst 0
 * Mauerarten sind:
 * 0 = keine Mauer (leeres Feld oder Basis)
 * 1 = Quadrat
 * 2 = Dreieck mit rechtem Winkel oben rechts
 * 3 = Dreieck mit rechtem Winkel unten rechts
 * 4 = Dreieck mit rechtem Winkel unten links
 * 5 = Dreieck mit rechtem Winkel oben links 
 */
function istRaumschiffInMauer(){

/************************
	var anzDurchlauefe = v_max;
	
	var schiff_v_x_teilschritt = this.v.x / anzDurchlauefe;
	var schiff_v_y_teilschritt = this.v.y / anzDurchlauefe;
	
	for (var i = 0; i < this.polygon.eckenArray.length; i++){
		var eckKoordinateNeu = new koordinate(this.polygon.eckenArray[i].koordinate.x, this.polygon.eckenArray[i].koordinate.y);
		eckKoordinateNeu.x = eckKoordinateNeu.x - this.v.x + schiff_v_x_teilschritt;
		eckKoordinateNeu.y = eckKoordinateNeu.y - this.v.y + schiff_v_y_teilschritt;
//		var x_aktuell = this.polygon.eckenArray[i].koordinate.x - this.v.x; // TODO: Um sicher zu gehen, dass es auch in den Grenzregieonen funktioniert, muss das Spielfeld 9-fach kopiert werden (Analog zum Radar)
//		var y_aktuell = this.polygon.eckenArray[i].koordinate.y - this.v.y;

		for(var n = 1; n < anzDurchlauefe; n++){
		
////			if (eckKoordinateNeu.x < 0){
////				eckKoordinateNeu.x += meinSpiel.map.max_pixel_x;
	////		} 
////			if (eckKoordinateNeu.x >= meinSpiel.map.max_pixel_x){
////				eckKoordinateNeu.x -= meinSpiel.map.max_pixel_x;
////			} 
////			if (eckKoordinateNeu.y < 0){
////				eckKoordinateNeu.y += meinSpiel.map.max_pixel_y;
////			} 
////			if (eckKoordinateNeu.y >= meinSpiel.map.max_pixel_y){
////				eckKoordinateNeu.y -= meinSpiel.map.max_pixel_y;
////			} 
	
			var feldinhalt = getFeldinhaltVonPunkt(eckKoordinateNeu.x, eckKoordinateNeu.y);
			if(feldinhalt > 0 && feldinhalt < 6){
					//var punkt = new mauerpunkt(feldinhalt, eckKoordinateNeu.x, eckKoordinateNeu.y);
					var punkt = new mauerpunkt(feldinhalt, this.polygon.eckenArray[i].koordinate.x, this.polygon.eckenArray[i].koordinate.y);
					return punkt; 
			}					
		
			eckKoordinateNeu.x += schiff_v_x_teilschritt;
			eckKoordinateNeu.y += schiff_v_y_teilschritt;	
		}	
	}
	
	
    // Keine Ecke in einer Mauer
	return null;
************************/	
/***********/
for (var i = 0; i < this.polygon.eckenArray.length; i++){
		var eckKoordinateNeu = new koordinate(this.polygon.eckenArray[i].koordinate.x, this.polygon.eckenArray[i].koordinate.y);

		if (this.polygon.eckenArray[i].koordinate.x < 0){
			eckKoordinateNeu.x += meinSpiel.map.max_pixel_x;
		} 
		if (this.polygon.eckenArray[i].koordinate >= meinSpiel.map.max_pixel_x){
			eckKoordinateNeu.x -= meinSpiel.map.max_pixel_x;
		} 
		if (this.polygon.eckenArray[i].koordinate < 0){
			eckKoordinateNeu.y += meinSpiel.map.max_pixel_y;
		} 
		if (this.polygon.eckenArray[i].koordinate >= meinSpiel.map.max_pixel_y){
			eckKoordinateNeu.y -= meinSpiel.map.max_pixel_y;
		} 
		var feldinhalt = getFeldinhaltVonPunkt(eckKoordinateNeu.x, eckKoordinateNeu.y);
		if(feldinhalt > 0 && feldinhalt < 6){
			// Jetzt muss geprÃ¼ft werden, ob das Raumschiff mit der letzten Bewegung ein anderes Mauerteil vorher ueberquert hat.
			// Wenn ja, wird die erst Mauerart zurueckgegeben
			var x_old = eckKoordinateNeu.x - this.v.x; // TODO: Um sicher zu gehen, dass es auch in den Grenzregieonen funktioniert, muss das Spielfeld 9-fach kopiert werden (Analog zum Radar)
			var y_old = eckKoordinateNeu.y - this.v.y;
			var anzDurchlauefe = v_max;
			
			var schiff_v_x_teilschritt = this.v.x / anzDurchlauefe;
			var schiff_v_y_teilschritt = this.v.y / anzDurchlauefe;
			
			for(var i = 1; i < anzDurchlauefe; i++)
			{
				var feldinhalt_vorher = getFeldinhaltVonPunkt(x_old, y_old);	
				if(feldinhalt_vorher > 0 && feldinhalt_vorher < 6){
					var punkt = new mauerpunkt(feldinhalt_vorher, eckKoordinateNeu.x, eckKoordinateNeu.y);
					return punkt; 
				}				
				x_old += schiff_v_x_teilschritt;
				y_old += schiff_v_y_teilschritt;
			}
			
			var punkt = new mauerpunkt(feldinhalt,  eckKoordinateNeu.x, eckKoordinateNeu.y);
			
			return punkt;	
		}			
	}
	
	
    // Keine Ecke in einer Mauer
	return null;

}				
/**
 * Wenn mindestens ein Schuss im Raumschiff ist, wird der Name des Schuetzen zurueckgegeben, sonst null.
 */
function istRaumschiffGetroffen(){
	var treffer = this.partikelInSchiff(schuesse);
	if (treffer != null){
		return treffer;
	}
	treffer = this.partikelInSchiff(fremdeSchuesse);
	if (treffer != null){
		return treffer;
	}
	treffer = this.partikelInSchiff(explosionsPartikelArray);
	if (treffer != null){
		return treffer;
	}
	return null;
	
}		

function addGeschwindigkeit(schubneu){
	this.v.x += Math.cos(this.alpha + Math.PI / 2) * schubneu;
	this.v.y += Math.sin(this.alpha + Math.PI / 2) * schubneu;
}
function dreheRaumschiff(winkel){
	this.alpha += winkel;
	if (this.alpha > 2*Math.PI){
		this.alpha -= 2*Math.PI;
	}
	if (this.alpha < 0){
		this.alpha += 2*Math.PI;
	}
}
/**
 * Die Raumschiffdaten spielerID, spielername, s, alpha und farbe werden zu einem String zusammengefuegt.
 * Dieser String kann dann an den Server uebertragen werden.
 */
function getSerialisierteDaten(){
	var serialString =  this.spielerID + "|" + 
	this.spielername + "|" + 
	this.s.x.toString() + "|"+
	this.s.y.toString() + "|"+
	this.alpha.toString() + "|"+
	this.farbe + "|"+
	this.punkte.toString() + "|"+
	this.explosionsTimer.toString() + "|"+
	this.polygon.typ + "|"+
	untergrundfarbe + "|"+
	this.v.x.toString() + "|"+
	this.v.y.toString();
											
	return serialString;
}
/**
 * Die Raumschiffdaten spielername, s, alpha und farbe werden gesetzt mit den uebergebenen deserialisierten Daten
 */
function setSerialisierteDaten(datenArray){
	this.spielerID = datenArray[1];
	this.spielername = datenArray[2];
	this.s.x = parseFloat(datenArray[3]);
	this.s.y = parseFloat(datenArray[4]);
	this.alpha = parseFloat(datenArray[5]);
	this.farbe = datenArray[6];
	this.punkte = parseInt(datenArray[7]);
	this.explosionsTimer =  parseInt(datenArray[8]);
	var typNeu = datenArray[9];
	if (typNeu != this.typ){
		this.typ = typNeu;
		this.polygon = new polygon(this.typ);
	}
	this.untergrundFarbe = datenArray[10];
	// Die Geschwindigkeit wird fuer den Computerspieler (Autopiloten) mitgegeben, damit dieser die Bahn voraus berechnen, wo ein moeglich Schuss trifft
	this.v.x = parseFloat(datenArray[11]);
	this.v.y = parseFloat(datenArray[12]);

	this.datenSindAktuell = 1;

  }
/**
 * Gibt den Abstand zwischen Schwerpunkt des Raumschiffs und uebergeben Punkt zurueck
 * Es gibt 2 x- und 2 y-Abstaende, da die Weltkarte eine Kugel ist.
 * Es wird sowohl in x, als auch in y Richtung der kleiner Abstand zurueckgegeben.
 * Rueckgabewert ist vom Typ koordinate, die den Abstand in x und in y Richtung enthaelt
 */
function getAbstand(p_x, p_y){
	// Es gibt 2 x- und 2 y-Abstaende, da die Weltkarte eine Kugel ist.
	// Es wird sowohl in x, als auch in y Richtung der kleiner Abstand zurueckgegeben.
	var x_abstand_1 = p_x-this.s.x;
	
	
	if (x_abstand_1 < 0){
		x_abstand_1 += meinSpiel.map.max_pixel_x;		
	}
	
	var x_abstand_2 = this.s.x - p_x;
	
	if (x_abstand_2 < 0){
		x_abstand_2 += meinSpiel.map.max_pixel_x;
	}


	if (x_abstand_1 > x_abstand_2){
		x_abstand_1 = -x_abstand_2;
	}

	var y_abstand_1 = p_y-this.s.y;
	
	if (y_abstand_1 < 0){
		y_abstand_1 += meinSpiel.map.max_pixel_y;
	}
	
	var y_abstand_2 = this.s.y - p_y;
	
	if (y_abstand_2 < 0){
		y_abstand_2 += meinSpiel.map.max_pixel_y;
	}

	
	if (y_abstand_1 > y_abstand_2){
		y_abstand_1 = -y_abstand_2;
	}	
	
	var abstand = new koordinate(x_abstand_1, y_abstand_1);
	return abstand;
}

function getAbstandImQuadrat(p_x, p_y){
	
	var abstand = this.getAbstand(p_x, p_y);
	
	return abstand.x * abstand.x + abstand.y * abstand.y;
}

/**
 * Es wird geprueft, ob eine der Ecken des eigenen Raumschiffs innerhalb eines der fremden Raumschiffe liegen.
 * Fall ja, dann wird die spielerID des fremden Raumschiffs zurueckgegenen, sonst null.
 */
function kollidiertMitRaumschiff(fremdesRaumschiffArray){

	for (var i = 0 ; i < fremdesRaumschiffArray.length; i++){	
					
		// Die Kollisios-Pruefung mit einem Raumschiff muss nur stattfinden, wenn
		// das Raumschiff in der Naehe (nicht weiter als 2 Kaestchen entfernt) ist
		//if (fremdesRaumschiffArray[i].getAbstandImQuadrat(this.s) < 4*feldgroesse)
		//{				
		if (fremdesRaumschiffArray[i].explosionsTimer == -1){ // Kollosionspruefung nur mit unzerstoerten Raumschiffen
			for (var j = 0; j < this.polygon.eckenArray.length; j++){
				if (fremdesRaumschiffArray[i].punktInSchiff(this.polygon.eckenArray[j].koordinate.x, this.polygon.eckenArray[j].koordinate.y, this.v.x, this.v.y) == true){
					return fremdesRaumschiffArray[i].spielerID;
				}
			}
		}
		
	}
	return null;
}
/**
 * Es wird geprueft, ob sich ein Punkt p mit Geschwindigkeit v innerhalb des Raumschiffes befindet.
 *
 * Bei schneller Geschwindigkeit kann es passieren, dass faelschlicherweise kein Treffer erkannt wird,
 * weil der Zeitpunkt der Kollision zwischen den beiden Messzeitpunkten liegt.
 * Um das zu verhindern, wird in kleinen Schritten von der aktellen Raumschiffposition und der aktuellen Partikelposition
 * deren Wegstrecke rueckwaerts gegangen und bei jedem Teilzeitpunkt die Kollission ueberprueft. 
 * Um diese Schritte rueckwaerts gehen zu konnen, benoetigt man als Paramter die Partikel-Geschwindigkeit v.
 *
 * Folgendermassen kann man ueberpruefen, ob sich ein Punkt P in einem Raumschiff (Polygon) befindet:
 * Sei E ein weit entfernter Punkt.
 * Wenn es eine ungerade Anzahl von Schnittpunkten zwischen der Strecke EP und und dem Raumschiff-Rand gibt, dann befindet sich
 * der Punkt innerhalb des Raumschiffs.
 * Dafuer wird jede einzelne Seiten-Kante des Raumschiffs ueberprueft, ob sie einen Schnittpunkt mit EP hat.
 */
function punktInSchiff(p_x, p_y, v_x, v_y)
{
		var seite;
		
		// Wenn der Punkt mehr als 2 Kaestechen vom Raumschiff entfernt ist, muss keine Kollision ueberprueft werden
		if (this.getAbstandImQuadrat(p_x, p_y) >= 4*feldgroesse*feldgroesse){				
			return new Boolean(false);
		}		
		//var abst = this.getAbstandImQuadrat(p_x, p_y) / (feldgroesse*feldgroesse);
			//log("Abstand:" + abst);			
		// a, b und c in neue Veriablen stecken, um die Original-Ecken nicht zu veraendern
		
		var eckenArrayNeu = this.polygon.eckenArray;
		var entfernterPunkt = new koordinate(10001, 10001);
		
		var anzDurchlauefe = v_max;
		
		var p_v_x_teilschritt = v_x / anzDurchlauefe;
		var p_v_y_teilschritt = v_y / anzDurchlauefe;
		var schiff_v_x_teilschritt = this.v.x / anzDurchlauefe;
		var schiff_v_y_teilschritt = this.v.y / anzDurchlauefe;
		
		
		for(var i = 1; i < anzDurchlauefe; i++)
		{
			var anzSchnittpunkte = 0;

			for (var j = 0; j < eckenArrayNeu.length; j++){
				if (j < eckenArrayNeu.length - 1){
				   if (lineSegmentCollision(eckenArrayNeu[j+1].koordinate.x, eckenArrayNeu[j+1].koordinate.y, eckenArrayNeu[j].koordinate.x, eckenArrayNeu[j].koordinate.y, entfernterPunkt.x, entfernterPunkt.y, p_x, p_y) ){
						anzSchnittpunkte++;
					}	
				}
				else {
				   if (lineSegmentCollision(eckenArrayNeu[0].koordinate.x, eckenArrayNeu[0].koordinate.y, eckenArrayNeu[j].koordinate.x, eckenArrayNeu[j].koordinate.y, entfernterPunkt.x, entfernterPunkt.y, p_x, p_y) ){
						anzSchnittpunkte++;

					}	
				}			
			}
			// Wenn Anzahl der Schnittpunkte ungerade ist, dann liegt der Punkt innerhalb des Raumschiffs
			if (Math.round((anzSchnittpunkte - 0.5)/ 2) != anzSchnittpunkte / 2){
				return new Boolean(true); // Der punkt liegt innerhalb des Raumschiffs
			}
			  // Jetzt werden die Raumschiff-Ecken und der Punkt einen Teilabschnitt zurueck bewegt
			p_x -= p_v_x_teilschritt;
			p_y -= p_v_y_teilschritt;
			for (var k = 0; k < eckenArrayNeu.length; k++){
				eckenArrayNeu[k].koordinate.x -= schiff_v_x_teilschritt; 
				eckenArrayNeu[k].koordinate.y -= schiff_v_y_teilschritt; 
			}

		}
		
		// Punkt war waehrend des gesamten Zeitraumes nicht innerhalb des Raumschiffs ==> return false
		return new Boolean(false);

}  
/**
 * Es wird geprüft, ob 
 * TODO: spielfeld 8 * multiplizieren
 */
 
function istMauerEckeInRaumschiff(){

	var links_oben_x = Math.round(this.s.x / feldgroesse - 0.5) * feldgroesse;
	var links_oben_y = Math.round(this.s.y / feldgroesse - 0.5) * feldgroesse;
	
	var rechts_oben_x = links_oben_x + feldgroesse;
	var rechts_oben_y = links_oben_y;
	
	var links_unten_x = links_oben_x;
	var links_unten_y = links_oben_y + feldgroesse;
	
	var rechts_unten_x = links_oben_x + feldgroesse;
	var rechts_unten_y = links_oben_y + feldgroesse;

	var feldinhaltLinksOben = getFeldinhaltVonPunkt(this.s.x - feldgroesse, this.s.y - feldgroesse);
	var feldinhaltOben = getFeldinhaltVonPunkt(this.s.x, this.s.y - feldgroesse);
	var feldinhaltRechtsOben = getFeldinhaltVonPunkt(this.s.x + feldgroesse, this.s.y - feldgroesse);
	var feldinhaltLinks = getFeldinhaltVonPunkt(this.s.x - feldgroesse, this.s.y );
	var feldinhaltRechts = getFeldinhaltVonPunkt(this.s.x + feldgroesse, this.s.y);
	var feldinhaltLinksUnten = getFeldinhaltVonPunkt(this.s.x - feldgroesse, this.s.y + feldgroesse);
	var feldinhaltUnten = getFeldinhaltVonPunkt(this.s.x , this.s.y + feldgroesse);
	var feldinhaltRechtsUnten = getFeldinhaltVonPunkt(this.s.x + feldgroesse, this.s.y + feldgroesse);
	
	
	// Eckpunkt oben links vorhanden
	if (feldinhaltLinks == 1 || feldinhaltLinks == 2 || feldinhaltLinks == 3 || feldinhaltLinks == 5 || 
		feldinhaltLinksOben == 1 || feldinhaltLinksOben == 2 || feldinhaltLinksOben == 3 || feldinhaltLinksOben == 4 || 
		feldinhaltOben == 1 || feldinhaltOben == 3 || feldinhaltOben == 4 || feldinhaltOben == 5){
	
			if (this.punktInSchiff(links_oben_x, links_oben_y, 0, 0) == true){
				return true;
			}
	}
	// Eckpunkt oben rechts vorhanden
	if (feldinhaltOben == 1 || feldinhaltOben == 2 || feldinhaltOben == 3 || feldinhaltOben == 4 || 
		feldinhaltRechtsOben == 1 || feldinhaltRechtsOben == 3 || feldinhaltRechtsOben == 4 || feldinhaltRechtsOben == 5 || 
		feldinhaltRechts == 1 || feldinhaltRechts == 2 || feldinhaltRechts == 4 || feldinhaltRechts == 5){
	
			if (this.punktInSchiff(rechts_oben_x, rechts_oben_y, 0, 0) == true){
				return true;
			}
	}
	// Eckpunkt unten links vorhanden
	if (feldinhaltLinks == 1 || feldinhaltLinks == 2 || feldinhaltLinks == 3 || feldinhaltLinks == 4 || 
		feldinhaltLinksUnten == 1 || feldinhaltLinksUnten == 2 || feldinhaltLinksUnten == 3 || feldinhaltLinksUnten == 5 || 
		feldinhaltUnten == 1 || feldinhaltUnten == 2 || feldinhaltUnten == 4 || feldinhaltUnten == 5){
	
			if (this.punktInSchiff(links_unten_x, links_unten_y, 0, 0) == true){
				return true;
			}
	}
	
	// Eckpunkt unten rechts vorhanden
	if (feldinhaltRechts == 1 || feldinhaltRechts == 3 || feldinhaltRechts == 4 || feldinhaltRechts == 5 || 
		feldinhaltRechtsUnten == 1 || feldinhaltRechtsUnten == 2 || feldinhaltRechtsUnten == 4 || feldinhaltRechtsUnten == 5 || 
		feldinhaltUnten == 1 || feldinhaltUnten == 2 || feldinhaltUnten == 3 || feldinhaltUnten == 5){
	
			if (this.punktInSchiff(rechts_unten_x, rechts_unten_y, 0, 0) == true){
				return true;
			}
	}


	return false
}
/**
 * Wenn sich eine Mauerecke im Raumschiff befindet, und das Raumschiff nicht zu schnell ist, dann prallt es ab.
 */
function raumschiffPralltVonEckeAb(){
	 // Bei zu hoher Geschwindigkeit explodiert das Raumschiff immer, selbst wenn es mit dem Boden aufkommt.
	 /****
	 if (this.v.x * this.v.x + this.v.y * this.v.y > MAX_SPEED_QUADRAT_ABPRALL){
		 return new Boolean(false);
	 }
	 ****/
	this.v.x = -this.v.x;
	this.v.y = -this.v.y
	this.bewegung(0);
	this.bewegung(0);  	 			
	this.v.x /= 2; 			
	this.v.y /= 2; 	
		
	return new Boolean(true);
					
}
/**
* (Wenn eine der Raumschiffecken in einer Mauer steckt, wird die Funktion raumschiffPralltAb aufgerufen.)
* Wenn der Raumschiffboden (Linie von Ecke a nach Ecke b) nicht zu schiff zur Mauer steht (< MAX_KULANZ_WINKEL), 
* und wenn die Raumschiffgeschwindigkeit nicht zu gross ist, dann prallt das Raumschiff ab.
* Die Funktion ermittelt in diesem Fall sofort die neue Richtung und die neue Raumschiffgeschwindigkeit und gibt true zurueck.
* Andernfalls wird false zureuckgeliefert.
*/
function raumschiffPralltAb(mauerPunkt){

	var x_old = mauerPunkt.x - this.v.x;
	var y_old = mauerPunkt.y - this.v.y;
	
	var links_oben_x = Math.round((mauerPunkt.x )/ feldgroesse - 0.5) * feldgroesse;
	var links_oben_y = Math.round((mauerPunkt.y )/ feldgroesse - 0.5) * feldgroesse;
	
	var rechts_oben_x = links_oben_x + feldgroesse;
	var rechts_oben_y = links_oben_y;
	
	var links_unten_x = links_oben_x;
	var links_unten_y = links_oben_y + feldgroesse;
	
	var rechts_unten_x = links_oben_x + feldgroesse;
	var rechts_unten_y = links_oben_y + feldgroesse;

    switch(	mauerPunkt.mauerart){
		case 1: // Viereck
					// Teste ob linke Mauer geschnitten
					if (lineSegmentCollision(links_oben_x, links_oben_y, links_unten_x, links_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegungRueckgaengig();
						this.v.x /=2;
						return true;
					}				
					// Teste ob rechte Mauer geschnitten
					if (lineSegmentCollision(rechts_oben_x, rechts_oben_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegungRueckgaengig();
						this.v.x /=2;
						return true;
					}				
					// Teste ob obere Mauer geschnitten
					if (lineSegmentCollision(links_oben_x, links_oben_y, rechts_oben_x, rechts_oben_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegungRueckgaengig();
						this.v.y /=2;
						return true;
					}				
					// Teste ob untere Mauer geschnitten
					if (lineSegmentCollision(links_unten_x, links_unten_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegungRueckgaengig();
						this.v.y /=2;
						return true;
					}				
					break;
		case 2: // Dreieck mit rechtem Winkel rechts oben
					// Teste ob rechte Mauer geschnitten
					if (lineSegmentCollision(rechts_oben_x, rechts_oben_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegungRueckgaengig();
						this.v.x /=2;
						return true;
					}				
					// Teste ob obere Mauer geschnitten
					if (lineSegmentCollision(links_oben_x, links_oben_y, rechts_oben_x, rechts_oben_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegungRueckgaengig();
						this.v.y /=2;
						return true;
					}		
					else{	
						var v_x_neu = this.v.y;
						this.v.y = this.v.x
						this.v.x = v_x_neu;
						//this.alpha = Math.PI/4;
						this.bewegungRueckgaengig();
						this.v.x /= 2; 			
						this.v.y /= 2; 			
						return true;
					}
					break;
		case 3: // Dreieck mit rechtem Winkel rechts unten
					// Teste ob rechte Mauer geschnitten
					if (existsStreckenSchnittpunkt(rechts_oben_x, rechts_oben_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegungRueckgaengig();
						this.v.x /=2;
						return true;
					}				
					// Teste ob untere Mauer geschnitten
					if (existsStreckenSchnittpunkt(links_unten_x, links_unten_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegungRueckgaengig();
						this.v.y /=2;
						return true;
					}			
					else{	
						var v_x_neu = this.v.y;
						this.v.y = -this.v.x
						this.v.x = -v_x_neu;
						//this.alpha = 3*Math.PI/4;
						this.bewegungRueckgaengig();
						this.v.x /= 2; 			
						this.v.y /= 2; 
						return true;
					}
					break;					
		case 4: // Dreieck mit rechtem Winkel links unten
					// Teste ob linke Mauer geschnitten
					if (existsStreckenSchnittpunkt(links_oben_x, links_oben_y, links_unten_x, links_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegungRueckgaengig();
						this.v.x /=2;
						return true;
					}				
					// Teste ob untere Mauer geschnitten
					if (existsStreckenSchnittpunkt(links_unten_x, links_unten_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegungRueckgaengig();
						this.v.y /=2;
						return true;
					}			
					else{	
						var v_x_neu = this.v.y;
						this.v.y = this.v.x
						this.v.x = v_x_neu;
						//this.alpha = 5*Math.PI/4;
						this.bewegungRueckgaengig();
						this.v.x /= 2; 			
						this.v.y /= 2; 	
						return true;
					}
					break;	
		case 5: // Dreieck mit rechtem Winkel links oben
					// Teste ob linke Mauer geschnitten
					if (existsStreckenSchnittpunkt(links_oben_x, links_oben_y, links_unten_x, links_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegungRueckgaengig();
						this.v.x /=2;
						return true;
					}				
					// Teste ob obere Mauer geschnitten
					if (existsStreckenSchnittpunkt(links_oben_x, links_oben_y, rechts_oben_x, rechts_oben_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegungRueckgaengig();
						this.v.y /=2;
						return true;
					}			
					else{	
						var v_x_neu = -this.v.y;
						this.v.y = -this.v.x
						this.v.x = v_x_neu;
						this.bewegungRueckgaengig();
						this.v.x /= 2; 			
						this.v.y /= 2; 	
						return true;
					}
					break;	
		default:		
					return false;
					break;
	}

  	 		
}
function bewegungRueckgaengig(){
	this.bewegung(0);
	this.bewegung(0);  	 			
	drehwinkel_aktuell = -drehwinkel_aktuell;
	this.dreheRaumschiff(drehwinkel_aktuell);
	this.dreheRaumschiff(drehwinkel_aktuell);
}
/**
 * Wenn sich die beiden Punkte p2 und p1 auf unterschiedlichen Seiten der Strecke  [a, b] befinden, dann schneiden sie die Strecke und es wird true zurueckgegeben.
 * (b_x - a_x)*(p_y - a_y) - (b_y - a_y)*(p_x - a_x)
 */
function existsStreckenSchnittpunkt(a_x, a_y, b_x, b_y, p1_x, p1_y, p2_x, p2_y){
   if ( ((b_x - a_x) * (p1_y - a_y) - (b_y - a_y) * (p1_x - a_x)) * 
		((b_x - a_x) * (p2_y - a_y) - (b_y - a_y) * (p2_x - a_x)) > 0 ) {
		return false;
	} else {
		return true;
	}

}
function lineSegmentCollision(a_x, a_y, b_x, b_y, p1_x, p1_y, p2_x, p2_y){

    var denom = (p2_y - p1_y) * (b_x - a_x) -
                  (p2_x - p1_x) * (b_y - a_y);
    if (Math.abs(denom) < EPSILON) return false;
    
    var ua = ((p2_x - p1_x) * (a_y - p1_y) -
                (p2_y - p1_y) * (a_x - p1_x)) / denom;
    var ub = ((b_x - a_x) * (a_y - p1_y) -
                (b_y - a_y) * (a_x - p1_x)) / denom;
    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}
	

/**
 * Wenn eine der Ecken des Raumschiffs durch die aktuelle Bewegung in eine Mauer trifft, prallt das Raumschiff ab. 
 * Es werden dann die beiden Geschwindigkeitsvektoren entsprechend geaendert, anschliessend damit die Raumschiffposition geaendert und dann true zureuckgegeben.
 * 
 * Sonst wird false zurueckgegeben.
 */
function raumschiffPralltVonMauerAb(){

  // TODO : Spielfeld 8-fach kopieren
  
	for (var i = 0; i < this.polygon.eckenArray.length; i++){
		var eckeBis = new koordinate(this.polygon.eckenArray[i].koordinate.x, this.polygon.eckenArray[i].koordinate.y);
		var eckeVon = new koordinate(eckeBis.x - this.v.x, eckeBis.y - this.v.y);

		
		var spielfeld_x = Math.round(eckeVon.x/feldgroesse + 0.5);
		var spielfeld_y = Math.round(eckeVon.y/feldgroesse + 0.5);
		
	
			

		var feldinhalt = meinSpiel.map.spielfeld[spielfeld_x][spielfeld_y];		
		
		//var feldinhalt = getFeldinhaltVonPunkt(eckeVon.x, eckeVon.y);
		
		if (feldinhalt == 1){
			return true; // darf eigentlich nicht vorkommen, weil das Raumschiff bereits abgeprallt sein muesste.
		}
		

			var links = Math.round((eckeVon.x )/ feldgroesse - 0.5) * feldgroesse;
			var rechts = links + feldgroesse;
			var oben = Math.round((eckeVon.y )/ feldgroesse - 0.5) * feldgroesse;
			var unten = oben + feldgroesse;


			
		  // Ueberpruefe das Von-Feld: Wenn VonFeld Dreieck mit Ecke oben Rechts oder unten links, dann pruefe Kollission mit Diagonalen [linksOben-nach-RechtsUnten]   
		if (feldinhalt == 4 || feldinhalt == 2){
						if (lineSegmentCollision(links, oben, rechts, unten, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
								this.raumschiffPralltAnDiagonaleLinksObenRechtsUntenAb();			
							  return true;
						}
			}
		  // Ueberpruefe das Von-Feld: Wenn VonFeld Dreieck mit Ecke oben Links oder unten Rechts, dann pruefe Kollission mit Diagonalen [linksUnten-nach-RechtsOben]   
		if (feldinhalt == 3 || feldinhalt == 5){
						if (lineSegmentCollision(links, unten, rechts, oben, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
							this.raumschiffPralltAnDiagonaleLinksUntenRechtsObenAb();
							return true;
						}
			}
		   var feldinhaltOben = meinSpiel.map.spielfeld[spielfeld_x][spielfeld_y - 1]; //getFeldinhaltVonPunkt(eckeVon.x, eckeVon.y - 1);	 
		   var feldinhaltUnten = meinSpiel.map.spielfeld[spielfeld_x][spielfeld_y + 1];//getFeldinhaltVonPunkt(eckeVon.x, eckeVon.y + 1);	 
		   var feldinhaltLinks = meinSpiel.map.spielfeld[spielfeld_x -1][spielfeld_y];//getFeldinhaltVonPunkt(eckeVon.x - 1, eckeVon.y);	 
		   var feldinhaltRechts = meinSpiel.map.spielfeld[spielfeld_x + 1][spielfeld_y];//getFeldinhaltVonPunkt(eckeVon.x + 1, eckeVon.y);	 
		   var feldinhaltObenLinks = meinSpiel.map.spielfeld[spielfeld_x - 1][spielfeld_y - 1];//getFeldinhaltVonPunkt(eckeVon.x -1, eckeVon.y - 1);	 
		   var feldinhaltObenRechts = meinSpiel.map.spielfeld[spielfeld_x + 1][spielfeld_y - 1];//getFeldinhaltVonPunkt(eckeVon.x + 1, eckeVon.y - 1);	 
		   var feldinhaltUntenLinks = meinSpiel.map.spielfeld[spielfeld_x - 1][spielfeld_y + 1];//getFeldinhaltVonPunkt(eckeVon.x - 1, eckeVon.y + 1);	 
		   var feldinhaltUntenRechts = meinSpiel.map.spielfeld[spielfeld_x + 1][spielfeld_y + 1];//getFeldinhaltVonPunkt(eckeVon.x + 1, eckeVon.y + 1);	 
		   
			/**
			 * Wenn ueber dem Schiff keine untere Mauer ist, dann pruefe ob im Feld 'Oben Links' die rechte Mauer geschnitten wurde und 
			 * ob im Feld "Oben rechts" die linke Mauer geschnitten wurde
			 */

		   if (feldinhaltOben != 1 && feldinhaltOben != 3 && feldinhaltOben != 4){
				// Wenn feldinhaltOben 0 oder 2, dann Pruefe ob ObenLinks die Rechte Mauer geschnitten wird (falls eine rechte Mauer vorhanden ist)
				if (feldinhaltOben == 0 || feldinhaltOben == 2 || feldinhaltOben > 5){
					if (feldinhaltObenLinks == 1 || feldinhaltObenLinks == 2 || feldinhaltObenLinks == 3){   		
						if (lineSegmentCollision(links - 1, oben - 1, links - 1, oben - feldgroesse, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
										this.raumschiffPralltAnVertikalerMauerAb();
										return true;
						}	
					}
				}
				// Wenn feldinhaltOben 0 oder 5, dann Pruefe ob ObenRechts die Linke Mauer geschnitten wird (falls eine linke Mauer vorhanden ist)
				if (feldinhaltOben == 0 || feldinhaltOben == 5 || feldinhaltOben > 5){
					if (feldinhaltObenRechts == 1 || feldinhaltObenRechts == 4 || feldinhaltObenRechts == 5){   		
						if (lineSegmentCollision(rechts + 1, oben - 1, rechts + 1, oben - feldgroesse, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
										this.raumschiffPralltAnVertikalerMauerAb();
										return true;
						}	
					}
				}
					// Wenn Oben = 'Dreieck ObenLinks', dann pruefe im Feld Oben, ob diagonale [linksUnten nach RechtsOben] geschnitten wird
				if (feldinhaltOben == 5){
					if (lineSegmentCollision(links , oben - 1, rechts , oben - feldgroesse, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
									this.raumschiffPralltAnDiagonaleLinksUntenRechtsObenAb();
									return true;
					}
				}
					// Wenn Oben = 'Dreieck ObenRechts', dann pruefe im Feld Oben, ob diagonale [linksOben nach RechtsUnten] geschnitten wird
				if (feldinhaltOben == 2){
					if (lineSegmentCollision(links , oben - feldgroesse, rechts , oben - 1, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
								this.raumschiffPralltAnDiagonaleLinksObenRechtsUntenAb();		
								return true;
					}
				}
			}
			// Sonst pruefe Kollission mit unterer Mauer im FeldOben 
			else{
					if (lineSegmentCollision(links, oben - 1, rechts, oben - 1, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){				
							this.raumschiffPralltAnHorizontalerMauerAb();
							return true;	      	
					}
			}				
				

			/**
			 * Wenn links vom Schiff keine rechte Mauer ist, dann pruefe ob im Feld 'Oben Links' die untere Mauer geschnitten wurde und 
			 * ob im Feld "Unten links" die obere Mauer geschnitten wurde
			 */

		   if (feldinhaltLinks != 1 && feldinhaltLinks != 2 && feldinhaltLinks != 3){
				// Wenn feldinhaltLinks 0 oder 4, dann Pruefe ob ObenLinks die Untere Mauer geschnitten wird (falls eine Untere Mauer vorhanden ist)
				if (feldinhaltLinks == 0 || feldinhaltLinks == 4 || feldinhaltLinks > 5){
				  if (feldinhaltObenLinks == 1 || feldinhaltObenLinks == 3 || feldinhaltObenLinks == 4){   		
						if (lineSegmentCollision(links - feldgroesse, oben - 1, links - 1, oben - 1, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
										this.raumschiffPralltAnHorizontalerMauerAb();
										return true;
							  }	
						}
					}
				// Wenn feldinhaltLinks 0 oder 5, dann Pruefe ob UntenLinks die Obere Mauer geschnitten wird (falls eine Obere Mauer vorhanden ist)
				if (feldinhaltLinks == 0 || feldinhaltLinks == 5|| feldinhaltLinks > 5){
				  if (feldinhaltUntenLinks == 1 || feldinhaltUntenLinks == 2 || feldinhaltUntenLinks == 5){   		
						if (lineSegmentCollision(links - feldgroesse, unten + 1, links - 1, unten + 1, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
										this.raumschiffPralltAnVertikalerMauerAb();
										return true;
							  }	
						}
					}
					// Wenn links = 'Dreieck ObenLinks', dann pruefe im Feld links, ob diagonale [linksUnten nach RechtsOben] geschnitten wird
			if (feldinhaltLinks == 5){
					if (lineSegmentCollision(links - feldgroesse, unten, links - 1 , oben, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
									this.raumschiffPralltAnDiagonaleLinksUntenRechtsObenAb();
									return true;
							}
					}
					// Wenn links = 'Dreieck UntenLinks', dann pruefe im Feld links, ob diagonale [linksOben nach RechtsUnten] geschnitten wird
			if (feldinhaltLinks == 4){
					if (lineSegmentCollision(links - feldgroesse, oben, links - 1, unten, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
								this.raumschiffPralltAnDiagonaleLinksObenRechtsUntenAb();		
								return true;
							}
					}
				}
				
				
				// Sonst pruefe Kollission mit rechter Mauer im FeldLinks 
				else{
			  if (lineSegmentCollision(links - 1, oben , links - 1, unten, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){				
							this.raumschiffPralltAnVertikalerMauerAb();
							return true;	      	
			  }
				}	
			




			/**
			 * Wenn rechts vom Schiff keine linke Mauer ist, dann pruefe ob im Feld 'Oben Rechts' die untere Mauer geschnitten wurde und 
			 * ob im Feld "Unten Rechts" die obere Mauer geschnitten wurde
			 */

		   if (feldinhaltRechts != 1 && feldinhaltRechts != 4 && feldinhaltRechts != 5){
				// Wenn feldinhaltrechts 0 oder 3, dann Pruefe ob ObenRechts die Untere Mauer geschnitten wird (falls eine Untere Mauer vorhanden ist)
				if (feldinhaltRechts == 0 || feldinhaltRechts == 3 || feldinhaltRechts > 5){
				  if (feldinhaltObenRechts == 1 || feldinhaltObenRechts == 3 || feldinhaltObenRechts == 4){   		
						if (lineSegmentCollision(rechts + 1 , oben - 1, rechts + feldgroesse, oben - 1, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
										this.raumschiffPralltAnHorizontalerMauerAb();
										return true;
							  }	
						}
					}
				// Wenn feldinhaltRechts 0 oder 5, dann Pruefe ob UntenRechts die Obere Mauer geschnitten wird (falls eine Obere Mauer vorhanden ist)
				if (feldinhaltRechts == 0 || feldinhaltRechts == 2 || feldinhaltRechts > 5){
				  if (feldinhaltUntenRechts == 1 || feldinhaltUntenRechts == 2 || feldinhaltUntenRechts == 5){   		
						if (lineSegmentCollision(rechts + 1 , unten + 1, rechts + feldgroesse, unten + 1, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
										this.raumschiffPralltAnHorizontalerMauerAb();
										return true;
							  }	
						}
					}
					// Wenn Rechts = 'Dreieck ObenRechts', dann pruefe im Feld rechts, ob diagonale [linksOben nach RechtsUnten] geschnitten wird
			if (feldinhaltRechts == 2){
					if (lineSegmentCollision(rechts + 1, oben, rechts + feldgroesse, unten, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
									this.raumschiffPralltAnDiagonaleLinksObenRechtsUntenAb();
									return true;
							}
					}
					// Wenn Rechts = 'Dreieck UntenRechts', dann pruefe im Feld Rechts, ob diagonale [linksUnten nach RechtsOben] geschnitten wird
			if (feldinhaltRechts == 3){
					if (lineSegmentCollision(rechts + 1, unten, rechts + feldgroesse, oben, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
								this.raumschiffPralltAnDiagonaleLinksUntenRechtsObenAb();		
								return true;
							}
					}
				}
				// Sonst pruefe Kollission mit linker Mauer im FeldRechts 
				else{
			  if (lineSegmentCollision(rechts + 1, oben , rechts + 1, unten, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){				
							this.raumschiffPralltAnVertikalerMauerAb();
							return true;	      	
			  }
				}	
				




			/**
			 * Wenn unter dem Schiff keine obere Mauer ist, dann pruefe ob im Feld 'Unten Links' die rechte Mauer geschnitten wurde und 
			 * ob im Feld "Unten rechts" die linke Mauer geschnitten wurde
			 */
		   if (feldinhaltUnten != 1 && feldinhaltUnten != 2 && feldinhaltUnten != 5){
				// Wenn feldinhaltUnten 0 oder 3, dann Pruefe ob UntenLinks die Rechte Mauer geschnitten wird (falls eine rechte Mauer vorhanden ist)
				if (feldinhaltUnten == 0 || feldinhaltUnten == 3 || feldinhaltUnten > 5){
				  if (feldinhaltUntenLinks == 1 || feldinhaltUntenLinks == 2 || feldinhaltUntenLinks == 3){   		
						if (lineSegmentCollision(links - 1, unten + 1, links - 1, unten + feldgroesse, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
										this.raumschiffPralltAnVertikalerMauerAb();
										return true;
							  }	
						}
					}
				// Wenn feldinhaltUnten 0 oder 4, dann Pruefe ob UntenRechts die Linke Mauer geschnitten wird (falls eine linke Mauer vorhanden ist)
				if (feldinhaltUnten == 0 || feldinhaltUnten == 4 || feldinhaltUnten > 5){
				  if (feldinhaltUntenRechts == 1 || feldinhaltUntenRechts == 4 || feldinhaltUntenRechts == 5){   		
						if (lineSegmentCollision(rechts + 1, unten + 1, rechts + 1, unten + feldgroesse, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
										this.raumschiffPralltAnVertikalerMauerAb();
										return true;
							  }	
						}
					}
					// Wenn Unten = 'Dreieck UntenLinks', dann pruefe im Feld Unten, ob diagonale [linksOben nach RechtsUnten] geschnitten wird
			if (feldinhaltUnten == 4){
					if (lineSegmentCollision(links , unten + 1, rechts , unten + feldgroesse, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
							this.raumschiffPralltAnDiagonaleLinksObenRechtsUntenAb();
									return true;
							}
					}
					// Wenn Unten = 'Dreieck UntenRechts', dann pruefe im Feld Unten, ob diagonale [linksUnten nach RechtsOben] geschnitten wird
			if (feldinhaltUnten == 3){
					if (lineSegmentCollision(links , unten + feldgroesse, rechts , unten + 1, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){
									this.raumschiffPralltAnDiagonaleLinksUntenRechtsObenAb();
								return true;
							}
					}
				}
				// Sonst pruefe Kollission mit oberer Mauer im FeldUnten 
				else{
			  if (lineSegmentCollision(links, unten + 1, rechts, unten + 1, eckeVon.x, eckeVon.y, eckeBis.x, eckeBis.y)){				
							this.raumschiffPralltAnHorizontalerMauerAb();
							return true;	      	
			  }
		}				
	}
	return false;
}					
function raumschiffPralltAnHorizontalerMauerAb(){
		this.v.y = -this.v.y ;
		this.bewegung(0);
		this.bewegung(0);
		this.v.y /=2;
}
function raumschiffPralltAnVertikalerMauerAb(){
		this.v.x = -this.v.x ;
		this.bewegung(0);
		this.bewegung(0);
		this.v.x /=2;							
}
function raumschiffPralltAnDiagonaleLinksObenRechtsUntenAb(){	
		var v_x_neu = this.v.y;
		this.v.y = this.v.x
		this.v.x = v_x_neu;
		this.bewegung(0);  	 			
		this.bewegung(0);
		this.v.x /= 2; 			
		this.v.y /= 2; 	
}
function raumschiffPralltAnDiagonaleLinksUntenRechtsObenAb(){	
		var v_x_neu = -this.v.y;
		this.v.y = -this.v.x
		this.v.x = v_x_neu;
		this.bewegung(0);
		this.bewegung(0);  	 			
		this.v.x /= 2; 			
		this.v.y /= 2; 		
}
