let canvas = <HTMLCanvasElement>document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;
// ctx.fillStyle = "rgc(255,255,255)";
// ctx.fillRect(0, 0, canvas.width, canvas.height);

class Chara {
    public x: number;
    public y: number;
    public image: HTMLImageElement;
    public init: boolean;
    constructor(x: number, y: number) {
        this.init = false;
        this.x = x;
        this.y = y;
        let image = new Image();
        let self = this;
        image.onload = function () {
            self.init = true;
        };
        image.src = "test.png";
        this.image = image;
    }
}

function draw_obj(
    ctx: CanvasRenderingContext2D,
    { x, y, image },
    frame: number
) {
    ctx.drawImage(image, 0, 10 * frame, 10, 10, x, y, 100, 100);
}

function clearScreen(ctx) {
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, 400, 400);
}

let chara = new Chara(100, 100);

let frame = 0;
function main_loop() {
    if (!chara.init) return;

    clearScreen(ctx);
    draw_obj(ctx, chara, frame);
    frame = (frame + 1) % 2;
}

setInterval("main_loop()", 100);
