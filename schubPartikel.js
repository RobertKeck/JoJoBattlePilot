
/**
 * Klasse schubPartikel
 * Die initiale Geschwindigkeit setzt sich aus Addition der Raumschiffgeschwindigkeit
 * und einer Konstanten schubpartikel_speed  zusammen
 */
function schubPartikel(){
		globalePartikelID++;
		this.ID = globalePartikelID;
		this.spielerID;
		this.lebenszyklen;
		this.typ = "SCHUB";	
		this.x;
		this.y;
		this.v_x;
		this.v_y;
		this.farbe = "rgb(255, 100, 0)";
		this.zweitfarbe ="rgb(255, 255, 0)";		
		this.getSerialisierteSchussDaten = getSerialisierteSchussDaten;
		this.setSerialisierteSchussDaten = setSerialisierteSchussDaten;
		this.initialisiereSchub = initialisiereSchub;		
}	
function initialisiereSchub(schiff){
		this.spielerID = schiff.spielerID;
		this.lebenszyklen = 20;
		
		this.x = schiff.s.x + (schiff.s.x - schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].koordinate.x) / 2 ;
		this.y = schiff.s.y + (schiff.s.y - schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].koordinate.y) / 2 ;

		var zufallsWinkel = Math.random() * Math.PI / 2 - Math.PI / 4 ;
		this.v_x = schiff.v.x - Math.cos(schiff.alpha + Math.PI / 2 + zufallsWinkel) * schubpartikel_speed;
		this.v_y = schiff.v.y - Math.sin(schiff.alpha + Math.PI / 2 + zufallsWinkel) * schubpartikel_speed;	
}	


