/**
 * Created by nico on 25/01/14.
 */

var actx,
	c = document.getElementById('canvas');
	ctx = c.getContext('2d'),
	size =  c.width     = Math.min( window.innerWidth, window.innerHeight ),
			c.height    = size;
	waves = [],
	PI = Math.PI,
	PI2 = PI * 2;

	var raf =   window.requestAnimationFrame		||
				window.webkitRequestAnimationFrame 	||
				window.mozRequestAnimationFrame 	||
				window.msRequestAnimationFrame 		||
				window.oRequestAnimationFrame 		||
				function(func) { setTimeout( func, 1000 / 60 ); };

	var selectedWave;
	var gain;

	//background noise
	var bg = document.createElement("canvas");
	bg.width = bg.height = 128;
	var bg_ctx = bg.getContext( "2d" );
	bg_ctx.fillStyle = "#f00";
	bg_ctx.fillRect(0,0,100,100);

	var img = bg_ctx.getImageData(0,0,128,128);
	var data = img.data;

	for( var i = 0; i < data.length; i += 4 )
	{
		var val = 0xCC + ( parseInt( Math.random() * 0x33 ));
		data[ i ] = data[ i + 1 ] = data[ i + 2 ] = val;
		data[ i + 3 ] = 255;
	}

	bg_ctx.putImageData( img,0,0 );
	document.body.style.backgroundImage = "url(" + bg.toDataURL("image/png")+ ")";


/////////////////////////////////
var RGB = function( r,g,b )
{
	this.r = r;
	this.g = g;
	this.b = b;
	//from http://www.javascripter.net/faq/rgbtohex.htm
	this.toHexString = function()
	{
		return this.toHex( this.r ) + this.toHex( this.g ) + this.toHex( this.b );
	}

	this.toHex = function toHex(n)
	{
		n = parseInt( n, 10 );
		if ( n == 0 || isNaN( n )) return "00";
		n = Math.max( 0, Math.min( n, 255 ) );
		return "0123456789ABCDEF".charAt( ( n - n % 16 ) / 16 ) + "0123456789ABCDEF".charAt( n % 16 );
	}

}

var Wave = function( frequency, detune, gain, method )
{
	this.x = 0;
	this.y = 0;

	this.dest =
	{
		frequency: frequency,
		detune: detune,
		gain: gain
	};

	this.color = null;
	this.playing = false;
	this.process = null;
	this.method = method || 0;

	switch( method )
	{
		default:
		case Wave.SINE:
			this.process = function ( n ){      return Math.sin( n * PI2 );                                };
			this.color = new RGB( 255, 64,0 );
			break;

		case Wave.SQUARE:
			this.process = function ( n ){      return Math.sin( n * PI2 ) > 0 ? 1 : -1;                   };
			this.color = new RGB( 0, 99, 204 );
			break;

		case Wave.SAWTOOTH:
			this.process = function ( n ){      return ( n - Math.floor( n +.5 ) ) * 2;                    };
			this.color = new RGB( 255, 204, 0 );
			break;

		case Wave.TRIANGLE:
			this.process = function ( n ){      return  ( 1 - Math.abs( n - Math.floor( n + .5 ) ) * 4 );  };
			this.color = new RGB( 0, 255, 102 );
			break;

		case Wave.NOISE:
			this.process = function ( n ){      return ( ( Math.random() -.5 ) * 2 );                     };
			this.color = new RGB( 0, 102, 153 );
			break;
	}

	this.render = function( normalTime, ctx )
	{

		var t = normalTime;
		var max = t + 1;
		var step = 1 / 250;

		var m = Math.sqrt( this.gain.gain.value );
		var radiusX = .45 + .35 * ( 1 - m );
		var radiusY = .12 * m;

		ctx.beginPath();
		ctx.strokeStyle = "rgba( "+ this.color.r +","+ this.color.g +","+ this.color.b +","+ 1 +")";
		ctx.fillStyle = "rgba( "+ this.color.r +","+ this.color.g +","+ this.color.b +","+ this.gain.gain.value * .5 +")"

		for( var t = normalTime; t < max; t += step )
		{

			this.x = Math.cos( t * PI2 ) * radiusX;
			this.y = ( -.5 + this.method * ( 3 * .125 ) ) + ( this.process( ( normalTime + t ) * this.osc.frequency.value ) + Math.sin( t * PI2 )  ) * radiusY;

			ctx.lineTo( this.x, this.y );

		}

		ctx.closePath();

		ctx.fill();
		ctx.stroke();

		for( t = 0; t < 1; t += .25 )
		{
			this.x = Math.cos( t * PI2 ) * radiusX;
			this.y = ( -.5 + this.method * ( 3 *.125 ) ) + ( this.process( ( normalTime + t ) * this.osc.frequency.value ) + Math.sin( t * PI2 )  ) * radiusY;

			ctx.beginPath();
			ctx.arc( this.x, this.y, 0.01, 0, PI2 );
			ctx.stroke();

		}

	}

	//create the oscillator and gain objects
	this.rebuildOSC = function()
	{
		if( actx )
		{
			if( this.gain == null )
			{
				this.gain = actx.createGain();
				this.gain.connect( actx.destination );
				this.gain.gain.value = gain;
			}
			else
			{
				this.osc.disconnect();
			}

			this.osc = actx.createOscillator();
			this.osc.connect( this.gain );
			this.osc.type = method;
			this.osc.frequency.value = frequency;
			this.osc.detune.value = detune;
			this.osc.start( 0 );
			this.playing = true;

		}
		//generic object to handle graphics only (unicorn-mode)
		else
		{
			this.osc = {
						frequency: { value: frequency },
						detune: { value: frequency },
						start : function(value){},
						stop : function(value){}
			};
			this.gain = {
						gain: { value:gain }
			};
		}
	}
	this.rebuildOSC();

}

