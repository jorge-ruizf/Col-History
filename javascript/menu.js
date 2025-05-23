	var min = 1
	var max= 4
	var ram = Math.floor(Math.random()*(max-min)+ min)
	//alert(ram)
	var gaitan = 1
	var belisario = 2
	var michelsen = 3
	var gai = document.getElementById("gai")

	
	gai.style.display = "none";
	document.getElementById("beli").style.display = "none";
	document.getElementById("mic").style.display = "none";
		if (gaitan == ram) {
			gai.style.display = "initial";
		}

		if (belisario == ram) {
			
		beli.style.display = "initial"

		}
		
		if (michelsen == ram) {
			mic.style.display = "initial"
		}
	
//alert(ram)
	