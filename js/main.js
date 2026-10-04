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

let tiles = [];

fetch("map/map.csv")
    .then(response => response.text())
    .then(text => {
        const data = text
            .trim()
            .split("\n")
            .map(row => row.split(","));

        for(let row = 0; row < data.length; row++){
            for(let col = 0; col < data[row].length; col++){
                tiles.push(new Tile({x: col * 64, y: row * 64}, Number(data[row][col])));
            }
        }
    });

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

function gameLoop(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.imageSmoothingEnabled = false;

    if(game_state === "menu"){
        c.fillStyle = "rgb(131, 103, 103)";
        c.fillRect(0, 0, canvas.width, canvas.height);
    }

    player.Movement(user_input, tiles);
    camera = getCamera(player.position);

    tiles.forEach(tile => {
        tile.Draw(c, camera, zoom, tile_texture);
    });

    player.Draw(c, camera, zoom, player_texture);

    requestAnimationFrame(gameLoop);
}

gameLoop();

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