Wave.SINE           = 0;
Wave.SQUARE         = 1;
Wave.SAWTOOTH       = 2;
Wave.TRIANGLE       = 3;

/////////////////////////////////

function update()
{

	ctx.restore();

	size =  c.width     = Math.min( window.innerWidth, window.innerHeight ),
			c.height    = size;
	container.style.width = size + "px";

	var time = Date.now() * 0.0001;
	ctx.clearRect( 0,0, c.width, c.height );

	//normalized unit
	var nu = 1 / size;

	//normalized time : -1 >= NT >= 1
	normalTime = -1 + ( time % 1 ) * 2;

	ctx.save();
	ctx.scale( c.width / 2 , c.height / 2 );
	ctx.translate( 1 + nu, 1 + nu );

	ctx.lineCap = "round";
	ctx.lineWidth = nu * 4;

	for( var i =0; i < waves.length; i++)
	{

		var w = waves[ i ];
		w.render( normalTime, ctx );

		w.osc.frequency.value += ( w.dest.frequency - w.osc.frequency.value ) *.1;
		w.osc.detune.value += ( w.dest.detune - w.osc.detune.value ) *.1;
		w.gain.gain.value += ( w.dest.gain - w.gain.gain.value ) *.1;

	}

	updateSettings();
	raf( update );

}

function init()
{

	actx = window['AudioContext'] ? new AudioContext() : window['webkitAudioContext'] ? new webkitAudioContext() : null;

	if( !actx )
	{
		console.log( 'NOOooooooooOOOOooooOOOOOHH !! ! !\n couldn\'t find the AUDIO CONTEXT....\n QUICK ! \n' );
		console.log( "                                                    / \n                                                  .7  \n                                       \       , //   \n                                       |\.--._/|//    \n                                      /\ ) ) ).'/     \n                                     /(  \  // /      \n                                    /(   J`((_/ \     \n                                   / ) | _\     /     \n                                  /|)  \  eJ    L     \n                                 |  \ L \   L   L     \n                                /  \  J  `. J   L     \n                                |  )   L   \/   \     \n                               /  \    J   (\   /     \n             _....___         |  \      \   \```      \n      ,.._.-'        '''--...-||\     -. \   \        \n    .'.=.'                    `         `.\ [ Y       \n   /   /                                  \]  J       \n  Y / Y                                    Y   L      \n  | | |          \                         |   L      \n  | | |           Y                        A  J       \n  |   I           |                       /I\ /       \n  |    \          I             \        ( |]/|       \n  J     \         /._           /        -tI/ |       \n   L     )       /   /'-------'J           `'-:.      \n   J   .'      ,'  ,' ,     \   `'-.__          \     \n    \ T      ,'  ,'   )\    /|        ';'---7   /     \n     \|    ,'L  Y...-' / _.' /         \   /   /      \n      J   Y  |  J    .'-'   /         ,--.(   /       \n       L  |  J   L -'     .'         /  |    /\       \n       |  J.  L  J     .-;.-/       |    \ .' /       \n       J   L`-J   L____,.-'`        |  _.-'   |       \n        L  J   L  J                  ``  J    |       \n        J   L  |   L                     J    |       \n         L  J  L    \                    L    \       \n         |   L  ) _.'\                    ) _.'\      \n         L    \('`    \                  ('`    \     \n          ) _.'\`-....'                   `-....'     \n         ('`    \                                     \n          `-.___/   sk                                ");
		console.log( " UNICORN FALLBACK!!!\n\n\n ");
	}

	var container = document.getElementById( "container" );
	container.style.width = size + "px";

	ctx.fillStyle = "#FFF";
	ctx.fillRect( 0,0,size, size );

	waves.push( new Wave(   12,  2393,      1,  Wave.SINE       ) );
	waves.push( new Wave(   4,      0,      .65,	Wave.SQUARE     ) );
	waves.push( new Wave(   1,      0,      .25,  Wave.SAWTOOTH   ) );
	waves.push( new Wave(   240,    0,      .3,	Wave.TRIANGLE   ) );

	setWave( 0 );

}

