
/**
 * Diese Funktion wird bei eingeschaltetem Autopilot am Anfang der GameLoop aufgerufen.
 * Der Autopilot prueft, welche Aktionen aktuell sinnvoll sind und gibt 
 * dann die von ihm gewuenschte Tastaturbelegung zurueck. Die Tataturbelegung kann vom Spieler manuell uebersteuert werden.
 */
function autoPilot(map, meinRaumschiff, fremdesRaumschiffArray, fremdeSchuesse, schuss_speed, erdanziehung){
	
	var aktuelleTastaturlegung = new tastaturbelegung();
	
	
	var naechstesRaumschiff = getNaechstesRaumschiff(meinRaumschiff, fremdesRaumschiffArray);
	
	var zufallsTastaturlegung = ermittleZufallsbelegung();
	
	// Wenn es keine fremden Raumschiffe gibt, dann soll die Bewegung komplett zufaellig sein
	if (naechstesRaumschiff == null){
		aktuelleTastaturlegung = zufallsTastaturlegung;
	}
	// Das Raumschiff soll sich in Richtung des naechstgelegenen fremden Raumschiff drehen, und wenn es ungefaehr in die Richtung guckt, soll geschossen werden.
	// Die Schubbewegung und die Benutzung der Gravitationswelle ist vorerst voellig zufaellig
	else{
		aktuelleTastaturlegung = dreheInRichtungFremdRaumschiffUndSchiesse(meinRaumschiff, naechstesRaumschiff);
		
		/**
		aktuelleTastaturlegung.taste_schub = zufallsTastaturlegung.taste_schub;
		aktuelleTastaturlegung.taste_gravitation = zufallsTastaturlegung.taste_gravitation;
		**/
	}
	
	
	return aktuelleTastaturlegung;
}

/**
 * Es wird fuer jede moegliche Tastaturbelegung (taste_links, taste_rechts, taste_schub, taste_schuss, taste_home, taste_gravitation)
 * per Zufall bestimmt, ob belegt oder nicht belegt.
 */
function ermittleZufallsbelegung(){
	
	
	var zufallsTastaturlegung = new tastaturbelegung();
	
	var zufallszahl = Math.random();
	if (zufallszahl < 0.1){
		zufallszahl = Math.random();
		if (zufallszahl < 0.5){
			zufallsTastaturlegung.taste_links = 1;
		}else{
			zufallsTastaturlegung.taste_rechts = 1;
		}
	}
	zufallszahl = Math.random();
	if (zufallszahl < 0.1){
		zufallsTastaturlegung.taste_schub = 1;
	}

	zufallszahl = Math.random();
	if (zufallszahl < 0.1){
		zufallsTastaturlegung.taste_schuss = 1;
	}
	zufallszahl = Math.random();
	if (zufallszahl < 0.01){
		zufallsTastaturlegung.taste_gravitation = 1;
	}

	return 	zufallsTastaturlegung;
}
/**
 * Diese Funktion prueft, ob zwischen 2 uebergeben Punkten eine Mauer ist. 
 * Wenn ja wird true zureuckgegeben, sonst false.
 * Die Funktion wird benoetigt, um zu Prüfen, ob ein fremdesRaumschiff abschiessbar ist.
 * Es wird ausgehend von KoordinateA der Vektor AB in kleinen Teil-Schritten durchlaufen und je Teilschritt wird geprueft,
 * ob sich der aktuelle Punkt in einer Mauer befindet.
 * Die Funktion liefert kein exaktes Ergebnis, da die Anzahl der Steps aus Performance-Gruenden gross gehalten ist.
 * 
 */
function isMauerZwischenPunkten(koordinatePunktA, vektorAB){
	
	var abstand_betrag = Math.sqrt(vektorAB.x * vektorAB.x + vektorAB.y * vektorAB.y);
	var anzahl_steps = Math.round(2*abstand_betrag/feldgroesse);
	var add_x = vektorAB.x / anzahl_steps;
	var add_y = vektorAB.y / anzahl_steps;
	
	var aktuelleKoordinate = Object.create(koordinatePunktA);  // keine Referenz, sondern Objekt klonen
	

	for (var i = 1; i <= anzahl_steps; i++){
		aktuelleKoordinate.x += add_x;
		aktuelleKoordinate.y += add_y;
		var feldinhalt = getFeldinhaltVonPunkt(aktuelleKoordinate.x, aktuelleKoordinate.y);
		if(feldinhalt > 0 && feldinhalt < 6){
			return true;
		}
	}
	return false;
}


