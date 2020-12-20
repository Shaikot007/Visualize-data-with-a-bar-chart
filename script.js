const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    dataset = data.data;

    const svgHeight = 500;
    const svgWidth = 800;

    const padding = 60;

    const heightScale = d3.scaleLinear()
                          .domain([0, d3.max(dataset, item => item[1])])
                          .range([0, svgHeight - (2 * padding)]);

    const widthScale = d3.scaleLinear()
                         .domain([0, dataset.length])
                         .range([padding, svgWidth - padding]);

    let datesArray = dataset.map((date) => {
      return new Date(date[0]);
    });

    const xScale = d3.scaleTime()
                     .domain([d3.min(datesArray), d3.max(datesArray)])
                     .range([padding, svgWidth - padding]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, item => item[1])])
                     .range([svgHeight - padding, padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const svg = d3.select(".svg-content")
                  .append("svg")
                  .attr("height", svgHeight)
                  .attr("width", svgWidth);

    let tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0)
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .style("position", "absolute")
                    .style("text-align", "center")
                    .style("width", "120px")
                    .style("height", "50px")
                    .style("padding", "2px")
                    .style("font", "12px")
                    .style("background-color", "lightsteelblue")
                    .style("box-shadow", "1px 1px 10px")
                    .style("border-radius", "2px")
                    .style("pointer-events", "none");

    svg.selectAll("rect")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", (item, index) => widthScale(index))
       .attr("y", item => (svgHeight - padding) - heightScale(item[1]))
       .attr("width", (svgWidth - (2 * padding)) / dataset.length)
       .attr("height", item => heightScale(item[1]))
       .attr("fill", "navy")
       .attr("data-date", item => item[0])
       .attr("data-gdp", item => item[1])
       .on("mouseover", (item, index) => {
          tooltip.transition()
                 .style("opacity", 1)
                 .style("left", item.pageX + "px")
                 .style("top", item.pageY + "px");

          let quarter;
          let temp = index[0].substring(5, 7);

          if (temp === "01") {
            quarter = "Q1";
          } else if (temp === "04") {
            quarter = "Q2";
          } else if (temp === "07") {
            quarter = "Q3";
          } else if (temp === "10") {
            quarter = "Q4";
          }

          document.querySelector("#tooltip").setAttribute("data-date", index[0]);
          document.querySelector("#tooltip").textContent = "Year: " + index[0].substring(0, 4) + " - " + quarter + ", " + "$" + index[1] + " Billion";
       })
       .on("mouseout", () => {
          tooltip.transition()
                 .style("opacity", 0);
       });

    svg.append("g")
       .attr("transform", "translate(0," + (svgHeight - padding) + ")")
       .attr("id", "x-axis")
       .call(xAxis);

    svg.append("g")
       .attr("transform", "translate(" + padding + ", 0)")
       .attr("id", "y-axis")
       .call(yAxis);
  }
)