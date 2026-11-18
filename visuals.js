
/*
  POCKETLAB 3.0 — SHARED 3D ENGINE
  FIXED: rolling car wheels + reactive bulb glow

  3D: circuit, motion, projectile, plant
  Other experiments: existing script.js fallback

  Three.js currently loads from CDN.
*/

(() => {
  "use strict";

  const THREE_URL =
    "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

  let THREE = null;
  let loading = false;
  let active = null;
  let checkQueued = false;

  const $ = s => document.querySelector(s);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const css = document.createElement("style");
  css.textContent = `
    #simulationCanvas:has(.p3-root) {
      padding:0!important;
      overflow:hidden!important;
      background:#071323!important;
      border-radius:16px;
    }
    .p3-root {
      background:#071323;
      color:white;
      font-family:Arial,sans-serif;
      overflow:hidden;
      border-radius:16px;
    }
    .p3-view {
      height:420px;
      width:100%;
      position:relative;
      overflow:hidden;
      touch-action:none;
    }
    .p3-view canvas {
      display:block;
      width:100%;
      height:100%;
      cursor:grab;
      touch-action:none;
    }
    .p3-heading {
      position:absolute;
      left:17px;
      top:17px;
      z-index:2;
      pointer-events:none;
      text-shadow:0 2px 8px #000;
    }
    .p3-heading small {
      color:#60e7ff;
      font-size:10px;
      font-weight:800;
      letter-spacing:1.4px;
    }
    .p3-heading strong {
      display:block;
      margin-top:7px;
      font-size:19px;
    }
    .p3-status {
      position:absolute;
      top:17px;
      right:17px;
      z-index:2;
      color:#7fffc4;
      border:1px solid #32795f;
      background:#103c31;
      border-radius:20px;
      padding:8px 11px;
      font-size:10px;
      font-weight:bold;
      pointer-events:none;
    }
    .p3-panel {
      background:#0b1b31;
      padding:16px;
      border-top:1px solid #29415d;
    }
    .p3-reading {
      text-align:center;
      color:#70eaff;
      font-size:27px;
      font-weight:900;
      margin:4px 0 15px;
    }
    .p3-metrics {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:9px;
    }
    .p3-metric {
      background:#162b47;
      border:1px solid #2d4a6a;
      padding:11px 6px;
      text-align:center;
      border-radius:10px;
    }
    .p3-metric small {
      display:block;
      color:#a7bad3;
      font-size:10px;
      margin-bottom:6px;
    }
    .p3-metric strong {
      font-size:13px;
      overflow-wrap:anywhere;
    }
    .p3-actions {
      display:flex;
      flex-wrap:wrap;
      justify-content:center;
      gap:8px;
      margin-top:14px;
    }
    .p3-actions button {
      background:#244364;
      color:white;
      border:1px solid #456c94;
      border-radius:9px;
      padding:9px 13px;
      font-size:11px;
      font-weight:bold;
      cursor:pointer;
    }
    .p3-help {
      text-align:center;
      color:#9eb4cd;
      font-size:11px;
      margin:12px 0 0;
    }
    @media(max-width:600px) {
      .p3-view {height:330px}
      .p3-heading strong {font-size:15px}
      .p3-reading {font-size:22px}
    }
  `;
  document.head.appendChild(css);

  // -----------------------------------
  // EXPERIMENT DETECTION
  // -----------------------------------

  function currentKey() {
    const workspace = $("#experimentWorkspace");

    if (!workspace?.classList.contains("active")) {
      return "";
    }

    const title = (
      $("#activeExperimentTitle")?.textContent || ""
    ).toLowerCase();

    if (title.includes("advanced circuit")) return "";
    if (title.includes("electric circuit")) return "circuit";
    if (title.includes("force and motion")) return "motion";
    if (title.includes("projectile")) return "projectile";
    if (title.includes("plant growth")) return "plant";

    return "";
  }

  function control(name, fallback) {
    const area = $("#experimentControls");
    if (!area) return fallback;

    const input = [...area.querySelectorAll("input,select")]
      .find(el =>
        el.id === name ||
        el.name === name ||
        (el.id || "").toLowerCase().includes(name)
      );

    if (!input) return fallback;

    const n = Number(input.value);
    return Number.isFinite(n) ? n : fallback;
  }

  // -----------------------------------
  // 3D HELPERS
  // -----------------------------------

  function material(color, opts = {}) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness:0.52,
      metalness:0.08,
      ...opts
    });
  }

  function add(parent, geometry, mat, x=0, y=0, z=0) {
    const m = new THREE.Mesh(geometry, mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  function box(p,w,h,d,color,x=0,y=0,z=0) {
    return add(
      p,
      new THREE.BoxGeometry(w,h,d),
      material(color),
      x,y,z
    );
  }

  function ball(p,r,color,x=0,y=0,z=0) {
    return add(
      p,
      new THREE.SphereGeometry(r,32,24),
      material(color),
      x,y,z
    );
  }

  function cyl(p,r1,r2,h,color,x=0,y=0,z=0) {
    return add(
      p,
      new THREE.CylinderGeometry(r1,r2,h,40),
      material(color),
      x,y,z
    );
  }

  function pipe(p,points,r,color,options={}) {
    const curve = new THREE.CatmullRomCurve3(
      points.map(v => new THREE.Vector3(...v))
    );

    const object = add(
      p,
      new THREE.TubeGeometry(curve,72,r,10,false),
      material(color,options)
    );

    return {object,curve};
  }

  function label(p,text,x,y,z,color="#ffffff") {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;

    const c = canvas.getContext("2d");
    c.fillStyle = color;
    c.font = "bold 42px Arial";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text,256,64,500);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map:texture,
        transparent:true,
        depthWrite:false
      })
    );

    sprite.position.set(x,y,z);
    sprite.scale.set(1.9,.48,1);
    p.add(sprite);

    return sprite;
  }

  function glowSprite(parent,x,y,z) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    const c = canvas.getContext("2d");
    const gradient = c.createRadialGradient(
      128,128,5,128,128,128
    );

    gradient.addColorStop(0,"rgba(255,255,235,1)");
    gradient.addColorStop(.12,"rgba(255,246,160,.95)");
    gradient.addColorStop(.32,"rgba(255,190,55,.58)");
    gradient.addColorStop(.65,"rgba(255,125,20,.16)");
    gradient.addColorStop(1,"rgba(255,110,0,0)");

    c.fillStyle = gradient;
    c.fillRect(0,0,256,256);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map:texture,
        transparent:true,
        opacity:0,
        blending:THREE.AdditiveBlending,
        depthWrite:false,
        depthTest:false
      })
    );

    sprite.position.set(x,y,z);
    sprite.scale.set(2.6,2.6,1);
    sprite.renderOrder = 10;
    parent.add(sprite);

    return sprite;
  }

  // -----------------------------------
  // CIRCUIT — REACTIVE GLOW
  // -----------------------------------

  function circuitScene(scene) {
    const root = new THREE.Group();
    scene.add(root);

    box(root,5.8,.18,3.6,0x1d344e,0,.1,0);

    // Battery
    box(root,.9,1.2,.78,0x138b96,-2,.83,0);
    box(root,.82,.13,.72,0x263b51,-2,1.49,0);

    cyl(root,.09,.09,.13,0xe9edf4,-2.22,1.61,0);
    cyl(root,.09,.09,.13,0xe9edf4,-1.78,1.61,0);

    label(root,"BATTERY",-2,.48,.52);

    // Resistor
    const resistor = cyl(
      root,.24,.24,1.06,0xe0bb87,0,.63,-1
    );
    resistor.rotation.z = Math.PI/2;

    [
      [-.33,0x8b3425],
      [-.12,0x1e2228],
      [.12,0xd46b2d],
      [.33,0xd9bd58]
    ].forEach(([offset,color]) => {
      const stripe = cyl(
        root,.246,.246,.065,color,offset,.63,-1
      );
      stripe.rotation.z = Math.PI/2;
    });

    label(root,"RESISTOR",0,1.32,-1);

    // Socket
    cyl(root,.32,.36,.32,0x8495a7,2,.51,0);
    cyl(root,.24,.27,.13,0xb4beca,2,.74,0);

    // Bulb glass: clear even when off
    const glass = add(
      root,
      new THREE.SphereGeometry(.52,48,32),
      new THREE.MeshPhysicalMaterial({
        color:0xe2f3ff,
        transparent:true,
        opacity:.18,
        roughness:.08,
        metalness:0,
        depthWrite:false,
        side:THREE.FrontSide
      }),
      2,1.22,0
    );

    // Inner illuminated bulb volume
    const innerMaterial = new THREE.MeshBasicMaterial({
      color:0xffcc5a,
      transparent:true,
      opacity:0,
      depthWrite:false
    });

    const inner = add(
      root,
      new THREE.SphereGeometry(.43,32,24),
      innerMaterial,
      2,1.22,0
    );

    inner.castShadow = false;

    // Filament with actual emissive response
    const filamentMaterial = new THREE.MeshStandardMaterial({
      color:0x594a39,
      emissive:0xffc04a,
      emissiveIntensity:0,
      roughness:.4
    });

    const filament = pipe(root,[
      [1.83,1.04,.02],
      [1.89,1.36,.02],
      [1.96,1.14,.02],
      [2.03,1.37,.02],
      [2.10,1.14,.02],
      [2.17,1.04,.02]
    ],.027,0x594a39);

    filament.object.material.dispose();
    filament.object.material = filamentMaterial;

    const halo = glowSprite(root,2,1.22,.12);

    const bulbLight = new THREE.PointLight(
      0xffc76a,0,7,2
    );
    bulbLight.position.set(2,1.22,0);
    root.add(bulbLight);

    label(root,"LIGHT BULB",2,2.06,0);

    // Wires
    const paths = [
      [
        [-2.22,1.61,0],
        [-2.22,1.65,-1],
        [-.56,1.65,-1],
        [-.56,.63,-1]
      ],
      [
        [.56,.63,-1],
        [1.4,.63,-1],
        [1.4,.52,0],
        [2,.52,0]
      ],
      [
        [2,.35,0],
        [2,.35,1.3],
        [-1.78,.35,1.3],
        [-1.78,1.61,0]
      ]
    ];

    const electrons = [];

    paths.forEach(points => {
      const wire = pipe(
        root,points,.048,0x2fc6e8,
        {metalness:.3,roughness:.3}
      );

      for (let i=0;i<5;i++) {
        const dot = ball(root,.05,0xffed85);
        dot.material.dispose();
        dot.material = new THREE.MeshBasicMaterial({
          color:0xffe77a
        });

        electrons.push({
          dot,
          curve:wire.curve,
          offset:i/5
        });
      }
    });

    function electrical() {
      const voltage = Math.max(
        0,control("voltage",9)
      );

      const resistance = Math.max(
        .01,control("resistance",6)
      );

      const current = voltage/resistance;
      const power = voltage*current;

      return {
        voltage,resistance,current,power
      };
    }

    return {
      update(t) {
        const e = electrical();

        /*
          A reference power controls the visual
          brightness of this educational bulb.
          This is not a thermal filament model.
        */
        const brightness = clamp(
          e.power/15,0,1
        );

        // OFF -> dim orange -> bright warm white
        filamentMaterial.color.setRGB(
          .28 + brightness*.72,
          .18 + brightness*.82,
          .10 + brightness*.76
        );

        filamentMaterial.emissiveIntensity =
          brightness*5;

        innerMaterial.opacity =
          brightness*.48;

        innerMaterial.color.setRGB(
          1,
          .47 + brightness*.48,
          .12 + brightness*.70
        );

        halo.material.opacity =
          brightness*.92;

        const haloSize =
          1.6 + brightness*2.3;

        halo.scale.set(
          haloSize,haloSize,1
        );

        bulbLight.intensity =
          brightness*22;

        glass.material.opacity =
          .15 + brightness*.11;

        electrons.forEach(p => {
          const speed = clamp(
            e.current*.12,0,2
          );

          p.dot.visible = e.current > 0;

          const u = (
            t*speed+p.offset
          )%1;

          p.dot.position.copy(
            p.curve.getPointAt(u)
          );
        });
      },

      info() {
        const e = electrical();

        return {
          reading:`${e.current.toFixed(2)} A`,
          metrics:[
            ["Voltage",`${e.voltage} V`],
            ["Resistance",`${e.resistance} Ω`],
            ["Bulb power",`${e.power.toFixed(2)} W`]
          ]
        };
      }
    };
  }

  // -----------------------------------
  // CAR — REAL WHEEL ROLLING
  // -----------------------------------

  function motionScene(scene) {
    const root = new THREE.Group();
    scene.add(root);

    // Road
    box(root,14,.18,3.6,0x293b4c,0,.05,0);

    for(let x=-6;x<7;x+=1.5) {
      box(root,.78,.012,.065,0xf4d57d,x,.15,1.15);
    }

    const car = new THREE.Group();
    root.add(car);

    box(car,2.45,.5,1.12,0x3972e7,0,.75,0);
    box(car,1.45,.48,1.04,0x1f477f,-.15,1.2,0);
    box(car,1.34,.09,1.07,0x9db7f5,-.15,1.48,0);

    box(car,.85,.31,.015,0x80d5f7,-.16,1.2,.53);
    box(car,.85,.31,.015,0x80d5f7,-.16,1.2,-.53);

    ball(car,.11,0xffefb2,1.23,.78,.4);
    ball(car,.11,0xffefb2,1.23,.78,-.4);

    const wheelRadius = .34;
    const wheels = [];

    [-.8,.8].forEach(x => {
      [-.64,.64].forEach(z => {
        /*
          Wheel pivot rotates around world Z,
          which is the axle for this side view.
        */
        const pivot = new THREE.Group();
        pivot.position.set(x,.4,z);
        car.add(pivot);

        const tire = cyl(
          pivot,wheelRadius,wheelRadius,.18,
          0x10151c
        );

        tire.rotation.x = Math.PI/2;

        const hub = cyl(
          pivot,.15,.15,.19,0xaab8ca
        );

        hub.rotation.x = Math.PI/2;

        // Visible spokes make rotation obvious
        for(let i=0;i<5;i++) {
          const angle = i*Math.PI*2/5;

          const spoke = box(
            pivot,.045,.19,.015,
            0xe5edf8,
            Math.sin(angle)*.17,
            Math.cos(angle)*.17,
            z>0 ? .105 : -.105
          );

          spoke.rotation.z = -angle;
        }

        wheels.push(pivot);
      });
    });

    return {
      update(t) {
        const force = control("force",20);
        const mass = Math.max(
          .01,control("mass",5)
        );

        const acceleration = force/mass;

        // Loop a four-second motion demonstration.
        const demoTime = (t*.35)%4;
        const displacement =
          .5*acceleration*demoTime*demoTime;

        // Wrap the visible car position.
        const trackLength = 8;
        const visibleDistance =
          ((displacement%trackLength)+trackLength)
          %trackLength;

        car.position.x =
          -4+visibleDistance;

        /*
          Pure rolling without slipping:
          angle = distance / radius.
          Use the same displacement that
          controls the car's position.
        */
        const wheelAngle =
          -displacement/wheelRadius;

        wheels.forEach(w => {
          w.rotation.z = wheelAngle;
        });
      },

      info() {
        const force = control("force",20);
        const mass = Math.max(
          .01,control("mass",5)
        );
        const a = force/mass;

        return {
          reading:`${a.toFixed(2)} m/s²`,
          metrics:[
            ["Force",`${force} N`],
            ["Mass",`${mass} kg`],
            ["Speed at 4 s",`${(a*4).toFixed(2)} m/s`]
          ]
        };
      }
    };
  }

  // -----------------------------------
  // PROJECTILE
  // -----------------------------------

  function projectileScene(scene) {
    const root = new THREE.Group();
    scene.add(root);

    box(root,12,.16,4,0x254235,0,.04,0);

    cyl(root,.45,.55,.28,0x71869d,-4,.3,0);

    const barrel = cyl(
      root,.19,.22,1.2,0x859bb5,-4,.9,0
    );

    const projectile = ball(
      root,.21,0xffa340
    );

    const trail = [];

    for(let i=0;i<14;i++) {
      const dot = ball(root,.045,0x66e6ff);
      trail.push(dot);
    }

    function point(t,speed,angle) {
      const rad = angle*Math.PI/180;

      return new THREE.Vector3(
        -4+speed*Math.cos(rad)*t*.16,
        .45+(
          speed*Math.sin(rad)*t-
          4.905*t*t
        )*.16,
        0
      );
    }

    return {
      update(t) {
        const speed = control("speed",20);
        const angle = control("angle",45);
        const rad = angle*Math.PI/180;

        const flight = Math.max(
          .01,2*speed*Math.sin(rad)/9.81
        );

        const elapsed = (t*.65)%flight;

        barrel.rotation.z =
          -(Math.PI/2-rad);

        projectile.position.copy(
          point(elapsed,speed,angle)
        );

        trail.forEach((dot,i) => {
          dot.position.copy(
            point(
              Math.max(0,elapsed-i*.07),
              speed,angle
            )
          );
        });
      },

      info() {
        const speed = control("speed",20);
        const angle = control("angle",45);
        const rad = angle*Math.PI/180;

        const range =
          speed*speed*Math.sin(2*rad)/9.81;

        const height =
          Math.pow(speed*Math.sin(rad),2)/19.62;

        const time =
          2*speed*Math.sin(rad)/9.81;

        return {
          reading:`${range.toFixed(2)} m`,
          metrics:[
            ["Range",`${range.toFixed(2)} m`],
            ["Height",`${height.toFixed(2)} m`],
            ["Flight",`${time.toFixed(2)} s`]
          ]
        };
      }
    };
  }

  // -----------------------------------
  // PLANT
  // -----------------------------------

  function plantScene(scene) {
    const root = new THREE.Group();
    scene.add(root);

    cyl(root,.73,.5,1,0xb96c4c,0,.56,0);
    cyl(root,.78,.75,.15,0xd88b61,0,1.09,0);
    cyl(root,.69,.69,.03,0x38281d,0,1.17,0);

    const growing = new THREE.Group();
    growing.position.y = 1.18;
    root.add(growing);

    pipe(growing,[
      [0,0,0],
      [.05,.5,0],
      [-.05,1,0],
      [.04,1.5,0],
      [0,2.1,0]
    ],.052,0x388d42);

    const leaves = [];

    for(let i=0;i<12;i++) {
      const group = new THREE.Group();
      group.position.y = .28+i*.15;
      group.rotation.y = i*2.4;
      growing.add(group);

      const size = .68+(i%3)*.13;
      const shape = new THREE.Shape();

      shape.moveTo(0,0);
      shape.bezierCurveTo(
        size*.2,size*.35,
        size*.8,size*.38,
        size,0
      );
      shape.bezierCurveTo(
        size*.8,-size*.38,
        size*.2,-size*.35,
        0,0
      );

      const leaf = add(
        group,
        new THREE.ShapeGeometry(shape,24),
        material(
          i%2 ? 0x39b35c : 0x69d775,
          {side:THREE.DoubleSide}
        )
      );

      leaf.rotation.z = .28;
      leaf.rotation.x = -.32;

      leaves.push(group);
    }

    ball(growing,.12,0x9bed9d,0,2.16,0);

    return {
      update(t) {
        const sun = control("sunlight",70);
        const water = control("water",60);

        const growth =
          clamp(sun/70,0,1)*
          clamp(1-Math.abs(water-60)/60,0,1);

        growing.scale.setScalar(
          .35+growth*.65
        );

        growing.rotation.z =
          Math.sin(t*.7)*.025;

        leaves.forEach((leaf,i) => {
          leaf.rotation.x =
            Math.sin(t+i)*.04;
        });
      },

      info() {
        const sun = control("sunlight",70);
        const water = control("water",60);

        const growth = Math.round(
          100*
          clamp(sun/70,0,1)*
          clamp(1-Math.abs(water-60)/60,0,1)
        );

        return {
          reading:`${growth}% Growth`,
          metrics:[
            ["Sunlight",`${sun}%`],
            ["Water",`${water}%`],
            ["Growth index",`${growth}%`]
          ]
        };
      }
    };
  }

  const builders = {
    circuit:circuitScene,
    motion:motionScene,
    projectile:projectileScene,
    plant:plantScene
  };

  // -----------------------------------
  // THREE.JS WORLD
  // -----------------------------------

  function createWorld(view,key) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x081729);

    const camera = new THREE.PerspectiveCamera(
      45,
      Math.max(view.clientWidth,1)/
        Math.max(view.clientHeight,1),
      .1,100
    );

    const renderer = new THREE.WebGLRenderer({
      antialias:true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio||1,2)
    );

    renderer.setSize(
      Math.max(view.clientWidth,1),
      Math.max(view.clientHeight,1)
    );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.4;

    view.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(
      0xc8e8ff,0x263b35,2.2
    ));

    const sun = new THREE.DirectionalLight(
      0xfff1db,3
    );

    sun.position.set(4,8,5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024,1024);
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    scene.add(sun);

    const blue = new THREE.PointLight(
      0x3aaaff,20,12
    );
    blue.position.set(-4,3,-3);
    scene.add(blue);

    const floor = add(
      scene,
      new THREE.PlaneGeometry(30,30),
      material(0x13283c)
    );

    floor.rotation.x = -Math.PI/2;
    floor.receiveShadow = true;

    return {
      scene,
      camera,
      renderer,
      simulation:builders[key](scene)
    };
  }

  // -----------------------------------
  // LIFECYCLE
  // -----------------------------------

  function dispose() {
    if (!active) return;

    const old = active;
    active = null;

    cancelAnimationFrame(old.frame);
    old.resizeObserver?.disconnect();
    old.abort.abort();

    old.world.scene.traverse(object => {
      object.geometry?.dispose();

      if(object.material) {
        const materials = Array.isArray(
          object.material
        )
          ? object.material
          : [object.material];

        materials.forEach(m => {
          m.map?.dispose();
          m.dispose();
        });
      }
    });

    old.world.renderer.dispose();
  }

  function mount(key) {
    const canvas = $("#simulationCanvas");
    if(!canvas) return;

    if(
      active &&
      active.key===key &&
      active.root.isConnected
    ) return;

    dispose();

    const root = document.createElement("div");
    root.className = "p3-root";

    root.innerHTML = `
      <div class="p3-view">
        <div class="p3-heading">
          <small>POCKETLAB 3.0 · REAL 3D LAB</small>
          <strong></strong>
        </div>
        <div class="p3-status">● INTERACTIVE 3D</div>
      </div>

      <div class="p3-panel">
        <div class="p3-reading"></div>
        <div class="p3-metrics"></div>

        <div class="p3-actions">
          <button data-action="pause">⏸ Pause</button>
          <button data-action="plus">＋ Zoom</button>
          <button data-action="minus">－ Zoom</button>
          <button data-action="reset">↺ Reset</button>
        </div>

        <p class="p3-help">
          Drag to rotate 360° · Scroll to zoom ·
          Change sliders to test the experiment
        </p>
      </div>
    `;

    canvas.replaceChildren(root);

    root.querySelector(".p3-heading strong")
      .textContent =
        $("#activeExperimentTitle")?.textContent ||
        "3D Experiment";

    const view = root.querySelector(".p3-view");
    const world = createWorld(view,key);

    const state = {
      key,
      root,
      world,
      angle:.55,
      elevation:.35,
      distance:key==="motion"?10:7,
      paused:false,
      simulationTime:0,
      lastTime:null,
      frame:0,
      resizeObserver:null,
      abort:new AbortController()
    };

    active = state;

    function refresh() {
      if(active!==state) return;

      const info = world.simulation.info();

      root.querySelector(".p3-reading")
        .textContent = info.reading;

      root.querySelector(".p3-metrics")
        .innerHTML = info.metrics.map(
          ([name,v]) => `
            <div class="p3-metric">
              <small>${name}</small>
              <strong>${v}</strong>
            </div>
          `
        ).join("");

      // Apply changed controls immediately,
      // even when animation is paused.
      world.simulation.update(
        state.simulationTime
      );

      world.renderer.render(
        world.scene,world.camera
      );
    }

    const element = world.renderer.domElement;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    element.addEventListener("pointerdown",e => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;

      element.setPointerCapture(e.pointerId);
      element.style.cursor = "grabbing";
    });

    element.addEventListener("pointermove",e => {
      if(!dragging) return;

      state.angle -= (e.clientX-lastX)*.009;

      state.elevation = clamp(
        state.elevation+
          (e.clientY-lastY)*.005,
        .05,1.35
      );

      lastX = e.clientX;
      lastY = e.clientY;
    });

    function stopDrag() {
      dragging = false;
      element.style.cursor = "grab";
    }

    element.addEventListener("pointerup",stopDrag);
    element.addEventListener("pointercancel",stopDrag);

    element.addEventListener("wheel",e => {
      e.preventDefault();

      state.distance = clamp(
        state.distance+e.deltaY*.006,
        3,17
      );
    },{passive:false});

    root.addEventListener("click",e => {
      const button = e.target.closest(
        "[data-action]"
      );

      if(!button) return;

      const action = button.dataset.action;

      if(action==="pause") {
        state.paused = !state.paused;
        button.textContent = state.paused
          ? "▶ Play"
          : "⏸ Pause";
      }

      if(action==="plus") {
        state.distance = clamp(
          state.distance-.6,3,17
        );
      }

      if(action==="minus") {
        state.distance = clamp(
          state.distance+.6,3,17
        );
      }

      if(action==="reset") {
        state.angle = .55;
        state.elevation = .35;
        state.distance =
          key==="motion"?10:7;

        state.simulationTime = 0;
        state.paused = false;

        const pause = root.querySelector(
          '[data-action="pause"]'
        );

        if(pause) pause.textContent = "⏸ Pause";
      }
    });

    const controls = $("#experimentControls");

    controls?.addEventListener(
      "input",refresh,
      {signal:state.abort.signal}
    );

    controls?.addEventListener(
      "change",refresh,
      {signal:state.abort.signal}
    );

    const resizeObserver = new ResizeObserver(() => {
      if(active!==state) return;

      const w = Math.max(view.clientWidth,1);
      const h = Math.max(view.clientHeight,1);

      world.camera.aspect = w/h;
      world.camera.updateProjectionMatrix();
      world.renderer.setSize(w,h);
    });

    resizeObserver.observe(view);
    state.resizeObserver = resizeObserver;

    function animate(now) {
      if(active!==state) return;

      if(
        !root.isConnected ||
        currentKey()!==key
      ) {
        dispose();
        return;
      }

      state.frame = requestAnimationFrame(
        animate
      );

      if(state.lastTime===null) {
        state.lastTime = now;
      }

      const dt = Math.min(
        (now-state.lastTime)/1000,
        .05
      );

      state.lastTime = now;

      if(!state.paused) {
        state.simulationTime += dt;
      }

      world.simulation.update(
        state.simulationTime
      );

      const d = state.distance;
      const horizontal =
        d*Math.cos(state.elevation);

      world.camera.position.set(
        Math.sin(state.angle)*horizontal,
        1.5+d*Math.sin(state.elevation),
        Math.cos(state.angle)*horizontal
      );

      world.camera.lookAt(
        0,key==="plant"?1.7:.9,0
      );

      world.renderer.render(
        world.scene,world.camera
      );
    }

    refresh();

    state.frame = requestAnimationFrame(
      animate
    );
  }

  // -----------------------------------
  // LOAD + CONNECT TO EXISTING APP
  // -----------------------------------

  async function loadThree() {
    if(THREE||loading) return;

    loading = true;

    try {
      THREE = await import(THREE_URL);
      scheduleCheck();
    } catch(error) {
      loading = false;
      console.error(
        "PocketLab: Three.js failed to load",
        error
      );
    }
  }

  function check() {
    const key = currentKey();

    if(!key) {
      if(active) dispose();
      return;
    }

    if(!THREE) {
      loadThree();
      return;
    }

    if(
      active &&
      active.key===key &&
      active.root.isConnected
    ) return;

    mount(key);
  }

  function scheduleCheck() {
    if(checkQueued) return;

    checkQueued = true;

    requestAnimationFrame(() => {
      checkQueued = false;
      check();
    });
  }

  function init() {
    const canvas = $("#simulationCanvas");

    if(!canvas) {
      console.warn(
        "PocketLab: #simulationCanvas not found"
      );
      return;
    }

    new MutationObserver(scheduleCheck).observe(
      canvas,{childList:true}
    );

    const title = $("#activeExperimentTitle");

    if(title) {
      new MutationObserver(scheduleCheck).observe(
        title,{
          childList:true,
          subtree:true,
          characterData:true
        }
      );
    }

    document.addEventListener("click",e => {
      if(
        e.target.closest("[data-experiment]") ||
        e.target.closest("[data-page]") ||
        e.target.closest("[data-pl40-launch]")
      ) {
        scheduleCheck();
      }
    });

    scheduleCheck();

    console.info(
      "PocketLab 3D: rolling wheels and bulb glow ready"
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

/* ====================================================
   POCKETLAB — REAL THREE.JS 3D RAMP & FRICTION
   PASTE AT THE VERY BOTTOM OF visuals.js

   No changes to script.js or physics.js.
   Existing sliders, physics, results and buttons stay.
==================================================== */

(() => {
  "use strict";

  if (window.__POCKETLAB_REAL_RAMP_V1__) return;
  window.__POCKETLAB_REAL_RAMP_V1__ = true;

  const $ = s => document.querySelector(s);

  const clamp = (v, min, max) =>
    Math.max(min, Math.min(max, v));

  let threePromise = null;
  let active = null;

  /* ---------- STYLES ---------- */

  const style = document.createElement("style");

  style.textContent = `
    .pocket-ramp3d {
      position:absolute;
      left:0;
      top:0;
      width:100%;
      z-index:5;
      overflow:hidden;
      border-radius:15px;
      background:#071b2e;
      border:1px solid #3886b4;
      touch-action:none;
    }

    .pocket-ramp3d canvas {
      display:block;
      width:100%;
      height:100%;
      touch-action:none;
      cursor:grab;
    }

    .pocket-ramp3d .r3d-hud {
      position:absolute;
      top:12px;
      left:13px;
      right:13px;
      z-index:2;
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:10px;
      pointer-events:none;
      color:#c9f3ff;
      font:600 13px/1.6 Arial,sans-serif;
      text-shadow:0 2px 5px #000;
    }

    .pocket-ramp3d .r3d-hud strong {
      display:block;
      color:#6feeff;
      font-size:15px;
    }

    .pocket-ramp3d .r3d-values {
      text-align:right;
    }

    .pocket-ramp3d .r3d-help {
      position:absolute;
      left:13px;
      bottom:10px;
      color:#b6d8ed;
      font:12px Arial,sans-serif;
      pointer-events:none;
      text-shadow:0 1px 5px #000;
    }
  `;

  document.head.appendChild(style);

  /* ---------- IDENTIFY EXISTING EXPERIMENT ---------- */

  function isRamp() {
    const workspace = $("#experimentWorkspace");

    const title =
      $("#activeExperimentTitle")?.textContent || "";

    return (
      workspace?.classList.contains("active") &&
      /ramp\s*&\s*friction/i.test(title)
    );
  }

  function getNumber(id, fallback) {
    const element = document.getElementById(id);

    if (!element) return fallback;

    const value = Number(element.value);

    return Number.isFinite(value)
      ? value
      : fallback;
  }

  function metric(name, fallback = "0") {
    const tiles = document.querySelectorAll(
      "#experimentResults .pf3-tile"
    );

    for (const tile of tiles) {
      const label = tile.querySelector("small")
        ?.textContent.trim().toLowerCase();

      if (label === name.toLowerCase()) {
        return tile.querySelector("strong")
          ?.textContent.trim() || fallback;
      }
    }

    return fallback;
  }

  /* ---------- LOAD THE PROJECT'S THREE.JS VERSION ---------- */

  async function loadThree() {
    if (!threePromise) {
      threePromise = import(
        "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"
      ).catch(() => import("./three.module.js"));
    }

    return threePromise;
  }

  /* ---------- CLEAN UP WHEN EXPERIMENT CLOSES ---------- */

  function destroy() {
    if (!active) return;

    const a = active;
    active = null;

    cancelAnimationFrame(a.frame);
    a.observer.disconnect();

    a.scene.traverse(object => {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        const materials = Array.isArray(
          object.material
        )
          ? object.material
          : [object.material];

        materials.forEach(m => m.dispose());
      }
    });

    a.renderer.dispose();
    a.view.remove();

    if (a.original.isConnected) {
      a.original.style.visibility =
        a.previousVisibility;
    }
  }

  /* ---------- REAL 3D MESH HELPER ---------- */

  function addBox(
    THREE,
    parent,
    width,
    height,
    depth,
    color,
    x = 0,
    y = 0,
    z = 0
  ) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({
        color:color,
        metalness:0.18,
        roughness:0.48
      })
    );

    mesh.position.set(x,y,z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);

    return mesh;
  }

  /* ---------- MOUNT THE 3D SCENE ---------- */

  async function mount() {
    if (!isRamp()) {
      destroy();
      return;
    }

    const original = $("#pf3Canvas");

    const stage = original?.closest(".pf3-stage");

    if (!original || !stage) return;

    if (
      active?.original === original &&
      active.view.isConnected
    ) {
      return;
    }

    if (active) destroy();

    let THREE;

    try {
      THREE = await loadThree();
    } catch (error) {
      console.error(
        "Three.js could not load. Original ramp retained.",
        error
      );

      threePromise = null;
      return;
    }

    if (
      !isRamp() ||
      !original.isConnected ||
      $("#pf3Canvas") !== original
    ) {
      return;
    }

    if (active?.original === original) return;

    /* ---------- 3D VIEW ---------- */

    const view = document.createElement("div");

    view.className = "pocket-ramp3d";

    view.innerHTML = `
      <div class="r3d-hud">
        <div>
          <strong>RAMP & FRICTION · REAL 3D</strong>
          Three.js · Interactive Physics
        </div>

        <div
          class="r3d-values"
          id="r3d-values"
        >Preparing scene...</div>
      </div>

      <div class="r3d-help">
        DRAG TO ROTATE 360° · SCROLL TO ZOOM
      </div>
    `;

    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias:true,
        alpha:false
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1,2)
      );

    } catch (error) {
      console.error(
        "WebGL renderer could not start:",
        error
      );

      view.remove();
      return;
    }

    renderer.setClearColor(0x08192d);

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    view.prepend(renderer.domElement);

    stage.style.position = "relative";

    original.after(view);

    const previousVisibility =
      original.style.visibility;

    original.style.visibility = "hidden";

    /* ---------- SCENE ---------- */

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(
      0x08192d
    );

    scene.fog = new THREE.Fog(
      0x08192d,13,28
    );

    const camera = new THREE.PerspectiveCamera(
      43,2,0.1,75
    );

    /* ---------- LIGHTS ---------- */

    const light = new THREE.DirectionalLight(
      0xffffff,3.2
    );

    light.position.set(-3,9,8);

    light.castShadow = true;

    light.shadow.mapSize.set(1024,1024);

    light.shadow.camera.left = -8;
    light.shadow.camera.right = 8;
    light.shadow.camera.top = 8;
    light.shadow.camera.bottom = -8;

    scene.add(light);

    scene.add(
      new THREE.HemisphereLight(
        0xb9e8ff,
        0x263b54,
        2
      )
    );

    /* ---------- 3D FLOOR ---------- */

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(25,25),
      new THREE.MeshStandardMaterial({
        color:0x112b43,
        roughness:0.96
      })
    );

    ground.rotation.x = -Math.PI / 2;

    ground.receiveShadow = true;
    ground.position.y = 0.04;

    scene.add(ground);

    const grid = new THREE.GridHelper(
      24,24,0x246585,0x1c3d5d
    );

    grid.position.y = 0.065;

    scene.add(grid);

    /* ---------- RAMP FOUNDATION ---------- */

    const group = new THREE.Group();

    scene.add(group);

    addBox(
      THREE,group,
      6.7,0.24,3.25,
      0x25435d,
      0,0.16,0
    );

    let wedge = null;

    const deck = addBox(
      THREE,group,
      4.3,0.105,2.2,
      0x45addb
    );

    const rails = [-1.08,1.08].map(z =>
      addBox(
        THREE,group,
        4.26,0.11,0.065,
        0xa4efff,
        0,0,z
      )
    );

    /* ---------- MOVING 3D BLOCK ---------- */

    const blockRoot = new THREE.Group();

    group.add(blockRoot);

    addBox(
      THREE,blockRoot,
      0.82,0.69,0.88,
      0xf4a34e
    );

    addBox(
      THREE,blockRoot,
      0.55,0.035,0.56,
      0xffd18b,
      0,0.365,0
    );

    /* ---------- FORCE ARROWS ---------- */

    const gravityArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0,-1,0),
      new THREE.Vector3(0,0,0),
      0.9,
      0xffd45c,
      0.24,
      0.15
    );

    scene.add(gravityArrow);

    const frictionArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1,0,0),
      new THREE.Vector3(0,0,0),
      0.65,
      0xff668c,
      0.2,
      0.12
    );

    scene.add(frictionArrow);

    /* ---------- CREATE SOLID 3D RAMP ---------- */

    const bottomX = -2.45;
    const bottomY = 0.31;
    const length = 4.3;

    let lastAngle = NaN;

    function updateRamp(angle) {
      if (angle === lastAngle) return;

      lastAngle = angle;

      const theta =
        angle * Math.PI / 180;

      const topX =
        bottomX + length * Math.cos(theta);

      const topY =
        bottomY + length * Math.sin(theta);

      const shape = new THREE.Shape();

      shape.moveTo(bottomX,bottomY);
      shape.lineTo(topX,topY);
      shape.lineTo(topX,bottomY);
      shape.closePath();

      // A genuine extruded 3D triangular prism.
      const geometry = new THREE.ExtrudeGeometry(
        shape,
        {
          depth:2.12,
          bevelEnabled:false,
          steps:1
        }
      );

      if (wedge) {
        wedge.geometry.dispose();
        wedge.geometry = geometry;
      } else {
        wedge = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({
            color:0x386b92,
            metalness:0.15,
            roughness:0.62,
            side:THREE.DoubleSide
          })
        );

        wedge.castShadow = true;
        wedge.receiveShadow = true;

        group.add(wedge);
      }

      wedge.position.z = -1.06;

      const midX = (bottomX + topX) / 2;
      const midY = (bottomY + topY) / 2;

      deck.position.set(
        midX,midY + 0.055,0
      );

      deck.rotation.z = theta;

      for (const rail of rails) {
        rail.position.set(
          midX,
          midY + 0.13,
          rail.position.z
        );

        rail.rotation.z = theta;
      }
    }

    /* ---------- SCENE STATE ---------- */

    const state = {
      original,
      previousVisibility,
      view,
      renderer,
      scene,
      camera,
      observer:null,
      frame:0,
      azimuth:0.78,
      elevation:0.43,
      radius:9.3
    };

    active = state;

    /* ---------- RESPONSIVE RENDERING ---------- */

    function resize() {
      if (active !== state) return;

      const width = Math.max(
        original.clientWidth,1
      );

      const height = Math.max(
        original.getBoundingClientRect().height,
        250
      );

      view.style.height = height + "px";

      renderer.setSize(width,height,false);

      camera.aspect = width / height;

      camera.updateProjectionMatrix();
    }

    state.observer = new ResizeObserver(resize);

    state.observer.observe(original);

    resize();

    /* ---------- MOUSE ROTATION + ZOOM ---------- */

    let pointer = null;

    const canvas = renderer.domElement;

    canvas.addEventListener("pointerdown",e => {
      pointer = {
        id:e.pointerId,
        x:e.clientX,
        y:e.clientY
      };

      canvas.setPointerCapture(e.pointerId);

      canvas.style.cursor = "grabbing";
    });

    canvas.addEventListener("pointermove",e => {
      if (
        !pointer ||
        e.pointerId !== pointer.id
      ) return;

      state.azimuth -=
        (e.clientX - pointer.x) * 0.009;

      state.elevation = clamp(
        state.elevation +
        (e.clientY - pointer.y) * 0.006,
        0.1,
        1.42
      );

      pointer.x = e.clientX;
      pointer.y = e.clientY;
    });

    const release = () => {
      pointer = null;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener(
      "pointerup",release
    );

    canvas.addEventListener(
      "pointercancel",release
    );

    canvas.addEventListener("wheel",e => {
      e.preventDefault();

      state.radius = clamp(
        state.radius + e.deltaY * 0.008,
        5.1,
        16
      );
    },{passive:false});

    /* ---------- LIVE SIMULATION ---------- */

    function animate() {
      if (active !== state) return;

      if (
        !isRamp() ||
        !original.isConnected ||
        $("#pf3Canvas") !== original
      ) {
        destroy();
        return;
      }

      state.frame =
        requestAnimationFrame(animate);

      // Existing slider values
      const angle = getNumber(
        "pf3-angle",28
      );

      const mu = getNumber(
        "pf3-mu",0.16
      );

      const mass = getNumber(
        "pf3-mass",4
      );

      // Existing physics results
      const distance = clamp(
        parseFloat(
          metric("Distance traveled","0")
        ) || 0,
        0,4
      );

      const speed =
        parseFloat(
          metric("Block speed","0")
        ) || 0;

      const status = metric(
        "Status","Ready"
      );

      updateRamp(angle);

      const theta =
        angle * Math.PI / 180;

      const c = Math.cos(theta);
      const s = Math.sin(theta);

      const along =
        0.43 +
        (length - 0.86) * distance / 4;

      // Move the real 3D block using
      // the original simulation's distance.
      blockRoot.position.set(
        bottomX +
          (length - along) * c -
          0.46 * s,

        bottomY +
          (length - along) * s +
          0.46 * c,

        0
      );

      blockRoot.rotation.z = theta;

      // Gravity direction
      gravityArrow.position.copy(
        blockRoot.position
      );

      gravityArrow.position.y += 0.24;

      // Friction direction
      frictionArrow.position.copy(
        blockRoot.position
      );

      frictionArrow.position.z += 0.62;

      frictionArrow.setDirection(
        new THREE.Vector3(c,s,0)
      );

      frictionArrow.setLength(
        0.35 + mu * 0.8,
        0.2,
        0.12
      );

      frictionArrow.visible = mu > 0;

      // Live display
      view.querySelector(
        "#r3d-values"
      ).innerHTML =
        `${angle}° · μ=${mu.toFixed(2)} · ${mass} kg` +
        `<div>${distance.toFixed(2)} m · ` +
        `${speed.toFixed(2)} m/s · ${status}</div>`;

      /* ---------- CAMERA ---------- */

      const R = state.radius;
      const az = state.azimuth;
      const el = state.elevation;

      camera.position.set(
        Math.sin(az) *
          Math.cos(el) * R,

        1.3 + Math.sin(el) * R,

        Math.cos(az) *
          Math.cos(el) * R
      );

      camera.lookAt(0,1.3,0);

      renderer.render(scene,camera);
    }

    state.frame =
      requestAnimationFrame(animate);

    console.log(
      "PocketLab Ramp: genuine WebGL 3D running."
    );
  }

  /* ---------- CONNECT TO EXISTING POCKETLAB ---------- */

  // script.js creates #pf3Canvas whenever Ramp opens.
  // Detect it automatically; no HTML changes needed.

  setInterval(() => {
    mount().catch(console.error);
  },500);

  if (document.readyState !== "loading") {
    mount().catch(console.error);
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      () => mount().catch(console.error)
    );
  }

})();

