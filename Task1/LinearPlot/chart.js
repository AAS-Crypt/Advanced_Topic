async function buildPlot(){    
    const data = await d3.json("my_weather_data.json");
    const dateParser = d3.timeParse("%Y-%m-%d");
    //console.table(data);

    const margin = { left: 120, right: 30, top: 60, bottom: 30 }

    const width = document.querySelector("body").clientWidth, height = 500;
    const svg = d3.select("svg").attr("viewBox", [0, 0, width, height]);

    const x_scale = d3.scaleTime().range([margin.left, width - margin.right]);
    const y_scale = d3.scaleLinear().range([height - margin.bottom - margin.top, margin.top]);

    const x_label = "Time";
    const y_label = "Temperatures";

    // add y label
    svg
    .append("text")
    .attr("text-ancho", "middle")
    .attr(
        "transform",
        `translate(${margin.left - 70}, ${
        (height - margin.top - margin.bottom + 180) / 2
        }) rotate(-90)`
    )
    .style("font-size", "26px")
    .text(y_label);
    // add x label
    svg
    .append("text")
    .attr("class", "svg_title")
    .attr("x", (width - margin.right + margin.left) / 2)
    .attr("y", height - margin.bottom - margin.top + 60)
    .attr("text-anchor", "middle")
    .style("font-size", "26px")
    .text(x_label);


    const minTemp = (d) => d.temperatureMin;
    const maxTemp = (d) => d.temperatureHigh;
    const dates = (d) => dateParser(d.date);

    const yAxismin = d3.scaleLinear()
        .domain(d3.extent(data,minTemp))
        .range([height-120,120]);

    const yAxismax = d3.scaleLinear()
        .domain(d3.extent(data,maxTemp))
        .range([height-120,120]);

    const xAxis = d3.scaleTime()
        .domain(d3.extent(data,dates))
        .range([120, width-30]);

    var minimal = d3.line()
        .x(d => xAxis(dates(d)))
        .y(d => yAxismin(minTemp(d)));

    var maximal = d3.line()
        .x(d => xAxis(dates(d)))
        .y(d => yAxismax(maxTemp(d)));
    

    ticks = 10

    x_scale.domain(d3.extent(data, dates)).nice(ticks);
    y_scale.domain(d3.extent(data, maxTemp)).nice(ticks);

    svg.append('path').attr("fill", "none").attr("stroke", "steelblue")
    .attr("stroke-width", 1).attr('d', minimal(data)).attr('stroke', 'blue');

    svg.append('path').attr("fill", "none").attr("stroke", "steelblue")
    .attr("stroke-width", 1).attr('d', maximal(data)).attr('stroke', 'red');

const x_axis = d3.axisBottom()
  .scale(x_scale)
  .tickPadding(10)
  .ticks(ticks)
  .tickSize(-height + margin.top * 2 + margin.bottom);


const y_axis = d3.axisLeft()
  .scale(y_scale)
  .tickPadding(5)
  .ticks(ticks)
  .tickSize(-width + margin.left + margin.right);

svg
.append("g")
.attr("transform", `translate(0,${height - margin.bottom - margin.top})`)
.call(x_axis);

// add y axis
svg
.append("g")
.attr("transform", `translate(${margin.left},0)`)
.call(y_axis);
}
buildPlot();