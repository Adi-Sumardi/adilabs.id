export function makeRocket() {
  return `<svg id="vehicle-svg" width="160" viewBox="0 0 160 320" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rBody" x1="50" y1="10" x2="110" y2="210" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ffffff"/><stop offset=".55" stop-color="#eef2f8"/><stop offset="1" stop-color="#ccd6e4"/>
      </linearGradient>
      <linearGradient id="rNose" x1="42" y1="10" x2="118" y2="95" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ff6b5f"/><stop offset="1" stop-color="#d92b1f"/>
      </linearGradient>
      <linearGradient id="rFinL" x1="8" y1="160" x2="30" y2="200" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ff6b5f"/><stop offset="1" stop-color="#e0332b"/>
      </linearGradient>
      <linearGradient id="rFinR" x1="130" y1="160" x2="152" y2="200" gradientUnits="userSpaceOnUse">
        <stop stop-color="#d92b1f"/><stop offset="1" stop-color="#99160f"/>
      </linearGradient>
      <radialGradient id="rWin" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#eafaff"/><stop offset="55%" stop-color="#63c7f2"/><stop offset="100%" stop-color="#0096c7"/>
      </radialGradient>
      <linearGradient id="rBand" x1="60" y1="190" x2="100" y2="210" gradientUnits="userSpaceOnUse">
        <stop stop-color="#9aa4b2"/><stop offset="1" stop-color="#545d6b"/>
      </linearGradient>
      <linearGradient id="flameOuter" x1="80" y1="206" x2="80" y2="298" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ff8a3d"/><stop offset="1" stop-color="#d81f0d"/>
      </linearGradient>
      <linearGradient id="flameMid" x1="80" y1="214" x2="80" y2="280" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ffcf5c"/><stop offset="1" stop-color="#ff7a1a"/>
      </linearGradient>
      <linearGradient id="flameInner" x1="80" y1="222" x2="80" y2="269" gradientUnits="userSpaceOnUse">
        <stop stop-color="#fffbe8"/><stop offset="1" stop-color="#ffd23f"/>
      </linearGradient>
      <clipPath id="rWinClip"><circle cx="80" cy="112" r="27"/></clipPath>
    </defs>
    <path d="M80 10 C50 10 30 60 30 110 L30 190 L80 210 L130 190 L130 110 C130 60 110 10 80 10Z" fill="url(#rBody)" stroke="#10141f" stroke-width="4" stroke-linejoin="round"/>
    <path d="M80 10 C58 10 44 38 41 72 C40 80 40 88 42 95 C55 87 67 82 80 82 C93 82 105 87 118 95 C120 88 120 80 119 72 C116 38 102 10 80 10Z" fill="url(#rNose)"/>
    <path d="M55 25 C46 38 40 60 40 92 L48 92 C48 62 53 40 62 27Z" fill="rgba(255,255,255,0.35)"/>
    <circle cx="80" cy="112" r="27" fill="url(#rWin)" stroke="#10141f" stroke-width="4"/>
    <g clip-path="url(#rWinClip)">
      <rect x="58" y="88" width="9" height="52" rx="3" fill="rgba(255,255,255,0.5)" transform="rotate(22 80 112)"/>
      <rect x="70" y="88" width="5" height="52" rx="2" fill="rgba(255,255,255,0.3)" transform="rotate(22 80 112)"/>
    </g>
    <path d="M30 160 L8 200 L30 190Z" fill="url(#rFinL)" stroke="#10141f" stroke-width="4" stroke-linejoin="round"/>
    <path d="M130 160 L152 200 L130 190Z" fill="url(#rFinR)" stroke="#10141f" stroke-width="4" stroke-linejoin="round"/>
    <g class="vehicle-flame">
      <path d="M80 206 C64 210 48 218 44 232 C42 240 44 248 50 254 C44 264 40 274 62 285 C68 272 70 262 71 258 C72 270 76 286 80 298 C84 286 88 270 89 258 C90 262 92 272 98 285 C120 274 116 264 110 254 C116 248 118 240 116 232 C112 218 96 210 80 206Z" fill="url(#flameOuter)"/>
      <path d="M80 214 C69 217 58 223 55 233 C54 239 55 245 59 249 C55 256 52 263 68 271 C72 262 74 255 74 252 C75 261 78 272 80 280 C82 272 85 261 86 252 C86 255 88 262 92 271 C108 263 105 256 101 249 C105 245 106 239 105 233 C102 223 91 217 80 214Z" fill="url(#flameMid)"/>
      <path d="M80 222 C72 225 65 230 63 237 C62 242 64 246 67 249 C64 254 63 259 72 265 C75 259 76 254 76 251 C77 257 79 264 80 269 C81 264 83 257 84 251 C84 254 85 259 88 265 C97 259 96 254 93 249 C96 246 98 242 97 237 C95 230 88 225 80 222Z" fill="url(#flameInner)"/>
    </g>
    <rect x="60" y="190" width="40" height="20" rx="6" fill="url(#rBand)" stroke="#10141f" stroke-width="3"/>
  </svg>`;
}

