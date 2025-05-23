document.getElementById("player1").addEventListener("click", sumarPuntos);
document.getElementById("player2").addEventListener("click", sumarPuntos);

var contador;
var puntos = 0;
var tiempo = 60;
var necesarios = 30;
var color;
var stop = 0;

randNum = Math.round(Math.random()*450);
randNum2 = Math.round(Math.random()*450);

function iniciar(){
	contador = setInterval(restarTiempo, 1000);
	color = setInterval(setColor, 300);
	stop = 0;

	swal("Esta pagina dice:", "Has accedido a BolasLocas.com", "warning");
}

function moverPlayer(){
	randNum = Math.round(Math.random()*450);
	randNum2 = Math.round(Math.random()*450);
}



function setColor(){
	var bola1 = document.getElementById("player1");
	var bola2 = document.getElementById("player2");
	bola1.style.backgroundColor = bola1.style.backgroundColor == "yellow" ? "green" : "yellow";
	bola2.style.backgroundColor = bola2.style.backgroundColor == "blue" ? "red" : "blue";
}




function sumarPuntos(){
	if (stop == 1) {
		iniciar();
	}
	puntos++;
	document.getElementById("puntos").innerHTML = `Puntos: <b>${puntos}/${necesarios} </b>`
	moverPlayer();
	document.getElementById("player1").style.marginTop = `${randNum}px`;
	document.getElementById("player1").style.marginLeft = `${randNum2}px`;
	moverPlayer();
	document.getElementById("player2").style.marginTop = `${randNum}px`;
	document.getElementById("player2").style.marginLeft = `${randNum2}px`;
	if(necesarios == puntos){
		clearInterval(contador);
		clearInterval(color);
		document.getElementById("puntos").innerHTML = `Termino el reto en: ${60-tiempo} Seg --> Puntos: ${puntos}`;
		swal(`Lo lograste en ${60-tiempo} segundos`,"","success");
		puntos = 0;
		tiempo = 60;
		stop = 1;
	}
}


function restarTiempo(){
	tiempo--;
	document.getElementById("tiempo").innerHTML = "&nbsp;&nbsp;&nbsp;Tiempo: " + tiempo;
	moverPlayer();
	document.getElementById("player1").style.marginTop = `${randNum}px`;
	document.getElementById("player2").style.marginLeft = `${randNum2}px`;
	if(tiempo == 0){
		clearInterval(contador);
		clearInterval(color);
		document.getElementById("puntos").innerHTML = `Se terminó el tiempo - Puntos: ${puntos}`;
		swal(`Has obtenido ${puntos} puntos`,"","error")
		tiempo  = 60;
		puntos = 0;
		stop = 1;
	}
}



window.addEventListener("load", iniciar, false)