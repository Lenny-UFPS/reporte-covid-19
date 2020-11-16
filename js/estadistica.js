async function leerJSON(url) {
    try{
        let response = await fetch(url);
        let user = await response.json();
        return user;
    }catch(err){
        alert(err);
    }
}

function addOptions(mySet, select){  // Método para insertar dinámicamente los datos al select desde un Array
    for(let item of mySet){
        var option = document.createElement("option");
        option.text = item;
        option.value = item;

        select.add(option);
    }
}

function crearRF1(){
    var url = "https://raw.githubusercontent.com/Lenny-UFPS/reporte-covid-19/main/resources/datos.json";
    var mySet = new Set();
    var data = new google.visualization.DataTable();
    var data2 = new google.visualization.DataTable();
    var select = document.getElementById('selectDpto');
    var arr;

    leerJSON(url).then(datos => {
        let totalFilas = 0;
        let contador = 0;
        let m = 0;
        let f = 0;
        datos.forEach(element => { // Conocer los departamentos que hay dentro del JSON para realizar la gráfica con sus n cantidades
            mySet.add(element.departamento_nom);
            if(element.departamento_nom === select.value) totalFilas++; // Creación, total de filas en la tabla dinámicamente
        });

        arr = [...mySet]; // Pasar el set a un Array, implementación del método sort()
        arr.sort();

        if(select.value === "") data.addRows(106); // Por defecto se desplegará la información del dpto "Antioquia"
        else data.addRows(totalFilas);

        data2.addRows(2); // Masculino - Femenino

        crearEncabezadoRF1(data);

        addOptions(arr, select);

        datos.forEach(element => {
            if(element.departamento_nom === select.value) {
                if(element.sexo === "M") m++;
                else f++;
                data.setCell(contador,0, element.fecha_reporte_web);
                data.setCell(contador,1, element.departamento_nom);
                data.setCell(contador,2, element.edad);
                data.setCell(contador,3, element.sexo);
                data.setCell(contador,4, element.ubicacion);
                data.setCell(contador,5, element.estado);
                data.setCell(contador,6, element.recuperado);
                contador++;
            }
        });

        console.log(m + " " + f); // Debug
        var table = new google.visualization.Table(document.getElementById('table'));

        var options = fillOptions();
    
        table.draw(data, options);

        crearGraficoRF1(m, f, data2);
    })
}

function crearRF2(){
    var url = "https://raw.githubusercontent.com/Lenny-UFPS/reporte-covid-19/main/resources/datos.json";
    var mySet = new Set();
    var data = new google.visualization.DataTable();
    var data2 = new google.visualization.DataTable();
    var select = document.getElementById('selectDpto');
    var arr;

    leerJSON(url).then(datos => {
        let totalFilas = 0;
        let contador = 0;
        let r = 0;
        let i = 0;
        datos.forEach(element => { // Conocer los departamentos que hay dentro del JSON para realizar la gráfica con sus n cantidades
            mySet.add(element.ciudad_municipio_nom);
            if(element.ciudad_municipio_nom === select.value) totalFilas++; // Creación, total de filas en la tabla dinámicamente
        });

        arr = [...mySet]; // Pasar el set a un Array, implementación del método sort()
        arr.sort();

        if(select.value === "") data.addRows(2); // Por defecto se desplegará la información del municipio "Anapoima - Cundinamarca"
        else data.addRows(totalFilas);

        data2.addRows(2); // Relacionado - importado

        crearEncabezadoRF2(data);

        addOptions(arr, select);

        datos.forEach(element => {
            if(element.ciudad_municipio_nom === select.value) {
                if(element.fuente_tipo_contagio === "Relacionado") r++;
                if(element.fuente_tipo_contagio === "Importado") i++;

                data.setCell(contador,0, element.fecha_reporte_web);
                data.setCell(contador,1, element.ciudad_municipio_nom);
                data.setCell(contador,2, element.departamento_nom);
                data.setCell(contador,3, element.edad);
                data.setCell(contador,4, element.sexo);
                data.setCell(contador,5, element.ubicacion);
                data.setCell(contador,6, element.estado);
                data.setCell(contador,7, element.recuperado);
                data.setCell(contador,8, element.fuente_tipo_contagio);
                contador++;
            }
        });

        console.log(r + " " + i);  // Debug
        var table = new google.visualization.Table(document.getElementById('table'));

        var options = fillOptions();
    
        table.draw(data, options);

        crearGraficoRF2(r, i, data2);
    })
}

function crearRF3(){
    var url = "https://raw.githubusercontent.com/Lenny-UFPS/reporte-covid-19/main/resources/datos.json";
    var mySet = new Set();
    var counters;
    var data = new google.visualization.DataTable();
    var data2 = new google.visualization.DataTable();

    leerJSON(url).then(datos => {
        datos.sort(function (a, b){  // Working - Array Sort por departamento
            return a.departamento_nom.localeCompare(b.departamento_nom);
        });

        datos.forEach(element => { // Conocer los departamentos que hay dentro del JSON para realizar la gráfica con sus n cantidades
            mySet.add(element.departamento_nom);
        });

        data.addRows(datos.length);
        data2.addRows(mySet.size);

        crearEncabezadoRF3(data);

        counters = new Array(mySet.size);

        for(let i = 0; i < mySet.size; i++){ // Inicializar el array de contadores para el piechart
            counters[i] = 0;
        }

        let contador = 0;
        datos.forEach(element => {
            counters[findIndex(mySet, element.departamento_nom)] += 1;
            data.setCell(contador,0, element.fecha_reporte_web);
            data.setCell(contador,1, element.departamento_nom);
            data.setCell(contador,2, element.edad);
            data.setCell(contador,3, element.sexo);
            data.setCell(contador,4, element.ubicacion);
            data.setCell(contador,5, element.estado);
            data.setCell(contador,6, element.recuperado);
            contador++;
        });

        var table = new google.visualization.Table(document.getElementById('table'));

        var options = fillOptions();
    
        table.draw(data, options);

        crearGraficoRF3(mySet, counters, data2);
    })
}