/* =========================================================
   POCKETLAB - REAL 3D PHYSICS EXPERIMENTS
   PASTE AT THE VERY BOTTOM OF visuals.js
   Do not delete existing code.
========================================================= */

(() => {
  "use strict";

  if (window.__POCKETLAB_EXTRA_3D__) return;
  window.__POCKETLAB_EXTRA_3D__ = true;

  const $ = s => document.querySelector(s);
  const clamp = (v, a, b) =>
    Math.max(a, Math.min(b, v));

  const LABS = [
    [/car motion & braking/i, "car"],
    [/colliding carts/i, "collision"],
    [/pulley & (lifting )?load/i, "pulley"],
    [/electromagnetic induction/i, "induction"],
    [/animated magnetic field/i, "field"],
    [/electromagnet & coil/i, "coil"],
    [/magnet & compass/i, "compass"],
    [/electric motor/i, "motor"],
    [/simple pendulum/i, "pendulum"],
    [/spring & hooke/i, "spring"],
    [/light reflection/i, "reflection"],
    [/light refraction/i, "refraction"],
    [/lens & refraction/i, "lens"],
    [/planetary orbit/i, "orbit"],
    [/newton.s cradle/i, "cradle"]
  ];

  function currentLab() {
    if (
      !$("#experimentWorkspace")
        ?.classList.contains("active")
    ) return "";

    const title =
      $("#activeExperimentTitle")?.textContent || "";

    return LABS.find(
      ([pattern]) => pattern.test(title)
    )?.[1] || "";
  }

  function value(key, fallback = 0) {
    for (const id of [
      "pf3-" + key,
      "plx-" + key,
      "phy_" + key,
      key
    ]) {
      const input = document.getElementById(id);

      if (input) {
        return Number(input.value) || 0;
      }
    }

    return fallback;
  }

  function reading(name, fallback = 0) {
    const tiles = document.querySelectorAll(
      "#experimentResults .pf3-tile," +
      "#experimentResults .plx-reading"
    );

    for (const tile of tiles) {
      const label = tile.querySelector("small")
        ?.textContent.trim().toLowerCase();

      if (label === name.toLowerCase()) {
        const number = parseFloat(
          tile.querySelector("strong")?.textContent
        );

        return Number.isFinite(number)
          ? number
          : fallback;
      }
    }

    return fallback;
  }

  function findStage(kind) {
    const pf = $("#pf3Canvas");
    const pl = $("#plxCanvas");
    const ph = $("#phyScene");

    if (["collision", "pulley"].includes(kind)) {
      return pf ? {
        host: pf.parentElement,
        target: pf,
        hide: [pf]
      } : null;
    }

    if ([
      "car", "field", "coil", "compass",
      "motor", "refraction", "orbit"
    ].includes(kind)) {
      return pl ? {
        host: pl.parentElement,
        target: pl,
        hide: [pl]
      } : null;
    }

    if ([
      "induction", "pendulum", "spring",
      "lens", "cradle"
    ].includes(kind)) {
      return ph ? {
        host: ph.parentElement,
        target: ph,
        hide: [ph]
      } : null;
    }

    if (kind === "reflection") {
      const host = $("#simulationCanvas");

      return host ? {
        host,
        target: host,
        hide: [...host.children]
      } : null;
    }

    return null;
  }

  /* =========================
     3D VIEW STYLES
  ========================= */

  const style = document.createElement("style");

  style.textContent = `
    .pl-real3d {
      position:absolute;
      inset:0;
      z-index:8;
      overflow:hidden;
      border-radius:14px;
      background:#08192d;
      touch-action:none;
    }

    .pl-real3d canvas {
      display:block;
      width:100%;
      height:100%;
      cursor:grab;
      touch-action:none;
    }

    .pl-real3d-label {
      position:absolute;
      left:15px;
      top:12px;
      z-index:3;
      color:#b9eaff;
      pointer-events:none;
      font:600 12px/1.6 Arial,sans-serif;
      text-shadow:0 2px 6px #000;
    }

    .pl-real3d-label strong {
      display:block;
      font-size:16px;
      color:#6befff;
    }

    .pl-real3d-help {
      position:absolute;
      left:15px;
      bottom:12px;
      z-index:3;
      color:#b1d0e8;
      font:12px Arial,sans-serif;
      pointer-events:none;
    }
  `;

  document.head.appendChild(style);

  let THREE = null;
  let loading = null;
  let active = null;
  let opening = false;
  let failedAt = 0;

  async function loadThree() {
    if (THREE) return THREE;

    if (!loading) {
      loading = import(
        "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"
      ).catch(() => import("./three.module.js"));
    }

    THREE = await loading;
    return THREE;
  }

  /* =========================
     MESH HELPERS
  ========================= */

  function buildExperiment(T, scene, kind) {
    const root = new T.Group();
    scene.add(root);

    const material = color =>
      new T.MeshStandardMaterial({
        color,
        metalness:0.16,
        roughness:0.43
      });

    function mesh(parent, geometry, color, x=0,y=0,z=0) {
      const object = new T.Mesh(
        geometry,
        material(color)
      );

      object.position.set(x,y,z);
      object.castShadow = true;
      object.receiveShadow = true;

      parent.add(object);
      return object;
    }

    function box(parent,w,h,d,color,x=0,y=0,z=0) {
      return mesh(
        parent,
        new T.BoxGeometry(w,h,d),
        color,x,y,z
      );
    }

    function ball(parent,r,color,x=0,y=0,z=0) {
      return mesh(
        parent,
        new T.SphereGeometry(r,28,20),
        color,x,y,z
      );
    }

    function disc(parent,r,depth,color,x=0,y=0,z=0) {
      const obj = mesh(
        parent,
        new T.CylinderGeometry(r,r,depth,40),
        color,x,y,z
      );

      obj.rotation.x = Math.PI / 2;
      return obj;
    }

    function tube(parent,points,r,color) {
      const curve = new T.CatmullRomCurve3(
        points.map(p => new T.Vector3(...p))
      );

      return mesh(
        parent,
        new T.TubeGeometry(
          curve,
          Math.max(40,points.length*8),
          r,8,false
        ),
        color
      );
    }

    function rod(parent,color,r=.035) {
      return mesh(
        parent,
        new T.CylinderGeometry(r,r,1,12),
        color
      );
    }

    function moveRod(object,a,b) {
      const A = new T.Vector3(...a);
      const B = new T.Vector3(...b);

      const direction = B.clone().sub(A);

      object.position.copy(A)
        .add(B)
        .multiplyScalar(.5);

      object.scale.y = Math.max(
        direction.length(),.001
      );

      object.quaternion.setFromUnitVectors(
        new T.Vector3(0,1,0),
        direction.normalize()
      );
    }

    let update = () => {};

    /* =========================
       1. REAL 3D CAR
    ========================= */

    if (kind === "car") {
      box(root,10,.14,3.8,0x31485d,0,.1,0);

      for (let i=-4;i<5;i++) {
        box(
          root,.55,.02,.07,
          0xffe2a0,i*1.05,.195,0
        );
      }

      const car = new T.Group();
      root.add(car);

      box(car,2.7,.65,1.25,0x187fe2,0,.87,0);
      box(car,1.3,.58,1.12,0x49adf2,-.15,1.43,0);

      box(car,.9,.34,.025,0xa4eaff,-.14,1.48,.575);
      box(car,.9,.34,.025,0xa4eaff,-.14,1.48,-.575);

      box(car,.1,.2,1.15,0xffe38b,1.36,.9,0);
      box(car,.1,.2,1.15,0xff7386,-1.36,.9,0);

      const wheels = [];

      for (const x of [-.82,.85]) {
        for (const z of [-.7,.7]) {
          const wheel = disc(
            car,.37,.22,0x171e2b,x,.5,z
          );

          disc(wheel,.18,.24,0xc5dbe9);
          wheels.push(wheel);
        }
      }

      update = () => {
        const distance = reading("Distance",0);
        const speed = reading("Speed",0);

        car.position.x = clamp(
          -2.4+distance*.24,-2.4,2.4
        );

        wheels.forEach(wheel => {
          wheel.rotation.z = -distance/.37;
        });

        car.position.y = speed>.1
          ? Math.sin(performance.now()*.012)*.009
          : 0;
      };
    }

    /* =========================
       2. COLLIDING CARTS
    ========================= */

    if (kind === "collision") {
      box(root,10,.16,2.5,0x2d465d,0,.15,0);

      for (const z of [-.55,.55]) {
        box(root,10,.055,.1,0x9cb9d1,0,.29,z);
      }

      function createCart(color) {
        const cart = new T.Group();
        root.add(cart);

        box(cart,1.1,.55,1.24,color,0,.86,0);
        box(cart,.75,.12,.88,0xbddaea,0,1.19,0);

        for (const x of [-.38,.38]) {
          for (const z of [-.67,.67]) {
            disc(cart,.22,.15,0x172334,x,.47,z);
          }
        }

        return cart;
      }

      const blue = createCart(0x238fe5);
      const orange = createCart(0xf5a04d);

      update = () => {
        const t = reading("Elapsed time",0);
        const speed = value("speed",3);
        const m1 = value("m1",3);
        const m2 = value("m2",5);
        const e = value("restitution",.9);

        const collisionTime =
          2.83 / Math.max(speed,.01);

        const after = Math.max(
          0,t-collisionTime
        );

        const v1 =
          (m1-e*m2)*speed/(m1+m2);

        const v2 =
          (1+e)*m1*speed/(m1+m2);

        const x1 =
          1.25 +
          speed*Math.min(t,collisionTime) +
          v1*after;

        const x2 = 5.15+v2*after;

        blue.position.x = clamp(
          (x1-3.65)*1.05,-5,5
        );

        orange.position.x = clamp(
          (x2-3.65)*1.05,-5,5
        );
      };
    }

    /* =========================
       3. PULLEY
    ========================= */

    if (kind === "pulley") {
      box(root,5.5,.22,.6,0xa9c2d4,0,4.1,0);
      box(root,.16,4,.3,0x607e96,-2.35,2.05,0);

      const wheel = disc(
        root,.66,.38,0x537d9f,1,3.5,0
      );

      disc(root,.14,.44,0xf4c66b,1,3.5,0);

      const load = box(
        root,1.25,.9,1,
        0x299adf,.45,.65,0
      );

      const rope1 = rod(root,0xffd78b);
      const rope2 = rod(root,0xffd78b);

      update = () => {
        const rise = clamp(
          reading("Load lifted",0),0,1.5
        );

        load.position.y = .67+rise*1.65;

        moveRod(
          rope1,
          [.45,load.position.y+.45,0],
          [.45,3.52,0]
        );

        moveRod(
          rope2,
          [1.55,load.position.y+.45,0],
          [1.55,3.52,0]
        );

        wheel.rotation.z = rise*.75;

        load.scale.x =
          .8+value("mass",5)*.04;
      };
    }

    /* =========================
       4-7. MAGNETS AND COILS
    ========================= */

    if ([
      "induction","field","coil","compass"
    ].includes(kind)) {
      const magnet = new T.Group();
      root.add(magnet);

      box(
        magnet,1.3,.62,.6,
        0xe95858,-.65,1.65,0
      );

      box(
        magnet,1.3,.62,.6,
        0x3788e4,.65,1.65,0
      );

      // Three-dimensional field lines
      for (const z of [-1.25,0,1.25]) {
        for (const sign of [-1,1]) {
          const points = [];

          for(let i=0;i<=30;i++) {
            const t=i/30;

            points.push([
              -1.95+3.9*t,
              1.66+
                sign*Math.sin(Math.PI*t)*
                (1.1+Math.abs(z)*.24),
              z
            ]);
          }

          tube(root,points,.019,0x5ed8f8);
        }
      }

      let copperCoil;

      if (
        kind === "coil" ||
        kind === "induction"
      ) {
        const points = [];

        for(let i=0;i<=240;i++) {
          const t=i/240;
          const angle=t*Math.PI*22;

          points.push([
            1.5+t*2.4,
            1.65+Math.cos(angle)*.64,
            Math.sin(angle)*.64
          ]);
        }

        copperCoil = tube(
          root,points,.055,0xe8a34e
        );

        box(
          root,2.8,.18,.85,
          0x728fa4,2.7,.52,0
        );
      }

      if (kind === "compass") {
        disc(
          root,.95,.12,0xd3e4ed,
          2.5,.92,0
        );

        const needle = box(
          root,1.45,.08,.15,
          0xec5058,2.5,1.02,0
        );

        update = t => {
          const heading =
            value("angle",0)*Math.PI/180;

          magnet.rotation.y = heading;

          needle.rotation.y =
            heading+Math.sin(t)*.1;

          magnet.position.x =
            -Math.min(
              2.5,value("distance",2.3)
            )*.35;
        };
      } else {
        update = t => {
          const strength =
            value("strength",65)/100;

          magnet.rotation.z =
            value("rotation",0)*Math.PI/180;

          if (kind === "induction") {
            magnet.position.x = Math.sin(
              t*(.6+
              Math.abs(value("rate",.5))*3)
            )*.65;

            copperCoil.scale.x =
              .75+value("turns",80)/320;
          }

          if (kind === "coil") {
            magnet.rotation.y =
              value("polarity",1)<0
                ? Math.PI
                : 0;

            const current =
              value("current",2);

            copperCoil.material.emissive =
              new T.Color(0x512100);

            copperCoil.material.emissiveIntensity =
              clamp(current/3,0,2);
          }

          if (kind === "field") {
            magnet.scale.setScalar(
              .8+strength*.4
            );
          }
        };
      }
    }

    /* =========================
       8. ELECTRIC MOTOR
    ========================= */

    if (kind === "motor") {
      const rotor = new T.Group();
      root.add(rotor);

      rotor.position.y = 1.75;

      box(root,1,.9,1.8,0xe8575e,-2.05,1.85,0);
      box(root,1,.9,1.8,0x348de5,2.05,1.85,0);

      disc(rotor,1.07,.6,0xb8884c);

      for(let i=0;i<8;i++) {
        const blade = box(
          rotor,1.35,.16,.2,
          0xe9b65d
        );

        blade.rotation.z=i*Math.PI/4;
      }

      tube(
        root,
        [
          [-2.5,.15,0],
          [-2.5,.15,-1.7],
          [2.5,.15,-1.7],
          [2.5,.15,0]
        ],
        .055,
        0xef9d6b
      );

      update = t => {
        const power =
          value("current",2.5)*
          value("field",.9);

        rotor.rotation.z =
          t*power*2.3/
          (1+value("load",25)/70);
      };
    }

    /* =========================
       9. SIMPLE PENDULUM
    ========================= */

    if (kind === "pendulum") {
      box(root,4.4,.20,.5,0xaecbdc,0,4.15,0);

      for(const x of [-1.8,1.8]) {
        box(
          root,.14,4.1,.3,
          0x66869b,x,2.05,0
        );
      }

      const pivot = new T.Group();
      pivot.position.y=4;
      root.add(pivot);

      const string = rod(
        pivot,0xd1e6f3
      );

      const bob = ball(
        pivot,.36,0xf7ae4d
      );

      update = t => {
        const length=value("length",1.5);
        const gravity=value("gravity",9.8);

        const amplitude =
          value("angle",20)*Math.PI/180;

        const period =
          2*Math.PI*
          Math.sqrt(
            length/Math.max(gravity,.1)
          );

        pivot.rotation.z =
          amplitude*
          Math.cos(2*Math.PI*t/period);

        moveRod(
          string,
          [0,0,0],
          [0,-length,0]
        );

        bob.position.y=-length;
      };
    }

    /* =========================
       10. SPRING AND HOOKE'S LAW
    ========================= */

    if (kind === "spring") {
      box(root,3.8,.2,.55,0xa4c2d6,0,4.15,0);

      const points=[];

      for(let i=0;i<=180;i++) {
        const t=i/180;
        const a=t*Math.PI*22;

        points.push([
          Math.sin(a)*.33,
          -t,
          Math.cos(a)*.33
        ]);
      }

      const spring = tube(
        root,points,.048,0xb5eeff
      );

      spring.position.y=4.05;

      const weight=box(
        root,1,.75,1,0x457fe2
      );

      update=()=> {
        const extension =
          value("extension",15)/100;

        const length =
          1.45+extension*2.3;

        spring.scale.y=length;

        weight.position.y =
          4.05-length-.4;
      };
    }

    /* =========================
       11-13. LIGHT EXPERIMENTS
    ========================= */

    if ([
      "reflection","refraction","lens"
    ].includes(kind)) {
      const incident=rod(
        root,0xffda77,.05
      );

      const outgoing=rod(
        root,0x67ebff,.05
      );

      if (kind === "reflection") {
        box(
          root,5,.16,2,
          0xa0b4c7,0,.55,0
        );

        const normal=rod(
          root,0xb3c6d8,.016
        );

        moveRod(
          normal,
          [0,.65,0],
          [0,3.6,0]
        );

        update=()=>{
          const a =
            value("angle",35)*Math.PI/180;

          moveRod(
            incident,
            [
              -Math.sin(a)*2.5,
              .65+Math.cos(a)*2.5,
              0
            ],
            [0,.65,0]
          );

          moveRod(
            outgoing,
            [0,.65,0],
            [
              Math.sin(a)*2.5,
              .65+Math.cos(a)*2.5,
              0
            ]
          );
        };
      }

      if (kind === "refraction") {
        const glass=box(
          root,5,1.1,2.8,
          0x286d9c,0,.55,0
        );

        glass.material.transparent=true;
        glass.material.opacity=.55;

        update=()=>{
          const angle =
            value("angle",40)*Math.PI/180;

          const n1=value("n1",1);
          const n2=value("n2",1.5);

          const sine =
            n1/n2*Math.sin(angle);

          moveRod(
            incident,
            [
              -Math.sin(angle)*2.6,
              1.15+Math.cos(angle)*2.6,
              0
            ],
            [0,1.15,0]
          );

          if(Math.abs(sine)<=1) {
            const refracted=
              Math.asin(sine);

            moveRod(
              outgoing,
              [0,1.15,0],
              [
                Math.sin(refracted)*2.5,
                1.15-
                Math.cos(refracted)*2.5,
                0
              ]
            );
          } else {
            moveRod(
              outgoing,
              [0,1.15,0],
              [
                Math.sin(angle)*2.5,
                1.15+
                Math.cos(angle)*2.5,
                0
              ]
            );
          }
        };
      }

      if (kind === "lens") {
        const lens=ball(
          root,1.15,0x54c9ef,0,1.9,0
        );

        lens.scale.set(.28,1.5,1);
        lens.material.transparent=true;
        lens.material.opacity=.65;

        box(
          root,.12,1.9,.16,
          0xb1d9eb,0,.9,0
        );

        update=()=>{
          const u=clamp(
            value("distance",30)/10,
            1.7,4
          );

          const f=clamp(
            value("focal",10)/10,
            .5,2
          );

          moveRod(
            incident,
            [-u,2.6,0],
            [0,1.9,0]
          );

          const v =
            Math.abs(u-f)>.01
              ? f*u/(u-f)
              : 5;

          moveRod(
            outgoing,
            [0,1.9,0],
            [clamp(v,-4,4),1,0]
          );
        };
      }
    }

    /* =========================
       14. PLANETARY ORBIT
    ========================= */

    if (kind === "orbit") {
      ball(root,.82,0xffbd42,0,1.6,0);

      const planet=ball(
        root,.28,0x3896ef,2.6,1.6,0
      );

      const points=[];

      for(let i=0;i<=80;i++) {
        const a=i/80*Math.PI*2;

        points.push([
          Math.cos(a)*2.6,
          1.6,
          Math.sin(a)*2.6
        ]);
      }

      const track=tube(
        root,points,.016,0x6eadd7
      );

      update=t=>{
        const radius=value("radius",1);
        const periodFactor=
          Math.sqrt(radius**3);

        planet.position.set(
          2.6*radius*
            Math.cos(t/periodFactor),
          1.6,
          2.6*radius*
            Math.sin(t/periodFactor)
        );

        track.scale.set(radius,1,radius);
      };
    }

    /* =========================
       15. NEWTON'S CRADLE
    ========================= */

    if (kind === "cradle") {
      box(root,4.4,.16,.5,0xadcbdc,0,4.15,0);

      const pendulums=[];

      for(let i=0;i<5;i++) {
        const x=(i-2)*.68;

        const pivot=new T.Group();

        pivot.position.set(x,4,0);
        root.add(pivot);

        const wire=rod(
          pivot,0xc8e5f3,.022
        );

        moveRod(
          wire,
          [0,0,0],
          [0,-2.1,0]
        );

        ball(
          pivot,.33,
          i%2 ? 0xbdd2df : 0xf1b04d,
          0,-2.1,0
        );

        pendulums.push(pivot);
      }

      update=t=>{
        pendulums[0].rotation.z =
          Math.sin(t*2.5)*.42;

        pendulums[4].rotation.z =
          Math.sin(t*2.5+Math.PI)*.42;
      };
    }

    return update;
  }

  /* =========================
     CLEANUP
  ========================= */

  function closeScene() {
    if(!active)return;

    const old=active;
    active=null;

    cancelAnimationFrame(old.frame);
    old.resize.disconnect();

    old.hidden.forEach(([node,opacity])=>{
      if(node.isConnected) {
        node.style.opacity=opacity;
      }
    });

    old.host.style.position =
      old.oldPosition;

    old.host.style.minHeight =
      old.oldMinHeight;

    old.scene.traverse(object=>{
      object.geometry?.dispose();

      if(object.material) {
        const list=Array.isArray(object.material)
          ? object.material
          : [object.material];

        list.forEach(m=>m.dispose());
      }
    });

    old.renderer.dispose();
    old.view.remove();
  }

  /* =========================
     BUILD THE WEBGL WORLD
  ========================= */

  async function openScene(kind,stage) {
    if(opening)return;
    opening=true;

    let T;

    try {
      T=await loadThree();
    } catch(error) {
      loading=null;
      failedAt=Date.now();
      opening=false;

      console.error(
        "Three.js unavailable; original lab retained",
        error
      );

      return;
    }

    opening=false;

    if(
      currentLab()!==kind ||
      !stage.target.isConnected ||
      active
    ) return;

    const host=stage.host;
    const view=document.createElement("div");

    view.className="pl-real3d";

    view.innerHTML=`
      <div class="pl-real3d-label">
        <strong>POCKETLAB · REAL 3D</strong>
        THREE.JS WEBGL SIMULATION
      </div>

      <div class="pl-real3d-help">
        DRAG TO ROTATE · SCROLL TO ZOOM
      </div>
    `;

    const renderer=new T.WebGLRenderer({
      antialias:true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio||1,2)
    );

    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=
      T.PCFSoftShadowMap;

    renderer.outputColorSpace=
      T.SRGBColorSpace;

    renderer.toneMapping=
      T.ACESFilmicToneMapping;

    renderer.toneMappingExposure=1.5;

    view.prepend(renderer.domElement);

    const scene=new T.Scene();

    scene.background=new T.Color(
      0x07182b
    );

    const camera=new T.PerspectiveCamera(
      44,2,.1,70
    );

    scene.add(
      new T.HemisphereLight(
        0xbbeeff,0x354357,2
      )
    );

    const sunlight=new T.DirectionalLight(
      0xffefd8,3.2
    );

    sunlight.position.set(-3,8,6);
    sunlight.castShadow=true;
    scene.add(sunlight);

    const floor=new T.Mesh(
      new T.PlaneGeometry(30,30),
      new T.MeshStandardMaterial({
        color:0x152b40,
        roughness:.9
      })
    );

    floor.rotation.x=-Math.PI/2;
    floor.receiveShadow=true;
    scene.add(floor);

    const grid=new T.GridHelper(
      22,22,0x386d8d,0x213d54
    );

    grid.position.y=.015;
    scene.add(grid);

    const update=buildExperiment(
      T,scene,kind
    );

    /* Keep original physics running */

    const hidden=stage.hide.map(
      node=>[node,node.style.opacity]
    );

    hidden.forEach(([node])=>{
      node.style.opacity="0";
    });

    const oldPosition=host.style.position;
    const oldMinHeight=host.style.minHeight;

    host.style.position="relative";

    if(kind==="reflection") {
      host.style.minHeight="390px";
    }

    host.appendChild(view);

    const state={
      kind,
      host,
      view,
      scene,
      camera,
      renderer,
      hidden,
      oldPosition,
      oldMinHeight,
      frame:0,
      resize:null,
      azimuth:.85,
      elevation:.5,
      distance:10,
      clock:0,
      previous:0
    };

    active=state;

    /* =========================
       SIZE
    ========================= */

    function resize() {
      if(active!==state)return;

      const rect=host.getBoundingClientRect();

      const width=Math.max(
        rect.width,1
      );

      const naturalHeight=
        stage.target===host
          ? rect.height
          : stage.target
              .getBoundingClientRect().height;

      const height=kind==="reflection"
        ? Math.max(390,naturalHeight)
        : Math.max(280,naturalHeight);

      view.style.height=height+"px";

      renderer.setSize(
        width,height,false
      );

      camera.aspect=width/height;
      camera.updateProjectionMatrix();
    }

    state.resize=new ResizeObserver(
      resize
    );

    state.resize.observe(host);
    resize();

    /* =========================
       DRAG TO ROTATE
    ========================= */

    let pointer=null;
    const canvas=renderer.domElement;

    canvas.addEventListener(
      "pointerdown",e=>{
        pointer={
          id:e.pointerId,
          x:e.clientX,
          y:e.clientY
        };

        canvas.setPointerCapture(
          e.pointerId
        );
      }
    );

    canvas.addEventListener(
      "pointermove",e=>{
        if(
          !pointer ||
          pointer.id!==e.pointerId
        ) return;

        state.azimuth -=
          (e.clientX-pointer.x)*.009;

        state.elevation=clamp(
          state.elevation+
            (e.clientY-pointer.y)*.006,
          .12,1.35
        );

        pointer.x=e.clientX;
        pointer.y=e.clientY;
      }
    );

    const release=()=>pointer=null;

    canvas.addEventListener(
      "pointerup",release
    );

    canvas.addEventListener(
      "pointercancel",release
    );

    canvas.addEventListener(
      "wheel",e=>{
        e.preventDefault();

        state.distance=clamp(
          state.distance+
            e.deltaY*.008,
          5,17
        );
      },
      {passive:false}
    );

    /* =========================
       ANIMATION LOOP
    ========================= */

    function animate(now) {
      if(active!==state)return;

      if(
        currentLab()!==kind ||
        !stage.target.isConnected
      ) {
        closeScene();
        return;
      }

      state.frame=requestAnimationFrame(
        animate
      );

      if(!state.previous) {
        state.previous=now;
      }

      const dt=Math.min(
        (now-state.previous)/1000,
        .05
      );

      state.previous=now;

      const physicsLab=[
        "induction","pendulum",
        "spring","lens","cradle"
      ].includes(kind);

      const paused=physicsLab &&
        $("#phyPlay")?.textContent
          .includes("Play");

      if(!paused) {
        state.clock+=dt;
      }

      const liveTime=reading(
        "Elapsed time",
        state.clock
      );

      const time=physicsLab
        ? state.clock
        : liveTime;

      // Update meshes from existing sliders
      // and original physics readings.
      update(time);

      const horizontal=
        state.distance*
        Math.cos(state.elevation);

      camera.position.set(
        Math.sin(state.azimuth)*
          horizontal,

        2+
          state.distance*
          Math.sin(state.elevation),

        Math.cos(state.azimuth)*
          horizontal
      );

      camera.lookAt(0,1.5,0);

      renderer.render(
        scene,camera
      );
    }

    state.frame=requestAnimationFrame(
      animate
    );

    console.info(
      "PocketLab genuine WebGL 3D:",
      kind
    );
  }

  /* =========================
     AUTOMATIC CONNECTION
  ========================= */

  setInterval(()=>{
    const kind=currentLab();

    if(!kind) {
      if(active)closeScene();
      return;
    }

    const stage=findStage(kind);

    if(!stage) {
      if(active)closeScene();
      return;
    }

    if(
      active &&
      (
        active.kind!==kind ||
        !active.view.isConnected ||
        !active.host.isConnected
      )
    ) {
      closeScene();
    }

    if(
      !active &&
      !opening &&
      Date.now()-failedAt>4500
    ) {
      openScene(kind,stage).catch(error=>{
        opening=false;
        failedAt=Date.now();

        console.error(
          "PocketLab 3D failed:",
          error
        );
      });
    }
  },400);

})();

