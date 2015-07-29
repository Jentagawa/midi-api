// Web MIDI API 対応
//  - nanoKONTROL2 一番左のノブとフェーダーで操作できます
// forked from toyoshim's "forked: JSパーティクル崩し" http://jsdo.it/toyoshim/294d
// forked from os0x's "JSパーティクル崩し" http://jsdo.it/os0x/90JW
// パーティクル崩し(http://wonderfl.net/c/tNGi)のJavaScriptポートです。

// for Opera 10.5-?
if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.createImageData && window.ImageData) {
  CanvasRenderingContext2D.prototype.createImageData = function(w,h) {
    return new ImageData(w,h);
  };
}
var isIE = !!window.ActiveXObject;
var canvas = document.getElementById('world');
var field = canvas.parentNode;
var start = document.getElementById('start');
var clear = document.getElementById('clear');

chime.setMaxEffect(16);
var snd1 = chime.createSound(["%3x1,2v15o6s16l64c"]);
var snd2 = chime.createSound(["%3x1,2v14o7s3l64f"]);
var snd3 = chime.createSound(["%2v2o6s1l64c<c>>>c"]);
var bgm1 = chime.createSound(["t120%1@5l32q8s1,-8v5c<<<c>>cc", "%1@7l32k16q8s1,-8v5c<<<c>>cc"]);
var bgm2 = chime.createSound(["t120%1@3v7o6q14s16g8l16gaa+b<c2", "%1@3v3o6q14s16k4d8l16ddddc8l64defgab<c4", "%3o4q14s32v14g8l16>ggf+g<c8.>c8."]);

var timer = -1;
var Bar;
var BAR_WIDTH;
var WIDTH;

function init(){
  var BAR_HEIGHT = 10;
  BAR_WIDTH = 40;
  var FPS = 30;
  var TIME = 1000 / FPS;
  WIDTH = canvas.width;
  var HEIGHT = canvas.height;
  var ctx = canvas.getContext('2d');
  var bar_top = ~~(HEIGHT / 1.1);
  var bar_height = BAR_HEIGHT + bar_top;
  var imageData = ctx.getImageData(0,0,WIDTH, HEIGHT);
  var data = imageData.data;
  var inputs = null;
  var setPixel = (function(){
    function _setPixel(x, y, color, alpha){
      if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
        var idx = (x + y * WIDTH)*4;
        if(data[idx+3] !== 254) {
          data[idx+0] = color[0];
          data[idx+1] = color[1];
          data[idx+2] = color[2];
          data[idx+3] = alpha;
        }
      }
    }
    _setPixel.flush = function(){
      _setPixel.tail();
      ctx.putImageData(imageData, 0, 0);
    };
    _setPixel.remove = function(x,y){
      if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
        var idx = (x + y * WIDTH)*4;
        data[idx+0] = 0;
        data[idx+1] = 0;
        data[idx+2] = 0;
        data[idx+3] = 0;
      }
    };
    _setPixel.tail = function(){
      for (var i = 3, l = data.length;i < l;i+=4){
        if(data[i] < 253) {
          if (data[i] < 10) {
            data[i] = 0;
          } else {
            data[i] *= 0.8;
          }
        }
      }
    };
    return _setPixel;
  })();
  var blocks = new Blocks(WIDTH, HEIGHT/4);
  var balls = [];
  balls.push(new Particle(WIDTH / 2, HEIGHT / 2, [255, 255, 255, 250], Math.random() *10, -Math.random() * 9 - 1));
  var left = WIDTH / 3, right = left + 50;
  var fallBlocks = [];
  var interval = setInterval(function () {
    if(isIE){
      imageData = ctx.getImageData(0,0,WIDTH, HEIGHT);
      data = imageData.data;
    }
    var i = balls.length;
    while(i--) {
      var ball = balls[i];
      var bvx = ball.vx;
      var bvy = ball.vy;
      var bspeed = Math.sqrt(bvx * bvx + bvy * bvy);
      var bradius = Math.atan2(bvy, bvx);
      for (var j = 0; j < bspeed; ++j) {
        var old_ball_x = ball.x;
        var old_ball_y = ball.y;
        ball.x += ball.vx / bspeed;
        ball.y += ball.vy / bspeed;
        var _x = ~~ball.x, _y = ~~ball.y;
        var xs = blocks.p2d[_x];
        var hit = xs && xs[_y];
		var changed = hit;
        if (hit) {
          blocks.count--;
          delete blocks.p2d[_x][_y];
          setPixel.remove(_x, _y);
          hit.vx = Math.cos(bradius + Math.PI*2 / 30 * Math.random() - 15) * 1;
          hit.vy = 0.4;
          fallBlocks.push(hit);
          ball.vy = -ball.vy;
          chime.effect(snd3);
        } else if ((ball.x < 0 && ball.vx < 0) || (ball.x > WIDTH && ball.vx > 0)) {
          ball.vx = -ball.vx;
          changed = true;
        } else if (ball.y < 0 && ball.vy < 0) {
          ball.vy = -ball.vy;
          changed = true;
        } else if (ball.y > HEIGHT) {
          balls.splice(i, 1);
          break;
        } else if (hitTestBar(ball.x, ball.y)) {
          ball.vy = -Math.abs(ball.vy);
		  changed = true;
        } else {
          setPixel(_x, _y, ball.color, 250);
        }
        if (changed)
          chime.effect(snd2);
      }
    }
    var n = fallBlocks.length;
    while (n--) {
      var fallP = fallBlocks[n];
      fallP.vy += 0.1;
      var l = 3;
      while(l--){
        fallP.x += fallP.vx;
        fallP.y += fallP.vy;
        setPixel(~~fallP.x, ~~fallP.y, fallP.color, 250);
        if (hitTestBar(fallP.x, fallP.y)) {
          fallP.y = bar_top;
          var newball = new Particle(fallP.x,fallP.y, fallP.color,Math.random() * 10, Math.random() * 9 + 1);
          balls.push(newball);
          fallBlocks.splice(n, 1);
          break;
        } else if (fallP.y > HEIGHT) {
          fallBlocks.splice(n, 1);
          break;
        }
      }
    }
    setPixel.flush();
    Bar(left);
    if (blocks.count === 0){
      clear.style.display = 'block';
      setTimeout(function(){clear.style.display = 'none';},5000);
      blocks.count = -1;
	  chime.bgm(bgm2);
    }
  }, TIME);
  Fire = function(){
    var c = ColorHSV(360 * Math.random());
    c[3] = 240;
    balls.push(new Particle(left+BAR_WIDTH/2,bar_top - 1, c, Math.random() *10, -Math.random() * 9 - 1));
    chime.effect(snd1);
  };
  canvas.onclick = Fire;
  field.onmousemove = function (e) {
    Bar((e.clientX - canvas.offsetLeft) / 1 - BAR_WIDTH*0.75);
  };
  field.ontouchstart = function (e) {
    Bar(e.touches[0].pageX);
    e.preventDefault();
  };
  field.ontouchmove = function (e) {
    Bar(e.touches[0].pageX);
    e.preventDefault();
  };
  field.ontouchend = function (e) {
    Bar(e.touches[0].pageX);
    e.preventDefault();
  };
  function Blocks (width, height) {
    var particle2d = [];
    for (var x = 0; x < width; ++x) {
      particle2d[x] = [];
      var color = ColorHSV(360 * x / width);
      for (var y = 0; y < height; ++y) {
        particle2d[x][y] = new Particle(x, y, color);
        setPixel(x, y, color, 254);
      };
    };
    this.p2d = particle2d;
    this.count = x * y;
  }

  Bar = function (_left) {
    var width = BAR_WIDTH, dx, dw;
    if(left < _left){
      dx = left-1;
      dw = -(left -_left -1);
    } else {
      dx = _left + width;
      dw = -(_left - left - 1);
    }
    ctx.clearRect(dx, bar_top + 1, dw, BAR_HEIGHT);
    ctx.fillStyle = 'rgba(0, 255, 0, 250)';
    ctx.fillRect(_left, bar_top + 1, width, BAR_HEIGHT);
    left = _left;
    right = left + width;
  }

  function hitTestBar(x, y) {
    return y >= bar_top && y <= bar_height && x > left && x < right ? true : false;
  }
  function Particle (x, y, color, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
  }   
}

  navigator.requestMIDIAccess().then(function(a) {
    inputs = a.inputs();
    for (var i = 0; i < inputs.length; ++i) {
      inputs[i].onmidimessage = function (e) {
        if (e.data[0] == 0xb0) {
          if (e.data[1] == 0x00) {
            var speed = 1 - (e.data[2] / 127);
            clearInterval(timer);
            timer = setInterval(Fire, 1000 / speed);
          } else if (e.data[1] == 0x10) {
            var position = e.data[2] / 127;
            Bar((WIDTH - BAR_WIDTH) * position);
          } else if (e.data[1] == 0x20) {
            if (e.data[2] == 0 && typeof HTMLCanvasElement !== 'undefined') {
              init();
              clear.style.display = 'none';
              start.style.display = 'none';
              chime.bgm(bgm1);
            }
          }
        } else {
          console.log(e.data);
        }
      }
    }
  }, function() {});

