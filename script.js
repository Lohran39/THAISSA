// Variáveis globais
let magicMode = false
let romanticMode = false
let confettiActive = false

// Inicialização quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
  initializeCursor()
  initializeScrollAnimations()
  initializeInteractiveElements()
  createFloatingParticles()
  addAnimationStyles()
})

// Sistema de cursor unificado
function initializeCursor() {
  const hiddenMessages = document.querySelectorAll(".hidden-message")

  document.addEventListener("mousemove", (e) => {
    // Atualizar cursor baseado no modo ativo
    const cursor = romanticMode ? document.querySelector(".romantic-cursor") : document.querySelector(".magic-cursor")

    if (cursor) {
      cursor.style.left = e.clientX - 10 + "px"
      cursor.style.top = e.clientY - 10 + "px"
    }

    // Verificar proximidade com mensagens ocultas
    hiddenMessages.forEach((message) => {
      const rect = message.getBoundingClientRect()
      const messageX = rect.left + rect.width / 2
      const messageY = rect.top + rect.height / 2

      const distance = Math.sqrt(Math.pow(e.clientX - messageX, 2) + Math.pow(e.clientY - messageY, 2))

      if (distance < 100) {
        message.classList.add("revealed")
        setTimeout(() => {
          message.classList.remove("revealed")
        }, 3000)
      }
    })
  })

  // Efeitos especiais ao clicar
  document.addEventListener("click", (e) => {
    if (romanticMode) {
      createHeartEffect(e.clientX, e.clientY)
    } else {
      createClickEffect(e.clientX, e.clientY)
    }
  })
}

// Criar efeito de clique mágico
function createClickEffect(x, y) {
  const effect = document.createElement("div")
  effect.style.cssText = `
    position: fixed;
    left: ${x - 15}px;
    top: ${y - 15}px;
    width: 30px;
    height: 30px;
    background: radial-gradient(circle, #7c3aed, transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    animation: click-ripple 0.6s ease-out forwards;
  `

  document.body.appendChild(effect)
  setTimeout(() => effect.remove(), 600)
}

// Criar efeito de clique com corações
function createHeartEffect(x, y) {
  const hearts = ["💕", "💖", "💗", "💝"]

  for (let i = 0; i < 3; i++) {
    const heart = document.createElement("div")
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]
    heart.style.cssText = `
      position: fixed;
      left: ${x - 10 + (Math.random() - 0.5) * 40}px;
      top: ${y - 10 + (Math.random() - 0.5) * 40}px;
      font-size: 1.5rem;
      pointer-events: none;
      z-index: 9999;
      animation: heart-burst 1s ease-out forwards;
    `

    document.body.appendChild(heart)
    setTimeout(() => heart.remove(), 1000)
  }
}

// Animações de scroll
function initializeScrollAnimations() {
  const sections = document.querySelectorAll("section")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible")
          entry.target.classList.remove("section-hidden")
        }
      })
    },
    { threshold: 0.1 },
  )

  sections.forEach((section) => {
    section.classList.add("section-hidden")
    observer.observe(section)
  })
}

// Elementos interativos
function initializeInteractiveElements() {
  const startJourneyButton = document.getElementById("startJourney")
  if (startJourneyButton) {
    startJourneyButton.addEventListener("click", startMagicalJourney)
  }

  const magicWand = document.getElementById("magicWand")
  if (magicWand) {
    magicWand.addEventListener("click", toggleMode)
  }

  const sendWishBtn = document.getElementById("sendWish")
  if (sendWishBtn) {
    sendWishBtn.addEventListener("click", sendWish)
  }

  const blowCandles = document.getElementById("blowCandles")
  if (blowCandles) {
    blowCandles.addEventListener("click", blowOutCandles)
  }

  // Cards de memória
  const memoryCards = document.querySelectorAll(".memory-card")
  memoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.add("magic-active")

      if (romanticMode) {
        createFloatingHearts(card)
      } else {
        createMagicBurst()
      }

      setTimeout(() => card.classList.remove("magic-active"), 500)
    })
  })
}

