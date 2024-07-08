const Games = (function () {
  var frames = {
    max: {
      x: 8,
      y: 12,
    },
    current: 0,
    elapsed: 0,
    hold: 5,
  };
  var player = {
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    speed: 5,
    image: new Image(),
  };
  var move = {
    offsetX: 0,
    offsetY: 0,
    velocityX: 0,
    velocityY: 0,
  };
  var states = {
    direction: 1,
    anim: 0,
    clicked: {
      x: 0,
      y: 0,
    },
  };
  var controllerState;

  function setup() {
    canv = document.getElementById('canvas');
    ctx = canv.getContext('2d');
    Main.execute();
  }

  var Main = {
    area: function () {
      canv.width = window.innerWidth;
      canv.height = 500;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canv.width, canv.height);
    },
    spawn: function (frameX, frameY) {
      ctx.drawImage(
        player.image,
        frameX * (player.image.width / frames.max.x),
        frameY * (player.image.height / frames.max.y) + 5,
        player.image.width / frames.max.x,
        player.image.height / frames.max.y,
        player.x,
        player.y,
        player.width,
        player.height
      );
    },
    direct: function () {
      if (states.anim == 0) {
        if (states.direction == 1) {
          Main.spawn(0, 0);
        } else if (states.direction == 2) {
          Main.spawn(0, 1);
        }
      } else if (states.anim == 1) {
        Main.spawn(frames.current, 0);
      } else if (states.anim == 2) {
        Main.spawn(frames.current, 1);
      }
    },
    controller: function (state) {
      if (state == 'mobile') {
        canv.ontouchstart = Main.interact;
      } else if (state == 'pc') {
        canv.onclick = Main.interact;
      }
    },
    interact: function (evt) {
      switch (evt.type) {
        case 'click':
          move.offsetX = evt.x - player.width / 2;
          move.offsetY = evt.y - player.height / 2;
          states.clicked.x = evt.x - 10;
          states.clicked.y = evt.y - 10;
          break;
        case 'touchstart':
          move.offsetX = evt.touches[0].clientX - player.width / 2;
          move.offsetY = evt.touches[0].clientY - player.height / 2;
          states.clicked.x = evt.touches[0].clientX - 10;
          states.clicked.y = evt.touches[0].clientY - 10;
          break;
      }
    },
    dot: function () {
      ctx.fillStyle = 'red';
      ctx.fillRect(states.clicked.x, states.clicked.y, 10, 10);
    },
    execute: function () {
      requestAnimationFrame(Main.execute);
      Main.area();
      Main.direct();
      Main.controller(controllerState);
      if (player.x < move.offsetX - player.speed) {
        move.velocityX = player.speed;
        states.anim = 1;
        states.direction = 1;
        Main.dot();
      } else if (player.x > move.offsetX) {
        move.velocityX = -player.speed;
        states.anim = 2;
        states.direction = 2;
        Main.dot();
      } else {
        move.velocityX = 0;
        states.anim = 0;
      }

      if (player.y < move.offsetY - player.speed) {
        move.velocityY = player.speed;
        Main.dot();
      } else if (player.y > move.offsetY) {
        move.velocityY = -player.speed;
        Main.dot();
      } else {
        move.velocityY = 0;
      }

      frames.elapsed++;
      if (frames.elapsed % frames.hold == 0) {
        if (frames.current < frames.max.x - 3) {
          frames.current++;
        } else {
          frames.current = 0;
        }
      }

      player.x += move.velocityX;
      player.y += move.velocityY;
    },
  };
  return {
    start: function () {
      window.onload = setup;
      if (window.innerWidth <= 769) {
        controllerState = 'mobile';
      } else {
        controllerState = 'pc';
      }
      player.image.src = 'assets/global.png';
    },
    responsive: function () {
      window.addEventListener('resize', () => {
        if (window.innerWidth <= 769) {
          controllerState = 'mobile';
        } else {
          controllerState = 'pc';
        }
      });
    },
  };
})();

Games.start();
Games.responsive();
