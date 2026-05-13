/**
 * Klasse explosionsPartikel
 * Die initiale Geschwindigkeit setzt sich aus Addition der Raumschiffgeschwindigkeit
 * und einer Konstanten explosionsPartikelSpeed  zusammen
 */
function explosionsPartikel(){
		globalePartikelID++;
		this.ID = globalePartikelID;
		this.spielerID;
		this.lebenszyklen;
		this.typ = "EXPL";
		this.x;
		this.y;
		this.v_x;
		this.v_y;
		this.farbe;
		this.zweitfarbe ="rgb(255, 255, 0)";
		this.getSerialisierteSchussDaten = getSerialisierteSchussDaten;
		this.setSerialisierteSchussDaten = setSerialisierteSchussDaten;
		this.initialisiereExplosion = initialisiereExplosion;
}	
function initialisiereExplosion(schiff){
		this.spielerID = schiff.spielerID;
		this.lebenszyklen = explosionsPartikelLaenge;
		this.farbe = schiff.farbe;
		var zufallsWinkel = Math.random() * Math.PI * 2  ;
		
		
		this.x = schiff.s.x ;
		this.y = schiff.s.y ;

		
		var speed = explosionsPartikelSpeed + Math.random() * 4 -2;
		
		this.v_x = schiff.v.x / 3 - Math.cos(zufallsWinkel) * speed;
		this.v_y = schiff.v.y / 3 - Math.sin(zufallsWinkel) * speed;	
		
		this.x += this.v_x;
		this.y += this.v_y;
		
}	
