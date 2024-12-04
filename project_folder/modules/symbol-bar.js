import * as d3 from "https://cdn.skypack.dev/d3@7";
// Display a list of 10 symbols, side by side
// This example uses circles
import {state} from "./state.js"


export function drawContainer(svg, margin, dim) {
    const container = svg.append("g")
        .attr("class", "chart")
        .attr("transform", `translate(0,${margin.top})`);

    // placing a temporary label to demonstrate the update function
    const symbolbarText = container.append("text").attr("class", "symbolbar-text")
        .attr("x", 850)
        .attr("y", 2)
        .style("font-size", "20");
    symbolbarText.append("tspan").text(`Count:`);

    state.svgSym = svg;
    state.dimSym = dim;
}

export function drawSymbols(fill="grey") {
    const svg = state.svgSym;
    const dim = state.dimSym;
    const count = state.numSubjSelected;
    const maxCount = state.numSubjTotal;

    const dataset = count.map((d,i) => ({id: i, value: d})); // so that bars can be identified
    const cells = d3.range(25);     // number of symbols in each bar
    const scale = d3.scaleLinear()
                    .domain([0, maxCount])
                    .range([0, 25])
                    .clamp(true);

    // Rectangle that will clip the circles
    svg.selectAll("rect")
        .data(dataset)
            .join("rect")
                .attr("id", (d,i) => `data-bar-${i}`)  // id for clipPath
                .attr("y", 30).attr("height", 40)
                .attr("width", d => scale(d.value))
                .style("fill", "white")
                .attr("transform", (d,i) => `translate(0, ${i * 50})`);

    // Create clipping paths linked to the bars
    const defs = svg.append("defs");
    dataset.forEach((d,i) => {
        defs.append("clipPath")
            .attr("id", `clip-${i}`)
            .append("use").attr("transform", `translate(0, ${i * 50})`)
            .attr("xlink:href", `#data-bar-${i}`);
    });

    const cellsSelected = d3.range(scale(count));
    globalThis.cellsSelected = cellsSelected;
    cellsSelected.forEach((i) => {
        createSymbol(i, `url(#clip-${i})`, fill)
    });

    // create symbols
    function createSymbol(y, clip, fill) {
        const icon = svg.append("image")
            .attr("xlink:href", `./figures/person-icon-${fill}.svg`)
            .attr("height", `${dim.h * 0.6}`)
            .attr("transform", `translate(${y * 40}, 50)`)
        const symbols = icon.append("g")
            .attr("clip-path", clip)
        addSymbols(symbols, cells, "blue", "none");
        addSymbols(icon.append("g"), cells, "none", "none");
    }  

    // Add the bar symbols (circles)
    function addSymbols(container, dataset) {
        container.selectAll("path")
                .data(dataset)
                    .join("path")
                        .attr("d", d3.symbol().size(1250))
                        .attr("transform", (d, i) => `translate(${i * 40 + 20}, 50)`);
    }
}

export function update() {
    d3.select(".symbolbar-text").selectAll("tspan")
        .data(state.numSubjSelected)
        .text((d,i) => `${'Count'}: ${d}`);    
}