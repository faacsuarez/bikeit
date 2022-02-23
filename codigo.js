// TRAIGO LA INFORMACIÓN DE LAS CIUDADES
let cta = document.querySelector("#btnComparar")
document.querySelector("#loader").style.display = "none";

var contador = 0;

let dataCiudad1  = {
    "name": null,
    "lat": null,
    "lon": null,
    "temp": null,
    "wind": null,
    "humedad": null,
    "icon": null,
    "dt": null,
    "min": null,
    "max": null,
    "descripcion": null,
    "timezone": null,
    "puntaje": null,
}

let dataCiudad2  = {
    "name": null,
    "lat": null,
    "lon": null,
    "temp": null,
    "wind": null,
    "humedad": null,
    "icon": null,
    "dt": null,
    "min": null,
    "max": null,
    "descripcion": null,
    "timezone": null,
    "puntaje": null,
}

const updateData = (data, object) => {
        object.name = data.name
        object.lat = data.coord.lat
        object.lon = data.coord.lon
        object.temp = Math.round(data.main.temp)
        object.wind = Math.round((data.wind.speed) * 3.6)
        object.humedad = data.main.humidity
        object.icon = data.weather[0].icon 
        object.dt = data.dt
        object.min = Math.round(data.main.temp_min)
        object.max = Math.round(data.main.temp_max)
        object.descripcion = data.weather[0].description
        object.timezone= data.timezone
}

