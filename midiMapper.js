/**
 * midiMapper class
 * Manages the inputs from a MIDI controller
 * @param {processingInstace} The instance of the PJS file to send events to
 * @author Indeo Solutions
 */

var pjs, buttonMap;

var midiMapper =  function (processingInstance) {
	pjs = processingInstance;
};

	
// Which button is assigned to sliders 1->3
buttonMap = [-100, 2, 3, 4];

/**
 * Called when an input is updated
 * @param  {Object} e 
 */
midiMessageReceived =  function(e) {
	console.log("Change detected", e);
	var cmd = e.data[0] >> 4;
	var channel = e.data[0] & 0xf;
	var b = e.data[1];
	var c = e.data[2];

	// Auxiliarry object, may be used for logging
	var obj = { 
	    cmd : cmd,
	    channel: channel,
	    b: b,
	    c: c
	};	

	console.log(JSON.stringify(obj));

	if(cmd == 11 && channel == 0) {
		for(var slider in buttonMap) {
			if(buttonMap[slider] == b)
				pjs.sliderSetEvent(slider, c);
		}
	}
}

function message (e) {
	midiMessageReceived(e);
}

/**
 * Map controller buttons to slider index
 * @param  {Integer} controllerButton
 * @param  {Integer} slider
 */
midiMapper.prototype.linkSlider = function (controllerButton, slider) {
	buttonMap[slider] = controllerButton;
}

/**
 * Bind events after controller is connected
 * @param  {Object} midiAccess 
 */
midiMapper.prototype.gotMIDI = function(midiAccess) {
  console.log("Connected to controller");
  this.midi = midiAccess;
  if ((typeof(midiAccess.inputs) == "function")) {  //Old Skool MIDI inputs() code
    var ins = midiAccess.inputs();
    console.log('All inputs: ', JSON.stringify(ins));
    for (var i=0; i<ins.length; i++)
      ins[i].onmidimessage = message;
  } else {
    var inputs = midiAccess.inputs.values();
    for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
      console.log('Input event set');
      console.log(JSON.stringify(input));

      input.value.onmidimessage = message;
    }
  }
}

/**
 * Show error if couldn't connect to controller
 * @param  {Object} error
 */
midiMapper.prototype.didntGetMIDI = function(error) {
	console.log("No MIDI access: " + error.code );
}


/**
 * Initiate the Web MIDI API
 */
midiMapper.prototype.init = function () {
	console.log('Connecting to controller.');
	var self = this;
	navigator.requestMIDIAccess().then( self.gotMIDI, self.didntGetMIDI );
}

/**
 * Auxiliarry function to simulate MIDI events.
 * Sends the given parameter, or a random event if e is null
 * @param {Object} e
 */
midiMapper.prototype.trigger = function (e) {
	e = e || {data: [176, Math.round(3 * Math.random()), Math.round(127 * Math.random())]};
	midiMessageReceived(e);
}