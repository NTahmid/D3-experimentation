import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import lasso from "../../Utilities/lasso";

const Scatter = () => {
  const svgRef = useRef();

  //console.log(L);
  //const d3Lasso = require("./d3_lasso");

  var data = new Array(100)
    .fill(null)
    .map((m) => [Math.random(), Math.random()]);

  //var lasso = d3.lasso();
  //var lasso = d3Lasso().closedPathSelect(true).closePathDistance(100);
  let lassoObj = d3.lasso();
  useEffect(() => {
    let width = 600;
    let height = 500;
    let radius = 3.5;

    let svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    let circles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => d[0] * width)
      .attr("cy", (d) => d[1] * height)
      .attr("r", radius);

    //Lasso functions

    let lassoStart = () => {
      lasso
        .items()
        .attr("r", 3.5)
        .classed("not_possible", false)
        .classed("possible", true);
    };
    let lassoDraw = () => {
      // Style the possible dots
      lasso
        .possibleItems()
        .classed("not_possible", false)
        .classed("possible", true);

      // Style the not possible dot
      lasso
        .notPossibleItems()
        .classed("not_possible", true)
        .classed("possible", false);
    };

    let lassoEnd = () => {
      // Reset the color of all dots
      lasso.items().classed("not_possible", false).classed("possible", false);

      // Style the selected dots
      lasso.selectedItems().classed("selected", true).attr("r", 7);

      // Reset the style of the not selected dots
      lasso.notSelectedItems().attr("r", 3.5);
    };

    // let a = lassoObj.closePathDistance(100);
    // console.log(a.closePathDistance());
    //console.log(lassoObj.closePathDistance(100));
    //console.log(lassoObj.closedPathDistance());

    //console.log(lasso.items());

    lassoObj
      .closePathSelect(true)
      .closePathDistance(100)
      .items(circles)
      .targetArea(svg)
      .on("start", lassoStart)
      .on("draw", lassoDraw)
      .on("end", lassoEnd);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default Scatter;
