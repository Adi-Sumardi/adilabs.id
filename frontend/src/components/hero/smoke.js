function spawnRocket(push, x, y) {
  for (let i = 0; i < 3; i++) {
    push({ x: x + (Math.random() - .5) * 12, y, r: 6 + Math.random() * 10, maxR: 35 + Math.random() * 30,
      vx: (Math.random() - .5) * .8, vy: 2 + Math.random() * 2, ax: 0, ay: .05,
      alpha: .6 + Math.random() * .25, decay: .011 + Math.random() * .009, color: [200, 210, 230] });
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 2; i++) {
      const spd = 2.5 + Math.random() * 2.5;
      push({ x: x + side * (6 + Math.random() * 6), y: y + Math.random() * 8,
        r: 5 + Math.random() * 8, maxR: 45 + Math.random() * 35,
        vx: side * spd, vy: .5 + Math.random(), ax: -side * .08, ay: .12,
        alpha: .5 + Math.random() * .2, decay: .01 + Math.random() * .008, color: [180, 195, 215] });
    }
  }
  if (Math.random() < .3) {
    const d = Math.random() < .5 ? -1 : 1;
    push({ x: x + d * (10 + Math.random() * 15), y: y + 5,
      r: 12 + Math.random() * 8, maxR: 70 + Math.random() * 40,
      vx: d * (1.5 + Math.random() * 1.5), vy: 1.2 + Math.random() * 1.5, ax: -d * .04, ay: .06,
      alpha: .3 + Math.random() * .2, decay: .006 + Math.random() * .005, color: [220, 220, 230] });
  }
}

function spawnJet(push, x, y) {
  for (const side of [-6, 6]) {
    for (let i = 0; i < 2; i++) {
      push({ x: x + side + (Math.random() - .5) * 4, y: y + Math.random() * 4,
        r: 3 + Math.random() * 5, maxR: 20 + Math.random() * 20,
        vx: (Math.random() - .5) * .3 + side * .05, vy: 1.5 + Math.random() * 2, ax: 0, ay: .03,
        alpha: .7 + Math.random() * .2, decay: .018 + Math.random() * .012, color: [230, 240, 255] });
    }
  }
  push({ x: x + (Math.random() - .5) * 5, y,
    r: 4 + Math.random() * 4, maxR: 15 + Math.random() * 10,
    vx: (Math.random() - .5) * .5, vy: 2 + Math.random() * 2, ax: 0, ay: .04,
    alpha: .8, decay: .025, color: [255, 200, 120] });
}

function spawnUFO(push, x, y) {
  for (let i = 0; i < 5; i++) {
    const angle = (Math.random() - .5) * .3;
    push({ x: x + (Math.random() - .5) * 20, y: y + Math.random() * 5,
      r: 3 + Math.random() * 6, maxR: 18 + Math.random() * 18,
      vx: Math.sin(angle) * 2, vy: 3 + Math.random() * 3, ax: 0, ay: .02,
      alpha: .8 + Math.random() * .15, decay: .02 + Math.random() * .015, color: [255, 154, 60] });
  }
  for (const side of [-1, 1]) {
    if (Math.random() < .4) {
      push({ x: x + side * 30, y: y - 5,
        r: 4, maxR: 22, vx: side * (2 + Math.random() * 2), vy: .5, ax: -side * .06, ay: .1,
        alpha: .5, decay: .015, color: [255, 210, 90] });
    }
  }
}

const SPAWNERS = { rocket: spawnRocket, jet: spawnJet, ufo: spawnUFO };

export function spawnExhaust(vehicleKey, push, x, y) {
  SPAWNERS[vehicleKey]?.(push, x, y);
}
