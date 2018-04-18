$( document ).ready(function() {
	$("p").hide();
	var sd, //Saldo devedor
		pa, //Amortizacao
		i, //taxa de juros
		n, //Qtd de pagamentos
		pgto, //Prestacao
		ca, //carencia
		j, //juros
		dataSFA = [],
		dataSAC = [],
		dataSAM = [],
		dSD = [],
		dPA = [],
		dJ = [],
		dPG = [],
		div = "#box";

	function mapear(n, sd, pa, j, pgto, dataset){
		dataset.push({
			n:n, "Saldo Devedor":sd, "Amortização":pa, "Juros":j, "Prestação":pgto
		});
	}

	function SFA() {
		values();
		mapear(0, sd, 0, 0, 0, dataSFA);
		if(ca != 0){
			$("#p")
			.text("Sistema Francês de Amortização (Carência + saldo devedor corrigido)");
			for (var k = 1; k <= ca; k++) {
				sd = sd * (1+i);
				mapear(k, sd.toFixed(2), 0, 0, 0, dataSFA);
			}
		}
		else
			$("#p").text("Sistema Francês de Amortização");
		
		pgto = sd * (i*Math.pow(1+i,n))/(Math.pow(1+i,n)-1);
		n = parseInt(ca)+parseInt(n);
		for (var k = parseInt(ca)+1; k <= n; k++) {
			j = sd * i * 1;
			pa = pgto - j;
			sd = sd - pa;
			mapear(k, sd.toFixed(2), pa.toFixed(2), 
				j.toFixed(2), pgto.toFixed(2), dataSFA);
		}		
	}

	function SAC(){
		values();
		mapear(0, sd, 0, 0, 0, dataSAC);
		if(ca != 0){
			$("#p")
			.text("Sistema de Amortização Constante (Carência + saldo devedor corrigido)");
			for (var k = 1; k <= ca; k++) {
				sd = sd * (1+i);
				mapear(k, sd.toFixed(2), 0, 0, 0, dataSAC);
			}
		}
		else
			$("#p").text("Sistema de Amortização Constante");

		pa = sd/n;
		n = parseInt(ca)+parseInt(n);
		for (var k = parseInt(ca)+1; k <= n; k++) {
			j = sd * i * 1;
			pgto = pa + j;
			sd = sd - pa;
			mapear(k, sd.toFixed(2), pa.toFixed(2), 
				j.toFixed(2), pgto.toFixed(2), dataSAC);
		}
	}

	function SAM(){
		values();
		mapear(0, sd, 0, 0, 0, dataSAM);
		$("#p").text("Sistema de Amortização Misto");
		sdSFA = sd;
		sdSAC = sd;
		pgtoSFA = sdSFA * (i*Math.pow(1+i,n))/(Math.pow(1+i,n)-1);
		paSAC = sdSAC/n;

		for (var k = 1; k <= n; k++) {
			jSFA = sdSFA * i * 1;
			paSFA = pgtoSFA - jSFA;
			sdSFA = sdSFA - paSFA;
			
			jSAC = sdSAC * i * 1;
			pgtoSAC = paSAC + jSAC;
			sdSAC = sdSAC - paSAC;

			pgto = (pgtoSFA + pgtoSAC)/2;
			j = (jSFA + jSAC)/2;
			pa = (paSFA + paSAC)/2;
			sd = sd - pa;
			mapear(k, sd.toFixed(2), pa.toFixed(2), 
				j.toFixed(2), pgto.toFixed(2), dataSAM);
		}
	}
	
	function createTable(dataset){

		var table = $("<table />");
		table[0].border = "1";

        var columnCount = 5;
        var row = $(table[0].insertRow(-1));
        for (var key in dataset[0]) {
            var headerCell = $("<th />");
            headerCell.html(key);
            row.append(headerCell);
        }

        for (var i = 0; i < dataset.length; i++) {
            row = $(table[0].insertRow(-1));
            for(var key in dataset[i]){
            	var cell = $("<td />");
                cell.html(dataset[i][key]);
                row.append(cell);
            }
        }

        var box = $(div);
        box.html("");
        box.append(table);
        dataset.length = 0;
  	}

  	function values(){
  		sd = $("#sd").val();
		i = $("#i").val()/100;
		n = $("#n").val();
		ca = $("#ca").val();
  	}

	$("#btn").click(function(){
		div = "#box";
		$("p").hide();
		$("#p").show();
		$(".boxC").hide();
		$("#box").empty();
		$(".graph").empty();
		//$("svg").empty();

		if($(".radio:checked").val() == "sfa"){
      		SFA();
      		createTable(dataSFA);    
     	}
      	else if($(".radio:checked").val() == "sac"){
      		SAC();
      		createTable(dataSAC);    
      	}
      	else if ($(".radio:checked").val() == "sam"){
      		SAM();
      		createTable(dataSAM);    
      	}
      	else if ($(".radio:checked").val() == "comp"){
      		compare();
      	}

   	});

	function compare(){	
		SFA();
		SAC();
		SAM();

		$("#p").hide();
		$(".pC").show();
		$(".boxC").show();

		for (var i = 0; i <= n; i++) {
			
			if (i != 0) {
				dPA.push({n:i, sfa:dataSFA[i]["Amortização"], 
					sac:dataSAC[i]["Amortização"], 
					sam:dataSAM[i]["Amortização"]});
				dJ.push({n:i, sfa:dataSFA[i]["Juros"], 
					sac:dataSAC[i]["Juros"], 
					sam:dataSAM[i]["Juros"]});
				dPG.push({n:i, sfa:dataSFA[i]["Prestação"], 
					sac:dataSAC[i]["Prestação"], 
					sam:dataSAM[i]["Prestação"]});
			}
			if(i != n){
				dSD.push({n:i, sfa:dataSFA[i]["Saldo Devedor"], 
					sac:dataSAC[i]["Saldo Devedor"], 
					sam:dataSAM[i]["Saldo Devedor"]});
			}
		}

		div = "#box1";
		createTable(dataSFA);    
		div = "#box2";
		createTable(dataSAC);    
		div = "#box3";
		createTable(dataSAM);   

		
		dSD.length = plot(dSD, "#svg1");
		dPA.length = plot(dPA, "#svg2");
		dJ.length = plot(dJ,  "#svg3");
		dPG.length = plot(dPG, "#svg4");

	}

	$(".radio").click(function(){
      if ($(".radio:checked").val() == "sam"){
      	$("#ca").attr("disabled","disabled");
      }
      else if($(".radio:checked").val() == "sac" 
      	| $(".radio:checked").val() == "sfa"){
      	$("#ca").removeAttr("disabled");
      }
   	});
});

