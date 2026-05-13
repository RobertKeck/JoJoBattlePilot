
	function sendStatus() {
			send( "STATUS|"+status_daten );
			status_daten = ""; // Nach dem Senden muss der globale Status String geleert werden.
	}		
	function sendRaumschiffDaten( text ) {
			//send( "SCHIFFDATEN|"+text );
			status_daten += "SCHIFFDATEN|"+text+"|";
	}
	function sendGetroffen( text ) {
			//send( "GETROFFEN|"+text );
			status_daten += "GETROFFEN|"+text+"|";
	}
	function sendInMauer( text ) {
			//send( "INMAUER|"+text );
			status_daten += "INMAUER|"+text+"|";
	}
	function sendSchussDaten( text ) {
			//send( "SCHUSSDATEN|"+text );
			status_daten += "SCHUSSDATEN|"+text+"|";
	}
	function sendLoescheSchuss(text){
			//send ("LOESCHE_SCHUSS|"+text );
			status_daten += "LOESCHE_SCHUSS|"+text+"|";
	}
	function sendSchubDaten( text ) {
			//send( "SCHUBDATEN|"+text );
			status_daten += "SCHUBDATEN|"+text+"|";
	}

	function sendExplosionsDaten( text ) {
			//send( "EXPLOSIONSDATEN|"+text );
			status_daten += "EXPLOSIONSDATEN|"+text+"|";
	}
	function sendGravitationsDaten( text ) {
			//send( "GRAVITATIONSSDATEN|"+text );
			status_daten += "GRAVITATIONSSDATEN|"+text+"|";
	}	
	function sendCrash( text ) {
			//send( "CRASH|"+text );
			status_daten += "CRASH|"+text+"|";
	}
	function sendMessage( text ) {
			//send( "MESSAGE|"+ meinRaumschiff.spielerID + "|"+meinRaumschiff.spielername+": " + text +"|"+meinRaumschiff.farbe);			
			status_daten += "MESSAGE|"+ meinRaumschiff.spielerID + "|"+meinRaumschiff.spielername+": " + text +"|"+meinRaumschiff.farbe
	}
	function sendBasisWechsel(spielerID, spielername, spiel_id, neueBasis){
			send( "BASIS_WECHSEL|" + spielerID + "|" + spielername + "|" + spiel_id + "|" + neueBasis.getSerialisierteBasisDaten());
	}
	function sendNeuesSpielErstellen(spielerID, mapName){
		hauptmenueSchliessen();
		send( "NEUES_SPIEL_ERSTELLEN|" + spielerID + "|" + mapName);
	}
	function sendSpielBeitreten(){	

		erzeugefremdeSpielerAusBasen();

		freieBasis = meinSpiel.getFreieBasis();					    	
		freieBasis.spielername = meinName;
		freieBasis.spielerID = meineID; 
		meinSpiel.weiseBasisZu(freieBasis);
		meinRaumschiff = new raumschiff(freieBasis, $( "#red" ).val().toString(), $( "#green" ).val().toString(), $( "#blue" ).val().toString(), meinTyp );
		
		meinRaumschiff.positioniereRaumschiffAufBasis();
		


		send("SPIEL_BEITRETEN|" + meineID + "|" + meinName + "|" + meinSpiel.spiel_id + "|" + freieBasis.getSerialisierteBasisDaten());
		var serialString = meinRaumschiff.getSerialisierteDaten();
		sendRaumschiffDaten(serialString);
		sendStatus();
		
		hauptmenueSchliessen();
		schuesse = new Array();
		zeichneGesamtHintergrund(meinSpiel.map);
		zeichneGesamtMauer(meinSpiel.map);
		/************/	
		starteSpiel();
		/************/	
		canvasInitialisierung();	

	}

	function sendSpielVerlassen(spielerID, spiel_id){	
		send("SPIEL_VERLASSEN|" + spielerID + "|" + spiel_id);	
	}

	/**
	 * Wenn ein neuer Spieler im Spiel ist und er bereits eine ClientID zugewiesen bekommen hat, sendet er seine Daten an alle.
	 */
	function sendNeuerSpieler(){
		send("NEUER_SPIELER|" + meineID + "|" + meinName);	
	}

	function send( text ) {
			if (typeof(Server) != 'undefined'){
				if (Server.conn.readyState != 0){
					Server.send( 'message', text );
				}
			}
	}

