import * as d3 from 'https://cdn.skypack.dev/d3@7';

// import modules used by the application (imports are relative to current directory)
import * as histogram from './histogram.js';
import * as barchart from './barchart.js';
import * as data from './data.js';

// locate the data files (other URLs are relative to the HTML file)
const modalityFile = "data/modality.csv";
const demographicsFile = "data/demographics.csv";

// obtain the data
const unselectedModalityData = await data.getData(modalityFile, 'Modality');
const unselectedAgeData = await data.getData(demographicsFile, 'Age');

// set dimensions (of the container) and margins (inside the container)
const dimBar  = {w: 500, h: 400};
const dimHist = {w: 700, h: 400};
const margin = { top: 20, right: 20, bottom: 90, left: 80 };

// create the SVG containers inside their divs
const svgBar = d3.select("#barchart").append("svg")
    .attr("viewBox", [0, 0, dimBar.w, dimBar.h]);
const svgHist = d3.select("#histogram").append("svg")
    .attr("viewBox", [0, 0, dimHist.w, dimHist.h]);
d3.select("svg").attr("width", '100%').attr("height", '100%');

// render the charts
barchart.draw(svgBar, unselectedModalityData, margin, dimBar);
histogram.draw(svgHist, unselectedAgeData, margin, dimHist);