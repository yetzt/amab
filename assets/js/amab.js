$("document").ready(function(){

	// cache some dom elements
	var $container = $("#container");
	var $map = $("#map")

	// detect touch like leaflet
	if (!window.L_NO_TOUCH && ((window.PointerEvent || (!window.PointerEvent && window.MSPointerEvent)) || 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch))) {
		$container.addClass("has-touch");
	}

	// create maps
	var map = L.map('map', {
		minZoom: 1,
		maxZoom: 18,
	}).setView(L.latLng(0,0), 3);
	
	// map and data layer
	L.tileLayer('http://amab.yetzt.me/random/{z}/{x}/{y}', {
		minZoom: 1,
		maxZoom: 18,
		errorTileUrl: 'data:image/png;base64,R0lGODlhCAAIAIAAAP///wAAACH5BAEAAAAALAAAAAAIAAgAAAIHhI+py+1dAAA7',
		attribution: 'Map Data: <a href="https://creativecommons.org/licenses/by-sa/2.0/" class="license" rel="license" title="Creative Commons Attribution Share Alike 2.0"><i class="icon-cc"></i><i class="icon-cc-by"></i><i class="icon-cc-sa"></i></a> <a href="https://openstreetmap.org" title="OpenStreetMap">OpenStreetMap Contributors</a>.'
	}).addTo(map).on('tileerror', console.log);

	// enable geolocation
	if (navigator.geolocation) {
		$container.addClass("has-geolocation");
		var $marker = null;
		$(".geolocate","#controls").on("click", function(evt){
			evt.preventDefault();
			if ($marker) $marker.remove(null);
			$(".geolocate","#controls").addClass("spin");
			navigator.geolocation.getCurrentPosition(function(position){
				$marker = L.circle(L.latLng(position.coords.latitude, position.coords.longitude), Math.min(100, position.coords.accuracy), { stroke: true, color: "#c00", weight: 10, opacity: 0.3, fill: false, interactive: false }).addTo(map);
				setTimeout(function(){
					map.setView(L.latLng(position.coords.latitude, position.coords.longitude),17);
				},1000);
				$(".geolocate","#controls").removeClass("spin").blur();
			});
		});
	}
	
	// enable fullscreen
	if (document.fullScreenEnabled || document.mozFullScreenEnabled || document.webkitFullScreenEnabled || document.documentElement.webkitRequestFullscreen) {
		$container.addClass("has-fullscreen");
		$(".fullscreen","#controls").on("click", fullscreen);
	}
	
	// sharing
	$(".twitter","#controls").click(function(evt){
		evt.preventDefault();
		window.open('https://twitter.com/intent/tweet?url='+encodeURIComponent("http://amab.yetzt.me")+'&text='+encodeURIComponent('All Maps Are Beautiful'), "share", "width=500,height=300,status=no,scrollbars=no,resizable=no,menubar=no,toolbar=no");
	});
	
	$(".facebook","#controls").click(function(evt){
		evt.preventDefault();
		window.open('https://www.facebook.com/dialog/share?app_id=966242223397117&display=popup&href='+encodeURIComponent("http://amab.yetzt.me"), "share", "width=500,height=300,status=no,scrollbars=no,resizable=no,menubar=yes,toolbar=no");
	});

	$(".googleplus","#controls").click(function(evt){
		evt.preventDefault();
		window.open('https://plus.google.com/share?url='+encodeURIComponent("http://amab.yetzt.me"), "share", "width=500,height=300,status=no,scrollbars=no,resizable=no,menubar=no,toolbar=no");
	});

	// Re-implement zoom controls for consistency
	$(".zoom-in", "#controls").click(function () {
		map.zoomIn();
	});
	$(".zoom-out", "#controls").click(function () {
		map.zoomOut();
	});

	map.on("zoom", function () {
		var current = map.getZoom(), min = map.getMinZoom(), max = map.getMaxZoom();
		$('.zoom-out').toggleClass('disabled', current <= min);
		$('.zoom-in').toggleClass('disabled', current >= max);
	});

});

function fullscreen() {
	 if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
		$('.fullscreen i','#controls').attr("class", "icon-shrink");
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
		$('.fullscreen i','#controls').attr("class", "icon-enlarge");
	}
}
