class SudokuGA {
  constructor(sudoku) {
    this.sudoku = sudoku;
    this.tamanoPoblacion = 10;
    this.ratioMutacion = 1;
    this.generaciones = 1000;
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

  fitness(individual) {
    let fitness = 0;
  
    // Check rows and columns for duplicates (same as original code)
    for (let i = 0; i < 4; i++) {
      let row = new Set(individual[i]);
      fitness += row.size;
    }
  
    for (let j = 0; j < 4; j++) {
      let col = new Set();
      for (let i = 0; i < 4; i++) {
        col.add(individual[i][j]);
      }
      fitness += col.size;
    }
  
    // Check quadrants for duplicates
    const quadrantSize = 2;
    for (let x = 0; x < 4; x += quadrantSize) {
      for (let y = 0; y < 4; y += quadrantSize) {
        const quadrant = new Set();
        for (let i = x; i < x + quadrantSize; i++) {
          for (let j = y; j < y + quadrantSize; j++) {
            quadrant.add(individual[i][j]);
          }
        }
        fitness += quadrant.size;
      }
    }
  
    return fitness;
  }

  combinarSoluciones(padre, madre) {

    // Crear una nueva matriz combinada de 4x4
    let solucionCombinada = [];

    // Agregar las dos primeras filas de la primera matriz
    solucionCombinada.push([...padre[0]]);
    solucionCombinada.push([...padre[1]]);

    // Agregar las dos primeras filas de la segunda matriz
    solucionCombinada.push([...madre[2]]);
    solucionCombinada.push([...madre[3]]);

    console.log('combinada:', solucionCombinada);
    return solucionCombinada;
    }
    
    mutarSolucion(solucion) {
        let solucionMutada = solucion.map((row) => [...row]);
        let intentos = 0;
        let mutacionExitosa = false;
    
        while (!mutacionExitosa && intentos < 10) {
            let fila1, columna1, fila2, columna2, temp;
            do {
                fila1 = Math.floor(Math.random() * 4);
                columna1 = Math.floor(Math.random() * 4);
            } while (this.sudoku[fila1][columna1] !== 0);
    
            do {
                fila2 = Math.floor(Math.random() * 4);
                columna2 = Math.floor(Math.random() * 4);
            } while (this.sudoku[fila2][columna2] !== 0 || (fila1 === fila2 && columna1 === columna2));
    
            // Intercambiar valores
            temp = solucionMutada[fila1][columna1];
            solucionMutada[fila1][columna1] = solucionMutada[fila2][columna2];
            solucionMutada[fila2][columna2] = temp;
    
            // Verificar si la mutación resultó en un cambio
            if (JSON.stringify(solucion) !== JSON.stringify(solucionMutada)) {
                mutacionExitosa = true;
            }
            intentos++;
        }
    
        if (mutacionExitosa) {
            this.poblacion.push(solucionMutada);
            console.log('Mutado:', solucionMutada);
        } else {
            // Si no se logró una mutación exitosa, se agrega una copia para mantener el tamaño de la población
            this.poblacion.push(solucion.map((row) => [...row]));
        }
    }

    nuevaGeneracion(solucion) {
        this.poblacion = [this.poblacion[0], this.poblacion[1]]; // Mantener siempre los mejores dos individuos
    
        for (let i = 2; i < this.tamanoPoblacion; i++) {
            let nuevaSolucion = solucion.map((row) => [...row]);
            this.mutarSolucion(nuevaSolucion);
        }
    }


    evolucionar() {
        let generacion = 0;
        do {
            let hijo = this.combinarSoluciones(this.poblacion[0], this.poblacion[1]);
            this.nuevaGeneracion(hijo);
            generacion++;
            this.poblacion.sort((i1, i2) => this.fitness(i2) - this.fitness(i1));
            if (sonMatricesIguales(hijo,this.poblacion[0])){
                console.log('iguales')
            }
            console.log(`Generacion: ${generacion}, Mejor fitness: ${this.fitness(this.poblacion[0])}`);
            console.log(this.poblacion[0]);
        } while (this.fitness(this.poblacion[0]) < 48 && generacion < this.generaciones);
        console.log(`Total de generaciones: ${generacion}`);
    }

  run() {
    this.startTimer();
    this.evolucionar();
    console.log(this.sudoku);
    this.stopTimer();
  }

  obtenerPadre() {
    // Clonar el sudoku para no modificar el original
    let sudokuAlterado = this.sudoku.map((row) => [...row]);

    // Reemplazar todos los ceros por unos
    for (let i = 0; i < sudokuAlterado.length; i++) {
      for (let j = 0; j < sudokuAlterado[i].length; j++) {
        if (sudokuAlterado[i][j] == 0) {
          sudokuAlterado[i][j] = 1;
        }
      }
    }

    return sudokuAlterado;
  }

  obtenerMadre() {
    // Clonar el sudoku para no modificar el original
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

  imprimirDatosIniciales(){
    console.log('Población inicial:')
    console.log(this.poblacion);
    console.log('Fitness padre:')
    console.log(this.fitness(this.poblacion[0]));
    console.log('Fitness madre:')
    console.log(this.fitness(this.poblacion[1]));
    console.log('-----')
    console.log(this.fitness(this.combinarSoluciones(this.poblacion[0],this.poblacion[1])));
    console.log('-----')
  }

  imprimirDatosPoblacion(){
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

    // Si todos los elementos son iguales, las matrices son iguales
    return true;
}