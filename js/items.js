let items = [];
let purchasedItems = {};

//noinspection JSUnusedGlobalSymbols
foo = {
    clicker1() {
        setInterval(() => {
            flow(1);
            playAudio("wolfkeerc");
            save_data();
        },1000);
    },
    clicker2() {
        setInterval(() => {
            flow(2);
            playAudio("wolfkeerc");
            save_data();
        },990);
    },
    clicker3() {
        setInterval(() => {
            flow(4);
            playAudio("wolfkeerc");
            save_data();
        },980);
    },
    clicker4() {
        setInterval(() => {
            flow(8);
            playAudio("wolfkeerc");
            save_data();
        },970);
    },
    clicker5() {
        setInterval(() => {
            flow(16);
            playAudio("wolfkeerc");
            save_data();
        },960);
    },
    power1() {
        glow(1);
    },
    power2() {
        glow(2);
    },
    power3() {
        glow(4);
    },
    power4() {
        glow(8);
    },
    power5() {
        glow(16);
    },
    album() {
        document.querySelector("#widgets > div.music").classList.remove("hidden");
    },
    crude_oil() {
        console.info("I can't stop drinking oil! I can't stop drinking oil! I just can't stop, I can't stop drinking crude oil! You know the black stuff, it comes it barrels, I can't stop drinking it! I just can't! It's tantalising, it's addicting, it is a delicacy. I love it! I can't stop drinking oil, crude oil! I can't stop guzzling it, gulping it down! I can't stop drinking crude oil-");
        const elm_crudeOilWidget = document.querySelector("#widgets > div.crudeoil");
        const elm_crudeOilBase = document.querySelector("#widgets > div.crudeoil > div");
        const elm_crudeOil = document.querySelector("#widgets > div.crudeoil .crude-oil");
        const elm_crudeOilShadow = document.querySelector("#widgets > div.crudeoil .crude-oil-shadow");
        const cooldown_max = 120;
        let cooldown = cooldown_max;
        elm_crudeOilWidget.classList.remove("hidden");
        const keyframes = [
            { height: "100%" },
            { height: "0%" },
        ]
        const properties = {
            duration: cooldown_max * 1000,
            iterations: 1,
            fill: "forwards"
        };
        function redeemOil() {
            playAudio("money");
            flow(4000);
            oilCooldown();
        }
        function oilCooldown() {
            elm_crudeOilShadow.animate(keyframes, properties);
            cooldown = cooldown_max;
            elm_crudeOilBase.style.cursor = "not-allowed";
            elm_crudeOil.style.filter = "brightness(0.7)";
            let e = setInterval(() => {
                cooldown--;
                if (cooldown === 0) {
                    clearInterval(e);
                    elm_crudeOilBase.style.cursor = "";
                    elm_crudeOil.style.filter = "";
                }
            },1000)
        }
        elm_crudeOilBase.addEventListener("click", () => {
            if (cooldown === 0) {
                redeemOil();
            }
        });
        oilCooldown();
    },
    ecat() {
        let shape = document.createElement("div");
        shape.classList.add("ecat-perspective-wrapper");
        document.body.appendChild(shape);

        let graphic = document.createElement("img");
        graphic.classList.add("ecat");
        graphic.src = "item-data/ecat/item.png";
        graphic.alt = "Eggs Cheese and Turkey";
        shape.appendChild(graphic);

        let framerate = 60;
        let posX = 2;
        let posY = 2;
        let speedInitX = 2;
        let speedInitY = 1;
        let speedX = 2;
        let speedY = 1;
        let ecatSfxIdx = 0;
        function advanceColor() {
            switch (ecatSfxIdx) {
                case 0:
                    playAudio("eggs");
                    break
                case 1:
                    playAudio("cheese");
                    break
                case 2:
                    playAudio("turkey");
                    break
            }
            flow(50);
            ecatSfxIdx++;
            ecatSfxIdx %= 3;
        }
        let safeColors = {
            x: true,
            y: true
        };
        function safeColor(direction, hit) {
            if (hit) { // are we hitting a side
                if (safeColors[direction]) { // is this the first time
                    safeColors[direction] = false;
                    advanceColor();
                }
            }
            else { // we aren't hitting a side anymore
                safeColors[direction] = true;
            }
        }
        function bounce() {
            posX += speedX;
            posY += speedY;
            let rect = shape.getBoundingClientRect();
            let bodyRect = document.body.getBoundingClientRect();
            if (rect.right >= bodyRect.width) {
                speedX = speedInitX * -1;
                safeColor('x', true);
            }
            else if (rect.left <= 0) {
                speedX = speedInitX;
                safeColor('x', true);
            }
            else {
                safeColor('x', false);
            }
            if (rect.bottom >= bodyRect.height) {
                speedY = speedInitY * -1;
                safeColor('y', true);
            }
            else if (rect.top <= 0) {
                speedY = speedInitY;
                safeColor('y', true);
            }
            else {
                safeColor('y', false);
            }
            shape.style.left = "".concat(posX, "px");
            shape.style.top = "".concat(posY, "px");
            setTimeout(bounce, 1000 / framerate);
        }
        bounce();
    },
    win() {
        creekflows = 0;
        purchasedItems = [];
        save_data();
        location.reload();
    }
}

