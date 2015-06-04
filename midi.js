log('MIDI controller detector started.');

function midiMessageReceived( e ) {
  var cmd = e.data[0] >> 4;
  var channel = e.data[0] & 0xf;
  var b = e.data[1];
  var c = e.data[2];

    var obj = { 
      
        channel: b,
        
    };
    $('#events').val($('#events').val() + '\r\n' + JSON.stringify(obj));
}

//window.addEventListener('load', function() {
  log('Connecting to controller.');
  navigator.requestMIDIAccess().then( gotMIDI, didntGetMIDI );
//});

function gotMIDI( midiAccess ) {
  midi = midiAccess;
  if ((typeof(midiAccess.inputs) == "function")) {  //Old Skool MIDI inputs() code
    var ins = midiAccess.inputs();
    log('All inputs: ', JSON.stringify(ins));
    for (var i=0; i<ins.length; i++)
      ins[i].onmidimessage = midiMessageReceived;
  } else {
    var inputs=midiAccess.inputs.values();
    for ( var input = inputs.next(); input && !input.done; input = inputs.next())
      input.value.onmidimessage = midiMessageReceived;
  }
}

function didntGetMIDI( error ) {
  log("No MIDI access: " + error.code );
}


function log(text) {
    $('#log').append(text +  '<br />');
    
}