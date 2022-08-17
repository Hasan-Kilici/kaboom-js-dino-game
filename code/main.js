import kaboom from "kaboom"

const FLOOR_HEIGHT = 28;
const JUMP_FORCE = 800;
const SPEED = 450;

kaboom({
  background: [51, 151, 255]
})
loadSprite("bean", "/sprites/bean.png");
scene("game", () => {
  gravity(2900);

  const player = add([sprite("bean"), pos(80, 40), area(), body()]);

  add([
    rect(width(), FLOOR_HEIGHT),
    outline(4),
    pos(0, height()),
    origin("botleft"),
    area(),
    solid(),
    color(0, 0, 0),
  ]);

  function jump() {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
    }
  }
  onKeyPress("up", jump);
  onKeyPress("w", jump);
  onKeyPress("space", jump);
  onClick(jump);

  function spawnTree() {
    add([
      rect(48, rand(32, 66)),
      area(),
      outline(4),
      pos(width(), height() - FLOOR_HEIGHT),
      origin("botleft"),
      color(0, 0, 0),
      move(LEFT, SPEED),
      cleanup(),
      "tree",
    ]);

    wait(rand(1, 1.7), spawnTree);
  }

  spawnTree();

  function spawnMonster() {
    add([
      rect(28, rand(26, 26)),
      area(),
      outline(4),
      pos(width(), height() - 210),
      origin("botleft"),
      color(0, 0, 0),
      move(LEFT, SPEED),
      cleanup(),
      "monster",
    ]);

    wait(rand(4, 4.7), spawnMonster);
  }

  spawnMonster();
  
  player.onCollide("tree", () => {
    go("lose", score);
    burp();
    addKaboom(player.pos);
  });

  player.onCollide("monster", () => {
    go("lose", score);
    burp();
    addKaboom(player.pos);
  });
      
  let score = 0;

  const scoreLabel = add([text(score), pos(24, 24)]);

  onUpdate(() => {
    score++;
    scoreLabel.text = score;
  });
});

scene("lose", (score) => {
  add([
    sprite("bean"),
    pos(width() / 2, height() / 2 - 80),
    scale(2),
    origin("center"),
  ]);

  add([
    text(score),
    pos(width() / 2, height() / 2 + 80),
    scale(2),
    origin("center"),
  ]);
  onKeyPress("space", () => go("game"));
  onClick(() => go("game"));
});

go("game");
