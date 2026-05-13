/**
 * Eckpunkt eines Raumschiffes
 */
function ecke(abstand_zum_Schwerpunkt, winkel){
	
    // Abstand der Ecke zum Schwerpunkt s des Raumschiffs 
	this.abstand = abstand_zum_Schwerpunkt;
	
	// Winkel zwischen x-Achse und Linie(schwerpunkt, ecke) 
	this.winkel = winkel;

	// Koordinate der Ecke, die jeweils in abhaengigkeit zum Raumschiffschwerpunkt und der Raumschiff-Richtung berechnet wird
	this.koordinate = new koordinate(0,0);  
	
}	