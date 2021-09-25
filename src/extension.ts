// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
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

  context.subscriptions.push(disposable, showWindow);
}

class MainPanel {
  public static readonly viewType = "mainPanel";
  public static currentPanel: MainPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;

  constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._panel.webview.html = this.getHtmlForWebView(this._panel.webview);
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
        <h1>hello world</h1>
        <div>
          <p id="output"></p>
        </div>
      </body>
      <script src="${scriptUri}"></script>
      </html>
   `;
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
