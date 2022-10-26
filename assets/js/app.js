// DOM Nodes to read from
const inputAmount = document.querySelector("#input-amount");

// DOM Nodes to modify
const prodTotalPrice = document.querySelector("#prod-total-price");
const prodAmount = document.querySelector("#prod-amount");
const prodColor = document.querySelector("#prod-color");
const prodPrice = document.querySelector("#prod-price");
const body = document.body;

// DOM Nodes in which we'll check for events
const inputColor = document.querySelector("#input-color");
const calcButton = document.querySelector("#calc-button");

// Product Prices
const PROD_PRICES = [600000, 625000, 650000, 675000, 700000, 725000, 750000];

//Intl objects
const numberFormat = new Intl.NumberFormat("es-CL");

// Helpers
const isValidNumber = (num) => {
  if (typeof num === "string") {
    //Check edge case where string is empty
    if (num.length === 0) {
      return false;
    }

    num = Number(num);
  }

  return Number.isInteger(num) && num > 0;
};

const isValidNameColor = (colorStr) => {
  if (colorStr.charAt(0) === "#") return false;

  const dummyElement = document.createElement("div");
  dummyElement.style.color = colorStr;

  return dummyElement.style.color === colorStr;
};

const isValidHexColor = (colorStr) => {
  if (colorStr.length !== 4 && colorStr.length !== 7) return false;

  if (colorStr.charAt(0) !== "#") return false;

  return !isNaN("0x" + colorStr.substring(1));
};

const isValidColor = (color) => {
  if (typeof color !== "string") {
    color = String(color);
  }

  if (color.length === 0) return false;

  if (isValidNameColor(color)) return true;

  if (isValidHexColor(color)) return true;

  return false;
};

const validateInput = () => {
  const res = {
    valid: true,
    errorReason: "",
  };

  const setInvalidResult = (reason) => {
    res.valid = false;
    res.errorReason = reason;
  };

  const amountValue = inputAmount.value;
  const colorValue = inputColor.value.toLowerCase();

  if (!isValidNumber(amountValue)) {
    setInvalidResult("Por favor, ingrese una cantidad válida");
  } else if (!isValidColor(colorValue)) {
    setInvalidResult(
      "Por favor, ingrese un nombre de color o código hex válido (Ej. red o #FF0000)"
    );
  }

  return res;
};

// Credit: https://stackoverflow.com/questions/664014/what-integer-hash-function-are-good-that-accepts-an-integer-hash-key
const hashColor = (num) => {
  num = ((num >>> 16) ^ num) * 0x45d9f3b;
  num = ((num >>> 16) ^ num) * 0x45d9f3b;
  num = (num >>> 16) ^ num;

  return Math.abs(num) % PROD_PRICES.length;
};

const colorToInt = (name) => {
  const dummyElement = document.createElement("div");
  dummyElement.style.color = name;

  body.appendChild(dummyElement);
  const rgb = window.getComputedStyle(dummyElement).color;
  body.removeChild(dummyElement);

  const colors = rgb.match(/\d+/g).map((num) => parseInt(num));
  const valueToHash = (colors[0] << 16) + (colors[1] << 8) + colors[2];

  return valueToHash;
};

// Events
const calcData = (ev) => {
  const result = validateInput();

  if (result.valid) {
    const amount = inputAmount.value;
    const color = inputColor.value.toLowerCase();
    const pricePerUnit = parseInt(prodPrice.textContent.replace(".", ""));

    prodTotalPrice.textContent = numberFormat.format(amount * pricePerUnit);
    prodAmount.textContent = amount;
    prodColor.style.backgroundColor = color;
  } else {
    alert(`Error: ${result.errorReason}`);
  }
};

const calcPrice = (ev) => {
  let value = ev.target.value;

  if (isValidColor(value)) {
    value = colorToInt(value);
  } else {
    prodPrice.textContent = "Color no válido";
    return;
  }

  prodPrice.textContent = numberFormat.format(PROD_PRICES[hashColor(value)]);
};

// Bindings
calcButton.addEventListener("click", calcData);
inputColor.addEventListener("change", calcPrice);
