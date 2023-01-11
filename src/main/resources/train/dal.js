//  1. The game is played on a grid of 3x3 cells.
const boardWidth = 3
const boardHeight = 3
let cells = []
for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
        cells.push(ctx.Entity('cell(' + i + ',' + j + ')', 'cell', { i: i, j: j }))
    }
}
ctx.populateContext(cells)
ctx.registerQuery('Cell', entity => entity.type == String('cell'))

/*  2.1 The game is played by two players, X and O */
let players = [ctx.Entity('X', 'player'), ctx.Entity('O', 'player')]
ctx.populateContext(players)
ctx.registerQuery('Player', entity => entity.type == String('player'))

/*  4. The first player to mark 3 cells in a row wins. */
let rowLength = 3
let rows = []
for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight - (rowLength - 1); j++) {
        let row = []
        for (let k = 0; k < rowLength; k++) {
            row.push(ctx.getEntityById('cell(' + i + ',' + (j + k) + ')'))
        }
        rows.push(ctx.Entity('Vertical from (' + i + ',' + j + ')to (' + i + ',' + (j + rowLength - 1) + ')', '3CellsInARow', { cells: row }))
    }

}
for (let i = 0; i < boardHeight; i++) {
    for (let j = 0; j < boardWidth - (rowLength - 1); j++) {
        let row = []
        for (let k = 0; k < rowLength; k++) {
            row.push(ctx.getEntityById('cell(' + (j + k) + ',' + i + ')'))
        }
        rows.push(ctx.Entity('Horizontal from (' + j + ',' + i + ')to (' + (j + rowLength - 1) + ',' + i + ')', '3CellsInARow', { cells: row }))
    }
}
for (let i = 0; i < boardWidth - (rowLength - 1); i++) {
    for (let j = 0; j < boardHeight - (rowLength - 1); j++) {
        let row = []
        for (let k = 0; k < rowLength; k++) {
            row.push(ctx.getEntityById('cell(' + (i + k) + ',' + (j + k) + ')'))
        }
        rows.push(ctx.Entity('Diagonal_0 from(' + i + ',' + j + ') to (' + (i + rowLength - 1) + ',' + (j + rowLength - 1) + ')', '3CellsInARow', { cells: row }))
    }
}
for (let i = 0; i < boardWidth - (rowLength - 1); i++) {
    for (let j = rowLength - 1; j < boardHeight; j++) {
        let row = []
        for (let k = 0; k < rowLength; k++) {
            row.push(ctx.getEntityById('cell(' + (i + k) + ',' + (j - k) + ')'))
        }
        rows.push(ctx.Entity('Diagonal_1 from(' + i + ',' + j + ') to (' + (i + rowLength - 1) + ',' + (j - rowLength + 1) + ')', '3CellsInARow', { cells: row }))
    }
}
ctx.populateContext(rows)
ctx.registerQuery('3CellsInARow', entity => entity.type == String('3CellsInARow'))