function toggleMode() {
  romanticMode = !romanticMode
  magicMode = !romanticMode // Apenas um modo ativo por vez

  const wand = document.getElementById("magicWand")
  if (wand) {
    wand.style.transform = romanticMode ? "scale(1.5) rotate(360deg)" : "scale(1) rotate(0deg)"
  }

  if (romanticMode) {
    createLoveBurst()
    document.body.style.filter = "hue-rotate(15deg) saturate(1.2)"
    createHeartRain()
  } else {
    createMagicBurst()
    document.body.style.filter = ""
  }
}

// Iniciar jornada mágica
function startMagicalJourney() {
  const memoriesSection = document.getElementById("memoriesSection")
  if (memoriesSection) {
    memoriesSection.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  createMagicBurst()
  magicMode = true
  romanticMode = false

  setTimeout(() => {
    magicMode = false
  }, 5000)
}

// Iniciar jornada romântica
function startRomanticJourney() {
  const memoriesSection = document.getElementById("memoriesSection")
  if (memoriesSection) {
    memoriesSection.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  createLoveBurst()
  romanticMode = true
  magicMode = false

  setTimeout(() => {
    romanticMode = false
  }, 8000)
}

function sendWish() {
  const wishInput = document.getElementById("wishInput")
  const wishesDisplay = document.getElementById("wishesDisplay")

  if (!wishInput || !wishesDisplay) return

  const wishText = wishInput.value.trim()
  if (!wishText) return

  const wishBubble = document.createElement("div")
  wishBubble.className = "wish-bubble"
  wishBubble.textContent = (romanticMode ? "💕 " : "✨ ") + wishText

  wishesDisplay.insertBefore(wishBubble, wishesDisplay.firstChild)
  wishInput.value = ""

  // Efeito baseado no modo ativo
  if (romanticMode) {
    createLoveWishEffect()
  } else {
    createWishEffect()
  }

  // Limitar número de desejos
  const wishes = wishesDisplay.querySelectorAll(".wish-bubble")
  if (wishes.length > 5) {
    wishes[wishes.length - 1].remove()
  }
}

// Soprar velas
function blowOutCandles() {
  const candles = document.querySelectorAll(".candle")
  const cake = document.getElementById("birthdayCake")
  const blowButton = document.getElementById("blowCandles")

  if (!candles.length) {
    console.log("Velas não encontradas")
    return
  }

  // Desabilitar botão temporariamente
  if (blowButton) {
    blowButton.disabled = true
    blowButton.textContent = "Soprando..."
  }

  // Apagar velas uma por uma
  candles.forEach((candle, index) => {
    setTimeout(() => {
      candle.style.opacity = "0.3"
      candle.style.transform = "scale(0.8)"
      candle.style.filter = "grayscale(100%)"
    }, index * 200)
  })

  // Criar confetes após soprar
  setTimeout(() => {
    createConfetti()
    if (cake) {
      cake.style.animation = "cake-celebration 2s ease-in-out"
    }

    // Mostrar mensagem de parabéns
    showCongratulationsMessage()
  }, 1000)

  // Reacender velas após 5 segundos
  setTimeout(() => {
    candles.forEach((candle) => {
      candle.style.opacity = "1"
      candle.style.transform = "scale(1)"
      candle.style.filter = "none"
    })
    if (cake) {
      cake.style.animation = "cake-bounce 2s infinite ease-in-out"
    }

    // Reabilitar botão
    if (blowButton) {
      blowButton.disabled = false
      blowButton.textContent = "Soprar as Velas"
    }
  }, 5000)
}

function showCongratulationsMessage() {
  const message = document.createElement("div")
  message.textContent = romanticMode
    ? "💕 Parabéns, meu amor! 💕"
    : "🎉 Parabéns! Que todos os seus desejos se realizem! 🎉"
  message.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    background: ${romanticMode ? "linear-gradient(45deg, #e91e63, #f06292)" : "linear-gradient(45deg, #7c3aed, #8b5cf6)"};
    color: white;
    padding: 1.5rem 2rem;
    border-radius: 15px;
    font-size: 1.2rem;
    font-weight: 700;
    text-align: center;
    z-index: 10000;
    animation: congratulations-appear 3s ease-in-out forwards;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `

  document.body.appendChild(message)

  setTimeout(() => {
    message.remove()
  }, 3000)
}

// Criar explosão mágica
function createMagicBurst() {
  const colors = ["#7c3aed", "#8b5cf6", "#a855f7", "#c084fc"]

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div")
    const angle = (i / 20) * Math.PI * 2
    const velocity = 100 + Math.random() * 100

    particle.style.cssText = `
      position: fixed;
      left: 50%;
      top: 50%;
      width: 6px;
      height: 6px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: magic-burst 1s ease-out forwards;
      --vx: ${Math.cos(angle) * velocity}px;
      --vy: ${Math.sin(angle) * velocity}px;
    `

    document.body.appendChild(particle)
    setTimeout(() => particle.remove(), 1000)
  }
}

// Criar explosão de amor
function createLoveBurst() {
  const loveSymbols = ["💕", "💖", "💗", "💝", "💘", "💞"]

  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("div")
    const angle = (i / 15) * Math.PI * 2
    const velocity = 80 + Math.random() * 120

    heart.textContent = loveSymbols[Math.floor(Math.random() * loveSymbols.length)]
    heart.style.cssText = `
      position: fixed;
      left: 50%;
      top: 50%;
      font-size: 1.5rem;
      pointer-events: none;
      z-index: 9999;
      animation: love-burst 2s ease-out forwards;
      --vx: ${Math.cos(angle) * velocity}px;
      --vy: ${Math.sin(angle) * velocity}px;
    `

    document.body.appendChild(heart)
    setTimeout(() => heart.remove(), 2000)
  }
}

// Criar efeito de desejo
function createWishEffect() {
  const stars = ["⭐", "✨", "🌟", "💫"]

  for (let i = 0; i < 10; i++) {
    const star = document.createElement("div")
    star.textContent = stars[Math.floor(Math.random() * stars.length)]
    star.style.cssText = `
      position: fixed;
      left: ${Math.random() * window.innerWidth}px;
      top: ${window.innerHeight}px;
      font-size: 1.5rem;
      pointer-events: none;
      z-index: 9999;
      animation: wish-float 3s ease-out forwards;
    `

    document.body.appendChild(star)
    setTimeout(() => star.remove(), 3000)
  }
}

// Criar efeito de desejo de amor
function createLoveWishEffect() {
  const loveSymbols = ["💕", "💖", "💗", "💝", "💘", "💞", "🌹", "💐"]

  for (let i = 0; i < 8; i++) {
    const symbol = document.createElement("div")
    symbol.textContent = loveSymbols[Math.floor(Math.random() * loveSymbols.length)]
    symbol.style.cssText = `
      position: fixed;
      left: ${Math.random() * window.innerWidth}px;
      top: ${window.innerHeight}px;
      font-size: 1.5rem;
      pointer-events: none;
      z-index: 9999;
      animation: love-float 4s ease-out forwards;
    `

    document.body.appendChild(symbol)
    setTimeout(() => symbol.remove(), 4000)
  }
}

// Criar chuva de corações
function createHeartRain() {
  const hearts = ["💕", "💖", "💗", "💝"]

  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const heart = document.createElement("div")
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]
      heart.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: -20px;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 999;
        animation: heart-rain 6s linear forwards;
        opacity: 0.8;
      `

      document.body.appendChild(heart)
      setTimeout(() => heart.remove(), 6000)
    }, i * 300)
  }
}

