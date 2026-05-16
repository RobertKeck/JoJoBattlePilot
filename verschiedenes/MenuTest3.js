
	
var alleRaumschiffTypen = new Array("SHIP1", "SHIP2", "SHIP3", "SHIP4", "SHIP5", "SHIP6");	
var feldgroesse = 45;  // Pixel - Hoehe und Breite eines Feldes vom Spielfeld
var TIMEOUT = 200; // Anzahl Millisekunden
var anzeige_groesse_x = 1500; // pixel
var anzeige_groesse_y = 1000; // pixel
var start_x = anzeige_groesse_x;
var start_y = anzeige_groesse_y;
var taste_links = 0;  /* 0 sei losgelassen, 1 sei gedrueckt */
var taste_rechts = 0;  /* 0 sei losgelassen, 1 sei gedrueckt */
var breite;

	

function berechneAbstandundWinkel(x,y){
	x -= 22.5; // zentriert
	y -= 22.5; // zentriert
	
	var abstand = Math.sqrt(x*x+y*y);
	
	var w = Math.asin(y / abstand); 
	if (x < 0){
		w = Math.PI - w;
	}
	
	
	// Raumschiff umdrehen
	w += Math.PI;
	
	console.log("this.eckenArray.push(new ecke(" + abstand + ", " +  w + "));");
}	
function tastegedrueckt(characterCode)
	{

	   switch(characterCode)
	   {
			case 37:
			case 89:
			case 65:
			case 121:
			case 97:   // links
	      
					start_x -= 20;
					//start_y -= 1;
					if (start_x  < breite){
						//start_x = breite*3 - anzeige_groesse_x -1;
						start_x = 2* breite-1;
						//start_y = 800;
					}
					drawHintergrund();
					break; 
			case 39:
			case 88:
			case 68:
			case 100:
			case 120:   // Rechts
					start_x += 20;
					//start_y += 1;
					/**
					if (start_x  > (breite*3 - anzeige_groesse_x - 1)){
						start_x = 0;
						//start_y = 0;
					}
					**/
					if (start_x > 2* breite){
						start_x = breite;
					}
				
					drawHintergrund();
					break;
	      default:
					break;
	   }
	}	
function tastelosgelassen(characterCode)
	{
	   switch(characterCode)
	   {
			case 37:
			case 89:
			case 65:
			case 97:
			case 121:
		 			taste_links = 0;
					break; 
			case 39:
			case 88:
			case 68:
			case 100:
			case 120:
					taste_rechts = 0;
					break;
	     default:
					break;
	   }
	}

	
