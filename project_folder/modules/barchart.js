import * as d3 from 'https://cdn.skypack.dev/d3@7';

import {state} from './state.js';

export function draw(svg, subjLevelData, margin, dim, fill) {
    const field = "Modality";
    const groups = d3.groups(subjLevelData, d => d[field]);
    const dataset = groups.map(g => ({[field.toLowerCase()]: g[0], count: g[1].length}));

    const width = dim.w,
          height = dim.h;

    const container = svg.append("g")
                         .attr("class", "chart")
                         .attr("transform", `translate(0,${margin.top})`);
    // set the ranges
    const x = d3.scaleBand()
                .range([margin.left, width - margin.right])
                .padding(0.1);
    const y = d3.scaleLinear()
                .range([height - margin.bottom, 0]);

    // Scale the range of the data in the domains
    x.domain(dataset.map(d => d.modality));
    y.domain([0, d3.max(dataset, d => d.count)]);

    // make some variables available for other functions
    globalThis.x = x;
    globalThis.y = y;
    globalThis.container = container;

    // create bars
    container.selectAll(".bar")
        .data(dataset)
        .join("rect")
        .attr("fill", fill)
        .attr("x", d => x(d.modality))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.count))
        .attr("height", d => height - y(d.count) - margin.bottom)

    // add the x Axis
    const xAxis = container.append("g")
        .attr('class', 'axis x-axis')
        .attr("transform", `translate(0,${height - margin.bottom})`)
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
        .attr("transform", `translate(${(width+margin.left)/2}, ${margin.bottom - 25})`)
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
        .attr("x", (margin.bottom - height)/2)
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
    return
}

export function update() {
    d3.select(".barchart-text").selectAll("tspan")
        .data(state.ageSelection)
        .text((d,i) => `${i === 0 ? 'Min' : 'Max'} age: ${d}`);
}

export function tempUpdate(svg, dataSubset, margin, dim, fill) {
    const field = "Modality";
    const groups = d3.groups(dataSubset, d => d[field]);
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

}