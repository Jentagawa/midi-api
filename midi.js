navigator.requestMIDIAccess().then(onMIDISuccess,onMIDIFailure);
var midi = null;
var inputs = [];
var outputs = [];

function onMIDISuccess(m){
  midi = m;
  var it = midi.inputs.values();
  for(var o = it.next(); !o.done; o = it.next()){
    inputs.push(o.value);
  }
  var ot = midi.outputs.values();
  for(var o = ot.next(); !o.done; o = ot.next()){
    outputs.push(o.value);
  }

  for(var cnt=0;cnt < inputs.length;cnt++){
    inputs[cnt].onmidimessage = onMIDIEvent;
  }
}

function onMIDIFailure(msg){
  console.log("onMIDIFailure()呼ばれただと？:"+msg);
}

function onMIDIEvent(e){
  if(e.data[2] != 0){
    $('#crossfader').slider({max: 200, min: 0,value: 0});
    $('#crossfader').bind('slide', function(event, ui) {
        var left_val = Math.max(Math.min(190 - parseInt($('#crossfader').slider('option','value')), 100), 0);
        var right_val = Math.max(Math.min(parseInt($('#crossfader').slider('option','value')), 110) - 10, 0);

        left_player.setVolume(left_val);
        right_player.setVolume(right_val);
        
    });
  }
}