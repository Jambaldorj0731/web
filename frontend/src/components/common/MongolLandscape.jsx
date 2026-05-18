export const MongolLandscape = () => (
  <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="lsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#050E20"/><stop offset="50%" stopColor="#0F2040"/><stop offset="80%" stopColor="#1A3A6A"/><stop offset="100%" stopColor="#2A5090"/></linearGradient>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#C8D8F0" stopOpacity=".5"/><stop offset="100%" stopColor="#4080CC" stopOpacity="0"/></radialGradient>
      <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0A1830"/><stop offset="100%" stopColor="#050E20"/></linearGradient>
      <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0F2040"/><stop offset="100%" stopColor="#080F1A"/></linearGradient>
      <linearGradient id="steppe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0A1828"/><stop offset="100%" stopColor="#050A12"/></linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#lsky)"/>
    <circle cx="80" cy="40" r="1.2" fill="#E0ECFF" opacity=".85"/>
    <circle cx="170" cy="25" r=".9" fill="#E0ECFF" opacity=".7"/>
    <circle cx="280" cy="55" r="1.4" fill="#E0ECFF" opacity=".9"/>
    <circle cx="400" cy="20" r="1" fill="#E0ECFF" opacity=".65"/>
    <circle cx="510" cy="45" r="1.2" fill="#E0ECFF" opacity=".8"/>
    <circle cx="620" cy="30" r=".9" fill="#E0ECFF" opacity=".75"/>
    <circle cx="710" cy="60" r="1.2" fill="#E0ECFF" opacity=".7"/>
    <circle cx="360" cy="75" r="1" fill="#E0ECFF" opacity=".7"/>
    <circle cx="600" cy="90" r="36" fill="#C8D8F0" opacity=".9"/>
    <circle cx="618" cy="80" r="29" fill="#0F2040"/>
    <circle cx="600" cy="90" r="55" fill="url(#moonGlow)" opacity=".6"/>
    <text x="400" y="310" fontSize="180" fill="#3060A0" opacity=".06" textAnchor="middle" fontFamily="serif">ᠰ</text>
    <polygon points="0,420 90,295 180,330 270,270 360,315 450,260 540,300 640,278 720,295 800,270 800,440 0,440" fill="url(#mtn1)"/>
    <polygon points="0,460 60,380 140,410 240,360 340,400 440,362 540,390 640,368 740,382 800,365 800,470 0,470" fill="url(#mtn2)"/>
    <rect x="0" y="458" width="800" height="142" fill="url(#steppe)"/>
    <path d="M110,464 Q155,428 200,464 Z" fill="#243050" opacity=".9"/>
    <rect x="128" y="444" width="54" height="20" fill="#1A2840" opacity=".9"/>
    <path d="M530,460 Q572,428 614,460 Z" fill="#243050" opacity=".9"/>
    <rect x="547" y="441" width="48" height="19" fill="#1A2840" opacity=".9"/>
    <g transform="translate(330,452)" opacity=".6">
      <ellipse cx="27" cy="10" rx="30" ry="10" fill="#101828"/>
      <circle cx="52" cy="4" r="8" fill="#101828"/>
      <line x1="10" y1="18" x2="7" y2="33" stroke="#101828" strokeWidth="3.5"/>
      <line x1="22" y1="20" x2="19" y2="35" stroke="#101828" strokeWidth="3.5"/>
      <line x1="34" y1="20" x2="31" y2="35" stroke="#101828" strokeWidth="3.5"/>
      <line x1="46" y1="18" x2="43" y2="33" stroke="#101828" strokeWidth="3.5"/>
      <path d="M0,10 Q-10,0 -4,-10" stroke="#101828" strokeWidth="3" fill="none"/>
      <line x1="52" y1="4" x2="60" y2="-3" stroke="#101828" strokeWidth="3.5"/>
      <circle cx="63" cy="-6" r="5" fill="#101828"/>
    </g>
  </svg>
);