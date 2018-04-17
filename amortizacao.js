$( document ).ready(function() {
	var sd; //Saldo devedor
	var pa; //Amortizacao
	var i; //taxa de juros
	var n; //Qtd de pagamentos
	var pgto; //Prestacao
	var ca; //carencia
	var j; //juros
	var data = [];
	var dataSFA = new Array();
	var dataSAC = new Array();
	var dataSAM = new Array();
	var div = "#box";

	function SFA() {
		values();
		firstRow(dataSFA);
		if(ca != 0){
			$("h4").text("Sistema Francês de Amortização (Carência + saldo devedor corrigido)");
			for (var k = 1; k <= ca; k++) {
				sd = sd * (1+i);
				dataSFA.push([k, sd.toFixed(2), 0, 0, 0]);
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

			dataSFA.push([k, sd.toFixed(2), pa.toFixed(2), j.toFixed(2), pgto.toFixed(2)]);
		}
	}

	function SAC(){
		values();
		firstRow(dataSAC);
		if(ca != 0){
			$("h4").text("Sistema de Amortização Constante (Carência + saldo devedor corrigido)");
			for (var k = 1; k <= ca; k++) {
				sd = sd * (1+i);
				dataSAC.push([k, sd.toFixed(2), 0, 0, 0]);
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
			dataSAC.push([k, sd.toFixed(2), pa.toFixed(2), j.toFixed(2), pgto.toFixed(2)]);
		}
	}

	function SAM(){
		values();
		firstRow(dataSAM);
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
			dataSAM.push([k, sd.toFixed(2), pa.toFixed(2), j.toFixed(2), pgto.toFixed(2)]);
		}
	}
	
	function createTable(dataset){

		var table = $("<table />");
		table[0].border = "1";

        var columnCount = dataset[0].length;
        var row = $(table[0].insertRow(-1));
        for (var i = 0; i < columnCount; i++) {
            var headerCell = $("<th />");
            headerCell.html(dataset[0][i]);
            row.append(headerCell);
        }

        for (var i = 1; i < dataset.length; i++) {
            row = $(table[0].insertRow(-1));
            for (var j = 0; j < columnCount; j++) {
                var cell = $("<td />");
                cell.html(dataset[i][j]);
                row.append(cell);
            }
        }

        var box = $(div);
        box.html("");
        box.append(table);
        dataset.length = 0;
  	}

  	function firstRow(dataset){
  		dataset.push(["n", "Saldo Devedor", "Amortização", "Juros", "Prestacao"]);
  		dataset.push([0, sd, 0, 0, 0]);
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
      	$("#p1").text("Sistema Francês de Amortização");
      	createTable(dataSFA);    
 
      	SAC();
      	$("#p2").text("Sistema de Amortização Constante");
 		div = "#box2"
      	createTable(dataSAC);    

      	SAM();
      	$("#p3").text("Sistema de Amortização Misto");
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


	function dados(){
		var data = {};
		var keys = ['sfa', 'sac', 'sam'];
		var values = [dataSFA, dataSAC, dataSAM ];
		keys.forEach((key, i)=>data[key] = values[i]);
		console.log(data);
	}
	function plot() {
		var keys = dataSFA.columns.slice(1);
		var mySVG = d3.select("svg");	   
		var group = mySVG.append("g");
		var barWidth = 40;
		var slack = 2;
		
		//
		group
		.selectAll("rect")
		.data(dataSFA)
		.enter()
		.append("rect")
		.attr("x",function(d,i){return i*(barWidth+slack);})
		.attr("y",0)
		.attr("fill","blue")
		.attr("width",function(d){return barWidth;})
		.attr("height",function(d){return (d/30.0)*500;});

		//
		/*mySVG
		.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.attr("x",function(d,i){return i*(barWidth+slack)+barWidth/2;})
		.attr("y",function(d){return 15+500-(d/30.0)*500;})
		.attr("text-anchor","middle")
		.attr("fill","white")
		.text(function(d){return d;});*/
	}
});