export function makeJet() {
  return `<svg id="vehicle-svg" width="240" viewBox="0 0 240 165" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="b2top" x1="120" y1="8" x2="120" y2="110" gradientUnits="userSpaceOnUse">
        <stop stop-color="#3d4250"/><stop offset=".6" stop-color="#22262f"/><stop offset="1" stop-color="#141720"/>
      </linearGradient>
      <linearGradient id="b2mid" x1="60" y1="60" x2="180" y2="80" gradientUnits="userSpaceOnUse">
        <stop stop-color="#2a2f3c"/><stop offset="1" stop-color="#1a1d26"/>
      </linearGradient>
      <linearGradient id="b2glow" x1="120" y1="0" x2="120" y2="80" gradientUnits="userSpaceOnUse">
        <stop stop-color="#4a9eff" stop-opacity=".15"/><stop offset="1" stop-color="#4a9eff" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="engineGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ff8800" stop-opacity=".7"/>
        <stop offset="100%" stop-color="#ff4400" stop-opacity="0"/>
      </radialGradient>
      <filter id="b2shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#4a9eff" flood-opacity="0.3"/>
      </filter>
    </defs>

    <path d="M 120 8 C 95 22, 30 52, 4 74 L 8 82 Q 30 96, 52 90 L 70 106 L 84 92 L 102 108 L 112 96 L 120 102 L 128 96 L 138 108 L 156 92 L 170 106 Q 192 90, 218 82 L 232 74 C 210 52, 145 22, 120 8Z"
          fill="url(#b2glow)" filter="url(#b2shadow)"/>

    <path d="M 120 8
             C 96 22, 32 52, 5 74
             L 5 82
             Q 22 95, 44 89
             L 62 106
             L 76 91
             L 95 109
             L 110 96
             L 120 102
             L 130 96
             L 145 109
             L 164 91
             L 178 106
             Q 200 90, 218 82
             L 235 74
             C 208 52, 144 22, 120 8Z"
          fill="url(#b2top)"/>

    <path d="M 120 12 C 108 24, 88 42, 78 58 Q 98 54, 120 52 Q 142 54, 162 58 C 152 42, 132 24, 120 12Z"
          fill="url(#b2mid)"/>

    <path d="M 120 8 C 96 22, 32 52, 5 74 C 32 64, 96 34, 120 20 C 144 34, 208 64, 235 74 C 208 52, 144 22, 120 8Z"
          fill="rgba(255,255,255,0.055)"/>

    <rect x="92"  y="76" width="20" height="9" rx="3" fill="#0a0c10"/>
    <rect x="128" y="76" width="20" height="9" rx="3" fill="#0a0c10"/>
    <rect x="93"  y="81" width="18" height="4" rx="2" fill="rgba(255,130,0,0.45)"/>
    <rect x="129" y="81" width="18" height="4" rx="2" fill="rgba(255,130,0,0.45)"/>

    <line x1="120" y1="8" x2="120" y2="102" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    <path d="M 72 68 Q 120 64, 168 68" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width=".8"/>
    <path d="M 44 80 Q 120 76, 196 80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width=".8"/>

    <polyline points="44,89 62,106 76,91 95,109 110,96 120,102 130,96 145,109 164,91 178,106 196,90"
              fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.2" stroke-linejoin="round"/>

    <circle cx="6"   cy="79" r="3.5" fill="#ff3333" opacity=".9"/>
    <circle cx="234" cy="79" r="3.5" fill="#33ff66" opacity=".9"/>
    <circle cx="6"   cy="79" r="7"   fill="#ff3333" opacity=".2"/>
    <circle cx="234" cy="79" r="7"   fill="#33ff66" opacity=".2"/>

    <path d="M 120 8 C 96 22, 32 52, 5 74 L 8 76 C 35 54, 97 25, 120 13 C 143 25, 205 54, 232 76 L 235 74 C 208 52, 144 22, 120 8Z"
          fill="rgba(80,140,255,0.05)"/>
  </svg>`;
}

