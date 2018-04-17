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
		dataset.push({n:n, "Saldo Devedor":sd, Amortização:pa, Juros:j, Prestação:pgto});
		if(dataset == dataSFA)
			dSD.push(["sfa", n, sd]);
			dPA.push(["sfa", n, pa]);
			dJ.push(["sfa", n, j]);
			dPG.push(["sfa", n, pg]);
		if(dataset == dataSAC)
			dSD.push(["sac", n, sd]);
			dPA.push(["sac", n, pa]);
			dJ.push(["sac", n, j]);
			dPG.push(["sac", n, pg]);
		if(dataset == dataSAM)
			dSD.push(["sam", n, sd]);
			dPA.push(["sam", n, pa]);
			dJ.push(["sam", n, j]);
			dPG.push(["sam", n, pg]);
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
      	$("#p1").text("Sistema Francês de Amortização");
      	plot(dataSFA);
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

   	}

	$(".radio").click(function(){
      if ($(".radio:checked").val() == "sam"){
      	$("#ca").attr("disabled","disabled");
      }
      else if($(".radio:checked").val() == "sac" | $(".radio:checked").val() == "sfa"){
      	$("#ca").removeAttr("disabled");
      }
   	});

	function plot(dataset) {
		
		var mySVG = d3.select("svg");	   
		var group = mySVG.append("g");
		var barWidth = 40;
		var slack = 2;
		
		group
		.selectAll("rect")
		.data(dataset)
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