var config = {
    type: Phaser.AUTO,
    parent: 'play-area',
    width: 900,
    height: 500,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        zoom: 1
    }


};

var game = new Phaser.Game(config);
var keys;
var cursors;
var player1;
var player2;
var bullets;

var kill = false;
var spawnAllowed = true;
var enemy;
var music;
var bulletSound;
var WHit;
var EHit;
var CHit;

var character1fire = 2;
var character2fire = 2;
var healthBar;
var healthBar2
var scoreText;
var timetext;
var healthLabel;
var healthLabel2;
var backgroundBar;
var backgroundBar2;
var healthBar;
var healthBar2;

var timer = 1;
var playerscore = 0;
var killcount = 0;
var wave2 = false;
var wave3 = false;
var levelCounter;
var reset;
var paused = true;
var GameOver = false;


function preload () {

    this.load.audio('music', ['sound/background music.ogg']);
    this.load.audio('bullet sound', ['sound/bullet sound.ogg']);
    this.load.image('bullet', 'images/bullet.png');
    this.load.audio('wood', ['sound/WallHit.ogg']);
    this.load.audio('metal', ['sound/EnemyHit.ogg']);
    this.load.audio('Ipickup', ['sound/ItemPickup.wav']);

    // load the PNG file
    this.load.image('base_tiles', 'assets/base_tiles.png');
    // load the JSON file
    this.load.tilemapTiledJSON('tilemap', 'assets/base_tiles.json');

    this.load.image('green-bar', 'images/green health.png');
    this.load.image('red-bar', 'images/red health.png')
    this.load.image('UIBox', 'sprites/box.png');
    this.load.image('PauseInfo', 'sprites/Pause.png');
    this.load.image('EndMenu', 'sprites/end.png');


    this.load.spritesheet('move right', 'sprites/character spritesheet/character_right_move.png',
        {
            frameWidth: 258,
            frameHeight: 220
        }
    );
    this.load.spritesheet('move left', 'sprites/character spritesheet/character_left_move.png',
        {
            frameWidth: 258,
            frameHeight: 220
        }
    );

    this.load.spritesheet('move up', 'sprites/character spritesheet/character_up_move.png',
        {
            frameWidth: 220,
            frameHeight: 258
        }
    );

    this.load.spritesheet('move down', 'sprites/character spritesheet/character_down_move.png',
        {
            frameWidth: 220,
            frameHeight: 258
        }
    );
    this.load.spritesheet('enemy1', 'sprites/target.png',
        {
            frameWidth: 910,
            frameHeight: 838
        }
    );

    this.load.spritesheet('Hazard', 'sprites/enemy/spike.png', {
        frameWidth: 740,
        frameHeight: 450
        }
    );

    this.load.spritesheet('Pickup', 'sprites/intel.png', {
            frameWidth: 220,
            frameHeight: 171
        }
    );

    this.load.spritesheet('shoot right', 'sprites/character spritesheet/shoot_right.png',
        {
            frameWidth: 255,
            frameHeight: 215
        }
    );

    this.load.spritesheet('shoot left', 'sprites/character spritesheet/shoot_left.png',
        {
            frameWidth: 255,
            frameHeight: 215
        }
    );

    this.load.spritesheet('shoot up', 'sprites/character spritesheet/shoot_up.png',
        {
            frameWidth: 215,
            frameHeight: 255
        }
    );

    this.load.spritesheet('shoot down', 'sprites/character spritesheet/shoot_down.png',
        {
            frameWidth: 215,
            frameHeight: 255
        }
    );
}

