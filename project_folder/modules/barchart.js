import * as d3 from 'https://cdn.skypack.dev/d3@7';

export function draw(svg, data, margin, dim) {

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
    x.domain(data.map(d => d.modality));
    y.domain([0, d3.max(data, d => d.count)]);

    // create bars
    container.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "lightGreyBar")
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
}