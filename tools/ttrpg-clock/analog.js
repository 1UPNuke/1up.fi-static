function drawClock(canvas, ctx, r, h, m, s) {
    ctx.clearRect(-r, -r, r * 2, r * 2);
    drawFace(ctx, r);
    drawNumbers(ctx, r);
    drawTime(ctx, r, h, m, s);
}

function drawTime(ctx, r, h, m, s) {
    h %= 12;
    h = (h * Math.PI / 6) + (m * Math.PI / (6 * 60)) + (s * Math.PI / (360 * 60));
    drawHand(ctx, h, r * 0.5, r * 0.07);
    
    m = (m * Math.PI / 30) + (s * Math.PI / (30 * 60));
    drawHand(ctx, m, r * 0.8, r * 0.07);
    
    ctx.strokeStyle = "red";
    s = (s * Math.PI / 30);
    drawHand(ctx, s, r * 0.9, r * 0.02);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

function drawNumbers(ctx, r) {
    ctx.font = r * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    
    for (let num = 1; num < 13; num++) {
        let ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -r * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, r * 0.85);
        ctx.rotate(-ang);
    }
}

function drawFace(ctx, r) {
    const grad = ctx.createRadialGradient(0, 0, r * 0.95, 0, 0, r * 1.05);
    grad.addColorStop(0, "#333");
    grad.addColorStop(0.5, "white");
    grad.addColorStop(1, "#333");
    
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFF8";
    ctx.fill();
    
    ctx.strokeStyle = grad;
    ctx.lineWidth = r * 0.1;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = "#333";
    ctx.fill();
}
