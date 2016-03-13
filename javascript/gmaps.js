function initialize() {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
  	center: new google.maps.LatLng(39.7351931,-96.1178437),
  	zoom: 4,
  	mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(mapCanvas, mapOptions);
	markersArray = [];
}

function resetCenter(){
  map.setCenter(new google.maps.LatLng(39.7351931,-96.1178437));
  map.setZoom(4);
}

function plotPoint(srcLat,srcLon,title,popUpContent,markerIcon,dataLoad, infowindowObj) {
  var myLatlng = new google.maps.LatLng(srcLat, srcLon);
  var markerObj = new google.maps.Marker({
    position: myLatlng, 
    map: map, 
    title: title,
    icon: markerIcon
  });
  markersArray.push({marker:markerObj,record:dataLoad});
  var infowindow = new google.maps.InfoWindow({
    content: popUpContent
  });
  google.maps.event.addListener(markerObj, 'click', function() {
    infowindowObj.setContent(popUpContent);
    infowindowObj.open(map,markerObj);
  });
  google.maps.event.addListener(map, 'click', function() {
    infowindowObj.close();
  });
}

function drawPolygon() {
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON,
      ]
    },
    markerOptions: {icon: ''},
    polygonOptions: {
      editable: true,
      clickable: false
    }
  });
  drawingManager.setMap(map);
  ["polygoncomplete"].forEach(function(evt){
  	google.maps.event.addListener(drawingManager, evt, function(geometry) {
  		shape = geometry;
		  drawingManager.setOptions({
		  	drawingMode: null,
		    drawingControl: false
		  });
    });
  });
}

function deleteShape() {
	shape.setMap(null);
	drawPolygon();
}

function getPointsFromPoly() {
	var outData = [];
	var polygon = new google.maps.Polygon({
    paths: shape.getPaths(),
  });
  for (var i = 0; i < markersArray.length; i++) {
  	if(google.maps.geometry.poly.containsLocation(markersArray[i].marker.getPosition(), polygon) == true){
		  outData.push(markersArray[i].record);
		}
  }
  return outData;
}

function setMapOnAll(map) {
	// Clears all markers on map when set to null.
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].marker.setMap(map);
  }
}

google.maps.event.addDomListener(window, 'load', initialize);