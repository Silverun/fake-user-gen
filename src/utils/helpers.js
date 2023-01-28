const gerLetters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜẞabcdefghijklmnopqrstuvwxyzäöüß0123456789";
const engLetters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const frLetters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÆÇÈÉÊËÎÏÔŒÙÜabcdefghijklmnopqrstuvwxyzàâæçèéêëîïôœûü0123456789";
// const numbers = "0123456789";

// 2nd version
export function removeRandomAmount(str, amount) {
  let amountChanced = amount;

  if (!Number.isInteger(amount)) {
    const chance = amount - Math.floor(amount);
    if (chance >= Math.random()) {
      // console.log(`${chance} is success!`);
      amountChanced = Math.ceil(amount);
      // console.log(`upgraded to ${amountChanced}`);
    }
    // 1.25 1.5 1.75
  }
  for (let i = 0; i < amountChanced; i++) {
    const max = str.length - 1;
    const pos = Math.round(Math.random() * max);
    str = str.slice(0, pos) + str.slice(pos + 1);
  }
  return str;
}

export function replaceRandomAmount(str, amount, locale) {
  let amountChanced = amount;

  if (!Number.isInteger(amount)) {
    const chance = amount - Math.floor(amount);
    if (chance >= Math.random()) {
      // console.log(`${chance} is success!`);
      amountChanced = Math.ceil(amount);
      // console.log(`upgraded to ${amountChanced}`);
    }
  }
  for (let i = 0; i < amountChanced; i++) {
    const pos = Math.floor(Math.random() * str.length);
    str =
      str.substring(0, pos) + getRandomSymbol(locale) + str.substring(pos + 1);
  }
  return str;
}

export function getRandomSymbol(locale) {
  let letters;
  if (locale === "de") {
    letters = gerLetters;
  }
  if (locale === "fr") {
    letters = frLetters;
  }
  if (locale === "en") {
    letters = engLetters;
  }
  const pos = Math.floor(Math.random() * letters.length);
  return letters.charAt(pos);
}

// WORKING
export function shuffleNearest(str, amount) {
  let arr = str.split("");
  for (let i = 0; i < amount; i++) {
    const randPos = Math.floor(Math.random() * arr.length);
    //   ["i","t","e","m","s"]
    let hold;
    hold = arr[randPos];
    arr[randPos] = arr[randPos + 1];
    arr[randPos + 1] = hold;
  }
  const newStr = arr.join("");
  return newStr;
}

// Arrays

// arr[Math.floor(Math.random() * arr.length)] = randomLetter();