/**
 * Diese Funktion liefert dasjenige fremde Raumschiff, welches dem eigenen am naechsten ist.
 */
function getNaechstesRaumschiff(meinRaumschiff, fremdesRaumschiffArray){
	var kleinsterAbstand = 100000000;
	var naechstesRaumschiff = null;
	
	for (var i = 0 ; i < fremdesRaumschiffArray.length; i++){
		var aktuellerAbstand = meinRaumschiff.getAbstandImQuadrat(fremdesRaumschiffArray[i].s.x, fremdesRaumschiffArray[i].s.y);
		if (aktuellerAbstand < kleinsterAbstand){
			kleinsterAbstand = aktuellerAbstand;
			naechstesRaumschiff = fremdesRaumschiffArray[i];
		}
	}

	return naechstesRaumschiff;
}

/**
 * Die Funktion liefert die Klasse tastaturbelegung zurueck.
 * Belegt ist dabei entweder das Attribut taste_links oder das Attribut  taste_rechts. Davon abhaengig in welche
 * Richtung das eigene Raumschiff drehen muss, um naeher in Richtung Fremdraumschiff zu gucken.
 *
 * Wenn das eigene Raumschiff schon fast in Richtung fremdesRaumschiff guckt (Winkel zwischen alpha und fremdRaumschiffRichtung ist kleiner SCHUSSWINKEL),
 * und wenn keine Mauer zwischen den beiden Raumschiffen ist, dann soll zusaetzlich die Taste taste_schuss belegt werden.
 */
function dreheInRichtungFremdRaumschiffUndSchiesse(meinRaumschiff, fremdesRaumschiff){
  var neueTastaturbelegung = new tastaturbelegung();
  var fremdRaumschiffRichtung = getRichtungZumFremdraumschiff(meinRaumschiff, fremdesRaumschiff);
  
  if (Math.abs(meinRaumschiff.alpha - fremdRaumschiffRichtung) < SCHUSSWINKEL &&
		isMauerZwischenPunkten(meinRaumschiff.s, meinRaumschiff.getAbstand(fremdesRaumschiff.s.x, fremdesRaumschiff.s.y)) == false){
	  neueTastaturbelegung.taste_schuss = 1;
  }
	  
  
  if (meinRaumschiff.alpha == fremdRaumschiffRichtung){
	  return neueTastaturbelegung; // keine Drehung
  }
  if (fremdRaumschiffRichtung > meinRaumschiff.alpha){
	  if (fremdRaumschiffRichtung - meinRaumschiff.alpha < Math.PI){
		  neueTastaturbelegung.taste_rechts = 1;
	  }
	  else{
		  neueTastaturbelegung.taste_links = 1;
	  }
  }
  else{ 
		if (meinRaumschiff.alpha - fremdRaumschiffRichtung < Math.PI){
		  neueTastaturbelegung.taste_links = 1;
	  }
	  else{
		  neueTastaturbelegung.taste_rechts = 1;
	  }	  
  }

  
  return neueTastaturbelegung;
}
/**
 * liefert die Richtung des Vektors, der zwischen den Schwerpunkten der beiden Raumschiffe verlaeuft
 * Das Ergebnis liegt zwischen 0 und 2 PI
 * Der Zureuckgegebene Winkel ist der Winkel zwischen der y-Achse und dem Vektor, der vom eigenem Schiff in Richtung Fremdraumschiff zeigt.
 */
function getRichtungZumFremdraumschiff(meinRaumschiff, fremdesRaumschiff){	
	var abstand;	
	var virtuellerSchuss = new schuss();
	virtuellerSchuss.initialisiere(meinRaumschiff);
	abstand = meinRaumschiff.getAbstand(fremdesRaumschiff.s.x, fremdesRaumschiff.s.y);

	var abstand_betrag = Math.sqrt(abstand.x * abstand.x + abstand.y * abstand.y);	
	var richtung = Math.acos(Math.abs(abstand.x)/abstand_betrag);

	if (abstand.x < 0 && abstand.y >= 0){
		richtung = Math.PI - richtung;
	}
	if (abstand.x < 0 && abstand.y < 0){
		richtung = Math.PI + richtung;
	}	
	if (abstand.x >= 0 && abstand.y < 0){
		richtung = 2*Math.PI - richtung;
	}	
	
	richtung -= Math.PI / 2;
	
	if (richtung > 2*Math.PI){
		richtung -= 2*Math.PI;
	}
	if (richtung < 0){
		richtung += 2*Math.PI;
	}
	
	return richtung;
}


