function startRead(evt) {  
  var file = document.getElementById('file').files[0];
  if(file){
    getAsText(file);
    }
}

function getAsText(readFile) {
  var reader = new FileReader();
  
  // Read file into memory as UTF-16      
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
    plotPoint(parseFloat(line[0]),parseFloat(line[1]),lines[i],html);
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

function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableError") {
    // The file could not be read
    alert('Error reading file.');
  }
}