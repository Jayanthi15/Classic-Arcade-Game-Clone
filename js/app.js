// Initialy declare the enemies array and emptied.
var allEnemies = [];
// Number of Enemies.
var number_of_ememies = 3;
// Player's X position.
var initial_player_x = 200;
// Player's Y position.
var initial_player_y = 300;
// Game's top boundary.
var player_boundary_top = 0;
// Game's bottom boundary.
var player_boundary_bottom = 350;
// Game's left boundary.
var player_boundary_left = 0;
// Game's right boundary.
var player_boundary_right = 400;
// Enemy's border.
var enemy_border = 505;
// Each object's height(enemy, player).
var object_height = 50;
// Each object's width(enemy, player).
var object_width = 50;
// HTML object to show error message.
var publish_game_status = document.getElementById('game_status');
// Flag to check if the game is paused.
var is_paused = false;
// Flag to check if the game is over.
var is_game_over = false;

/* Enemy Class 
 * x and y attributes are the x and y values for the enemy to take a place on the canvas.
 * speed attribute is used to determine the enemy's speed to move on the game.
 * height and width attributes stores the enemy's height and width on the game.
 * sprite attribute stores to image of the enemy.
 */
var Enemy = function(enemy_x, enemy_y, enemy_speed) {
    this.x = enemy_x;
    this.y = enemy_y;
    this.speed = enemy_speed;
    this.height = object_height;
    this.width = object_width;
    this.sprite = 'images/enemy-bug.png';
};
/* Enemy update method
 * Update method used to update the position of the enemy on the game.
 * Enemy position is calculated.
 * checkCollisions() Check if the enemy and the player get collide each other.
 * Also check if the enemy goes beyond its boundary limit and if it goes beyond the limit the position is reset.
 */
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
    this.checkCollisions();
    if (this.x > enemy_border) {
        this.x = Math.floor(Math.random() * ((-2000) - (-100) + 1) + (-100));
    }
};
/* Enemy render method
 * Render method used to render the enemy on the canvas.
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/* Enemy checkCollision method
 * checkCollision method used to check if the player and the enemy meets each other on the canvas inorder to check the collision.
 * If player and enemy collide each other then the player position is reset.
 * Show an error message that the game is over and the game is set to paused state.
 */
Enemy.prototype.checkCollisions = function() {
    if (player.x < this.x + this.width && player.x + player.width > this.x && player.y < this.y + this.height && player.y + player.height > this.y) {
        player.reset();
        publish_game_status.innerHTML = '<span class="game_over"><strong>Game Over!</strong></span>';
        is_paused = true;
        is_game_over = true;
    }
};
/* Player Class
 * sprite attribute stores the image of the player.
 * x and y attributes are the x and y values for the player to take a place on the canvas.
 * height and width attributes stores the player's height and width on the game.
 * score attribute stores the actual score of the player.
 */
var Player = function() {
    this.sprite = 'images/char-pink-girl.png';
    this.x = initial_player_x;
    this.y = initial_player_y;
    this.height = object_height;
    this.width = object_width;
    this.score = 0;
};
/* Player update method
 * update method check if the player has reached the water. 
 * If reached the water then the score is incremented and his position to reset to starting position.
 */
Player.prototype.update = function(dt) {
    if (this.y <= 0) {
        this.score += 1;
        this.reset();
    }
};
/* Player render method
 * render method renders the player image on the canvas.
 * the score board id updated in this method.
 * User instruction is given below the canvas.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText(this.score, 450, 100);
    ctx.font = '15px Arial';
    ctx.fillStyle = '#F6F605';
    ctx.textAlign = 'center';
    ctx.fillText('P: Play/Pause | R: Restart | ESC: Restart | Navigation Keys to move player', 250, 570);
};
/* Player handleInput method
 * handleInput used to handle the navigation input given by the user.
 * Also checks if the player is moved beyond the game boundary to make the player still inside the game.
 */
Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x > player_boundary_left) {
        this.x = this.x - 100;
    } else if (key === 'right' && this.x < player_boundary_right) {
        this.x = this.x + 100;
    } else if (key === 'up' && this.y > player_boundary_top) {
        this.y = this.y - 85;
    } else if (key === 'down' && this.y < player_boundary_bottom) {
        this.y = this.y + 85;
    }
};
/* Player reset method
 * reset used to reset the player position the initial position.
 */
Player.prototype.reset = function() {
    this.x = initial_player_x;
    this.y = initial_player_y;
};
/* Function to initiate/spawn the enemies
 * spawn_enemies() method used to empty the allEnemies variable.
 * Iterate for number of enemies present in the number_of_ememies variable and push the instantiated enemies in allEnemies variable.
 * The player score is set to zero.
 * Set is_paused flag.
 * Set is_game_over flag.
 */
function spawn_enemies() {
    allEnemies = [];
    for (var i = 0; i < number_of_ememies; i++) {
        allEnemies.push(new Enemy(-60, 60 + 85 * i, Math.floor(Math.random() * 5 + 1) * 100));
    }
    is_paused = false;
    is_game_over = false;
    player.score = 0;
}
//Instantiate the Player class
var player = new Player();
// Initiate the enemies
spawn_enemies();
/*Keyup event to listen to the user input.
 * When the user presses the r key or esc key then the game is restarted.
 * When the user presses the p then the game will be paused and palyed based upon the is_paused flag.
 * When the user presses the up arrow key the player will be moved upwards.
 * When the user presses the down arrow key the player will be moved downwards.
 * When the user presses the left arrow key the player will be moved toward left.
 * When the user presses the right arrow key the player will be moved toward right.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'p',
        27: 'esc',
        82: 'r',
    };
    if (allowedKeys[e.keyCode] === 'p' && !is_game_over) {
        is_paused ? is_paused = false : is_paused = true;
    } else if ((allowedKeys[e.keyCode] === 'esc') || (allowedKeys[e.keyCode] === 'r')) {
        publish_game_status.innerHTML = '';
        player.reset();
        spawn_enemies();
    } else if (!is_paused && !is_game_over) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});