start.onclick = function (e) {
  if(typeof HTMLCanvasElement !== 'undefined'){
    init();
    clear.style.display = 'none';
    start.style.display = 'none';
    chime.bgm(bgm1);
  }
};
clear.onclick = function (e) {
  clear.style.display = 'none';
};
var style = field.style;
style.height = canvas.height+'px';
style.width = canvas.width+'px';
style.lineHeight = canvas.height + 50 + 'px';
// from Frocessing
function ColorHSV (h) {
  var ht = h;
  var _v = 1.0, _s = 1.0;
  ht = (((ht %= 360) < 0) ? ht + 360 : ht ) / 60;
  var vt = Math.max( 0, Math.min( 0xff, _v * 0xff ) );
  var hi = Math.floor( ht );
 
  switch (hi) {
    case 0:
      _r = vt;
      _g = Math.round( vt * ( 1 - (1 - ht + hi) * _s ) );
      _b = Math.round( vt * ( 1 - _s ) );
      break;
    case 1:
      _r = Math.round( vt * ( 1 - _s * ht + _s * hi ) );
      _g = vt;
      _b = Math.round( vt * ( 1 - _s ) );
      break;
    case 2:
      _r = Math.round( vt * ( 1 - _s ) );
      _g = vt;
      _b = Math.round( vt * ( 1 - (1 - ht + hi) * _s ) );
      break;
    case 3:
      _r = Math.round( vt * ( 1 - _s ) );
      _g = Math.round( vt * ( 1 - _s * ht + _s * hi ) );
      _b = vt;
      break;
    case 4:
      _r = Math.round( vt * ( 1 - (1 - ht + hi) * _s ) );
      _g = Math.round( vt * ( 1 - _s ) );
      _b = vt;
      break;
    case 5:
      _r = vt;
      _g = Math.round( vt * ( 1 - _s ) );
      _b = Math.round( vt * ( 1 - _s * ht + _s * hi ) );
      break;
  };
  return [_r, _g, _b];
}
