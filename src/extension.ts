// ============================================================
// Copyright (c) 2021 Tatsuya Nakamori. All rights reserved.
// See LICENSE in the project root for license information.
// ============================================================
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "insertrelpath" is now active!');

    setContext();
    vscode.workspace.onDidCloseTextDocument((event) => {setContext()})
    vscode.window.onDidChangeActiveTextEditor((event) => {setContext()})
    vscode.window.onDidChangeTextEditorSelection((event) => {setContext()})

    context.subscriptions.push(
        vscode.commands.registerCommand('insertrelpath.insertRelPath', (pathInfo) => {
            insertRelPath(pathInfo.fsPath);
    }));
}

export function deactivate() {}


async function setContext() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        vscode.commands.executeCommand('setContext', 'insertrelpath.editor.opening', true);
    } else {
        vscode.commands.executeCommand('setContext', 'insertrelpath.editor.opening', false);
    }
}

interface RelPathOptions {
    "format"?: string,
    "separator"?: ("/"|"\\"|"Adapt to OS"),
    "withExtension"?: boolean,
}

function getParsedConfig(): RelPathOptions {
    const config = vscode.workspace.getConfiguration("InsertRelPath");

    const relPathOptions:RelPathOptions = {
        "format": config.get("format"),
        "separator": config.get("separator"),
        "withExtension": config.get("withExtension")
    }
    return relPathOptions
}

async function insertRelPath(pathTo:string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return }

    const relPathOptions: RelPathOptions = getParsedConfig();
    console.log(relPathOptions);

    // Path From
    let pathFrom = editor.document.uri.fsPath;
    pathFrom = path.dirname(pathFrom);

    // Generate and format relative paths
    let relPath = path.relative(pathFrom, pathTo);

    const osSeparator = path.sep;
    const separator = relPathOptions["separator"];
    relPath = relPath.replace(/\\/g, '/');

    if (!relPathOptions["withExtension"]) {
        const parse = path.parse(relPath);
        if (parse.dir) {
            relPath = `${parse.dir}/${parse.name}`;
        } else {
            relPath = parse.name;
        }
    }

    // Insert text and adjust the selection.
    await editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, relPath);
    });
    const selectionEnd = editor.selection.end;
    editor.selection = new vscode.Selection(selectionEnd, selectionEnd);

    // Focus on the editor.
    vscode.window.showTextDocument(editor.document);
}

