/**
 * Generates placeholder transparent PNGs for hero slides.
 * Run: node scripts/generate-hero-placeholders.mjs
 */
import sharp from "sharp";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dir, "../public/hero");

const shoeSvg = (label) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <radialGradient id="sg" cx="55%" cy="70%" r="50%">
      <stop offset="0%" stop-color="#C8B89A" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#A08060" stop-opacity="0.5"/>
    </radialGradient>
    <filter id="blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6"/>
    </filter>
  </defs>
  <ellipse cx="900" cy="830" rx="420" ry="55" fill="rgba(100,70,40,0.18)" filter="url(#blur)"/>
  <path d="M 350 400 Q 340 350 400 320 Q 500 290 650 300 Q 780 310 850 330 L 1150 390 Q 1280 420 1320 470 Q 1360 520 1340 570 Q 1300 640 1200 680 Q 1050 730 850 750 Q 650 770 500 760 Q 380 750 340 700 Q 300 650 320 570 Q 330 490 350 400 Z" fill="url(#sg)" opacity="0.92"/>
  <path d="M 560 360 Q 680 370 760 400 Q 840 430 860 470" fill="none" stroke="rgba(120,85,50,0.25)" stroke-width="6" stroke-linecap="round"/>
  <path d="M 340 690 Q 330 750 360 790 Q 400 820 460 815 Q 510 810 530 760" fill="rgba(140,95,55,0.6)"/>
  <rect x="650" y="340" width="90" height="28" rx="10" fill="rgba(90,60,30,0.35)"/>
  <text x="800" y="960" font-family="Georgia,serif" font-size="36" fill="rgba(160,120,80,0.5)" text-anchor="middle">${label} - placeholder</text>
</svg>
`;

const slides = [
  { n: 1, label: "Cream Penny Loafer" },
  { n: 2, label: "Dark Teal Boot" },
  { n: 3, label: "Terracotta Mule" },
  { n: 4, label: "Chestnut Ballet Flat" },
];

for (const { n, label } of slides) {
  const svg = Buffer.from(shoeSvg(label));
  const out = resolve(outDir, `hero-${n}.png`);
  await sharp(svg).png().toFile(out);
  console.log("ok hero-" + n + ".png");
}
console.log("All placeholders written.");
