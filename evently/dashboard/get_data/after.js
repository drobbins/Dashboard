function(){
    var app = $$(this).app,
        data = app.dashboard_data,
        w = $("#main").width(),
        h = 400,
        p = 120,
        num = d3.format(".0f");

    _.myIndexOf = function(array, value){
        if(typeof value !== "object"){
            return array.indexOf(value);
        }
        else{
            var index = -1, i;
            for (i=0; i<array.length; i+=1){
                if(!(value > array[i] || value < array[i])){ //ghetto array equality
                    return index = i;
                }
            }
            return index;
        }
    };

    var plot_all = function(){
        var rw = w/data.rows.length,
            my = d3.max(data.rows, function(row){
                return row.value.values[0];
            }),
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
        var nested_data = d3.nest().key(function(d){return d.key[0]}).entries(data.rows),
            clinics = nested_data.map(function(d){return d.key;}),
            layout_data = nested_data.map(function(d){return d.values;}),
            all_dates = (d3.nest().key(function(d){return d.key.slice(1)}).entries(data.rows)).map(function(d){return d.key;}),
            layout_data,
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

        //Plot the datas!
        var n = layout_data.length,
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
            y2 = function(d) { return d.y * h / my; }, //or my not to scale
            scale = d3.scale.linear().domain([0,my]).range([0,h]),
            clinic_colors = app.dashboard.config.colors.clinics;
        debugger;

        var vis = d3.select("#chart")
            .append("svg:svg")
            .attr("width", w)
            .attr("height", h + p);

        var layers = vis.selectAll("g.layer")
            .data(d)
            .enter().append("svg:g")
            .style("fill", function(d){return clinic_colors[d[0].key[0]];})
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
            .attr("clinic", function(d){return d.key[0];})
            .attr("time", function(d,i){return d.key.slice(1).join("-");})
            .attr("value", function(d){return d.value.values[0];})
            .attr("height", function(d) {return y0(d) - y1(d); });
        debugger;

    };

    if (data.rows[0].value.labels.key_labels[0] === "clinic"){
        plot_by_clinic();
    }
    else {
        plot_all();
    }
}
