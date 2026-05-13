	/* globale Konstanten */	
	var maxZoomgroesse = 200;
	var minZoomgroesse = 25;
	var DEAD = -1000;
	var grundlautstaerke = 3;
	var autopilotOnOff = 0; // 0 = off, 1 = on
	var logtext_right = 20;  // 20 Pixel vom rechten Rand
	
	var red_raumschiff = 0;
	var green_raumschiff	= 0;
	var blue_raumschiff = 0;
	
	var helligkeit = red_raumschiff + green_raumschiff + blue_raumschiff;
	while (helligkeit < 150 ){
		red_raumschiff = Math.round(Math.random()*256);
		green_raumschiff	= Math.round(Math.random()*256);
		blue_raumschiff = Math.round(Math.random()*256);
		helligkeit = red_raumschiff + green_raumschiff + blue_raumschiff;
	}

	var red_hintergrund = Math.round(Math.random()*256);
	var green_hintergrund = Math.round(Math.random()*256);
	var blue_hintergrund = Math.round(Math.random()*256);

	var red_mauer = Math.round(Math.random()*256);
	var green_mauer = Math.round(Math.random()*256);
	var blue_mauer = Math.round(Math.random()*256);
	var statusVomServerErhalten = true; // Wenn alle clients ihren Status an den Server gesendet haben, sendet dieser den Gesamtstatus an alle clients
	
	var EPSILON = 0.000001;
	var GRAVITATIONS_TIMER = 300; // Zeit die vergehen muss zwischen 2 Gravitationswellen-Schuessen

	var speed_faktor = 1;
	var drehwinkel_max = 0.26179/ speed_faktor; //0.31415926;// 0.22439947; //0.31415926; //0.62831852; //0.31415926 / speed_faktor; // 0.23 / speed_faktor;   /* Winkel, um den sich das Raumschiff pro Tastendruck dreht */
	var drehwinkel_beschleunigung = drehwinkel_max/2;  // drehwinkel_max/2;
	var drehwinkel_aktuell = 0;
	var SCHUSSWINKEL = 0.5; // ungefaehr 28 ° = Winkel (zwischen eigenerRaumschiffrichtung und der Richtung zu einem Fremdraumschiff), ab dem der Autopilot anfaengt zu schiessen 
	
	var schub_add = 0.02 / speed_faktor; /* Beschleunigungszuwachs bei anhaltendem Tastendruck */
	var schub_start = 0.5 / speed_faktor;
	var schub_max = 1 / speed_faktor	;
	var schub = schub_start; /* Geschwindigkeitszuwachs pro Tastendruck */
	var v_max = 25 / speed_faktor; /* maximale Geschwindigkeit */
	var erdanziehung = 0.00; //0.00; 0.02; 
	
	var feldgroesse = 45;  // Pixel - Hoehe und Breite eines Feldes vom Spielfeld
	var feldgroesse_view = feldgroesse;  // wenn ge-zoomz wird, dann passiert die Anzeige mit diesem Wert. Die Berechnungen passieren nach wie vor mit feldgroesse.
	var feldgroesse_view_faktor = feldgroesse_view / feldgroesse;
	var max_anzahl_schuesse = 8;
	var schuss_speed = 10 / speed_faktor; // intiale Schussgeschwindigkeit (Dazu wird noch die Raumschiffgeschwindigkeit addiert. 
	var schubpartikel_speed = 3 / speed_faktor;
	var explosionsPartikelSpeed = 8 / speed_faktor; 
	var GRAVITATIONSPARTIKEL_SPEED = 8/ speed_faktor; 
	var p = 2; // = Anzahl Pixel eines im Radar dargestellten Punktes
	var explosionsPartikelLaenge = 100;
	var GRAVITATIONSPARTIKEL_LEBENSDAUER = 100;
	var TIMEOUT = 40; // = 1000 / Anzahl fps
	//var fps = 25; // Frame per second  
	var SCHUSS_LEBENSZYKLEN = 300;
	var START_ENERGIE = 40; // maximale Energie, mit der das Schiffschild aufgeladen werden kann
	var MAX_KULANZ_WINKEL = 0.2; // Maximaler Winkel des Raumschiffbodens zu einer Mauer, in der das Raumschiff bei niedriger Geschwindigkeit abprallen kann, anstatt zu explodieren.
	var MAX_SPEED_QUADRAT_ABPRALL = 128/ speed_faktor; // 64 // Maximale Geschwindigkeit, bei der ein Raumschiff noch an einer Mauer zureuckprallen kann, ohne zu explodieren
	var breiteSteuerungsFeld = 60;
	var hoeheSteuerungsFeld = 40;	
	var abstandSteurungsFeldVomRand = 20;		
	
	var sternenstaub = false; // Wenn true, dann ist im Menue eine Sternenkanone aktiviert  (Mit Taste 'J' an/ab-schaltbar
	var schriftgroesse = 15; // schriftgroesse der Ueberschrift joJoBattlepilot
	
	/**********************/
	/* globale Variablen  */
	/**********************/
	var Server;
	var serverConnection = false;

	var gameLoopNummer;
	var pausenZeit = 0;
	var startZeit = 0;
	
    /**
	 *   status_daten
     *	 Am Ende einer GameLoop werden saemtliche Status-Daten auf einmal an den Server gesendet:
     *	 SCHIFFDATEN, GETROFFEN, INMAUER, SCHUSSDATEN, LOESCHE_SCHUSS, SCHUBDATEN, EXPLOSIONSDATEN, GRAVITATIONSSDATEN, CRASH, gameLoopId
	 *   Damit weiss der Server auch, dass der Client seinen akutellen GameLoop-Durchlauf beendet hat.
	 */
	var status_daten = ""; 
	
	var map ; // der aktuelle Spielplan
	var vorschau_map; // Die Karte, die ein Spieler im Hauptmenue auswaehlt, und die im Radar angezeigt wird.
	var meinSpiel = new spiel("0", ""); // das aktuelle Spiel des clients
	var map_liste = new Array();
	
	var log_liste = new Array();  // (text, farbe, newLine, log_dauer ) 
	var MAX_LOG_EINTRAEGE = 20;
	var LOG_DAUER_INITIAL = 1000; // Initialer Zaehler, der bei jeder Ausgabe eines Log-Eintrages heruntergezaehlt wird. Ist er 0, dann wird der Log-Eintrag geloescht.
	
    var HINTERGRUNDBILD =  "hintergrundbilder/0702_sternenhimmel2_k.jpg"; 
    var MAUERBILD =  "hintergrundbilder/kaviar3.jpg"; 
	var imgHintergrund = new Image();

	var mauerart = "Future";
	/****
	 * Folgende Abfrage ist nicht mehr noetig, da der Bug im Chrome behoben wurde:
	if (navigator.vendor == "Google Inc."){
		mauerart = "Klassisch"; // Wegen eines Chrome-Bugs bei save / restore, da bei Chrome zur Zeit voreingestellt ist, dass "Beschleunigtes 2D-Canvas" aktiv ist, dass heisst die GPU wird verwendet, die aber kein save und restore kann, siehe Funktion zeichneMauerfeldAusHintergrundbild
	}
	****/
	var hintergrund = "Sternenhimmel";
	
	
	var imgMauer = new Image();
	
	
	var alleRaumschiffBilder = [];
	var alleClassicRaumschiffTypen = new Array("classic_SHIP1", "classic_SHIP2", "classic_SHIP3", "classic_SHIP4", "classic_SHIP5");
	var alleRaumschiffTypen = new Array("Raumschiff2", "Raumschiff3", "Raumschiff4", "Raumschiff5", "banshee6", "broodlord2", "drohne6", "kreuzer16", "phoenics5", "tempiest5", "viking4", "viper5");
	var meinTyp = alleRaumschiffTypen[Math.round(Math.random()*(alleRaumschiffTypen.length))]; // Die classischen Typen sollen nicht zufaellig ausgewaehlt werden

	
	var global_mouse_x ;  // letzte mouse - Position
	var global_mouse_y ;  // letzte mouse - Position
	
	var global_touches; // saemtliche Touch - Events - der Benutzer kann an mehreren Stellen den Bildschirm gleichzeitig beruehren (Schuss, Steuerung,..)
	
	var buffers = new Array();
	var drawingBuffer = 0;

	var currentSpielListe = new Array(); // Liste aller aktuell offenen Spiele
	var currentBasenArray = new Array(); // Liste aller Spieler (id|name|spiel_ID)
	var spielfeldausschnitt_x; /* Wird durch canvas.width - groesse bestimmt */
	var spielfeldausschnitt_y; /* Wird durch canvas.heigth - groesse bestimmt */
	var globalePartikelID = 1;

	var taste_links = 0;  /* 0 sei losgelassen, 1 sei gedrueckt */
	var taste_rechts = 0;  /* 0 sei losgelassen, 1 sei gedrueckt */
	var taste_schub = 0;  /* 0 sei losgelassen, 1 sei gedrueckt */
	var taste_schuss = 0;  /* 0 sei losgelassen, 1 sei gedrueckt */
	var taste_home = 0;  /* 0 sei losgelassen, 1 sei gedrueckt */
	var taste_gravitation = 0; 
	var untergrund_anzeigen = false;

	
	var schuesse = new Array();
	var schubPartikelArray = new Array();
	var fremdeSchuesse = new Array();
	var explosionsPartikelArray = new Array();
	
	// Array aller fremden Raumschiffe. Beim Anmelden erhaelt man vom Server eine Liste aller fremdRaumschiffe.
	// Wenn sich zu einem spaeterem Zeitpunkt jemand anmeldet, bekommt man bei dessen Anmeldung dessen Raumschiffdaten.
	var fremdesRaumschiffArray = new Array();  
	
	var untergrundfarbe = "rgb(0, 0, 0)"; //"rgb(255, 255, 231)"; //"rgb(200, 200, 200)";//"rgb(255, 240, 255)";
	var mauerfarbe = "rgb(100, 180, 224)"; //"rgb(100, 180, 107)";//"rgb(100, 100, 200)";//"rgb(0, 0, 200)";
	
	var leereBasis = new basis(" ", " ", "0", 0, 0);
	
	var dummyRaumschiff = new raumschiff(leereBasis, "0", "0", "0", "SHIP3" );
	
	var meinRaumschiff = dummyRaumschiff;
	
	var standard_schriftfarbe = "rgb(0, 0, 0)";
	
	
	var anz_pixel_y_um_Karte = 0;
	var anz_pixel_x_um_Karte = 0;
	var imageHintergrund_breite_abgeschnitten = 0;
	var imageHintergrund_hoehe_abgeschnitten  = 0;
	var imageMauer_breite_abgeschnitten = 0;
	var imageMauer_hoehe_abgeschnitten  = 0;
	
	var js_bild_breite_aktuell = 2000;
	var js_bild_hoehe_aktuell = 2000;
	var meinName;
	var meineID;
	
	var touchKreisRadius = 50;
	var touchKreisEntfernungVomRand = 100;
	var touchKreisMittelpunkt_x = touchKreisEntfernungVomRand; // spielfeldausschnitt_x/2;
	var touchKreisMittelpunkt_y = spielfeldausschnitt_y - touchKreisEntfernungVomRand; //spielfeldausschnitt_y/2;

	var radarKreisRadius = 50;
	var radarKreisRadius_maximum_aktuell = 50;
	var radarKreisMittelpunkt_x = spielfeldausschnitt_x - radarKreisRadius;
	var radarKreisMittelpunkt_y = spielfeldausschnitt_y - radarKreisRadius;
	var radarRandFarbe = "rgb(255, 255, 255)";	

	
	var actionKnopfRadius = 20;
	var feuerKnopfMittelpunkt_x; // = spielfeldausschnitt_x - 3 * actionKnopfRadius;
	var feuerKnopfMittelpunkt_y; // = spielfeldausschnitt_y - 3 * actionKnopfRadius;
	
	var homeBaseKnopfMittelpunkt_x; // = spielfeldausschnitt_x - 3  * actionKnopfRadius;
	var homeBaseKnopfMittelpunkt_y; //  = spielfeldausschnitt_y - 9  * actionKnopfRadius;	

	var gravitationsKnopfMittelpunkt_x; //  = spielfeldausschnitt_x - 9  * actionKnopfRadius;
	var gravitationsKnopfMittelpunkt_y; //  = spielfeldausschnitt_y - 3  * actionKnopfRadius;	
	
	var mouse_down = false;
	var touch_down = false; // wenn mindestens 1 Finger den Bildschirm beruehrt, ist touch_down = true
	
	// Einzelne Geraeusche innerhalb der mp3-Datei jojoBattlePilot_gesamtSound.mp3
	var tracks = {
	  schuss: {
		from: 0, to: 1.934
	  },
	  explosion: {
		from: 1.935, to: 4.861
	  },
	  gravitation: {
		from: 4.862, to: 11.053
	  },
	  abprallen: {
		from: 11.054, to: 11.366
	  },
	  schub: {
		from: 11.367, to: 21.266
	  },
	  schub_xwing: {
		from: 21.267, to: 23.355
	  }  
	};
	var soundSpriteTimeout;
	var touchInButtonNaehe = false;
	var timeOutID;
