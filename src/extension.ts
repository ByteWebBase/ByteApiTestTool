// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { spawn } from "child_process";

let uri: vscode.Uri;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  uri = context.extensionUri;
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "byteapitesttool" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "byteapitesttool.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from ByteApiTestTool!");
    }
  );

  let showWindow = vscode.commands.registerCommand(
    "byteapitesttool.showWindow",
    () => {
      MainPanel.createOrShow(context.extensionUri);
    }
  );

  let performApiTest = vscode.commands.registerCommand(
    "byteapitesttool.TestApi",
    readCode
  );

  context.subscriptions.push(disposable, showWindow, performApiTest);

  async function readCode() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    let doc = editor.document;
    let start: vscode.Position = new vscode.Position(0, 0);
    let end: vscode.Position = new vscode.Position(0, 0);

    for (let i = 0; i < doc.lineCount; i++) {
      if (
        doc.lineAt(i).text.includes("//") &&
        doc.lineAt(i).text.toUpperCase().includes("API START")
      ) {
        start = new vscode.Position(i, 0);
      }
      if (
        doc.lineAt(i).text.includes("//") &&
        doc.lineAt(i).text.toUpperCase().includes("API END")
      ) {
        end = new vscode.Position(i, 0);
      }
    }

    const range = new vscode.Range(start, end);
    const code = doc.getText(range);

    const pathTarget = vscode.Uri.joinPath(
      context.extensionUri,
      "src",
      "temp.js"
    ).path;

    const pathTemplate = vscode.Uri.joinPath(
      context.extensionUri,
      "src",
      "fetcher.js"
    ).path;

    // first copy fetcher.ts => temp.ts
    const template = fs.readFileSync(pathTemplate.slice(1), {
      encoding: "utf-8",
    });
    // then append code to temp.ts
    const path = context.extensionUri.path.slice(1);
    const pathCode = `const path = \`${path}\`;\n`;
    fs.writeFileSync(pathTarget.slice(1), pathCode + template + code);

    console.log();
    await new Promise((resolve) => {
      spawn("node", ["temp.js"], {
        cwd: `${context.extensionUri.path.slice(1)}/src`,
      }).on("close", () => resolve(1));
    });
    MainPanel.update();
    return;
  }
}

export class MainPanel {
  public static readonly viewType = "mainPanel";
  public static currentPanel: MainPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  public static dataConfig: AxiosRequestConfig | undefined;
  public static response: AxiosResponse | undefined;

  constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._panel.webview.html = this.getHtmlForWebView(this._panel.webview);
  }

  public static update() {
    const req = JSON.parse(
      fs.readFileSync(`${uri.path.slice(1)}/req.txt`).toString()
    );
    const res = JSON.parse(
      fs.readFileSync(`${uri.path.slice(1)}/res.txt`).toString()
    );
    if (MainPanel.currentPanel) {
      MainPanel.currentPanel._panel.webview.postMessage({ req, res });
    }
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const col = vscode.window.activeTextEditor?.viewColumn;
    if (MainPanel.currentPanel) {
      MainPanel.currentPanel._panel.reveal(col);
      return;
    }

    // Otherwise, a new panel will be created
    const panel = vscode.window.createWebviewPanel(
      MainPanel.viewType,
      "Main",
      col || vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    MainPanel.currentPanel = new MainPanel(panel, extensionUri);
  }

  private getHtmlForWebView(webview: vscode.Webview) {
    const script = vscode.Uri.joinPath(this._extensionUri, "media", "index.js");
    const scriptUri = script.with({ scheme: "vscode-resource" });
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <h1>Result</h1>
        <div>
          <h2>Status</h2>
          <p id="status"></p>
          <h2>Data</h2>
          <p id="data"></p>
          <h2>Header</h2>
          <p id="header"></p>
        </div>
      </body>
      <script src="${scriptUri}"></script>
      </html>
   `;
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
