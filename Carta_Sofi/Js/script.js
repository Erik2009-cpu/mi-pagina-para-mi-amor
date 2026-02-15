//© Zero - Código libre no comercial


// Cargar el SVG y animar los corazones
fetch('Img/imagen2prueba.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Añadir imagen superpuesta (overlay) — por defecto usa `Img/Imagen en Corazón (1).jpeg`.
    // Puedes pasar `?overlay=nombre.jpg` en la URL para cambiar la imagen.
    (function(){
      const overlayParam = (typeof getURLParam === 'function') ? getURLParam('overlay') : null;
      const filename = overlayParam ? decodeURIComponent(overlayParam).replace(/[^\w\d .\-()]/g,'') : 'Imagen_en_Corazón__1_-removebg-preview.png';
      const src = 'Img/' + filename;
      if (container.querySelector('.tree-overlay')) return; // ya existe
      const img = document.createElement('img');
      img.className = 'tree-overlay';
      img.src = src;
      img.alt = '';
      img.style.pointerEvents = 'none';
      img.style.opacity = '0';
      img.onload = () => { img.style.transition = 'opacity 0.3s ease'; img.style.opacity = '1'; };
      // Si falla la carga (archivo no encontrado), lo eliminamos para no mostrar broken icon
      img.onerror = () => { if (img.parentNode) img.parentNode.removeChild(img); };
      container.appendChild(img);
    })();

    // Animación de "dibujo" para todos los paths
    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#f80b0b';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Forzar reflow y luego animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      // Después de la animación de dibujo, mueve y agranda el SVG
      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        // Mostrar texto con efecto typing
        setTimeout(() => {
          showDedicationText();
          // Mostrar petalos flotando
          startFloatingObjects();
          // Mostrar cuenta regresiva
          showCountdown();
          // Iniciar música de fondo
          playBackgroundMusic();
        }, 1200); //Tiempo para agrandar el SVG
      }, totalDuration);
    }, 50);

    // Selecciona los corazones (formas rojas)
    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

// Efecto máquina de escribir para el texto de dedicatoria (seguidores)
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { //seguidores
  let text = getURLParam('text');
  if (!text) {
    text = `Para el amor de mi vida:
    \nDesde el primer día que te vi supe que había visto algo especial en ti, es estúpido decir que entre muchas personas sentí algo diferente en ti que me atrajo demasiado, tal vez tu sencilles fue la razón o tu sola esencia fue la que me llamo, sin embargo, me diste la oportunidad de conocerte y gradezco eso en serio mi preciosa niña. No me arrepiento y nunca me arrepentiré de conocerte, me gustas y has llegado a cautivarme tanto al punto de amarte y desearte demasiado, me dijeron mucho, amor de distancia, amor de pendejos, pero si por amarte soy pendejo, seré pendejo por el resto de mi vida, se y estoy seguro que en un día esa distancia se terminara, anhelo ese día mi niña.
    Gracias por aguantarme y seguir amándome cuando no lo debías, eso me demuestra mucho y te prometí que cuando lo volviéramos a intentar daría todo de mi y eso voy a hacer, te voy amar todo lo que me dejes amarte.\n
    Te quiero mucho mi preciosa niña.`;  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      // Al terminar el typing, mostrar la firma animada
      setTimeout(showSignature, 600);
    }
  }
  type();
}

// Firma manuscrita animada
function showSignature() {
  // Cambia para buscar la firma dentro del contenedor de dedicatoria
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Att: Tu amorcito";
  signature.classList.add('visible');
}



// Controlador de objetos flotantes
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    // Posición inicial
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    // Animación flotante
    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    // Eliminar después de animar
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    // Generar más objetos
    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

// Cuenta regresiva o fecha especial
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2025-10-30T00:00:00'); 
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2026-10-30T00:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let eventDiff = eventDate - now;
    let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `Nos conocimos hace: <b>${days}</b> días<br>` +
      `Cumplimos un año en: <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;
    container.classList.add('visible');
  }
  update(); 
  setInterval(update, 1000);
}

// --- Música de fondo ---
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  // --- Opción archivo local por parámetro 'musica' ---
  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    // Decodifica y previene rutas maliciosas
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = 'Music/' + musicaParam;
  }

  // --- Opción YouTube (solo mensaje de ayuda) ---
  let youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    // Muestra mensaje de ayuda para descargar el audio
    let helpMsg = document.getElementById('yt-help-msg');
    if (!helpMsg) {
      helpMsg = document.createElement('div');
      helpMsg.id = 'yt-help-msg';
      helpMsg.style.position = 'fixed';
      helpMsg.style.right = '18px';
      helpMsg.style.bottom = '180px';
      helpMsg.style.background = 'rgba(255,255,255,0.95)';
      helpMsg.style.color = '#e60026';
      helpMsg.style.padding = '10px 16px';
      helpMsg.style.borderRadius = '12px';
      helpMsg.style.boxShadow = '0 2px 8px #e6002633';
      helpMsg.style.fontSize = '1.05em';
      helpMsg.style.zIndex = 100;
      helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
      document.body.appendChild(helpMsg);
      setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
    }
  }

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = '🔊 Música';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(255,255,255,0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }
  audio.volume = 0.7;
  audio.loop = true;

  // Si la fuente no carga, intenta un fallback local conocido
  audio.addEventListener('error', () => {
    const fallback = 'Music/A Dónde Vamos [kh08dhuOcKM].mp3';
    if (!audio.src.includes(fallback)) {
      audio.src = fallback;
      audio.load();
      // intentar reproducir de nuevo (si el usuario ya interactuó)
      audio.play().catch(() => {});
    }
  });

  // Intentar reproducir inmediatamente
  audio.play().then(() => {
    btn.textContent = '🔊 Música';
  }).catch(() => {
    // Autoplay probablemente bloqueado por el navegador — reproducir en el primer gesto del usuario
    btn.textContent = '▶️ Música';

    const startOnUserGesture = () => {
      audio.play().then(() => {
        btn.textContent = '🔊 Música';
      }).catch(() => {});
      window.removeEventListener('pointerdown', startOnUserGesture);
      window.removeEventListener('touchstart', startOnUserGesture);
      window.removeEventListener('keydown', startOnUserGesture);
      window.removeEventListener('focus', startOnUserGesture);
      document.removeEventListener('visibilitychange', startOnUserGesture);
    };

    // Reintentar en el primer gesto (click/tap/tecla/focus/visibilidad)
    window.addEventListener('pointerdown', startOnUserGesture, { once: true, passive: true });
    window.addEventListener('touchstart', startOnUserGesture, { once: true, passive: true });
    window.addEventListener('keydown', startOnUserGesture, { once: true, passive: true });
    window.addEventListener('focus', startOnUserGesture, { once: true });
    document.addEventListener('visibilitychange', function onVis() {
      if (!document.hidden) startOnUserGesture();
    }, { once: true });
  });
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '🔊 Música';
    } else {
      audio.pause();
      btn.textContent = '🔈 Música';
    }
  };
}

// Intentar reproducir la música lo antes posible (al cargar la página)
window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});
