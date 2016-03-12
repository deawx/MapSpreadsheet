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

function addToMap(CSVstring) {
  // Read fileString, convert to file object, add to map
  var data = Papa.parse(CSVstring);
  if (data.errors.length > 0){
    console.log('There were some errors parsing the CSV.');
    console.log(data.errors);
  }
  var header = data.data[0];
  data.data.forEach(function(row, index){
    if (index>0 && row.length>2){
      var rowObj = {};
      header.forEach(function(heading, index){
        rowObj[heading] = row[index];
      });
      try {
        var html = document.createElement("table");
        for (var i = 0; i < header.length; i++) {
          var tr = html.insertRow();
          tr.insertCell().innerHTML = header[i];
          tr.insertCell().innerHTML = rowObj[header[i]];
        }
        plotPoint(parseFloat(rowObj.Latitude),parseFloat(rowObj.Longitude),rowObj[header[0]],html,'',rowObj);
      }
      catch(err) {
        console.log(err);
        console.log('Failed on latitude ' + rowObj.Latitude + ' longitude ' + rowObj.Longitude);
      }
    }
  });
}

function loaded(evt) {  
  // Obtain the read file data    
  var fileString = evt.target.result;

  //Clear map of markers; drawings
  setMapOnAll(null);

  // Add points to google map
  addToMap(fileString);

  //Start the drawing tool for point selection
  drawPolygon();
}

function exportPoints() {
  var outData = getPointsFromPoly();
  var header = Object.keys(outData[0]);
  var csvContent = header.toString() + '\n';

  for (var i = 0; i < outData.length; i++) {
    header.forEach(function(heading){
      csvContent += '"' + outData[i][heading] + '",';
    });
    csvContent = csvContent.substring(0, csvContent.length -1) + '\n';
  }

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

