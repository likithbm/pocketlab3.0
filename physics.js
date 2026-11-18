
/*
  POCKETLAB 3.0 — PHYSICS LABORATORY
  Premium neon experiment cards + interactive simulations.

  Keeps existing Physics experiments:
  circuit, advancedCircuit, motion, projectile,
  reflection, floating.

  Adds 14 new interactive Physics experiments.
*/

(() => {
  "use strict";

  const $ = s => document.querySelector(s);
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));

  const experiments = [
    {
      id:"kirchhoff",
      name:"Kirchhoff's Laws",
      icon:"⚡",
      type:"circuit",
      description:"Explore current conservation at a junction.",
      controls:[
        ["Current entering","incoming",0,20,8,.5],
        ["Branch 1 current","branch",0,20,3,.5]
      ],
      calculate(v) {
        const remaining = v.incoming-v.branch;
        return {
          main:`I₂ = ${remaining.toFixed(2)} A`,
          values:[
            ["Incoming",`${v.incoming} A`],
            ["Branch 1",`${v.branch} A`],
            ["Branch 2",`${remaining.toFixed(2)} A`]
          ],
          explanation:
            "Kirchhoff's Current Law states that the algebraic sum of currents at a junction is zero. I₁ + I₂ = Iin. A negative result means the assumed branch-current direction is reversed."
        };
      }
    },
    {
      id:"thevenin",
      name:"Thevenin's Theorem",
      icon:"🔋",
      type:"circuit",
      description:"Replace a linear network with its equivalent voltage source and resistance.",
      controls:[
        ["Equivalent voltage","voltage",0,24,12,1],
        ["Equivalent resistance","resistance",1,30,4,1],
        ["Load resistance","load",1,30,8,1]
      ],
      calculate(v) {
        const i=v.voltage/(v.resistance+v.load);
        return {
          main:`Load current: ${i.toFixed(2)} A`,
          values:[
            ["Current",`${i.toFixed(2)} A`],
            ["Load voltage",`${(i*v.load).toFixed(2)} V`],
            ["Load power",`${(i*i*v.load).toFixed(2)} W`]
          ],
          explanation:
            "A linear two-terminal circuit can be represented by a Thevenin voltage source in series with an equivalent resistance. I = Vth / (Rth + RL)."
        };
      }
    },
    {
      id:"capacitor",
      name:"Capacitor Charging",
      icon:"🔌",
      type:"curve",
      description:"Observe how a capacitor charges through a resistor.",
      controls:[
        ["Supply voltage","voltage",1,24,9,1],
        ["Resistance (kΩ)","resistance",1,20,5,1],
        ["Capacitance (µF)","capacitance",10,1000,220,10],
        ["Elapsed time (s)","time",0,20,3,.1]
      ],
      calculate(v) {
        const tau=v.resistance*1000*v.capacitance/1e6;
        const vc=v.voltage*(1-Math.exp(-v.time/tau));
        return {
          main:`Capacitor: ${vc.toFixed(2)} V`,
          values:[
            ["Time constant",`${tau.toFixed(2)} s`],
            ["Voltage",`${vc.toFixed(2)} V`],
            ["Charge",`${(vc*v.capacitance).toFixed(1)} µC`]
          ],
          explanation:
            "During RC charging, capacitor voltage follows Vc = Vs(1 − e^(−t/RC)). One time constant reaches approximately 63.2% of the supply voltage."
        };
      }
    },
    {
      id:"rl",
      name:"RL Circuit",
      icon:"🌀",
      type:"curve",
      description:"Study current growth in a resistor-inductor circuit.",
      controls:[
        ["Voltage","voltage",1,24,12,1],
        ["Resistance","resistance",1,30,6,1],
        ["Inductance (H)","inductance",.1,10,2,.1],
        ["Time (s)","time",0,10,1,.1]
      ],
      calculate(v) {
        const tau=v.inductance/v.resistance;
        const i=v.voltage/v.resistance*
          (1-Math.exp(-v.time/tau));
        return {
          main:`Current: ${i.toFixed(2)} A`,
          values:[
            ["Time constant",`${tau.toFixed(2)} s`],
            ["Current",`${i.toFixed(2)} A`],
            ["Resistor voltage",`${(i*v.resistance).toFixed(2)} V`]
          ],
          explanation:
            "An inductor opposes changes in current. For a DC step, I(t) = (V/R)(1 − e^(−Rt/L)). The time constant is L/R."
        };
      }
    },
    {
      id:"rc",
      name:"RC Discharging",
      icon:"📉",
      type:"curve",
      description:"Explore exponential capacitor discharge.",
      controls:[
        ["Initial voltage","voltage",1,24,12,1],
        ["Resistance (kΩ)","resistance",1,20,5,1],
        ["Capacitance (µF)","capacitance",10,1000,220,10],
        ["Time (s)","time",0,20,3,.1]
      ],
      calculate(v) {
        const tau=v.resistance*1000*v.capacitance/1e6;
        const vc=v.voltage*Math.exp(-v.time/tau);
        return {
          main:`Remaining voltage: ${vc.toFixed(2)} V`,
          values:[
            ["Time constant",`${tau.toFixed(2)} s`],
            ["Voltage",`${vc.toFixed(2)} V`],
            ["Charge",`${(vc*v.capacitance).toFixed(1)} µC`]
          ],
          explanation:
            "A discharging capacitor follows Vc = V₀e^(−t/RC). Its voltage falls to approximately 36.8% after one time constant."
        };
      }
    },
    {
      id:"ac",
      name:"AC Circuit",
      icon:"〰️",
      type:"wave",
      description:"Visualize alternating voltage and frequency.",
      controls:[
        ["Peak voltage","voltage",1,30,12,1],
        ["Frequency (Hz)","frequency",1,100,50,1],
        ["Time (ms)","time",0,100,5,1]
      ],
      calculate(v) {
        const instantaneous=v.voltage*
          Math.sin(2*Math.PI*v.frequency*v.time/1000);
        return {
          main:`Instant voltage: ${instantaneous.toFixed(2)} V`,
          values:[
            ["Peak",`${v.voltage} V`],
            ["RMS",`${(v.voltage/Math.sqrt(2)).toFixed(2)} V`],
            ["Period",`${(1000/v.frequency).toFixed(2)} ms`]
          ],
          explanation:
            "A sinusoidal AC source follows v(t) = Vpeak sin(2πft). Its RMS voltage equals Vpeak / √2."
        };
      }
    },
    {
      id:"induction",
      name:"Electromagnetic Induction",
      icon:"🧲",
      type:"magnet",
      description:"Move a magnet relative to a coil to generate an induced voltage.",
      controls:[
        ["Magnetic field (T)","field",.1,2,.8,.1],
        ["Coil turns","turns",10,200,80,10],
        ["Field-change rate (T/s)","rate",-2,2,.5,.1],
        ["Coil area (cm²)","area",1,100,20,1]
      ],
      calculate(v) {
        const emf=-v.turns*v.area/10000*v.rate;
        return {
          main:`Induced EMF: ${emf.toFixed(3)} V`,
          values:[
            ["Turns",`${v.turns}`],
            ["Field",`${v.field} T`],
            ["EMF",`${emf.toFixed(3)} V`]
          ],
          explanation:
            "Faraday's law: EMF = −N dΦ/dt. Here the field changes uniformly through a fixed coil. The negative sign represents Lenz's law."
        };
      }
    },
    {
      id:"photoelectric",
      name:"Photoelectric Effect",
      icon:"☀️",
      type:"particles",
      description:"Investigate electrons emitted by incident light.",
      controls:[
        ["Light frequency (×10¹⁴ Hz)","frequency",2,15,8,.5],
        ["Work function (eV)","work",1,5,2.3,.1],
        ["Light intensity (%)","intensity",0,100,60,5]
      ],
      calculate(v) {
        const photon=4.135667696e-15*v.frequency*1e14;
        const energy=Math.max(0,photon-v.work);
        const emitted=photon>=v.work && v.intensity>0;
        return {
          main:emitted
            ? `Electron energy: ${energy.toFixed(2)} eV`
            : "No photoelectrons emitted",
          values:[
            ["Photon energy",`${photon.toFixed(2)} eV`],
            ["Work function",`${v.work} eV`],
            ["Emission",emitted?"YES":"NO"]
          ],
          explanation:
            "The photoelectric effect follows Kmax = hf − φ. Light must exceed the threshold frequency. Above threshold, intensity affects electron count, not maximum kinetic energy."
        };
      }
    },
    {
      id:"thermal",
      name:"Thermal Expansion",
      icon:"🌡️",
      type:"thermal",
      description:"Observe how a metal rod expands with temperature.",
      controls:[
        ["Original length (m)","length",1,10,5,.5],
        ["Temperature change (°C)","temperature",0,300,100,10],
        ["Expansion coefficient (×10⁻⁶/°C)","alpha",5,30,12,1]
      ],
      calculate(v) {
        const change=v.alpha*1e-6*v.length*v.temperature;
        return {
          main:`Expansion: ${(change*1000).toFixed(2)} mm`,
          values:[
            ["Original length",`${v.length} m`],
            ["Expansion",`${(change*1000).toFixed(2)} mm`],
            ["Final length",`${(v.length+change).toFixed(4)} m`]
          ],
          explanation:
            "Linear thermal expansion is ΔL = αL₀ΔT. The material expands as temperature increases."
        };
      }
    },
    {
      id:"pendulum",
      name:"Simple Pendulum",
      icon:"🕰️",
      type:"pendulum",
      description:"Study pendulum oscillations and their period.",
      controls:[
        ["Length (m)","length",.2,5,1.5,.1],
        ["Gravity (m/s²)","gravity",1,20,9.8,.1],
        ["Amplitude (degrees)","angle",5,35,20,1]
      ],
      calculate(v) {
        const period=2*Math.PI*
          Math.sqrt(v.length/v.gravity);
        return {
          main:`Period: ${period.toFixed(2)} s`,
          values:[
            ["Period",`${period.toFixed(2)} s`],
            ["Frequency",`${(1/period).toFixed(2)} Hz`],
            ["Length",`${v.length} m`]
          ],
          explanation:
            "For small oscillations, T ≈ 2π√(L/g). This approximation becomes less accurate at larger amplitudes."
        };
      }
    },
    {
      id:"spring",
      name:"Spring & Hooke's Law",
      icon:"🌀",
      type:"spring",
      description:"Stretch a spring and calculate its restoring force.",
      controls:[
        ["Spring constant (N/m)","k",5,100,30,5],
        ["Extension (cm)","extension",0,50,15,1],
        ["Attached mass (kg)","mass",.1,10,2,.1]
      ],
      calculate(v) {
        const x=v.extension/100;
        const f=v.k*x;
        return {
          main:`Restoring force: ${f.toFixed(2)} N`,
          values:[
            ["Extension",`${v.extension} cm`],
            ["Force",`${f.toFixed(2)} N`],
            ["Energy",`${(.5*v.k*x*x).toFixed(3)} J`]
          ],
          explanation:
            "Hooke's law states F = −kx. The spring stores elastic potential energy U = ½kx² within its elastic limit."
        };
      }
    },
    {
      id:"waves",
      name:"Wave & Sound",
      icon:"🌊",
      type:"wave",
      description:"Explore amplitude, frequency and wavelength.",
      controls:[
        ["Frequency (Hz)","frequency",1,100,20,1],
        ["Amplitude","amplitude",.1,3,1,.1],
        ["Wave speed (m/s)","speed",10,400,340,10]
      ],
      calculate(v) {
        const wavelength=v.speed/v.frequency;
        return {
          main:`Wavelength: ${wavelength.toFixed(2)} m`,
          values:[
            ["Frequency",`${v.frequency} Hz`],
            ["Amplitude",`${v.amplitude}`],
            ["Wavelength",`${wavelength.toFixed(2)} m`]
          ],
          explanation:
            "Wave speed equals frequency multiplied by wavelength: v = fλ. Amplitude controls the size of oscillations."
        };
      }
    },
    {
      id:"newtonCradle",
      name:"Newton's Cradle",
      icon:"⚪",
      type:"cradle",
      description:"Explore momentum and energy transfer during collisions.",
      controls:[
        ["Ball mass (kg)","mass",.1,2,.5,.1],
        ["Release height (cm)","height",1,50,15,1],
        ["Gravity (m/s²)","gravity",1,20,9.8,.1]
      ],
      calculate(v) {
        const speed=Math.sqrt(
          2*v.gravity*v.height/100
        );
        return {
          main:`Impact speed: ${speed.toFixed(2)} m/s`,
          values:[
            ["Momentum",`${(v.mass*speed).toFixed(2)} kg·m/s`],
            ["Energy",`${(v.mass*v.gravity*v.height/100).toFixed(2)} J`],
            ["Speed",`${speed.toFixed(2)} m/s`]
          ],
          explanation:
            "In an ideal Newton's cradle, momentum and kinetic energy are conserved during elastic collisions. Real collisions lose some energy to sound and heat."
        };
      }
    },
    {
      id:"lens",
      name:"Lens & Refraction",
      icon:"🔍",
      type:"lens",
      description:"Explore image formation using a converging lens.",
      controls:[
        ["Focal length (cm)","focal",5,30,10,1],
        ["Object distance (cm)","distance",5,100,30,1],
        ["Object height (cm)","height",1,20,6,1]
      ],
      calculate(v) {
        const delta=v.distance-v.focal;
        const infinity=Math.abs(delta)<.0001;
        const image=infinity
          ? Infinity
          : v.focal*v.distance/delta;
        const magnification=infinity
          ? Infinity
          : -image/v.distance;
        return {
          main:infinity
            ? "Image at infinity"
            : `Image distance: ${image.toFixed(2)} cm`,
          values:[
            ["Image",infinity?"∞":`${image.toFixed(2)} cm`],
            ["Magnification",infinity?"∞":magnification.toFixed(2)+"×"],
            ["Type",infinity?"At infinity":image>0?"Real":"Virtual"]
          ],
          explanation:
            "For a thin converging lens, 1/f = 1/u + 1/v using positive object distance u and signed image distance v. Negative v indicates a virtual image."
        };
      }
    }
  ];

  // -----------------------------------
  // PREMIUM DESIGN
  // -----------------------------------

  const style=document.createElement("style");
  style.textContent=`
    #laboratory .experiment-grid {
      display:grid!important;
      grid-template-columns:repeat(4,minmax(0,1fr))!important;
      gap:15px!important;
    }

    #laboratory .experiment-card {
      position:relative;
      min-width:0;
      overflow:hidden;
      background:linear-gradient(145deg,#142740,#091528)!important;
      border:1px solid #30577d!important;
      border-radius:15px!important;
      padding:15px!important;
      box-shadow:inset 0 1px rgba(255,255,255,.05),
                 0 8px 20px rgba(0,0,0,.18);
      transition:transform .2s,border-color .2s,box-shadow .2s;
    }

    #laboratory .experiment-card:hover {
      transform:translateY(-4px);
      border-color:#51baff!important;
      box-shadow:0 0 22px rgba(42,151,255,.22);
    }

    #laboratory .experiment-card h3 {
      font-size:15px!important;
      line-height:1.4!important;
    }

    #laboratory .experiment-card p {
      font-size:12px!important;
      line-height:1.5!important;
    }

    #laboratory .experiment-btn,
    .phy-start {
      background:linear-gradient(135deg,#188bff,#2257d8)!important;
      border:1px solid #58b5ff!important;
      border-radius:9px!important;
      color:white!important;
      padding:9px 13px!important;
      font-size:12px!important;
      font-weight:800!important;
      cursor:pointer;
      box-shadow:0 0 12px rgba(0,136,255,.3);
    }

    .phy-preview {
      height:125px;
      margin:8px 0 12px;
      border-radius:11px;
      background:radial-gradient(ellipse at center,
        #153e60,#071225 75%);
      border:1px solid #254867;
      overflow:hidden;
    }

    .phy-preview svg {
      width:100%;
      height:100%;
      display:block;
    }

    .phy-card-head {
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:8px;
    }

    .phy-card-head span {
      font-size:22px;
    }

    .phy-card-head small {
      color:#6feac5;
      font-size:9px;
      font-weight:bold;
    }

    .phy-card-foot {
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:6px;
      margin-top:13px;
    }

    .phy-card-foot small {
      color:#9ab1d0;
      font-size:10px;
    }

    .phy-stage {
      position:relative;
      min-height:360px;
      border-radius:15px;
      overflow:hidden;
      background:radial-gradient(ellipse at center,
        #133757,#071325 75%);
      border:1px solid #2c537a;
    }

    .phy-stage svg {
      display:block;
      width:100%;
      height:360px;
    }

    .phy-stage-label {
      position:absolute;
      left:16px;
      top:14px;
      color:#68e5ff;
      font-size:11px;
      font-weight:bold;
      letter-spacing:1px;
    }

    .phy-readout {
      margin-top:14px;
      text-align:center;
      font-size:25px;
      font-weight:900;
      color:#66eaff;
    }

    .phy-controls label {
      display:block;
      margin:17px 0;
      color:#dbe9fb;
      font-size:13px;
      font-weight:600;
    }

    .phy-controls input {
      display:block;
      width:100%;
      margin-top:11px;
      accent-color:#498cff;
    }

    .phy-controls output {
      color:#66eaff;
      float:right;
    }

    .phy-results {
      display:grid;
      gap:8px;
    }

    .phy-results div {
      display:flex;
      justify-content:space-between;
      gap:8px;
      border-bottom:1px solid #29425f;
      padding:9px 0;
    }

    .phy-results strong {
      color:#65eaff;
    }

    .phy-tools {
      display:flex;
      gap:8px;
      justify-content:center;
      margin:12px 0;
    }

    .phy-tools button {
      padding:8px 14px;
      border-radius:8px;
      border:1px solid #4278ac;
      background:#193d63;
      color:white;
      cursor:pointer;
    }

    .phy-scene-group {
      transform-origin:50% 50%;
      transition:transform .2s;
    }

    .phy-pulse {
      animation:phyPulse 1.5s infinite alternate;
    }

    @keyframes phyPulse {
      from {opacity:.35}
      to {opacity:1}
    }

    .phy-travel {
      stroke-dasharray:9 12;
      animation:phyTravel 1s linear infinite;
    }

    @keyframes phyTravel {
      to {stroke-dashoffset:-42}
    }

    .phy-swing {
      transform-origin:240px 65px;
      animation:phySwing 2s ease-in-out infinite alternate;
    }

    @keyframes phySwing {
      from {transform:rotate(-23deg)}
      to {transform:rotate(23deg)}
    }

    .phy-wave-line {
      animation:phyTravel 2s linear infinite;
    }

    @media(max-width:1250px) {
      #laboratory .experiment-grid {
        grid-template-columns:repeat(3,minmax(0,1fr))!important;
      }
    }

    @media(max-width:900px) {
      #laboratory .experiment-grid {
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
      }
    }

    @media(max-width:520px) {
      #laboratory .experiment-grid {
        grid-template-columns:1fr!important;
      }
    }
  `;
  document.head.appendChild(style);

  // -----------------------------------
  // SVG VISUALS
  // -----------------------------------

  function svg(type,v={},time=0) {
    const glow=`
      <defs>
        <filter id="phyGlow">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="phyMetal" x2="1" y2="1">
          <stop stop-color="#e1f1ff"/>
          <stop offset=".5" stop-color="#5c829e"/>
          <stop offset="1" stop-color="#243f5d"/>
        </linearGradient>
      </defs>
    `;

    let content="";

    if(type==="circuit") {
      content=`
        <path d="M80 110 H395 V250 H80 Z"
          fill="none" stroke="#ff653c"
          stroke-width="7" stroke-linejoin="round"
          filter="url(#phyGlow)"/>
        <path d="M80 110 H395 V250 H80 Z"
          fill="none" stroke="#fff0ad"
          stroke-width="2" class="phy-travel"/>
        <rect x="56" y="153" width="48" height="55"
          rx="7" fill="#f5822d" stroke="#ffda91"
          stroke-width="3"/>
        <text x="80" y="186" text-anchor="middle"
          fill="white" font-size="20">+</text>
        <rect x="215" y="96" width="75" height="27"
          rx="12" fill="#c7ddf5"/>
        <path d="M229 96 v27 M244 96 v27 M259 96 v27"
          stroke="#e27845" stroke-width="8"/>
        <circle cx="395" cy="180" r="33"
          fill="#ffbd35" opacity=".2"
          filter="url(#phyGlow)" class="phy-pulse"/>
        <circle cx="395" cy="180" r="24"
          fill="#ffe8a0" stroke="#ffb327"
          stroke-width="4" filter="url(#phyGlow)"/>
        <text x="240" y="68" text-anchor="middle"
          fill="#c9e7ff" font-size="18">
          ELECTRIC NETWORK
        </text>
      `;
    }

    if(type==="curve") {
      const points=Array.from({length:90},(_,i)=>{
        const x=55+i*4.25;
        const y=245-155*(1-Math.exp(-i/24));
        return `${x},${y}`;
      }).join(" ");

      content=`
        <path d="M55 65 V250 H445"
          fill="none" stroke="#7b9cb8"
          stroke-width="3"/>
        <polyline points="${points}"
          fill="none" stroke="#5ae7ff"
          stroke-width="5" filter="url(#phyGlow)"/>
        <path d="M55 100 H445 M55 175 H445"
          stroke="#33536f" stroke-dasharray="6 8"/>
        <text x="250" y="45" fill="#d6efff"
          font-size="18" text-anchor="middle">
          EXPONENTIAL RESPONSE
        </text>
        <circle cx="${55+(time%90)*4.25}"
          cy="${245-155*(1-Math.exp(-(time%90)/24))}"
          r="9" fill="#fff0a3" filter="url(#phyGlow)"/>
      `;
    }

    if(type==="wave") {
      const amp=clamp(v.amplitude||1,.1,3);
      const points=Array.from({length:180},(_,i)=>{
        const x=35+i*2.4;
        const y=180-Math.sin(i*.12-time*.08)*
          (25+amp*18);
        return `${x},${y}`;
      }).join(" ");

      content=`
        <path d="M30 180 H465"
          stroke="#355e83" stroke-width="2"
          stroke-dasharray="6 8"/>
        <polyline points="${points}"
          fill="none" stroke="#55e5ff"
          stroke-width="5" filter="url(#phyGlow)"/>
        <text x="250" y="80" text-anchor="middle"
          fill="#d9f5ff" font-size="19">
          OSCILLATING WAVE
        </text>
      `;
    }

    if(type==="pendulum") {
      content=`
        <path d="M170 65 H310"
          stroke="#8fc7ed" stroke-width="12"
          stroke-linecap="round"/>
        <path d="M180 65 V300 M300 65 V300"
          stroke="#56758d" stroke-width="10"/>
        <g class="phy-swing">
          <path d="M240 65 V238"
            stroke="#e0f4ff" stroke-width="4"/>
          <circle cx="240" cy="250" r="24"
            fill="#ffc53c" stroke="#ffe7a0"
            stroke-width="4" filter="url(#phyGlow)"/>
        </g>
        <circle cx="240" cy="65" r="8"
          fill="#b8d5e8"/>
      `;
    }

    if(type==="magnet") {
      content=`
        <rect x="65" y="138" width="140" height="65"
          rx="8" fill="#e94f56"/>
        <rect x="135" y="138" width="70" height="65"
          rx="6" fill="#258fe0"/>
        <text x="98" y="180" fill="white"
          font-size="26">N</text>
        <text x="168" y="180" fill="white"
          font-size="26">S</text>
        <path d="M215 170 H268" stroke="#80dfff"
          stroke-width="5" stroke-dasharray="8 9"
          class="phy-travel"/>
        ${Array.from({length:11},(_,i)=>`
          <ellipse cx="${286+i*12}" cy="170"
            rx="10" ry="65" fill="none"
            stroke="#ffae48" stroke-width="5"
            filter="url(#phyGlow)"/>
        `).join("")}
        <text x="350" y="275" text-anchor="middle"
          fill="#d6ecff" font-size="17">
          COPPER COIL
        </text>
      `;
    }

    if(type==="spring") {
      const pts=[];
      for(let i=0;i<=30;i++) {
        pts.push(
          `${240+Math.sin(i*Math.PI)*42},
          ${60+i*6.5}`
        );
      }
      content=`
        <rect x="160" y="45" width="160" height="16"
          rx="5" fill="url(#phyMetal)"/>
        <path d="M240 60 ${Array.from({length:22},
          (_,i)=>`L${i%2?285:195} ${70+i*8}`
        ).join(" ")} L240 245"
          fill="none" stroke="#8de5ff"
          stroke-width="7" filter="url(#phyGlow)"/>
        <rect x="190" y="245" width="100" height="65"
          rx="10" fill="#487ce5"
          stroke="#b5dfff" stroke-width="3"/>
      `;
    }

    if(type==="thermal") {
      content=`
        <rect x="80" y="120" width="320" height="45"
          rx="12" fill="url(#phyMetal)"
          stroke="#b6ddff" stroke-width="3"/>
        <rect x="65" y="155" width="38" height="110"
          fill="#6588a4"/>
        <rect x="377" y="155" width="38" height="110"
          fill="#6588a4"/>
        <path d="M240 275 Q205 230 235 205
          Q250 188 250 173
          Q285 205 267 235
          Q300 255 260 292 Z"
          fill="#ff9d20" filter="url(#phyGlow)"
          class="phy-pulse"/>
        <path d="M80 85 H400"
          stroke="#73e8ff" stroke-width="3"/>
        <text x="240" y="67" text-anchor="middle"
          fill="#e0f4ff" font-size="18">
          ΔL = αL₀ΔT
        </text>
      `;
    }

    if(type==="particles") {
      content=`
        <rect x="125" y="225" width="245" height="26"
          rx="7" fill="url(#phyMetal)"/>
        ${Array.from({length:5},(_,i)=>`
          <path d="M${85+i*35} 65
            L${165+i*30} 220"
            stroke="#ffe069" stroke-width="4"
            filter="url(#phyGlow)"
            class="phy-pulse"/>
        `).join("")}
        ${Array.from({length:8},(_,i)=>`
          <circle cx="${150+i*30}"
            cy="${125+(i%3)*24}"
            r="7" fill="#5deaff"
            filter="url(#phyGlow)"/>
        `).join("")}
        <text x="250" y="310" text-anchor="middle"
          fill="#cfe9ff" font-size="18">
          PHOTOELECTRIC EMISSION
        </text>
      `;
    }

    if(type==="cradle") {
      content=`
        <path d="M100 75 H400"
          stroke="#b1d9ef" stroke-width="12"/>
        ${Array.from({length:5},(_,i)=>`
          <path d="M${160+i*40} 80
            L${160+i*40} 220"
            stroke="#b6d5e8" stroke-width="3"/>
          <circle cx="${160+i*40}" cy="240"
            r="22" fill="url(#phyMetal)"
            stroke="#d4f0ff" stroke-width="3"/>
        `).join("")}
        <circle cx="${120+Math.sin(time*.1)*30}"
          cy="205" r="22" fill="#ffbe42"
          filter="url(#phyGlow)"/>
      `;
    }

    if(type==="lens") {
      content=`
        <path d="M245 55 Q205 180 245 305
          Q285 180 245 55 Z"
          fill="#54cfff" fill-opacity=".3"
          stroke="#a4ecff" stroke-width="4"/>
        <path d="M35 180 H460"
          stroke="#7697b8" stroke-dasharray="8 8"/>
        <path d="M65 260 V105"
          stroke="#ffac56" stroke-width="8"/>
        <path d="M65 105 L55 124 M65 105 L75 124"
          stroke="#ffac56" stroke-width="6"/>
        <path d="M65 105 H245 L425 250"
          fill="none" stroke="#ffe46d"
          stroke-width="4" filter="url(#phyGlow)"/>
        <path d="M65 105 L245 180 L425 250"
          fill="none" stroke="#ffe46d"
          stroke-width="3"/>
      `;
    }

    return `
      <svg viewBox="0 0 500 360"
        xmlns="http://www.w3.org/2000/svg"
        role="img" aria-label="Animated physics diagram">
        ${glow}
        <g class="phy-scene-group">
          ${content}
        </g>
      </svg>
    `;
  }

  // -----------------------------------
  // EXPERIMENT CARDS
  // -----------------------------------

  function makeCard(exp) {
    const card=document.createElement("article");
    card.className="experiment-card phy-new";
    card.dataset.category="physics";
    card.dataset.recommended=
      "middle secondary senior college";

    card.innerHTML=`
      <div class="phy-card-head">
        <span>${exp.icon}</span>
        <small>● INTERACTIVE</small>
      </div>

      <div class="phy-preview">
        ${svg(exp.type)}
      </div>

      <h3>${exp.name}</h3>
      <p>${exp.description}</p>

      <div class="phy-card-foot">
        <small>Physics · Virtual Lab</small>
        <button class="phy-start"
          data-physics-launch="${exp.id}">
          ▶ Start
        </button>
      </div>
    `;

    return card;
  }

  // -----------------------------------
  // ACTIVE SIMULATION
  // -----------------------------------

  let active=null;

  function launch(exp) {
    const workspace=$("#experimentWorkspace");
    if(!workspace) return;

    active={
      exp,
      time:0,
      playing:true,
      zoom:1,
      frame:0,
      last:0
    };

    $("#activeExperimentTitle").textContent=exp.name;
    $("#activeExperimentDescription").textContent=
      exp.description;

    $("#simulationCanvas").innerHTML=`
      <div class="phy-stage">
        <div class="phy-stage-label">
          POCKETLAB 3.0 · PHYSICS LAB
        </div>
        <div id="phyScene"></div>
      </div>
      <div class="phy-readout" id="phyReading"></div>
      <div class="phy-tools">
        <button id="phyPlay">⏸ Pause</button>
        <button id="phyZoomIn">＋ Zoom</button>
        <button id="phyZoomOut">－ Zoom</button>
        <button id="phyReset">↺ Reset</button>
      </div>
    `;

    const controls=$("#experimentControls");

    controls.innerHTML=`
      <div class="phy-controls">
        ${exp.controls.map(([name,key,min,max,def,step])=>`
          <label>
            ${name}
            <output id="phyOut_${key}">${def}</output>
            <input type="range"
              id="phy_${key}"
              min="${min}"
              max="${max}"
              step="${step}"
              value="${def}">
          </label>
        `).join("")}
      </div>
    `;

    $("#experimentResults").innerHTML=
      '<div class="phy-results" id="phyResults"></div>';

    $("#experimentExplanation").textContent=
      exp.calculate(defaultValues(exp)).explanation;

    // Preserve existing app navigation.
    if(typeof navigate==="function") {
      navigate("experimentWorkspace");
    } else {
      document.querySelectorAll(".page")
        .forEach(page=>page.classList.remove("active"));
      workspace.classList.add("active");
    }

    controls.querySelectorAll("input")
      .forEach(input=>{
        input.addEventListener("input",render);
      });

    $("#phyPlay").onclick=()=>{
      active.playing=!active.playing;
      $("#phyPlay").textContent=active.playing
        ?"⏸ Pause":"▶ Play";
    };

    $("#phyZoomIn").onclick=()=>{
      active.zoom=clamp(active.zoom+.1,.6,1.8);
      render();
    };

    $("#phyZoomOut").onclick=()=>{
      active.zoom=clamp(active.zoom-.1,.6,1.8);
      render();
    };

    $("#phyReset").onclick=()=>{
      exp.controls.forEach(c=>{
        $("#phy_"+c[1]).value=c[4];
      });
      active.time=0;
      active.zoom=1;
      render();
    };

    render();

    // SVG animation loop
    const state=active;

    function tick(now) {
      if(active!==state) return;
      if(!workspace.classList.contains("active")) return;

      if(!state.last) state.last=now;

      const dt=Math.min((now-state.last)/1000,.05);
      state.last=now;

      if(state.playing) {
        state.time+=dt;
        updateScene();
      }

      state.frame=requestAnimationFrame(tick);
    }

    state.frame=requestAnimationFrame(tick);
  }

  function defaultValues(exp) {
    const values={};
    exp.controls.forEach(c=>{
      values[c[1]]=c[4];
    });
    return values;
  }

  function currentValues() {
    const values={};
    if(!active) return values;

    active.exp.controls.forEach(c=>{
      values[c[1]]=Number(
        $("#phy_"+c[1])?.value??c[4]
      );
    });

    return values;
  }

  function updateScene() {
    if(!active) return;

    const scene=$("#phyScene");
    if(!scene) return;

    const values=currentValues();

    // Update animated diagrams.
    // Throttle DOM redraw to about 20 FPS.
    const frame=Math.floor(active.time*20);

    if(active.lastSceneFrame===frame) return;
    active.lastSceneFrame=frame;

    scene.innerHTML=svg(
      active.exp.type,
      values,
      active.time*30
    );

    const group=scene.querySelector(
      ".phy-scene-group"
    );

    if(group) {
      group.style.transform=
        `scale(${active.zoom})`;
    }
  }

  function render() {
    if(!active) return;

    const values=currentValues();
    const result=active.exp.calculate(values);

    active.exp.controls.forEach(c=>{
      const output=$("#phyOut_"+c[1]);
      if(output) output.textContent=values[c[1]];
    });

    const reading=$("#phyReading");
    if(reading) reading.textContent=result.main;

    const results=$("#phyResults");

    if(results) {
      results.innerHTML=result.values.map(
        ([name,val])=>`
          <div>
            <span>${name}</span>
            <strong>${val}</strong>
          </div>
        `
      ).join("");
    }

    $("#experimentExplanation").textContent=
      result.explanation;

    active.lastSceneFrame=-1;
    updateScene();
  }

  // -----------------------------------
  // KEEP EXISTING EXPERIMENTS
  // -----------------------------------

  function upgradeExistingCards() {
    const cards=[
      ...document.querySelectorAll(
        '#laboratory .experiment-card[data-category="physics"]'
      )
    ];

    cards.forEach(card=>{
      if(card.querySelector(".phy-preview")) return;

      const key=card.querySelector(
        "[data-experiment]"
      )?.dataset.experiment;

      const type={
        circuit:"circuit",
        advancedCircuit:"circuit",
        motion:"cradle",
        projectile:"curve",
        reflection:"lens",
        floating:"thermal"
      }[key]||"wave";

      const preview=document.createElement("div");
      preview.className="phy-preview";
      preview.innerHTML=svg(type);

      const heading=card.querySelector("h3");

      if(heading) {
        heading.insertAdjacentElement(
          "beforebegin",preview
        );
      }

      const button=card.querySelector(
        "[data-experiment]"
      );

      if(button) button.textContent="▶ Start";
    });
  }

  // -----------------------------------
  // INITIALIZATION
  // -----------------------------------

  function init() {
    const grid=$("#laboratory .experiment-grid");

    if(!grid) {
      console.error(
        "Physics Lab: experiment grid not found."
      );
      return;
    }

    upgradeExistingCards();

    experiments.forEach(exp=>{
      if(document.querySelector(
        `[data-physics-launch="${exp.id}"]`
      )) return;

      grid.appendChild(makeCard(exp));
    });

    // Capture new launches.
    document.addEventListener("click",event=>{
      const button=event.target.closest(
        "[data-physics-launch]"
      );

      if(!button) return;

      event.preventDefault();

      const exp=experiments.find(
        e=>e.id===button.dataset.physicsLaunch
      );

      if(exp) launch(exp);
    });

    // New simulations use their own completion
    // handler; old ones retain script.js logic.
    const complete=$("#completeExperiment");

    complete?.addEventListener("click",event=>{
      if(!active) return;

      const workspace=$("#experimentWorkspace");

      if(!workspace?.classList.contains("active")) {
        return;
      }

      const title=$("#activeExperimentTitle")
        ?.textContent;

      if(title!==active.exp.name) return;

      event.stopImmediatePropagation();

      const key="pocketlab-physics-completed";
      let completed=[];

      try {
        completed=JSON.parse(
          localStorage.getItem(key)||"[]"
        );
      } catch {}

      if(!completed.includes(active.exp.id)) {
        completed.push(active.exp.id);
        localStorage.setItem(
          key,JSON.stringify(completed)
        );

        complete.textContent=
          "✓ Experiment Completed!";
      } else {
        complete.textContent=
          "✓ Already Completed";
      }
    },true);

    // Clear our state when an original experiment
    // is launched, so its completion handler works.
    document.addEventListener("click",event=>{
      if(event.target.closest(
        "[data-experiment]"
      )) {
        active=null;
      }
    },true);

    // Restore button label on new launches.
    document.addEventListener("click",event=>{
      if(event.target.closest(
        "[data-physics-launch]"
      )) {
        const button=$("#completeExperiment");
        if(button) {
          button.textContent=
            "Complete Experiment ✓";
        }
      }
    });

    console.info(
      "PocketLab Physics ready:",
      experiments.length,
      "new simulations + 6 existing experiments"
    );
  }

  if(document.readyState==="loading") {
    document.addEventListener(
      "DOMContentLoaded",init
    );
  } else {
    init();
  }

})();
