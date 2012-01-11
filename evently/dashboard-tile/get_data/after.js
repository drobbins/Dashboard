function(){
    var app = $$(this).app,
        data = $(this).data('dashboard_data'),
        view = $(this).data('view'),
        w = $(this).width(),
        h = $(this).width(),
        p = 120,
        num = d3.format(".0f");

    var plot_all = function(){
        var rw = w/data.rows.length,
            my = d3.max(data.rows, function(row){
                return row.value.values[0];
            }),
            y = d3.scale.linear().domain([0,my]).range([0,h]);

        var chart = d3.select("#"+view+"-chart")
            .append("svg:svg")
            .attr("class", "chart")
            .attr("width", w)
            .attr("height", h+p);

        chart.selectAll("rect")
            .data(data.rows)
            .enter().append("svg:rect")
            .attr("x", function(d, i){return i * rw;})
            .attr("width", rw)
            .attr("height", 0)
            .attr("y", h)
            .style("fill", "#1E6B52")
            .style("stroke", "white")
            .transition()
                .delay(function(d, i) { return i * 10; })
                .attr("y", function(d,i){return h-y(d.value.values[0]);})
                .attr("height", function(d,i){return y(d.value.values[0]);});

        chart.selectAll("text.value")
            .data(data.rows)
            .enter().append("svg:text")
            .attr("class", "value")
            .attr("x", function(d, i){return i * rw + rw/2;})
            .attr("y", function(d,i){return h-y(d.value.values[0]);})
            //.attr("dx", rw/2)
            .attr("dy", "0.35em")
            .style("writing-mode", "tb-rl")
            .text(function(d,i){return num(d.value.values[0]);});

        chart.selectAll("text.value")
            .attr("transform", function(d, i){
                var bb = this.getBBox(),
                    x = this.attributes.x.value,
                    y = this.attributes.y.value,
                    transformation = "",
                    centering_y;
                //Rotate and center text in bar
                //transformation += "rotate(90 "+x+" "+y+") ";
                //centering_y = bb.height/2;
                //transformation += "translate(5 "+centering_y+") ";
                if (bb.y + bb.width > h){
                    transformation += "translate(0 -"+(bb.height+5)+")";
                }
                return transformation;
            });



        chart.selectAll("text.label")
            .data(data.rows)
            .enter().append("svg:text")
            .attr("class", "label")
            .attr("x", function(d, i){return i * rw;})
            .attr("y", h+6)
            .attr("dx", rw/2)
            .style("writing-mode", "tb-rl")
            //.attr("transform", "rotate(90 0 0)")
            .text(function(d,i){return d.key.join(", ");});
    };

    var plot_by_clinic = function(){
        var preprocess_data = function(){
            var nested_data = d3.nest().key(function(d){return d.key[0]}).entries(data.rows),
                clinics = nested_data.map(function(d){return d.key;}),
                all_dates = (d3.nest().key(function(d){return d.key.slice(1)}).entries(data.rows)).map(function(d){return d.key;}),
                layout_data = nested_data.map(function(d){
                    return d.values.map(function(row){
                        row.x = all_dates.indexOf(row.key.slice(1).join(","));
                        row.y = row.value.values[0];
                        return row;
                    });
                }),
                current_clinic = "",
                current_clinic_indexp;
            //Preprocess for d3.layout.stacks()
            all_dates.forEach(function(date,i){
                clinics.forEach(function(clinic, j){
                    var clinic_data = layout_data[j],
                        row_matches_date = function(row){
                            if(row.key.slice(1).join(",") === date){
                                return true;
                            }
                        },
                        empty_entry, key;
                    //Check for the element
                    if(!(clinic_data.some(row_matches_date))){
                        //Insert it if it's missing
                        key = (clinic+","+date).split(",").map(function(el){
                            if(isNaN(el)){
                                return el;
                            }
                            else{
                                return parseInt(el);
                            }
                        });
                        empty_entry = {
                            "x" : i,
                            "y" : 0,
                            "key" : key,
                            "value" : {
                                "values" : clinic_data[0].value.values.map(function(){return 0;}),
                                "labels" : clinic_data[0].value.labels
                            }
                        };
                        if(key < clinic_data[0].key){
                            clinic_data.unshift(empty_entry);
                        }
                        else{
                            var x=0;
                            while(x < clinic_data.length && key > clinic_data[x].key){
                                x+=1;
                            }
                            clinic_data.splice(x,0,empty_entry);
                        }

                    }
                });
            });
            return [layout_data, clinics];
        };

        //Plot the datas!
        var stuff = preprocess_data(),
            layout_data = stuff[0],
            clinics = stuff[1],
            n = layout_data.length,
            m = layout_data[0].length,
            d = d3.layout.stack()(layout_data),
            mx = m,
            my = d3.max(d, function(d) {
                return d3.max(d, function(d) {
                    return d.y0 + d.y;
                    });
                }),
            mz = d3.max(d, function(d) {
                return d3.max(d, function(d) {
                    return d.y;
                    });
                }),
            x = function(d) { return d.x * w / mx; },
            y0 = function(d) { return h - d.y0 * h / my; },
            y1 = function(d) { return h - (d.y + d.y0) * h / my; },
            y2 = function(d) { return d.y * h / mz; }, //or my not to scale
            scale = d3.scale.linear().domain([0,my]).range([0,h]),
            color = d3.interpolateRgb("#1E6B52", "#D6C370");
            clinic_colors = app.dashboard.config.colors.clinics;

        var vis = d3.select("#"+view+"-chart")
            .append("svg:svg")
            .attr("width", w)
            .attr("height", h + p);

        var labels = vis.selectAll("text.label")
            .data(d[0])
            .enter().append("svg:text")
            .attr("class", "label")
            .attr("x", x)
            .attr("y", h + 6)
            .attr("dx", x({x: .45}))
            .attr("dy", "0.35em")
            .attr("text-anchor", "left")
            .text(function(d, i) { return d.key.slice(1).join(", ");});
        vis.append("svg:line")
            .attr("x1", 0)
            .attr("x2", w - x({x: .1}))
            .attr("y1", h)
            .attr("y2", h)
            .attr("stroke", "#000000");
        vis.selectAll("line")
            .data(scale.ticks(10))
            .enter().append("svg:line")
                .attr("x1", 0)
                .attr("x2", w)
                .attr("y1", scale)
                .attr("y2", scale)
                .attr("stroke", "#000000");


        var layers = vis.selectAll("g.layer")
            .data(d)
            .enter().append("svg:g")
            .style("fill", function(d, i) { return color(i / (n - 1)); })
            //.style("fill", function(d){return clinic_colors[d[0].key[0]];})
            .attr("class", "layer");

        var bars = layers.selectAll("g.bar")
            .data(function(d) { return d; })
            .enter().append("svg:g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d) + ",0)"; });

        bars.append("svg:rect")
            .attr("width", x({x: .9}))
            .attr("x", 0)
            .attr("y", h)
            .attr("height", 0)
        .transition()
            .delay(function(d, i) { return i * 10; })
            .attr("y", y1)
            //.attr("clinic", function(d){return d.key[0];})
            //.attr("time", function(d,i){return d.key.slice(1).join("-");})
            //.attr("value", function(d){return d.value.values[0];})
            .attr("height", function(d) {return y0(d) - y1(d); });

        d3.selectAll("#"+view+"-chart g.bar rect").on(
            "mouseover",
            function(e){
                var $headers = $("<tr/>"),
                    $values = $("<tr/>"),
                    $comment = $("<table class='nostripes'></table>")
                e.key.forEach(function(key, i){
                    $headers.append("<th>"+e.value.labels.key_labels[i]+"</th>");
                    $values.append("<td>"+key+"</td>");
                });
                e.value.labels.value_labels.forEach(function(label, i){
                    $headers.append("<th>"+label+"</th>");
                    $values.append("<td>"+e.value.values[i]+"</td>");
                });
                $("#"+view+"-comments").html("");
                $comment.append($headers).append($values).appendTo("#"+view+"-comments");
            });


        function transitionGroup() {
                var group = d3.selectAll("#chart");
                group.select("#group")
                    .attr("class", "first active");
                group.select("#stack")
                    .attr("class", "last");
                group.selectAll("g.layer rect")
                    .transition()
                    .duration(500)
                    .delay(function(d, i) { return (i % m) * 10; })
                    .attr("x", function(d, i) { return x({x: .9 * ~~(i / m) / n}); })
                    .attr("width", x({x: .9 / n}))
                    .each("end", transitionEnd);
                function transitionEnd() {
                    d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("y", function(d) { return h - y2(d); })
                    .attr("height", y2);
                }
         }
         function transitionStack() {
             var stack = d3.select("#chart");
             stack.select("#group")
                 .attr("class", "first");
             stack.select("#stack")
                 .attr("class", "last active");
             stack.selectAll("g.layer rect")
                 .transition()
                 .duration(500)
                 .delay(function(d, i) { return (i % m) * 10; })
                 .attr("y", y1)
                 .attr("height", function(d) { return y0(d) - y1(d); })
                 .each("end", transitionEnd);
             function transitionEnd() {
                 d3.select(this)
                 .transition()
                 .duration(500)
                 .attr("x", 0)
                 .attr("width", x({x: .9}));
             }
        }

        //$("#controls").append('<button id="group" class="btn">Group</button>');
        //$("#group").click(function(){transitionGroup(); return false;});
        //$("#controls").append('<button id="stack" class="btn">Stack</button>');
        //$("#stack").click(function(){transitionStack(); return false;});

        var key = d3.select("#key")
            .append("svg:svg")
                .attr("class", "key")
                .attr("width", w)
                .attr("height", 20 * clinics.length);

        key.selectAll("rect")
            .data(clinics)
            .enter().append("svg:rect")
                .attr("y", function(d,i){ return i * 20;})
                .attr("width", 200)
                .attr("height", 20)
                .style("fill", function(d, i) { return color(i / (n - 1)); });
        key.selectAll("text")
            .data(clinics)
            .enter().append("svg:text")
                .attr("x", 0)
                .attr("y", function(d,i){ return i * 20+20;})
                .attr("dx", 5)
                .attr("dy", -5)
                .text(function(d){return d;});

       $("#"+view+"-comments").addClass("info").html("Mouseover a box to see it's data");

    };

    if (data.rows[0].value.labels.key_labels[0] === "clinic"){
        plot_by_clinic();
    }
    else {
        plot_all();
    }
}

