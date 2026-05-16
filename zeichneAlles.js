	function zeichneAlles(canvas, context_neu){
		verschiebeRaumschiffCanvas();	
		var canvas = document.getElementById('canvas_Spielfeld');
		if(canvas.getContext){
			var context_neu = canvas.getContext('2d');
			
			spielfeldausschnitt_x = canvas.width;
			if (spielfeldausschnitt_x > meinSpiel.map.max_pixel_x){
				spielfeldausschnitt_x = meinSpiel.map.max_pixel_x;
			}
			spielfeldausschnitt_y = canvas.height;
			if (spielfeldausschnitt_y > meinSpiel.map.max_pixel_y){
				spielfeldausschnitt_y = meinSpiel.map.max_pixel_y;
			}
			if (hintergrund == "Klassisch")
			{
				context_neu.fillStyle = untergrundfarbe;
				context_neu.fillRect(0, 0, spielfeldausschnitt_x , spielfeldausschnitt_y);
			}
			touchKreisMittelpunkt_x = touchKreisEntfernungVomRand; 
			touchKreisMittelpunkt_y = spielfeldausschnitt_y - touchKreisEntfernungVomRand; 

			feuerKnopfMittelpunkt_x = spielfeldausschnitt_x - 2 * actionKnopfRadius;
			feuerKnopfMittelpunkt_y = spielfeldausschnitt_y - 2 * actionKnopfRadius;
			
			homeBaseKnopfMittelpunkt_x = spielfeldausschnitt_x - 2  * actionKnopfRadius;
			homeBaseKnopfMittelpunkt_y = spielfeldausschnitt_y - 7  * actionKnopfRadius;	

			gravitationsKnopfMittelpunkt_x = spielfeldausschnitt_x - 7  * actionKnopfRadius;
			gravitationsKnopfMittelpunkt_y = spielfeldausschnitt_y - 2  * actionKnopfRadius;


			if (hintergrund != "Klassisch"){
				zeichneAusschnittHintergrund(context_neu, meinRaumschiff);
			}
			zeichnePunktObjekte(context_neu, schuesse);
			zeichnePunktObjekte(context_neu, fremdeSchuesse);
			zeichnePunktObjekte(context_neu, explosionsPartikelArray);
			zeichnePunktObjekte(context_neu, schubPartikelArray);					
							
			zeichneAusschnittMauern(context_neu, meinRaumschiff, canvas);
	
			zeichneHomeBaseNamen(context_neu);

			
			
	
			drawCanvasPunktuebersicht(context_neu, canvas.width, radarKreisRadius*p);
			drawCanvasRadar(meinSpiel.map);
			drawLog(context_neu, canvas.width, meinSpiel.map.spielfeldhoehe*p);
			bereinigeLogListe();
			
			
			
			if (meinRaumschiff.explosionsTimer == -1){
				meinRaumschiff.zeichneZentriert(context_neu, meinRaumschiff.s.x + spielfeldausschnitt_x / 2, meinRaumschiff.s.y + spielfeldausschnitt_y / 2);
			}
			zeichneFremdraumschiffe(context_neu);
			
			zeichneSteuerungsFeld(context_neu);
			zeichneFeuerKnopf(context_neu);	
			zeichneGravitationsKnopf(context_neu);					
			zeichneHomeBaseKnopf(context_neu);	
		}
		
	}
	/**
	 * Alle Canvase der Raumschiffe werden ausserhalb des Sichtbereiches gelegt. Erst bei Bedarf werden sie an die richtige Stelle positioniert
     */
	function verschiebeRaumschiffCanvas(){
		// Move all canvases with ids starting with 'canvas_Raumschiff_' out of the viewport.
		// Use querySelectorAll when available; fallback to numeric ids for older browsers.
		if (document.querySelectorAll){
			var nodes = document.querySelectorAll('[id^="canvas_Raumschiff_"]');
			for (var i = 0; i < nodes.length; i++){
				var canvasRaumschiff = nodes[i];
				if (!canvasRaumschiff || !canvasRaumschiff.style) continue;
				canvasRaumschiff.style.position = 'absolute';
				canvasRaumschiff.style.left = '-9999px';
				canvasRaumschiff.style.top = '-9999px';
			}
		}
		else{
			for (var raumschiffNr = 1; raumschiffNr < 20; raumschiffNr++){
				var canvasRaumschiff = document.getElementById("canvas_Raumschiff_"+raumschiffNr);
				if (!canvasRaumschiff || !canvasRaumschiff.style) continue;
				canvasRaumschiff.style.position = 'absolute';
				canvasRaumschiff.style.left = '-9999px';
				canvasRaumschiff.style.top = '-9999px';
			}
		}
	}
	function zeichneFremdraumschiffe(context_neu){
			
			for (var i = 0 ; i < fremdesRaumschiffArray.length; i++){
				// Fremde Raumschiffe werden nur gezeichnet, wenn sie nicht gerade am Explodieren sind
				if (fremdesRaumschiffArray[i].explosionsTimer == -1){
					fremdesRaumschiffArray[i].zeichneRelativ(context_neu, meinRaumschiff.s, i+2);
					fremdesRaumschiffArray[i].datenSindAktuell = 0;
				}
			}
	}
	

	function drawCanvasRadar(aMap){		
		 var objCanvasRadar = document.getElementById('canvas_Radar');
		 var objCanvasRadarGesamt = document.getElementById("canvas_radar_gesamt");
		 
		if (aMap.spielfeldhoehe > aMap.spielfeldbreite){
			radarKreisRadius = aMap.spielfeldbreite / 2;
		}			
		else{
			radarKreisRadius = aMap.spielfeldhoehe / 2;		
		}
		  
		//	Das radarKreisRadius_maximum_aktuell kann im Menue geaendert werden. Fuer Mobil-Geraete ist es initial kleiner eingestellt.
		if (radarKreisRadius_maximum_aktuell < radarKreisRadius){
			radarKreisRadius = radarKreisRadius_maximum_aktuell;
		}
		var radarKreisRadiusGesamt = radarKreisRadius * p; // Mit pixeldicke p multipliziert
		// Falls das Objekt unterstützt wird
		if(objCanvasRadar.getContext){
			objCanvasRadar.width = 2*radarKreisRadiusGesamt; //aMap.spielfeldbreite*p;		
			objCanvasRadar.height = 2*radarKreisRadiusGesamt;//aMap.spielfeldhoehe*p;		
			
      		var objContextRadar = objCanvasRadar.getContext('2d');
	
			var x_von = Math.round(meinRaumschiff.s.x / feldgroesse + 0.5) - radarKreisRadius;
			var y_von = Math.round(meinRaumschiff.s.y / feldgroesse + 0.5) - radarKreisRadius;

			objContextRadar.beginPath();
			objContextRadar.arc(radarKreisRadiusGesamt,radarKreisRadiusGesamt, radarKreisRadiusGesamt, 0, Math.PI*2,true); // you can use any shape
			objContextRadar.closePath();
			objContextRadar.stroke();	
			objContextRadar.clip();    
			objContextRadar.drawImage(objCanvasRadarGesamt, p * (x_von + aMap.spielfeldbreite), p * (y_von + aMap.spielfeldhoehe), 2*radarKreisRadiusGesamt, 2*radarKreisRadiusGesamt, 0, 0, 2*radarKreisRadiusGesamt, 2*radarKreisRadiusGesamt);
				
			
			objContextRadar.beginPath();
			objContextRadar.strokeStyle = radarRandFarbe;	
			objContextRadar.arc(radarKreisRadiusGesamt, radarKreisRadiusGesamt, radarKreisRadiusGesamt, 0, 2 * Math.PI);
			objContextRadar.closePath();
			objContextRadar.stroke();				
			
			objContextRadar.beginPath();
			objContextRadar.strokeStyle = radarRandFarbe;		
			objContextRadar.arc(radarKreisRadiusGesamt, radarKreisRadiusGesamt, radarKreisRadiusGesamt - 1, 0, 2 * Math.PI);
			objContextRadar.closePath();
			objContextRadar.stroke();			

			objContextRadar.beginPath();
			objContextRadar.strokeStyle = radarRandFarbe;	
			objContextRadar.arc(radarKreisRadiusGesamt, radarKreisRadiusGesamt, radarKreisRadiusGesamt-2, 0, 2 * Math.PI);
			objContextRadar.closePath();
			objContextRadar.stroke();	

			objContextRadar.beginPath();
			objContextRadar.strokeStyle = radarRandFarbe;	
			objContextRadar.arc(radarKreisRadiusGesamt, radarKreisRadiusGesamt, radarKreisRadiusGesamt-3, 0, 2 * Math.PI);
			objContextRadar.closePath();
			objContextRadar.stroke();	

			
	  	}
		
		// Eigenes Raumschiff in die Mitte des Radars zeichnen
		objContextRadar.fillStyle = meinRaumschiff.farbe;
		objContextRadar.fillRect(radarKreisRadiusGesamt - p, radarKreisRadiusGesamt -p, 2*p, 2*p);
		
		// Zeichne die fremden Raumschiffe in die Radarkarte
		for (var i = 0 ; i < fremdesRaumschiffArray.length; i++){
			if (fremdesRaumschiffArray[i].explosionsTimer == -1){
				objContextRadar.fillStyle = fremdesRaumschiffArray[i].farbe;

				var x_relativ = fremdesRaumschiffArray[i].s.x / feldgroesse - Math.round(meinRaumschiff.s.x / feldgroesse + 0.5) +  radarKreisRadius +1;
				var y_relativ = fremdesRaumschiffArray[i].s.y / feldgroesse - Math.round(meinRaumschiff.s.y / feldgroesse + 0.5) +  radarKreisRadius +1;

							
				if(x_relativ > aMap.spielfeldbreite){
					x_relativ -= aMap.spielfeldbreite;
					}
					if(x_relativ < 0){
						x_relativ += aMap.spielfeldbreite;
					}
		
					if(y_relativ > aMap.spielfeldhoehe){
						y_relativ -= aMap.spielfeldhoehe;
					}
					if(y_relativ < 0){
						y_relativ += aMap.spielfeldhoehe;
					}

				objContextRadar.fillRect(p * x_relativ - p, p * y_relativ - p, 2 * p, 2 * p);
			}
		}
  	}
	function drawCanvasRadarOhneRaumschiffe(aMap){		
		 var objCanvasRadar = document.getElementById('canvas_Radar');
		 var objCanvasRadarGesamt = document.getElementById("canvas_radar_gesamt");
		 
		if (aMap.spielfeldhoehe > aMap.spielfeldbreite){
			radarKreisRadius = aMap.spielfeldbreite;
		}			
		else{
			radarKreisRadius = aMap.spielfeldhoehe;		
		}		 
		 
		// Falls das Objekt unterstützt wird
		if(objCanvasRadar.getContext){
			objCanvasRadar.width = radarKreisRadius* p; 	
			objCanvasRadar.height = radarKreisRadius*p;		

      		var objContextRadar = objCanvasRadar.getContext('2d');

			var x_von = Math.round((0 - aMap.max_pixel_x / 2) / feldgroesse + 0.5);
			var y_von = Math.round((0 - aMap.max_pixel_y / 2) / feldgroesse + 0.5);
			    
			objContextRadar.beginPath();
			objContextRadar.arc(radarKreisRadius,radarKreisRadius, radarKreisRadius, 0, Math.PI*2,true); // you can use any shape
			objContextRadar.closePath();
			objContextRadar.stroke();	
			objContextRadar.clip();    	    
			objContextRadar.drawImage(objCanvasRadarGesamt, p * (x_von + aMap.spielfeldbreite), p * (y_von + aMap.spielfeldhoehe), p*aMap.spielfeldbreite, p*aMap.spielfeldhoehe, 0, 0, p*aMap.spielfeldbreite, p*aMap.spielfeldhoehe);
		
			objContextRadar.beginPath();
			objContextRadar.strokeStyle = radarRandFarbe;	
			objContextRadar.arc(radarKreisRadius, radarKreisRadius, radarKreisRadius, 0, 2 * Math.PI);
			objContextRadar.closePath();
			objContextRadar.stroke();				
			
			objContextRadar.beginPath();
			objContextRadar.strokeStyle = radarRandFarbe;	
			objContextRadar.arc(radarKreisRadius, radarKreisRadius, radarKreisRadius - 1, 0, 2 * Math.PI);
			objContextRadar.closePath();
			objContextRadar.stroke();			

			objContextRadar.beginPath();
			objContextRadar.strokeStyle = radarRandFarbe;		
			objContextRadar.arc(radarKreisRadius, radarKreisRadius, radarKreisRadius-2, 0, 2 * Math.PI);
			objContextRadar.closePath();
			objContextRadar.stroke();	

			objContextRadar.beginPath();
			objContextRadar.strokeStyle = radarRandFarbe;	
			objContextRadar.arc(radarKreisRadius, radarKreisRadius, radarKreisRadius-3, 0, 2 * Math.PI);
			objContextRadar.closePath();
			objContextRadar.stroke();				
			}
		
  	}  	

	
	
	// Das Spielfeld wird 9 mal gezeichnet, damit man von jedem Punkt aus dem  Mittelteil einen Viewport der ganzen Karte nehmen kann.  	
  	function drawRadarGesamt(aMap){
  		var objCanvasRadarGesamt = document.getElementById("canvas_radar_gesamt");
  		if(objCanvasRadarGesamt.getContext){
      			var objContextRadarGesamt = objCanvasRadarGesamt.getContext('2d');
      			// Untergrund fuellen
      			objContextRadarGesamt.fillStyle = untergrundfarbe;
			objContextRadarGesamt.fillRect(0, 0, p*3*aMap.spielfeldbreite , p*3*aMap.spielfeldhoehe);

			objContextRadarGesamt.fillStyle = mauerfarbe;
			
      			for (var x = 0; x < aMap.spielfeldbreite;  x++){
      				for (var y = 0; y < aMap.spielfeldhoehe;  y++){
      					if (aMap.spielfeld[x][y] != 0 && aMap.spielfeld[x][y] != 6){
	      					objContextRadarGesamt.fillRect(p*x, p*y, p, p);
	      					objContextRadarGesamt.fillRect(p*(x+ aMap.spielfeldbreite), p*y, p, p);
	      					objContextRadarGesamt.fillRect(p*(x+ 2*aMap.spielfeldbreite), p*y, p, p);
	
	      					objContextRadarGesamt.fillRect(p*x, p*(y + aMap.spielfeldhoehe), p, p);
	      					objContextRadarGesamt.fillRect(p*(x+ aMap.spielfeldbreite), p*(y + aMap.spielfeldhoehe), p, p);
	      					objContextRadarGesamt.fillRect(p*(x+ 2*aMap.spielfeldbreite), p*(y + aMap.spielfeldhoehe), p, p);
	
	      					objContextRadarGesamt.fillRect(p*x, p*(y + 2*aMap.spielfeldhoehe), p, p);
	      					objContextRadarGesamt.fillRect(p*(x+ aMap.spielfeldbreite), p*(y + 2*aMap.spielfeldhoehe), p, p);
	      					objContextRadarGesamt.fillRect(p*(x+ 2*aMap.spielfeldbreite), p*(y + 2*aMap.spielfeldhoehe), p, p);
	      				}
      				}
      			}
      				
  		}
  	}
	
	
	function zeichnePunktObjekte(context_neu, objektArray){
		if (objektArray.length > 0){
			for (var i = objektArray.length -1; i >= 0; i--){
				zeichneSchuss(objektArray[i].x, objektArray[i].y, objektArray[i].farbe, context_neu, objektArray[i].typ, objektArray[i].zweitfarbe);
			}
		}
	}		

 	function zeichneSteuerungsFeld(context){
				// 2 Kreise unten links fuer Touch-Steuerung
				context.beginPath();
				context.strokeStyle = "rgb(127, 127, 127)";	
				context.arc(touchKreisMittelpunkt_x, touchKreisMittelpunkt_y, 3, 0, 2 * Math.PI);
				context.closePath();
				context.stroke();
				context.beginPath();
				context.arc(touchKreisMittelpunkt_x, touchKreisMittelpunkt_y, touchKreisRadius, 0, 2 * Math.PI);
				context.closePath();
				context.stroke();
				
				zeichneStrichInRichtungAlpha(context);
						
 	}
	function zeichneStrichInRichtungAlpha(context){
	
			context.fillStyle = "rgb(0, 0, 0)";
			context.beginPath();
			context.moveTo(touchKreisMittelpunkt_x, touchKreisMittelpunkt_y);
			context.lineTo(touchKreisMittelpunkt_x + Math.cos(meinRaumschiff.alpha + Math.PI/2)*touchKreisRadius, touchKreisMittelpunkt_y + Math.sin(meinRaumschiff.alpha + Math.PI/2)*touchKreisRadius);
			context.fill();
	
			context.strokeStyle = "rgb(127, 127, 127)";	
			context.stroke();
		
	
	}

	 function zeichneFeuerKnopf(context){
				context.strokeStyle = "rgb(255, 0, 0)";	
 				context.beginPath();
				context.arc(feuerKnopfMittelpunkt_x, feuerKnopfMittelpunkt_y, actionKnopfRadius, 0, 2 * Math.PI);
				if (taste_schuss == 2 ){
					context.fillStyle = "rgb(255,0,0)";
				}				
				else{
					context.fillStyle = "#7F7F7F";
				}
				context.fill();
				context.closePath();
				
 				context.beginPath();
				context.arc(feuerKnopfMittelpunkt_x, feuerKnopfMittelpunkt_y, 0.6*actionKnopfRadius, 0, 2 * Math.PI);							
				context.closePath();
				context.stroke();
					

 				context.beginPath();
				context.arc(feuerKnopfMittelpunkt_x, feuerKnopfMittelpunkt_y, actionKnopfRadius/4, 0, 2 * Math.PI);		
				context.closePath();				
				context.stroke();
				
				
 				context.beginPath();
				context.moveTo(feuerKnopfMittelpunkt_x, feuerKnopfMittelpunkt_y + actionKnopfRadius);	
				context.lineTo(feuerKnopfMittelpunkt_x, feuerKnopfMittelpunkt_y - actionKnopfRadius);	
				context.closePath();				
				context.stroke();
				
				
 				context.beginPath();
				context.moveTo(feuerKnopfMittelpunkt_x + actionKnopfRadius, feuerKnopfMittelpunkt_y);	
				context.lineTo(feuerKnopfMittelpunkt_x - actionKnopfRadius, feuerKnopfMittelpunkt_y);						
				context.closePath();
				context.stroke();
	
	 }
	 function zeichneGravitationsKnopf(context){
 				context.beginPath();
				context.arc(gravitationsKnopfMittelpunkt_x, gravitationsKnopfMittelpunkt_y, actionKnopfRadius, 0, 2 * Math.PI);
				context.fillStyle = "rgb(0, 0, 255)";				
				context.fill();
				context.closePath();

 				context.beginPath();
				context.fillStyle = "rgb(50, 50, 255)";	
				context.arc(gravitationsKnopfMittelpunkt_x, gravitationsKnopfMittelpunkt_y, 3*actionKnopfRadius/4, 0, 2 * Math.PI);
				context.fill();
				context.closePath();

 				context.beginPath();
				context.fillStyle = "rgb(100, 100, 255)";	
				context.arc(gravitationsKnopfMittelpunkt_x, gravitationsKnopfMittelpunkt_y, actionKnopfRadius/2, 0, 2 * Math.PI);
				context.fill();
				context.closePath();
				
 				context.beginPath();
				context.fillStyle = "rgb(150, 150, 255)";	
				context.arc(gravitationsKnopfMittelpunkt_x, gravitationsKnopfMittelpunkt_y, actionKnopfRadius/4, 0, 2 * Math.PI);
				context.fill();
				context.closePath();
				
				if (meinRaumschiff.gravitationsTimer != -1 ){
					context.beginPath();
					context.arc(gravitationsKnopfMittelpunkt_x, gravitationsKnopfMittelpunkt_y, actionKnopfRadius, 0, 2 * Math.PI  * (meinRaumschiff.gravitationsTimer / GRAVITATIONS_TIMER));
					context.lineTo(gravitationsKnopfMittelpunkt_x, gravitationsKnopfMittelpunkt_y);
					context.fillStyle = "rgb(255,0,0)";

					context.fill();
					context.closePath();	
				}				
		
	
	 }
	 function zeichneHomeBaseKnopf(context){
	 
 				context.beginPath();
				context.arc(homeBaseKnopfMittelpunkt_x, homeBaseKnopfMittelpunkt_y, actionKnopfRadius, 0, 2 * Math.PI);
				if (taste_home == 1 ){
					context.fillStyle = "rgb(255,0,0)";
				}				
				else{
					context.fillStyle = "#7F7F7F";
				}
				context.fill();
				context.closePath();

				
				context.fillStyle = "rgb(255,90,90)";
				context.strokeStyle = "rgb(255,0,0)";
				context.beginPath();
				context.moveTo(homeBaseKnopfMittelpunkt_x, homeBaseKnopfMittelpunkt_y - 0.6*actionKnopfRadius);	
				context.lineTo(homeBaseKnopfMittelpunkt_x + 0.4*actionKnopfRadius, homeBaseKnopfMittelpunkt_y - 0.1*actionKnopfRadius);			
				context.lineTo(homeBaseKnopfMittelpunkt_x + 0.4*actionKnopfRadius, homeBaseKnopfMittelpunkt_y + 0.5*actionKnopfRadius);				
				context.lineTo(homeBaseKnopfMittelpunkt_x - 0.4*actionKnopfRadius, homeBaseKnopfMittelpunkt_y + 0.5*actionKnopfRadius);				
				context.lineTo(homeBaseKnopfMittelpunkt_x - 0.4*actionKnopfRadius, homeBaseKnopfMittelpunkt_y - 0.1*actionKnopfRadius);	
				context.lineTo(homeBaseKnopfMittelpunkt_x, homeBaseKnopfMittelpunkt_y - 0.6*actionKnopfRadius);	
				
				context.moveTo(homeBaseKnopfMittelpunkt_x + 0.4*actionKnopfRadius, homeBaseKnopfMittelpunkt_y - 0.1*actionKnopfRadius);	
				context.lineTo(homeBaseKnopfMittelpunkt_x - 0.4*actionKnopfRadius, homeBaseKnopfMittelpunkt_y - 0.1*actionKnopfRadius);	
				
				context.fill();
				context.stroke();
				context.closePath();				
				
	 }
	function zeichneSchuss(schuss_x, schuss_y, farbe, context, typ, zweitfarbe){
		var relativeKoordinate = erzeugeRelativeKoordinate(new koordinate(schuss_x, schuss_y), meinRaumschiff.s);
		
		if(relativeKoordinate.x > meinSpiel.map.max_pixel_x* feldgroesse_view_faktor){
			relativeKoordinate.x -= meinSpiel.map.max_pixel_x* feldgroesse_view_faktor;
		}
		if(relativeKoordinate.x < 0){
			relativeKoordinate.x += meinSpiel.map.max_pixel_x* feldgroesse_view_faktor;
		}

		if(relativeKoordinate.y > meinSpiel.map.max_pixel_y* feldgroesse_view_faktor){
			relativeKoordinate.y -= meinSpiel.map.max_pixel_y* feldgroesse_view_faktor;
		}
		if(relativeKoordinate.y < 0){
			relativeKoordinate.y += meinSpiel.map.max_pixel_y* feldgroesse_view_faktor;
		}	
			

		if (typ == "SCHUSS"){		   
			context.fillStyle = zweitfarbe;
			context.fillRect(relativeKoordinate.x, (relativeKoordinate.y -1), 3, 5);
			context.fillRect((relativeKoordinate.x -1),relativeKoordinate.y , 5, 3);			
		}
		context.fillStyle = farbe;	
		context.fillRect(relativeKoordinate.x,	relativeKoordinate.y , 3, 3);
	}	

	function zeichneAusschnittHintergrund(context, schiff){
		var canvas_gesamtBild = document.getElementById('canvas_SpielfeldGesamt');


		var x_von = ((feldgroesse_view_faktor*schiff.s.x) % imageHintergrund_breite_abgeschnitten) ; 

		var y_von = ((feldgroesse_view_faktor*schiff.s.y) % imageHintergrund_hoehe_abgeschnitten)  ; 

		
		context.drawImage(canvas_gesamtBild, x_von , y_von, spielfeldausschnitt_x, spielfeldausschnitt_y, 0, 0, spielfeldausschnitt_x, spielfeldausschnitt_y);
	}	
	function zeichneAusschnittMauern(context, schiff, canvas){
		var canvas_gesamtMauer = document.getElementById('canvas_MauerGesamt');

		var x_von = Math.round((schiff.s.x / feldgroesse - spielfeldausschnitt_x / (2*feldgroesse_view))  + 0.5);
		var x_bis = Math.round((schiff.s.x / feldgroesse + spielfeldausschnitt_x / (2*feldgroesse_view))  + 0.5);
		var y_von = Math.round((schiff.s.y / feldgroesse - spielfeldausschnitt_y / (2*feldgroesse_view))  + 0.5);
		var y_bis = Math.round((schiff.s.y / feldgroesse + spielfeldausschnitt_y / (2*feldgroesse_view))  + 0.5);

		
		for (var i = x_von  ; i <= x_bis; i++){
			var i_neu = i;
			if (i < 0){
				i_neu += meinSpiel.map.spielfeldbreite;
				
			}
			if (i >= meinSpiel.map.spielfeldbreite){
				i_neu -= meinSpiel.map.spielfeldbreite;
			}
			var x_koordinate = (i-1) * feldgroesse_view + spielfeldausschnitt_x / 2 - schiff.s.x * feldgroesse_view_faktor;
			
			
			
			for (var j = y_von; j <= y_bis; j++){
				var j_neu = j;
				if (j < 0){
					j_neu += meinSpiel.map.spielfeldhoehe;
				}
				if (j >= meinSpiel.map.spielfeldhoehe){
					j_neu -= meinSpiel.map.spielfeldhoehe;
				}
				
				var y_koordinate = (j-1) * feldgroesse_view  + spielfeldausschnitt_y / 2 - schiff.s.y * feldgroesse_view_faktor;
				

				if (mauerart == "Klassisch"){
					zeichneMauerfeldKlassisch(context, i_neu, j_neu, x_koordinate, y_koordinate);
				}
				else{
					zeichneMauerfeldAusHintergrundbild(context, canvas_gesamtMauer, i_neu , j_neu, x_koordinate, y_koordinate, canvas);
				}
			}
		}
	}
	function zeichneMauerfeldKlassisch(context, i_neu, j_neu, x_koordinate, y_koordinate){
		context.fillStyle = mauerfarbe;				
		context.strokeStyle = "rgb(0, 0, 0)";
		context.lineWidth = 1;
		switch (meinSpiel.map.spielfeld[i_neu][j_neu]){
			case 1: 
				context.beginPath();						
				context.moveTo(x_koordinate, y_koordinate);
				context.lineTo(x_koordinate + feldgroesse_view, y_koordinate);
				context.lineTo(x_koordinate + feldgroesse_view, y_koordinate + feldgroesse_view);
				context.lineTo(x_koordinate, y_koordinate + feldgroesse_view);
				context.lineTo(x_koordinate, y_koordinate);						
				context.fill();	
				context.stroke();	
				context.closePath();
				break;
				
			case 2:
				context.beginPath();
				context.moveTo(x_koordinate, y_koordinate);
				context.lineTo(x_koordinate + feldgroesse_view, y_koordinate);
				context.lineTo(x_koordinate + feldgroesse_view, y_koordinate + feldgroesse_view);
				context.lineTo(x_koordinate, y_koordinate);
				context.fill();
				context.stroke();
				context.closePath();
				break;
			case 3: 
				context.beginPath();						
				context.moveTo(x_koordinate + feldgroesse_view, y_koordinate);
				context.lineTo(x_koordinate + feldgroesse_view, y_koordinate + feldgroesse_view);
				context.lineTo(x_koordinate, y_koordinate + feldgroesse_view);
				context.lineTo(x_koordinate + feldgroesse_view, y_koordinate);
				context.fill();
				context.stroke();
				context.closePath();
				break;
			case 4: 
				context.beginPath();
				context.moveTo(x_koordinate, y_koordinate);
				context.lineTo(x_koordinate + feldgroesse_view, y_koordinate + feldgroesse_view);
				context.lineTo(x_koordinate, y_koordinate + feldgroesse_view);
				context.lineTo(x_koordinate, y_koordinate);
				context.fill();
				context.stroke();
				context.closePath();
				break;
			case 5: 
				context.beginPath();
				context.moveTo(x_koordinate, y_koordinate);
				context.lineTo(x_koordinate + feldgroesse_view, y_koordinate);
				context.lineTo(x_koordinate, y_koordinate + feldgroesse_view);
				context.lineTo(x_koordinate, y_koordinate);						
				context.fill();
				context.stroke();
				context.closePath();
				break;						
			case 6: 
				
				context.beginPath();
				context.strokeStyle = "rgb(255, 0, 0)";
				// Kreis um eine Basis
				context.arc(x_koordinate + feldgroesse_view/2, y_koordinate + feldgroesse_view/2, feldgroesse_view/2, 0, Math.PI*2, false);
				context.closePath();
				context.stroke();
								
				break;
			default: 	
				if(hintergrund == "Klassisch"){
					if (i_neu/3 == Math.round(i_neu/3 ) && j_neu/3 == Math.round(j_neu/3 )){
						zeichneHintergrundPunkt(context, x_koordinate + feldgroesse_view/2, y_koordinate + feldgroesse_view/2);
					}					
				}
				
				break;
		}
	}	
	function zeichneMauerfeldAusHintergrundbild(context, canvas_gesamtMauer, i_neu, j_neu, x_koordinate, y_koordinate, canvas){
					//context.strokeStyle = "rgb(1, 1, 1, 0)";
					feldgroesse_view_erweitert = feldgroesse_view + 1; 
					
					switch (meinSpiel.map.spielfeld[i_neu][j_neu]){
					
						case 1: 
							zeichneMauerfeld(context, canvas_gesamtMauer, i_neu, j_neu, x_koordinate, y_koordinate);
							
							break;
							
						case 2:
							context.beginPath();
							context.moveTo(x_koordinate, y_koordinate);
							context.lineTo(x_koordinate + feldgroesse_view_erweitert, y_koordinate);
							context.lineTo(x_koordinate + feldgroesse_view_erweitert, y_koordinate + feldgroesse_view_erweitert);
							context.lineTo(x_koordinate, y_koordinate);
							context.closePath();
							//context.stroke();	
							
							context.save();
							context.clip();
							zeichneMauerfeld(context, canvas_gesamtMauer, i_neu, j_neu, x_koordinate, y_koordinate);
							context.restore();	
							
							break;
							
						case 3: 
							context.beginPath();						
							context.moveTo(x_koordinate + feldgroesse_view_erweitert, y_koordinate);
							context.lineTo(x_koordinate + feldgroesse_view_erweitert, y_koordinate + feldgroesse_view_erweitert);
							context.lineTo(x_koordinate, y_koordinate + feldgroesse_view_erweitert);
							context.lineTo(x_koordinate + feldgroesse_view_erweitert, y_koordinate);
							context.closePath();
							//context.stroke();	
							
							context.save();
							context.clip();
							zeichneMauerfeld(context, canvas_gesamtMauer, i_neu, j_neu, x_koordinate, y_koordinate);
							context.restore();	
							
							break;
						case 4: 
							context.beginPath();
							context.moveTo(x_koordinate, y_koordinate);
							context.lineTo(x_koordinate + feldgroesse_view_erweitert, y_koordinate + feldgroesse_view_erweitert);
							context.lineTo(x_koordinate, y_koordinate + feldgroesse_view_erweitert);
							context.lineTo(x_koordinate, y_koordinate);
							context.closePath();
							//context.stroke();	
							
							context.save();
							context.clip();
							zeichneMauerfeld(context, canvas_gesamtMauer, i_neu, j_neu, x_koordinate, y_koordinate);
							context.restore();	
							
							break;
						case 5: 
							context.beginPath();
							context.moveTo(x_koordinate, y_koordinate);
							context.lineTo(x_koordinate + feldgroesse_view_erweitert, y_koordinate);
							context.lineTo(x_koordinate, y_koordinate + feldgroesse_view_erweitert);
							context.lineTo(x_koordinate, y_koordinate);						
							context.closePath();
							//context.stroke();	
							
							context.save();
							context.clip();
							zeichneMauerfeld(context, canvas_gesamtMauer, i_neu, j_neu, x_koordinate, y_koordinate);
							context.restore();	
							
							break;		
							
						case 6: 
							
							context.beginPath();
							context.strokeStyle = "rgb(255, 0, 0)";
							// Kreis um eine Basis
							context.arc(x_koordinate + feldgroesse_view/2, y_koordinate + feldgroesse_view/2, feldgroesse_view/2, 0, Math.PI*2, false);
							context.closePath();
							context.stroke();	
												
							break;
						default: 	
							if(hintergrund == "Klassisch"){
								if (i_neu/3 == Math.round(i_neu/3 ) && j_neu/3 == Math.round(j_neu/3 )){
									zeichneHintergrundPunkt(context, x_koordinate + feldgroesse_view/2, y_koordinate + feldgroesse_view/2);
								}					
							}
							break;
					}	
									
	}					
	
    function zeichneMauerfeld(context, canvas_gesamtMauer, i_neu, j_neu, x_koordinate, y_koordinate){
				context.drawImage(canvas_gesamtMauer, Math.round((i_neu) * (feldgroesse_view) ) % imageMauer_breite_abgeschnitten, ((j_neu) * (feldgroesse_view))% imageMauer_hoehe_abgeschnitten, feldgroesse_view+1, feldgroesse_view+1, x_koordinate, y_koordinate, feldgroesse_view+1, feldgroesse_view+1);  
				
	}
	function zeichneHomeBaseNamen(context){
			for (var i = 0 ; i < meinSpiel.basen.length; i++){
				if (	meinSpiel.basen[i].spielerID != "unbesetzt"){
					
					
					
					//context.fillStyle = "rgb(200, 100, 100)";
					var relativeKoordinate = erzeugeRelativeKoordinate(new koordinate(meinSpiel.basen[i].koordinate.x *feldgroesse,
										 meinSpiel.basen[i].koordinate.y *feldgroesse), meinRaumschiff.s);
					if(relativeKoordinate.x > meinSpiel.map.max_pixel_x* feldgroesse_view_faktor){
						relativeKoordinate.x -= meinSpiel.map.max_pixel_x* feldgroesse_view_faktor;
					}
					if(relativeKoordinate.x < 0){
						relativeKoordinate.x += meinSpiel.map.max_pixel_x* feldgroesse_view_faktor;
					}

					if(relativeKoordinate.y > meinSpiel.map.max_pixel_y* feldgroesse_view_faktor){
						relativeKoordinate.y -= meinSpiel.map.max_pixel_y* feldgroesse_view_faktor;
					}
					if(relativeKoordinate.y < 0){
						relativeKoordinate.y += meinSpiel.map.max_pixel_y* feldgroesse_view_faktor;
					}	
	
					zeichneTextMitRand(context, meinSpiel.basen[i].spielername + "'s Home", "rgb(200, 100, 100)", relativeKoordinate.x - (meinSpiel.basen[i].spielername.length * 3 +40) *feldgroesse_view_faktor , relativeKoordinate.y + 15*feldgroesse_view_faktor);			
				}
			}		
		
	}
	/**
	 * Alle drei Felder wird ein Hintergrundpunkt gezeichnet, vorausgesetzt es ist ein leeres Feld
	 */
	function zeichneHintergrundPunkt(context, punkt_x, punkt_y){
			context.fillStyle = "rgb(80, 80, 80)";
			context.fillRect(punkt_x, punkt_y, 2, 2);
	}

	function drawCanvasPunktuebersicht(contextPunkte, breite, radarhoehe){
		contextPunkte.font = 'bold 15px sans-serif';
		contextPunkte.textAlign = "right";  

		var texthoehe = 50;
		
		
		zeichneTextMitRand(contextPunkte, meinRaumschiff.spielername, meinRaumschiff.farbe, breite -100 - 2*radarhoehe, texthoehe);
		zeichneTextMitRand(contextPunkte, meinRaumschiff.punkte, meinRaumschiff.farbe, breite  - 30 - 2*radarhoehe, texthoehe);
			
		
		texthoehe += 25;	
		for (var i = 0 ; i < fremdesRaumschiffArray.length; i++){
			var farbe = fremdesRaumschiffArray[i].farbe;
			if (untergrund_anzeigen){
				farbe = fremdesRaumschiffArray[i].untergrundFarbe
			}
			zeichneTextMitRand(contextPunkte, fremdesRaumschiffArray[i].spielername, farbe, breite -100 - 2*radarhoehe, texthoehe);
			zeichneTextMitRand(contextPunkte, fremdesRaumschiffArray[i].punkte, farbe, breite  - 30 - 2*radarhoehe, texthoehe);

			texthoehe +=25;
		}
	}	
	function drawCanvasSpielerImMenue(contextPunkte, breite, radarhoehe){
		contextPunkte.font = 'bold 15px sans-serif';
		contextPunkte.textAlign = "right";  

		var texthoehe = radarhoehe + 50
		
		
		zeichneTextMitRand(contextPunkte, meinRaumschiff.spielername, meinRaumschiff.farbe, breite - logtext_right, texthoehe);
			
		
		texthoehe += 25;	
		for (var i = 0 ; i < fremdesRaumschiffArray.length; i++){
		
			zeichneTextMitRand(contextPunkte, fremdesRaumschiffArray[i].spielername, fremdesRaumschiffArray[i].farbe, breite - logtext_right, texthoehe);

			texthoehe +=25;
		}
	}		
	/**
	 * Das gesamte log-Array wird auf der linken Bildschirmseite ausgegeben.
	 */
	function drawLog(context, breite, radarhoehe) {
	
		context.textAlign = "left";  
		context.font = 'bold 15px sans-serif';

		var letzte_schriftBreite = 0;
		var schriftfarbe;

		var texthoehe = 100;

		for (i=0; i < log_liste.length; i++){

			schriftfarbe = standard_schriftfarbe;
			
			if (log_liste[i][1] != 0){
				var einRaumschiff = getRaumschiffByID(log_liste[i][1]);
				if (typeof einRaumschiff != 'undefined'){
					schriftfarbe = einRaumschiff.farbe;
				}
			}
			
			zeichneTextMitRand(context, log_liste[i][0], schriftfarbe , letzte_schriftBreite + 20, texthoehe);
			
			if (log_liste[i][2] == true){
				texthoehe += 25;
				letzte_schriftBreite = 0;
			}
			else{
				letzte_schriftBreite += context.measureText(log_liste[i][0]).width + 2;
			}

		}
	}	
 /**
   * Wenn man sich im Hauptmenue befindet, wird ein leeres Canvas als Hintergrund gezeichnet, und darauf die Spieler, die sich im Menue befinden, sowie den Chat-Log des Menues
   */
	function drawCanvasLeer(){
		verschiebeRaumschiffCanvas();
		var canvas = document.getElementById('canvas_Spielfeld');
		if(canvas.getContext){
			var context = canvas.getContext('2d');
			var context_neu = context;
			spielfeldausschnitt_x = canvas.width;
			if (spielfeldausschnitt_x > meinSpiel.map.max_pixel_x){
				spielfeldausschnitt_x = meinSpiel.map.max_pixel_x;
			}
			spielfeldausschnitt_y = canvas.height;
			if (spielfeldausschnitt_y > meinSpiel.map.max_pixel_y){
				spielfeldausschnitt_y = meinSpiel.map.max_pixel_y;
			}
			//canvas.width = canvas.width; // Clears the canvas
			//context_neu.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
			context_neu.fillStyle = untergrundfarbe;
			context_neu.fillRect(0, 0, spielfeldausschnitt_x , spielfeldausschnitt_y);
			
			if (typeof meinRaumschiff != 'undefined'){
				if (sternenstaub == true){
					sternenKanone();
				}
				verarbeiteObjekte(schuesse);
				
			}

			if (hintergrund != "Klassisch"){
				zeichneAusschnittHintergrund(context_neu, meinRaumschiff);
			}
			zeichneAusschnittMauern(context_neu, meinRaumschiff, canvas);
			if (typeof(vorschau_map) != "undefined" && vorschau_map != null){
				drawCanvasSpielerImMenue(context_neu, canvas.width, vorschau_map.spielfeldhoehe*p);
				drawLog(context_neu, canvas.width, vorschau_map.spielfeldhoehe*p);
			}
			drawJoJoBattlePilotSchriftzug(context_neu, canvas);
			context = context_neu;
			
		}
		var serialString = meinRaumschiff.getSerialisierteDaten();
		sendRaumschiffDaten(serialString);

		if (meinSpiel.spiel_id == "0"){
			window.setTimeout(drawCanvasLeer, TIMEOUT);
		}
		else{
			canvas.width = canvas.width; // clear Canvas
		}
	


	}
	function drawJoJoBattlePilotSchriftzug(context, canvas){
		context.textAlign = "center";  
		schriftgroesse+= 5;
		if (schriftgroesse > 1200){
			schriftgroesse = 1;
		}
		var schriftgroesse_final = schriftgroesse;
		if (schriftgroesse_final > canvas.width / 10){
			schriftgroesse_final = canvas.width / 10;
		}
		
		context.font = 'bold ' + schriftgroesse_final + 'px sans-serif';	
		zeichneTextMitRand(context, "JoJoBattlePilot", meinRaumschiff.farbe, canvas.width / 2, canvas.height - schriftgroesse_final / 2);
	}
	function zeichneGesamtHintergrund(aMap){	
		var canvasHintergrundGesamt = document.getElementById('canvas_SpielfeldGesamt');
	    var context = canvasHintergrundGesamt.getContext('2d');

		imgHintergrund.src = HINTERGRUNDBILD;
		imgHintergrund.onload = function(){
			var image_breite = imgHintergrund.naturalWidth ;
			var image_hoehe = imgHintergrund.naturalHeight ;		    

			// Das Bild muss abgeschnitten werden werden, damit ein Vielfaches des Bildes in die Karte passt:
			var vielfaches_x = (Math.floor(feldgroesse_view_faktor * meinSpiel.map.max_pixel_x / image_breite) + 1) ;
			var vielfaches_y = (Math.floor(feldgroesse_view_faktor * meinSpiel.map.max_pixel_y / image_hoehe) + 1) ;
			imageHintergrund_breite_abgeschnitten = feldgroesse_view_faktor * meinSpiel.map.max_pixel_x / vielfaches_x ;
			imageHintergrund_hoehe_abgeschnitten  = feldgroesse_view_faktor * meinSpiel.map.max_pixel_y / vielfaches_y;
					
			canvasHintergrundGesamt.width =  3*imageHintergrund_breite_abgeschnitten;
			canvasHintergrundGesamt.height = 3*imageHintergrund_hoehe_abgeschnitten;			

			var start_x = 0;

			for (var i = 0 ; i < 3; i++){
		 		  var start_y = 0;
					for (var j = 0 ; j < 3; j++){
			    		context.drawImage(imgHintergrund, (image_breite - imageHintergrund_breite_abgeschnitten)/2, (image_hoehe - imageHintergrund_hoehe_abgeschnitten)/2,
			    										 imageHintergrund_breite_abgeschnitten, imageHintergrund_hoehe_abgeschnitten, start_x, start_y, imageHintergrund_breite_abgeschnitten, imageHintergrund_hoehe_abgeschnitten);
			    		start_y += imageHintergrund_hoehe_abgeschnitten;
			    	}
			    	start_x += imageHintergrund_breite_abgeschnitten;
			}	
			
		}			

	}
	function zeichneGesamtMauer(aMap){	
		var canvasMauerGesamt = document.getElementById('canvas_MauerGesamt');
	    var contextMauer = canvasMauerGesamt.getContext('2d');

		imgMauer.src = MAUERBILD;
		imgMauer.onload = function(){
			var image_breite = imgMauer.naturalWidth ;
			var image_hoehe = imgMauer.naturalHeight ;		    

			// Das Bild muss abgeschnitten werden werden, damit ein Vielfaches des Bildes in die Karte passt:
			var vielfaches_x = (Math.floor(feldgroesse_view_faktor * meinSpiel.map.max_pixel_x / image_breite) + 1) ;
			var vielfaches_y = (Math.floor(feldgroesse_view_faktor * meinSpiel.map.max_pixel_y / image_hoehe) + 1) ;
			imageMauer_breite_abgeschnitten = feldgroesse_view_faktor * meinSpiel.map.max_pixel_x / vielfaches_x ;
			imageMauer_hoehe_abgeschnitten  = feldgroesse_view_faktor * meinSpiel.map.max_pixel_y / vielfaches_y;
					
			canvasMauerGesamt.width =  3*imageMauer_breite_abgeschnitten;
			canvasMauerGesamt.height = 3*imageMauer_hoehe_abgeschnitten;			

			var start_x = 0;

			for (var i = 0 ; i < 3; i++){
		 		  var start_y = 0;
					for (var j = 0 ; j < 3; j++){
			    		contextMauer.drawImage(imgMauer, 1+(image_breite - imageMauer_breite_abgeschnitten)/2, 1+(image_hoehe - imageMauer_hoehe_abgeschnitten)/2,
			    										 imageMauer_breite_abgeschnitten-2, imageMauer_hoehe_abgeschnitten-2, start_x, start_y, imageMauer_breite_abgeschnitten+1, imageMauer_hoehe_abgeschnitten+1);
			    		start_y += imageMauer_hoehe_abgeschnitten;
			    	}
			    	start_x += imageMauer_breite_abgeschnitten;
			}
		}			
	}	
 
	function zeichneRaumschiff(derContext, polygon, mitte_x, mitte_y){

		derContext.fillStyle = meinRaumschiff.farbe; //"rgb(0, 0, 0)";
		derContext.beginPath();
		derContext.moveTo((polygon.eckenArray[0].koordinate.x * feldgroesse_view_faktor  - mitte_x),  (polygon.eckenArray[0].koordinate.y * feldgroesse_view_faktor - mitte_y));
		
		
		for (var i = 1; i < polygon.eckenArray.length; i++){
			derContext.lineTo( (polygon.eckenArray[i].koordinate.x * feldgroesse_view_faktor - mitte_x),  (polygon.eckenArray[i].koordinate.y * feldgroesse_view_faktor - mitte_y));
		}
		derContext.lineTo( (polygon.eckenArray[0].koordinate.x * feldgroesse_view_faktor - mitte_x),  (polygon.eckenArray[0].koordinate.y * feldgroesse_view_faktor - mitte_y));
		derContext.fill();
		
		derContext.strokeStyle = "#7F7F7F"
		derContext.stroke();	
		
	}	