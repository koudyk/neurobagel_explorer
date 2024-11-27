import * as d3 from "https://cdn.skypack.dev/d3@7";
// Display a list of 10 symbols, side by side
// This example uses circles
import {state} from "./state.js"

export function draw(svg, count, maxCount, margin, dim) {

    const data = count.map((d,i) => ({id: i, value: d})); // so that bars can be identified
    const cells = d3.range(100);     // number of symbols in each bar
    const scale = d3.scaleLinear()
                    .domain([0, maxCount])
                    .range([0, dim.w - 100])
                    .clamp(true);

    const container = svg.append("g")
        .attr("class", "chart")
        .attr("transform", `translate(0,${margin.top})`);

    // Rectangle that will clip the circles
    svg.selectAll("rect")
        .data(data)
            .join("rect")
                .attr("id", (d,i) => `data-bar-${i}`)  // id for clipPath
                .attr("y", 30).attr("height", 40)
                .attr("width", d => scale(d.value))
                .style("fill", "white").style("opacity", 0.01)
                .attr("transform", (d,i) => `translate(0, ${i * 50})`);

    // Create the bars
    data.forEach((d,i) => {
        createBar(i*50, `url(#clip-${i})`, "grey");
    })

    // Create clipping paths linked to the bars
    const defs = svg.append("defs");
    data.forEach((d,i) => {
        defs.append("clipPath")
            .attr("id", `clip-${i}`)
            .append("use").attr("transform", `translate(0, ${i * -50})`)
            .attr("xlink:href", `#data-bar-${i}`);
    });

    // Create a bar with symbols
    function createBar(y, clip, fill) {
        const bar = svg.append("g")
                    .attr("transform", `translate(0, ${y})`);
        const symbols = bar.append("g")
                        .attr("clip-path", clip);
        addSymbols(symbols, cells, fill, "none");
        // addSymbols(bar.append("g"), cells, "none", stroke); // add guides
    }

    // Add the bar symbols (circles)
    function addSymbols(container, data, fill, stroke) {
        container.selectAll("path")
                .data(data)
                    .join("path")
                        .attr("d", d3.symbol().size(1250))
                        .attr("transform", (d, i) => `translate(${i * 40 + 20}, 50)`)
                        .attr("class", "symbol-bar")
                        .style("stroke", stroke);
    }
        // placing a temporary label to demonstrate the update function
    const temp = container.append("text").attr("class", "symbolbar-text")
        .attr("x", 850)
        .attr("y", 20)
        .style("font-size", "20");
    temp.append("tspan").text(`Count: 0`);
}

export function update() {
    d3.select(".symbolbar-text").selectAll("tspan")
        .data(state.numSubjSelected)
        .text((d,i) => `${'Count'}: ${d}`);    
}

export function tempUpdate(svgBar, dataSubset, margin, dim, fill) {
    console.log(count);
    const data = count.map((d,i) => ({id: i, value: d})); // so that bars can be identified
    const cells = d3.range(10);     // number of symbols in each bar
    const scale = d3.scaleLinear()
                    .domain([0, count])
                    .range([0, dim.w - 100])
                    .clamp(true);

    const container = svg.append("g")
        .attr("class", "chart")
        .attr("transform", `translate(0,${margin.top})`);

    // Rectangle that will clip the circles
    svg.selectAll("rect")
        .data(data)
            .join("rect")
                .attr("id", (d,i) => `data-bar-${i}`)  // id for clipPath
                .attr("y", 30).attr("height", 40)
                .attr("width", d => scale(d.value))
                .style("fill", "white").style("opacity", 0.01)
                .attr("transform", (d,i) => `translate(0, ${i * 50})`);

    // Create the bars
    data.forEach((d,i) => {
        createBar(i*50, `url(#clip-${i})`, "grey");
    })

    // Create clipping paths linked to the bars
    const defs = svg.append("defs");
    data.forEach((d,i) => {
        defs.append("clipPath")
            .attr("id", `clip-${i}`)
            .append("use").attr("transform", `translate(0, ${i * -50})`)
            .attr("xlink:href", `#data-bar-${i}`);
    });

    // Create a bar with symbols
    function createBar(y, clip, fill) {
        const bar = svg.append("g")
                    .attr("transform", `translate(0, ${y})`);
        const symbols = bar.append("g")
                        .attr("clip-path", clip);
        addSymbols(symbols, cells, fill, "none");
        // addSymbols(bar.append("g"), cells, "none", stroke); // add guides
    }

    // Add the bar symbols (circles)
    function addSymbols(container, data, fill, stroke) {
        container.selectAll("path")
                .data(data)
                    .join("path")
                        .attr("d", d3.symbol().size(1250))
                        .attr("transform", (d, i) => `translate(${i * 40 + 20}, 50)`)
                        .attr("class", "symbol-bar")
                        .style("stroke", stroke);
    }
}