import { wait } from './utils'
import {
  RESET_STEP,
  ORDER_B2B_STEP,
  ORDER_D2C_STEP,
  MANUFACTURING_STEP,
  POSTPONEMENT_STEP,
  FULFILLMENT_STEP,
  DELIVERY_B2B_STEP,
  DELIVERY_D2C_STEP,
} from './consts'

export const currentStepLabel = document.querySelector('.current-step')
export const logo = document.querySelector('.logo')
export const gradTop = document.querySelector('.grad-top')
export const gradBottom = document.querySelector('.grad-bottom')
export const todayButton = document.querySelector('.today-button')
export const longFlghts = document.querySelector('.long-flights')
export const canvas = document.querySelector('#canvas')
export const launchButton = document.querySelector('.launch-button')
export const uploadLogoInput = document.querySelector('.upload-logo-input')
export const tomorrowButton = document.querySelector('.tomorrow-button')
export const pathButtons = document.querySelector('.path-buttons')
export const rightButton = document.querySelector('.right-nav-button')
export const leftButton = document.querySelector('.left-nav-button')
export const clientLogo = document.querySelector('.client-logo')
export const uploadLogoLabel = document.querySelector('.upload-logo')
export const b2bButton = document.querySelector('.b2b-button')
export const d2cButton = document.querySelector('.d2c-button')
export const html = document.querySelector('html')
export const heading = document.querySelector('h1')
export const nav = document.querySelector('nav')
export const overlay = document.querySelector('.canvas-overlay')
export const placeOrderButton = document.querySelector('.place-order-button')
export const placeOrderD2CButton = document.querySelector(
  '.place-order-d2c-button'
)
export const manufactureButton = document.querySelector('.manufacture-button')
export const postponementButton = document.querySelector('.postponement-button')
export const fulfillmentButton = document.querySelector('.fulfillment-button')
export const deliveryButton = document.querySelector('.delivery-button')
export const progressBar = document.querySelector('.progress-bar')
export const globeButton = document.querySelector('.globe-button')
export const restartScene = document.querySelector('.restart')
export const restartButton = document.querySelector('.restart-button')
export const menuButtons = document.querySelectorAll('.nav-menu-button')

export const setNavButtonActive = (name) => {
  const navButtons = document.querySelectorAll('.nav-menu-button')
  navButtons.forEach((b) => {
    b.classList.remove('active')
  })
  Array.from(navButtons).every((b) => {
    b.classList.add('active')
    if (b.classList.contains(`nav-button-${name}`)) {
      return false
    }
    return true
  })
}

export const setElementVisibility = (element, visible) => {
  if (element) {
    if (visible) {
      element.classList.remove('hidden')
    } else {
      element.classList.add('hidden')
    }
  }
}

export const showOverlay = (color, duration, delay = 0) => {
  const transitionProps = `${duration}ms ease ${delay}ms`
  overlay.style.transition = `opacity ${transitionProps}, background-color ${transitionProps}`
  overlay.style.backgroundColor = color
  overlay.style.opacity = 1
  return wait(duration + delay)
}

export const hideOverlay = (duration, delay = 0) => {
  overlay.style.transition = `opacity ${duration}ms ease ${delay}ms`
  overlay.style.opacity = 0
  overlay.style.pointerEvents = 'none'
  return wait(duration + delay)
}

export const updateNavLine = (step) => {
  switch (step) {
    case ORDER_B2B_STEP:
    case ORDER_D2C_STEP: {
      document.querySelector('.star-1').classList.add('star-active')
      document.querySelector('.star-2').classList.remove('star-active')
      document.querySelector('.star-3').classList.remove('star-active')
      document.querySelector('.star-4').classList.remove('star-active')
      document.querySelector('.star-5').classList.remove('star-active')
      document.querySelector('.active-line').style.right = '100%'
      return
    }
    case MANUFACTURING_STEP: {
      document.querySelector('.star-1').classList.add('star-active')
      document.querySelector('.star-2').classList.add('star-active')
      document.querySelector('.star-3').classList.remove('star-active')
      document.querySelector('.star-4').classList.remove('star-active')
      document.querySelector('.star-5').classList.remove('star-active')
      document.querySelector('.active-line').style.right = '79%'
      return
    }
    case POSTPONEMENT_STEP: {
      document.querySelector('.star-1').classList.add('star-active')
      document.querySelector('.star-2').classList.add('star-active')
      document.querySelector('.star-3').classList.add('star-active')
      document.querySelector('.star-4').classList.remove('star-active')
      document.querySelector('.star-5').classList.remove('star-active')
      document.querySelector('.active-line').style.right = '49%'
      return
    }
    case FULFILLMENT_STEP: {
      document.querySelector('.star-1').classList.add('star-active')
      document.querySelector('.star-2').classList.add('star-active')
      document.querySelector('.star-3').classList.add('star-active')
      document.querySelector('.star-4').classList.add('star-active')
      document.querySelector('.star-5').classList.remove('star-active')
      document.querySelector('.active-line').style.right = '22%'
      return
    }
    case DELIVERY_B2B_STEP:
    case DELIVERY_D2C_STEP: {
      document.querySelector('.star-1').classList.add('star-active')
      document.querySelector('.star-2').classList.add('star-active')
      document.querySelector('.star-3').classList.add('star-active')
      document.querySelector('.star-4').classList.add('star-active')
      document.querySelector('.star-5').classList.add('star-active')
      document.querySelector('.active-line').style.right = '0'
      return
    }
    case RESET_STEP: {
      document
        .querySelectorAll('.star')
        .forEach((star) => star.classList.add('star-active'))
      document.querySelector('.active-line').style.right = '100%'
    }
  }
}
