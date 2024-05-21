let sudoku = generateRandomSudoku();
verSudoku(sudoku);
let sudokuGA = new SudokuGA(sudoku);
// Función para generar un Sudoku completo de forma aleatoria
function generateRandomSudoku() {
    let sudoku = [];
    // Inicializar el Sudoku con celdas vacías
    for (let i = 0; i < 4; i++) {
        sudoku[i] = [];
        for (let j = 0; j < 4; j++) {
            sudoku[i][j] = 0;
        }
    }

    // Llenar el Sudoku de forma aleatoria
    fillSudokuRandomly(sudoku);

    // Mostrar solo algunas casillas
    let cellsToShow = 4;
    let shownCells = 0;
    while (shownCells < cellsToShow) {
        let row = Math.floor(Math.random() * 4);
        let col = Math.floor(Math.random() * 4);
        if (sudoku[row][col] !== 0) {
            sudoku[row][col] = 0;
            shownCells++;
        }
    }

    // Actualizar el HTML con el Sudoku generado
    let grid = document.getElementById('sudokuGrid');
    for (let i = 0; i < grid.rows.length; i++) {
        for (let j = 0; j < grid.rows[i].cells.length; j++) {
            let input = grid.rows[i].cells[j].getElementsByTagName('input')[0];
            if (sudoku[i][j] !== 0) {
                input.value = sudoku[i][j];
                input.readOnly = true; // Deshabilitar la edición de las casillas mostradas
            } else {
                input.value = '';
                input.readOnly = false; // Habilitar la edición de las casillas ocultas
            }
        }
    }

    return sudoku;
}

// Función recursiva para llenar el Sudoku de forma aleatoria
function fillSudokuRandomly(sudoku, row = 0, col = 0) {
    // Si se ha llegado al final del Sudoku, está completo
    if (row === 4) {
        return true;
    }

    // Calcular la siguiente fila y columna
    let nextRow = col === 3 ? row + 1 : row;
    let nextCol = (col + 1) % 4;

    // Obtener un número aleatorio para colocar en la celda actual
    let numbers = [1, 2, 3, 4];
    shuffleArray(numbers);

    // Probar cada número posible en la celda actual
    for (let num of numbers) {
        if (isValidPlacement(sudoku, row, col, num)) {
            sudoku[row][col] = num;
            // Continuar con la siguiente celda
            if (fillSudokuRandomly(sudoku, nextRow, nextCol)) {
                return true;
            }
            // Si no se pudo completar el Sudoku, revertir la asignación y probar con otro número
            sudoku[row][col] = 0;
        }
    }

    // Si no se puede colocar ningún número en la celda actual, retroceder
    return false;
}

// Función para comprobar si es válido colocar un número en una celda del Sudoku
function isValidPlacement(sudoku, row, col, num) {
    // Comprobar si el número ya está en la fila o la columna
    for (let i = 0; i < 4; i++) {
        if (sudoku[row][i] === num || sudoku[i][col] === num) {
            return false;
        }
    }
    // Comprobar si el número ya está en el cuadrante 2x2
    let startRow = Math.floor(row / 2) * 2;
    let startCol = Math.floor(col / 2) * 2;
    for (let i = startRow; i < startRow + 2; i++) {
        for (let j = startCol; j < startCol + 2; j++) {
            if (sudoku[i][j] === num) {
                return false;
            }
        }
    }
    return true;
}

// Función para mezclar aleatoriamente un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function verSudoku(sudoku){
    let cellsToShow = 4;
    let shownCells = 0;
    while (shownCells < cellsToShow) {
        let row = Math.floor(Math.random() * 4);
        let col = Math.floor(Math.random() * 4);
        if (sudoku[row][col] !== 0) {
            sudoku[row][col] = 0;
            shownCells++;
        }
    }

    // Actualizar el HTML con el Sudoku generado
    let grid = document.getElementById('sudokuGrid');
    for (let i = 0; i < grid.rows.length; i++) {
        for (let j = 0; j < grid.rows[i].cells.length; j++) {
            let input = grid.rows[i].cells[j].getElementsByTagName('input')[0];
            if (sudoku[i][j] !== 0) {
                input.value = sudoku[i][j];
                input.readOnly = true; // Deshabilitar la edición de las casillas mostradas
            } else {
                input.value = '';
                input.readOnly = false; // Habilitar la edición de las casillas ocultas
            }
        }
    }
}

function solveGenetic(){
    sudokuGA.run();
    alert(sudokuGA.executionTime);
}