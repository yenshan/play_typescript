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

class Chara {
    public x: number;
    public y: number;
    public image: HTMLImageElement;
    public init: boolean;
    public frame: number;
    private anime_frames = {
        run: { idx: 0, frames: [1, 2, 3] },
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
    }
    setPos(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }
    anime(state: string) {
        let { idx, frames } = this.anime_frames[state];
        if (++idx >= frames.length) idx = 0;
        this.frame = frames[idx];
        this.anime_frames[state] = { idx: idx, frames: frames };
    }
}

function draw_obj({ ctx }, { x, y, image, frame }) {
    ctx.drawImage(image, 0, 16 * frame, 16, 16, x, y, 100, 100);
}

function clear_screen({ ctx }) {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 400, 400);
}

let world = create_world("canvas");
let chara = new Chara("chara.png").setPos(100, 100);

let frame = 1;
function main_loop() {
    if (!chara.init) return;

    chara.anime("run");
    clear_screen(world);
    draw_obj(world, chara);
}

setInterval("main_loop()", 100);
