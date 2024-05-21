class SudokuGA {
    constructor(puzzle) {
        this.puzzle = puzzle;
        this.populationSize = 6;
        this.mutationRate = 1;
        this.maxGenerations = 1;
        this.population = [];
        this.executionTime = 0;
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

    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            let individual = this.createIndividual();
            this.population.push(individual);
        }
    }

    createIndividual() {
        let individual = this.puzzle;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (individual[i][j] === 0) {
                    individual[i][j] = Math.floor(Math.random() * 4) + 1;
                }
            }
        }
        return individual;
    }

    fitness(individual) {
        let fitness = 0;
    
        // Check rows and columns for duplicates
        for (let i = 0; i < 4; i++) {
            let row = new Set(individual[i]);
            let col = new Set();
            for (let j = 0; j < 4; j++) {
                col.add(individual[i][j]);
            }
            fitness += (row.size) + (col.size);
        }
    
        return fitness;
    }

    selectParent() {
        let selected = [];
        for (let i = 0; i < 2; i++) { // Tournament selection (size 2)
            let randomIndex = Math.floor(Math.random() * this.populationSize);
            selected.push(this.population[randomIndex]);
        }
    
        return selected.reduce((best, current) => 
            this.fitness(current) > this.fitness(best) ? current : best);
    }

    crossover(parent1, parent2) {
        let crossoverPoint = Math.floor(Math.random() * 4);
        let child = parent1.slice(); // Create a copy of parent1
    
        // Perform single-point crossover
        for (let i = crossoverPoint; i < 4; i++) {
            child[i] = parent2[i];
        }
    
        // Calculate fitness of child and parents
        let childFitness = this.fitness(child);
        let parent1Fitness = this.fitness(parent1);
        let parent2Fitness = this.fitness(parent2);
    
        // Determine the best individual
        let bestIndividual = parent1;
        let bestFitness = parent1Fitness;
    
        if (childFitness > bestFitness) {
            bestIndividual = child;
            bestFitness = childFitness;
        } else if (parent2Fitness > bestFitness) {
            bestIndividual = parent2;
            bestFitness = parent2Fitness;
        }
        
        this.printIndividual(bestIndividual);
        console.log(this.fitness(bestIndividual));
        return bestIndividual; // Return the best individual (child or parent)
    }

    mutate(individual) {
        let mutation = individual;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (Math.random() < this.mutationRate) {
                    mutation[i][j] = Math.floor(Math.random() * 4) + 1;
                }
            }
        }
        this.printIndividual(mutation);
        console.log(this.fitness(mutation));
        console.log('fin');
        if (this.fitness(mutation) >= this.fitness(individual)){
            return mutation;
        } else {
            return individual;
        }
    }

    evolve() {
        for (let generation = 0; generation < this.maxGenerations; generation++) {
            let newPopulation = [];
            for (let i = 0; i < this.populationSize; i++) {
                let parent1 = this.selectParent();
                let parent2 = this.selectParent();
                let child = this.crossover(parent1, parent2);
                let mutation = this.mutate(child);
                newPopulation.push(mutation);
            }
            this.population = newPopulation;

            let bestFitness = Math.max(...this.population.map(ind => this.fitness(ind)));
            if (bestFitness === 32) {
                console.log(`Solution found in generation ${generation}`);
                break;
            }
        }
    }

    printIndividual(individual){
        for (let row = 0; row < individual.length; row++) {
            for (let col = 0; col < individual[row].length; col++) {
              console.log(individual[row][col], " "); // Add a space after each element
            }
            console.log(); // Add a newline after each row
          }
    }

    printSudoku(sudoku) {
        alert(this.fitness(sudoku));
        let grid = document.getElementById('sudokuGrid');
        for (let i = 0; i < grid.rows.length; i++) {
            for (let j = 0; j < grid.rows[i].cells.length; j++) {
                let input = grid.rows[i].cells[j].getElementsByTagName('input')[0];
                input.value = sudoku[i][j];
                input.readOnly = true; // Deshabilitar la edición de las casillas
            }
        }
    }

    run() {
        this.startTimer();
        this.initializePopulation();
        this.evolve();
        let bestIndividual = this.population.reduce((best, current) => 
            this.fitness(current) > this.fitness(best) ? current : best, 
            this.population[0]);
            this.stopTimer();
        this.printSudoku(bestIndividual);
        }
}

function checkDuplicatesInSubgrid(subgrid) {
    let set = new Set();
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            if (subgrid[i][j] !== 0 && set.has(subgrid[i][j])) {
                return false; // Duplicate found
            }
            set.add(subgrid[i][j]);
        }
    }
    return true; // No duplicates
}

