var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var platforms;
var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('sky', 'assets/img/sky.png');
  this.load.image('ground', 'assets/img/ground.png');
  this.load.image('star', 'assets/img/star.png');
  this.load.image('bomb', 'assets/img/bomb.png');
  this.load.spritesheet('char',
    'assets/img/char.png',
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create ()
{
  this.add.image(400, 300, 'sky');

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 550, 'ground');
}

function update ()
{
}