/////////////////////////////////////////

// UI

/////////////////////////////////////////

function setWave( value )
{
	selectedWave = waves[ parseInt( value ) ];
	updateSettings();
}
function setFrequency( element )
{
	selectedWave.osc.frequency.value = selectedWave.dest.frequency = element.value;
	updateSettings();
}
function setDetune( element )
{
	selectedWave.osc.detune.value = selectedWave.dest.detune = element.value;
	updateSettings();
}
function setGain( element )
{
	selectedWave.gain.gain.value = selectedWave.dest.gain = element.value;
	updateSettings();
}

function startStop( value )
{
	//alternative : rebuild the oscillator
	//they will run out of sync
	if( waves[ value ].playing )
	{
//		waves[ value ].osc.stop(0);
		waves[ value ].dest.gain = 0;
		waves[ value ].playing = false;
	}
	else
	{
//		waves[ value ].rebuildOSC();
		waves[ value ].dest.gain = 1;
		waves[ value ].playing = true;
	}
	setWave( value );
}

function reset()
{
	waves.forEach( function( w )
	{
		selectedWave = w;
		selectedWave.osc.frequency.value    = selectedWave.dest.frequency    =1;
		selectedWave.osc.detune.value       = selectedWave.dest.detune       =0;
		selectedWave.gain.gain.value        = selectedWave.dest.gain         =1;
		updateSettings();
	});
	setWave( 0 );
}

function randomize()
{
	waves.forEach( function( w )
	{
		if( w.playing )
		{
			w.dest.frequency    = Math.max( 1, Math.min( w.dest.frequency + parseInt( ( Math.random() -.5 ) * 10 ), 440 ) );
			w.dest.detune       = Math.max( -5000, Math.min( w.dest.detune + parseInt( ( Math.random() -.5 ) * 20 ), 5000 ) );
			w.dest.gain         += ( Math.random() -.5 ) * .1;
		}
	});
}

function updateSettings()
{

	document.getElementById( "frequencyInput").value = selectedWave.osc.frequency.value;
	document.getElementById( "frequencyRate").innerHTML = ""+ parseInt( selectedWave.osc.frequency.value, 10 );

	document.getElementById( "detuneInput").value = selectedWave.osc.detune.value;
	document.getElementById( "detuneRate").innerHTML = ""+ parseInt( selectedWave.osc.detune.value, 10 );

	document.getElementById( "gainInput").value = selectedWave.gain.gain.value;
	document.getElementById( "gainRate").innerHTML = ""+ parseFloat( selectedWave.gain.gain.value).toFixed( 2 );

	var radio = document.getElementsByName( "wave" );
	for( var i =0; i< radio.length; i++ )
	{
		radio.item( i ).checked = radio.item( i ).value == selectedWave.method;
	}

};

/////////////////////////////////////////

// GO UNICORN GO !

/////////////////////////////////////////

init();

raf( update );

startStop( "0" );
startStop( "1" );
startStop( "2" );
startStop( "3" );