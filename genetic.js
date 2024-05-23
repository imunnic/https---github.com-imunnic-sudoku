class SudokuGA {
    constructor(sudoku) {
        this.sudoku = sudoku;
        this.posicionesCeros = encontrarCeros(this.sudoku);
        this.tamanoPoblacion = parseInt(document.getElementById('maxPopulation').value);
        this.ratioMutacion = 1;
        this.ratioMutacion = 0.3;
        this.generaciones = parseInt(document.getElementById('maxGenerations').value);;
        this.poblacion = [];
        this.executionTime = 0;
        this.iniciarPoblacion();
        this.solucion = [];
        this.imprimirDatosIniciales();
    }

    startTimer() {
        this.startTime = performance.now();
    }

    // Método para detener la medición del tiempo y calcular el tiempo transcurrido
    stopTimer() {
        this.executionTime = performance.now() - this.startTime;
    }

    // Método para obtener el tiempo de ejecución
    getExecutionTime() {
        return this.executionTime;
    }

    iniciarPoblacion() {
        this.poblacion.push(this.obtenerPadre());
        this.poblacion.push(this.obtenerMadre());
    }

    //comprueba validez de la solución
    fitness(solucion) {
        let fitness = 0;

        for (let i = 0; i < 9; i++) {
            let row = new Set(solucion[i]);
            fitness += row.size;
        }

        for (let j = 0; j < 9; j++) {
            let col = new Set();
            for (let i = 0; i < 9; i++) {
                col.add(solucion[i][j]);
            }
            fitness += col.size;
        }

        const quadrantSize = 3;
        for (let x = 0; x < 9; x += quadrantSize) {
            for (let y = 0; y < 9; y += quadrantSize) {
                const quadrant = new Set();
                for (let i = x; i < x + quadrantSize; i++) {
                    for (let j = y; j < y + quadrantSize; j++) {
                        quadrant.add(solucion[i][j]);
                    }
                }
                fitness += quadrant.size;
            }
        }

        return fitness;
    }

    //combina padre y madre
    combinarSoluciones(padre, madre) {

        let solucionCombinada = [];

        solucionCombinada.push([...padre[0]]);
        solucionCombinada.push([...padre[1]]);

        solucionCombinada.push([...madre[2]]);
        solucionCombinada.push([...madre[3]]);

        console.log('combinada:', solucionCombinada);
        return solucionCombinada;
    }

    //muta una solución a otra distinta y de mejor fitness o devuelve la solucion inicial
    mutarSolucion(solucion) {
        let solucionMutada = solucion.map((row) => [...row]);
        let numeroMutaciones = Math.floor(this.posicionesCeros.length * this.ratioMutacion);

        for (let i = 0; i < numeroMutaciones; i++) {
            let indiceAleatorio = Math.floor(Math.random() * this.posicionesCeros.length);
            let [fila, columna] = this.posicionesCeros[indiceAleatorio];
            let valorActual = solucion[fila][columna];

            let mutacion;
            do {
                mutacion = Math.floor(Math.random() * 9) + 1;
            } while (mutacion === valorActual);

            solucionMutada[fila][columna] = mutacion;
        }

        if (this.fitness(solucionMutada) > this.fitness(solucion)){
            return solucionMutada;
        } else {
            return solucion;
        }
    }

    //puebla la nueva generación y elimina a los padres
    nuevaGeneracion(solucion) {
        for (let i = 0; i < this.tamanoPoblacion; i++) {
            let nuevaSolucion = solucion.map((row) => [...row]);
            this.poblacion.push(this.mutarSolucion(nuevaSolucion));
        }
        this.poblacion.pop();
        this.poblacion.pop();
    }

    //evoluciona la solucion
    evolucionar() {
        let generacion = 0;
        do {
            let hijo = this.combinarSoluciones(this.poblacion[0], this.poblacion[1]);
            console.log(hijo);
            this.nuevaGeneracion(hijo);
            generacion++;
            this.poblacion.sort((i1, i2) => this.fitness(i2) - this.fitness(i1));
            if (sonMatricesIguales(hijo, this.poblacion[0])) {
                console.log('iguales')
            }
            console.log(`Generacion: ${generacion}, Mejor fitness: ${this.fitness(this.poblacion[0])}`);
            console.log(this.poblacion[0]);
        } while (this.fitness(this.poblacion[0]) < 48 && generacion < this.generaciones);
            this.solucion = this.poblacion[0];
        document.getElementById('fit').innerHTML += this.fitness(this.poblacion[0]);
        document.getElementById('gen').innerHTML += generacion;
        if (this.fitness(this.poblacion[0]) < 48){
            document.getElementById('fit').style.color = 'red';
            document.getElementById('gen').style.color = 'red';
        } else {
            document.getElementById('fit').style.color = 'green';
            document.getElementById('gen').style.color = 'green';
        }

    }

    //ejecuta
    run() {
        this.startTimer();
        this.evolucionar();
        console.log(this.sudoku);
        this.stopTimer();
    }

    //obtiene a Adan
    obtenerPadre() {
        let sudokuAlterado = this.sudoku.map((row) => [...row]);

        for (let i = 0; i < sudokuAlterado.length; i++) {
            for (let j = 0; j < sudokuAlterado[i].length; j++) {
                if (sudokuAlterado[i][j] == 0) {
                    sudokuAlterado[i][j] = 1;
                }
            }
        }

        return sudokuAlterado;
    }

    //obtiene a Eva
    obtenerMadre() {
        let sudokuAlterado = this.sudoku.map((row) => [...row]);

        // Reemplazar todos los ceros por unos
        for (let i = 0; i < sudokuAlterado.length; i++) {
            for (let j = 0; j < sudokuAlterado[i].length; j++) {
                if (sudokuAlterado[i][j] == 0) {
                    sudokuAlterado[i][j] = 2;
                }
            }
        }

        return sudokuAlterado;
    }

    imprimirDatosIniciales() {
        console.log('Población inicial:')
        console.log(this.poblacion);
        console.log('Fitness padre:')
        console.log(this.fitness(this.poblacion[0]));
        console.log('Fitness madre:')
        console.log(this.fitness(this.poblacion[1]));
        console.log('-----')
        console.log(this.fitness(this.combinarSoluciones(this.poblacion[0], this.poblacion[1])));
        console.log('-----')
    }

    imprimirDatosPoblacion() {
        this.poblacion.forEach(i => console.log(this.fitness(i)));
    }
}

function sonMatricesIguales(matriz1, matriz2) {
    // Verificar si ambas matrices tienen la misma cantidad de filas
    if (matriz1.length !== matriz2.length) {
        return false;
    }

    // Verificar si ambas matrices tienen la misma cantidad de columnas
    for (let i = 0; i < matriz1.length; i++) {
        if (matriz1[i].length !== matriz2[i].length) {
            return false;
        }
    }

    // Comparar cada elemento de las matrices
    for (let i = 0; i < matriz1.length; i++) {
        for (let j = 0; j < matriz1[i].length; j++) {
            if (matriz1[i][j] !== matriz2[i][j]) {
                return false;
            }
        }
    }

    return true;
}

//Encuentra las posiciones vacías del sudoku
function encontrarCeros(matriz) {
    let posicionesCeros = [];
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] === 0) {
                posicionesCeros.push([i, j]);
            }
        }
    }
    return posicionesCeros;
}