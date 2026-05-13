	
function createServerConnection(){

	log (0, 'Connecting...', true);

	Server = new FancyWebSocket('ws://' + ipAdresse + ':9300');
	//Server = new FancyWebSocket('udp://' + ipAdresse + ':9300');


	//Let the user know we're connected
	Server.bind('open', function() {
		log (0, "Connected." , true);
		serverConnection = true;
	});
	

	//OH NOES! Disconnection occurred.
	Server.bind('close', function( data ) {
		log (0, "Disconnected.", true );
		serverConnection = false;
	});

	//Log any messages sent from server
	Server.bind('message', function( payload ) {
		var datenArray = payload.split("|");
		
		switch (datenArray[0]) {
			case "STATUS":   // Der Server sendet den Status aller clients auf einmal. Damit ist auch klar, dass alle clients den letzten Schleifendurchlauf beendet haben
						uebernehmeStatusDaten(datenArray.slice(1));
						statusVomServerErhalten = true;  // Damit kann in der gameLoop der naechste Durchlauf gestartet werden
						
						break;


			case "MAP":	
						var eine_karte = new karte( datenArray, feldgroesse);
	    					map_liste.push(eine_karte);
				    		break;
			case "SPIELERLISTE":   //  SPIELERLISTE|id|name|spiel_ID|home_x|home_y
			
						currentBasenArray = new Array();
						
						var i = 1;
						while(i < datenArray.length){		
							var neueBasis = new basis(datenArray[i], datenArray[i+1], datenArray[i+2], datenArray[i+3], datenArray[i+4]);
							currentBasenArray.push(neueBasis);
							
							i+=5;
						}
						if (meinSpiel.spiel_id == "0"){
							erzeugefremdeSpielerAusBasen();
						}
			
						
					    break;
			 case "SPIEL_BEITRETEN":
					        var neueBasis = new basis(datenArray[1], datenArray[2], datenArray[3], datenArray[4], datenArray[5]);
					        erzeugeFremdenSpieler(neueBasis);
						break;	
			 case "DISCONNECT":
			 case "SPIEL_VERLASSEN":
			 			var spielerIDDisconnected = datenArray[1];
			 			log (spielerIDDisconnected, getRaumschiffByID(spielerIDDisconnected).spielername, false);
						log (0, " hat das Spiel verlassen.", true);
			 			entferneSpielerAusSpiel(spielerIDDisconnected);
			 			break;
			 case "BASIS_WECHSEL":
			 			var spielerIDBasisGewechselt = datenArray[1];
			 			meinSpiel.setBasisLeer(spielerIDBasisGewechselt);
			 			var neueBasis = new basis(spielerIDBasisGewechselt, datenArray[2], datenArray[3], datenArray[4], datenArray[5]);			 			
			 			meinSpiel.weiseBasisZu(neueBasis);
		 			
			 			break;
			 case "CLIENT_ID":
						
			 			meineID = datenArray[1];
						meinRaumschiff = new raumschiff(new basis(meineID, meinName, "0", 0, 0), $( "#red" ).val().toString(), $( "#green" ).val().toString(), $( "#blue" ).val().toString(), meinTyp );
						sendNeuerSpieler();
			 			break;
			 case "CURRENT_SPIEL_LISTE":
						currentSpielListe = new Array();
						var i = 1;
						while(i < datenArray.length){
							if (datenArray[i] != "0"){  // "0" = Menue
								{
									 var neues_spiel = new spiel(datenArray[i], getMapByName(datenArray[i+1]));
									 currentSpielListe.push(neues_spiel);
								}
							}
							i+=2;
						}	
						// Wenn sich der Spieler nicht in einem Spiel befindet (spiel_id = 0), dann soll das Menue aufgebaut werden.
						if (meinSpiel == null || meinSpiel.spiel_id == "0")
						{
							erzeugeMenue();									
						}
			 			break;
						
			 case "NEUE_SPIEL_ID":   // erhaelt der Spieler vom Server, nachdem er ein neues Spiel erstellt hat
						meinSpiel = new spiel(datenArray[1], getMapByName(datenArray[2]));
						sendSpielBeitreten();
			 			break;			
						
			default:
						break;

		}

	});


	Server.connect();

}
function uebernehmeStatusDaten(statusDaten){
		if (statusDaten[0] != null && statusDaten[1] != null){
			var anzahl_elemente = 0;
			
			switch (statusDaten[0]) {
				case "SCHIFFDATEN":
							try {
								var schiff = getRaumschiffByID(statusDaten[1]);
								schiff.setSerialisierteDaten(statusDaten);				    
								anzahl_elemente = 13;
							}
							catch(err) {
								 console.log(err.message);
							}

							break;
				case "SCHUBDATEN":
							var einSchubPartikel = new schubPartikel();
							einSchubPartikel.setSerialisierteSchussDaten(statusDaten);
							schubPartikelArray.push(einSchubPartikel);
							anzahl_elemente = 10;
								break;
				case "SCHUSSDATEN":
							var fremdSchuss = new schuss();
							fremdSchuss.setSerialisierteSchussDaten(statusDaten);
							fremdeSchuesse.push(fremdSchuss);

							// Die Lautstaerke eines Schusses nimmt im Abstand zum Quadrat ab.
							var lautstaerke = 5*feldgroesse*feldgroesse / meinRaumschiff.getAbstandImQuadrat(fremdSchuss.x, fremdSchuss.y);
							if (lautstaerke > 1) lautstaerke = 1;
							lautstaerke = lautstaerke*grundlautstaerke /10;
							playTrackMitVolume("schuss", lautstaerke);

							anzahl_elemente = 10;
					
								break;
				case "LOESCHE_SCHUSS": 
							var fremdSchuss = new schuss();
							fremdSchuss.setSerialisierteSchussDaten(statusDaten);
							loeschePartikelAusArray(fremdSchuss);
							anzahl_elemente = 10;
							break;
				case "EXPLOSIONSDATEN":
							var explosionsPartikel = new schuss();
							explosionsPartikel.setSerialisierteSchussDaten(statusDaten);
							explosionsPartikelArray.push(explosionsPartikel);

							// Die Lautstaerke einer Explosion nimmt im Abstand zum Quadrat ab.
							var lautstaerke = 5*feldgroesse*feldgroesse / meinRaumschiff.getAbstandImQuadrat(explosionsPartikel.x, explosionsPartikel.y);
							if (lautstaerke > 1) lautstaerke = 1;
							lautstaerke = lautstaerke*grundlautstaerke /10;
							playTrackMitVolume("explosion", lautstaerke);
							
							anzahl_elemente = 10;
							break;
				case "GRAVITATIONSSDATEN":
							var gravitationsPartikel = new schuss();
							gravitationsPartikel.setSerialisierteSchussDaten(statusDaten);
							explosionsPartikelArray.push(gravitationsPartikel);

							// Die Lautstaerke einer Explosion nimmt im Abstand zum Quadrat ab.
							var lautstaerke = 5*feldgroesse*feldgroesse / meinRaumschiff.getAbstandImQuadrat(gravitationsPartikel.x, gravitationsPartikel.y);
							if (lautstaerke > 1) lautstaerke = 1;
							lautstaerke = lautstaerke*grundlautstaerke /10;
							playTrackMitVolume("gravitation", lautstaerke);											
							
							anzahl_elemente = 10;
							break;
								

				case "GETROFFEN":
							var schiffGetroffen = getRaumschiffByID(statusDaten[1]);
							schiffGetroffen.punkte -= 5;
							var schiffSchuetze = getRaumschiffByID(statusDaten[2]);
							schiffSchuetze.punkte += 20;
							//drawCanvasPunktuebersicht();
							
							log (schiffGetroffen.spielerID, schiffGetroffen.spielername, false);
							log (0, " wurde von ", false);
							log (schiffSchuetze.spielerID, schiffSchuetze.spielername , false);
							log (0, " abgeschossen!" , true);
							
							anzahl_elemente = 3;
							break;
				case "INMAUER":
							var schiffInMauer = getRaumschiffByID(statusDaten[1]);
							schiffInMauer.punkte -= 4;
							//drawCanvasPunktuebersicht();
							log (schiffInMauer.spielerID, schiffInMauer.spielername, false);
							log (0, " hat eine Mauer gerammt.", true);
							
							anzahl_elemente = 2;
							break;	
				case "CRASH":
							// Ein anderes Raumschiff hat mein Raumschiff gerammt. Ich explodiere
							var gechrashedMit = statusDaten[1];
							if (meinRaumschiff.spielerID == gechrashedMit){
									explosion();
									meinRaumschiff.punkte -= 5;					
									//drawCanvasPunktuebersicht();
							}			
							anzahl_elemente = 2;
							break;	
				case "MESSAGE":
							log (statusDaten[1], statusDaten[2], true);
							anzahl_elemente = 4;
							break;						
			}
			// Rekursiver Aufruf, da mehrere Status-Informationen eines Clients oder mehrere Status-Informationen mehrerer clients hintereinander uebertragen werden koennen
			if (anzahl_elemente > 0){
				uebernehmeStatusDaten(statusDaten.slice(anzahl_elemente));
			}
		}
}