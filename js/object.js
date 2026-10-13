export class Object{
    constructor(position, type){
        this.position = position;
        this.type = type;
        this.size = {x: 128, y: 256};
        this.hitbox_size = {x: 64, y: 64};
        this.hitbox_pos = {x: this.position.x, y: this.position.y + 64};
        this.collision = true;
    }
    Draw(c, camera, zoom, obj_texture){
        c.drawImage(obj_texture, 64 * this.type, 0, 64, 128, Math.trunc((this.position.x - this.size.x/2) * zoom + camera.x), Math.trunc((this.position.y - this.size.y/2) * zoom + camera.y), this.size.x * zoom, this.size.y * zoom);
        
        /*
        c.strokeStyle = "black";
        c.lineWidth = 2;
        c.strokeRect(Math.trunc((this.position.x - this.size.x/2) * zoom + camera.x), Math.trunc((this.position.y - this.size.y/2) * zoom + camera.y), this.size.x * zoom, this.size.y * zoom);
        */

        /*
        c.strokeStyle = "black";
        c.lineWidth = 2;
        c.strokeRect(Math.trunc((this.hitbox_pos.x - this.hitbox_size.x/2) * zoom + camera.x), Math.trunc((this.hitbox_pos.y - this.hitbox_size.y/2) * zoom + camera.y), this.hitbox_size.x * zoom, this.hitbox_size.y * zoom);
        */
    }
}