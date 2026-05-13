function karte(datenArray, feldgroesse){

	this.kartenname = datenArray[1];
	this.spielfeldbreite = parseInt(datenArray[2]);
	this.spielfeldhoehe = parseInt(datenArray[3]);
	this.max_pixel_x = this.spielfeldbreite * feldgroesse;
	this.max_pixel_y = this.spielfeldhoehe * feldgroesse;
	this.spielfeld;  // Array[spielfeldbreite][spielfeldhoehe] 
	this.erzeugeSpielfeld = erzeugeSpielfeld;
	
	
	this.erzeugeSpielfeld(datenArray);
	
}

function erzeugeSpielfeld(datenArray){

	this.spielfeld =new Array(this.spielfeldbreite);
	for (zaehler_x=0; zaehler_x <this.spielfeldbreite; zaehler_x++){
		this.spielfeld[zaehler_x]=new Array(this.spielfeldhoehe)
		for (zaehler_y=0; zaehler_y <this.spielfeldhoehe; zaehler_y++){
		        var aktuellesZeichen =  datenArray[zaehler_y + 4].substr(zaehler_x, 1);
			switch (aktuellesZeichen){
				case 'x': 
					this.spielfeld[zaehler_x][zaehler_y]=1;
					break;
				case 'a': 
					this.spielfeld[zaehler_x][zaehler_y]=2;
					break;
				case 'q': 
					this.spielfeld[zaehler_x][zaehler_y]=3;
					break;
				case 'w': 
		
					this.spielfeld[zaehler_x][zaehler_y]=4;
					break;
				case 's': 
					this.spielfeld[zaehler_x][zaehler_y]=5;
					break;
				case '_': 
					this.spielfeld[zaehler_x][zaehler_y]=6;
					
					break;
				default:
					this.spielfeld[zaehler_x][zaehler_y]=0;
					break;
			}
		}
	}

}	

	
	
	
		
/**
	 * Wird nur zum Test benoetigt, wenn keine Server Verbindung moeglich ist, und somit keine Karte vom Server geladen werden kann.
	 */			
