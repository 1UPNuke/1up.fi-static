class DiceClass {
    constructor(num) {
        this.num = num;
        let pipLookup = [
            [],
            [[0.5, 0.5]],
            [[0.25, 0.25], [0.75, 0.75]],
            [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
            [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]],
            [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75], [0.5, 0.5]],
            [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75], [0.25, 0.5], [0.75, 0.5]]
        ];
        this.pips = pipLookup[num];
    }
    draw(ctx, width, height, bg, pip, shading)
    {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        if(shading>0)
        {
            let grd = ctx.createLinearGradient(width, -height, -width, height);
            grd.addColorStop(0, "rgba(255,255,255,"+shading+")");
            grd.addColorStop(0.5, bg);
            grd.addColorStop(0.75, "rgba(0,0,0,"+shading+")");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, width, height);
        }

        let radius = width>=height ? height*0.1 : width*0.1;

        for(let point of this.pips)
        {
            let x = point[0]*width;
            let y = point[1]*height;
            ctx.fillStyle = pip;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();

            if(shading>0)
            {
                let grd = ctx.createRadialGradient(x-radius/3, y+radius/3, 0, x, y, radius);
                grd.addColorStop(0, "rgba(255,255,255,"+shading+")");
                grd.addColorStop(0.5, pip);
                grd.addColorStop(1, "rgba(0,0,0,"+shading+")");
                ctx.fillStyle = grd;
                ctx.fill();
            }
        }
    }
}
export let Dice = DiceClass;