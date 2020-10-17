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
    keys,
    jumpCount = 0,
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
  // set world bounds
  this.physics.world.setBounds(0,0,1000,600);

  // add background
  this.add.image(400, 300, 'sky');

  // create container for platforms
  platforms = this.physics.add.staticGroup();

  // add X platforms
  platforms.create(400, 550, 'ground');
  platforms.create(1100, 400, 'ground');

  // create player
  player = this.physics.add.sprite(100, 410, 'char');

  // add bounce and collision detection for player
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // camera follow player
  this.cameras.main.startFollow(player);

  // create controls
  cursors = this.input.keyboard.createCursorKeys();
  keys = this.input.keyboard.addKeys('W,S,A,D,SHIFT');

  // create stars
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  // add unique bounce to stars
  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // create container for bombs
  bombs = this.physics.add.group();

  // collide with platforms
  this.physics.add.collider(player, platforms, slowFall, null, this);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);

  // check if player touches a star
  this.physics.add.overlap(player, stars, collectStar, null, this);

  // check if player touches a bomb
  this.physics.add.collider(player, bombs, hitBomb, null, this);

  // add score to screen
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update ()
{
  if (gameOver)
  {
    return;
  }

  if (cursors.left.isDown || keys.A.isDown)
  {
    player.setVelocityX(-160);
    // player.anims.play('left', true);
  }
  else if (cursors.right.isDown || keys.D.isDown)
  {
    player.setVelocityX(160);
    // player.anims.play('right', true);
  }
  else
  {
    player.setVelocityX(0);

    // player.anims.play('turn');
  }

  const isJumpJustDown = Phaser.Input.Keyboard.JustDown(cursors.up);
  const touchingGround = player.body.touching.down;

  if ((isJumpJustDown) && (touchingGround || jumpCount < 2))
  {
    player.setVelocityY(-330);

    jumpCount++;
  }

  if ((cursors.down.isDown || keys.S.isDown)&& !touchingGround)
  {
    player.setVelocityY(330);
  }

  if (keys.SHIFT.isDown && !touchingGround)
  {
    player.setVelocityY(66);
  }

  if (touchingGround && !isJumpJustDown)
  {
    jumpCount = 0;
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
    // add another round of stars
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    // add a bomb
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

  setTimeout(function(){
    alert('Game Over!');
    location.reload();
  }, 3000);
}

function slowFall(player, ground)
{
    player.setVelocityY(25);
}