// load a user's items from save data
function load_items() {
    purchasedItems = JSON.parse(localStorage.getItem("purchasedItems")) || {};
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    for (const [key, value] of Object.entries(purchasedItems)) {
        (async () => {
            for (let i = 0; i < value; i++) {
                try {
                    foo[key]();
                } catch(e) {
                    console.warn(`item "${key}" was found in the save file but does not have a function associated with it.`)
                }
                await wait(50);
            }
        })()
    }
}

// load available items
async function fetch_items() {
    const itemsData = await fetch("items.json")
        .then(async (r) => {return await r.json()});
    itemsData.sort((a, b) => a["cost"] - b["cost"]);
    itemsData.forEach((itm) => {
        items.push(itm);
        render_item(itm);
    })
}

const elm_itemlist = document.querySelector("#items ul");

// render available items
function render_item(itm) {
    const id = itm["id"];
    const elm_li = document.createElement("li");
    elm_li.setAttribute("title", itm["description"]);
    const elm_title = document.createElement("span");
    elm_title.classList.add("item-title");
    elm_title.innerHTML = itm["name"];
    const elm_cost = document.createElement("span");
    elm_cost.classList.add("item-cost");
    elm_cost.innerHTML = creekfill(itm["cost"]);
    const elm_image = document.createElement("img");
    elm_image.classList.add("item-image");
    elm_image.src = `item-data/${id}/${itm["icon"]}`;
    const elm_count = document.createElement("span");
    elm_count.classList.add("item-count");
    elm_count.innerHTML = !purchasedItems[id] || itm["redeemOnce"] ? "" : purchasedItems[id];
    elm_li.append(elm_title,elm_cost,elm_image,elm_count);
    elm_li.addEventListener("click",async () => {
        if (creekflows >= itm["cost"] && !(itm["redeemOnce"] === true && Object.keys(purchasedItems).includes(id))) {
            playAudio("itemRedeem");
            purchasedItems[id] ? purchasedItems[id]++ : purchasedItems[id] = 1;
            flow(itm["cost"]*-1);
            save_data();
            try {
                foo[id]();
            } catch(e) {
                console.error(`item "${id}" was just purchased but does not have a function associated with it.`)
            } finally {
                console.log("loaded item " + id);
            }
            if (itm["redeemOnce"] === true) {
                elm_li.classList.add("unlocked");
            } else {
                elm_count.innerHTML = purchasedItems[id];
            }
        }
    });
    if (creekflows < itm["cost"]) {
        elm_li.classList.add("locked");
    } else if (itm["redeemOnce"] === true && Object.keys(purchasedItems).includes(id)) {
        elm_li.classList.add("unlocked");
    }
    document.addEventListener("creekflow", () => {
        if (creekflows >= itm["cost"]) {
            elm_li.classList.remove("locked");
        } else if (creekflows < itm["cost"]) {
            elm_li.classList.add("locked");
        }
    });
    elm_itemlist.appendChild(elm_li);
}

fetch_items().then();
load_items();