/* ================================================
   POCKETLAB — FIX 3D CAR TYRES
   PASTE AT THE VERY END OF visuals.js
   Keep all existing code above unchanged.
================================================ */

(() => {
  "use strict";

  if (window.__POCKETLAB_WHEEL_FIX_V2__) return;
  window.__POCKETLAB_WHEEL_FIX_V2__ = true;

  async function startWheelFix() {
    let THREE;

    try {
      THREE = await import(
        "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"
      );
    } catch {
      try {
        THREE = await import("./three.module.js");
      } catch (error) {
        console.warn("Three.js wheel fix unavailable", error);
        return;
      }
    }

    const oldUpdate =
      THREE.Object3D.prototype.updateMatrixWorld;

    function carIsOpen() {
      const title =
        document.getElementById("activeExperimentTitle")
          ?.textContent || "";

      return /car motion\s*&\s*braking/i.test(title);
    }

    function getDistance() {
      const tiles = document.querySelectorAll(
        "#experimentResults .plx-reading"
      );

      for (const tile of tiles) {
        const name = tile.querySelector("small")
          ?.textContent.trim().toLowerCase();

        if (name === "distance") {
          const number = parseFloat(
            tile.querySelector("strong")?.textContent
          );

          return Number.isFinite(number) ? number : 0;
        }
      }

      return 0;
    }

    function isWheel(object) {
      if (
        !object.isMesh ||
        !object.geometry?.isCylinderGeometry
      ) return false;

      const p = object.geometry.parameters;

      return (
        Math.abs(p.radiusTop - 0.37) < 0.001 &&
        Math.abs(p.height - 0.22) < 0.001
      );
    }

    function decorateWheel(wheel) {
      if (wheel.userData.pocketWheelReady) return;

      wheel.userData.pocketWheelReady = true;

      // Align existing silver hub with the tyre.
      wheel.children.forEach(child => {
        if (
          child.isMesh &&
          child.geometry?.isCylinderGeometry &&
          Math.abs(
            child.geometry.parameters.radiusTop - 0.18
          ) < 0.001
        ) {
          child.rotation.x = 0;
        }
      });

      const silver = new THREE.MeshStandardMaterial({
        color: 0xe8f5ff,
        metalness: 0.7,
        roughness: 0.25
      });

      const yellow = new THREE.MeshStandardMaterial({
        color: 0xffd34f,
        emissive: 0xff9200,
        emissiveIntensity: 0.35
      });

      // Add six visible spokes on both wheel faces.
      for (const side of [-1, 1]) {
        for (let i = 0; i < 6; i++) {
          const angle = i * Math.PI / 3;

          const spoke = new THREE.Mesh(
            new THREE.BoxGeometry(
              0.055, 0.022, 0.19
            ),
            silver
          );

          spoke.position.set(
            Math.sin(angle) * 0.24,
            side * 0.147,
            Math.cos(angle) * 0.24
          );

          spoke.rotation.y = angle;
          wheel.add(spoke);
        }

        // Yellow dot makes spinning easy to see.
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(
            0.055, 12, 8
          ),
          yellow
        );

        dot.position.set(
          0,
          side * 0.15,
          0.305
        );

        wheel.add(dot);
      }
    }

    // Correct the existing wheel mesh on every frame.
    THREE.Object3D.prototype.updateMatrixWorld =
      function(force) {

        if (carIsOpen() && isWheel(this)) {
          decorateWheel(this);

          const distance = getDistance();
          const tyreRadius = 0.37;

          // Rolling without slipping:
          // angle = distance / wheel radius
          const angle = -distance / tyreRadius;

          // Cylinder's true axle is local Y,
          // after turning it sideways around X.
          this.rotation.set(
            Math.PI / 2,
            angle,
            0,
            "XYZ"
          );
        }

        return oldUpdate.call(this, force);
      };

    console.log(
      "PocketLab: 3D car tyres corrected."
    );
  }

  startWheelFix();
})();