// Criar corações flutuantes para cards
function createFloatingHearts(element) {
  const rect = element.getBoundingClientRect()
  const hearts = ["💕", "💖", "💗"]

  for (let i = 0; i < 5; i++) {
    const heart = document.createElement("div")
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)]
    heart.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2 + (Math.random() - 0.5) * 100}px;
      top: ${rect.top + rect.height / 2}px;
      font-size: 1rem;
      pointer-events: none;
      z-index: 9999;
      animation: card-hearts 2s ease-out forwards;
    `

    document.body.appendChild(heart)
    setTimeout(() => heart.remove(), 2000)
  }
}

// Criar partículas flutuantes
function createFloatingParticles() {
  setInterval(() => {
    if (Math.random() < 0.3) {
      const particle = document.createElement("div")

      if (romanticMode) {
        particle.textContent = ["💕", "💖", "🌹", "💐"][Math.floor(Math.random() * 4)]
      } else {
        particle.textContent = ["✨", "⭐", "🌟"][Math.floor(Math.random() * 3)]
      }

      particle.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: -20px;
        font-size: 1rem;
        pointer-events: none;
        z-index: 1;
        animation: particle-fall 8s linear forwards;
        opacity: 0.7;
      `

      document.body.appendChild(particle)
      setTimeout(() => particle.remove(), 8000)
    }
  }, 2000)
}