function create () {

    //Adds the different audio files
    bulletSound = this.sound.add('bullet sound');
    music = this.sound.add('music');
    WHit = this.sound.add('metal');
    EHit = this.sound.add('wood');
    CHit = this.sound.add('Ipickup');

    //Plays main music on startup
    music.play({
        volume:0.1,
        loop: true
    });

    // create the Tilemap
    this.add.image(0, 0, 'base_tiles')
    const map = this.make.tilemap({ key: 'tilemap' });
    // add the tileset image we are using
    const tileset = map.addTilesetImage('standard_tiles', 'base_tiles');
    // "Ground" layer is bottom layer
    map.createStaticLayer('Ground', tileset);
    // wall layer above ground layer
    const Walls = map.createStaticLayer('Walls', tileset);
    Walls.setCollisionByProperty({collides: true})

    //Sets world boundries
    this.physics.world.setBounds(0, 0, 1500, 910);
    this.cameras.main.setBounds(0,0, 1215, 910);
    this.cameras.main.setSize(900, 500);
    this.physics.world.setBounds(0,0, 1215, 910);

    keys = this.input.keyboard.addKeys("W,A,S,D");

    //Creates Player 1
    player1 = this.physics.add.sprite(100, 100, 'move right');
    player1.body.collideWorldBounds = true;
    player1.setScale(0.10);
    player1.health = 100;
    player1.maxHealth = 100;

    //Creates Player 2
    player2 = this.physics.add.sprite(100, 200, 'move right');
    player2.body.collideWorldBounds = true;
    player2.setScale(0.10)
    player2.health = 100;
    player2.maxHealth = 100;

    //Camera will follow Player 1
    this.cameras.main.startFollow(player1);

    //Creates the bullet physics group
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 999999999,
    });

    //Adds the two shoot keys, the pause key and the reset key
    shoot1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    shoot2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    pause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    reset = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('move right', {start: 0, end: 19}),
        frameRate: 20,
        repeat: -1

    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('move left', {start: 0, end: 19}),
        frameRate: 20,
        repeat: -1

    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('move up', {start: 0, end: 19}),
        frameRate: 20,
        repeat: -1

    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('move down', {start: 0, end: 19}),
        frameRate: 20,
        repeat: -1

    });

    this.anims.create({
        key: 'enemy1',
        frames: this.anims.generateFrameNumbers('enemy1', {start: 0, end: 0}),
        frameRate: 0,
        repeat: -1

    });

    this.anims.create({
        key: 'shoot right',
        frames: this.anims.generateFrameNumbers('shoot right', {start: 0, end: 2}),
        frameRate: 3,
        repeat: -1

    });

    this.anims.create({
        key: 'shoot left',
        frames: this.anims.generateFrameNumbers('shoot left', {start: 0, end: 2}),
        frameRate: 3,
        repeat: -1

    });

    this.anims.create({
        key: 'shoot up',
        frames: this.anims.generateFrameNumbers('shoot up', {start: 0, end: 2}),
        frameRate: 3,
        repeat: -1

    });

    this.anims.create({
        key: 'shoot down',
        frames: this.anims.generateFrameNumbers('shoot down', {start: 0, end: 2}),
        frameRate: 3,
        repeat: -1

    });


    this.physics.add.collider(player1, Walls);
    this.physics.add.collider(player2, Walls);
    this.physics.add.collider(bullets, Walls, BulletWall, null, this);

    //Wave 1
    enemy1 = this.physics.add.sprite(1000,800, 'enemy1');
    enemy1.setScale(0.06);
    enemy1.setImmovable(true);
    enemy2 = this.physics.add.sprite( 800,600, 'enemy1');
    enemy2.setScale(0.06);
    enemy2.setImmovable(true);
    enemy3 = this.physics.add.sprite(300,600, 'enemy1');
    enemy3.setScale(0.06);
    enemy3.setImmovable(true);
    enemy4 = this.physics.add.sprite( 1000,250, 'enemy1');
    enemy4.setScale(0.06);
    enemy4.setImmovable(true);
    enemy5 = this.physics.add.sprite( 300,100, 'enemy1');
    enemy5.setScale(0.06);
    enemy5.setImmovable(true);

    //Wave 2
    enemy6 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy6.setScale(0.06);
    enemy6.setImmovable(true);
    enemy7 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy7.setScale(0.06);
    enemy7.setImmovable(true);
    enemy8 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy8.setScale(0.06);
    enemy8.setImmovable(true);
    enemy9 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy9.setScale(0.06);
    enemy9.setImmovable(true);
    enemy10 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy10.setScale(0.06);
    enemy10.setImmovable(true);
    enemy11 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy11.setScale(0.06);
    enemy11.setImmovable(true);

    //Wave 3
    enemy12 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy12.setScale(0.06);
    enemy12.setImmovable(true);
    enemy13 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy13.setScale(0.06);
    enemy13.setImmovable(true);
    enemy14 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy14.setScale(0.06);
    enemy14.setImmovable(true);
    enemy15 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy15.setScale(0.06);
    enemy15.setImmovable(true);
    enemy16 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy16.setScale(0.06);
    enemy16.setImmovable(true);
    enemy17 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy17.setScale(0.06);
    enemy17.setImmovable(true);
    enemy18 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy18.setScale(0.06);
    enemy18.setImmovable(true);
    enemy19 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy19.setScale(0.06);
    enemy19.setImmovable(true);
    enemy20 = this.physics.add.sprite(1400,100, 'enemy1');
    enemy20.setScale(0.06);
    enemy20.setImmovable(true);

    //Create the Hazard items
    hazard1 = this.physics.add.sprite(470, 350, 'Hazard');
    hazard1.setScale(0.1);
    hazard2 = this.physics.add.sprite(815, 180, 'Hazard');
    hazard2.setScale(0.1);
    hazard3 = this.physics.add.sprite(1100, 445, 'Hazard');
    hazard3.setScale(0.1);
    hazard4 = this.physics.add.sprite(725, 620, 'Hazard');
    hazard4.setScale(0.1);
    hazard5 = this.physics.add.sprite(400, 800, 'Hazard');
    hazard5.setScale(0.1);
    hazard6 = this.physics.add.sprite(225, 800, 'Hazard');
    hazard6.setScale(0.1);
    hazard7 = this.physics.add.sprite(420, 430, 'Hazard');
    hazard7.setScale(0.1);
    hazard8 = this.physics.add.sprite(510, 430, 'Hazard');
    hazard8.setScale(0.1);
    hazard9 = this.physics.add.sprite(60, 60, 'Hazard');
    hazard9.setScale(0.1);
    hazard10 = this.physics.add.sprite(500, 60, 'Hazard');
    hazard10.setScale(0.1);

    //Create the Intel pickup items
    intel1 = this.physics.add.sprite(500, 30, 'Pickup');
    intel1.setScale(0.2);
    intel2 = this.physics.add.sprite(1100, 30, 'Pickup');
    intel2.setScale(0.2);
    intel3 = this.physics.add.sprite(1100, 300, 'Pickup');
    intel3.setScale(0.2);
    intel4 = this.physics.add.sprite(1150, 400, 'Pickup');
    intel4.setScale(0.2);
    intel5 = this.physics.add.sprite(1150, 550, 'Pickup');
    intel5.setScale(0.2);
    intel6 = this.physics.add.sprite(470, 420, 'Pickup');
    intel6.setScale(0.2);
    intel7 = this.physics.add.sprite(350, 800, 'Pickup');
    intel7.setScale(0.2);
    intel8 = this.physics.add.sprite(280, 800, 'Pickup');
    intel8.setScale(0.2);
    intel9 = this.physics.add.sprite(470, 320, 'Pickup');
    intel9.setScale(0.2);
    intel10 = this.physics.add.sprite(60, 30, 'Pickup');
    intel10.setScale(0.2);

    //Increase the timer by one every second by calling on the onEvent function
    timedEvent = this.time.addEvent({delay: 1000, callback: onEvent, callbackScope: this, loop: true});

    //Prevents the players from moving through each other
    this.physics.add.collider(player1, player2);

    //Wave 1 Collisions
    this.physics.add.collider(bullets, enemy1, function (bullets, enemy1)
    {
        if(!kill)
        {

            enemy1.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy2, function (bullets, enemy2)
    {
        if(!kill)
        {
            enemy2.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;
    });
    this.physics.add.collider(bullets, enemy3, function (bullets, enemy3)
    {
        if(!kill)
        {

            enemy3.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy4, function (bullets, enemy4)
    {
        if(!kill)
        {
            enemy4.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;
    });
    this.physics.add.collider(bullets, enemy5, function (bullets, enemy5)
    {
        if(!kill)
        {

            enemy5.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });

    //Wave 2 Collisions
    this.physics.add.collider(bullets, enemy6, function (bullets, enemy6)
    {
        if(!kill)
        {

            enemy6.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy7, function (bullets, enemy7)
    {
        if(!kill)
        {

            enemy7.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy8, function (bullets, enemy8)
    {
        if(!kill)
        {

            enemy8.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy9, function (bullets, enemy9)
    {
        if(!kill)
        {

            enemy9.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy10, function (bullets, enemy10)
    {
        if(!kill)
        {

            enemy10.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy11, function (bullets, enemy11)
    {
        if(!kill)
        {

            enemy11.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });

    //Wave 3 Collisions
    this.physics.add.collider(bullets, enemy12, function (bullets, enemy12)
    {
        if(!kill)
        {

            enemy12.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy13, function (bullets, enemy13)
    {
        if(!kill)
        {

            enemy13.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy14, function (bullets, enemy14)
    {
        if(!kill)
        {

            enemy14.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy15, function (bullets, enemy15)
    {
        if(!kill)
        {

            enemy15.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy16, function (bullets, enemy16)
    {
        if(!kill)
        {

            enemy16.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy17, function (bullets, enemy17)
    {
        if(!kill)
        {

            enemy17.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy18, function (bullets, enemy18)
    {
        if(!kill)
        {

            enemy18.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy19, function (bullets, enemy19)
    {
        if(!kill)
        {

            enemy19.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });
    this.physics.add.collider(bullets, enemy20, function (bullets, enemy20)
    {
        if(!kill)
        {

            enemy20.destroy();
            bullets.destroy();
        }
        EHit.play({volume:0.2,});
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        killcount += 1;
        kill = true;
        kill = false;

    });

    //Collisions prevent the players from moving through the targets
    this.physics.add.collider(player1, enemy1);
    this.physics.add.collider(player2, enemy1);
    this.physics.add.collider(player1, enemy2);
    this.physics.add.collider(player2, enemy2);
    this.physics.add.collider(player1, enemy3);
    this.physics.add.collider(player2, enemy3);
    this.physics.add.collider(player1, enemy4);
    this.physics.add.collider(player2, enemy4);
    this.physics.add.collider(player1, enemy5);
    this.physics.add.collider(player2, enemy5);
    this.physics.add.collider(player1, enemy6);
    this.physics.add.collider(player2, enemy6);
    this.physics.add.collider(player1, enemy7);
    this.physics.add.collider(player2, enemy7);
    this.physics.add.collider(player1, enemy8);
    this.physics.add.collider(player2, enemy8);
    this.physics.add.collider(player1, enemy9);
    this.physics.add.collider(player2, enemy9);
    this.physics.add.collider(player1, enemy10);
    this.physics.add.collider(player2, enemy10);
    this.physics.add.collider(player1, enemy11);
    this.physics.add.collider(player2, enemy11);
    this.physics.add.collider(player1, enemy12);
    this.physics.add.collider(player2, enemy12);
    this.physics.add.collider(player1, enemy13);
    this.physics.add.collider(player2, enemy13);
    this.physics.add.collider(player1, enemy14);
    this.physics.add.collider(player2, enemy14);
    this.physics.add.collider(player1, enemy15);
    this.physics.add.collider(player2, enemy15);
    this.physics.add.collider(player1, enemy16);
    this.physics.add.collider(player2, enemy16);
    this.physics.add.collider(player1, enemy17);
    this.physics.add.collider(player2, enemy17);
    this.physics.add.collider(player1, enemy18);
    this.physics.add.collider(player2, enemy18);
    this.physics.add.collider(player1, enemy19);
    this.physics.add.collider(player2, enemy19);
    this.physics.add.collider(player1, enemy20);
    this.physics.add.collider(player2, enemy20);

    //Collisions which damage the relevant player and destroy the hit hazard
    this.physics.add.collider(player2, hazard1, function(player2, hazard1)
    {
        if(!kill)
        {
            hazard1.destroy();
            player2.health = player2.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player1, hazard1, function(player1, hazard1)
    {
        if(!kill)
        {
            hazard1.destroy();
            player1.health = player1.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player2, hazard2, function(player2, hazard2)
    {
        if(!kill)
        {
            hazard2.destroy();
            player2.health = player2.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player1, hazard2, function(player1, hazard2)
    {
        if(!kill)
        {
            hazard2.destroy();
            player1.health = player1.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player2, hazard3, function(player2, hazard3)
    {
        if(!kill)
        {
            hazard3.destroy();
            player2.health = player2.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player1, hazard3, function(player1, hazard3)
    {
        if(!kill)
        {
            hazard3.destroy();
            player1.health = player1.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player2, hazard4, function(player2, hazard4)
    {
        if(!kill)
        {
            hazard4.destroy();
            player2.health = player2.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player1, hazard4, function(player1, hazard4)
    {
        if(!kill)
        {
            hazard4.destroy();
            player1.health = player1.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player2, hazard5, function(player2, hazard5)
    {
        if(!kill)
        {
            hazard5.destroy();
            player2.health = player2.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player1, hazard5, function(player1, hazard5)
    {
        if(!kill)
        {
            hazard5.destroy();
            player1.health = player1.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player2, hazard6, function(player2, hazard6)
    {
        if(!kill)
        {
            hazard6.destroy();
            player2.health = player2.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player1, hazard6, function(player1, hazard6)
    {
        if(!kill)
        {
            hazard6.destroy();
            player1.health = player1.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player2, hazard7, function(player2, hazard7)
    {
        if(!kill)
        {
            hazard7.destroy();
            player2.health = player2.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player1, hazard7, function(player1, hazard7)
    {
        if(!kill)
        {
            hazard7.destroy();
            player1.health = player1.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player2, hazard8, function(player2, hazard8)
    {
        if(!kill)
        {
            hazard8.destroy();
            player2.health = player2.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player1, hazard8, function(player1, hazard8)
    {
        if(!kill)
        {
            hazard8.destroy();
            player1.health = player1.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player2, hazard9, function(player2, hazard9)
    {
        if(!kill)
        {
            hazard9.destroy();
            player2.health = player2.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player1, hazard9, function(player1, hazard9)
    {
        if(!kill)
        {
            hazard9.destroy();
            player1.health = player1.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player2, hazard10, function(player2, hazard10)
    {
        if(!kill)
        {
            hazard10.destroy();
            player2.health = player2.health - 50;
            WHit.play({volume:0.3,});
        }
    })
    this.physics.add.collider(player1, hazard10, function(player1, hazard10)
    {
        if(!kill)
        {
            hazard10.destroy();
            player1.health = player1.health - 50;
            WHit.play({volume:0.3,});
        }
    })


    //Collisions which allow the players to pickup the intel items for points
    this.physics.add.collider(player1, intel1, function(player1, intel1)
    {
        if(!kill)
        {
            intel1.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player2, intel1, function(player2, intel1)
    {
        if(!kill)
        {
            intel1.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player1, intel2, function(player1, intel2)
    {
        if(!kill)
        {
            intel2.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player2, intel2, function(player2, intel2)
    {
        if(!kill)
        {
            intel2.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player1, intel3, function(player1, intel3)
    {
        if(!kill)
        {
            intel3.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player2, intel3, function(player2, intel3)
    {
        if(!kill)
        {
            intel3.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player1, intel4, function(player1, intel4)
    {
        if(!kill)
        {
            intel4.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player2, intel4, function(player2, intel4)
    {
        if(!kill)
        {
            intel4.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player1, intel5, function(player1, intel5)
    {
        if(!kill)
        {
            intel5.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player2, intel5, function(player2, intel5)
    {
        if(!kill)
        {
            intel5.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player1, intel6, function(player1, intel6)
    {
        if(!kill)
        {
            intel6.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player2, intel6, function(player2, intel6)
    {
        if(!kill)
        {
            intel6.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player1, intel7, function(player1, intel7)
    {
        if(!kill)
        {
            intel7.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player2, intel7, function(player2, intel7)
    {
        if(!kill)
        {
            intel7.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player1, intel8, function(player1, intel8)
    {
        if(!kill)
        {
            intel8.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player2, intel8, function(player2, intel8)
    {
        if(!kill)
        {
            intel8.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player1, intel9, function(player1, intel9)
    {
        if(!kill)
        {
            intel9.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player2, intel9, function(player2, intel9)
    {
        if(!kill)
        {
            intel9.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player1, intel10, function(player1, intel10)
    {
        if(!kill)
        {
            intel10.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })
    this.physics.add.collider(player2, intel10, function(player2, intel10)
    {
        if(!kill)
        {
            intel10.destroy();
        }
        playerscore += 100;
        scoreText.setText('Score: ' + playerscore);
        CHit.play({volume:0.2,});
    })

    //UI
    UIPlatform3 = this.physics.add.sprite(190, 40, 'UIBox');
    UIPlatform3.setScale(0.7, 0.24);

    backgroundBar = this.add.image(240, 20, 'red-bar')
    healthBar = this.add.image(240, 20, 'green-bar');
    healthLabel = this.add.text(35,10, 'Player 1', {fontSize:'20px', fill:'#ffffff'});

    backgroundBar2 = this.add.image(240, 60, 'red-bar')
    healthBar2 = this.add.image(240, 60, 'green-bar')
    healthLabel2 = this.add.text(35, 50, 'Player 2', {fontSize:'20px', fill:'#ffffff'});

    UIPlatform1 = this.physics.add.sprite(550, 28, 'UIBox');
    UIPlatform1.setScale(0.68, 0.1);

    UIPlatform2 = this.physics.add.sprite(450, 280, 'PauseInfo');
    UIPlatform2.setScale(0.5, 0.5);

    UIPlatform4 = this.physics.add.sprite(450, 280, 'EndMenu');
    UIPlatform4.setScale(0.5, 0.5);
    UIPlatform4.setVisible(false);

    scoreText = this.add.text(550, 20, 'Score: 0', {fontsize: '20px', fill: '#ffffff'});
    timetext = this.add.text(500, 5, 'Timer: 0', {fontsize: '32px', fill: '#ffffff'});
    timer -= 1;
    timetext.setText('Timer: ' + timer);
    levelCounter = this.add.text(630,20, 'Wave 1', {fontSize:'16px', fill:'#ffffff'});
}


function update ()
{
    healthBar.setScale(player1.health / player1.maxHealth, 1);
    healthBar2.setScale(player2.health / player2.maxHealth, 1);

    cursors = this.input.keyboard.createCursorKeys();

    bullets.outOfBoundsKill = true;
    bullets.rotation = player1.body.x;

    //Keeps the UI from leaving the cameras field of view
    scoreText.x = Math.floor(this.cameras.main.scrollX + 510);
    scoreText.y = Math.floor(this.cameras.main.scrollY + 20);
    levelCounter.x = Math.floor(this.cameras.main.scrollX + 630);
    levelCounter.y = Math.floor(this.cameras.main.scrollY + 20);
    timetext.x = Math.floor(this.cameras.main.scrollX + 400);
    timetext.y = Math.floor(this.cameras.main.scrollY + 20);

    backgroundBar.x = Math.floor(this.cameras.main.scrollX + 240);
    backgroundBar.y = Math.floor(this.cameras.main.scrollY + 20);
    healthBar.x = Math.floor(this.cameras.main.scrollX + 240);
    healthBar.y = Math.floor(this.cameras.main.scrollY + 20);
    healthLabel.x = Math.floor(this.cameras.main.scrollX + 35);
    healthLabel.y = Math.floor(this.cameras.main.scrollY + 10);

    backgroundBar2.x = Math.floor(this.cameras.main.scrollX + 240);
    backgroundBar2.y = Math.floor(this.cameras.main.scrollY + 60);
    healthBar2.x = Math.floor(this.cameras.main.scrollX + 240);
    healthBar2.y = Math.floor(this.cameras.main.scrollY + 60);
    healthLabel2.x = Math.floor(this.cameras.main.scrollX + 35);
    healthLabel2.y = Math.floor(this.cameras.main.scrollY + 50);

    UIPlatform1.x = Math.floor(this.cameras.main.scrollX + 550);
    UIPlatform1.y = Math.floor(this.cameras.main.scrollY + 28);
    UIPlatform2.x = Math.floor(this.cameras.main.scrollX + 450);
    UIPlatform2.y = Math.floor(this.cameras.main.scrollY + 280);
    UIPlatform3.x = Math.floor(this.cameras.main.scrollX + 190);
    UIPlatform3.y = Math.floor(this.cameras.main.scrollY + 40);
    UIPlatform4.x = Math.floor(this.cameras.main.scrollX + 450);
    UIPlatform4.y = Math.floor(this.cameras.main.scrollY + 280);

    //Determines when each wave begins and moves the targets of that wave into the level proper
    //Also determines when the game is over
if (killcount >= 5 && !wave2)
{
    wave2 = true;
    levelCounter.setText('Wave 2');
    enemy6.x = 1100; enemy6.y = 650;
    enemy7.x = 700; enemy7.y = 400;
    enemy8.x = 1000; enemy8.y = 100;
    enemy9.x = 1000; enemy9.y = 500;
    enemy10.x = 300; enemy10.y = 400;
    enemy11.x = 170; enemy11.y = 800;
} else if (killcount >= 11 && !wave3)
{
    levelCounter.setText('Wave 3');
    wave3 = true;
    enemy12.x = 1000; enemy12.y = 800;
    enemy13.x = 800; enemy13.y = 600;
    enemy14.x = 300; enemy14.y = 600;
    enemy15.x = 1000; enemy15.y = 250;
    enemy16.x = 300; enemy16.y = 100;
    enemy17.x = 1000; enemy17.y = 100;
    enemy18.x = 100; enemy18.y = 800;
    enemy19.x = 450; enemy19.y = 800;
    enemy20.x = 1100; enemy20.y = 400;
} else if (killcount >= 20 && wave2 && wave3)
{
    GameOver = true;
}

//If Player 1 reaches zero health then their health will be restored but at the cost of 200 points
if (player1.health <=0) {
    player1.health = 100;
    playerscore -= 500;
    scoreText.setText('Score: ' + playerscore);
}

//If Player 2 reaches zero health then their health will be restored but at the cost of 200 points
    if (player2.health <=0) {
        player2.health = 100;
        playerscore -= 500;
        scoreText.setText('Score: ' + playerscore);
    }

    bullets.children.each(function(b)
    {
        if (b.active) {
            if (b.y < 0) {
                b.setActive(false);
            }
        }
    }.bind(this));

    player1.setVelocityX(0);
    player1.setVelocityY(0);
    player2.setVelocityY(0);
    player2.setVelocityX(0);

    //Triggers the pause variable when the pause button (spacebar) is pressed
    if (Phaser.Input.Keyboard.JustDown(pause)) {
        paused = !paused;
    }

    //Restarts the game when the reset button (Escape) is pressed
    if (Phaser.Input.Keyboard.JustDown(reset)) {
        window.location.reload(true);
    }

    //determines if either of the two main panels (pause and game over) are visible
    if (paused && !GameOver) {
        UIPlatform2.setVisible(true);
    } else if (!paused && !GameOver){
        UIPlatform2.setVisible(false);
    } else if (GameOver) {
        UIPlatform2.setVisible(false);
        UIPlatform4.setVisible(true);
    }

    {
        if (cursors.left.isDown && !paused)
        {
            player1.setVelocityX(-300);
            player1.anims.play('left', true);
            character1fire = 1;
        }
        else if(cursors.right.isDown && !paused)
        {
            player1.setVelocityX(300);
            player1.anims.play('right', true);
            character1fire = 2;
        }
        else if(cursors.up.isDown && !paused)
        {
            player1.setVelocityY(-300);
            player1.anims.play('up', true);
            character1fire = 3;
        }
        else if (cursors.down.isDown && !paused) {
            player1.setVelocityY(300);
            player1.anims.play('down', true);
            character1fire = 4;
        }
    }

    {
        if (character1fire == 1 && Phaser.Input.Keyboard.JustDown(shoot1) && !paused)
        {
            firebulletleft();
            player1.anims.play('shoot left', true);
            bulletSound.play({
                volume:0.2,
            });
        }
        else if (character1fire == 2 && Phaser.Input.Keyboard.JustDown(shoot1) && !paused)
        {
            firebulletright();
            player1.anims.play('shoot right', true);
            bulletSound.play({
                volume:0.2,
            });
        }
        else if (character1fire == 3 && Phaser.Input.Keyboard.JustDown(shoot1) && !paused)
        {
            firebulletup();
            player1.anims.play('shoot up', true);
            bulletSound.play({
                volume:0.2,
            });
        }
        else if (character1fire == 4 && Phaser.Input.Keyboard.JustDown(shoot1) && !paused)
        {
            firebulletdown();
            player1.anims.play('shoot down', true);
            bulletSound.play({
                volume:0.2,
            });
        }
    }

    {
        if (keys.A.isDown && !paused) {
            player2.setVelocityX(-300);
            player2.anims.play('left', true);
            character2fire = 1;
        }
        else if (keys.D.isDown && !paused) {
            player2.setVelocityX(300);
            player2.anims.play('right', true);
            character2fire = 2;
        }
        else if (keys.W.isDown && !paused) {
            player2.setVelocityY(-300);
            player2.anims.play('up', true);
            character2fire = 3;
        }
        else if (keys.S.isDown && !paused) {
            player2.setVelocityY(300);
            player2.anims.play('down', true);
            character2fire = 4;
        }
    }

    {
        if (character2fire == 1 && Phaser.Input.Keyboard.JustDown(shoot2) && !paused)
        {
            firebulletleft2();
            player2.anims.play('shoot left', true);
            bulletSound.play({
                volume:0.2,
            });
        }

        if (character2fire == 2 && Phaser.Input.Keyboard.JustDown(shoot2) && !paused)
        {
            firebulletright2();
            player2.anims.play('shoot right', true);
            bulletSound.play({
                volume:0.2,
            });
        }

        if (character2fire == 3 && Phaser.Input.Keyboard.JustDown(shoot2) && !paused)
        {
            firebulletup2();
            player2.anims.play('shoot up', true);
            bulletSound.play({
                volume:0.2,
            });
        }

        if (character2fire == 4 && Phaser.Input.Keyboard.JustDown(shoot2) && !paused)
        {
            firebulletdown2();
            player2.anims.play('shoot down', true);
            bulletSound.play({
                volume:0.2,
            });
        }
    }
}

{
    function onEvent()
    {
        if (!GameOver && !paused) {
            timer += 1;
            timetext.setText('Timer: ' + timer);
        }
    }

    //Destroys any bullet which hits a wall
    function BulletWall(bullets, Wall){
        bullets.destroy();
        WHit.play({volume:0.2,});
    }

    function firebulletleft(){
        var bullet = this.bullets.get(player1.x -20,player1.y - 0);
        if(bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.x = -900;
            bullet.body.velocity.y = 0;
            bullet.setAngle(0);
            bullet.setScale(0.5, 0.5);
        }
    }

    function firebulletright(){
        var bullet = this.bullets.get(player1.x +20,player1.y + 0);
        if(bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.x = 900;
            bullet.body.velocity.y = 0;
            bullet.setAngle(0);
            bullet.setScale(0.5, 0.5);
        }
    }

    function firebulletup() {
        var bullet = this.bullets.get(player1.x + 0, player1.y - 20);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = -900;
            bullet.body.velocity.x = 0;
            bullet.setAngle(90);
            bullet.setScale(0.5, 0.5);
        }
    }

    function firebulletdown(){
        var bullet = this.bullets.get(player1.x - 0,player1.y + 20);
        if(bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = 900;
            bullet.body.velocity.x = 0;
            bullet.setAngle(90);
            bullet.setScale(0.5, 0.5);
        }
    }
}

{
    function firebulletleft2() {
        var bullet = this.bullets.get(player2.x - 20, player2.y - 0);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.x = -900;
            bullet.body.velocity.y = 0;
            bullet.setAngle(0);
            bullet.setScale(0.5, 0.5);
        }
    }

    function firebulletright2(){
        var bullet = this.bullets.get(player2.x +20,player2.y + 0);
        if(bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.x = 900;
            bullet.body.velocity.y = 0;
            bullet.setAngle(0);
            bullet.setScale(0.5, 0.5);
        }
    }
    function firebulletup2() {

        var bullet = this.bullets.get(player2.x + 0, player2.y - 20);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = -900;
            bullet.body.velocity.x = 0;
            bullet.setAngle(90);
            bullet.setScale(0.5, 0.5);
        }
    }

    function firebulletdown2(){
        var bullet = this.bullets.get(player2.x - 0,player2.y + 20);
        if(bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = 900;
            bullet.body.velocity.x = 0;
            bullet.setAngle(90);
            bullet.setScale(0.5, 0.5);
        }
    }
}