function erzeugeTestmap(feldgroesse){
	var testDatenArray = new Array(
		"",
		"Testmap",
		"90",
		"90",
		"xsaxxxxxxxxw  _  qw                  axxxxxxxxxxxxw _     xxs         axxxs             xx",
		"s  axxxxxxxxxxxxxxx                   xxxxxxxxxxxxxxxx    xs           axs              xx",
		"      axxxxxxxxxxxx                   xxxxxxxxxxxxxs      a                             xs",
		"       axxxxxxxxxxs                   axxxxxxxxxxxx                                    qx ",
		"        axxxxxxxxs                     axxxxxxxxxxs                                   xxs ",
		"         axxxxxxx                       axxxxxxxs                                    qxx  ",
		"          xxxxxxx                        axxxxxs                                    qxxs  ",
		"          axxxxxs                                                                   xxx   ",
		"           axxxx                                                   qxw              xxxw  ",
		"            xxxxw                                                 xxxxw            qxxxxw ",
		"            xxxxxw            xxxw                                xxxxx            xxxxxx ",
		"            axxxxx            axxxw                              qxxxxx            axxxxxw",
		"xw           axxxx             xxxx                              xxxxxxw            axxxxx",
		"xx             axx           _qxxxx                              axxxxxxw            axxxx",
		"xxw             ax           xxxxxs                               xxxxxxx             axxx",
		"xxxxw            xw          axxxs                                  axxxx                a",
		"axxxx            xxw                                 qxxw            xxxx                 ",
		"                 axxxxw                              xxxxw           xxxs                 ",
		"                  axxxxw                            qxxxxx           axs                  ",
		"                   axxxxw                           xxxxxx                                ",
		"                    xxxxxw                          xxxxxx                                ",
		"                    xxxxxxw                         xxxxxs                                ",
		"           xw       axxxxxxw                        axxxs                                 ",
		"           xx        axxxxxx             qxw qxw                                          ",
		"          qxxw_       xxxxxxw           qxxx_xxx               qxw         xw             ",
		"         qxxxxx       axxxxxxw          xxxxxxxx               xxx         xxw_qxxxxw     ",
		"         axxxxx        axxxxxxw         axxxxxxs               xxx         xxxxxxxxxxx    ",
		"           axxx         xxxxxxx          xxxxs                 axs        qxxxxxxxxxxs    ",
		"            axxw        xxxxxxx         qxxxs                           xxxxxxxxxxxxx     ",
		"             xxxw      qxxxxxxx        qxxs                             xxxxxxxxxxxxx     ",
		"             axxx     qxxxxxxxs        xxx                              xxxxxxxxxxxxs     ",
		"              xxxw   qxxxxxxxs         xs                               xxxxxxxxxxxs      ",
		"              xxxxxxxxxxxxs                                             xxxxxxxxxxx       ",
		"              xxxxxxxxxxxs                                              axxxxxxxxxx       ",
		"   qx         xxxxxxxxxxx                                                axxxxxxxxs       ",
		"  qxxw        axxxxxxxxxx                                 xxxw            xxxxxxxs        ",
		"  xxxx         axxxxxxxxx                                qxxxxw_qxxw      xxxxxxx         ",
		"  xxxxw            axxxxs                    qxxw        xxxxxxxxs        axxxxxs         ",
		" qxxxxxw            axxs                    qxxxx       qxxxxxxxs          axxxs          ",
		"qxxxxxxx                                  _qxxxxx      xxxxxxxxs                          ",
		"xxxxxxxs                                 qxxxxxxx     qxxxxs                              ",
		"xxxxxxx                                  xxxxxxxxw _qxxxxxs                               ",
		"xxxxxxs                                    axxxxxxxxxxxxxs                               q",
		"xxxxs                                       axxxxxxxxxxxs                               qx",
		"xxxx                                         axxxxxxxxxx                               qxx",
		"xxxx                                          axxxxxxxxx                               xxx",
		"xxxs                                             axxxxxs                               xxx",
		"xxs                                               axxxs                                xxx",
		"xs                                                 axs                                  ax",
		"                                                                                          ",
		"                            qxw                                                           ",
		"                          _qxxxw                                    qw qw                 ",
		"                         xxxxxxx                                    as_as                 ",
		"                         xxxxxxs                                      x                   ",
		"w                        xxxxxs                                     qw qw              qxx",
		"xxxw q                  qxxxxs            qxw                       as as              xxx",
		"xxxxxxw                qxxxxs            qxxxw                                        qxxx",
		"xxxxxxx                xxxxx            qxxxxxw                                      qxxxx",
		"xxxxxxs                xxxxx           qxxxxxxxw                                     axxxx",
		"xxxxxs                 xxxxs          qxxxxxxxxxw                                     xxxx",
		"xxxxx                                qxxxxxxxxxxx                                     axxx",
		"xxxxx                                xxxxxxxxxxxxw                                    qxxx",
		"xxs                                  xxxxxxxxxxxxxw                                   xxxx",
		"xs                                   xxxxxxxxxxxxxxw                                 qxxxx",
		"s       qxxw                        qxxxxxxxxxxxxxxxxxxw                             xxxxx",
		"       qxxxxw                      qxxxxxxxxxxxxxxxxxxxxw                           qxxxxx",
		"     qxxxxxxxw                    qxxxxxxxxxxxxxxxxxxxxxx                         qxxxxxxs",
		"     xxxxxxxxx                    xxxxxxxxxxxxxxxxxxxxxxx                        qxxxs    ",
		"     xxxxxxxxs                    xxxxxxxxxxxxxxxxxxxxxxx                      qxxxxs     ",
		"     xxxxxxxs                     xxxxxxxxxxxxxxxxxxxxxxs                     qxxxxs      ",
		"    qxxxxs                        xxxxxxxxxxxxxxxxxxxxxs                     qxxxxs       ",
		"xw qxxxxs                         axxxxxxxxxxxxxxxxxxxs                      xxxxs       q",
		"xxxxs                              axxxxxxxxxxxxxxxxxxw       qxw         xwqxs          x",
		"xxxs                                xxxxxxxxxxxxxxxxxxx      qxxxw        axxs           x",
		"xxs                                 xxxxxxxxxxxxxxxxxxxw   _qxxxxx                    _ qx",
		"s                                   xxxxxxxxxxxxxxxxxxxx  qxxxxxxx                 qxxxxxx",
		"                       axw          axxxxxxxxxxxxxxxxxxs  xxxxxxxs                qxxxxxxs",
		"                        xxw_         axxxxxxxxxxxxxxxxx   xxxxxxx               qxxxxxxxs ",
		"                        xxxxs         xxxxxxxxxxxxxxxxxw qxxxxxxs              qxs axxxs  ",
		"            qxxw        axxs          xxxxxxxxxxxxxxxxxx xxxxxxx              qxx         ",
		"           qxxxxw        ax           xxxxxxxxxxxxxxxxxx xxxxxxx          qxxxxxx         ",
		"           xxxxxx                     axxxxxxxxxxxxxxxxx xxxxxxx         qxxxxxxx         ",
		"          qxxxxxx                     qxxxxxxxxxxxxxxxxs xxxxxxxw       qxxxxxxxs         ",
		"       qxxxxxxxxx                    qxxxxxxxxxxxxxxxs   axxxxxxx       xxxxxxxs          ",
		"      qxxxxxxxxxs                   qxxxxxxxxxxxxxxs      xxxxxxx       xxxxxs            ",
		"xw   qxxxxxxxxxs                    xxxxxxxxxxxxxxx       axxxxxx      qxxxxx            q",
		"xxw_qxxxxxxxxxs                     xxxxxxxxxxxxxxx        xxxxxs     qxxxxxs           qx",
		"xxxxxxxxxxxxxs                      xxxxxxxxxxxxxs         xxxxs      xxxxxx           qxx",
		"xxxxxxxxxxxs                        xxxxxxxxxxxxx         qxxs        xxxxxx           xxx",
		"xxxxxxxxxxx                         axxxxxxxxxxxxw        xxx         xxxxxs           axx");
	
	return new karte(testDatenArray, feldgroesse);

}


function erzeugeLeereMap(feldgroesse){
	var testDatenArray = new Array(
		"",
		"Leermap",
		"90",
		"90",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ",
		"                                                                                          ");
	
	return new karte(testDatenArray, feldgroesse);

}