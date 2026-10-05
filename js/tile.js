export class Tile{
    constructor(position, type){
        this.position = position;
        this.type = type;
        this.size = {x: 64, y: 64};
        this.collision = false;
        this.animation = 0;
        if(this.type == 1){
            this.collision = true;
        }
    }
    Draw(c, camera, zoom, tile_texture, tick){
        c.drawImage(tile_texture, 32 * (this.type + this.animation), 0, 32, 32, Math.trunc((this.position.x - this.size.x/2) * zoom + camera.x), Math.trunc((this.position.y - this.size.y/2) * zoom + camera.y), this.size.x * zoom, this.size.y * zoom);

        if(this.type == 1){
            c.fillStyle = "rgba(150, 150, 200, 0.2)";
            c.globalCompositeOperation = "source-atop";
            c.fillRect(Math.trunc((this.position.x - this.size.x/2) * zoom + camera.x), Math.trunc((this.position.y - this.size.y/2) * zoom + camera.y), this.size.x * zoom, this.size.y * zoom);
            c.globalCompositeOperation = "source-over";
        };
        
        /*
        c.strokeStyle = "black";
        c.lineWidth = 2;
        c.strokeRect(Math.trunc((this.position.x - this.size.x/2) * zoom + camera.x), Math.trunc((this.position.y - this.size.y/2) * zoom + camera.y), this.size.x * zoom, this.size.y * zoom);
        */

        if(this.type == 1){
            this.animation = Math.trunc(tick);
        }
    }
}