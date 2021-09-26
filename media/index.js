// @ts-nocheck
(function () {
  const status = document.getElementById("status");
  const data = document.getElementById("data");
  const header = document.getElementById("header");

  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    const message = event.data; // The json data that the extension sent
    data.textContent = JSON.stringify(message.res.data);
    status.textContent = JSON.stringify(message.res.status);
    header.textContent = JSON.stringify(message.res.header);
  });
})();
