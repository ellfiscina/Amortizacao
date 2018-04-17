$( document ).ready(function() {
	var sd; //Saldo devedor
	var pa; //Amortizacao
	var i; //taxa de juros
	var n; //Qtd de pagamentos
	var pgto; //Prestacao
	var ca; //carencia
	var j; //juros
	var data = new Array();
	var div = "#box";

	data.push(["n", "Saldo Devedor", "Amortização", "Juros", "Prestacao"]);

	function SFA() {
		values();
		if(ca != 0){
			$("h4").text("Sistema Francês de Amortização (Carência + saldo devedor corrigido)");
			for (var k = 1; k <= ca; k++) {
				sd = sd * (1+i);
				data.push([k, sd.toFixed(2), 0, 0, 0]);
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

			data.push([k, sd.toFixed(2), pa.toFixed(2), j.toFixed(2), pgto.toFixed(2)]);
			dataSFA.push([k, sd.toFixed(2), pa.toFixed(2), j.toFixed(2), pgto.toFixed(2)]);
		}
	}

	function SAC(){
		values();
		if(ca != 0){
			$("h4").text("Sistema de Amortização Constante (Carência + saldo devedor corrigido)");
			for (var k = 1; k <= ca; k++) {
				sd = sd * (1+i);
				data.push([k, sd.toFixed(2), 0, 0, 0]);
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
			data.push([k, sd.toFixed(2), pa.toFixed(2), j.toFixed(2), pgto.toFixed(2)]);
		}
	}

	function SAM(){
		values();
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
			data.push([k, sd.toFixed(2), pa.toFixed(2), j.toFixed(2), pgto.toFixed(2)]);
		}
	}
	
	function createTable(){
		var table = $("<table />");
		table[0].border = "1";

        var columnCount = data[0].length;
        var row = $(table[0].insertRow(-1));
        for (var i = 0; i < columnCount; i++) {
            var headerCell = $("<th />");
            headerCell.html(data[0][i]);
            row.append(headerCell);
        }

        for (var i = 1; i < data.length; i++) {
            row = $(table[0].insertRow(-1));
            for (var j = 0; j < columnCount; j++) {
                var cell = $("<td />");
                cell.html(data[i][j]);
                row.append(cell);
            }
        }

        var box = $(div);
        box.html("");
        box.append(table);
        data.length = 1;
  	}

  	function values(){
  		sd = $("#sd").val();
		i = $("#i").val()/100;
		n = $("#n").val();
		ca = $("#ca").val();

		data.push([0, sd, 0, 0, 0]);
  	}

	$("#btn").click(function(){
		$("#p1").empty();
		$("#p2").empty();
		$("#p3").empty();
		$("#box2").empty();
		$("#box3").empty();
		$("#box").empty();

		if($(".radio:checked").val() == "sfa"){
      		SFA();
     	}
      	else if($(".radio:checked").val() == "sac"){
      		SAC();
      	}
      	else if ($(".radio:checked").val() == "sam"){
      		SAM();
      	}

      	createTable();    
   	});

   	$("#btn2").click(function(){	
      	SFA();
      	$("#p1").text("Sistema Francês de Amortização");
      	createTable();    
 
      	SAC();
      	$("#p2").text("Sistema de Amortização Constante");
 		div = "#box2"
      	createTable();    

      	SAM();
      	$("#p3").text("Sistema de Amortização Misto");
 		div = "#box3"
      	createTable();    
      	
      	$("h4").empty();
      	plot();
   	});

	$(".radio").click(function(){
      if ($(".radio:checked").val() == "sam"){
      	$("#ca").attr("disabled","disabled");
      }
      else if($(".radio:checked").val() == "sac" | $(".radio:checked").val() == "sfa"){
      	$("#ca").removeAttr("disabled");
      }
   });


	function plot() {
	
		var mySVG = d3.select("svg");	   
		var group = mySVG.append("g").attr("transform","translate(0,500),scale(1,-1)");
		var barWidth = 40;
		var slack = 2;
		
		//
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
		mySVG
		.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.attr("x",function(d,i){return i*(barWidth+slack)+barWidth/2;})
		.attr("y",function(d){return 15+500-(d/30.0)*500;})
		.attr("text-anchor","middle")
		.attr("fill","white")
		.text(function(d){return d;});
	}
});