export function makeUFO() {
  return `<svg id="vehicle-svg" width="220" viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="uDiskTop" x1="30" y1="140" x2="170" y2="140" gradientUnits="userSpaceOnUse">
        <stop stop-color="#f4f2fb"/><stop offset=".5" stop-color="#d9d5ec"/><stop offset="1" stop-color="#b8b2d9"/>
      </linearGradient>
      <linearGradient id="uBand" x1="25" y1="148" x2="175" y2="148" gradientUnits="userSpaceOnUse">
        <stop stop-color="#5a6377"/><stop offset="1" stop-color="#2c313e"/>
      </linearGradient>
      <radialGradient id="uDome" cx="38%" cy="22%" r="85%">
        <stop offset="0%" stop-color="#eafffd"/><stop offset="35%" stop-color="#8fe6de"/><stop offset="70%" stop-color="#3fb8ae"/><stop offset="100%" stop-color="#1f8078"/>
      </radialGradient>
      <radialGradient id="uBall" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#ffe9a8"/><stop offset="60%" stop-color="#ffb938"/><stop offset="100%" stop-color="#d98f12"/>
      </radialGradient>
      <linearGradient id="uBeamOuter" x1="100" y1="180" x2="100" y2="250" gradientUnits="userSpaceOnUse">
        <stop stop-color="#7dffe0" stop-opacity=".7"/><stop offset="1" stop-color="#d4ff9e" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <g class="vehicle-flame">
      <path d="M76 186 L124 186 L154 246 L46 246Z" fill="url(#uBeamOuter)"/>
    </g>

    <g class="ufo-body-spin">
      <path d="M4 142 Q100 76 196 142 Q100 172 4 142Z" fill="url(#uDiskTop)" stroke="#2a1810" stroke-width="3" stroke-linejoin="round"/>
      <path d="M18 150 Q100 174 182 150 Q100 194 18 150Z" fill="url(#uBand)" stroke="#2a1810" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="59" cy="159" rx="15" ry="9" fill="url(#uBall)" stroke="#2a1810" stroke-width="2.5"/>
      <ellipse cx="141" cy="159" rx="15" ry="9" fill="url(#uBall)" stroke="#2a1810" stroke-width="2.5"/>
    </g>

    <circle cx="100" cy="174" r="16" fill="url(#uBall)" stroke="#2a1810" stroke-width="3"/>

    <path d="M62 118 Q62 54 100 47 Q138 54 138 118Z" fill="url(#uDome)" stroke="#2a1810" stroke-width="3"/>
    <path d="M78 90 Q79 61 97 53 Q85 65 84 87Z" fill="rgba(255,255,255,0.55)"/>
    <ellipse cx="115" cy="67" rx="6.5" ry="10" fill="rgba(255,255,255,0.3)" transform="rotate(18 115 67)"/>
  </svg>`;
}

export const VEHICLES = {
  rocket: { fn: makeRocket, anim: 'hovering', label: 'Roket' },
  jet:    { fn: makeJet,    anim: 'hovering', label: 'Jet' },
  ufo:    { fn: makeUFO,    anim: 'wobbling', label: 'UFO' },
};
