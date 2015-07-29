
	function setGMToneName(){
		var i=0;
		var sel=null;
		var tonenames=[
			"Acoustic Grand Piano", "Bright Acoustic Piano", "Electoric Grand Piano", "Honky-tonk Piano",
			"Electoric Piano 1", "Electoric Piano 2", "Harpsichord", "Clavi",
			"Celesta", "Glockenspiel", "Music Box", "Vibraphone",
			"Marimba", "Xylophone", "Tubular Bells", "Dulcimer",
			"Drawbar Organ", "Percussive Organ", "Rock Organ", "Church Organ",
			"Reed Organ", "Accordion", "Harmonica", "Tango Accordion",
			"Acoustic Giutar (Nylon)", "Acoustic Giutar (Steel)", "Electoric Giutar (Jazz)", "Electoric Giutar (Clean)",
			"Electoric Giutar (Muted)", "Overdriven Guitar", "Distortion Guitar", "Guitar Harmonics",
			"Acoustic Bass", "Electoric Bass (Fingar)", "Electoric Bass (Pick)", "Fretless Bass",
			"Slap Bass 1", "Slap Bass 2", "Synth Bass 1", "Synth Bass 2",
			"Violin", "Viola", "Cello", "Contrabass",
			"Tremolo Strings", "Pizzicato Strings", "Orchestral Harp", "Timpani",
			"String Ensemble 1", "String Ensemble 2", "Synth Strings 1", "Synth Strings 2",
			"Choir Aahs", "Voice Oohs", "Synth Voice", "Orchestra Hit",
			"Trumpet", "Trombone", "Tuba", "Muted Trumpet",
			"French Horn", "Brass Section", "Synth Brass 1", "Synth Brass 2",
			"Soprano Sax", "Alto Sax", "Tenor Sax", "Baritone Sax",
			"Oboe", "English Horn", "Bassoon", "Clarinet",
			"Piccolo", "Flute", "Recorder", "Pan Flute",
			"Blown Bottle", "Shakuhach", "Whistle", "Ocarina",
			"Lead 1 (square)", "Lead 2 (Sawtooth)", "Lead 3 (Calliope)", "Lead 4 (Chiff)",
			"Lead 5 (Charang)", "Lead 6 (Voice)", "Lead 7 (Fifths)", "Lead 8 (Bass+Lead)",
			"Pad 1 (New age)", "Pad 2 (Warm)", "Pad 3 (Polysynth)", "Pad 4 (Choir)",
			"Pad 5 (Bowed)", "Pad 6 (Metallic)", "Pad 7 (Halo)", "Pad 8 (Sweep)",
			"FX 1 (Rain)", "FX 2 (Soundtrack)", "FX 3 (Crystal)", "FX 4 (Atmosphere)",
			"FX 5 (Brightness)", "FX 6 (Goblins)", "FX 7 (Echoes)", "FX 8 (Sci-Fi)",
			"Sitar", "Banjo", "Shamisen", "Koto",
			"Kalimba", "Bag Pipe", "Fiddle", "Shanai",
			"Tinkle Bell", "Agogo", "Steel Drums", "Woodblock",
			"Taiko Drum", "Melodic Tom", "Synth Drum", "Reverse Cymbal",
			"Guitar Fret Noise", "Breath Noise", "Seashore", "Bird Tweet",
			"Telephone Ring", "Helicopter", "Applause", "Gunshot"
		];

		sel = document.tone_select.tone_select;
		for(i=0; i<128; i++){
			sel.options[i] = new Option(tonenames[i], i);
		}
	}