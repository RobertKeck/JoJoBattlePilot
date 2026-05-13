function spiel(spiel_id, map){
  this.spiel_id = spiel_id;
  this.map = map;
  
	this.basen = new Array();
	this.weiseBasisZu = weiseBasisZu;
	this.getFreieBasis = getFreieBasis;
	this.setBasisLeer = setBasisLeer;
	this.getBasisBySpielerID = getBasisBySpielerID;
	this.getBasis = getBasis;
	this.erzeugeBasen = erzeugeBasen;
	
	
	this.erzeugeBasen();
}



/**
 * Es wird zufaellig eine freie Basis ausgewaehlt und zurueckgegeben.
 */
function getFreieBasis(){
	do{
		basisNr = Math.round(Math.random() * (this.basen.length-1));
	}while (this.basen[basisNr].spielerID != "unbesetzt")

	return this.basen[basisNr];
}	
function weiseBasisZu(spielerBasis){		
			for (var i = 0 ; i < this.basen.length; i++){
				if (	this.basen[i].koordinate.x == spielerBasis.koordinate.x &&
					this.basen[i].koordinate.y == spielerBasis.koordinate.y){
							this.basen[i].spielerID =  spielerBasis.spielerID;
							this.basen[i].spielername =  spielerBasis.spielername;
				}
			}	
}			
	
/**
 * 	Die Basis, die dem uebergebenem Spieler gehoert, wird als unbesetzt markiert.
 */
function setBasisLeer(spielerID){
			for (var i = 0 ; i < this.basen.length; i++){
				if (this.basen[i].spielerID == spielerID){							
					this.basen[i].spielerID =  "unbesetzt";
				}
			}		
	
}
function getBasisBySpielerID(spielerID){
			for (var i = 0 ; i < this.basen.length; i++){
				if (this.basen[i].spielerID == spielerID){							
					return this.basen[i];
				}
			}		
	
			return null; // sollte nie auftreten !!
}
/**
 * Wenn der Schwerpunkt des uebergeben Raumschiffs in einer Basis liegt, wird die Basis zurueckgegeben, 
 * sonst wird null zurueckgegeben.
 */
function getBasis(schiff){
			var x = Math.round(schiff.s.x/feldgroesse + 0.5);
			var y = Math.round(schiff.s.y/feldgroesse + 0.5);
			

			if(x >= this.map.spielfeldbreite){
				 x -= this.map.spielfeldbreite;
			}
			if(x < 0){
				x += this.map.spielfeldbreite;
			}
			
			if(y >= this.map.spielfeldhoehe){
				y -= this.map.spielfeldhoehe;
			}
			if(y < 0){
				y += this.map.spielfeldhoehe;
			}
				
			
			for (var i = 0 ; i < this.basen.length; i++){
				if (	this.basen[i].koordinate.x == x && this.basen[i].koordinate.y == y){
							return this.basen[i];
				}
			}		
			return null;
}	
	
	
function erzeugeBasen(){
	for (zaehler_x=0; zaehler_x <this.map.spielfeldbreite; zaehler_x++){
		for (zaehler_y=0; zaehler_y <this.map.spielfeldhoehe; zaehler_y++){
			   if(this.map.spielfeld[zaehler_x][zaehler_y] == 6){
			   		this.basen.push(new basis("unbesetzt", "unbesetzt", this.spiel_id, zaehler_x, zaehler_y));	
			   }
		}
	}
}