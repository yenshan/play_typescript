function create_world(id: string) {
    let canvas = <HTMLCanvasElement>document.getElementById(id);
    let ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    return {
        canvas: canvas,
        width: canvas.width,
        height: canvas.height,
        ctx: ctx,
    };
}

enum Direction {
    NUTRAL = "nutral",
    LEFT = "left",
    RIGHT = "right",
}
enum CharaState {
    STOP = "stop",
    RUN = "run",
    DIG = "dig",
    UPDOWN = "updown",
}

function next_frame(idx, frames) {
    let fidx = (idx + 1) % frames.length;
    return [fidx, frames[fidx]];
}

const chara_anime_info = {
    stop: { anime_count: 20, frames: [0, 1] },
    run: { anime_count: 2, frames: [2, 3, 4] }
};

class Chara {
    x: number;
    y: number;
    image: HTMLImageElement;
    init: boolean;
    frame: number;
    draged: boolean;

    private state: CharaState;
    direction: Direction;

    private frame_idx: number;
    private anime_frames = chara_anime_info;
    private anime_counter = 0;

    move_amount = {
        nutral: 0,
        left: -6,
        right: 6,
    };
    constructor(img: string) {
        this.init = false;
        let image = new Image();
        let self = this;
        image.onload = function () {
            self.init = true;
        };
        image.src = img;
        this.image = image;
        this.frame = 0;
        this.state = CharaState.STOP;
        this.direction = Direction.NUTRAL;
        this.frame_idx = 0;
        this.draged = false;
    }
    setPos(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }
    setRelativePos(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
        return this;
    }
    isInside(x: number, y: number) {
        return (this.x < x && x < this.x + CHAR_WIDTH * ZOOM
            && this.y < y && y < this.y + CHAR_HEIGHT * ZOOM);
    }
    move(state: CharaState, dir: Direction) {
        if (state == this.state && dir == this.direction) return;
        this.anime_counter = this.anime_frames[state].anime_count;
        this.state = state;
        this.direction = dir;
        this.frame_idx = 0;
    }
    anime() {
        let { anime_count, frames } = this.anime_frames[this.state];

        if (this.anime_counter <= anime_count) {
            this.anime_counter++;
            return;
        }
        this.anime_counter = 0;

        let [idx, frame] = next_frame(this.frame_idx, frames);

        this.frame = frame;
        this.frame_idx = idx;

        this.x += this.move_amount[this.direction];

    }
}

const ZOOM = 4;
const CHAR_WIDTH = 16;
const CHAR_HEIGHT = 16;

function draw_obj({ ctx }, { x, y, image, frame, direction }) {
    if (direction == Direction.NUTRAL || direction == Direction.RIGHT) {
        ctx.drawImage(
            image,
            0,
            16 * frame,
            CHAR_WIDTH,
            CHAR_HEIGHT,
            x,
            y,
            CHAR_WIDTH * ZOOM,
            CHAR_HEIGHT * ZOOM
        );
    } else {
        ctx.save(); // canvas状態を保存
        ctx.transform(-1, 0, 0, 1, 0, 0); // 画像を左右反転させる
        ctx.drawImage(
            image,
            0,
            16 * frame,
            CHAR_WIDTH,
            CHAR_HEIGHT,
            -x - CHAR_WIDTH * ZOOM,
            y,
            CHAR_WIDTH * ZOOM,
            CHAR_HEIGHT * ZOOM
        );
        ctx.restore(); // canvasの状態をsaveされた状態に戻す
    }
}

function clear_screen({ ctx, width, height }) {
    // ctx.fillStyle = "rgb(100,100,100)";
    ctx.clearRect(0, 0, width, height);
}


function draw_pad({ ctx }) {
    let _ctx: CanvasRenderingContext2D = ctx;
    _ctx.strokeStyle = "rgb(255,255,255)"
    _ctx.strokeRect(5, 360, 290, 30);
}

