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
    },
    game = new Phaser.Game(config),
    player,
    stars,
    bombs,
    platforms,
    cursors,
    score = 0,
    scoreText = '',
    gameOver = false;

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

  player = this.physics.add.sprite(100, 410, 'char');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);


  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  stars.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

  });
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);

  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);

  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update ()
{
  cursors = this.input.keyboard.createCursorKeys();

  if (gameOver)
  {
    return;
  }

  if (cursors.left.isDown)
  {
    player.setVelocityX(-160);
    // player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
    player.setVelocityX(160);
    // player.anims.play('right', true);
  }
  else
  {
    player.setVelocityX(0);

    // player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down)
  {
    player.setVelocityY(-330);
  }
}

function collectStar (player, star)
{
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);

  // all stars are cleared
  if (stars.countActive(true) === 0)
  {
    stars.children.iterate(function (child) {

      child.enableBody(true, child.x, 0, true, true);

    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    // add bomb
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

  }
}

function hitBomb(player, bomb)
{
  this.physics.pause();

  player.setTint(0xff0000);

  // player.anims.play('turn');

  gameOver = true;
}