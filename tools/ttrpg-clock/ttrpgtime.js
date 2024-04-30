const FULL_DAY = 86400000;
const HALF_DAY = FULL_DAY / 2;
const QUARTER_DAY = FULL_DAY / 4;

class TTRPGTime {
    _ms = 0;
    s = 0;
    m = 0;
    h = 0;
    D = 1;
    M = 1;
    Y = 1970;
    timescale = 1;
    format = 24;
    interval = undefined;
    last = Date.now();
    hist = [];

    set ms(ms) {
        this._ms = ms;
        const date = new Date(this.ms);
        this.Y = date.getUTCFullYear();
        this.M = date.getUTCMonth()+1;
        this.D = date.getUTCDate();
        this.h = date.getUTCHours();
        this.m = date.getUTCMinutes();
        this.s = date.getUTCSeconds();
    }

    get ms() {
        return this._ms;
    }

    tick() {
        this.interval ??= setInterval(()=>this.tick(), 10);
        this.ms += (Date.now() - this.last) * this.timescale;
        this.last = Date.now();
    }

    start() {
        this.last = Date.now();
        this.tick();
    }

    stop() {
        this.interval = clearInterval(this.interval);
    }

    reset() {
        this.stop();
        this.ms = 0;
    }

    setTimescale(timescale) {
        this.timescale = timescale;
    }

    addTime(h=0, m=0, s=0, ms = 0) {
        const addms = 1000*60*60*h + 1000*60*m + 1000*s + ms;
        this.addMs(addms);
    }
    
    addMs(ms, hist=true) {
        this.ms += ms;
        if(hist) this.hist.push(ms);
    }

    undo() {
        if(this.hist.length == 0) return;
        let ms = this.hist.pop();
        this.addMs(-ms, false);
    }

    shortRest() {
        this.addTime(1);
    }

    longRest() {
        this.addTime(8);
    }

    combatRound() {
        this.addTime(0, 0, 6);
    }

    dungeonRound() {
        this.addTime(0, 10);
    }

    setFormat(format) {
        this.format = format;
    }
    
    toString() {
        let Y = this.Y;
        let M = this.M;
        let D = this.D;
        let h = this.h;
        let m = this.m;
        let s = this.s;
        let ampm = '';

        if(this.format == 12) {
            ampm = h < 12 ? " AM" : " PM";
            h = h % 12 || 12;
        }

        M = M < 10 ? '0'+M : M;
        D = D < 10 ? '0'+D : D;
        h = h < 10 ? '0'+h : h;
        m = m < 10 ? '0'+m : m;
        s = s < 10 ? '0'+s : s;

        return `${Y}-${M}-${D}T${h}:${m}:${s}${ampm}`;
    }

    backgroundColors() {
        const l = 1 - Math.abs(this.ms % FULL_DAY - HALF_DAY) / HALF_DAY;

        const r = (1 - (Math.abs(this.ms % HALF_DAY - QUARTER_DAY) / QUARTER_DAY)) ** 2;
        const b = (1 - r) - (1 - l) * 0.75;
        const g = r/2 + b/2;

        const top = `hsl(0, 0%, ${l*100}%)`;
        const bottom = `rgb(${r*255}, ${g*255}, ${b*255})`;

        return [bottom, top];
    }
}