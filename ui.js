export const canvas = document.querySelector("#canvas");
export const launchButton = document.querySelector(".launch-button");
export const uploadLogoInput = document.querySelector(".upload-logo-input");
export const nextButton = document.querySelector(".next-button");
export const pathButtons = document.querySelector(".path-buttons");
export const rightButton = document.querySelector(".right-nav-button");
export const leftButton = document.querySelector(".left-nav-button");
export const clientLogo = document.querySelector(".client-logo");
export const uploadLogoLabel = document.querySelector(".upload-logo");
export const b2bButton = document.querySelector(".b2b-button");
export const html = document.querySelector("html");
export const heading = document.querySelector("h1");
export const nav = document.querySelector("nav");
export const overlay = document.querySelector(".canvas-overlay");
export const placeOrderButton = document.querySelector(".place-order-button");

export const setElementVisibility = (element, visible) => {
  if (visible) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
};
