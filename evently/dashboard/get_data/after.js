function(){
    var app = $$(this).app,
        data = app.dashboard_data,
        w = $("#main").width(),
        h = 400,
        p = 120,
        rw = w/data.rows.length,
        my = d3.max(data.rows, function(row){
            return row.value.values[0];
        })
        y = d3.scale.linear().domain([0,my]).range([0,h]);
    var chart = d3.select("#chart")
        .append("svg:svg")
        .attr("class", "chart")
        .attr("width", w)
        .attr("height", h+p);

    chart.selectAll("rect")
        .data(data.rows)
        .enter().append("svg:rect")
        .attr("x", function(d, i){return i * rw;})
        .attr("width", rw)
        .attr("height", function(d,i){return y(d.value.values[0]);})
        .attr("y", function(d,i){return h-y(d.value.values[0]);})
        .style("fill", "steelblue")
        .style("stroke", "white");

    chart.selectAll("text.value")
        .data(data.rows)
        .enter().append("svg:text")
        .attr("class", "value")
        .attr("x", function(d, i){return i * rw;})
        .attr("y", function(d,i){return h-y(d.value.values[0]);})
        .attr("dx", rw/2)
        .attr("dy", "0.35em")
        .style("writing-mode", "tb-rl")
        .text(function(d,i){return d.value.values[0];});

    chart.selectAll("text.label")
        .data(data.rows)
        .enter().append("svg:text")
        .attr("class", "label")
        .attr("x", function(d, i){return i * rw;})
        .attr("y", h+6)
        .attr("dx", rw/2)
        .style("writing-mode", "tb-rl")
        .text(function(d,i){return d.key.join(", ");});
}
