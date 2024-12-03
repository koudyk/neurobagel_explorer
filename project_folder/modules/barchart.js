import * as d3 from 'https://cdn.skypack.dev/d3@7';

import {state} from './state.js';


export function drawContainer(svg, subjLevelData, margin, dim)  {
    const field = "Modality";
    const groups = d3.groups(subjLevelData, d => d[field]);
    const dataset = groups.map(g => ({[field.toLowerCase()]: g[0], count: g[1].length}));
    
    // let container;
    // if (firstTime) {
    const container = svg.append("g")
        .attr("class", "chart")
        .attr("transform", `translate(0,${margin.top})`);
    // } else {
    //     container = svg.select("g.container");
    // }

    // set the ranges
    const x = d3.scaleBand()
                .range([margin.left, dim.w - margin.right])
                .padding(0.1);
    const y = d3.scaleLinear()
                .range([dim.h - margin.bottom, 0]);

    // Scale the range of the data in the domains
    x.domain(dataset.map(d => d.modality));
    y.domain([0, d3.max(dataset, d => d.count)]);



    // add the x Axis
    const xAxis = container.append("g")
        .attr('class', 'axis x-axis')
        .attr("transform", `translate(0,${dim.h - margin.bottom})`)
        .call(d3.axisBottom(x))
        .attr("class", "axis")
    xAxis.selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", ".8em")
        .attr("dy", ".70em")
        .attr("transform", "rotate(-20)")
        .style("font-size", "15");

    // text label for the x axis
    xAxis.append("text")
        .attr("transform", `translate(${(dim.w+margin.left)/2}, ${margin.bottom - 25})`)
        .style("text-anchor", "middle")
        .style("fill", "black")
        .style("font-size", "15")
        .text("Imaging Modality");

    // add the y Axis
    const yAxis = container.append("g").attr('class', 'axis y-axis')
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .style("font-size", "15");

    // text label for the y axis
    yAxis.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 5)
        .attr("x", (margin.bottom - dim.h)/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("Number of participants");


    // placing a temporary label to demonstrate the update function
    const temp = container.append("text").attr("class", "barchart-text")
        .attr("x", 100)
        .attr("y", 20)
        .style("font-size", "20");
    temp.append("tspan").text(`Min age: 0`);
    temp.append("tspan").attr("dy", "1.2em").attr("x", 100).text(`Max age: 100`);

    // save the state
    state.subjDataBar = subjLevelData;
    state.containerBar = container;
    state.svgBar = svg;
    state.margin = margin;
    state.dimBar = dim;
    state.xBar = x;
    state.yBar = y;
}

export function drawBar(fill) {
    const subjLevelData = state.subjDataBar;
    const container = state.containerBar;
    const dim = state.dimBar;
    const margin = state.margin;
    const x = state.xBar;
    const y = state.yBar;

    globalThis.state = state;

    let subjDataSubset = [];
    for (let i = 0; i < subjLevelData.length; i++) {
        if (state.subsetParticipants.indexOf(subjLevelData[i].ID) > -1 ) {
            console.log()
            subjDataSubset.push(subjLevelData[i])
        }
    }

    const field = "Modality";
    const groups = d3.groups(subjDataSubset, d => d[field]);
    const dataset = groups.map(g => ({[field.toLowerCase()]: g[0], count: g[1].length}));
    
    // create bars
    container.selectAll(".bar")
        .data(dataset)
        .join("rect")
        .attr("fill", fill)
        .attr("x", d => x(d.modality))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.count))
        .attr("height", d => dim.h - y(d.count) - margin.bottom)

    // save the state
    // state.containerBar = container;

}

export function update() {
    d3.select(".barchart-text").selectAll("tspan")
        .data(state.ageSelection)
        .text((d,i) => `${i === 0 ? 'Min' : 'Max'} age: ${d}`);
}

export function tempUpdate(container, dataSubset, margin, dim, fill) {
    const field = "Modality";
    const groups = d3.groups(dataSubset, d => d[field]);
    const dataset = groups.map(g => ({[field.toLowerCase()]: g[0], count: g[1].length}));

    // create bars
    container.selectAll(".bar")
        .data(dataset)
        .join("rect")
        .attr("fill", fill)
        .attr("x", d => x(d.modality))
        .attr("height", x.bandwidth())
        .attr("y", d => y(d.count))
        .attr("width", d => dim.h - y(d.count) - margin.bottom)

}