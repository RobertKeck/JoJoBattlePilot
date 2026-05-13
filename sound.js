/**	
 * In den meisten Browsern ausser Firefox funktioniert auf Mobil-Geraeten das Laden von Sound-Dateien nicht per preload,
 * sondern nur wenn ein Button vorher gedrueckt wurde. Deshalb muss diese Funktion bei einem  Button-click gestartet werden.
 */
function ladeSoundDatei(){
	
	$('#audio_sprite')[0].load();
	$('#audio_sprite')[0].volume = 0;
	$('#audio_sprite')[0].loop = true;
	$('#audio_sprite')[0].play();
    //$('#audio_sprite')[0].pause();

}
/**
 * playTrack spielt den Titel track_name aus der sound-Datei jojoBattlePilot_gesamtSound.mp3, welche saemtliche Geraeusche aneinandergehaengt enthaelt.
 * Ein derartiger Sound-Sprite ist notwendig, da es auf Mobil-Geraeten sonst zu Verzoegerungen beim Start eines Geraeusches kommt.
 * HTML5 ist leider nicht gleich HTML5
 * Zwei Geraeusche parallel abzuspielen ist mit Sound-Sprites nicht moeglich.
 */
function playTrackMitVolume(track_name, lautstaerke){

	clearTimeout(soundSpriteTimeout);

	var track = tracks[track_name];
	//$('#audio_sprite')[0].pause();
	$('#audio_sprite')[0].currentTime = track.from;
	$('#audio_sprite')[0].volume = lautstaerke;
	//$('#audio_sprite')[0].play();
	 
	soundSpriteTimeout = setTimeout(function() {
	  //$('#audio_sprite')[0].pause();
	  $('#audio_sprite')[0].volume = 0;
	}, (track.to * 1000) - (track.from * 1000));


}

function playTrack(track_name){
	playTrackMitVolume(track_name, 0.7*grundlautstaerke /10);
}
