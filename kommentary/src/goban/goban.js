import 'board.js'
import 'kifu.js'
import 'editor.js'
import 'controller.js'

export default class Goban {
    constructor(size = {x: 19, y: 19}, background = "default"){
        this.board = new Board(size)
        this.kifu = new Kifu()
        this.editor = new Editor()
        this.controller = new Controller()
    }
}