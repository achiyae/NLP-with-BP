/* 2.2 The two players X O take turns marking the cells */
function markCell(player, cell) {
    return Event('mark', { player: player.id, cell: cell.id })
}
const AnyMark = bp.EventSet('AnyMark', e => e.name == 'mark')
function AnyMarkPlayer(player) {
    return bp.EventSet('AnyMarkPlayer', e => e.name == 'mark' && e.data.player == player.id)
}
function AnyMarkCell(cell) {
    return bp.EventSet('AnyMarkCell', e => e.name == 'mark' && e.data.cell == cell.id)
}
ctx.bthread('2.2 The players take turns marking the cells', function () {
    while (true) {
        sync({ waitFor: AnyMarkPlayer(ctx.getEntityById('X')), block: AnyMarkPlayer(ctx.getEntityById('O')) })
        sync({ waitFor: AnyMarkPlayer(ctx.getEntityById('O')), block: AnyMarkPlayer(ctx.getEntityById('X')) })
    }
})

/* 3. Each cell can be marked only once.*/
ctx.bthread('3. Each cell can be marked only once.', 'Cell', function (cell) {
    sync({ waitFor: AnyMarkCell(cell) })
    sync({ block: AnyMarkCell(cell) })
})

/*4. The first player to mark 3 cells in a row wins.
5. if all 9 cells of the board have been marked with X and O, but no player won, the game is over.*/
function win(player) {
    return Event('win', { player: player.id })
}
const AnyWin = bp.EventSet('AnyWin', e => e.name == 'win')
ctx.bthread('4. The first player to mark 3 cells in a row wins.', ['Player,3CellsInARow'], function (player, row) {
    for (let i = 0; i < 3; i++) {
        sync({ waitFor: row.cells.map(cell => markCell(player, cell)) })
    }
    sync({ request: win(player), block: win(player).negate() })
    sync({ block: bp.all })
})

function tie() {
    return Event('tie')
}
bthread('5. When all 9 cells have been marked with X and O and no player won, it\'s a tie and the game is over.', function () {
    for (let i = 0; i < 9; i++) {
        sync({ waitFor: AnyMark })
    }
    sync({ request: tie(), block: tie().negate().minus(AnyWin) })
    sync({ block: bp.all })
})