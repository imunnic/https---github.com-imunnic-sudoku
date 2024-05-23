let sudoku = generarSudoku();
verSudoku(sudoku);

function reset() {
    location.reload();
}
 
// Función para generar un Sudoku completo de forma aleatoria
function generarSudoku() {
    let sudoku = [];
    for (let i = 0; i < 9; i++) {
        sudoku[i] = [];
        for (let j = 0; j < 9; j++) {
            sudoku[i][j] = 0;
        }
    }

    completarSudoku(sudoku);
    sudoku = multiplicarElementosSimetricos(generarMatrizAleatoria(sudoku), sudoku);

    pintarSudoku(sudoku);

    return sudoku;
}

function completarSudoku(sudoku, row = 0, col = 0) {
    if (row === 9) {
        return true;
    }

    let nextRow = col === 8? row + 1 : row;
    let nextCol = (col + 1) % 9;

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    mezclarArray(numbers);

    for (let num of numbers) {
        if (isLugarValido(sudoku, row, col, num)) {
            sudoku[row][col] = num;
            if (completarSudoku(sudoku, nextRow, nextCol)) {
                return true;
            }
            sudoku[row][col] = 0;
        }
    }
    return false;
}

function isLugarValido(sudoku, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (sudoku[row][i] === num || sudoku[i][col] === num) {
            return false;
        }
    }
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (sudoku[i][j] === num) {
                return false;
            }
        }
    }
    return true;
}

function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function verSudoku(sudoku){
    let cellsToShow = 40;
    let shownCells = 0;
    while (shownCells < cellsToShow) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (sudoku[row][col]!== 0) {
            sudoku[row][col] = 0;
            shownCells++;
        }
    }

    pintarSudoku(sudoku);
}

function resolver(){
    let sudokuGA = new SudokuGA(sudoku);
    sudokuGA.run();
    pintarSudoku(sudokuGA.solucion);
}

function imprimirMatriz(matriz) {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            console.log(matriz[i][j], end=" ");
        }
        console.log();
    }
}

// Función auxiliar para generar índices aleatorios sin repetición
function generarMatrizAleatoria(matrizOriginal) {

    const filas = matrizOriginal.length;
    const columnas = matrizOriginal[0].length;
    const probabilidadCero = 0.4;

    let matrizAleatoria = new Array(filas);
    for (let i = 0; i < filas; i++) {
        matrizAleatoria[i] = new Array(columnas);
    }

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const numeroAleatorio = Math.random();
            matrizAleatoria[i][j] = numeroAleatorio < probabilidadCero? 0 : 1;
        }
    }

    return matrizAleatoria;
} 
  //funcion que sirve para multiplicar dos matrices elemento a elemento. Permite poner en el sudoku
  //valores nulos para las celdas vacías
  function multiplicarElementosSimetricos(matrizA, matrizB) {
    const filas = matrizA.length;
    const columnas = matrizA[0].length;

    const matrizResultado = new Array(filas);
    for (let i = 0; i < filas; i++) {
        matrizResultado[i] = new Array(columnas);
    }

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            matrizResultado[i][j] = matrizA[i][j] * matrizB[i][j];
        }
    }

    return matrizResultado;
}

  function pintarSudoku(sudoku){
    let grid = document.getElementById('sudokuGrid');
    for (let i = 0; i < grid.rows.length; i++) {
        for (let j = 0; j < grid.rows[i].cells.length; j++) {
            let span = grid.rows[i].cells[j].getElementsByTagName('span')[0];
            if (sudoku[i][j] !== 0) {
                span.textContent = sudoku[i][j];
            } else {
                span.textContent = '';
            }
        }
    }
}