var plot = function(data, canvas) {
	if(canvas == "#svg1"){
		$(canvas).append($("<p class='pGraph'></p>").text("Saldo Devedor"));
	}
	else if(canvas == "#svg2"){
		$(canvas).append($("<p class='pGraph'></p>").text("Amortização"));
	}
	else if(canvas == "#svg3"){
		$(canvas).append($("<p class='pGraph'></p>").text("Juros"));
	}
	else if(canvas == "#svg4"){
		$(canvas).append($("<p class='pGraph'></p>").text("Prestação"));
	}

	var margin = {top: 20, right: 50, bottom: 30, left: 50},
	width = 400 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .35);
	var y = d3.scale.linear()
		.rangeRound([height, 0]);

	var color = ["#1abc9c", "#e74c3c", "#3498db"];
	
	var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");


	var svg = d3.select(canvas).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", 
			"translate(" + margin.left + "," + margin.top + ")");

	var xData = ["sfa", "sac", "sam"];
	var dataset = xData.map(function (c) {
		return data.map(function (d) {
			return {x: d.n, y: +d[c]};
		});
	});
	
	var dataStackLayout = d3.layout.stack()(dataset);

	x.domain(dataStackLayout[0].map(function (d) {
		return d.x;
	}));

	y.domain([0,
		d3.max(dataStackLayout[dataStackLayout.length - 1],
			function (d) { return d.y0 + d.y;})
		])
		.nice();

    var tip = d3.tip()
    	.attr("class", "tip")
    	.html(d => d.y);

	var layer = svg.selectAll(".stack")
		.data(dataStackLayout);

	layer.exit().remove();

	layer.enter().append("g")
		.attr("class", "stack")
		.style("fill", (d, i)=>color[i])
		.style("opacity", .8);

	layer.selectAll("rect")
		.data(d=>d)
		.enter().append("rect")
		.attr("x", d=>x(d.x))
		.attr("y", d=>y(d.y0 + d.y))
		.attr("height", d =>(y(d.y0) - y(d.y0 + d.y)))
		.attr("width", x.rangeBand())
		.on("mouseover", function(d) { 
			d3.select(this).style("opacity", 1);
			tip.show(d);
		})
	  	.on("mouseout", function() { 
	  		d3.select(this).style("opacity", .8);
	  		tip.hide(d);
	  	});

	layer.call(tip);

  	svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

	// Draw legend
	var legend = svg.selectAll(".legend")
	  .data(color)
	  .enter().append("g")
	  .attr("class", "legend")
	  .attr("transform", function(d, i) { return "translate(0," + i * 19 + ")"; });
	 
	legend.append("rect")
	  .attr("x", width - 18)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", (d, i)=>color[i]);
	 
	legend.append("text")
	  .attr("x", width + 5)
	  .attr("y", 9)
	  .attr("dy", ".35em")
	  .style("text-anchor", "start")
	  .text(function(d, i) { 
	    switch (i) {
	      case 0: return "SFA";
	      case 1: return "SAC";
	      case 2: return "SAM";
	    }
	  });
	  return 0;
}