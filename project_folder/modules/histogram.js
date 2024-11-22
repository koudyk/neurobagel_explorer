import * as d3 from 'https://cdn.skypack.dev/d3@7';

import * as barchart from './barchart.js';
import {state} from './state.js';

export function draw(svg, data, margin, dim) {
    const width = dim.w,
          height = dim.h;

    const container = svg.append("g")
                         .attr("class", "chart")
                         .attr("transform", `translate(0,${margin.top})`);

    const x = d3.scaleLinear()
                .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
                .range([height - margin.bottom, 0]);

    const valueLine = d3.area()
                        .x(d => x(d.age))
                        .y1(d => y(d.count))
                        .y0(y(0));

    // Scale the range of the data in the domains
    x.domain([0, d3.max(data, d => d.age)]);
    y.domain([0, d3.max(data, d => d.count)]);

    // add the valueLine path
    container.append("path")
             .datum(data)
                .attr("class", "line")
                .attr("d", valueLine);

    // add the x Axis
    const xAxis = container.append("g").attr('class', 'axis x-axis')
                           .attr("transform", `translate(0,${height - margin.bottom})`)
                           .call(d3.axisBottom(x))
                           .style("font-size", "15")

    // text label for the x axis
    xAxis.append("text")
         .attr("transform", `translate(${(width+margin.left)/2}, ${margin.bottom/2})`)
         .style("text-anchor", "middle")
         .style("fill", "black")
         .text("Age (Years)");

    // add the y Axis
    const yAxis = container.append("g").attr('class', 'axis y-axis')
             .attr("transform", `translate(${margin.left},0)`)
             .call(d3.axisLeft(y))
             .style("font-size", "15");

    // text label for the y axis
    yAxis.append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", -margin.left + 10)
         .attr("x", (margin.bottom - height)/2)
         .attr("dy", "1em")
         .style("text-anchor", "middle")
         .style("fill", "black")
         .text("Number of participants");

    // add an invisible overlay, which will show the brush's selection
    container.append("path").attr("class", "overlay")
        .datum(data)
        .style("fill", 'none') // invisible
        .attr("d", valueLine);

    // Brush configuration
    const brush = d3.brushX()
        .extent([[margin.left, 0], [width - margin.right, height - margin.bottom]]) // brush extent is the chart area
        .on("brush", function (evt) {
            if(evt.selection) {
                const [minX,maxX] = evt.selection;
                const minAge = Math.round(x.invert(minX));
                const maxAge = Math.round(x.invert(maxX));

                state.ageSelection = [minAge, maxAge]; // store the data collected by the brush
                barchart.update(); // update the bar chart
            }
        })
        .on("end", function (evt) {
            if(evt.selection) {
                const [minX, maxX] = evt.selection;
                const minAge = Math.round(x.invert(minX));
                const maxAge = Math.round(x.invert(maxX))

                console.log(minAge, maxAge);           // this is the final data collected by the brush
                state.ageSelection = [minAge, maxAge]; // store the final data collected by the brush
                barchart.update();                     // update the bar chart

                container.select(".overlay")
                    .datum(data.filter(d => d.age >= minAge && d.age <= maxAge))  // filter the data according to the brush's selection
                    .style("fill", "pink")       // add color to the overlay
                    .attr("d", valueLine);       // update the overlay's path with the new data

                d3.select(".selection").style("fill", 'none'); // make the brush's rectangle invisible
            }
        });

    // Double-click to dismiss the brush
    svg.on("dblclick", (evt) => {
        brush.clear(container);
        d3.select(".overlay")
            .style("fill", "none")
            .datum(data)
            .attr("d", valueLine);
        container.call(brush);
        state.ageSelection = [0, 100];  // store the final data collected by the brush
        barchart.update();              // update the bar chart
    });

    container.call(brush);
}




