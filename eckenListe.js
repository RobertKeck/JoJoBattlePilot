function eckenListe(raumschiffTyp){

    this.eckenArray = new Array();
	this.alpha = Math.PI;
	
	switch (raumschiffTyp) {
			case "SHIP3":	
								this.eckenArray.push(new ecke(17, (3/4)* Math.PI));
								this.eckenArray.push(new ecke(15, (5/4)* Math.PI));
								this.eckenArray.push(new ecke(2, (6/4)* Math.PI));
								this.eckenArray.push(new ecke(15, (7/4)* Math.PI));
								this.eckenArray.push(new ecke(17, (9/4)* Math.PI));
								this.eckenArray.push(new ecke(20, (1/2)* Math.PI));
								break;
			case "SHIP2":	
								this.eckenArray.push(new ecke(8, (4/4)* Math.PI));
								this.eckenArray.push(new ecke(10, (5/4)* Math.PI));
								this.eckenArray.push(new ecke(2, (6/4)* Math.PI));
								this.eckenArray.push(new ecke(10, (7/4)* Math.PI));
								this.eckenArray.push(new ecke(8, (8/4)* Math.PI));
								this.eckenArray.push(new ecke(20, (1/2)* Math.PI));
								break;
			case "SHIP1": // Dreieck
								this.eckenArray.push(new ecke(10, (5/4)* Math.PI));
								this.eckenArray.push(new ecke(10, (7/4)* Math.PI));
								this.eckenArray.push(new ecke(20, (1/2)* Math.PI));
								break;
			default: // Dreieck
								this.eckenArray.push(new ecke(10, (5/4)* Math.PI));
								this.eckenArray.push(new ecke(10, (7/4)* Math.PI));
								this.eckenArray.push(new ecke(20, (1/2)* Math.PI));
								break;
	}
	
	this.berechneEckenKoordinaten = berechneEckenKoordinaten;	
}

function berechneEckenKoordinaten(s){
	for (var i = 0; i < this.eckenArray.length; i++){
		this.eckenArray[i].koordinate.x = s.x + Math.cos(this.eckenArray[i].winkel + this.alpha) * this.eckenArray[i].abstand;
		this.eckenArray[i].koordinate.y = s.y + Math.sin(this.eckenArray[i].winkel + this.alpha) * this.eckenArray[i].abstand;
	}		
}
