function create_world(id: string) {
    let canvas = <HTMLCanvasElement>document.getElementById(id)
    let ctx = canvas.getContext("2d")
    ctx.imageSmoothingEnabled = false
    return {
        canvas: canvas,
        width: canvas.width,
        height: canvas.height,
        ctx: ctx,
    };
}

function clear_screen({ ctx, width, height }) {
    ctx.clearRect(0, 0, width, height)
}

let board = { x: 50, y: 50, width: 200, height: 200, color: "rgb(255,255,255)" }

type Tile = { no: number, x: number, y: number }
let tiles: Tile[] = [
    { no: 1, x: 0, y: 0 },
    { no: 0, x: 1, y: 0 }
]

function draw_obj({ ctx }, { x, y, width, height, color }) {
    ctx.strokeStyle = color
    ctx.strokeRect(x, y, width, height)
}

const TILE_WIDTH = 50
const TILE_HEIGHT = 50
function draw_tile({ ctx }, { no, x, y }) {
    ctx.strokeStyle = (no == 0) ? "rgb(200,200,200)" : "rgb(255,0,0)"
    ctx.strokeRect(x * TILE_WIDTH + 1, y, TILE_WIDTH, TILE_HEIGHT)
}

function is_inside({ x, y }, ex: number, ey: number) {
    let _x = x * TILE_WIDTH
    let _y = y * TILE_HEIGHT
    return (_x < ex && ex < _x + TILE_WIDTH
        && _y < ey && ey < _y + TILE_HEIGHT)
}

function check_stick_position({ x, y }) {
}

let world = create_world("canvas")

function main_loop() {

    clear_screen(world)
    tiles.forEach((t) => draw_tile(world, t))
}

setInterval("main_loop()", 16)


let mouseDown = false
let mousePos = { x: 0, y: 0 }

function get_empty_tile(tiles: Tile[]): Tile {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].no == 0) return tiles[i]
    }
    return tiles[0]
}

function handleMouseDown(e) {
    mouseDown = true;
    tiles.forEach((t) => {
        if (is_inside(t, e.clientX, e.clientY)) {
            let empty_tile = get_empty_tile(tiles)
            console.log(empty_tile)
            empty_tile.no = t.no
            t.no = 0
        }
    })
}
function handleMouseUp(e) {
    mouseDown = false
    // stick = { x: STICK_DEAFULT_X, y: STICK_DEFAULT_Y, draged: false }
}
function handleMouseMove(e) {
    if (!mouseDown) return;
}

document.onmousedown = function (e) {
    e.preventDefault()
    handleMouseDown(e)
}
document.onmouseup = function (e) {
    e.preventDefault()
    handleMouseUp(e)
}
document.onmousemove = function (e) {
    e.preventDefault()
    handleMouseMove(e)
}

world.canvas.ontouchstart = function (e) {
    e.preventDefault()
    handleMouseDown(e.changedTouches[0])
}
world.canvas.ontouchend = function (e) {
    e.preventDefault()
    handleMouseUp(e.changedTouches[0])
}
world.canvas.ontouchmove = function (e) {
    e.preventDefault()
    handleMouseMove(e.changedTouches[0])
}

document.addEventListener('touchstart', e => e.preventDefault(), { passive: false });