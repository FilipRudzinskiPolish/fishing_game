export class Player{
    constructor(){
        this.position = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
        this.speed = 0.8;
        this.facing_direct = "down";
        this.size = {x: 48, y: 48};
        this.animation_tick = 0;
        this.animation = 0;

    }
    Draw(c, camera, zoom, player_texture){
        c.fillStyle = "white";
        /*
        c.fillRect((this.position.x - this.size.x/2) * zoom + camera.x, (this.position.y - this.size.y/2) * zoom + camera.y, this.size.x * zoom, this.size.y * zoom);
        */

        c.drawImage(player_texture, 32 * this.animation, 0, 32, 32, Math.trunc((this.position.x - 32) * zoom + camera.x), Math.trunc((this.position.y - 48) * zoom + camera.y), 64 * zoom, 64 * zoom)
        
        let head_pos = 0;
        if(this.facing_direct == "up"){
            head_pos = 128;
        }
        if(this.facing_direct == "down"){
            head_pos = 64;
        }
        if(this.facing_direct == "right"){
            head_pos = 96
        }
        
        if(this.facing_direct == "left"){
            c.save();
            c.scale(-1, 1);
            c.drawImage(player_texture, 96, 0, 32, 32, Math.trunc((this.position.x - 32 + 64) * zoom + camera.x) * -1, Math.trunc(this.position.y - 48 - 64) * zoom + camera.y, 64 * zoom, 64 * zoom)
            c.restore();
        }

        if(this.facing_direct != "left"){
            c.drawImage(player_texture, head_pos, 0, 32, 32, Math.trunc((this.position.x - 32) * zoom + camera.x), Math.trunc((this.position.y - 48 - 64) * zoom + camera.y), 64 * zoom, 64 * zoom)
        }
    }
    Collision(tile){
        if((((this.position.x - this.size.x/2 >= tile.position.x - tile.size.x/2) && (this.position.x - this.size.x/2 <= tile.position.x + tile.size.x/2)) || ((this.position.x + this.size.x/2 >= tile.position.x - tile.size.x/2) && (this.position.x + this.size.x/2 <= tile.position.x + tile.size.x/2))) && (((this.position.y - this.size.y/2 >= tile.position.y - tile.size.y/2) && (this.position.y - this.size.y/2 <= tile.position.y + tile.size.y/2)) || ((this.position.y + this.size.y/2 >= tile.position.y - tile.size.y/2) && (this.position.y + this.size.y/2 <= tile.position.y + tile.size.y/2)))){
            return true;
        }else{
            return false;
        }
    }

    Movement(user_input, tiles){
        const direction = {x: 0, y: 0};

        if(user_input.left == true){
            direction.x -= 1;
            this.facing_direct = "left";
        }
        if(user_input.right == true){
            direction.x += 1;
            this.facing_direct = "right";
        }
        if(user_input.up == true){
            direction.y -= 1;
            this.facing_direct = "up";
        }
        if(user_input.down == true){
            direction.y += 1;
            this.facing_direct = "down";
        }


        const magn = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));

        if(magn != 0){
            this.velocity.x += direction.x / magn;
            this.velocity.y += direction.y / magn;
            this.animation_tick += 1;
        }else{
            this.animation_tick = 0;
        }

        if(this.animation_tick >= 40){
            this.animation_tick = 0;
        }
        if(this.animation_tick <= 20 && this.animation_tick > 0){
            this.animation = 1;
        }
        if(this.animation_tick > 20 || this.animation_tick == 0){
            this.animation = 0;
        }
        
        this.velocity.x *= 0.85;
        this.velocity.y *= 0.85;
        this.position.x += this.velocity.x * this.speed;
        tiles.forEach(tile => {
            if(tile.collision == true){
                if(this.Collision(tile)){
                    if(this.velocity.x > 0){
                        this.position.x = tile.position.x - tile.size.x/2 - this.size.x/2 - 0.01;
                    }
                    if(this.velocity.x < 0){
                        this.position.x = tile.position.x + tile.size.x/2 + this.size.x/2 + 0.01;
                    }
                }
            }
        });
        this.position.y += this.velocity.y * this.speed;
        tiles.forEach(tile => {
            if(tile.collision == true){
                if(this.Collision(tile)){
                    if(this.velocity.y > 0){
                        this.position.y = tile.position.y - tile.size.y/2 - this.size.y/2 - 0.01;
                    }
                    if(this.velocity.y < 0){
                        this.position.y = tile.position.y + tile.size.y/2 + this.size.y/2 + 0.01;
                    }
                }
            }
        });
    }
}