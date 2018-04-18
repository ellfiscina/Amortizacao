$( document ).ready(function() {
	var sd; //Saldo devedor
	var pa; //Amortizacao
	var i; //taxa de juros
	var n; //Qtd de pagamentos
	var pgto; //Prestacao
	var ca; //carencia
	var j; //juros
	var dataSFA = [];
	var dataSAC = [];
	var dataSAM = [];
	var dSD = [];
	var dPA = [];
	var dJ = [];
	var dPG = [];
	var div = "#box";

	function mapear(n, sd, pa, j, pgto, dataset){
		dataset.push({n:n, "Saldo Devedor":sd, "Amortização":pa, "Juros":j, "Prestação":pgto});
	}

	function SFA() {
		values();
		mapear(0, sd, 0, 0, 0, dataSFA);
		if(ca != 0){
			$("h4").text("Sistema Francês de Amortização (Carência + saldo devedor corrigido)");
			for (var k = 1; k <= ca; k++) {
				sd = sd * (1+i);
				mapear(k, sd.toFixed(2), 0, 0, 0, dataSFA);
			}
		}
		else
			$("h4").text("Sistema Francês de Amortização");
		pgto = sd * (i*Math.pow(1+i,n))/(Math.pow(1+i,n)-1);
		n = parseInt(ca)+parseInt(n);
		for (var k = parseInt(ca)+1; k <= n; k++) {
			j = sd * i * 1;
			pa = pgto - j;
			sd = sd - pa;
			mapear(k, sd.toFixed(2), pa.toFixed(2), j.toFixed(2), pgto.toFixed(2), dataSFA);
		}
		
	}

	function SAC(){
		values();
		mapear(0, sd, 0, 0, 0, dataSAC);
		if(ca != 0){
			$("h4").text("Sistema de Amortização Constante (Carência + saldo devedor corrigido)");
			for (var k = 1; k <= ca; k++) {
				sd = sd * (1+i);
				mapear(k, sd.toFixed(2), 0, 0, 0, dataSFA);
			}
		}
		else
			$("h4").text("Sistema de Amortização Constante");
		pa = sd/n;
		n = parseInt(ca)+parseInt(n);
		for (var k = parseInt(ca)+1; k <= n; k++) {
			j = sd * i * 1;
			pgto = pa + j;
			sd = sd - pa;
			mapear(k, sd.toFixed(2), pa.toFixed(2), j.toFixed(2), pgto.toFixed(2), dataSAC);
		}
	}

	function SAM(){
		values();
		mapear(0, sd, 0, 0, 0, dataSAM);
		$("h4").text("Sistema de Amortização Misto");
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
			mapear(k, sd.toFixed(2), pa.toFixed(2), j.toFixed(2), pgto.toFixed(2), dataSAM);
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
		$("#p1").empty();
		$("#p2").empty();
		$("#p3").empty();
		$("#box2").empty();
		$("#box3").empty();
		$("#box").empty();

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

      	$("#p1").text("Sistema Francês de Amortização");
      	$("#p2").text("Sistema de Amortização Constante");
      	$("#p3").text("Sistema de Amortização Misto");
      	
      	for (var i = 0; i < n; i++) {
      		dSD.push({n:i, sfa:dataSFA[i]["Saldo Devedor"], 
      			sac:dataSAC[i]["Saldo Devedor"], 
      			sam:dataSAM[i]["Saldo Devedor"]});
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

      	createTable(dataSFA);    
 		div = "#box2"
      	createTable(dataSAC);    
 		div = "#box3"
      	createTable(dataSAM);   

      	$("h4").empty();
      	plot();
   	}

	$(".radio").click(function(){
      if ($(".radio:checked").val() == "sam"){
      	$("#ca").attr("disabled","disabled");
      }
      else if($(".radio:checked").val() == "sac" | $(".radio:checked").val() == "sfa"){
      	$("#ca").removeAttr("disabled");
      }
   	});

	function plot() {
		var margin = {top: 20, right: 50, bottom: 30, left: 50},
		        width = 400 - margin.left - margin.right,
		        height = 300 - margin.top - margin.bottom;
		 
		var x = d3.scale.ordinal()
		        .rangeRoundBands([0, width], .35);
		 
		var y = d3.scale.linear()
		        .rangeRound([height, 0]);
		 
		var color = d3.scale.category20();
		 
		var svg = d3.select("body").append("svg")
		        .attr("width", width + margin.left + margin.right)
		        .attr("height", height + margin.top + margin.bottom)
		        .append("g")
		        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		 
		var xData = ["sfa", "sac", "sam"];
		var dataset = xData.map(function (c) {
		    return dSD.map(function (d) {
		        return {x: d.n, y: d[c]};
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
		 
		var layer = svg.selectAll(".stack")
		        .data(dataStackLayout)
		        .enter().append("g")
		        .attr("class", "stack")
		        .style("fill", function (d, i) {
		            return color(i);
		        });
		 
		layer.selectAll("rect")
		        .data(function (d) {
		            return d;
		        })
		        .enter().append("rect")
		        .attr("x", function (d) {
		            return x(d.x);
		        })
		        .attr("y", function (d) {
		            return y(d.y + d.y0);
		        })
		        .attr("height", function (d) {
		            return y(d.y0) - y(d.y + d.y0);
		        })
		        .attr("width", x.rangeBand());
	}
});