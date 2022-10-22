// DOM Nodes to read from
const inputAmount = document.querySelector("#input-amount");
const inputColor = document.querySelector("#input-color");

// DOM Nodes to modify
const prodTotalPrice = document.querySelector("#prod-total-price");
const prodAmount = document.querySelector("#prod-amount");
const prodColor = document.querySelector("#prod-color");

// DOM Nodes in which we'll check for events
const calcButton = document.querySelector("#calc-button");

// Product Price
const PROD_PRICE = 650000;

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
  const dummyStyle = document.createElement("div").style;
  dummyStyle.color = colorStr;

  console.log(dummyStyle.color === colorStr);

  return dummyStyle.color === colorStr;
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

// Events
const calcData = (ev) => {
  const result = validateInput();

  if (result.valid) {
    const amount = inputAmount.value;
    const color = inputColor.value.toLowerCase();

    prodTotalPrice.textContent = numberFormat.format(amount * PROD_PRICE);
    prodAmount.textContent = amount;
    prodColor.style.backgroundColor = color;
  } else {
    alert(`Error: ${result.errorReason}`);
  }
};

// Bindings
calcButton.addEventListener("click", calcData);
