function startRead(evt) {
  var file = document.getElementById('file').files[0];
  if(file){
    getAsText(file);
    $('#filename').html(file.name);
    $('#export').prop('disabled', false);
    $('#deleteShape').prop('disabled', false);
  }
}

function getAsText(readFile) {
  var reader = new FileReader();
  
  // Read file into memory as UTF-8
  reader.readAsText(readFile, "UTF-8");
  
  // Handle progress, success, and errors
  reader.onload = loaded;
  reader.onerror = errorHandler;
}

function addToMap(fileString) {
  // Read fileString, split array of lines
  lines = fileString.split('\n');
  for (var i = 0; i < lines.length; i++){
    line = lines[i].split(',');
    html = "<h4>"+line[2]+"</h4>Lat: "+line[0]+"<br>Lon: "+line[1]
    plotPoint(parseFloat(line[0]),parseFloat(line[1]),line[2],html,'',lines[i]);
  }
}

function loaded(evt) {  
  // Obtain the read file data    
  var fileString = evt.target.result;

  //Clear map of markers; drawings
  setMapOnAll(null)

  // Add points to google map
  addToMap(fileString);

  //Start the drawing tool for point selection
  drawPolygon()
}

function exportPoints() {
  var outData = getPointsFromPoly();
  var csvContent = outData.join("\n");

  var a = document.createElement('a');
  encodedUri = encodeURI('data:attachment/csv,' + csvContent);
  a.href = encodedUri;
  a.target ='_blank';
  a.download = 'dataSubset.csv'
  document.body.appendChild(a);
  a.click();
}

function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableError") {
    // The file could not be read
    alert('Error reading file.');
  }
}