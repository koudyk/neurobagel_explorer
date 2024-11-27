import * as d3 from 'https://cdn.skypack.dev/d3@7';

import {state} from "./state.js"

// import modules used by the application (imports are relative to current directory)
import * as histogram from './histogram.js';
import * as barchart from './barchart.js';
import * as symbolbar from "./symbol-bar.js";
import * as data from './data.js';

// locate the data files (other URLs are relative to the HTML file)
const modalityFile = "data/modality.csv";
const demographicsFile = "data/demographics.csv";

const modality = await data.fetch(modalityFile);
const demographics = data.fetch(demographicsFile);

// obtain the data
const unselectedModalityData = await data.getCounts(modalityFile, 'Modality');
const unselectedAgeData = await data.getCounts(demographicsFile, 'Age');

// set dimensions (of the container) and margins (inside the container)
const dimBar  = {w: 500, h: 400};
const dimHist = {w: 500, h: 400};
const dimSym  = {w: 1000, h: 100};
const margin = { top: 20, right: 20, bottom: 90, left: 80 };

// create the SVG containers inside their divs
const svgBar = d3.select("#barchart").append("svg")
    .attr("viewBox", [0, 0, dimBar.w, dimBar.h]);
const svgHist = d3.select("#histogram").append("svg")
    .attr("viewBox", [0, 0, dimHist.w, dimHist.h]);
const svgSym = d3.select("#symbol-bar").append("svg")
    .attr("viewBox", [0, 0, dimSym.w, dimSym.h]);
d3.select("svg").attr("width", '100%').attr("height", '100%');

// render the charts
symbolbar.draw(svgSym, margin, dimSym);
await barchart.draw(svgBar, modality, margin, dimBar, "grey");
histogram.draw(svgHist, unselectedAgeData, margin, dimHist);

const temp = modality.slice(100, 14000);
barchart.tempUpdate(svgBar, temp, margin, dimBar, "pink");