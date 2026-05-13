
/**
 * Klasse schuss
 * Die initiale Geschwindigkeit setzt sich aus Addition der Raumschiffgeschwindigkeit
 * und einer Konstanten schuss_speed  zusammen
 */
function schuss(){
		globalePartikelID++;
		this.ID = globalePartikelID;
		this.spielerID;
		this.lebenszyklen;
		this.typ = "SCHUSS";
		this.x;
		this.y;

		this.v_x;
		this.v_y;
		
		this.farbe = "rgb(255, 0, 0)";
		this.zweitfarbe ="rgb(255, 255, 0)";

		this.getSerialisierteSchussDaten = getSerialisierteSchussDaten;
		this.setSerialisierteSchussDaten = setSerialisierteSchussDaten;
		this.initialisiere = initialisiere;
		
}	
function initialisiere(schiff){
			this.spielerID = schiff.spielerID;
			this.lebenszyklen = SCHUSS_LEBENSZYKLEN;
			
			this.x = schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].koordinate.x + (schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].koordinate.x - schiff.s.x) / schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].abstand;
			this.y = schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].koordinate.y + (schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].koordinate.y - schiff.s.y) / schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].abstand;

			this.v_x = schuss_speed * (schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].koordinate.x - schiff.s.x) / schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].abstand + schiff.v.x;
			this.v_y = schuss_speed * (schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].koordinate.y - schiff.s.y) / schiff.polygon.eckenArray[schiff.polygon.eckenArray.length - 1].abstand + schiff.v.y;
			
	
}	

/**
 * Die Schussdaten spielerID, lebenszyklen, x, y, v_x, v_y, typ werden zu einem String zusammengefuegt.
 * Dieser String kann dann an den Server uebertragen werden.
 */
function getSerialisierteSchussDaten(){
	var serialString =  this.ID + "|" + 
				this.spielerID + "|" + 
				this.lebenszyklen.toString() + "|"+
				this.x.toString() + "|"+
				this.y.toString() + "|"+
				this.v_x.toString() + "|"+ 
				this.v_y.toString()+ "|"+
				this.typ + "|"+
				this.farbe;

	return serialString;
}	
/**
  * Die Schussdaten spielerID, lebenszyklen, x, y, v_x, v_y, typ werden gesetzt mit den uebergebenen deserialisierten Daten
  */
function setSerialisierteSchussDaten(datenArray){
	this.ID = datenArray[1];
	this.spielerID = datenArray[2];
	this.lebenszyklen = parseFloat(datenArray[3]);
	this.x = parseFloat(datenArray[4]);
	this.y = parseFloat(datenArray[5]);
	this.v_x = parseFloat(datenArray[6]);
	this.v_y = parseFloat(datenArray[7]);
	this.typ = datenArray[8];
	this.farbe = datenArray[9];

}  