/* =================================================
   POCKETLAB — CAR TYRE REPAIR V3
   PASTE AT THE VERY BOTTOM OF visuals.js
   Fixes the ACTUAL Car Motion & Braking model
================================================= */

(() => {
  "use strict";

  if (window.__POCKETLAB_WHEEL_FIX_V3__) return;
  window.__POCKETLAB_WHEEL_FIX_V3__ = true;

  (async () => {
    let THREE;

    try {
      THREE = await import(
        "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"
      );
    } catch {
      try {
        THREE = await import("./three.module.js");
      } catch (error) {
        console.error("Three.js unavailable", error);
        return;
      }
    }

    const originalUpdate =
      THREE.Object3D.prototype.updateMatrixWorld;

    const silver = new THREE.MeshStandardMaterial({
      color: 0xe8f6ff,
      metalness: 0.65,
      roughness: 0.28
    });

    const yellow = new THREE.MeshStandardMaterial({
      color: 0xffc400,
      emissive: 0xff9500,
      emissiveIntensity: 0.6
    });

    function carOpen() {
      const title = document.getElementById(
        "activeExperimentTitle"
      )?.textContent || "";

      return /car motion\s*&\s*braking/i.test(title);
    }

    function carTyre(object) {
      if (
        !object.isMesh ||
        object.geometry?.type !== "CylinderGeometry"
      ) return false;

      if (object.userData.pocketTyreV3) {
        return true;
      }

      const p = object.geometry.parameters;

      return (
        Math.abs(p.radiusTop - 0.37) < 0.002 &&
        Math.abs(p.height - 0.22) < 0.002 &&
        object.parent?.isGroup
      );
    }

    function upgrade(wheel) {
      wheel.userData.pocketTyreV3 = true;

      // Prevent earlier incorrect tyre patch
      // from changing this wheel's rotation.
      // Mesh geometry itself is not resized.
      wheel.geometry.parameters.radiusTop = 0.381;

      // Keep original hub, remove misplaced
      // decorations from earlier fix.
      for (const child of [...wheel.children]) {
        const p = child.geometry?.parameters;

        if (
          child.isMesh &&
          child.geometry?.type === "CylinderGeometry" &&
          Math.abs(p?.radiusTop - 0.18) < 0.002
        ) {
          child.rotation.x = 0;
        } else if (child.isMesh) {
          wheel.remove(child);
          child.geometry?.dispose();
          child.material?.dispose();
        }
      }

      // Decorative rims and rotating spokes
      // on both visible sides of each tyre.
      for (const side of [-1, 1]) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(
            0.255, 0.024, 8, 40
          ),
          silver
        );

        ring.rotation.x = Math.PI / 2;
        ring.position.y = side * 0.145;
        wheel.add(ring);

        for (let i = 0; i < 5; i++) {
          const angle = i * Math.PI * 2 / 5;

          const spoke = new THREE.Mesh(
            new THREE.BoxGeometry(
              0.045, 0.024, 0.26
            ),
            silver
          );

          spoke.position.set(
            Math.sin(angle) * 0.135,
            side * 0.148,
            Math.cos(angle) * 0.135
          );

          spoke.rotation.y = angle;
          wheel.add(spoke);
        }

        // Yellow marker shows tyre rotation.
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(
            0.06, 12, 10
          ),
          yellow
        );

        marker.position.set(
          0.275,
          side * 0.158,
          0
        );

        wheel.add(marker);
      }
    }

    // Repair only the existing car tyre meshes.
    THREE.Object3D.prototype.updateMatrixWorld =
      function(force) {

        if (carOpen() && carTyre(this)) {
          if (!this.userData.pocketTyreV3) {
            upgrade(this);
          }

          // Correct 3D rolling orientation.
          // Existing car physics updates rotation.z
          // according to distance / wheel radius.
          this.rotation.order = "ZXY";
          this.rotation.x = Math.PI / 2;
          this.rotation.y = 0;
        }

        return originalUpdate.call(this, force);
      };

    console.log(
      "PocketLab: 3D tyres repaired successfully"
    );
  })();
})();