const STICK_DEAFULT_X = 150
const STICK_DEFAULT_Y = 375
let stick = { x: STICK_DEAFULT_X, y: STICK_DEFAULT_Y, draged: false }
function draw_stick({ ctx }, { x, y }) {
    let _ctx: CanvasRenderingContext2D = ctx;
    _ctx.beginPath();
    _ctx.arc(x, y, 10, 0, Math.PI * 2, true);
    _ctx.strokeStyle = "rgb(255,255,255)"
    _ctx.stroke();

}

function is_inside({ x, y }, ex: number, ey: number) {
    let _x = x - 10;
    let _y = y - 10;
    return (_x < ex && ex < _x + 40
        && _y < ey && ey < _y + 40);
}

function check_stick_position({ x, y }) {
    if (x > 200) {
        chara.move(CharaState.RUN, Direction.RIGHT);
    } else if (x < 100) {
        chara.move(CharaState.RUN, Direction.LEFT);
    } else {
        chara.move(CharaState.STOP, Direction.NUTRAL);
    }
}

let world = create_world("canvas");
let chara = new Chara("chara.png").setPos(100, 100);

function main_loop() {
    if (!chara.init) return;

    chara.anime();
    check_stick_position(stick);


    clear_screen(world);
    draw_stick(world, stick);
    draw_obj(world, chara);
    draw_pad(world);
}

setInterval("main_loop()", 16);

document.onkeydown = function (e) {
    const key_func_table = {
        37: () => chara.move(CharaState.RUN, Direction.LEFT), // Left
        39: () => chara.move(CharaState.RUN, Direction.RIGHT), // Right
        38: () => { }, // Up
        40: () => { }, // Down
        88: () => { }, // x
        67: () => { }  // c
    }
    key_func_table[e.keyCode]();
}

document.onkeyup = function (e) {
    const key_func_table = {
        37: () => chara.move(CharaState.STOP, Direction.NUTRAL), // Left
        39: () => chara.move(CharaState.STOP, Direction.NUTRAL), // Right
        38: () => { }, // Up
        40: () => { }, // Down
        88: () => { }, // x
        67: () => { }  // c
    }
    key_func_table[e.keyCode]();
}


// ----------------------------------------------------------------
// ----------------------------------------------------------------

let mouseDown = false;
let mousePos = { x: 0, y: 0 }

function handleMouseDown(e) {
    mouseDown = true;
    if (is_inside(stick, e.clientX, e.clientY)) {
        stick.draged = true;
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        return;
    }
    if (chara.isInside(e.clientX, e.clientY)) {
        chara.draged = true;
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    }
}
function handleMouseUp(e) {
    mouseDown = false;
    chara.draged = false;
    stick = { x: STICK_DEAFULT_X, y: STICK_DEFAULT_Y, draged: false };
}
function handleMouseMove(e) {
    if (!mouseDown) return;
    if (stick.draged) {
        let dx = e.clientX - mousePos.x;
        stick.x += dx;
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    }
    if (chara.draged) {
        let dx = e.clientX - mousePos.x;
        let dy = e.clientY - mousePos.y;
        chara.setRelativePos(dx, dy);
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    }
}

document.onmousedown = function (e) {
    e.preventDefault();
    handleMouseDown(e);
}
document.onmouseup = function (e) {
    e.preventDefault();
    handleMouseUp(e);
}
document.onmousemove = function (e) {
    e.preventDefault();
    handleMouseMove(e);
}

world.canvas.ontouchstart = function (e) {
    e.preventDefault();
    handleMouseDown(e.changedTouches[0]);
}
world.canvas.ontouchend = function (e) {
    e.preventDefault();
    handleMouseUp(e.changedTouches[0]);
}
world.canvas.ontouchmove = function (e) {
    e.preventDefault();
    handleMouseMove(e.changedTouches[0]);
}

document.addEventListener('touchstart', e => e.preventDefault(), { passive: false });