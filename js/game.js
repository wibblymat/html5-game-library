if( window.Wibbly == null ) window.Wibbly = {};

Wibbly.game = {
	'canvas': null,
	'audio': null,
	'input': null,
	'level': null,
	'player': null,
	'reset': function()
	{
		this.canvas = null;
		this.audio = null;
		this.input = null;
		this.level = null;
		this.player = null;
	},
	'start': function()
	{
		this.canvas = new Wibbly.Canvas( document.getElementById( "game" ) );
		this.audio = new Wibbly.Audio();
		this.input = new Wibbly.Input();
		this.level = Wibbly.levels[ 0 ];
		this.loadSprites();
		this.loadSounds();
		this.player = new Wibbly.Player();
		this.player.moveTo( this.level.spawnPoint );
		this.tick();
	},
	'tick': function()
	{
//		console.log( 1000 / ( new Date().getTime() - this.lastFrame ) );
//		this.lastFrame = new Date().getTime();
		var self = this;
		requestAnimationFrame( function(){ self.tick() } );
		this.update();
		this.draw();
	},
	'update': function()
	{
		// Get input, move npcs, etc.
		for( var key in this.input.keys )
		{
			switch( key )
			{
				case "32": // [Space]
				{
					this.audio.play( "low-roar" );
					delete this.input.keys[ key ];
					break;
				}

				case "65": // A
				{
					this.player.x--;
					break;
				}

				case "68": // D
				{
					this.player.x++;
					break;
				}

				case "83": // S
				{
					this.player.y++;
					break;
				}

				case "87": // W
				{
					this.player.y--;
					break;
				}

				default:
				{
					console.log( String.fromCharCode( key ) + " - " + key );
				}
			}
		}
	},
	'draw': function()
	{
		// Step animation frames and then send all objects to be drawn to the canvas wrapper
		this.canvas.drawLevel( this.level );
		var objects = [ this.player ];
		this.canvas.drawObjects( objects );
	},
	'loadSprites': function()
	{
		var sprites = [ "void", "grass", "ball" ];

		for( var index in sprites )
		{
			var sprite = sprites[ index ]
			this.canvas.makeSprite( index, sprite, document.getElementById( sprite ) );
		}
	},
	'loadSounds': function()
	{
		var elements = document.getElementById( "media" ).getElementsByTagName( "audio" );

		for( var i in elements )
		{
			var audio = elements[ i ];
			this.audio.addSound( audio.id, audio );
		}
	}
};




// requestAnimationFrame polyfill
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = 
		  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
})();