// Criar confetes
function createConfetti() {
  if (confettiActive) return
  confettiActive = true

  const colors = ["#e91e63", "#f06292", "#ec407a", "#f48fb1", "#f8bbd9"]

  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div")
      confetti.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: -10px;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
        animation-delay: ${Math.random() * 2}s;
      `

      document.body.appendChild(confetti)
      setTimeout(() => confetti.remove(), 4000)
    }, i * 50)
  }

  setTimeout(() => {
    confettiActive = false
  }, 8000)
}

function addAnimationStyles() {
  const style = document.createElement("style")
  style.textContent = `
    @keyframes click-ripple {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(4); opacity: 0; }
    }
    
    @keyframes heart-burst {
      0% { transform: scale(0) rotate(0deg); opacity: 1; }
      50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
      100% { transform: scale(0) rotate(360deg); opacity: 0; }
    }
    
    @keyframes magic-burst {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      100% { transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(0); opacity: 0; }
    }
    
    @keyframes love-burst {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      50% { transform: translate(calc(-50% + var(--vx) * 0.5), calc(-50% + var(--vy) * 0.5)) scale(1.2); opacity: 1; }
      100% { transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(0); opacity: 0; }
    }
    
    @keyframes wish-float {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes love-float {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes heart-rain {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 0.8; }
      100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes card-hearts {
      0% { transform: translateY(0) scale(0); opacity: 1; }
      50% { transform: translateY(-30px) scale(1); opacity: 1; }
      100% { transform: translateY(-60px) scale(0); opacity: 0; }
    }
    
    @keyframes particle-fall {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 0.7; }
      100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes confetti-fall {
      0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    
    @keyframes cake-celebration {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.1) rotate(-5deg); }
      75% { transform: scale(1.1) rotate(5deg); }
    }
    
    @keyframes congratulations-appear {
      0% { transform: translateX(-50%) scale(0); opacity: 0; }
      20% { transform: translateX(-50%) scale(1.1); opacity: 1; }
      100% { transform: translateX(-50%) scale(1); opacity: 0; }
    }
  `
  document.head.appendChild(style)
}

// Easter egg: Modo secreto romântico
function activateSecretMode() {
  const secretMessage = document.createElement("div")
  secretMessage.textContent = "💕 VOCÊ É O AMOR DA MINHA VIDA! 💕"
  secretMessage.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, #e91e63, #f06292);
    color: white;
    padding: 2rem;
    border-radius: 20px;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    z-index: 10000;
    animation: romantic-pulse 1s infinite;
    font-style: italic;
  `

  document.body.appendChild(secretMessage)
  createHeartRain()
  createLoveBurst()

  setTimeout(() => {
    secretMessage.remove()
  }, 6000)
}

// Código Konami para easter egg
let konamiCode = []
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
]

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.code)
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift()
  }
  if (konamiCode.join(",") === konamiSequence.join(",")) {
    activateSecretMode()
    konamiCode = []
  }
})

// Adicionar animação para modo secreto
const secretStyle = document.createElement("style")
secretStyle.textContent = `
  @keyframes romantic-pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
  }
`
document.head.appendChild(secretStyle)

console.log("💕 Site de aniversário romântico carregado! ✨")
console.log("💡 Dica: Clique na varinha mágica para alternar entre modos!")
console.log("🎁 Easter egg: Tente o código Konami para uma surpresa especial!")
