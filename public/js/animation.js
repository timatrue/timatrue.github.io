window.animation = (function(){
	//canvas variables
	const canvas = document.querySelector('canvas'), divParent = document.getElementById('canvas_container');
	var	ctx = canvas.getContext("2d"), styleSheetHeart = document.styleSheets[1], myReq, heartAnimRun = false;

	//Setup canvas animation
	var setup = {
		scaleFactor : 0.7,
		distance : 0,
		color : '#E74C3C',
		stepX : 3,
		stepUpY : 15,
		stepDownY : 20
	}, fpsSetup = {
		fps : 25,
		ms : 1000,
		get interval(){ 
			return this.ms/this.fps;
		}
	}, timerSetup = {
		lastTime : (new Date()).getTime(),
		currentTime : 0,
		get delta() {
			this.currentTime = (new Date()).getTime();
			return this.currentTime - this.lastTime;
			}
	}, heartSetup = {
		randomBeat : 0.07,
		minRunTime : 300
	}
	var settingsCanvas = new SettingsLineCanvas(setup.distance, setup.stepX);
	var lineCanvas = new LineCanvas(setup.stepX, setup.color);
	var zigZagCanvas = new ZigZagCanvas(setup.stepX, setup.stepUpY, setup.stepDownY, setup.color);
	canvas.width = canvasWidth();

	window.addEventListener('load', function load(event){
		window.removeEventListener('load', load, false);
		initCanvas();
	});
	window.addEventListener('resize', resize, false);

	function resize(event){
		initCanvas();
	}
	function SettingsLineCanvas(distance){
		this.distance = distance;								
		this.height = canvas.height/2;
	}
	function LineCanvas(stepX, color){
		this.stepX = stepX;
		this.color = color;
		this.draw = function() {
			ctx.beginPath();
			ctx.strokeStyle = this.color;
			ctx.moveTo(settingsCanvas.distance, settingsCanvas.height); 
			settingsCanvas.distance += this.stepX;
			ctx.lineTo(settingsCanvas.distance, settingsCanvas.height);
			ctx.stroke();
			
		}
	}			
	function ZigZagCanvas(stepX, stepUpY, stepDownY, color ){
		this.stepX = stepX;
		this.stepUpY = stepUpY;
		this.stepDownY = stepDownY;
		this.color = color;
		this.draw = function() {
			var _random = getRandom()*getRandomSign();
			var _distance = settingsCanvas.distance;
			var _height = settingsCanvas.height + _random;
			ctx.strokeStyle = this.color;
			ctx.beginPath();
			ctx.moveTo(_distance, _height);
			
			//move up
			_distance += this.stepX;
			_height -= this.stepUpY;
			ctx.lineTo(_distance, _height);
			
			//move down
			_distance += this.stepX;
			_height += this.stepDownY;
			ctx.lineTo(_distance, _height);	
			
			//move up	
			_distance += this.stepX;
			ctx.lineTo(_distance, settingsCanvas.height);
			
			settingsCanvas.distance = _distance;
			ctx.stroke();
			
		}
	}
	function initCanvas(){
		canvas.width = canvasWidth();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		settingsCanvas.distance = 0;
		cancelAnimationFrame(myReq);
		heartAnimationInfinite(false);
		myReq = requestAnimationFrame(drawHeartBeat);	
	}
	function drawHeartBeat(){
		
		if(timerSetup.delta > fpsSetup.interval ){
		
			if(heartBeat()) {
				zigZagCanvas.draw();
			}				
			else {
				lineCanvas.draw();
			}
			timerSetup.lastTime = timerSetup.currentTime - (timerSetup.delta % fpsSetup.interval);
		}
		if(settingsCanvas.distance > canvas.width) {
			cancelAnimationFrame(myReq);
			heartAnimationInfinite(true);
		}
		else myReq = requestAnimationFrame(drawHeartBeat);				
	}				
	function heartBeat() {
		var beat = (getRandom() < heartSetup.randomBeat) ? checkTimerHeart() : false;
		return beat;
	}
	function checkTimerHeart(){
		if(heartAnimRun != true){
			heartAnimation(true);
			heartAnimRun = true;
			setTimeout(timerEvent,heartSetup.minRunTime);
			return true;
		}
		return false;
	}
	function timerEvent(){ 
		heartAnimRun = false;
		heartAnimation(false);
	}
	function getRandom() {
		return Math.random();
	}
	function getRandomSign(){
		return sign = Math.round(Math.random()) * 2 - 1;
	}
	function heartAnimation(bool){
		if(bool) styleSheetHeart.insertRule('#imageHeart { animation: beat 0.2s ease alternate;}',0);
		else styleSheetHeart.deleteRule(0);
	}
	function heartAnimationInfinite(bool){
		var heartImage = document.querySelector('#imageHeart');
		if(bool) heartImage.classList.add("imageHeart");
		else heartImage.classList.remove("imageHeart");
	}
	function canvasWidth(){
		return divParent.clientWidth * setup.scaleFactor;
	}
	return {
		initCanvas : initCanvas
	}
})();