/* =============================================================
 POCKETLAB - SEVEN PHYSICS LABS REPAIR (REAL THREE.JS WEBGL)
 PASTE AT THE VERY BOTTOM OF visuals.js (NOT script.js)
 Existing workspaces, sliders, quiz, progress and backend remain.
 ============================================================= */
(() => {
  'use strict';
  if (window.__PL_SEVEN_3D_REPAIR__) return;
  window.__PL_SEVEN_3D_REPAIR__ = true;

  const $ = (s, root = document) => root.querySelector(s);
  const cap = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const KINDS = [
    [/animated magnetic field/i, 'field'],
    [/electromagnet\s*&\s*coil/i, 'electromagnet'],
    [/electric motor/i, 'motor'],
    [/simple pendulum/i, 'pendulum'],
    [/thermal expansion/i, 'thermal'],
    [/photoelectric effect/i, 'photoelectric'],
    [/electromagnetic induction/i, 'induction']
  ];
  const ownButtons = new Set(['thermal', 'photoelectric']);
  const memory = {};
  let active = null;
  let lastKind = '';
  let loading = null;
  let failedAt = 0;

  function kindNow() {
    if (!$('#experimentWorkspace')?.classList.contains('active')) return '';
    const title = $('#activeExperimentTitle')?.textContent || '';
    return KINDS.find(([pattern]) => pattern.test(title))?.[1] || '';
  }

  function num(key, fallback) {
    const ids = [
      'plx-' + key, key,
      'pli' + key[0].toUpperCase() + key.slice(1)
    ];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.value !== undefined) {
        const n = Number(el.value);
        if (Number.isFinite(n)) return n;
      }
    }
    return fallback;
  }

  function stageFor(kind) {
    if (['field','electromagnet','motor'].includes(kind)) {
      return $('#plxCanvas')?.closest('.plx-scene') || null;
    }
    if (kind === 'induction') {
      return $('#simulationCanvas .pli-scene') ||
             $('#simulationCanvas .pl-scene') || null;
    }
    return $('#simulationCanvas .pl-scene') || null;
  }

  const css = document.createElement('style');
  css.textContent = `
    .pl7-stage{position:relative!important;overflow:hidden!important;}
    .pl7-stage>.pl7-view{position:absolute;inset:0;z-index:90;
      background:#071729;border-radius:12px;overflow:hidden;touch-action:none;}
    .pl7-view canvas{width:100%;height:100%;display:block;touch-action:none;cursor:grab;}
    .pl7-stage>.pl-real3d{display:none!important;}
    .pl7-heading{position:absolute;top:12px;left:14px;color:#e9f7ff;
      font:700 15px Arial;z-index:2;pointer-events:none;text-shadow:0 2px 6px #000;}
    .pl7-heading small{display:block;font:12px Arial;color:#77e9ff;margin-top:5px;}
    .pl7-stats{position:absolute;top:12px;right:12px;z-index:2;
      max-width:48%;padding:9px 11px;border-radius:9px;
      background:#061524c9;border:1px solid #3a728b;
      text-align:right;color:#aef5ff;font:12px/1.6 Arial;pointer-events:none;}
    .pl7-hint{position:absolute;bottom:9px;left:12px;color:#b4cadd;
      font:11px Arial;pointer-events:none;}
    .pl7-buttons{display:flex;flex-wrap:wrap;justify-content:center;
      gap:9px;padding:12px 0 4px;}
    .pl7-buttons button,.pl7-stop{background:#173d5e;color:#f0f9ff;
      border:1px solid #4c9fca;border-radius:9px;padding:10px 16px;
      font-weight:700;cursor:pointer;}
    .pl7-readout{color:#7ff5e0;text-align:center;font:600 13px/1.6 Arial;
      margin:8px auto;max-width:650px;}
  `;
  document.head.appendChild(css);

  function stateFor(kind) {
    return memory[kind] ||= {time:0, running:false, status:'Ready', last:0};
  }

  // Existing Start/Pause/Stop/Reset controls control the new scene as well.
  document.addEventListener('click', e => {
    const kind = kindNow();
    if (!kind) return;
    let action = '';
    if (['field','electromagnet','motor'].includes(kind)) {
      action = e.target.closest('.plx-buttons [data-act]')?.dataset.act || '';
    } else if (kind === 'pendulum') {
      action = e.target.closest('.plp-buttons [data-plp]')?.dataset.plp || '';
    } else if (kind === 'induction') {
      const id = e.target.closest('button')?.id;
      action = ({pliStart:'start', pliPause:'pause', pliReset:'reset',
                 pl7InductionStop:'stop'})[id] || '';
    } else {
      action = e.target.closest('.pl7-buttons [data-pl7]')?.dataset.pl7 || '';
    }
    if (!action) return;
    const s = stateFor(kind);
    if (action === 'start') {s.running=true;s.status='Running';}
    else if (action === 'pause') {s.running=false;s.status='Paused';}
    else if (action === 'stop') {s.running=false;s.time=0;s.status='Stopped';}
    else if (action === 'reset') {s.running=false;s.time=0;s.status='Ready';}
    s.last = performance.now();
    if (kind === 'induction' && action === 'stop') {
      document.getElementById('pliReset')?.click();
      s.status = 'Stopped';
    }
  }, true);

  async function getThree() {
    if (!loading) loading = import('https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js').catch(() =>
      import('./three.module.js'));
    return loading;
  }

  function build(T, scene, kind) {
    const root = new T.Group();
    scene.add(root);
    const basic = (color, options={}) => new T.MeshStandardMaterial({
      color, roughness:.42, metalness:.24, ...options
    });
    function obj(parent, geo, color, x=0,y=0,z=0, options={}) {
      const m = new T.Mesh(geo,basic(color,options));
      m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;
      parent.add(m);return m;
    }
    const box=(p,w,h,d,color,x=0,y=0,z=0,options={})=>
      obj(p,new T.BoxGeometry(w,h,d),color,x,y,z,options);
    const ball=(p,r,color,x=0,y=0,z=0)=>
      obj(p,new T.SphereGeometry(r,18,14),color,x,y,z);
    const rod=(p,r,len,color,x=0,y=0,z=0)=>
      obj(p,new T.CylinderGeometry(r,r,len,12),color,x,y,z);
    function segment(parent,a,b,r,color) {
      const va=new T.Vector3(...a),vb=new T.Vector3(...b);
      const dir=vb.clone().sub(va);
      const m=rod(parent,r,dir.length(),color);
      m.position.copy(va).add(vb).multiplyScalar(.5);
      m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());
      return m;
    }
    function curve(parent,points,r,color) {
      const c=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
      const o=obj(parent,new T.TubeGeometry(c,70,r,7,false),color);
      return {curve:c,mesh:o};
    }
    function stream(parent,path,color,count=3) {
      const nodes=Array.from({length:count},()=>ball(parent,.07,color));
      return {path:path.curve,nodes};
    }
    function setStreams(streams,t,speed,visible=true) {
      streams.forEach((s,i)=>s.nodes.forEach((n,j)=>{
        n.visible=visible;
        if (visible) n.position.copy(s.path.getPointAt(
          ((t*speed + i*.23 + j/s.nodes.length)%1+1)%1
        ));
      }));
    }

    // ------ BAR MAGNET FIELD ------
    if (kind==='field') {
      const assembly=new T.Group();root.add(assembly);
      box(assembly,1.35,.62,.68,0xd9485b,-.675,1.5);
      box(assembly,1.35,.62,.68,0x377fe6,.675,1.5);
      const streams=[];
      for (const side of [-1,1]) {
        for (const z of [-.65,0,.65]) {
          const h=(z===0?1.35:.9);
          const points=[[-1.31,1.5,z],[-2.1,1.65+side*.42,z],
            [-2.35,1.5+side*h,z],[-.2,1.5+side*(h*1.35),z],
            [2.3,1.5+side*h,z],[2.1,1.65+side*.42,z],[1.31,1.5,z]];
          const path=curve(assembly,points,.019,0x35bbff);
          path.mesh.material.transparent=true;
          streams.push(stream(assembly,path,0xb4ffff,3));
        }
      }
      return (t,s)=>{
        const strength=cap(num('strength',65),0,100)/100;
        assembly.rotation.y=num('rotation',0)*Math.PI/180;
        streams.forEach(a=>a.path.mesh.material.opacity=.2+.8*strength);
        setStreams(streams,t,.16+strength*.5,strength>0 && s.status==='Running');
        return `Strength ${Math.round(strength*100)}% · Rotation ${num('rotation',0)}°`;
      };
    }

    // ------ ELECTROMAGNET & COIL ------
    if (kind==='electromagnet') {
      const core=rod(root,.31,3.5,0x9caec1,0,1.7);
      core.rotation.z=Math.PI/2;
      const points=[];
      for(let i=0;i<=300;i++){
        const q=i/300,ang=q*2*Math.PI*18;
        points.push([-1.65+3.3*q,1.7+.47*Math.cos(ang),.47*Math.sin(ang)]);
      }
      const wire=curve(root,points,.045,0xf7a854);
      box(root,4,.2,.9,0x2d516c,0,.35);
      const fieldPaths=[];
      for(const side of [-1,1])for(const z of [-.4,.4]){
        const path=curve(root,[[-1.5,1.7,z],[-2.4,1.7+side*.6,z],
          [0,1.7+side*1.2,z],[2.4,1.7+side*.6,z],[1.5,1.7,z]],
          .018,0x45e1ff);
        fieldPaths.push(stream(root,path,0xa3ffff,4));
      }
      return (t,s)=>{
        const current=num('current',2),turns=num('turns',120),pol=num('polarity',1);
        const B=4*Math.PI*1e-7*turns*current/.2*1000;
        wire.mesh.material.emissive.setHex(0x9b3900);
        wire.mesh.material.emissiveIntensity=current*.25;
        fieldPaths.forEach(p=>{p.path.mesh.material.transparent=true;
          p.path.mesh.material.opacity=current/5;});
        setStreams(fieldPaths,t,(.15+current*.15)*(pol<0?-1:1),
          current>0 && s.status==='Running');
        return `Current ${current.toFixed(1)} A · ${turns} turns · B ≈ ${B.toFixed(2)} mT`;
      };
    }

    // ------ ROTATING ELECTRIC MOTOR ------
    if(kind==='motor'){
      box(root,1.05,1.25,1.45,0xe4525e,-2.05,1.65);
      box(root,1.05,1.25,1.45,0x367ff5,2.05,1.65);
      const rotor=new T.Group();rotor.position.y=1.7;root.add(rotor);
      const shaft=rod(rotor,.12,3.1,0xd5e6ed);shaft.rotation.x=Math.PI/2;
      const a=.9,b=.64;
      segment(rotor,[-a,-b,0],[a,-b,0],.075,0xffba51);
      segment(rotor,[a,-b,0],[a,b,0],.075,0xffba51);
      segment(rotor,[a,b,0],[-a,b,0],.075,0xffba51);
      segment(rotor,[-a,b,0],[-a,-b,0],.075,0xffba51);
      const disks=[-.85,.85].map(z=>{
        const d=rod(root,.28,.16,0x89c8df,0,1.7,z);
        d.rotation.x=Math.PI/2;return d;
      });
      return (t,s)=>{
        const current=num('current',2.5),field=num('field',.9);
        const turns=num('turns',70),load=num('load',25);
        const torque=turns*current*field*.015;
        const speed=Math.max(0,torque*.8-load*.012);
        rotor.rotation.z=t*speed;
        disks.forEach(d=>{d.rotation.z=t*speed;});
        return `Torque ≈ ${torque.toFixed(2)} N·m · Speed (model) ${speed.toFixed(2)} rad/s`;
      };
    }

    // ------ SIMPLE PENDULUM ------
    if(kind==='pendulum'){
      box(root,3.5,.19,.5,0x9ebad0,0,4.1);
      for(const x of [-1.5,1.5])box(root,.15,4,.28,0x4e789b,x,2.1);
      const pivot=new T.Group();pivot.position.y=3.98;root.add(pivot);
      const string=rod(pivot,.025,1,0xeaf5ff,0,-.5);
      const bob=ball(pivot,.32,0xffad47,0,-1);
      const marker=ball(root,.09,0xffe3a8,0,3.98);
      return (t,s)=>{
        const L=cap(num('length',1.2),.2,3),g=Math.max(.1,num('gravity',9.81));
        const A=num('angle',35)*Math.PI/180;
        const period=2*Math.PI*Math.sqrt(L/g);
        let a=A*Math.cos(2*Math.PI*t/period);
        if(s.status==='Stopped')a=0;
        pivot.rotation.z=a;
        string.scale.y=L;string.position.y=-L/2;
        bob.position.y=-L;
        return `Period ${period.toFixed(2)} s · Angle ${(a*180/Math.PI).toFixed(1)}° · Time ${t.toFixed(1)} s`;
      };
    }

    // ------ THERMAL EXPANSION ------
    if(kind==='thermal'){
      box(root,5.7,.19,1.65,0x41617a,0,.35);
      box(root,.22,.9,1.3,0xa8c3d4,-2.75,.85);
      const metal=box(root,3.1,.45,.65,0x4da4ee,-1.15,1);
      const heatLight=new T.PointLight(0xff6a2b,0,6);
      heatLight.position.set(0,1.2,.7);root.add(heatLight);
      const particles=Array.from({length:12},(_,i)=>ball(root,.045,0xffb767));
      return (t,s)=>{
        const initial=num('length',2),change=num('temperature',150),alpha=num('alpha',12);
        const effective=change*(1-Math.exp(-Math.max(0,t)*.7));
        const delta=alpha*1e-6*initial*effective;
        const baseLen=1.35+initial*.65;
        const visualLen=baseLen*(1+alpha*1e-6*effective*80);
        metal.scale.x=visualLen/3.1;
        metal.position.x=-2.56+visualLen/2;
        metal.material.color.setRGB(.25+.75*effective/500,.6-.36*effective/500,.9-.72*effective/500);
        heatLight.intensity=effective/80;
        particles.forEach((p,i)=>{
          p.visible=effective>1;
          p.position.set(-2.3+i%6*.8,1.65+(Math.floor(i/6))*.25+
             Math.sin(t*3+i)*.13,.1);
        });
        return `ΔT ${effective.toFixed(1)} °C · Expansion ${(delta*1000).toFixed(3)} mm · Final ${(initial+delta).toFixed(6)} m`;
      };
    }

    // ------ PHOTOELECTRIC EFFECT ------
    if(kind==='photoelectric'){
      box(root,.36,2.7,2.2,0x8ba5be,1.65,1.75);
      box(root,.64,.55,.72,0x465e9c,-3,1.75);
      const photons=Array.from({length:14},(_,i)=>ball(root,.095,0xffe059));
      const electrons=Array.from({length:14},(_,i)=>ball(root,.067,0x58edff));
      return (t,s)=>{
        const frequency=num('frequency',7),work=num('work',2.2),intensity=num('intensity',70);
        const energy=.4135667696*frequency;
        const KE=Math.max(0,energy-work);
        const emits=energy>=work && intensity>0;
        const n=Math.ceil(intensity/100*14);
        photons.forEach((p,i)=>{
          p.visible=i<n;
          const phase=(t*(.45+frequency*.05)+i/14)%1;
          p.position.set(-2.7+4.1*phase,1.05+(i%7)*.22,(Math.floor(i/7)-.5)*.6);
        });
        electrons.forEach((p,i)=>{
          p.visible=emits && i<n && s.running;
          const phase=(t*(.35+KE*.3)+i/14)%1;
          p.position.set(1.9+2.1*phase,1.05+(i%7)*.22,(Math.floor(i/7)-.5)*.6);
        });
        return `Photon ${energy.toFixed(2)} eV · Threshold ${work.toFixed(2)} eV · Kmax ${KE.toFixed(2)} eV · Electrons ${emits?'YES':'NO'}`;
      };
    }

    // ------ ELECTROMAGNETIC INDUCTION ------
    if(kind==='induction'){
      const magnet=new T.Group();root.add(magnet);
      box(magnet,1.05,.65,.68,0xe34b60,-.52,1.7);
      box(magnet,1.05,.65,.68,0x397fe7,.52,1.7);
      const core=rod(root,.17,2.1,0x85b1c7,1.45,1.7);core.rotation.z=Math.PI/2;
      const points=[];
      for(let i=0;i<=240;i++){
        const f=i/240,a=f*Math.PI*2*13;
        points.push([.65+1.75*f,1.7+.61*Math.cos(a),.61*Math.sin(a)]);
      }
      const winding=curve(root,points,.05,0xffb25c);
      const arrows=[];
      for(let i=0;i<6;i++)arrows.push(ball(root,.055,0x75ecff));
      return (t,s)=>{
        const speed=cap(num('speed',55),0,100)/100;
        const strength=num('field',1),turns=num('turns',180);
        const omega=1.1+speed*1.2;
        const x=-.6+speed*1.9*Math.sin(omega*t);
        magnet.position.x=x;
        const d=x-.65;
        const flux=Math.exp(-(d*d)/(2*1.3*1.3));
        const v=s.running ? speed*1.9*omega*Math.cos(omega*t):0;
        const emf=turns*.005*strength*flux*d*v/(1.3*1.3);
        winding.mesh.material.emissive.setHex(0x964100);
        winding.mesh.material.emissiveIntensity=Math.min(1,Math.abs(emf)*.5);
        arrows.forEach((p,i)=>{
          p.visible=s.running && speed>0 && strength>0;
          if(p.visible)p.position.copy(winding.curve.getPointAt(
            ((t*speed*.7+i/arrows.length)%1+1)%1));
        });
        return `Induced EMF ${emf.toFixed(3)} V · ${turns} turns · Magnet speed ${Math.round(speed*100)}%`;
      };
    }
    return ()=>'';
  }

  function dispose(){
    if(!active)return;
    const a=active;active=null;
    cancelAnimationFrame(a.frame);
    a.resize.disconnect();
    a.scene.traverse(o=>{
      o.geometry?.dispose();
      const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];
      ms.forEach(m=>m.dispose());
    });
    a.renderer.dispose();
    a.view.remove();
    a.stage.classList.remove('pl7-stage');
    if(a.controls?.isConnected)a.controls.remove();
  }

  function mount(kind,stage) {
    if(active && active.kind===kind && active.stage===stage && active.view.isConnected)return;
    if(active)dispose();
    const s=stateFor(kind);
    const THREE=window.__PL7_THREE;
    const view=document.createElement('div');
    view.className='pl7-view';
    view.innerHTML=`<div class="pl7-heading">REAL INTERACTIVE 3D<small>${kind.toUpperCase()}</small></div>
      <div class="pl7-stats">Ready</div><div class="pl7-hint">Drag to rotate · Scroll to zoom</div>`;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.setClearColor(0x071729);
    view.insertBefore(renderer.domElement,view.firstChild);
    stage.classList.add('pl7-stage');
    stage.appendChild(view);
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x071729);
    const camera=new THREE.PerspectiveCamera(43,1,.1,90);
    scene.add(new THREE.HemisphereLight(0xd5edff,0x253d55,2.3));
    const light=new THREE.DirectionalLight(0xffffff,3.1);
    light.position.set(-3,8,6);scene.add(light);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),
      new THREE.MeshStandardMaterial({color:0x15334d,roughness:.9}));
    floor.rotation.x=-Math.PI/2;scene.add(floor);
    const grid=new THREE.GridHelper(15,15,0x387697,0x23435d);grid.position.y=.01;scene.add(grid);
    const update=build(THREE,scene,kind);
    let controls=null;
    if(ownButtons.has(kind)) {
      controls=document.createElement('div');controls.className='pl7-buttons';
      controls.innerHTML=`<button type="button" data-pl7="start">▶ Start</button>
        <button type="button" data-pl7="pause">⏸ Pause</button>
        <button type="button" data-pl7="stop">■ Stop</button>
        <button type="button" data-pl7="reset">↻ Reset</button>`;
      stage.after(controls);
    }
    if(kind==='induction' && !document.getElementById('pl7InductionStop')) {
      const stop=document.createElement('button');stop.type='button';
      stop.id='pl7InductionStop';stop.className='pl7-stop';stop.textContent='■ Stop';
      document.getElementById('pliReset')?.after(stop);
    }
    const a={kind,stage,view,renderer,scene,camera,update,controls,frame:0,
      resize:null,az:.7,el:.43,zoom:9};active=a;
    const size=()=>{
      if(active!==a)return;
      const rect=stage.getBoundingClientRect();
      const w=Math.max(1,rect.width),h=Math.max(260,rect.height);
      renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
    };
    a.resize=new ResizeObserver(size);a.resize.observe(stage);size();
    let pointer=null;
    const canvas=renderer.domElement;
    canvas.addEventListener('pointerdown',e=>{
      pointer={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove',e=>{
      if(!pointer || pointer.id!==e.pointerId)return;
      a.az+=(e.clientX-pointer.x)*.009;
      a.el=cap(a.el+(e.clientY-pointer.y)*.007,.1,1.4);
      pointer.x=e.clientX;pointer.y=e.clientY;
    });
    canvas.addEventListener('pointerup',()=>pointer=null);
    canvas.addEventListener('pointercancel',()=>pointer=null);
    canvas.addEventListener('wheel',e=>{
      e.preventDefault();a.zoom=cap(a.zoom+e.deltaY*.008,5,17);
    },{passive:false});
    function frame(now){
      if(active!==a)return;
      if(kindNow()!==kind || !stage.isConnected){dispose();return;}
      a.frame=requestAnimationFrame(frame);
      const dt=s.last?cap((now-s.last)/1000,0,.05):0;s.last=now;
      if(s.running)s.time+=dt;
      if(kind==='pendulum'){
        const pStatus=document.getElementById('plpStatus')?.textContent.trim();
        const pTime=parseFloat(document.getElementById('plpTime')?.textContent||'');
        if(pStatus)s.status=pStatus;
        if(Number.isFinite(pTime))s.time=pTime;
        s.running=s.status==='Running';
      }
      const info=a.update(s.time,s);
      $('.pl7-stats',view).textContent=info+' · '+s.status;
      const horiz=a.zoom*Math.cos(a.el);
      camera.position.set(Math.sin(a.az)*horiz,1.8+a.zoom*Math.sin(a.el),
        Math.cos(a.az)*horiz);
      camera.lookAt(0,1.75,0);
      renderer.render(scene,camera);
    }
    a.frame=requestAnimationFrame(frame);
    console.log('PocketLab 3D repaired:',kind);
  }

  async function check(){
    const kind=kindNow();
    if(kind!==lastKind){
      if(active)dispose();
      if(kind)memory[kind]={time:0,running:false,status:'Ready',last:0};
      lastKind=kind;
    }
    if(!kind)return;
    const stage=stageFor(kind);
    if(!stage){if(active)dispose();return;}
    if(active?.kind===kind && active.stage===stage && active.view.isConnected)return;
    if(Date.now()-failedAt<6000)return;
    try{
      if(!window.__PL7_THREE)window.__PL7_THREE=await getThree();
      if(kindNow()===kind && stageFor(kind)===stage) mount(kind,stage);
    }catch(err){failedAt=Date.now();loading=null;
      console.error('PocketLab real 3D unavailable (original lab preserved):',err);}
  }
  setInterval(check,450);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check);
  else check();
})();