function erzeugeMenue(){


		$('#radio_group_raumschiffTyp').children().remove();
		 for (i = 0; i < alleRaumschiffTypen.length; i++){
			addRadioButtonRaumschiffTyp(alleRaumschiffTypen[i]);
        }

}	
function drawCanvas(){

    var canvas = document.getElementById('testcanvas1');
    if(canvas.getContext){
        var context = canvas.getContext('2d');
        context.fillStyle = "rgb(255, 0, 255)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
	
}
function drawRaumschiff(canvasID){
	
	var canvasRaumschiff = document.getElementById(canvasID);
    if(canvasRaumschiff.getContext){
        var context = canvasRaumschiff.getContext('2d');
        context.fillStyle = "rgb(0, 0, 0)";
        
	
			context.beginPath();
			context.moveTo(20, 20);
			context.lineTo(30,20);
			context.lineTo(35,35);
			context.lineTo(20,30);
			context.lineTo(20,20);
			context.fill();
			
			context.strokeStyle = "#7F7F7F"
			context.stroke();			
			        
    }
 }
 function drawMauer(){

    var canvas = document.getElementById('testcanvas1');
    if(canvas.getContext){
        var context = canvas.getContext('2d');
       	var image = new Image();
				image.src = "mauer.JPG";
				$(image).load(function() {             // Wenn das Bild geladen ist
				//img.onload = function(){
				  $(image.parentNode).prop( "tagname", "einBild");
					$(image).reflect(
							//{		height: 1, opacity: 1	}
						);
					context.drawImage(image, 200, 100);
		    });
        
	}
}
 function zeichneRaumschiff(derContext, polygon, mitte_x, mitte_y){

	derContext.fillStyle = "rgb(0, 0, 0)";
	derContext.beginPath();
	derContext.moveTo(polygon.eckenArray[0].koordinate.x - mitte_x, polygon.eckenArray[0].koordinate.y - mitte_y);
	
	for (var i = 1; i < polygon.eckenArray.length; i++){
		derContext.lineTo(polygon.eckenArray[i].koordinate.x - mitte_x, polygon.eckenArray[i].koordinate.y - mitte_y);
	}
	derContext.lineTo(polygon.eckenArray[0].koordinate.x - mitte_x, polygon.eckenArray[0].koordinate.y - mitte_y);
	derContext.fill();
	
	derContext.strokeStyle = "#7F7F7F"
	derContext.stroke();	
	
/**/	
/**
        derContext.fillStyle = meinRaumschiff.farbe; //"rgb(0, 0, 0)";
        
	
			derContext.beginPath();
			derContext.moveTo(20, 20);
			derContext.lineTo(30,20);
			derContext.lineTo(35,35);
			derContext.lineTo(20,30);
			derContext.lineTo(20,20);
			derContext.fill();
			
			derContext.strokeStyle = "#7F7F7F"
			derContext.stroke();	
**/			
} 

function addRadioButtonRaumschiffTyp(button_name){
	$("#radio_group_raumschiffTyp").append("<label for='"+ button_name + "'> <canvas id='Canvas"+button_name+"' width='"+feldgroesse+"' height='"+feldgroesse+"' >	Dein Browser kann diese Grafik nicht darstellen.</canvas></label><input type='radio' name='raumschiffTypRadioGruppe' id='"+button_name+"' value='"+button_name+"'>")
	
	var canvasID = "Canvas"+button_name;
	var canvasRaumschiff = document.getElementById(canvasID);
	var kanten = new polygon(button_name);
	kanten.berechneEckenKoordinaten(new koordinate(feldgroesse/2, feldgroesse/2), Math.PI);
    if(canvasRaumschiff.getContext){
        var contextRaumschiff = canvasRaumschiff.getContext('2d');
		zeichneRaumschiff(contextRaumschiff, kanten, 0,0 ); 
	}
	


	
}
function drawHintergrund() {
    var canvas = document.getElementById('testcanvas1');
    //var canvas_gesamtBild = document.getElementById('canvasBild');
    if(canvas.getContext){
        var context = canvas.getContext('2d');
        var canvas_gesamtBild = document.getElementById('canvasBild');
        //while(true)
        {
	    		//keyCheck();
	    		//window.setTimeout("keyCheck()", 100);
////////////	    		canvas.width = canvas.width; // Clears the canvas
	    		
	    		/**
						  var img = new Image();
						  img.src = '121102Vortrag_Winter_002.jpg';
						  img.onload = function(){
						    context.drawImage(img, start_x, start_y, 300, 300, 0, 0, 300, 300);
							}	    		
							**/
	    		
	    		//var gesamtBildContext = canvas_gesamtBild.getContext;
			    context.drawImage(canvas_gesamtBild, start_x, start_y, anzeige_groesse_x, anzeige_groesse_y, 0, 0, anzeige_groesse_x, anzeige_groesse_y);
			  }
		 }		 
		 //window.setTimeout(drawHintergrund(), TIMEOUT); 
}


 
function drawGesamtBild() {
    var canvas_gesamtBild = document.getElementById('canvasBild');
    //var canvas_gesamtBild = document.getElementById('testcanvas1');
    if(canvas_gesamtBild.getContext){
        var context = canvas_gesamtBild.getContext('2d');
		  var img = new Image();
		  img.src = '121102Vortrag_Winter_002.jpg';
		  
		  img.onload = function(){
		    context.drawImage(img, 0, 0);
		    breite = img.naturalWidth ;
		    hoehe = img.naturalHeight ;		
		    context.drawImage(img, breite, 0);    
		    context.drawImage(img, 2*breite, 0);    

		    context.drawImage(img, 0, hoehe );    
		    context.drawImage(img, breite, hoehe );    
		    context.drawImage(img, 2*breite, hoehe );    
		    
		    context.drawImage(img, 0, hoehe *2);    
		    context.drawImage(img, breite, hoehe *2);    
		    context.drawImage(img, 2*breite, hoehe * 2);  
		    
			}
			
		}
	  
}    

