function raumschiff(basis, rot, gruen, gelb, typ){
	//this.basis = basis;
	
  	this.alpha = Math.PI; /* Winkel zwischen der y-Achse und der Schiffsrichtung */


  	this.red = rot; //$( "#red" ).val().toString();
    this.green = gruen; //$( "#green" ).val().toString();
    this.blue = gelb; //$( "#blue" ).val().toString();
  
  	this.energie = START_ENERGIE;
/***
  	this.red = Math.round(Math.random()*256).toString();
    this.green = Math.round(Math.random()*256).toString();
    this.blue = Math.round(Math.random()*256).toString();
***/ 

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
  	
  	
  	
	
	//this.clientID;
	this.spielerID = basis.spielerID;
	this.spielername = basis.spielername;
	this.s = new koordinate(0, 0); // Raumschiffachse, um die sich das Raumschiff dreht

    this.typ = typ;
	this.polygon = new polygon(typ);

	 this.berechneEcken = berechneEcken;
	 this.zeichneZentriert = zeichneZentriert;
	 this.zeichneRelativ = zeichneRelativ;
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
	 this.raumschiffPralltAb = raumschiffPralltAb;
	 this.raumschiffPralltVonEckeAb = raumschiffPralltVonEckeAb;
	 this.istMauerEckeInRaumschiff = istMauerEckeInRaumschiff;
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
	 
	 // Die Ecken a, b und c des Raumschiffs werden nicht uebergeben, sondern berechnet
	 this.berechneEcken();
	 /////this.positioniereRaumschiffAufBasis();

}
function basisWechsel(){
	var neueBasis = meinSpiel.getBasis(this);
	// Wenn sich der Schwerpunkt des Raumschiffs innerhalb einer Basis befindet, kann diese uebernommen werden
	if (neueBasis != null){
		var vorbesitzerID = neueBasis.spielerID;
		var vorbesitzerName = neueBasis.spielername;
		//var vorbesitzerID = neueBasis.clientID;
		if (vorbesitzerID == this.spielerID){
			return; // die Basis gehoert mir schon
		}
		else{
			meinSpiel.setBasisLeer(this.spielerID);
			neueBasis.spielerID = this.spielerID;
			neueBasis.spielername = this.spielername;
			meinSpiel.weiseBasisZu(neueBasis);
			//this.basis = neueBasis;
			
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
	/**
	for (var i = 0; i < this.polygon.length; i++){
		this.polygon[i].koordinate.x = this.s.x + Math.cos(this.polygon[i].winkel + this.alpha) * this.polygon[i].abstand;
		this.polygon[i].koordinate.y = this.s.y + Math.sin(this.polygon[i].winkel + this.alpha) * this.polygon[i].abstand;
	}	
***/	
}

/**
 * Wenn es sich um das eigene Raumschiff handelt, wird das Raumschiff (der Schwerpunkt s) immer zentriert 
 * im Bildschirmmittelpunkt gezeichnet
 */
function zeichneZentriert(derContext){
  	//context.fillStyle = this.farbe; 
	var mitte_x = this.s.x - spielfeldausschnitt_x / 2;
	var mitte_y = this.s.y - spielfeldausschnitt_y / 2;
	
	zeichneRaumschiff(derContext, this.polygon, mitte_x, mitte_y);

	// Zeichne EnergieBalken
	//derContext.strokeStyle =  "rgb(0, 0, 255)";
	derContext.strokeRect(this.s.x - feldgroesse - mitte_x, this.s.y - 2*feldgroesse - mitte_y, 2*feldgroesse, 7);			
	derContext.stroke();	
	
	//derContext.fillStyle =  "rgb(220, 220, 220)";
	derContext.fillRect(this.s.x - (feldgroesse - 1) - mitte_x, this.s.y - 2*feldgroesse + 1 - mitte_y,  (2*feldgroesse - 2) * this.energie / START_ENERGIE  , 5);			
	derContext.fill();

	
	/**
	derContext.fillStyle = this.farbe; //"rgb(0, 0, 0)";
	derContext.beginPath();
	derContext.moveTo(this.polygon[0].koordinate.x - mitte_x, this.polygon[0].koordinate.y - mitte_y);
	
	for (var i = 1; i < this.polygon.length; i++){
		derContext.lineTo(this.polygon[i].koordinate.x - mitte_x, this.polygon[i].koordinate.y - mitte_y);
	}
	derContext.lineTo(this.polygon[0].koordinate.x - mitte_x, this.polygon[0].koordinate.y - mitte_y);
	derContext.fill();
	
	derContext.strokeStyle = "#7F7F7F"
	derContext.stroke();		
	**/
	/**
	context.beginPath();
	context.moveTo(this.polygon[0].koordinate.x - this.s.x + spielfeldausschnitt_x / 2, this.polygon[0].koordinate.y - this.s.y + spielfeldausschnitt_y / 2);
	
	for (var i = 1; i < this.polygon.length; i++){
		context.lineTo(this.polygon[i].koordinate.x - this.s.x + spielfeldausschnitt_x / 2, this.polygon[i].koordinate.y - this.s.y + spielfeldausschnitt_y / 2);
	}
	context.lineTo(this.polygon[0].koordinate.x - this.s.x + spielfeldausschnitt_x / 2, this.polygon[0].koordinate.y - this.s.y + spielfeldausschnitt_y / 2);
	context.fill();
	
	context.strokeStyle = "#7F7F7F"
	context.stroke();			
	**/
}		 

/**
 * Wenn es sich um ein fremdes Raumschiff handelt, wird immer relativ zum eigenen Raumschiff (Schwerpunkt s) 
 * und relativ zum Bildschirmmittelpunkt gezeichnet.
 */
function zeichneRelativ(context, s){

			var relativeEcken = new Array();
			var relativerSchwerpunkt = erzeugeRelativeKoordinate(this.s, s);
		
			for (var i = 0; i < this.polygon.eckenArray.length; i++){			
				relativeEcken.push(erzeugeRelativeKoordinate(this.polygon.eckenArray[i].koordinate, s));
			}

		
			if (isRaumschiff_rechts_Ausserhalb(relativeEcken)){
				for (var i = 0; i < relativeEcken.length; i++){			
					relativeEcken[i].x -= meinSpiel.map.max_pixel_x;
				}
				relativerSchwerpunkt.x -= meinSpiel.map.max_pixel_x;
			}

			if (isRaumschiff_links_Ausserhalb(relativeEcken)){
				for (var i = 0; i < relativeEcken.length; i++){			
					relativeEcken[i].x += meinSpiel.map.max_pixel_x;
				}
				relativerSchwerpunkt.x += meinSpiel.map.max_pixel_x;
			}
			if (isRaumschiff_unten_Ausserhalb(relativeEcken)){
				for (var i = 0; i < relativeEcken.length; i++){			
					relativeEcken[i].y -= meinSpiel.map.max_pixel_y;
				}
				relativerSchwerpunkt.y -= meinSpiel.map.max_pixel_y;
    	  	}
			if (isRaumschiff_oben_Ausserhalb(relativeEcken)){
				for (var i = 0; i < relativeEcken.length; i++){			
					relativeEcken[i].y += meinSpiel.map.max_pixel_y;
				}
				relativerSchwerpunkt.y += meinSpiel.map.max_pixel_y;
			}
	
   	  					  
			context.fillStyle =  this.farbe;

			context.beginPath();
			
			context.moveTo(relativeEcken[0].x , relativeEcken[0].y );
			
			for (var i = 1; i < relativeEcken.length; i++){
				context.lineTo(relativeEcken[i].x , relativeEcken[i].y );
			}
			context.lineTo(relativeEcken[0].x , relativeEcken[0].y );
			context.fill();
			
			context.strokeStyle = "#7F7F7F"
			context.stroke();
			
			context.fillText(this.spielername, relativerSchwerpunkt.x - this.spielername.length * 3 , relativerSchwerpunkt.y + 25);			

			


}
/**
 * Wenn alle relativen EckenKoordinaten rechts ausserhalb der Kartebreite sind, dann return true, sonst false
 */
function isRaumschiff_rechts_Ausserhalb(relativeEcken){
	for (var i = 0; i < relativeEcken.length; i++){	
		if (relativeEcken[i].x <= meinSpiel.map.max_pixel_x){
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
		if (relativeEcken[i].x <= meinSpiel.map.max_pixel_y){
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
/********************************/
///return 0;
/********************************/
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
/*****/	
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
	untergrundfarbe;
											
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
	// Wegen Internet - Lag - Problemen wurde die Farbe eines getroffenen Raumschiffs auf die Untergrundfarbe gesetzt,
	// um sofort den Treffer zu realisieren.
	// Wenn ein fremdes Raumschiff also die untergrundfarbe hat, und noch nicht explodiert ist, dann weiss es selber noch
	// nicht, dass es getroffen wurde. In diesem Fall soll es mir nicht seine echte Farbe uebermitteln.
	/**********************
	if (!(this.explosionsTimer == -1 && this.farbe == untergrundfarbe))
	************/
	{
		this.farbe = datenArray[6];
	}
	
	
	this.punkte = parseInt(datenArray[7]);
	this.explosionsTimer =  parseInt(datenArray[8]);
	var typNeu = datenArray[9];
	if (typNeu != this.typ){
		this.typ = typNeu;
		this.polygon = new polygon(this.typ);
	}
  this.untergrundFarbe = datenArray[10];
}
/**
 * Gibt den Abstand im Quadrat zwischen Schwerpunkte und uebergeben Punkt zurueck
 */
function getAbstandImQuadrat(p_x, p_y){
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
		x_abstand_1 = x_abstand_2;
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
		y_abstand_1 = y_abstand_2;
	}	
	
	//var logAbstand = Math.sqrt(x_abstand_1 * x_abstand_1 + y_abstand_1 * y_abstand_1) / feldgroesse;
	//log("Abstand: " + logAbstand);
	
	
	return x_abstand_1 * x_abstand_1 + y_abstand_1 * y_abstand_1;
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
   *  (Wenn eine der Raumschiffecken in einer Mauer steckt, wird die Funktion raumschiffPralltAb aufgerufen.)
   *  Wenn der Raumschiffboden (Linie von Ecke a nach Ecke b) nicht zu schiff zur Mauer steht (< MAX_KULANZ_WINKEL), 
   * und wenn die Raumschiffgeschwindigkeit nicht zu gross ist, dann prallt das Raumschiff ab.
   * Die Funktion ermittelt in diesem Fall sofort die neue Richtung und die neue Raumschiffgeschwindigkeit und gibt true zurueck.
   * Andernfalls wird false zureuckgeliefert.
   */
  function raumschiffPralltAb(mauerPunkt){
   	 // Bei zu hoher Geschwindigkeit explodiert das Raumschiff immer, selbst wenn es mit dem Boden aufkommt.
/****************	 
  	 if (this.v.x * this.v.x + this.v.y * this.v.y > MAX_SPEED_QUADRAT_ABPRALL){
  		 return new Boolean(false);
  	 }
*******************/	 
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
						this.bewegung(0);
						this.bewegung(0);
						this.v.x /=2;
						return true;
					}				
					// Teste ob rechte Mauer geschnitten
					if (lineSegmentCollision(rechts_oben_x, rechts_oben_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.x /=2;
						return true;
					}				
					// Teste ob obere Mauer geschnitten
					if (lineSegmentCollision(links_oben_x, links_oben_y, rechts_oben_x, rechts_oben_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.y /=2;
						return true;
					}				
					// Teste ob untere Mauer geschnitten
					if (lineSegmentCollision(links_unten_x, links_unten_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.y /=2;
						return true;
					}				
					break;
		case 2: // Dreieck mit rechtem Winkel rechts oben
					// Teste ob rechte Mauer geschnitten
					if (lineSegmentCollision(rechts_oben_x, rechts_oben_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.x /=2;
						return true;
					}				
					// Teste ob obere Mauer geschnitten
					if (lineSegmentCollision(links_oben_x, links_oben_y, rechts_oben_x, rechts_oben_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.y /=2;
						return true;
					}		
					else{	
						var v_x_neu = this.v.y;
						this.v.y = this.v.x
						this.v.x = v_x_neu;
						//this.alpha = Math.PI/4;
						this.bewegung(0);  	 			
						this.bewegung(0);
						this.v.x /= 2; 			
						this.v.y /= 2; 			
						return true;
					}
					break;
		case 3: // Dreieck mit rechtem Winkel rechts unten
					// Teste ob rechte Mauer geschnitten
					if (existsStreckenSchnittpunkt(rechts_oben_x, rechts_oben_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.x /=2;
						return true;
					}				
					// Teste ob untere Mauer geschnitten
					if (existsStreckenSchnittpunkt(links_unten_x, links_unten_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.y /=2;
						return true;
					}			
					else{	
						var v_x_neu = this.v.y;
						this.v.y = -this.v.x
						this.v.x = -v_x_neu;
						//this.alpha = 3*Math.PI/4;
						this.bewegung(0);  	 			
						this.bewegung(0);
						this.v.x /= 2; 			
						this.v.y /= 2; 
						return true;
					}
					break;					
		case 4: // Dreieck mit rechtem Winkel links unten
					// Teste ob linke Mauer geschnitten
					if (existsStreckenSchnittpunkt(links_oben_x, links_oben_y, links_unten_x, links_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.x /=2;
						return true;
					}				
					// Teste ob untere Mauer geschnitten
					if (existsStreckenSchnittpunkt(links_unten_x, links_unten_y, rechts_unten_x, rechts_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.y /=2;
						return true;
					}			
					else{	
						var v_x_neu = this.v.y;
						this.v.y = this.v.x
						this.v.x = v_x_neu;
						//this.alpha = 5*Math.PI/4;
						this.bewegung(0);  	 			
						this.bewegung(0);
						this.v.x /= 2; 			
						this.v.y /= 2; 	
						return true;
					}
					break;	
		case 5: // Dreieck mit rechtem Winkel links oben
					// Teste ob linke Mauer geschnitten
					if (existsStreckenSchnittpunkt(links_oben_x, links_oben_y, links_unten_x, links_unten_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.x = -this.v.x ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.x /=2;
						return true;
					}				
					// Teste ob obere Mauer geschnitten
					if (existsStreckenSchnittpunkt(links_oben_x, links_oben_y, rechts_oben_x, rechts_oben_y, x_old, y_old, mauerPunkt.x, mauerPunkt.y)){
						this.v.y = -this.v.y ;
						this.bewegung(0);
						this.bewegung(0);
						this.v.y /=2;
						return true;
					}			
					else{	
						var v_x_neu = -this.v.y;
						this.v.y = -this.v.x
						this.v.x = v_x_neu;
						this.bewegung(0);
						this.bewegung(0);  	 			
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
	

