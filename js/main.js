import {Player} from "./player.js";
import {Tile} from "./tile.js"

const player_texture = new Image();
player_texture.src = "./img/player.png";
const tile_texture = new Image();
tile_texture.src = "./img/tiles.png";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const menu_ui = document.querySelectorAll(".menu-ui");
const game_info = document.querySelectorAll(".game-info");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let game_state = "menu";
let player = new Player();

const chunk_size = 8;
let chunks = {};
let loaded_chunks = {};

let tiles = [];

fetch("map/fishing_game_map.csv")
    .then(response => response.text())
    .then(text => {
        const data = text
            .trim()
            .split("\n")
            .map(row => row.split(","));

        for(let row = 0; row < data.length; row++){
            for(let tile = 0; tile < data[row].length; tile++){
                const chunk_x = Math.floor(tile / chunk_size);
                const chunk_y = Math.floor(row / chunk_size);

                const chunk_name = `${chunk_x},${chunk_y}`;

                if(!(chunk_name in chunks)){
                    chunks[chunk_name] = [];
                }

                chunks[chunk_name].push({
                    x: tile, y: row, type: data[row][tile]
                });
            }
        }
    });

function chunkLoader(){
    const player_chunk_x = Math.floor((player.position.x / 64) / chunk_size);
    const player_chunk_y = Math.floor((player.position.y / 64) / chunk_size);

    for(let y= -1; y <= 1; y++){
        for(let x = -1; x <= 1; x++){
            const chunk_x = player_chunk_x + x;
            const chunk_y = player_chunk_y + y;

            const chunk_name = `${chunk_x},${chunk_y}`;

            if(!(chunk_name in loaded_chunks) && (chunks[chunk_name])){
                loaded_chunks[chunk_name] = [];
                for(const tile of chunks[chunk_name]){
                    loaded_chunks[chunk_name].push(new Tile({x: tile.x * 64, y: tile.y * 64}, Number(tile.type)));
                }
            }

            for(const loaded_chunk_name in loaded_chunks){
                const [loaded_chunk_x, loaded_chunk_y] = loaded_chunk_name.split(",").map(Number);

                if(Math.abs(loaded_chunk_x - player_chunk_x) > 1 || Math.abs(loaded_chunk_y - player_chunk_y) > 1){
                    delete loaded_chunks[loaded_chunk_name];
                }
            }
        }
    }
}

let user_input = {left: false, right: false, up: false, down: false};

function updateUi(){
    if(game_state === "menu"){
        menu_ui.forEach(element => {
            element.style.display = "block";
        });
        game_info.forEach(element => {
            element.style.display = "none";
        });
    }else{
        menu_ui.forEach(element => {
            element.style.display = "none";
        });
        game_info.forEach(element => {
            element.style.display = "block";
        });
    }
}

export function changeState(text){
    game_state = text;
    updateUi();
}

let camera = {x: 0, y: 0};
function getCamera(position){
    camera.x = canvas.width/2 - (position.x * zoom);
    camera.y = canvas.height/2 - (position.y * zoom);
    return camera;
}
let zoom = 1;
let tick = 0;

function gameLoop(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.imageSmoothingEnabled = false;

    tick += 0.05;
    if(tick > 40){
        tick = 0;
    }

    if(game_state === "menu"){
        c.fillStyle = "rgb(131, 103, 103)";
        c.fillRect(0, 0, canvas.width, canvas.height);
    }

    player.Movement(user_input, tiles);

    chunkLoader();

    camera = getCamera(player.position);
    
    for(const chunk in loaded_chunks){
        for(const tile of loaded_chunks[chunk]){
            tile.Draw(c, camera, zoom, tile_texture, tick);
        }
    }
    
    player.Draw(c, camera, zoom, player_texture);

    requestAnimationFrame(gameLoop);
}

gameLoop();
console.log(loaded_chunks);

addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

addEventListener("keydown", event=>{
    if(event.key === "a"){
        user_input.left = true;
    }
    if(event.key === "d"){
        user_input.right = true;
    }
    if(event.key === "w"){
        user_input.up = true;
    }
    if(event.key === "s"){
        user_input.down = true;
    }
})

addEventListener("keyup", event=>{
    if(event.key === "a"){
        user_input.left = false;
    }
    if(event.key === "d"){
        user_input.right = false;
    }
    if(event.key === "w"){
        user_input.up = false;
    }
    if(event.key === "s"){
        user_input.down = false;
    }
})