import * as d3 from 'https://cdn.skypack.dev/d3@7';

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
}