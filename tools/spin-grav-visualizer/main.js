const g = 9.80665;

let selectedBoxes = [];
const keys = ["r", "a", "w", "v", "h", "d"];
let boxes = {};
let fields = {};
let units = {};
let values = {};
let icons = {};

let iconVHi, iconHi, iconOK, iconLo, iconVLo;

let factors = {
    cm: 0.01,
    m: 1,
    km: 1000,
    mps: 1,
    kph: 1000 / 3600,
    mps2: 1,
    g: g,
    rad: 1,
    deg: Math.PI / 180,
    rpm: Math.PI / 30
}

function formatFields() {
    for (let key of keys) {
        fields[key].value = (values[key] / factors[units[key].value]).toFixed(6).replace(/\.?0+$/, '');
    }
}

function updateCSS() {
    let root = document.querySelector(':root');
    root.style.setProperty("--rpm", values.w / factors["rpm"]);
    root.style.setProperty("--inner-outer-ratio", 1 - (values.h / 0.67) / values.r);

    let standing = document.getElementById("person-standing");
    let floating = document.getElementById("person-floating");
    standing.classList.toggle("hidden", values.w === 0);
    floating.classList.toggle("hidden", values.w > 0);
}

function updateIcons() {
    let [r, a, w, v, h, d] = Object.values(values);

    if (r < 4)
        icons.r.innerHTML = iconVLo;
    else if (r < 12)
        icons.r.innerHTML = iconLo;
    else
        icons.r.innerHTML = iconOK;

    let rpm = w * 30 / Math.PI;
    if (rpm <= 2)
        icons.w.innerHTML = iconOK;
    else if (rpm <= 6)
        icons.w.innerHTML = iconHi;
    else
        icons.w.innerHTML = iconVHi;

    if (v < 6)
        icons.v.innerHTML = iconVLo;
    else if (v < 10)
        icons.v.innerHTML = iconLo;
    else
        icons.v.innerHTML = iconOK;

    let ag = a / g;
    if (ag < 0.1)
        icons.a.innerHTML = iconVLo;
    else if (ag < 0.3)
        icons.a.innerHTML = iconLo;
    else if (ag < 1.1)
        icons.a.innerHTML = iconOK;
    else if (ag < 1.5)
        icons.a.innerHTML = iconHi;
    else
        icons.a.innerHTML = iconVHi;
}

function updateFields() {
    if (selectedBoxes.length < 2) return;

    for (let key of keys) {
        values[key] = fields[key].value * factors[units[key].value];
    }

    let str = selectedBoxes.map(box => box.id[0]).sort().join('');
    console.log(str);

    let [r, a, w, v, h, d] = Object.values(values);

    switch (str) {
        case "av":
            r = v * v / a;
            w = a / v;
            break;

        case "aw":
            r = a / (w * w);
            v = a / w;
            break;

        case "vw":
            a = v * w;
            r = v / w;
            break;

        case "ar":
            v = Math.sqrt(a * r);
            w = Math.sqrt(a / r);
            break;

        case "rv":
            a = v * v / r;
            w = v / r;
            break;

        case "rw":
            a = w * w * r;
            v = w * r;
            break;
    }

    d = a - w * w * (r - h);
    values = { r, a, w, v, h, d };

    formatFields();

    updateCSS();

    updateIcons();
}

function checkboxChange(e) {
    const box = e.target;
    const field = box.parentElement.querySelector('input[type="number"]');

    if (box.checked) {
        selectedBoxes.push(box);

        if (selectedBoxes.length > 2) {
            const oldest = selectedBoxes.shift();
            oldest.checked = false;
            oldest.parentElement.querySelector('input[type="number"]').disabled = true;
        }

        field.disabled = false;
    } else {
        const index = selectedBoxes.indexOf(box);
        if (index !== -1) {
            selectedBoxes.splice(index, 1);
        }
        field.disabled = true;
    }
    updateFields();
}

document.addEventListener("DOMContentLoaded", () => {
    let form = document.forms[0];

    for (let field of form.querySelectorAll("input[type='number']")) {
        fields[field.id[0]] = field;
        field.addEventListener("change", updateFields);
    }

    for (let unit of form.querySelectorAll("select")) {
        units[unit.id[0]] = unit;
        unit.addEventListener("change", formatFields);
    }

    for (let svg of form.querySelectorAll("svg")) {
        icons[svg.id[0]] = svg;
    }

    iconVHi = form.querySelector("#icon-v-hi").innerHTML;
    iconHi = form.querySelector("#icon-hi").innerHTML;
    iconOK = form.querySelector("#icon-ok").innerHTML;
    iconLo = form.querySelector("#icon-lo").innerHTML;
    iconVLo = form.querySelector("#icon-v-lo").innerHTML;

    for (let box of form.querySelectorAll("input[type='checkbox']")) {
        boxes[box.id[0]] = box;
        box.addEventListener("change", checkboxChange);
        checkboxChange({ target: box });
    }
});