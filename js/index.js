let creekflows = 0;
let mousePower = 1;
let state = "first_visit";

const elm_count = document.querySelector("#count");
const elm_power = document.querySelector("#power");
const elm_items = document.querySelector("#items");

// load data and determine if first visit
function load_data() {
    if (!localStorage.getItem("creekflows")) {first_visit(); return} // act normal on first visit

    state = "game";
    elm_items.classList.remove("hidden");
    creekflows = Number(localStorage.getItem("creekflows"));
    elm_count.innerHTML = creekfill(creekflows);
}

// save data
function save_data() {
    localStorage.setItem("creekflows", String(creekflows));
    localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));
}

// on the first visit
function first_visit() {
    elm_count.innerHTML = creekfill(0);
}

// very useful utility functions
function commas(i) {
    const n = i;
    const s = n < 0 ? "-" : "";
    const a = Math.abs(n);
    const [t, f] = a.toString().split(".");
    const c = t.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${s}${c}${(f !== undefined ? "." + f : "")}`;
}
function creekfill(i) {
    const n = commas(i);
    return n + " Milos";
}
function geekfill(i) {
    const n = commas(i);
    return n + "x Power";
}

// relative adjustment of creekflows
function flow(i) {
    creekflows+= i;
    document.dispatchEvent(new CustomEvent("creekflow"));
    elm_count.innerHTML = creekfill(creekflows);
}
function glow(i) {
    mousePower += i;
    document.dispatchEvent(new CustomEvent("geekflow"));
    elm_power.innerHTML = geekfill(mousePower);
}

// on click
function creekflow() {
    flow(mousePower);
    switch (state) {
        case "first_visit":
            if (creekflows >= 10) {
                promiseAudio("creekflow").then(() => {
                    playAudio("stoneMove");
                    elm_items.classList.remove("hidden");
                    state = "game";
                });
            } else {
                playAudio("creekflow");
            }
            break
        case "game": {
            playAudio("creekflow");
        }
    }
    save_data();
}
load_data();