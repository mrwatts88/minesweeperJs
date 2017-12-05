squaresAcross = 24;
squaresDown = 16;
squareSide = 25;
canvasWidth = squaresAcross * squareSide;
canvasHeight = squaresDown * squareSide;
squaresArray = [];

function setup() {
    createCanvas(canvasWidth + 1, canvasHeight + 1);
    background(0);
    for (let j = 0; j < squaresDown; j++) {
        squaresArray[j] = new Array();
        for (let i = 0; i < squaresAcross; i++) {
            let isBomb = false;
            if (Math.random() < 0.1)
                isBomb = true;
            squaresArray[j][i] = new Square(i * squareSide, j * squareSide, j, i, isBomb);
        }
    }
    for (let j = 0; j < squaresDown; j++) {
        for (let i = 0; i < squaresAcross; i++) {
            squaresArray[j][i].countNeighbors();
        }
    }
    noLoop();
}

function draw() {
    background(0);
    fill(255, 155, 0);
    for (let j = 0; j < squaresDown; j++) {
        for (let i = 0; i < squaresAcross; i++) {
            squaresArray[j][i].show();
        }
    }
}

function mouseClicked() {
    xIndex = floor(mouseX / squareSide);
    yIndex = floor(mouseY / squareSide);
    squaresArray[yIndex][xIndex].reveal();
    redraw();
}

function checkLose(square) {
    return square.isBomb;
}

function checkWin() {
    return false;
}

function endGame() {
    for (let arr of squaresArray) {
        for (let square of arr) {
            square.revealed = true;
        }
    }
}

class Square {
    constructor(xpos, ypos, row, col, isBomb) {
        this.side = squareSide;
        this.xpos = xpos;
        this.ypos = ypos;
        this.row = row;
        this.col = col;
        this.revealed = false;
        this.isBomb = isBomb;
        this.neighbors = 0;
    };

    show() {
        if (this.revealed) {
            if (this.isBomb) {
                fill(255, 0, 0);
                rect(this.xpos, this.ypos, this.side, this.side);
                fill(0, 255, 0);
                ellipse(this.xpos + 13, this.ypos + 13, 10, 10);
            } else {
                fill(0, 155, 255);
                rect(this.xpos, this.ypos, this.side, this.side);
                fill(0);
                text(this.neighbors, this.xpos + 10, this.ypos + 18);
            }
        } else {
            fill(255, 155, 0);
            rect(this.xpos, this.ypos, this.side, this.side);
        }
    };

    countNeighbors() {
        for (let j = this.row - 1; j <= this.row + 1; j++) {
            for (let i = this.col - 1; i <= this.col + 1; i++) {
                if (!(j == this.row && i == this.col) && j >= 0 && i >= 0 && i < squaresAcross && j < squaresDown) {
                    if (squaresArray[j][i].isBomb) {
                        this.neighbors++;
                    }
                }
            }
        }
    }

    reveal() {
        if (this.revealed == false) {
            this.revealed = true;
            if (checkLose(this)) {
                endGame();
            } else if (checkWin()) {
                
            } else {
                if (this.neighbors == 0 && !this.isBomb) {
                    if (this.row > 0 && this.col > 0)
                        squaresArray[this.row - 1][this.col - 1].reveal();
                    if (this.row > 0 && this.col < squaresAcross - 1)
                        squaresArray[this.row - 1][this.col + 1].reveal();
                    if (this.row < squaresDown - 1 && this.col > 0)
                        squaresArray[this.row + 1][this.col - 1].reveal();
                    if (this.row < squaresDown - 1 && this.col < squaresAcross - 1)
                        squaresArray[this.row + 1][this.col + 1].reveal();
                    if (this.row > 0)
                        squaresArray[this.row - 1][this.col].reveal();
                    if (this.row < squaresDown - 1)
                        squaresArray[this.row + 1][this.col].reveal();
                    if (this.col > 0)
                        squaresArray[this.row][this.col - 1].reveal();
                    if (this.col < squaresAcross - 1)
                        squaresArray[this.row][this.col + 1].reveal();
                }
            }
        }
    }
}