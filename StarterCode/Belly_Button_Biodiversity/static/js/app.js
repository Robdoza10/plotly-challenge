function buildMetadata(sample) {

  d3.json(`/metadata/${sample}`).then(metadata => {
    // Use d3 to select the panel with id of `#sample-metadata`
	var sampleMetadata = d3.select('#sample-metadata')
    // Use `.html("") to clear any existing metadata
	sampleMetadata.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (let [key, val] of Object.entries(metadata)) {
    	sampleMetadata.append('p').html(`<b>${key}: ${val}</b>`)
    }
  })
}

function buildBubbleChart({ otu_ids, otu_labels, sample_values }) {
  var trace1 = {
    x: otu_ids,
    y: sample_values,
    mode: 'markers',
    hovertext: otu_labels,
    marker: {
      size: sample_values,
      color: otu_ids,
    }
  };

  var data = [trace1];

  var layout = {
    title: 'Marker Size',
    showlegend: false,
    height: 600,
    width: 600
  };

  Plotly.newPlot('bubble', data, layout);
}


function buildPieChart(data) {
	var data = [{
      values: data.sample_values,
      labels: data.otu_ids,
      hovertext: data.otu_labels,
      type: 'pie'
    }];

    var layout = {
      height: 400,
      width: 500
    };

    Plotly.newPlot('pie', data, layout);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
	d3.json(`/samples/${sample}`).then(data => {
      // @TODO: Build a Bubble Chart using the sample data
      buildBubbleChart(data)
      // @TODO: Build a Pie Chart

      buildPieChart({
          otu_ids: data.otu_ids.slice(0, 10),
          otu_labels: data.otu_labels.slice(0, 10),
          sample_values: data.sample_values.slice(0, 10),
      })
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
console.log ("init is working")
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
