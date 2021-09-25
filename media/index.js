// @ts-nocheck
(function () {
  // const vscode = acquireVsCodeApi();

  const output = document.getElementById("output");
  let counter = 0;
  output.textContent = "1";
  setInterval(() => {
    output.textContent = String(counter++);
  }, 500);
})();
