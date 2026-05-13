/**
 * Klasse gravitationsPartikel
 * Die initiale Geschwindigkeit setzt sich aus Addition der Raumschiffgeschwindigkeit
 * und einer Konstanten gravitationsPartikelSpeed  zusammen
 * gravitationsPartikel sind ein besonder Schuss, die den Gegner nicht absciessen, sondern ihn wegschleudern.
 */
function gravitationsPartikel(){
		globalePartikelID++;
		this.ID = globalePartikelID;
		this.spielerID;
		this.lebenszyklen;
		this.typ = "EXPL";
		this.x;
		this.y;
		this.v_x;
		this.v_y;
		this.farbe = "rgb(0, 255, 100)";
		this.zweitfarbe ="rgb(255, 255, 0)";
		this.getSerialisierteSchussDaten = getSerialisierteSchussDaten;
		this.setSerialisierteSchussDaten = setSerialisierteSchussDaten;
		this.initialisiereGravitationsPartikel = initialisiereGravitationsPartikel;
}	
function initialisiereGravitationsPartikel(schiff){
		this.spielerID = schiff.spielerID;
		this.lebenszyklen = GRAVITATIONSPARTIKEL_LEBENSDAUER;
		
		var red = Math.round(Math.random()*256);
		var green	= Math.round(Math.random()*256);
		var blue = Math.round(Math.random()*256);
	
		this.farbe = "rgb("+ red + "," + green + "," + blue + ")";
		var zufallsWinkel = Math.random() * Math.PI * 2  ;
		
		
		this.x = schiff.s.x +  Math.cos(zufallsWinkel)*50;
		this.y = schiff.s.y + Math.sin(zufallsWinkel)*50;

			
		
		var speed = GRAVITATIONSPARTIKEL_SPEED + Math.random() * 4 -2;
		
		this.v_x = schiff.v.x  + Math.cos(zufallsWinkel) * speed;
		this.v_y = schiff.v.y  + Math.sin(zufallsWinkel) * speed;	
		
		this.x += this.v_x;
		this.y += this.v_y;
		
}	
