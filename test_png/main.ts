function create_world(id: string) {
    let canvas = <HTMLCanvasElement>document.getElementById(id);
    let ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    return {
        width: canvas.width,
        heigth: canvas.height,
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

class Chara {
    x: number;
    y: number;
    image: HTMLImageElement;
    init: boolean;
    frame: number;
    private state: CharaState;
    direction: Direction;
    anime_frames = {
        stop: { idx: 0, frames: [0] },
        run: { idx: 0, frames: [1, 2, 3] },
    };
    move_amount = {
        nutral: 0,
        left: -8,
        right: 8,
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
    }
    setPos(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }
    move(state: CharaState, dir: Direction) {
        this.state = state;
        this.direction = dir;
    }
    anime() {
        let { idx, frames } = this.anime_frames[this.state];
        if (++idx >= frames.length) idx = 0;

        this.frame = frames[idx]; // 次のアニメーションフレーム
        this.anime_frames[this.state].idx = idx; // フレーム情報の更新

        this.x += this.move_amount[this.direction];
    }
}

function draw_obj({ ctx }, { x, y, image, frame, direction }) {
    if (direction == Direction.NUTRAL || direction == Direction.RIGHT) {
        ctx.drawImage(image, 0, 16 * frame, 16, 16, x, y, 100, 100);
    } else {
        ctx.save(); // canvas状態を保存
        ctx.transform(-1, 0, 0, 1, 0, 0); // 画像を左右反転させる
        ctx.drawImage(image, 0, 16 * frame, 16, 16, -x - 100, y, 100, 100);
        ctx.restore(); // canvasの状態をsaveされた状態に戻す
    }
}

function clear_screen({ ctx }) {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 400, 400);
}

function handleKeyDown(evt) {
    //    console.log(evt.keyCode);
    switch (evt.keyCode) {
        case 37: // Left Cusor
            chara.move(CharaState.RUN, Direction.LEFT);
            break;
        case 39: // Right Cusor
            chara.move(CharaState.RUN, Direction.RIGHT);
            break;
        case 38: // Up Cusor
            break;
        case 40: // Down Cusor
            break;
        case 88: // 'x'
            break;
        case 67: // 'c'
            break;
    }
}

function handleKeyUp(evt) {
    //    console.log(evt.keyCode);
    switch (evt.keyCode) {
        case 37: // Left Cusor
            chara.move(CharaState.STOP, Direction.NUTRAL);
            break;
        case 39: // Right Cusor
            chara.move(CharaState.STOP, Direction.NUTRAL);
            break;
        case 38: // Up Cusor
            break;
        case 40: // Down Cusor
            break;
        case 88: // 'x'
            break;
        case 67: // 'c'
            break;
    }
}

let world = create_world("canvas");
let chara = new Chara("chara.png").setPos(100, 100);

function main_loop() {
    if (!chara.init) return;

    chara.anime();
    clear_screen(world);
    draw_obj(world, chara);
}

setInterval("main_loop()", 30);
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;
