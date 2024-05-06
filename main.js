
let datos

fetch('preguntas.json')
.then((res)=>res.json())
.then((datos)=>{
    setPreguntas(datos);
    console.log(datos)
})

function setPreguntas(datos){
    localStorage.setItem("lista", JSON.stringify(datos));         
}

const preguntas = JSON.parse(localStorage.getItem("lista")); 

const preguntaElement = document.getElementById("pregunta");
const botonRespuesta = document.getElementById("boton-respuesta");     
const siguienteBoton = document.getElementById("next-btn");

let indicePreguntaActual = 0;
let puntuacion = 0;

function comenzar() {
    Swal.fire({
        width:"50%",
        background: "burlywood",
        position: "center",
        text:"¿listo para jugar?",
        title: "Bienvenido",
        showConfirmButton: true, 
        confirmButtonText:"Comenzar", 
        confirmButtonColor:"red",                          
        timer: 3000
});
    setTimeout(() => {
        indicePreguntaActual = 0;
        puntuacion = 0;
        siguienteBoton.innerHTML = "pregunta siguiente";
        mostrarPregunta();
    }, 3000)
}

function mostrarPregunta() {
    resetear(); 
    let preguntaActual = preguntas[indicePreguntaActual];       
    let preguntaNumero = indicePreguntaActual + 1;
    preguntaElement.innerHTML = preguntaNumero + ". " + preguntaActual.pregunta;
    preguntaActual.respuestas.forEach(respuesta => {                                  
        const boton = document.createElement("button");                               
        boton.innerHTML = respuesta.text;                                             
        boton.classList.add("btn");                      
        botonRespuesta.appendChild(boton);               
        if (respuesta.correct) {
            boton.dataset.correct = respuesta.correct;
        }
        boton.addEventListener("click", seleccionarRespuesta);            
    });
}

function resetear() {
    siguienteBoton.style.display = "none";                         
    while (botonRespuesta.firstChild) {
        botonRespuesta.removeChild(botonRespuesta.firstChild);     
    }
}

function seleccionarRespuesta(e) {
    const botonSeleccionado = e.target;
    const isCorrect = botonSeleccionado.dataset.correct === "true";     
    if (isCorrect) {
        botonSeleccionado.classList.add("correct");                     
        puntuacion++;
    } else {
        botonSeleccionado.classList.add("incorrect");                   
    }
    Array.from(botonRespuesta.children).forEach(boton => {
        if (boton.dataset.correct === "true") {
            boton.classList.add("correct");
        }
        boton.disabled = true;                                 
    });
    setTimeout(() => {
        if (indicePreguntaActual < preguntas.length) {
            usarProximoBoton();
        } else {
            comenzar();
        }
    }, 2000);
}

function mostrarPuntos() {
    resetear();
    preguntaElement.innerHTML = `Tu puntuacion ${puntuacion} de ${preguntas.length}!`;
    siguienteBoton.innerHTML = "jugar de nuevo";                                         
    siguienteBoton.style.display = "block";                                             
}

function usarProximoBoton() {
    indicePreguntaActual++;
    if (indicePreguntaActual < preguntas.length) {                 
        mostrarPregunta();
    } else {
        mostrarPuntos();
    }
}

siguienteBoton.addEventListener("click", () => {                 
    if (indicePreguntaActual < preguntas.length) {
        usarProximoBoton();
    } else {
        comenzar();
    }
});

comenzar();
