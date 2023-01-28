const gerLetters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜẞabcdefghijklmnopqrstuvwxyzäöüß0123456789";
const engLetters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const frLetters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÆÇÈÉÊËÎÏÔŒÙÜabcdefghijklmnopqrstuvwxyzàâæçèéêëîïôœûü0123456789";

export function removeRandom(str) {
  const max = str.length - 1;
  const pos = Math.round(Math.random() * max);
  str = str.slice(0, pos) + str.slice(pos + 1);
  return str;
}

export function addRandom(str, locale) {
  const pos = Math.floor(Math.random() * str.length);
  str =
    str.substring(0, pos) +
    getRandomSymbol(locale) +
    str.substring(pos, str.length);

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

export function shuffleNearest(str) {
  let arr = str.split("");
  const randPos = Math.floor(Math.random() * arr.length);
  let hold;
  hold = arr[randPos];
  arr[randPos] = arr[randPos + 1];
  arr[randPos + 1] = hold;
  const newStr = arr.join("");
  return newStr;
}
