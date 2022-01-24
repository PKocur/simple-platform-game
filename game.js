let player;
let enemies;
let stars;
let lavas;
let flags;
let platforms;
let cursors;
let startScore = 0;
let scoreIncrementValue = 10;
let score = startScore;
let gamePause = false;
let scoreText;
let healthText;
let game;
let enemyToLeft = false;
let startHealth = 3;
let health = startHealth;
let hurt = false;
let config = {
    type: Phaser.AUTO, width: 800, height: 600, physics: {
        default: 'arcade', arcade: {
            gravity: {y: 700}, debug: false
        }
    }, scene: {
        preload: preload, create: create, update: update
    }
};

new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform_short.png');
    this.load.image('platform_wood', 'assets/platform_wooden.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('box', 'assets/box.png');
    this.load.image('lava', 'assets/lava.png');
    this.load.image('flag', 'assets/flag.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.spritesheet('player', 'assets/player.png', {frameWidth: 32, frameHeight: 48})
}

function create() {
    game = this;
    cursors = this.input.keyboard.createCursorKeys();
    this.time.addEvent({
        callback: moveEnemyByTime, callbackScope: this, delay: 1000, loop: true
    });
    createLevel();
    bounceStars();
    createGUI();
    createPlayer(this);
    setColliders();
    setCamera();
}

function update() {
    if (gamePause) {
        return;
    }
    moveEnemy();
    movePlayer();
}

function createPlayer() {
    player = game.physics.add.sprite(50, 100, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    game.anims.create({
        key: 'left', frames: game.anims.generateFrameNumbers('player', {start: 0, end: 3}), frameRate: 10, repeat: -1
    });
    game.anims.create({
        key: 'turn', frames: [{key: 'player', frame: 4}], frameRate: 20
    });
    game.anims.create({
        key: 'right', frames: game.anims.generateFrameNumbers('player', {start: 5, end: 8}), frameRate: 10, repeat: -1
    });
}

function bounceStars() {
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
}

function setColliders() {
    game.physics.add.collider(player, platforms);
    game.physics.add.collider(stars, platforms);
    game.physics.add.collider(enemies, platforms);

    game.physics.add.overlap(player, stars, collectStar, null, this);
    game.physics.add.overlap(player, enemies, touchEnemy, null, this);
    game.physics.add.collider(player, lavas, hurtPlayer, null, this);
    game.physics.add.overlap(player, flags, win, null, this);
}

function setCamera() {
    game.cameras.main.setBounds(0, 0, 4800, 600);
    game.physics.world.setBounds(0, 0, 4800, 600);
    game.cameras.main.startFollow(player);
}

function createBackground() {
    let i;
    for (i = 0; i < 10; i++) {
        game.add.image(400 + 800 * i, 300, 'sky');
    }
}

function createEnemy(x, y) {
    enemies.create(x, y, 'enemy').setScale(0.4).refreshBody();
}

function moveEnemyByTime() {
    enemyToLeft = !enemyToLeft;
}

function createBoxStairs(x, y) {
    let i;
    for (i = 0; i < 15; i++) {
        createBoxes(x, y, 0, 1);
        createBoxes(x, y - 32, 0, 1);
        x += 32;
        y -= 32;
    }
}

function initializePhysicsGroups() {
    enemies = game.physics.add.group();
    platforms = game.physics.add.staticGroup();
    flags = game.physics.add.staticGroup();
    lavas = game.physics.add.staticGroup();
    stars = game.physics.add.group();
}

function createBoxes(x, y, offset, count) {
    let i;
    for (i = 0; i < count; i++) {
        platforms.create(x + offset * i, y, 'box').setScale(0.25).refreshBody();
    }
}

function createStars(x, y, offset, count) {
    let i;
    for (i = 0; i < count; i++) {
        stars.create(x + offset * i, y, 'star');
    }
}

function createPlatforms(start_platform_position, y, count) {
    let i;
    for (i = 0; i < count; i++) {
        platforms.create(start_platform_position * 90 + 90 * i, y, 'ground');
    }
}

function createWoodenPlatform(x, y) {
    platforms.create(x, y, 'platform_wood');
}

function createLava(x, y, count) {
    let i;
    for (i = 0; i < count; i++) {
        lavas.create(x + 90 * i, y, 'lava');
    }
}

function createLevel() {
    createBackground();
    initializePhysicsGroups();
    createLava(0, 595, 50);
    createPlatforms(0, 585, 4)
    createPlatforms(5, 585, 1)
    createPlatforms(7, 585, 1)
    createPlatforms(9, 585, 1)
    createPlatforms(11, 585, 1)
    createPlatforms(13, 585, 5)
    createPlatforms(35, 585, 3)
    createPlatforms(50, 585, 5)
    createStars(360, 100, 0, 1);
    createBoxes(360, 430, 0, 1);
    createStars(650, 100, 100, 4);
    createBoxes(650, 430, 100, 4);
    createBoxes(1150, 500, 0, 1);
    createWoodenPlatform(1300, 300);
    createWoodenPlatform(1150, 200);
    createWoodenPlatform(1000, 100);
    createEnemy(975, 20);
    createStars(850, 20, -100, 3);
    createBoxes(850, 100, -100, 3);
    createBoxes(1150, 500, 0, 1);
    createStars(1400, 20, 150, 4);
    createBoxStairs(1400, 552);
    createStars(1500, 450, 0, 1);
    createStars(1620, 450, 0, 1);
    createBoxes(1620, 500, 0, 1);
    createBoxes(1900, 500, 320, 4);
    createStars(3500, 20, 200, 5);
    createWoodenPlatform(3500, 500);
    createWoodenPlatform(3700, 400);
    createWoodenPlatform(3900, 300);
    createWoodenPlatform(4100, 200);
    createWoodenPlatform(4300, 100);
    createEnemy(1250, 500);
    createEnemy(3150, 200);
    createEnemy(3475, 100);
    createEnemy(3675, 100);
    createEnemy(3875, 100);
    createEnemy(4075, 100);
    createEnemy(4275, 50);
    flags.create(4750, 520, 'flag').setScale(0.75).refreshBody();
}

function createGUI() {
    healthText = game.add.text(16, 16, 'Health: 0', {fontSize: '32px', fill: '#000'}).setScrollFactor(0);
    healthText.setText('Health: ' + health);
    scoreText = game.add.text(16, 64, 'Score: 0', {fontSize: '32px', fill: '#000'}).setScrollFactor(0);
}

function movePlayer() {
    if (cursors.left.isDown) {
        player.setVelocityX(-250);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(250);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }
}

function moveEnemy() {
    if (enemyToLeft) {
        enemies.setVelocityX(-50);
    } else {
        enemies.setVelocityX(50);
    }
}

function touchEnemy(player, enemy) {
    if (player.body.velocity.y > 0 || enemy.body.blocked.up) {
        player.setVelocityY(-300);
        enemy.destroy();
    } else {
        hurtPlayer(player, null);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += scoreIncrementValue;
    scoreText.setText('Score: ' + score);
}

function restartGame() {
    score = 0;
    health = startHealth;
    enemyToLeft = false;
    gamePause = false;
    game.physics.resume();
    game.scene.restart();
}

function disableHurt() {
    player.setTint(0xFFFFFF);
    hurt = false;
}

function showPlayerAsHurt() {
    player.setTint(0xff0000);
    player.anims.play('turn');
}

function hurtPlayer(player, hurtingObj) {
    if (hurt) {
        return;
    }
    health -= 1;
    healthText.setText('Health: ' + health);
    if (health > 0) {
        hurt = true;
        showPlayerAsHurt();
        game.time.addEvent({
            callback: disableHurt, callbackScope: this, delay: 750, loop: false
        });
    } else {
        game.physics.pause();
        showPlayerAsHurt();
        gamePause = true;
        restartGame();
    }
}

function win(player, flag) {
    game.physics.pause();
    player.setTint(0x7CFC00);
    player.anims.play('turn');
    gamePause = true;
}
