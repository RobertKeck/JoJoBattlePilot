function basis(spielerID, spielername, spiel_id, x, y){
	
	this.spielername = spielername;
	this.spielerID = spielerID;
	this.spiel_ID = spiel_id;
	this.koordinate = new koordinate(x, y);
	
	this.getSerialisierteBasisDaten = getSerialisierteBasisDaten;
	
	
}


function getSerialisierteBasisDaten(){
	var serialString =  this.koordinate.x.toString() + "|"+ this.koordinate.y.toString();
											
	return serialString;
}


	
	