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

interface StringKeyObject {
    [key: string]: string;
}

function getParsedConfig(): string[]|undefined {
    let formatList:string[] = [];

    const config:StringKeyObject|undefined = vscode.workspace.getConfiguration("InsertRelPath").get("format");
    if (!config) { return }

    for (const key in config) {
        if (Object.prototype.hasOwnProperty.call(config, key)) {
            const format = config[key];
            if (format) {
                formatList.push(format)
            }
        }
    }

    console.log(formatList);
    if (!formatList.length) {
        return
    }
    return formatList
}

function generateStringTtoInsert(editor:vscode.TextEditor, pathTo:string, format:string): string|undefined {
    console.log(format);


    return format

    // // Path From
    // let pathFrom = editor.document.uri.fsPath;
    // pathFrom = path.dirname(pathFrom);

    // // Generate and format relative paths
    // let relPath = path.relative(pathFrom, pathTo);
    // console.log(relPath);

    // // Perform the process of removing file extensions.
    // if (formatList["withoutExtension"]) {
    //     const parse = path.parse(relPath);
    //     if (parse.dir) {
    //         relPath = `${parse.dir}${path.sep}${parse.name}`;
    //     } else {
    //         relPath = parse.name;
    //     }
    // }

    // // Convert separator
    // const separatorToUse = formatList["separator"];
    // if (separatorToUse == "Adapt to OS") {
    //     // Since relPath is already the os separator, there is no need to replace it.
    // } else if (path.sep == "\\" && separatorToUse == "/") {
    //     relPath = relPath.replace(/\\/g, "/");
    // } else if (path.sep == "/" && separatorToUse == "\\") {
    //     relPath = relPath.replace(/\//g, "\\");
    // }

    // // Incorporate relative paths into the format string.
    // let format = formatList["format"];
    // format = format.replace(/\\n/g, "\n");
    // format = format.replace(/\\r/g, "\r");
    // format = format.replace(/\\b/g, "\b");
    // format = format.replace(/\\f/g, "\f");
    // format = format.replace(/\\t/g, "\t");
    // format = format.replace(/\\v/g, "\v");
    // const replaceStr = format.replace(/\${RELPATH}/g, relPath);

    // return
}

async function editBuilderReplace(editor:vscode.TextEditor, replaceStr:string) {
    // Insert text and adjust the selection.
    await editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, replaceStr);
    });

    const selectionEnd = editor.selection.end;
    editor.selection = new vscode.Selection(selectionEnd, selectionEnd);
}

async function insertRelPath(pathTo:string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return }

    const formatList: string[]|undefined = getParsedConfig();
    if (!formatList) { return }

    let replaceStrList:string[] = [];
    for (let i = 0; i < formatList.length; i++) {
        const insertStr = generateStringTtoInsert(editor, pathTo, formatList[i]);
        if (insertStr) {
            replaceStrList.push(insertStr);
        }
    }

    if (replaceStrList.length == 1) {
        editBuilderReplace(editor, replaceStrList[0]);

    } else if (replaceStrList.length > 1) {
        const selectedItem:string|undefined = await vscode.window.showQuickPick(replaceStrList);

        if (selectedItem) {
            editBuilderReplace(editor, selectedItem);
        }
    }

    // Focus on the editor.
    vscode.window.showTextDocument(editor.document);
}

