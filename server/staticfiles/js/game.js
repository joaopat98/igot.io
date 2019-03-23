"use strict";

var queue, stage, arena, time, player;
var mapWidth = 3000, mapHeight = 3000;
let ws;

function loadImages() {
    queue = new createjs.LoadQueue(false, null, true);
    queue.on("complete", init, this);
    queue.loadFile({src: "static/res/tile.png", crossOrigin: true, id: "tile"});
    queue.loadFile({src: "static/res/skin_warrior.png", crossOrigin: true, id: "warrior"});
    queue.loadFile({src: "static/res/laser.png", crossOrigin: true, id: "laser"});
}

function init() {
    Request.post("api/join", {}).then(response => {
        response.json().then(data => {
            stage = new createjs.Stage("canvas");
            let charSize = data.charSize;
            player = new Character(data.playerX, data.playerY, queue.getResult("warrior"), data.charSize, queue.getResult("laser"), 595, 64, true, data.mapWidth, data.mapHeight, data.id, data.speed);
            arena = new Arena(queue.getResult("tile"), player, time, data.mapWidth, data.mapHeight);
            arena.x = window.innerWidth / 2;
            arena.y = window.innerHeight / 2;
            stage.addChild(arena);
            config();
            window.addEventListener("keydown", keyHandler);
            window.addEventListener("keyup", keyHandler);
            ws = new WebSocket("ws://" + window.location.host + "/ws/group");
            ws.onmessage = message => {
                let newData = JSON.parse(message.data);
                newData.chars.forEach(char => {
                    if (arena.chars.hasOwnProperty(char.id)) {
                        if (char.id === player.id) {
                            arena.player.x = char.x;
                            arena.player.y = char.y;
                        } else {
                            let b = arena.chars[char.id];
                            b.x = char.x;
                            b.y = char.y;
                        }
                    } else {
                        let c = new Character(char.x, char.y, queue.getResult("warrior"), data.charSize, undefined, undefined, undefined, false, data.mapWidth, data.mapHeight, char.id, data.speed);
                        arena.chars[char.id] = c;
                        arena.addChild(c);
                    }
                });
            }
        });
    });

}

function resize() {
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;
}

function display(ev) {
    resize();
    player.move(ev.delta, ws);

    arena.regX = Math.min(Math.max(-mapWidth / 2 + stage.canvas.width / 2, player.x), mapWidth / 2 - stage.canvas.width / 2);
    arena.regY = Math.min(Math.max(-mapHeight / 2 + stage.canvas.height / 2, player.y), mapHeight / 2 - stage.canvas.height / 2);

    /*
    if(player.sprite.x > - mapWidth/2 + stage.canvas.width/2 && player.sprite.x < mapWidth/2 - stage.canvas.width/2)
        arena.regX = player.sprite.x;

    if(player.sprite.y > - mapHeight/2 + stage.canvas.height/2 && player.sprite.y < mapHeight/2 - stage.canvas.height/2)
        arena.regY = player.sprite.y;
    */

    stage.update();
}

function config() {
    time = createjs.Ticker.getTime(true);
    createjs.Ticker.addEventListener("tick", display);
    createjs.Ticker.framerate = 60;
}

function keyHandler(ev) {
    arena.player.keys[ev.keyCode] = (ev.type === "keydown");
    if (player.shootOnce == false && ev.type === "keyup" && ev.keyCode == 32) {
        arena.player.shootOnce = true;
    }
}