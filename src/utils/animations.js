import anime from 'animejs/lib/anime.es.js'

export const gridAnimation = (target, row, column) => {
  anime({
    targets: target,
    scale: [
      {
        value: 0.1,
        easing: 'easeOutSine',
        duration: 300
      },
      { value: 1, easing: 'easeInOutQuad', duration: 800 }
    ],
    delay: anime.stagger(200, { grid: [row, column], from: 'center' })
  })
}