function fillOptions(){  // Options --> Estilo de la tabla creada dinámicamente con la API de Google Charts
    var options = {
        allowHtml: true, 
        showRowNumber: true,
        width: '100%', 
        height: '100%',
        page: 'enable',
        pageSize: 25,
        pagingSymbols: { prev: 'prev', next: 'next'},
        pagingButtonsConfiguration: 'auto'
        ,
        cssClassNames: { 
            headerRow: 'headerRow',
            tableRow: 'tableRow',
            oddTableRow: 'oddTableRow',
            selectedTableRow: 'selectedTableRow',
            // hoverTableRow: 'hoverTableRow',
            headerCell: 'headerCell',
            tableCell: 'tableCell',
            rowNumberCell: 'rowNumberCell'
        }
    };

    return options;
}

function findIndex(mySet, param){ // Encontrar el índice de un elemento en un Set --> Simular la función findIndex() utilizada en Array
    let counter = 0;
    for(let item of mySet){
        if(item === param) return counter;
        counter++;
    }
}

function crearGraficoRF1(m, f, data){  // Piechart de casos por departamento
    var value = document.getElementById('selectDpto').value;
    data.addColumn('string', 'Description');
    data.addColumn('number', 'Value');

    //Crear tabla para graficar:
    data.setCell(0,0, 'Masculino');
    data.setCell(0,1, m);

    data.setCell(1,0, 'Femenino');
    data.setCell(1,1, f);

    var titulo = "Relación de Casos Positivos por COVID-19 en " + value + " de acuerdo al sexo/género" ;

    var options = {
        title: titulo,
        is3D: true,
        pieSliceText: 'percentage',
        width: "100%",
        height: 800,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
    chart.draw(data, options);
}

function crearGraficoRF2(r, i, data){ // Piechart de casos por municipio
    var value = document.getElementById('selectDpto').value;
    data.addColumn('string', 'Description');
    data.addColumn('number', 'Value');

    //Crear tabla para graficar:
    data.setCell(0,0, 'Relacionado');
    data.setCell(0,1, r);

    data.setCell(1,0, 'Importado');
    data.setCell(1,1, i);

    var titulo = "Relación de Casos Positivos por COVID-19 en " + value + " de acuerdo a la Fuente de Contagio" ;

    var options = {
        title: titulo,
        is3D: true,
        pieSliceText: 'percentage',
        width: "100%",
        height: 800,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
    chart.draw(data, options);
}

function crearGraficoRF3(mySet, counters, data) { // El porcentaje que se muestra en el Piechart es el de los 2 porcentajes más grandes | Total de Casos en Colombia, organizado por departamentos
    data.addColumn('string', 'Description');
    data.addColumn('number', 'Value');

    //Crear tabla para graficar:
    let contador = 0;
    for(let item of mySet){
        data.setCell(contador,0, item);
        data.setCell(contador,1, counters[contador++]);
    }

    var options = {
        title: 'Total de Casos Positivos COVID-19 por Departamento',
        is3D: true,
        pieSliceText: 'percentage',
        width: "100%",
        height: 800,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
    chart.draw(data, options);
}

function crearEncabezadoRF1(data){
    data.addColumn('string', 'Fecha Reporte'); // Column 0
    data.addColumn('string', 'Departamento'); // Column 1
    data.addColumn('number', 'Edad'); // Column 2
    data.addColumn('string', 'Sexo'); // Column 3
    data.addColumn('string', 'Ubicación'); // Column 4
    data.addColumn('string', 'Estado'); // Column 5
    data.addColumn('string', 'Recuperado'); // Column 6
}

function crearEncabezadoRF2(data){
    data.addColumn('string', 'Fecha Reporte'); // Column 0
    data.addColumn('string', 'Municipio'); // Column 0
    data.addColumn('string', 'Departamento'); // Column 1
    data.addColumn('number', 'Edad'); // Column 3
    data.addColumn('string', 'Sexo'); // Column 4
    data.addColumn('string', 'Ubicación'); // Column 5
    data.addColumn('string', 'Estado'); // Column 6
    data.addColumn('string', 'Recuperado'); // Column 7
    data.addColumn('string', 'Fuente de Contagio'); // Column 8
}

function crearEncabezadoRF3(data){
    data.addColumn('string', 'Fecha Reporte'); // Column 0
    data.addColumn('string', 'Departamento'); // Column 1
    data.addColumn('number', 'Edad'); // Column 2
    data.addColumn('string', 'Sexo'); // Column 3
    data.addColumn('string', 'Ubicación'); // Column 4
    data.addColumn('string', 'Estado'); // Column 5
    data.addColumn('string', 'Recuperado'); // Column 6
}
