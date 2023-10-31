document.addEventListener("DOMContentLoaded", function () {
  const footer = document.querySelector("footer");

  const dynamicContent =
    "Copyright © 2022-" +
    new Date().getFullYear() +
    " - <strong>Money Goals SRL sole proprietorship</strong> - VAT Number: IT04001560368 - Sh. Capital: 10.000€ - All Rights Reserved";

  footer.innerHTML = dynamicContent;
});
