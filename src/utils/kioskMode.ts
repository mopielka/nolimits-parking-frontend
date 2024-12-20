const lockActions = () => {
  document.addEventListener('contextmenu', (event) => event.preventDefault()) // Disable right-click
  document.addEventListener('mousedown', (event) => {
    if (event.button === 1) event.preventDefault() // Disable middle mouse button
  })
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) event.preventDefault() // Disable multi-touch gestures
  })
  void document.documentElement.requestFullscreen()
}

const setUpAutoRefresh = (seconds: number = 300) => {
  let idleTime = 0
  ;['mousemove', 'keydown', 'touchstart', 'input'].map((event) =>
    document.addEventListener(event, () => (idleTime = 0)),
  )

  setInterval(() => {
    idleTime++
    if (idleTime > seconds) {
      location.reload()
    }
  }, 1000)
}

export { lockActions, setUpAutoRefresh }
