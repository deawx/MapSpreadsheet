function initialize() {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
	center: new google.maps.LatLng(39.5536802,-79.9403624),
	zoom: 8,
	mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(mapCanvas, mapOptions);
	markersArray = [];
}

function plotPoint(srcLat,srcLon,title,popUpContent,markerIcon) {
  var myLatlng = new google.maps.LatLng(srcLat, srcLon);
  var marker = new google.maps.Marker({
    position: myLatlng, 
    map: map, 
    title: title,
    icon: markerIcon
  });
  markersArray.push(marker);
  var infowindow = new google.maps.InfoWindow({
    content: popUpContent
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
  google.maps.event.addListener(map, 'click', function() {
    infowindow.close();
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
  		shape = geometry
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
	var outPoints = []
	var polygon = new google.maps.Polygon({
    paths: shape.getPaths(),
  });
  for (var i = 0; i < markersArray.length; i++) {
  	if(google.maps.geometry.poly.containsLocation(markersArray[i].getPosition(), polygon) == true){
		  outPoints.push(markersArray[i]);
		}
  }
  return outPoints;
}

function exportPoints() {
	var outPoints = getPointsFromPoly()

}

function setMapOnAll(map) {
	// Clears all markers on map when set to null.
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(map);
  }
}

google.maps.event.addDomListener(window, 'load', initialize);