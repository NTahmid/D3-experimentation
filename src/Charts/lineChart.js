import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Joyride from "react-joyride";
import { steps } from "./steps";
const LineChart = () => {
  const svgRef = useRef();

  // set the dimensions and margins of the graph
  const margin = { top: 40, right: 40, bottom: 40, left: 60 };
  let width = 600 - margin.left - margin.right;
  let height = 500 - margin.top - margin.bottom;
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    //svg.selectAll("*").remove();

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id", "lineChart")
      .style("overflow", "visible")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/connectedscatter.csv"
    )
      .row((d) => {
        return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value };
      })
      .get((errors, rows) => {
        console.log(rows);

        const x = d3
          .scaleTime()
          .domain(d3.extent(rows, (d) => d.date))
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x));

        // text label for the x axis
        svg
          .append("text")
          .attr("id", "x-axis")
          .attr(
            "transform",
            `translate(${width / 2},${height + margin.bottom})`
          )
          //.attr("x", width / 2)
          //.attr("y", height + margin.bottom)
          .style("text-anchor", "middle")
          .text("Date");

        // Add Y axis
        const y = d3.scaleLinear().domain([8000, 9200]).range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        //text label for y-axis
        svg
          .append("text")
          .attr("id", "y-axis")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - height / 2)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Value");

        // Add the line
        svg
          .append("path")
          .datum(rows)
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 1.5)
          .attr(
            "d",
            d3
              .line()
              // .curve(d3.curveBasis) // Just add that to have a curve instead of segments
              .x((d) => x(d.date))
              .y((d) => y(d.value))
          );

        // var focus = svg
        //   .append("g")
        //   .attr("class", "focus")
        //   .style("display", "none");

        //create a tooltip
        var tooltip = d3
          .select("#lineChartDiv")
          .append("div")
          .style("position", "absolute")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("z-index", "10")
          .style("visibility", "hidden")
          .style("background", "#fff")
          .text("a simple tooltip");
        // Three function that change the tooltip when user hover / move / leave a cell
        // var mouseover = function (d) {
        //   Tooltip.style("opacity", 1);
        // };
        // var mousemove = function (d) {
        //   Tooltip.html("Exact value: " + d.value)
        //     .style("left", d3.mouse(this)[0] - 80 + "px")
        //     .style("top", d3.mouse(this)[1] + "px");
        // };
        // var mouseleave = function (d) {
        //   Tooltip.style("opacity", 0);
        // };

        // Add the points
        svg
          .append("g")
          .selectAll("dot")
          .data(rows)
          .enter()
          .append("circle")
          .attr("class", "myCircle")
          .attr("cx", (d) => x(d.date))
          .attr("cy", (d) => y(d.value))
          .attr("r", 5)
          .attr("stroke", "#69b3a2")
          .attr("stroke-width", 3)
          .attr("fill", "black")
          .on("mouseover", function (d) {
            console.log(d);
            tooltip.text(`Date:${d.date} , Value:${d.value}`);
            return tooltip.style("visibility", "visible");
          })
          .on("mousemove", function () {
            return tooltip
              .style("top", d3.event.pageY - 10 + "px")
              .style("left", d3.event.pageX + 10 + "px");
          })
          .on("mouseleave", function () {
            return tooltip.style("visibility", "hidden");
          });
      });

    //let x = d3.scaleTime().domain(d3.extent(data), (d) => d.date);
  });

  return (
    <>
      <div
        id="lineChartDiv"
        style={{ display: "flex", marginLeft: "5%", marginTop: "5%" }}
      >
        <svg ref={svgRef}></svg>
      </div>
      <Joyride
        continuous
        showSkipButton
        showProgress
        scrollToFirstStep
        steps={steps}
      ></Joyride>
    </>
  );

  //return <svg ref={svgRef}></svg>;
};

export default LineChart;
