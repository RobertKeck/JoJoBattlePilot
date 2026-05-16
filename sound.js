/**	
 * In den meisten Browsern ausser Firefox funktioniert auf Mobil-Geraeten das Laden von Sound-Dateien nicht per preload,
 * sondern nur wenn ein Button vorher gedrueckt wurde. Deshalb muss diese Funktion bei einem  Button-click gestartet werden.
 */
function ladeSoundDatei(){
	var audio = $('#audio_sprite')[0];
	if (!audio) {
		console.warn('ladeSoundDatei: audio_sprite element not found');
		return;
	}

	if (window.location.protocol === "file:") {
		console.log('ladeSoundDatei: lokal geöffnete Datei, lade Audio trotzdem');
	}

	audio.load();
	audio.volume = 0;
	audio.loop = true;
	var playPromise = audio.play();
	if (playPromise !== undefined) {
		playPromise.then(function() {
			console.log('ladeSoundDatei: audio_sprite startet erfolgreich');
		}).catch(function(error) {
			console.warn('ladeSoundDatei: audio_sprite.play() abgelehnt', error);
		});
	}
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
	if (!track) {
		console.warn('playTrackMitVolume: Track nicht gefunden', track_name);
		return;
	}

	var audio = $('#audio_sprite')[0];
	if (!audio) {
		console.warn('playTrackMitVolume: audio_sprite element nicht gefunden');
		return;
	}

	//$('#audio_sprite')[0].pause();
	audio.currentTime = track.from;
	audio.volume = lautstaerke;
	//$('#audio_sprite')[0].play();
	 
	soundSpriteTimeout = setTimeout(function() {
	  //$('#audio_sprite')[0].pause();
	  audio.volume = 0;
	}, (track.to * 1000) - (track.from * 1000));


}

function playTrack(track_name){
	playTrackMitVolume(track_name, 0.7*grundlautstaerke /10);
}