/* ==================================================
   POCKETLAB - FIX BLANK MAGNETIC 3D SCENES
   Fixes:
   1. Animated Magnetic Field
   2. Electromagnet & Coil

   PASTE AT VERY BOTTOM OF visuals.js
================================================== */

(() => {
  "use strict";

  if (window.__PL_MAGNET_BLANK_FIX__) return;
  window.__PL_MAGNET_BLANK_FIX__ = true;

  async function fixMagneticScenes() {
    let THREE;

    try {
      THREE = await import(
        "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"
      );
    } catch {
      THREE = await import("./three.module.js");
    }

    // The magnetic simulations store field curves
    // but later need access to their visible meshes.
    // Link each curve to its real Three.js mesh.

    if (!THREE.Object3D.prototype.__plMagnetLinked) {

      const originalAdd =
        THREE.Object3D.prototype.add;

      THREE.Object3D.prototype.add = function(...objects) {

        for (const object of objects) {

          const curve =
            object?.geometry?.parameters?.path;

          if (
            curve &&
            typeof curve.getPointAt === "function" &&
            object.material
          ) {
            curve.mesh = object;
          }
        }

        return originalAdd.apply(this, objects);
      };

      THREE.Object3D.prototype.__plMagnetLinked = true;
    }

    // Rebuild a scene that was already opened
    // before the bug was repaired.

    const title =
      document.getElementById("activeExperimentTitle")
        ?.textContent || "";

    if (
      /animated magnetic field|electromagnet\s*&\s*coil/i
        .test(title)
    ) {
      document.querySelectorAll(
        ".pl7-view"
      ).forEach(view => view.remove());
    }

    console.log(
      "✅ Magnetic Field and Electromagnet mesh fix applied"
    );
  }

  fixMagneticScenes().catch(error => {
    console.error(
      "PocketLab magnetic scene repair failed:",
      error
    );
  });

})();

/* ============================================================
   POCKETLAB CHEMISTRY — 12 REAL WEBGL 3D EXPERIMENTS
   PASTE ONCE AT THE VERY END OF chemistry.js
   Keeps original chemistry.js sliders, Start/Pause/Stop/Reset,
   formula, five MCQs and tutor. Uses Three.js v0.160.1.
   ============================================================ */
(() => {
  "use strict";
  if (window.__POCKETLAB_CHEMISTRY_3D_V1__) return;
  window.__POCKETLAB_CHEMISTRY_3D_V1__ = true;

  const titles = {
    "pH Indicator Laboratory":"ph",
    "Periodic Table Explorer":"periodic",
    "Chemical Bonding":"bond",
    "Chemical Reaction Rates":"rate",
    "States of Matter":"matter",
    "Separation Techniques":"separation",
    "Acid-Base Titration":"titration",
    "Electrolysis of Water":"electrolysis",
    "Gas Laws Simulator":"gas",
    "Solubility Simulator":"solubility",
    "Paper Chromatography":"chromatography",
    "Chemical Reactions":"reactions"
  };
  const inputs = {
    ph:["solution"],periodic:["element"],bond:["bond"],
    rate:["temperature","concentration"],matter:["state"],
    separation:["method"],titration:["volume"],
    electrolysis:["voltage"],gas:["temp","volume"],
    solubility:["salt","water"],chromatography:["speed"],
    reactions:["reaction"]
  };
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  let session = null;
  let opening = false;
  let threePromise = null;
  let retryAfter = 0;

  const style = document.createElement("style");
  style.textContent = `
    .chem3-host{position:relative;width:100%;line-height:0;border-radius:14px;overflow:hidden;background:#081b31}
    .chem3-host #chem4-canvas{display:block;width:100%;height:auto}
    .chem3-view{position:absolute;inset:0;z-index:2;touch-action:none}
    .chem3-view>canvas{display:block;width:100%;height:100%;touch-action:none;cursor:grab}
    .chem3-hud{position:absolute;left:12px;top:12px;z-index:3;pointer-events:none;
      color:#dff8ff;font:600 12px/1.55 Arial,sans-serif;text-shadow:0 2px 6px #000}
    .chem3-hud strong{display:block;color:#76eeff;font-size:15px}
    .chem3-note{position:absolute;left:12px;bottom:10px;color:#c3d7e8;
      font:11px Arial,sans-serif;pointer-events:none}
  `;
  document.head.appendChild(style);

  function selected() {
    const page = document.getElementById("experimentWorkspace");
    if (!page?.classList.contains("active")) return null;
    const root = document.getElementById("chem4-workspace");
    const name = document.getElementById("chem4-title")?.textContent.trim();
    const canvas = document.getElementById("chem4-canvas");
    const key = titles[name];
    return root && canvas && key ? {key,canvas,name} : null;
  }

  function values(key) {
    const elements = [...document.querySelectorAll("#chem4-controls input[type=range]")];
    const out = {};
    (inputs[key] || []).forEach((id,i) => {
      out[id] = Number(elements[i]?.value ?? 0);
    });
    return out;
  }

  function cleanup() {
    if (!session) return;
    const s = session;
    session = null;
    cancelAnimationFrame(s.raf);
    s.resizer.disconnect();
    s.scene.traverse(o => {
      o.geometry?.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material])
        .forEach(m => m.dispose());
    });
    s.renderer.dispose();
    if (s.canvas.isConnected && s.host.isConnected) {
      s.host.before(s.canvas);
      s.canvas.style.opacity = s.oldOpacity;
    }
    s.host.remove();
  }

  async function getThree() {
    if (!threePromise) {
      threePromise = import("./three.module.js").catch(() =>
        import("https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"));
    }
    return threePromise;
  }

  function createLab(T,scene,key) {
    const root = new T.Group();scene.add(root);
    const mat = (color,more={}) => new T.MeshStandardMaterial({color,roughness:.44,metalness:.09,...more});
    const mesh = (parent,geo,color,x=0,y=0,z=0,more={}) => {
      const o = new T.Mesh(geo,mat(color,more));
      o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;
    };
    const box = (p,w,h,d,c,x=0,y=0,z=0,o={})=>mesh(p,new T.BoxGeometry(w,h,d),c,x,y,z,o);
    const ball = (p,r,c,x=0,y=0,z=0)=>mesh(p,new T.SphereGeometry(r,18,14),c,x,y,z);
    const cyl = (p,rt,rb,h,c,x=0,y=0,z=0,o={})=>mesh(p,new T.CylinderGeometry(rt,rb,h,32),c,x,y,z,o);
    const line = (p,a,b,c,r=.035)=>{
      const A=new T.Vector3(...a), B=new T.Vector3(...b),diff=B.clone().sub(A);
      const rod=cyl(p,r,r,diff.length(),c);
      rod.position.copy(A).add(B).multiplyScalar(.5);
      rod.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),diff.normalize());
      return rod;
    };
    const glass = (p,r,h,x=0,y=0,z=0) => {
      mesh(p,new T.CylinderGeometry(r,r,h,40,1,true),0xb7edff,x,y+h/2,z,
        {transparent:true,opacity:.19,depthWrite:false,side:T.DoubleSide,metalness:0});
      cyl(p,r,r,.05,0x9edcff,x,y+.02,z,{transparent:true,opacity:.4});
      const rim=mesh(p,new T.TorusGeometry(r,.026,8,48),0xc0f3ff,x,y+h,z);
      rim.rotation.x=Math.PI/2;
    };
    const water=(p,r,h,c,x=0,y=0,z=0)=>cyl(p,r,r,h,c,x,y+h/2,z,{transparent:true,opacity:.76,depthWrite:false});
    const dotCloud=(count,p=root,r=.07,c=0x6de5ff)=>
      Array.from({length:count},()=>ball(p,r,c));
    const place=(dots,t,speed=1,scale=1,baseY=1.6)=>dots.forEach((o,i)=>{
      o.position.set(
        Math.sin(i*18.35+t*(.65+i%4*.17)*speed)*1.35*scale,
        baseY+Math.sin(i*9.12+t*(.81+i%5*.13)*speed)*.85*scale,
        Math.cos(i*5.48+t*(.71+i%3*.21)*speed)*.95*scale
      );
    });
    const group=(parent=root)=>{const g=new T.Group();parent.add(g);return g;};
    let update=()=>"";

    if (key==="ph") {
      glass(root,1.15,2.55,0,.17);
      const fluid=water(root,1.10,1.45,0x50d17f,0,.2);
      const bubbles=dotCloud(16,root,.045,0xffffff);
      box(root,.85,.57,.12,0x182f48,2.35,2.3,0);
      line(root,[2.15,2.04,0],[.55,.9,0],0xd1ebf5,.04);
      update=(t,p)=>{
        const options=[["Lemon juice",2,0xf04b55],["Vinegar",3,0xf18c43],
          ["Pure water",7,0x50d17f],["Baking soda",8.5,0x49b5e3],["Soap",10,0x6659e5]];
        const [name,ph,color]=options[clamp(p.solution||0,0,4)];
        fluid.material.color.setHex(color);
        bubbles.forEach((o,i)=>{
          const u=(i/16+t*.18)%1;
          o.position.set(Math.sin(i*5.7)*.75,.3+u*1.32,Math.cos(i*8.1)*.70);
          o.visible=t>0;
        });
        return `${name} · pH ${ph} · ${ph<7?"Acidic":ph>7?"Alkaline":"Neutral"}`;
      };
    }

    if (key==="periodic") {
      const nucleus=ball(root,.49,0xf17b86,0,1.9);
      const rings=[],electrons=[];
      for(let shell=0;shell<4;shell++){
        const radius=.85+shell*.53;
        const ring=mesh(root,new T.TorusGeometry(radius,.012,7,90),0x68bdeb,0,1.9);
        ring.rotation.x=.23*shell;ring.rotation.y=.36*shell;rings.push(ring);
        for(let i=0;i<[2,8,8,2][shell];i++){
          const e=ball(root,.095,0x86f2ff);electrons.push({e,shell,i});
        }
      }
      update=(t,p)=>{
        const z=clamp(p.element||1,1,20),sizes=[2,8,8,2];
        let remain=z;
        rings.forEach((ring,j)=>{const count=Math.min(remain,sizes[j]);ring.visible=count>0;remain-=count;});
        remain=z;
        const counts=sizes.map(size=>{const n=Math.min(remain,size);remain-=n;return n;});
        electrons.forEach(({e,shell,i})=>{
          const n=counts[shell];e.visible=i<n;if(!e.visible)return;
          const ang=i/n*Math.PI*2+t*(shell%2?-.7:.7);
          const radius=.85+shell*.53;
          e.position.set(radius*Math.cos(ang),1.9+radius*Math.sin(ang)*Math.cos(.23*shell),
            radius*Math.sin(ang)*Math.sin(.23*shell));
        });
        const symbols=["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca"];
        return `${symbols[z-1]} · Atomic number ${z} · Electron shells ${counts.filter(Boolean).join("–")}`;
      };
    }

    if (key==="bond") {
      const ionic=group(),covalent=group(),metallic=group();
      ball(ionic,.76,0x58aef2,-1.28,1.7);ball(ionic,.96,0xfa9467,1.2,1.7);
      const ionElectron=ball(ionic,.11,0xffe46c);
      ball(covalent,.7,0x70bdfa,-.86,1.7);ball(covalent,.7,0x70bdfa,.86,1.7);
      const pair=[ball(covalent,.13,0xffe263),ball(covalent,.13,0xffe263)];
      for(let ix=0;ix<4;ix++)for(let iz=0;iz<3;iz++)
        ball(metallic,.26,0x99bad9,(ix-1.5)*.83,1.6, (iz-1)*.8);
      const electrons=dotCloud(18,metallic,.065,0xffd56d);
      update=(t,p)=>{
        const type=clamp(p.bond||1,1,3);
        ionic.visible=type===1;covalent.visible=type===2;metallic.visible=type===3;
        ionElectron.position.set(Math.sin(t*1.7)*.9,2.9,0);
        pair.forEach((o,i)=>o.position.set(Math.sin(t*2+i*Math.PI)*.30,1.55+i*.24,.3));
        place(electrons,t,1.6,.8,1.7);
        return ["","Ionic attraction (Na⁺ / Cl⁻)","Covalent shared pair (H₂)","Metallic lattice and mobile electrons"][type];
      };
    }

    if (key==="rate" || key==="matter") {
      box(root,3.4,2.75,2.35,0x4ba6db,0,1.65,0,{transparent:true,opacity:.11,depthWrite:false});
      const particles=dotCloud(70);
      update=(t,p)=>{
        if(key==="rate"){
          const count=Math.round(clamp(p.concentration,10,100)*.7);
          const speed=p.temperature/40;
          particles.forEach((o,i)=>{o.visible=i<count;
            o.material.color.setHex(i%2?0xffaa77:0x6deaff);});
          place(particles,t,speed,.83,1.63);
          return `Temperature ${p.temperature} °C · Concentration ${p.concentration}% · Relative rate ${(p.temperature/40*p.concentration/60).toFixed(2)}×`;
        }
        const mode=clamp(p.state||1,1,3);
        particles.forEach((o,i)=>{
          o.visible=i<48;
          const x=i%6,y=Math.floor(i/6)%4,z=Math.floor(i/24);
          if(mode===1)o.position.set((x-2.5)*.53+Math.sin(i+t*6)*.025,.73+y*.58+Math.cos(i+t*5)*.025,(z-.5)*.8);
          if(mode===2)o.position.set(Math.sin(i*7+t*.5)*1.25,.62+(i%5)*.27+Math.sin(t*1.4+i)*.05,Math.cos(i*4+t*.5)*.8);
          if(mode===3)o.position.set(Math.sin(i*13+t*(.6+i%4*.2))*1.45,1.65+Math.sin(i*3+t*(.9+i%3*.2))*1.1,Math.cos(i*17+t*.8)*1.0);
        });
        return ["","SOLID — lattice vibrations","LIQUID — particles flow","GAS — particles move freely"][mode];
      };
    }

    if (key==="separation") {
      const filter=group(),evap=group(),distil=group();
      const funnel=cyl(filter,1.08,.11,1.38,0xbde8ff,0,2.45,0,{transparent:true,opacity:.32,depthWrite:false});
      glass(filter,.8,1.13,0,.10);water(filter,.74,.6,0x5fcaff,0,.17);
      const drops=dotCloud(12,filter,.06,0x7ddfff);
      cyl(evap,1.38,1.2,.22,0x8aa6ba,0,.42);
      const steam=dotCloud(20,evap,.065,0xb3efff);
      ball(distil,1.00,0x75c6ff,-1.55,1.35);
      line(distil,[-.85,1.92,0],[.5,2.28,0],0xc9e2f2,.10);
      line(distil,[.5,2.28,0],[1.75,1.2,0],0x8cdef5,.10);
      glass(distil,.55,1.05,1.8,.15);water(distil,.51,.45,0x7fdfff,1.8,.2);
      const flow=dotCloud(10,distil,.055,0xffdc83);
      update=(t,p)=>{
        const m=clamp(p.method||1,1,3);
        filter.visible=m===1;evap.visible=m===2;distil.visible=m===3;
        drops.forEach((o,i)=>o.position.set(Math.sin(i*2)*.24,1.05+(i/12+t*.45)%1*.85,.07));
        steam.forEach((o,i)=>o.position.set(Math.sin(i*2+t)*.9,.6+(t*.36+i/20)%1*2.5,Math.cos(i*4)*.65));
        flow.forEach((o,i)=>{const u=(t*.17+i/10)%1;
          o.position.set(-.85+u*2.6,1.92+Math.sin(u*Math.PI)*.35-u*.7,0);});
        return ["","Filtration — residue retained","Evaporation — solvent vaporizes","Distillation — vapor condenses"][m];
      };
    }

    if (key==="titration") {
      glass(root,.23,2.45,0,1.40);
      const solution=water(root,.205,1.35,0x8bd5f1,0,1.52);
      const flask=mesh(root,new T.CylinderGeometry(.47,1.06,1.55,36,1,true),0xc8f4ff,0,.94,0,
        {transparent:true,opacity:.27,depthWrite:false,side:T.DoubleSide});
      const liquid=water(root,.75,.42,0x6bb9ff,0,.18);
      const drops=dotCloud(8,root,.075,0xa8eaff);
      update=(t,p)=>{
        const v=p.volume;const endpoint=v>=25;
        liquid.material.color.setHex(v>25?0xe87bc1:0x62a9ee);
        liquid.scale.y=1+v/100;
        solution.scale.y=Math.max(.1,1-v/70);
        drops.forEach((d,i)=>{d.visible=t>0;
          d.position.set(0,1.15+(t*.65+i/8)%1*.35,0);});
        return `Base added ${v} mL · Equivalence 25 mL · ${endpoint?"Past equivalence":"Before equivalence"}`;
      };
    }

    if (key==="electrolysis") {
      glass(root,1.55,2.55,0,.17);
      water(root,1.50,1.75,0x3698d2,0,.20);
      for(const x of [-.7,.7]) box(root,.17,2.55,.23,0x9eaebc,x,1.75);
      const bubbles=dotCloud(48,root,.07,0xbef2ff);
      update=(t,p)=>{
        const n=Math.round(p.voltage*4);
        bubbles.forEach((o,i)=>{o.visible=p.voltage>0 && i<n && t>0;
          const left=i%3!==0;const x=left?-.7:.7;
          o.position.set(x+Math.sin(i*5+t)*.15,.26+(t*(.24+p.voltage*.05)+i*.137)%1*1.76,
            Math.cos(i*13+t)*.15);
          o.scale.setScalar(.65+(left?.45:.18));});
        return `${p.voltage} V · Cathode: H₂ · Anode: O₂ · Volume ratio 2:1`;
      };
    }

    if (key==="gas") {
      const chamber=box(root,3.8,2.7,2.2,0x70cffb,0,1.65,0,
        {transparent:true,opacity:.13,depthWrite:false});
      const particles=dotCloud(46,root,.07,0xffdf83);
      update=(t,p)=>{
        const width=1.8+p.volume*.35;chamber.scale.x=width/3.8;
        particles.forEach((o,i)=>{
          o.position.set(Math.sin(i*13+t*(.45+p.temp/300))*width*.44,
            1.65+Math.sin(i*6+t*(.7+p.temp/320))*1.2,
            Math.cos(i*11+t*.9)*.92);
        });
        return `T ${p.temp} K · V ${p.volume} L · P ${(0.082057*p.temp/p.volume).toFixed(2)} atm (1 mol)`;
      };
    }

    if (key==="solubility") {
      glass(root,1.25,2.8,0,.12);
      const liquid=water(root,1.20,1.85,0x55b5ee,0,.16);
      const particles=dotCloud(55,root,.065,0xd0f7ff);
      update=(t,p)=>{
        const capMass=p.water*.36, dissolved=Math.min(p.salt,capMass),undissolved=Math.max(0,p.salt-capMass);
        liquid.scale.y=p.water/250;
        particles.forEach((o,i)=>{
          o.visible=i<Math.round(p.salt/2);
          if(i<Math.round(dissolved/2))o.position.set(
            Math.sin(i*14+t*.65)*.9,.30+(i*.17+t*.07)%Math.max(.3,p.water/200),Math.cos(i*5+t*.4)*.82);
          else o.position.set(Math.sin(i*5)*.9,.22+(i%3)*.04,Math.cos(i*9)*.7);
          o.material.color.setHex(i<dissolved/2?0xb6efff:0xffdc7e);
        });
        return `Salt ${p.salt} g · Dissolved ${dissolved.toFixed(1)} g · Undissolved ${undissolved.toFixed(1)} g`;
      };
    }

    if (key==="chromatography") {
      box(root,1.65,3.28,.07,0xe5efeb,0,1.80);
      box(root,2.2,.18,1.30,0x4b849c,0,.18);
      const front=box(root,1.55,.05,.045,0x48cfff,0,.45,.065);
      const stains=[0xed5276,0x5679f7,0xffc44d].map((color,i)=>{
        const m=ball(root,.15,color,(i-1)*.45,.6,.09);
        m.scale.z=.25;return m;
      });
      update=(t,p)=>{
        const progress=clamp(t*p.speed*.025,0,.95);
        front.position.y=.48+progress*2.75;
        [0.28,.52,.74].forEach((rf,i)=>stains[i].position.y=.65+progress*2.75*rf);
        return `Solvent ${Math.round(progress*100)}% · Rf values: 0.28 / 0.52 / 0.74`;
      };
    }

    if (key==="reactions") {
      glass(root,1.3,2.55,0,.16);
      const liquid=water(root,1.26,1.48,0x4b9ee9,0,.18);
      const particles=dotCloud(48,root,.06,0xffd277);
      update=(t,p)=>{
        const m=clamp(p.reaction||1,1,3);
        liquid.material.color.setHex(m===3&&t>3?0x50cb87:m===3?0xe76e8e:0x408aca);
        particles.forEach((o,i)=>{
          o.visible=m===1?i<35:m===2?i<28:i<8;
          if(m===1)o.position.set(Math.sin(i*4)*.95,.23+Math.max(.05,1.8-t*.3-i*.02),Math.cos(i*6)*.95);
          if(m===2)o.position.set(Math.sin(i*7)*.85,.25+(t*.5+i*.15)%1.5,Math.cos(i*4)*.80);
          if(m===3)o.position.set(Math.sin(t+i)*.7,1.0+Math.cos(t+i)*.2,Math.cos(i*3)*.65);
        });
        return ["","Precipitation: solid separates","Gas evolution: bubbles rise","Neutralization: acid + base"][m];
      };
    }
    return update;
  }

  async function mount() {
    const target = selected();
    if (!target || opening || session) return;
    if (Date.now() < retryAfter) return;
    opening = true;
    let T;
    try { T=await getThree(); }
    catch(error) {
      console.warn("Chemistry 3D needs Three.js; original 2D remains available.",error);
      threePromise=null;retryAfter=Date.now()+10000;opening=false;return;
    }
    opening=false;
    const again=selected();
    if (!again || again.canvas!==target.canvas || again.key!==target.key || session) return;
    let renderer=null,scene=null,cam=null,resizer=null,host=null;
    try {
      renderer=new T.WebGLRenderer({antialias:true,alpha:false});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
      renderer.outputColorSpace=T.SRGBColorSpace;
      renderer.setClearColor(0x08182c);
      scene=new T.Scene();scene.background=new T.Color(0x08182c);
      cam=new T.PerspectiveCamera(42,2,.1,80);
      scene.add(new T.HemisphereLight(0xcbeaff,0x304759,2.2));
      const sun=new T.DirectionalLight(0xffffff,3);
      sun.position.set(-4,9,6);scene.add(sun);
      const floor=new T.Mesh(new T.PlaneGeometry(25,25),
        new T.MeshStandardMaterial({color:0x173049,roughness:.9}));
      floor.rotation.x=-Math.PI/2;floor.position.y=-.08;scene.add(floor);
      const grid=new T.GridHelper(15,15,0x355f7e,0x26425a);
      grid.position.y=-.06;scene.add(grid);
      const update=createLab(T,scene,target.key);
      host=document.createElement("div");host.className="chem3-host";
      const view=document.createElement("div");view.className="chem3-view";
      view.innerHTML='<div class="chem3-hud"><strong>CHEMISTRY · REAL 3D</strong><span class="chem3-read">Interactive simulation</span></div><div class="chem3-note">DRAG TO ROTATE · SCROLL TO ZOOM</div>';
      view.prepend(renderer.domElement);
      target.canvas.before(host);host.appendChild(target.canvas);host.appendChild(view);
      const oldOpacity=target.canvas.style.opacity;
      const state={...target,host,view,renderer,scene,cam,update,oldOpacity,raf:0,
        time:0,running:false,last:0,az:.62,el:.37,zoom:8.7,resizer:null};
      session=state;
      const resize=()=>{
        if(session!==state)return;
        const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
        renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
      };
      resizer=new ResizeObserver(resize);resizer.observe(host);state.resizer=resizer;resize();
      const canvas=renderer.domElement;
      let pointer=null;
      canvas.addEventListener("pointerdown",e=>{
        pointer={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);
      });
      canvas.addEventListener("pointermove",e=>{
        if(!pointer || e.pointerId!==pointer.id)return;
        state.az-=(e.clientX-pointer.x)*.009;
        state.el=clamp(state.el+(e.clientY-pointer.y)*.007,-.05,1.3);
        pointer.x=e.clientX;pointer.y=e.clientY;
      });
      const release=()=>pointer=null;
      canvas.addEventListener("pointerup",release);
      canvas.addEventListener("pointercancel",release);
      canvas.addEventListener("wheel",e=>{
        e.preventDefault();state.zoom=clamp(state.zoom+e.deltaY*.008,4.5,16);
      },{passive:false});
      const frame=(now)=>{
        if(session!==state)return;
        const match=selected();
        if(!match || match.key!==state.key || match.canvas!==state.canvas){cleanup();return;}
        state.raf=requestAnimationFrame(frame);
        const dt=state.last?clamp((now-state.last)/1000,0,.05):0;
        state.last=now;
        if(state.running)state.time+=dt;
        try{
          const desc=state.update(state.time,values(state.key));
          view.querySelector(".chem3-read").textContent=desc;
          const r=state.zoom,hor=r*Math.cos(state.el);
          cam.position.set(Math.sin(state.az)*hor,1.55+r*Math.sin(state.el),Math.cos(state.az)*hor);
          cam.lookAt(0,1.6,0);
          renderer.render(scene,cam);
        }catch(error){
          console.error("PocketLab Chemistry 3D render error:",error);
          cleanup();retryAfter=Date.now()+60000;
        }
      };
      // Render before concealing the original canvas: avoids blank overlay on startup.
      const initial=update(0,values(target.key));
      view.querySelector(".chem3-read").textContent=initial;
      cam.position.set(5.2,5.0,7.0);cam.lookAt(0,1.6,0);
      renderer.render(scene,cam);
      target.canvas.style.opacity="0";
      state.raf=requestAnimationFrame(frame);
      console.info("PocketLab Chemistry 3D ready:",target.key);
    }catch(error){
      console.error("Chemistry 3D failed; original experiment stays active.",error);
      retryAfter=Date.now()+10000;
      if(session)cleanup();
      else {resizer?.disconnect();renderer?.dispose();if(host){
        if(target.canvas.isConnected)host.before(target.canvas);host.remove();}}
    }
  }

  // Original chemistry.js remains responsible for all button actions & quiz.
  // This listener only mirrors Start / Pause / Stop / Reset to the 3D animation.
  document.addEventListener("click",e=>{
    const action=e.target.closest("[data-chem4-action]")?.dataset.chem4Action;
    if(!action || !session)return;
    if(action==="start")session.running=true;
    if(action==="pause")session.running=false;
    if(action==="stop" || action==="reset"){
      session.running=false;session.time=0;
    }
    session.last=performance.now();
  },true);

  setInterval(()=>{
    const target=selected();
    if(session && (!target || target.key!==session.key || target.canvas!==session.canvas))cleanup();
    if(target && !session)mount();
  },400);
})();

