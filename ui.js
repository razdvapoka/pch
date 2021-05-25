import { wait } from "./utils";

export const todayButton = document.querySelector(".today-button");
export const longFlghts = document.querySelector(".long-flights");
export const canvas = document.querySelector("#canvas");
export const launchButton = document.querySelector(".launch-button");
export const uploadLogoInput = document.querySelector(".upload-logo-input");
export const tomorrowButton = document.querySelector(".tomorrow-button");
export const pathButtons = document.querySelector(".path-buttons");
export const rightButton = document.querySelector(".right-nav-button");
export const leftButton = document.querySelector(".left-nav-button");
export const clientLogo = document.querySelector(".client-logo");
export const uploadLogoLabel = document.querySelector(".upload-logo");
export const b2bButton = document.querySelector(".b2b-button");
export const d2cButton = document.querySelector(".d2c-button");
export const html = document.querySelector("html");
export const heading = document.querySelector("h1");
export const nav = document.querySelector("nav");
export const overlay = document.querySelector(".canvas-overlay");
export const placeOrderButton = document.querySelector(".place-order-button");
export const placeOrderD2CButton = document.querySelector(
  ".place-order-d2c-button"
);
export const manufactureButton = document.querySelector(".manufacture-button");
export const postponementButton = document.querySelector(
  ".postponement-button"
);
export const fulfillmentButton = document.querySelector(".fulfillment-button");
export const deliveryButton = document.querySelector(".delivery-button");
export const progressBar = document.querySelector(".progress-bar");
export const globeButton = document.querySelector(".globe-button");
export const restartScene = document.querySelector(".restart");
export const restartButton = document.querySelector(".restart-button");

export const setNavButtonActive = (name, isActive) => {
  const btn = document.querySelector(`.nav-button-${name}`);
  if (isActive) {
    btn.classList.add("active");
  } else {
    btn.classList.remove("active");
  }
};

export const setElementVisibility = (element, visible) => {
  if (visible) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
};

export const showOverlay = (color, duration, delay = 0) => {
  const transitionProps = `${duration}ms ease ${delay}ms`;
  overlay.style.transition = `opacity ${transitionProps}, background-color ${transitionProps}`;
  overlay.style.backgroundColor = color;
  overlay.style.opacity = 1;
  return wait(duration + delay);
};

export const hideOverlay = (duration, delay = 0) => {
  overlay.style.transition = `opacity ${duration}ms ease ${delay}ms`;
  overlay.style.opacity = 0;
  overlay.style.pointerEvents = "none";
  return wait(duration + delay);
};
