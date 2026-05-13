
	function gameLoop() {		

		// Synchronisation: Erst wenn alle clients die spielAktionen in ihrer letzten gameLoop durchlaufen haben,
		// duerfen die naechsten Spielaktionen durchgefuehrt werden
		// Die Variable statusVomServerErhalten wird in der Klasse serverConnection gesetzt, wenn man den Status(aller clients) vom Server erhalten hat.
		if (statusVomServerErhalten)
		{	
			spielAktionen();
			sendStatus(); // Den eigenen Status an den Server senden
			statusVomServerErhalten = false;
			zeichneAlles();
			pausenZeit = TIMEOUT - (new Date().getTime() - startZeit);
			if (pausenZeit < 0){
				pausenZeit = 0;
			}
			startZeit = new Date().getTime();
		}
		else{
			pausenZeit = 0;
		}
		// Der rekursive Aufruf der Spielschleife durch setTimeout loescht den stack, daher kann es nicht zu einem StackOverflow kommen
		// eine while-Schleife anstatt rekursion ist nicht moeglich, da javascript nur einen Thread hat, und events dann nicht mehr an die Reihe kommen wuerden
		//timeOutID = setTimeout(gameLoop, pausenZeit); 
		timeOutID = setTimeout(gameLoop, TIMEOUT); 
		/**
		timeOutID = setTimeout(function() {			
			requestAnimationFrame(gameLoop);
		}, pausenZeit); 
		**/		
	}


	function spielAktionen(){
		if (meinRaumschiff.explosionsTimer >= 0){
			if (meinRaumschiff.explosionsTimer == 0){
				meinRaumschiff.positioniereRaumschiffAufBasis();
			}
			meinRaumschiff.explosionsTimer --;
		}
		else{
			if (autopilotOnOff == 1){
				var neueTastaturbelegung = autoPilot(map, meinRaumschiff, fremdesRaumschiffArray, fremdeSchuesse, schuss_speed, erdanziehung);
				taste_links = neueTastaturbelegung.taste_links;
				taste_rechts = neueTastaturbelegung.taste_rechts;
				taste_schub = neueTastaturbelegung.taste_schub;
				taste_schuss = neueTastaturbelegung.taste_schuss;
				taste_home = neueTastaturbelegung.taste_home;
				taste_gravitation = neueTastaturbelegung.taste_gravitation;
			}			
			keyCheck();
			
			meinRaumschiff.bewegung(erdanziehung);
		}
		// Zwischen 2 Gravitationswellen muss eine gewisse Zeit vergehen.
		if (meinRaumschiff.gravitationsTimer >= 0){
				meinRaumschiff.gravitationsTimer --;
		}
		
		if (meinRaumschiff.explosionsTimer == -1){
			
			var punkt = meinRaumschiff.istRaumschiffInMauer() ;
			if (punkt != null){
					meinRaumschiff.raumschiffPralltAb(punkt);
					meinRaumschiff.energie -= (Math.abs(meinRaumschiff.v.x) + Math.abs(meinRaumschiff.v.y));
					if (meinRaumschiff.energie < 0){
						explosion();
						meinRaumschiff.punkte -= 4;					
						sendInMauer(meinRaumschiff.spielerID);
					}
					else{
						playTrack("abprallen");
					}
			}
			else if (meinRaumschiff.istMauerEckeInRaumschiff() == true){
				meinRaumschiff.raumschiffPralltVonEckeAb();
				meinRaumschiff.energie -= (Math.abs(meinRaumschiff.v.x) + Math.abs(meinRaumschiff.v.y));
				if (meinRaumschiff.energie < 0){
					explosion();
					meinRaumschiff.punkte -= 4;					
					sendInMauer(meinRaumschiff.spielerID);
				}
				else{
					playTrack("abprallen");
				}
				
			}	

			var gecrahedMit = meinRaumschiff.kollidiertMitRaumschiff(fremdesRaumschiffArray);
			if (gecrahedMit != null){
				explosion();
				meinRaumschiff.punkte -= 5;					
				sendCrash(gecrahedMit);
			}				
			var treffer = meinRaumschiff.istRaumschiffGetroffen();
			if (treffer != null){
				if (treffer.typ == "SCHUSS"){
					explosion();
					sendGetroffen(meinRaumschiff.spielerID + "|" + treffer.spielerID);		
					sendLoescheSchuss(treffer.getSerialisierteSchussDaten());	
					loeschePartikelAusArray(treffer);	
					meinRaumschiff.punkte -= 5;
					if (treffer.spielerID != meinRaumschiff.spielerID){
						var schiffSchuetze = getRaumschiffByID(treffer.spielerID);
						schiffSchuetze.punkte += 20;
						
						log (0, "Ich wurde von " , false);
						log (schiffSchuetze.spielerID, schiffSchuetze.spielername , false);
						log (0, " abgeschossen!" , true);
					}
					else{
						log (0, "Ich wurde von mir selbst abgeschossen - oje !", true);
					}
				}
				else if(treffer.typ == "EXPL"){
					meinRaumschiff.v.x += treffer.v_x / 2;
					meinRaumschiff.v.y += treffer.v_y / 2;
					sendLoescheSchuss(treffer.getSerialisierteSchussDaten());	
					loeschePartikelAusArray(treffer);	
				}
				
				
			}
		}
			var serialString = meinRaumschiff.getSerialisierteDaten();
			sendRaumschiffDaten(serialString);
		if (meinRaumschiff.explosionsTimer == -1){				
			meinRaumschiff.berechneEcken();
		}				


		for (var i = 0 ; i < fremdesRaumschiffArray.length; i++){
			if (fremdesRaumschiffArray[i].datenSindAktuell == 0){
				fremdesRaumschiffArray[i].s.x += fremdesRaumschiffArray[i].v.x;
				fremdesRaumschiffArray[i].s.y += fremdesRaumschiffArray[i].v.y;
				//fremdesRaumschiffArray[i].bewegung();  // Voraussichtliche Bewegung des Fremden Raumschiffs. Seit dem letzten Zeichnen ist keine neue Info zu diesem Raumschiff gekommen.
			}
			fremdesRaumschiffArray[i].berechneEcken();
		}
		verarbeiteObjekte(schuesse);
		verarbeiteObjekte(fremdeSchuesse);
		verarbeiteObjekte(explosionsPartikelArray);
		verarbeiteObjekte(schubPartikelArray);		
	
	}
	/**
	 * Das Raumschiff explodiert
	 */
	function explosion(){
		playTrack("explosion");
		
		for (var zaehl = 0; zaehl < 40; zaehl++){
			var einExplosionsPartikel = new explosionsPartikel();
			einExplosionsPartikel.initialisiereExplosion(meinRaumschiff);
			explosionsPartikelArray.push(einExplosionsPartikel);
			sendExplosionsDaten(einExplosionsPartikel.getSerialisierteSchussDaten());
		}
		meinRaumschiff.explosionsTimer = explosionsPartikelLaenge + 10;
		meinRaumschiff.v.x = 0.0;
		meinRaumschiff.v.y = 0.0;
		
		meinRaumschiff.energie = START_ENERGIE;
		var serialString = meinRaumschiff.getSerialisierteDaten();
	  	sendRaumschiffDaten(serialString);		

	}		
	/**
	 * Um das Raumschiff ensteht eine unheimliche Gravitationswelle, die alle Raumschiffe in der Nähe mit reisst.
	 */
	function gravitationsWelle(){
		playTrack("gravitation");
		for (var zaehl = 0; zaehl < 100; zaehl++){
			var eingravitationsPartikel = new gravitationsPartikel();
			eingravitationsPartikel.initialisiereGravitationsPartikel(meinRaumschiff);
			explosionsPartikelArray.push(eingravitationsPartikel);
			sendGravitationsDaten(eingravitationsPartikel.getSerialisierteSchussDaten());
		}
		meinRaumschiff.gravitationsTimer = GRAVITATIONS_TIMER;

	}		

  	
	/**
	 * Objekte werden bewegt, gezeichnet und am Ende ihres Lebenszyklusses aus globalem Array entfernt 
	 * Ebenfalls geloescht werden Schuesse, wenn Sie gegen eine Mauer treffen
	 */
	function verarbeiteObjekte(objektArray){
		if (objektArray.length > 0){
			for (var i = objektArray.length -1; i >= 0; i--){
				objektArray[i].x += objektArray[i].v_x;
		  	  	if(objektArray[i].x > meinSpiel.map.max_pixel_x){
		  	  		objektArray[i].x -= meinSpiel.map.max_pixel_x;
		  	  	}
		  	  	if(objektArray[i].x < 0){
		  	  		objektArray[i].x += meinSpiel.map.max_pixel_x;
		  	  	}
				objektArray[i].y += objektArray[i].v_y;
		  	  	if(objektArray[i].y > meinSpiel.map.max_pixel_y){
		  	  		objektArray[i].y -= meinSpiel.map.max_pixel_y;
		  	  	}
		  	  	if(objektArray[i].y < 0){
		  	  		objektArray[i].y += meinSpiel.map.max_pixel_y;
		  	  	}

				// Wenn Schuss in Mauer ist, dann loesche ihn
				feldinhalt = getFeldinhaltVonPunkt(objektArray[i].x, objektArray[i].y);
				if(feldinhalt > 0 && feldinhalt < 6){
					objektArray.splice(i, 1);
				}							
				else{
					objektArray[i].lebenszyklen -= 1;
					
					// Loesche Schuss aus globalem Array, wenn er am Ende seines Lebenszyklusses ist.
					if (objektArray[i].lebenszyklen <= 0){
						objektArray.splice(i, 1);
					}
				}
			}
			
		}		
	}


	

	/**
	 * erzeuge Koordinate, die relativ zum eigenen Raumschiff (Schwerpunkt s) liegt.
	 */
	function erzeugeRelativeKoordinate(koord_abs, s){
			
			var x_relativ_view = (koord_abs.x - s.x) * feldgroesse_view_faktor + spielfeldausschnitt_x / 2 - 1;
			var y_relativ_view = (koord_abs.y - s.y) * feldgroesse_view_faktor + spielfeldausschnitt_y / 2 - 1;

			return new koordinate(x_relativ_view, y_relativ_view);
	}

	
	/**
	 * Prueft in welche Richtung der Mouseclick vom TouchkreisMittelpunkt ist
	 * Der Richtungswinkel geht von 0 bis 2*PI, unten ist 0, von dort gehts im Uhrzeigersinn bis zu 2*PI
	 */
	function ermittleBeta(mouse_x, mouse_y){
		var beta = Math.atan(Math.abs((mouse_x- touchKreisMittelpunkt_x ) / (touchKreisMittelpunkt_y - mouse_y))); 
		
		if (mouse_y < touchKreisMittelpunkt_y){
			if (mouse_x < touchKreisMittelpunkt_x){
				beta = Math.PI - beta;
			}
			else {
				beta = Math.PI + beta;
			}
		}
		else{
			if (mouse_x > touchKreisMittelpunkt_x){
				beta = 2*Math.PI - beta;
			}
		}
		return beta;
	}

	function ermittleDrehbewegung(mouse_x, mouse_y){
		 beta = ermittleBeta(mouse_x, mouse_y);
		 
		 var diff = meinRaumschiff.alpha - beta; 
		 // keine Drehung
		 if (Math.abs(diff) < drehwinkel_beschleunigung){
			
			taste_links = 0;
			taste_rechts = 0;
			drehwinkel_aktuell = 0;
			return;
		 }
		 // Linksdrehung
		 if (diff < -Math.PI){ 
			taste_links = 1;
			taste_rechts = 0;				
		 }	
		// Rechtsdrehung			 
		 else if (diff < 0){
			taste_links = 0;
			taste_rechts = 1;
		 }
		 // Linksdrehung
		 else if (diff < Math.PI){
			taste_links = 1;
			taste_rechts = 0;	
		 }
		// Rechtsdrehung			 
		 else {
			taste_links = 0;
			taste_rechts = 1;
		 }
		 
	}

	function ermittleSchub(mouse_x, mouse_y){
		var entfernung_zum_mittelpunkt = Math.sqrt(Math.pow(touchKreisMittelpunkt_y - mouse_y, 2) + Math.pow(mouse_x - touchKreisMittelpunkt_x, 2))
		if (entfernung_zum_mittelpunkt > touchKreisRadius){
			taste_schub = 1;
		}
		else{
			taste_schub = 0;
		}
	}	

	// liefert die Entfernung zwischen den beiden Punkten (x1,y1) und (x2, y2)
	function getEntfernung(x1, y1, x2, y2){
		return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x1 - x2, 2))	
	}
	
	
	function ueberpruefeTouchundMouseClick(x, y){
				// Wenn der Mouse oder Touch -Click in der Naehe des Touch-Steuerkreises ist
				if (getEntfernung(x, y, touchKreisMittelpunkt_x, touchKreisMittelpunkt_y) < 3*touchKreisRadius){
					ermittleDrehbewegung(x, y);
					ermittleSchub(x, y);
					touchInButtonNaehe = true;
				}
				
				// Wenn der Mouse oder Touch -Click in der Naehe des Feuerknopfes ist
				if (getEntfernung(x, y, feuerKnopfMittelpunkt_x, feuerKnopfMittelpunkt_y) < 1.5*actionKnopfRadius){
					if(taste_schuss == 0){
							taste_schuss = 1;
					}
					touchInButtonNaehe = true;
				}
				if (getEntfernung(x, y, homeBaseKnopfMittelpunkt_x, homeBaseKnopfMittelpunkt_y) < 1.5*actionKnopfRadius){
					if(taste_home == 0){
							taste_home = 1;
					}
					touchInButtonNaehe = true;
				}
				if (getEntfernung(x, y, gravitationsKnopfMittelpunkt_x, gravitationsKnopfMittelpunkt_y) < 1.5*actionKnopfRadius){
					if(taste_gravitation == 0){
							taste_gravitation = 1;
					}
					touchInButtonNaehe = true;
				}				
	}				
	function keyCheck()
	{
		if (touch_down){
			var i, len = global_touches.length;
			touchInButtonNaehe = false;
			for (i=0; i<len; i++) {				
				var touch = global_touches[i];				
				ueberpruefeTouchundMouseClick(touch.pageX, touch.pageY);
			}
		}
		if (mouse_down){			
			ueberpruefeTouchundMouseClick(global_mouse_x, global_mouse_y);
		}	
		if (taste_links == 1){
				drehwinkel_aktuell -= drehwinkel_beschleunigung;
				if (drehwinkel_aktuell < -drehwinkel_max){
					drehwinkel_aktuell = -drehwinkel_max;
				}
				
				meinRaumschiff.dreheRaumschiff(drehwinkel_aktuell);
		}
		if (taste_rechts == 1){
				drehwinkel_aktuell += drehwinkel_beschleunigung;
				if (drehwinkel_aktuell > drehwinkel_max){
					drehwinkel_aktuell = drehwinkel_max;
				}			
				meinRaumschiff.dreheRaumschiff(drehwinkel_aktuell);
		}

	
		if (taste_schub == 1){
				////playTrack("schub");
			  	meinRaumschiff.addGeschwindigkeit(schub);						  	
				var einSchubPartikel = new schubPartikel();
				einSchubPartikel.initialisiereSchub(meinRaumschiff);
				schubPartikelArray.push(einSchubPartikel);
				sendSchubDaten(einSchubPartikel.getSerialisierteSchussDaten());
		}
		else{
			//pauseTrack();
		}
		if (taste_schuss == 1){
			if (schuesse.length <=  max_anzahl_schuesse){		
				var einSchuss = new schuss();
				playTrack("schuss");
				
				einSchuss.initialisiere(meinRaumschiff);
				schuesse.push(einSchuss);
				// Jetzt wird der Schuss an den Server gesendet, damit dieser ihn an aller uebrigen clients 
				// verschicken kann.
				sendSchussDaten(einSchuss.getSerialisierteSchussDaten());
				
				taste_schuss = 2;
			}
		}
		if (taste_home == 1){
				taste_home = 0;
				meinRaumschiff.basisWechsel();
		}		
		if (taste_gravitation == 1){
				taste_gravitation = 0;
				if (meinRaumschiff.gravitationsTimer == -1){
					gravitationsWelle();
				}			
		}		
		
		


	}	

	function tastegedrueckt(characterCode)
	{

	   switch(characterCode)
	   {

			case 32:
			case 71:
			case 103:
					if(taste_schuss == 0){
							taste_schuss = 1;
					}
					break;
			case 72:  // Taste H
					taste_home = 1;
	     			break; 
			case 37:
			case 89:
			case 65:
			case 121:
			case 97:
	      
					taste_links = 1;
					break; 
			case 39:
			case 88:
			case 68:
			case 100:
			case 120:
	      
					taste_rechts = 1;
					break;
			case 38:
			case 86:
			case 87:
			case 118:
			case 119:
					if (taste_schub == 1) {
						schub += schub_add;
						if (schub > schub_max) {
							schub = schub_max;
						} 
					}
					taste_schub = 1; 
					break;
			case 74:  // Taste J (Geheimtaste)
					taste_gravitation = 1;
					break;
			case 84:  // Taste T Untergrundfarbe der Gegener anzeigen (Geheimtaste)
					if (untergrund_anzeigen == true){
						untergrund_anzeigen = false;
					}
					else{
						untergrund_anzeigen = true;
					}
					
					break;
			/***		
			case 27:  // escape --> Menue offnen
					$( "#popupNested" ).popup( "open" ); 
					break;
					***/
				
			case 13:  // Enter - Chatfenster oeffnen
					//$( "#popupMessage" ).popup( "open" ); 
					oeffneChatFenster();
					break;		
					
			/***					
			case 74:  // Taste J (Geheimtaste)
					if (sternenstaub == true){
						sternenstaub = false;
					} else{
						sternenstaub = true;
					}
					break;							
			***/		
	      default:
					break;
	   }
	}		
	
	function tastelosgelassen(characterCode)
	{
	   switch(characterCode)
	   {
			case 32:
			case 71:
			case 103:
		 			taste_schuss = 0;
					break; 
			case 72:  // Taste H
					taste_home = 0;
					break;	      
			case 37:
			case 89:
			case 65:
			case 97:
			case 121:
		 			taste_links = 0;
					drehwinkel_aktuell = 0;
					break; 
			case 39:
			case 88:
			case 68:
			case 100:
			case 120:
					taste_rechts = 0;
					drehwinkel_aktuell = 0;
					break;
			case 38:
			case 86:
			case 87:
			case 118:
			case 119:
					taste_schub = 0;
					schub = schub_start; 
					break;
				
			case 74:  // Taste J (Geheimtaste fuer Gravitationswelle)
					taste_gravitation = 0;
					break;
	     default:
					break;
	   }
	}
	function dialogTastegedrueckt(e)
	{

	   switch(e.which)
	   {
			case 13:  // Enter 
					e.preventDefault();
					var okButton = document.getElementById("nick_ok");
					okButton.click();
					break;	
		}					
	}
	function getFeldinhaltVonPunkt(x, y){
		try {
			var spielfeld_x = Math.round(x/feldgroesse + 0.5);
			var spielfeld_y = Math.round(y/feldgroesse + 0.5);
			
			if (spielfeld_x < 0){
				spielfeld_x += meinSpiel.map.spielfeldbreite;
			}			
			if (spielfeld_x >= meinSpiel.map.spielfeldbreite){
				spielfeld_x -= meinSpiel.map.spielfeldbreite;
			}			
			if (spielfeld_y < 0){
				spielfeld_y += meinSpiel.map.spielfeldhoehe;
			}			
			if (spielfeld_y >= meinSpiel.map.spielfeldhoehe){
				spielfeld_y -= meinSpiel.map.spielfeldhoehe;
			}			
				

			var feldinhalt = meinSpiel.map.spielfeld[spielfeld_x][spielfeld_y];
			
			// bei feldinhalt = 0 (Leer) oder 1(Quadrat) oder 6(Basis) ist keine spezielle Abfrage innerhalb des Feldes noetig
			if (feldinhalt == 0 || feldinhalt == 1 || feldinhalt == 6){
				return feldinhalt;
			}
			
			
			
			var x_diff = x/feldgroesse - spielfeld_x; // x-Abstand zwischen Punkt x und x-Koordinate des Mauerfeldes, in dem sich der Punkt (x,y) befindet
			var y_diff = y/feldgroesse - spielfeld_y; // y-Abstand zwischen Punkt y und y-Koordinate des Mauerfeldes, in dem sich der Punkt (x,y) befindet
			if (x_diff > 1) {
				x_diff -= meinSpiel.map.spielfeldbreite;
			}
			if (x_diff < -1) {
				x_diff += meinSpiel.map.spielfeldbreite;
			}
			if (y_diff > 1) {
				y_diff -= meinSpiel.map.spielfeldhoehe;
			}
			if (y_diff < -1) {
				y_diff += meinSpiel.map.spielfeldhoehe;
			}
			switch (feldinhalt){
		
					case 2: // Dreieck mit rechtem Winkel oben rechts
									if (x_diff >= y_diff){
										return feldinhalt;	
									}
									else{
										return 0; // Punkt befindet sich im freien Dreieck unten links
									}
									break;
					case 3: // Dreieck mit rechtem Winkel unten rechts
																
									if ( x_diff  + y_diff >= -1){	
										return feldinhalt;	
									}
									else{
										return 0; // Punkt befindet sich im freien Dreieck oben links
									}
									break;
					case 4: // Dreieck mit rechtem Winkel unten links
									if (x_diff <= y_diff){
										return feldinhalt;	
									}
									else{
										return 0; // Punkt befindet sich im freien Dreieck oben rechts
									}
									break;							
					case 5: // Dreieck mit rechtem Winkel oben links
									if ( x_diff  + y_diff <= -1){	
										return feldinhalt;	
									}
									else{
										return 0; // Punkt befindet sich im freien Dreieck unten rechts
									}
									break;
									
					default: 
								  return feldinhalt; 
			}
		}
		catch(e){
			console.info(e);
		}

		
	}
	/**
	 * Liefert aus dem Array fremdesRaumschiffArray das Raumschiff mit dem zugehoerigen spielerID.
	 */
	function getRaumschiffByID(spielerID){	
		if (spielerID == meinRaumschiff.spielerID){
			return 	meinRaumschiff;
		}
		else{
			for (var i = 0 ; i < fremdesRaumschiffArray.length; i++){
				if (fremdesRaumschiffArray[i].spielerID == spielerID){
					return fremdesRaumschiffArray[i];
				}
			}
		}
	}
	function entferneFremdesRaumschiff(spielerID){
		for (var i = 0 ; i < fremdesRaumschiffArray.length; i++){
			if (fremdesRaumschiffArray[i].spielerID == spielerID){
				fremdesRaumschiffArray.splice(i,1);  // Raumschiff aus Array entfernen
				return;
			}
		}
	}		


	function loeschePartikelAusArray(partikel){
		for (var i = fremdeSchuesse.length -1; i >= 0; i--){
			if (fremdeSchuesse[i].spielerID == partikel.spielerID &&
				fremdeSchuesse[i].ID == partikel.ID ){
					fremdeSchuesse.splice(i, 1);
					return;
			}
			
		}
		for (var i = schuesse.length -1; i >= 0; i--){
			if (schuesse[i].spielerID == partikel.spielerID &&
				schuesse[i].ID == partikel.ID ){
					schuesse.splice(i, 1);
					return;
			}
			
		}	
		for (var i = explosionsPartikelArray.length -1; i >= 0; i--){
			if (explosionsPartikelArray[i].spielerID == partikel.spielerID &&
				explosionsPartikelArray[i].ID == partikel.ID ){
					explosionsPartikelArray.splice(i, 1);
					return;
			}
			
		}	
	}	
	
	/**
	 * Log-Listen-Eintraege loeschen, wenn sie ein bestimmtes Alter erreicht haben
	 */
	function bereinigeLogListe(){
		for (var i=log_liste.length-1; i >= 0; i--){
			log_liste[i][3] = log_liste[i][3] - 1;
			// Log Eintrag wird geloescht, wenn sein Zaehler auf 0 ist.
			if (log_liste[i][3] < 1){
				log_liste.splice(i, 1);
			}
		}	
	}
	function zeichneTextMitRand(context, text, schriftfarbe, x, y){
				context.fillStyle = "rgb(255, 255, 255)";
				context.fillText(text, x - 1, y);
				context.fillText(text, x + 1, y);
				context.fillText(text, x, y + 1);
				context.fillText(text, x, y - 1);
				context.fillStyle =  schriftfarbe;			
				context.fillText(text, x, y);
	}
 
	function sternenKanone(){
			var anzahl_sterne = 2; //Math.round(Math.random()*3);
			for (var i = 0; i < anzahl_sterne; i++){
				var einSchuss = new schuss();
				var stern_speed = Math.round(Math.random()*6) + 6;
				var zufallsWinkel = Math.random() * Math.PI * 2;

				einSchuss.spielerID = meineID;
				einSchuss.lebenszyklen = (12-stern_speed)*50;
				einSchuss.typ = "SCHUSS";
				einSchuss.x = Math.cos(zufallsWinkel)*100;
				einSchuss.y = Math.sin(zufallsWinkel)*100;
				
				einSchuss.v_x = Math.cos(zufallsWinkel) * stern_speed;
				einSchuss.v_y = Math.sin(zufallsWinkel) * stern_speed;	
		
				schuesse.push(einSchuss);

			}		
	}


	 
	