/* ==========================================================
   POCKETLAB BIOLOGY — REAL INTERACTIVE 3D
   PASTE AT THE VERY BOTTOM OF visuals.js

   Covers all 8 new Biology experiments.
   Preserves existing sliders, buttons, formulas and MCQs.
   Original 2D simulation remains as a fallback.
========================================================== */

(() => {
  "use strict";

  if (window.__POCKETLAB_BIO3D_V1__) return;
  window.__POCKETLAB_BIO3D_V1__ = true;

  const LABS = {
    "Photosynthesis Studio": "photosynthesis",
    "Osmosis & Cell Membrane": "osmosis",
    "Heartbeat & Circulation": "heart",
    "Cell Division (Mitosis)": "mitosis",
    "DNA Replication Lab": "dna",
    "Neuron & Nerve Impulse": "neuron",
    "Seed Germination & Growth": "germination",
    "Lungs & Breathing": "breathing"
  };

  const $ = s => document.querySelector(s);

  const clamp = (x, a, b) =>
    Math.max(a, Math.min(b, x));

  let THREEPromise;
  let current = null;
  let mounting = false;
  let retryAt = 0;

  /* ========================================
     3D WORKSPACE STYLING
  ======================================== */

  const css = document.createElement("style");

  css.textContent = `
    .pb3-holder {
      position: relative;
      width: 100%;
      background: #07192d;
      border-radius: 16px;
      overflow: hidden;
    }

    .pb3-holder > #plbio-canvas {
      display: block;
      width: 100%;
      height: auto;
    }

    .pb3-view {
      position: absolute;
      inset: 0;
      z-index: 2;
      overflow: hidden;
      touch-action: none;
    }

    .pb3-view > canvas {
      display: block;
      width: 100%;
      height: 100%;
      cursor: grab;
      touch-action: none;
    }

    .pb3-label {
      position: absolute;
      left: 12px;
      top: 12px;
      pointer-events: none;
      color: #a4fbef;
      font: 700 14px/1.5 Arial;
      text-shadow: 0 1px 5px #000;
    }

    .pb3-label small {
      display: block;
      color: #d4eafd;
      font: 11px Arial;
      margin-top: 4px;
    }

    .pb3-help {
      position: absolute;
      left: 12px;
      bottom: 10px;
      color: #bad4e7;
      pointer-events: none;
      font: 11px Arial;
      text-shadow: 0 1px 4px #000;
    }
  `;

  document.head.appendChild(css);

  /* ========================================
     DETECT BIOLOGY EXPERIMENT
  ======================================== */

  function target() {
    if (
      !$("#experimentWorkspace")
        ?.classList.contains("active")
    ) return null;

    const key = LABS[
      $("#activeExperimentTitle")
        ?.textContent.trim()
    ];

    const canvas = $("#plbio-canvas");

    return key && canvas
      ? { key, canvas }
      : null;
  }

  function params() {
    const result = {};

    document.querySelectorAll(
      "#experimentControls [data-bio-control]"
    ).forEach(input => {
      result[input.dataset.bioControl] =
        Number(input.value);
    });

    return result;
  }

  function status() {
    const tiles = document.querySelectorAll(
      "#plbio-metrics .plbio-reading"
    );

    for (const tile of tiles) {
      const name = tile.querySelector("small")
        ?.textContent.trim();

      if (name === "Status") {
        return tile.querySelector("strong")
          ?.textContent.trim() || "Ready";
      }
    }

    return "Ready";
  }

  /* ========================================
     LOAD THREE.JS
  ======================================== */

  async function loadThree() {
    if (!THREEPromise) {
      THREEPromise = import("./three.module.js")
        .catch(() =>
          import(
            "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js"
          )
        );
    }

    return THREEPromise;
  }

  /* ========================================
     BUILD REAL 3D MODELS
  ======================================== */

  function makeLab(T, scene, key) {
    const root = new T.Group();
    scene.add(root);

    function material(color, options = {}) {
      return new T.MeshStandardMaterial({
        color,
        metalness: 0.08,
        roughness: 0.5,
        ...options
      });
    }

    function mesh(
      parent, geo, color,
      x = 0, y = 0, z = 0,
      opts = {}
    ) {
      const m = new T.Mesh(
        geo,
        material(color, opts)
      );

      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);

      return m;
    }

    const box = (
      p, w, h, d, c,
      x = 0, y = 0, z = 0, o = {}
    ) => mesh(
      p,
      new T.BoxGeometry(w, h, d),
      c, x, y, z, o
    );

    const ball = (
      p, r, c,
      x = 0, y = 0, z = 0, o = {}
    ) => mesh(
      p,
      new T.SphereGeometry(r, 24, 18),
      c, x, y, z, o
    );

    const rod = (
      p, r, h, c,
      x = 0, y = 0, z = 0
    ) => mesh(
      p,
      new T.CylinderGeometry(r, r, h, 16),
      c, x, y, z
    );

    const ellipsoid = (
      p, sx, sy, sz, c,
      x = 0, y = 0, z = 0, o = {}
    ) => {
      const m = ball(p, 1, c, x, y, z, o);
      m.scale.set(sx, sy, sz);
      return m;
    };

    function segment(p, a, b, r, c) {
      const A = new T.Vector3(...a);
      const B = new T.Vector3(...b);
      const v = B.clone().sub(A);

      const obj = rod(p, r, v.length(), c);

      obj.position.copy(A)
        .add(B)
        .multiplyScalar(0.5);

      obj.quaternion.setFromUnitVectors(
        new T.Vector3(0, 1, 0),
        v.normalize()
      );

      return obj;
    }

    function tube(p, points, r, c) {
      const path = new T.CatmullRomCurve3(
        points.map(pt => new T.Vector3(...pt))
      );

      mesh(
        p,
        new T.TubeGeometry(
          path, 100, r, 8, false
        ),
        c
      );

      return path;
    }

    function dots(p, n, r, c) {
      return Array.from(
        { length: n },
        () => ball(p, r, c)
      );
    }

    function group(p = root) {
      const g = new T.Group();
      p.add(g);
      return g;
    }

    /* ========================================
       1. PHOTOSYNTHESIS
    ======================================== */

    if (key === "photosynthesis") {
      box(
        root, 5, 0.2, 3,
        0x375744, 0, 0.1
      );

      rod(
        root, 0.09, 2.5,
        0x348f60, 0, 1.42
      );

      const leaf1 = ellipsoid(
        root,
        1.45, 0.20, 0.65,
        0x38bd73,
        -0.70, 2.5, 0
      );

      leaf1.rotation.z = 0.3;

      const leaf2 = ellipsoid(
        root,
        1.25, 0.18, 0.52,
        0x48d28c,
        0.72, 2.9, 0.12
      );

      leaf2.rotation.z = -0.24;

      const sun = ball(
        root,
        0.45,
        0xffdc69,
        -2.15, 4.15, -0.75,
        {
          emissive: 0xff9b21,
          emissiveIntensity: 1.1
        }
      );

      const photons = dots(
        root, 12, 0.055, 0xffeb7f
      );

      const oxygen = dots(
        root, 14, 0.075, 0x79eaff
      );

      const water = dots(
        root, 10, 0.048, 0x57baff
      );

      return (t, p) => {
        const rate = Math.min(
          p.light ?? 70,
          p.water ?? 75,
          p.co2 ?? 65
        ) / 100;

        sun.material.emissiveIntensity =
          (p.light ?? 70) / 70;

        photons.forEach((d, i) => {
          d.visible = p.light > 0;

          const u =
            (t * 0.23 * rate + i / 12) % 1;

          d.position.set(
            -2.1 + u * 2.3,
            4.0 - u * 1.2,
            -0.75 + u * 0.5
          );
        });

        oxygen.forEach((d, i) => {
          d.visible = rate > 0;

          const u =
            (t * 0.25 * rate + i / 14) % 1;

          d.position.set(
            0.7 + Math.sin(i * 7) * 0.55,
            2.7 + u * 1.5,
            Math.cos(i * 5) * 0.7
          );
        });

        water.forEach((d, i) => {
          d.visible = p.water > 0;

          const u =
            (t * 0.16 * rate + i / 10) % 1;

          d.position.set(
            0.1 + Math.sin(i) * 0.17,
            0.3 + u * 1.8,
            Math.cos(i * 3) * 0.18
          );
        });

        leaf1.rotation.y =
          Math.sin(t * 0.65) * 0.04;

        return `Photosynthesis rate: ${Math.round(rate * 100)}%`;
      };
    }

    /* ========================================
       2. OSMOSIS & CELL MEMBRANE
    ======================================== */

    if (key === "osmosis") {
      const membrane = ball(
        root, 1.2, 0x7acafb,
        0, 1.9, 0,
        {
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
          side: T.DoubleSide
        }
      );

      const nucleus = ball(
        root,
        0.34,
        0xc278f2,
        0, 1.9, 0
      );

      const inside = dots(
        root, 24, 0.09, 0xffb06e
      );

      const outside = dots(
        root, 38, 0.065, 0x8deeff
      );

      return (t, p) => {
        const gain = clamp(
          (p.inside - p.outside) / 100 *
          (p.permeability / 100) *
          (1 - Math.exp(-t * 0.45)) *
          0.34,
          -0.28,
          0.28
        );

        const size = 1 + gain;

        membrane.scale.setScalar(size);
        nucleus.scale.setScalar(size);

        inside.forEach((d, i) => {
          const r = 0.72 * size;
          const u = i * 2.4 + t * 0.13;

          d.position.set(
            Math.cos(u) * r * 0.65,
            1.9 + Math.sin(i * 1.73) *
              r * 0.7,
            Math.sin(u) * r * 0.65
          );
        });

        outside.forEach((d, i) => {
          const u = t * 0.12 + i * 2.399;
          const r = 1.5 + (i % 4) * 0.35;

          d.position.set(
            Math.sin(u) * r,
            1.9 + Math.sin(u * 0.82 + i)
              * 1.35,
            Math.cos(u) * r
          );
        });

        return `Cell volume index: ${Math.round(size ** 3 * 100)}%`;
      };
    }

    /* ========================================
       3. HEARTBEAT & CIRCULATION
    ======================================== */

    if (key === "heart") {
      const heart = group();

      heart.position.set(0, 1.9, 0);

      ellipsoid(
        heart, 0.8, 0.85, 0.63,
        0xe65068, -0.45, 0.3, 0
      );

      ellipsoid(
        heart, 0.8, 0.85, 0.63,
        0xe65068, 0.45, 0.3, 0
      );

      const point = mesh(
        heart,
        new T.ConeGeometry(0.97, 1.75, 32),
        0xcf354a,
        0, -0.58, 0
      );

      point.rotation.z = Math.PI;

      const paths = [];

      for (const [side, color] of [
        [-1, 0xf45c63],
        [1, 0x57b9ed]
      ]) {
        const pts = Array.from(
          { length: 60 },
          (_, i) => {
            const a =
              i / 59 * Math.PI * 2;

            return [
              side * (
                1.55 + Math.cos(a) * 1.1
              ),
              1.9 + Math.sin(a) * 1.35,
              Math.sin(a) * 0.65
            ];
          }
        );

        paths.push({
          path: tube(
            root, pts, 0.055, color
          ),
          dots: dots(
            root, 12, 0.07, color
          )
        });
      }

      return (t, p) => {
        const beat =
          (p.bpm ?? 72) / 60 * t;

        heart.scale.setScalar(
          1 + 0.085 * Math.pow(
            Math.max(
              0,
              Math.sin(
                beat * Math.PI * 2
              )
            ),
            4
          )
        );

        paths.forEach(
          ({ path, dots: ds }, i) => {
            ds.forEach((d, j) => {
              d.position.copy(
                path.getPointAt(
                  (
                    beat * 0.24 +
                    i * 0.12 +
                    j / ds.length
                  ) % 1
                )
              );
            });
          }
        );

        return (
          `Heart rate: ${p.bpm} bpm · ` +
          `Output: ${(p.bpm * p.stroke / 1000).toFixed(2)} L/min`
        );
      };
    }

    /* ========================================
       4. CELL DIVISION — MITOSIS
    ======================================== */

    if (key === "mitosis") {
      const mother = ball(
        root,
        1.55,
        0x8ad9f9,
        0, 1.9, 0,
        {
          transparent: true,
          opacity: 0.15,
          depthWrite: false,
          side: T.DoubleSide
        }
      );

      const daughters = [-1, 1].map(
        sign => ball(
          root,
          0.83,
          0x9beadf,
          sign * 0.95, 1.9, 0,
          {
            transparent: true,
            opacity: 0.18,
            depthWrite: false,
            side: T.DoubleSide
          }
        )
      );

      const chromosomes = [];

      for (let i = 0; i < 12; i++) {
        const g = group();

        const c =
          i % 2 ? 0xffd27d : 0xdf8aff;

        segment(
          g,
          [-0.12, -0.3, 0],
          [0.12, 0.3, 0],
          0.055, c
        );

        segment(
          g,
          [-0.12, 0.3, 0],
          [0.12, -0.3, 0],
          0.055, c
        );

        chromosomes.push(g);
      }

      return (t, p) => {
        const pairs = clamp(
          p.chromosomes ?? 4, 2, 6
        );

        const phase =
          (t * (p.speed ?? 2) * 0.18) % 4;

        mother.visible = phase < 3;

        daughters.forEach(d => {
          d.visible = phase >= 3;
        });

        chromosomes.forEach((c, i) => {
          c.visible = i < pairs * 2;

          const angle =
            i / (pairs * 2) *
            Math.PI * 2;

          const separation =
            phase < 1
              ? Math.sin(angle) * 0.75
              : phase < 2
              ? 0
              : phase < 3
              ? (phase - 2) * 1.2
              : 1.1;

          c.position.set(
            phase < 2
              ? (i % 2 ? -0.15 : 0.15)
              : separation * (i % 2 ? 1 : -1),

            1.9 + Math.cos(angle) * 0.67,
            Math.sin(angle) * 0.34
          );

          c.rotation.y = phase * 0.2;
        });

        const names = [
          "Prophase",
          "Metaphase",
          "Anaphase",
          "Telophase"
        ];

        return (
          `Stage: ${names[Math.floor(phase)]} · ` +
          `${pairs} chromosome pairs`
        );
      };
    }

    /* ========================================
       5. DNA REPLICATION
    ======================================== */

    if (key === "dna") {
      const helix = group();
      helix.position.y = 1.9;

      const strands = [];
      const rungs = [];

      for (let i = 0; i < 20; i++) {
        const y = (i - 9.5) * 0.22;

        strands.push([
          ball(
            helix, 0.09, 0x65d0ff
          ),
          ball(
            helix, 0.09, 0xff7fa5
          )
        ]);

        rungs.push(
          box(
            helix,
            1.34, 0.055, 0.055,
            i % 2 ? 0xffcc73 : 0x8ceca6,
            0, y, 0
          )
        );
      }

      const fork = ball(
        root, 0.18, 0xffd36e,
        1.0, 0.5, 0
      );

      return (t, p) => {
        const n = clamp(
          p.pairs ?? 14,
          8, 20
        );

        const speed = p.speed ?? 2;

        helix.rotation.y = t * 0.19;

        for (let i = 0; i < 20; i++) {
          const y = (i - 9.5) * 0.22;
          const a = i * 0.68;

          strands[i].forEach((v, j) => {
            v.visible = i < n;

            v.position.set(
              0.67 * Math.cos(
                a + j * Math.PI
              ),
              y,
              0.67 * Math.sin(
                a + j * Math.PI
              )
            );
          });

          rungs[i].visible = i < n;
          rungs[i].rotation.y = -a;
        }

        const progress =
          (t * speed * 0.14) % 1;

        fork.position.y =
          0.5 + progress * 3.0;

        return (
          `DNA: ${n} base pairs · ` +
          `Replication fork: ${Math.round(progress * 100)}%`
        );
      };
    }

    /* ========================================
       6. NEURON & NERVE IMPULSE
    ======================================== */

    if (key === "neuron") {
      ellipsoid(
        root,
        0.59, 0.5, 0.55,
        0xf2b05f,
        -2.2, 2, 0
      );

      ball(
        root,
        0.23, 0xa86fe7,
        -2.2, 2, 0
      );

      for (let i = 0; i < 6; i++) {
        const a =
          i * Math.PI * 2 / 6;

        segment(
          root,
          [-2.45, 2, 0],
          [
            -3.4,
            2 + Math.sin(a) * 0.9,
            Math.cos(a) * 0.75
          ],
          0.055,
          0xf0af6d
        );
      }

      segment(
        root,
        [-1.65, 2, 0],
        [3.2, 2, 0],
        0.055,
        0xe2b77d
      );

      for (let i = 0; i < 7; i++) {
        const part = mesh(
          root,
          new T.CylinderGeometry(
            0.19, 0.19, 0.47, 22
          ),
          0xcbdaf0,
          -1.15 + i * 0.62,
          2, 0
        );

        part.rotation.z = Math.PI / 2;
      }

      const sparks = dots(
        root, 12, 0.125, 0xffdf54
      );

      return (t, p) => {
        const speed = p.speed ?? 40;
        const frequency =
          p.frequency ?? 4;

        sparks.forEach((d, i) => {
          d.visible = i < frequency;

          d.position.set(
            -1.65 +
            (
              (
                t * speed * 0.035 +
                i / Math.max(
                  1, frequency
                )
              ) % 1
            ) * 4.85,

            2 + 0.12 * Math.sin(
              t * 9 + i
            ),
            0
          );
        });

        return (
          `Conduction: ${speed} m/s · ` +
          `Frequency: ${frequency} Hz`
        );
      };
    }

    /* ========================================
       7. SEED GERMINATION & GROWTH
    ======================================== */

    if (key === "germination") {
      box(
        root, 5, 0.28, 3,
        0x73533b, 0, 0.18
      );

      const seed = ellipsoid(
        root,
        0.52, 0.32, 0.30,
        0xa66d44,
        0, 0.47
      );

      const rootTip = rod(
        root, 0.05, 1,
        0xf3eed2, 0, 0.1
      );

      const stem = rod(
        root, 0.09, 1,
        0x49ad6b, 0, 0.94
      );

      const leaves = [-1, 1].map(
        sign => {
          const leaf = ellipsoid(
            root,
            0.72, 0.13, 0.38,
            0x76d84f,
            sign * 0.57, 2, 0
          );

          leaf.rotation.z =
            sign * 0.28;

          return leaf;
        }
      );

      const drops = dots(
        root, 14, 0.065, 0x67b9ff
      );

      return (t, p) => {
        const moisture = clamp(
          (p.water ?? 75) / 100,
          0, 1
        );

        const temp = clamp(
          1 -
          Math.abs(
            (p.temperature ?? 26) - 25
          ) / 22,
          0, 1
        );

        const light = clamp(
          (p.light ?? 70) / 100,
          0, 1
        );

        const growth = clamp(
          t * moisture * temp *
          (0.4 + 0.6 * light) * 0.10,
          0, 1
        );

        seed.scale.set(
          0.52 * (1 - growth * 0.35),
          0.32, 0.30
        );

        rootTip.scale.y =
          0.2 + growth * 1.6;

        rootTip.position.y =
          0.22 - growth * 0.65;

        stem.scale.y =
          0.1 + growth * 2.5;

        stem.position.y =
          0.55 + growth * 0.98;

        leaves.forEach(l => {
          l.visible = growth > 0.27;

          l.position.y =
            0.65 + growth * 2.5;

          l.scale.set(
            0.2 + growth * 0.6,
            0.13,
            0.35
          );
        });

        drops.forEach((d, i) => {
          d.visible = moisture > 0;

          const u =
            (t * 0.18 + i / 14) % 1;

          d.position.set(
            Math.sin(i * 8) * 1.7,
            0.45 + u * 0.65,
            Math.cos(i * 5) * 1.0
          );
        });

        return (
          `Germination progress: ` +
          `${Math.round(growth * 100)}%`
        );
      };
    }

    /* ========================================
       8. LUNGS & BREATHING
    ======================================== */

    if (key === "breathing") {
      rod(
        root, 0.17, 1.85,
        0xbce7ec, 0, 3.23
      );

      segment(
        root,
        [0, 2.43, 0],
        [-0.83, 2.05, 0],
        0.11,
        0xa6ddf4
      );

      segment(
        root,
        [0, 2.43, 0],
        [0.83, 2.05, 0],
        0.11,
        0xa6ddf4
      );

      const lungs = [-1, 1].map(
        sign => ellipsoid(
          root,
          0.88, 1.35, 0.67,
          0xf398ae,
          sign * 0.94, 1.62, 0,
          {
            transparent: true,
            opacity: 0.85
          }
        )
      );

      const diaphragm = ellipsoid(
        root,
        2.05, 0.14, 0.86,
        0x80c5e4,
        0, 0.33
      );

      const airflow = dots(
        root, 13, 0.06, 0x80ecff
      );

      return (t, p) => {
        const rate = p.rate ?? 14;
        const tidal = p.tidal ?? 0.5;

        const inhale = (
          1 + Math.sin(
            t * rate / 60 *
            Math.PI * 2
          )
        ) / 2;

        lungs.forEach(l => {
          l.scale.set(
            0.85 + inhale * 0.17 * tidal,
            0.99 + inhale * 0.18 * tidal,
            0.68 + inhale * 0.12 * tidal
          );
        });

        diaphragm.position.y =
          0.34 - inhale * 0.16;

        airflow.forEach((d, i) => {
          const u = (
            t * rate / 60 * 0.42 +
            i / 13
          ) % 1;

          d.position.set(
            Math.sin(i) * 0.09,
            3.8 - u * 1.8,
            0.1 + Math.cos(i) * 0.11
          );
        });

        return (
          `Breathing: ${rate}/min · ` +
          `Ventilation: ${(rate * tidal).toFixed(1)} L/min`
        );
      };
    }

    return () => "";
  }

  /* ========================================
     CLEANUP
  ======================================== */

  function remove() {
    if (!current) return;

    const s = current;
    current = null;

    cancelAnimationFrame(s.frame);
    s.resize.disconnect();

    s.scene.traverse(o => {
      o.geometry?.dispose();

      if (o.material) {
        const materials =
          Array.isArray(o.material)
            ? o.material
            : [o.material];

        materials.forEach(m => m.dispose());
      }
    });

    s.renderer.dispose();

    if (
      s.canvas.isConnected &&
      s.holder.isConnected
    ) {
      s.holder.before(s.canvas);
    }

    s.holder.remove();
  }

  /* ========================================
     CONNECT WITH ORIGINAL BIOLOGY LABS
  ======================================== */

  async function attach() {
    const found = target();

    if (
      !found ||
      mounting ||
      current ||
      Date.now() < retryAt
    ) return;

    mounting = true;

    let T;

    try {
      T = await loadThree();
    } catch (error) {
      console.warn(
        "Biology 3D unavailable; original 2D lab preserved",
        error
      );

      THREEPromise = null;
      retryAt = Date.now() + 10000;
      mounting = false;
      return;
    }

    mounting = false;

    if (
      !target() ||
      target().canvas !== found.canvas ||
      current
    ) return;

    let renderer = null;
    let holder = null;
    let resize = null;

    try {
      renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: false
      });

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          2
        )
      );

      renderer.outputColorSpace =
        T.SRGBColorSpace;

      renderer.setClearColor(0x07192d);

      const scene = new T.Scene();

      scene.background =
        new T.Color(0x07192d);

      const camera =
        new T.PerspectiveCamera(
          44, 2, 0.1, 80
        );

      scene.add(
        new T.HemisphereLight(
          0xcaf2ff,
          0x203d47,
          2.4
        )
      );

      const light =
        new T.DirectionalLight(
          0xffffff,
          3.0
        );

      light.position.set(-3, 8, 6);
      scene.add(light);

      const floor = new T.Mesh(
        new T.PlaneGeometry(30, 30),
        new T.MeshStandardMaterial({
          color: 0x102d3d,
          roughness: 0.92
        })
      );

      floor.rotation.x =
        -Math.PI / 2;

      scene.add(floor);

      const grid = new T.GridHelper(
        12, 12,
        0x275c73,
        0x1a4050
      );

      grid.position.y = 0.02;
      scene.add(grid);

      const update = makeLab(
        T, scene, found.key
      );

      holder =
        document.createElement("div");

      holder.className = "pb3-holder";

      const view =
        document.createElement("div");

      view.className = "pb3-view";

      view.innerHTML = `
        <div class="pb3-label">
          BIOLOGY · REAL 3D
          <small class="pb3-detail">
            Interactive model
          </small>
        </div>

        <div class="pb3-help">
          DRAG TO ROTATE · SCROLL TO ZOOM
        </div>
      `;

      view.prepend(renderer.domElement);

      found.canvas.before(holder);

      holder.append(
        found.canvas,
        view
      );

      const s = {
        ...found,
        holder,
        view,
        scene,
        camera,
        renderer,
        update,
        frame: 0,
        resize: null,
        az: 0.65,
        el: 0.43,
        zoom: 9,
        time: 0,
        last: 0,
        lastStatus: "Ready"
      };

      current = s;

      /* RESIZE */

      const resizeFn = () => {
        if (current !== s) return;

        const rect =
          holder.getBoundingClientRect();

        const w = Math.max(
          1, rect.width
        );

        const h = Math.max(
          1, rect.height
        );

        renderer.setSize(
          w, h, false
        );

        camera.aspect = w / h;

        camera.updateProjectionMatrix();
      };

      resize = new ResizeObserver(
        resizeFn
      );

      resize.observe(holder);

      s.resize = resize;

      resizeFn();

      /* ROTATE AND ZOOM */

      let pointer = null;

      const canvas =
        renderer.domElement;

      canvas.addEventListener(
        "pointerdown",
        e => {
          pointer = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY
          };

          canvas.setPointerCapture(
            e.pointerId
          );
        }
      );

      canvas.addEventListener(
        "pointermove",
        e => {
          if (
            !pointer ||
            pointer.id !== e.pointerId
          ) return;

          s.az -= (
            e.clientX - pointer.x
          ) * 0.009;

          s.el = clamp(
            s.el +
            (e.clientY - pointer.y) *
            0.006,
            0.10,
            1.30
          );

          pointer.x = e.clientX;
          pointer.y = e.clientY;
        }
      );

      canvas.addEventListener(
        "pointerup",
        () => pointer = null
      );

      canvas.addEventListener(
        "pointercancel",
        () => pointer = null
      );

      canvas.addEventListener(
        "wheel",
        e => {
          e.preventDefault();

          s.zoom = clamp(
            s.zoom +
            e.deltaY * 0.008,
            5, 16
          );
        },
        { passive: false }
      );

      /* ANIMATION LOOP */

      const frame = now => {
        if (current !== s) return;

        const latest = target();

        if (
          !latest ||
          latest.canvas !== s.canvas ||
          latest.key !== s.key
        ) {
          remove();
          return;
        }

        s.frame =
          requestAnimationFrame(frame);

        const dt = s.last
          ? clamp(
              (now - s.last) / 1000,
              0, 0.05
            )
          : 0;

        s.last = now;

        const st = status();

        if (
          st === "Ready" &&
          s.lastStatus !== "Ready"
        ) {
          s.time = 0;
        }

        if (st === "Running") {
          s.time += dt;
        }

        s.lastStatus = st;

        try {
          const detail = s.update(
            s.time,
            params()
          );

          view.querySelector(
            ".pb3-detail"
          ).textContent = detail;

          const horizontal =
            s.zoom * Math.cos(s.el);

          camera.position.set(
            Math.sin(s.az) * horizontal,

            1.6 +
            s.zoom * Math.sin(s.el),

            Math.cos(s.az) * horizontal
          );

          camera.lookAt(
            0, 1.9, 0
          );

          renderer.render(
            scene,
            camera
          );
        } catch (error) {
          console.error(
            "Biology 3D rendering failed. Restoring original 2D.",
            error
          );

          remove();

          retryAt =
            Date.now() + 60000;
        }
      };

      /* FIRST FRAME */

      update(0, params());

      camera.position.set(
        5, 5.7, 8
      );

      camera.lookAt(
        0, 1.9, 0
      );

      renderer.render(
        scene,
        camera
      );

      s.frame =
        requestAnimationFrame(frame);

      console.info(
        "PocketLab Biology 3D ready:",
        found.key
      );

    } catch (error) {
      console.error(
        "Biology 3D startup failed. Original 2D kept.",
        error
      );

      retryAt =
        Date.now() + 10000;

      if (current) {
        remove();
      } else {
        resize?.disconnect();
        renderer?.dispose();
        holder?.remove();
      }
    }
  }

  /* AUTOMATICALLY DETECT OPENED LAB */

  setInterval(() => {
    const found = target();

    if (
      current &&
      (
        !found ||
        found.canvas !== current.canvas ||
        found.key !== current.key
      )
    ) {
      remove();
    }

    if (found && !current) {
      attach();
    }
  }, 400);

})();