const mostrarInfoCompleta = (info) => {
    document.querySelector("#resumenClima").innerHTML = `
    <span>${mostrarDiaActual(info.timezone)}</span>
    <h3>${info.name}</h3>
    <div>
    <img src="img/icons/${info.icon}.svg">
    <h2>${info.temp} ºC</h2>
    <p>${info.descripcion}</p>
    <span>mín:${info.min} ºC | máx:${info.max} ºC</span>
    </div>
    <div class="ambos">
    <div>
    <p>Viento</p>
    <h3>${info.wind}km/h</h3>
    </div>
    <div>
    <p>Humedad</p>
    <h3>${info.humedad} %</h3>
    </div>
    </div>
    `

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${info.lat}&lon=${info.lon}&exclude=current,minutely,hourly,alerts&appid=a132cb02079bee6f07b32b3ba6645cd6&lang=es&units=metric`)
    .then(respuesta => respuesta.json())
    .then(infoClimaAmpliado => {
    console.log(infoClimaAmpliado);

    infoClimaAmpliado.daily.forEach(dias => {
        document.querySelector("#ampliacionDias").innerHTML += `
        <article class="infoProlongada">
        <p>${mostrarDia(dias.dt)} </p>
        <img src="img/icons/${dias.weather[0].icon}.svg">
        <div>
        <p>${Math.round(dias.temp.max)} ºC </p>
        <p>${Math.round(dias.temp.min)} ºC</p>
        </div>
        </article>
        `;
    })
})
    mostrarBackground(info)
}

const mostrarBackground = (data) => {
    const lastLetter = data.icon[data.icon.lenght-1]
    const dayBackground = "d"

    if (lastLetter === dayBackground){
        document.getElementById("informacion").style.background = "linear-gradient(180deg, #6FA4BF, #EAEDF6)";
    }
    else {
        document.getElementById("informacion").style.background = "linear-gradient(180deg,#5B6F88, #152136)";
    }
    }


const datosAmbasCiudades = () => {

    document.querySelector("#loader").style.display = "block";

    let ciudad01 = document.querySelector("#txtCiudad1").value
    let ciudad02 = document.querySelector("#txtCiudad2").value

    if(ciudad01=== "" && ciudad02=== ""){
        document.querySelector("#comprobacion").innerHTML = "Los campos de texto no pueden estar vacíos"
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad01}&appid=a132cb02079bee6f07b32b3ba6645cd6&lang=es&units=metric`)
    .then(respuesta => respuesta.json())
    .then(infoClima01 => {
    
        if(infoClima01.cod === "400" || infoClima01.cod === "404"){
            document.querySelector("#comprobacion").innerHTML = "Ingresa nuevamente la ciudad"
            return
        }
        contador++;

        updateData(infoClima01, dataCiudad1);
        console.log(dataCiudad1);
        sumarContador(contador);
    });

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad02}&appid=a132cb02079bee6f07b32b3ba6645cd6&lang=es&units=metric`)
    .then(respuesta => respuesta.json())
    .then(infoClima02 => {
        contador++;


        if(infoClima02.cod === "400" || infoClima02.cod === "404"){
            document.querySelector("#comprobacion").innerHTML = "Ingresa nuevamente la ciudad"
        }

        updateData(infoClima02, dataCiudad2);
        console.log(dataCiudad2);
        sumarContador(contador);
    })
}

const comparacion = (dataCiudad1, dataCiudad2) => {
    
    if(dataCiudad1.wind < dataCiudad2.wind){
        dataCiudad1.puntaje++
    }
    else if(dataCiudad2.wind > dataCiudad1.wind){
        dataCiudad2.puntaje++
    }
    
    //dataCiudad1.wind < dataCiudad2.wind ? dataCiudad1.puntaje++ : dataCiudad2.puntaje++
    if(dataCiudad1.temp < dataCiudad2.temp){
        dataCiudad1.puntaje++
    }
    else if(dataCiudad2.temp > dataCiudad1.temp){
        dataCiudad2.puntaje++
    }

    if(dataCiudad1.humedad < dataCiudad2.humedad){
        dataCiudad1.puntaje++
    }
    else if(dataCiudad2.humedad > dataCiudad1.humedad){
        dataCiudad2.puntaje++
    }
    if(dataCiudad1.descripcion === "Thunderstorm" && dataCiudad1.descripcion === "Rain"  && dataCiudad1.descripcion === "Mist"){
        dataCiudad1.puntaje--
    }
    else {
        dataCiudad2.puntaje--
    }

    
    if(dataCiudad1.puntaje > dataCiudad2.puntaje){
        mostrarInfoCompleta(dataCiudad1);
        document.querySelector("#infoRecomendacion").innerHTML = `
        <p>Te recomendamos visitar la ciudad 1: <b>${dataCiudad1.name}</b></p>`
    }
    else if(dataCiudad2.puntaje > dataCiudad1.puntaje){
        mostrarInfoCompleta(dataCiudad2);
        document.querySelector("#infoRecomendacion").innerHTML = `
        <p>Te recomendamos visitar la ciudad 2: ${dataCiudad2.name}</p>`
    }
}


const sumarContador = (contador) => {
    if(contador===2){
        comparacion(dataCiudad1, dataCiudad2);
        document.querySelector("#loader").style.display = "none";
    }
}


cta.addEventListener("click", datosAmbasCiudades)

const mostrarDiaActual = timezone => {

    let fecha = new Date();
    let diferencia = timezone / 3600;

    let dia= fecha.getDay()
    let mes = fecha.getDate();
    let hora= fecha.getHours();
    let minutos= fecha.getMinutes();

    fecha.setHours(hora + diferencia + 3);
    hora = fecha.getHours();

    if(hora<10){
        hora = "0" + hora
    }
    if(minutos<10){
        minutos = "0" + minutos
    }
    let dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];


    let hoy = dias[dia] + " " + mes + " " + ", " + hora + ":" + minutos
    return hoy;
}

const mostrarDia = fechaActual => {

    //let fecha = new Date(1632319243 * 1000)
    let fecha = new Date(fechaActual * 1000)

    let dia= fecha.getDay()
    let mes = fecha.getDate();
    let hora= fecha.getHours();
    let minutos= fecha.getMinutes();
    if(hora<10){
        hora = "0" + hora
    }
    if(minutos<10){
        minutos = "0" + minutos
    }
    let dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    
    //let hoy = `<p>${dias[dia]} ${mes} ${hora}:${minutos}</p>`;
    let hoy = dias[dia]
    return hoy;
}
