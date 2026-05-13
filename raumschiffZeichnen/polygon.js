function polygon(raumschiffTyp){

    this.eckenArray = new Array();
	this.typ = raumschiffTyp;
	
	switch (raumschiffTyp) {
		
		  case "SHIP6":

//this.eckenArray.push(new ecke(19.352943090134897, 7.836541541898784)); 
this.eckenArray.push(new ecke(11.633283339195346, 1.7359450042095232)); 
this.eckenArray.push(new ecke(6.478281021999586, 1.925501978805837)); 
this.eckenArray.push(new ecke(14.740505418743279, 3.687247708116785)); 
this.eckenArray.push(new ecke(21.240762698170705, 4.077362244994376)); 
this.eckenArray.push(new ecke(9.9516408822867, 4.610470612903816)); 
this.eckenArray.push(new ecke(11.589684260151351, 4.731804016287003)); 
this.eckenArray.push(new ecke(10.24676778306213, 4.866707756310809)); 
this.eckenArray.push(new ecke(21.49015036010684, 5.371595604009114)); 
this.eckenArray.push(new ecke(15.377972273677695, 5.754057673255315)); 
this.eckenArray.push(new ecke(6.293970328814715, 7.350355337850386)); 
this.eckenArray.push(new ecke(11.59623457204967, 7.609002970847619)); 
this.eckenArray.push(new ecke(19.352943090134897, 7.836541541898784)); 

					break;
		  
			case "SHIP5":	
								this.eckenArray.push(new ecke(18.069310999592652, 7.602291662216296)); 
								this.eckenArray.push(new ecke(21.50581316760657, 5.662935821196765)); 
								this.eckenArray.push(new ecke(19.144189719076646, 5.423848106124197));
								this.eckenArray.push(new ecke(7.905694150420948, 7.532231079577841)); 
								this.eckenArray.push(new ecke(7.905694150420948, 1.8925468811915387));
								this.eckenArray.push(new ecke(19.144189719076646, 4.000929854645182));
								this.eckenArray.push(new ecke(21.50581316760657, 3.7618421395726145)); 
								this.eckenArray.push(new ecke(18.069310999592652, 1.8224862985530832));
								this.eckenArray.push(new ecke(17.5, 1.5707963267948966)); 
								
								break;
								/**
			case "SHIP5":	
			
								this.eckenArray.push(new ecke(18.069310999592652, -1.3191063550367097));
								this.eckenArray.push(new ecke(21.50581316760657, -0.6202494859828214 ));
								this.eckenArray.push(new ecke(19.144189719076646, -0.8593372010553884 ));
								this.eckenArray.push(new ecke(7.905694150420948, -1.2490457723982542 ));
								this.eckenArray.push(new ecke(7.905694150420948, -1.8925468811915387));
								this.eckenArray.push(new ecke(19.144189719076646, -2.2822554525344048 ));
								this.eckenArray.push(new ecke(21.50581316760657, -2.5213431676069717 ));
								this.eckenArray.push(new ecke(18.069310999592652, -1.8224862985530832 ));
								this.eckenArray.push(new ecke(17.5, -1.5707963267948966 ));
			
								break;
								**/
			case "SHIP4":	
								this.eckenArray.push(new ecke(20, (0.4)* Math.PI));
								this.eckenArray.push(new ecke(15, (5/4)* Math.PI));
								this.eckenArray.push(new ecke(2, (6/4)* Math.PI));
								this.eckenArray.push(new ecke(15, (7/4)* Math.PI));
								this.eckenArray.push(new ecke(20, (0.6)* Math.PI));
								this.eckenArray.push(new ecke(20, (1/2)* Math.PI));
								break;
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

function berechneEckenKoordinaten(s, alpha){
	for (var i = 0; i < this.eckenArray.length; i++){
		this.eckenArray[i].koordinate.x = s.x + Math.cos(this.eckenArray[i].winkel + alpha) * this.eckenArray[i].abstand;
		this.eckenArray[i].koordinate.y = s.y + Math.sin(this.eckenArray[i].winkel + alpha) * this.eckenArray[i].abstand;
	}		
}
