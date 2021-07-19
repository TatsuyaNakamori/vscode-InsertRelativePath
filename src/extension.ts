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

interface RelPathTable {
    [key: string]: string|undefined;
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

    if (!formatList.length) {
        return
    }
    return formatList
}

function removeExtension(relPath:string|undefined):string|undefined {
    if (!relPath) { return }

    const parse = path.parse(relPath);
    if (parse.dir.endsWith("/") || parse.dir.endsWith("\\")) {
        relPath = `${parse.dir}${parse.name}`;
    } else if (parse.dir) {
        relPath = `${parse.dir}${path.sep}${parse.name}`;
    } else {
        relPath = parse.name;
    }
    return relPath
}

function convertSeparator(relPath:string|undefined, sep:string|undefined):string|undefined {
    if (!relPath) { return }
    if (sep === undefined) {
        sep = "/";
    }

    if (sep == "OS") {
        // Since relPath is already the os separator, there is no need to replace it.
    } else if (path.sep == "\\" && sep == "/") {
        relPath = relPath.replace(/\\/g, "/");
    } else if (path.sep == "/" && sep == "\\") {
        relPath = relPath.replace(/\//g, "\\");
    }

    return relPath
}

function generateStringToInsert(editor:vscode.TextEditor, pathTo:string, format:string): string|undefined {
    const regFormat = /^(\[(?<separator>\/|\\|OS)\])?(?<format>.*)/

    const match = regFormat.exec(format);
    if (!match?.groups) { return }

    const sepText = match.groups["separator"]
    let formatText = match.groups["format"]
    if (!formatText) { return }

    // Write the relative path information into the table.
    const docFsPath = editor.document.uri.fsPath;
    const curFolder = path.dirname(docFsPath);
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspaceFolder = workspaceFolders? workspaceFolders[0]: undefined;

    let relPathTable:RelPathTable = {};
    // Generating relative paths
    // ==================================================
    // "{RELPATH}":                // img/pic.png
    // "{RELPATH_ROOT}":           // /img/pic.png
    // "{RELPATH_CURDIR}":         // ./img/pic.png
    // "{RELPATH_FROMFILE}":       // ../img/pic.png
    // "{RELPATH_NOEXT}":          // img/pic
    // "{RELPATH_ROOT_NOEXT}":     // /img/pic
    // "{RELPATH_CURDIR_NOEXT}":   // ./img/pic
    // "{RELPATH_FROMFILE_NOEXT}": // ../img/pic
    // "{FILENAME}":               // pic.png
    // "{FILENAME_SEP}":           // /pic.png
    // "{FILENAME_NOEXT}":         // pic
    // "{FILENAME_SEP_NOEXT}":     // /pic
    // ==================================================
    relPathTable["{RELPATH}"] = path.relative(curFolder, pathTo);
    if (workspaceFolder) {
        const rootFolder = workspaceFolder.uri.fsPath;
        const relpath = path.relative(rootFolder, pathTo);
        relPathTable["{RELPATH_ROOT}"] = `${path.sep}${relpath}`;
    }
    relPathTable["{RELPATH_CURDIR}"] = `.${path.sep}${relPathTable["{RELPATH}"]}`;
    relPathTable["{RELPATH_FROMFILE}"] = path.relative(docFsPath, pathTo);
    // File name only and file name without extension
    relPathTable["{FILENAME}"] = path.basename(pathTo);
    relPathTable["{FILENAME_SEP}"] = `${path.sep}${path.basename(pathTo)}`;
    // Versions that exclude the extension
    relPathTable["{RELPATH_NOEXT}"]          = removeExtension(relPathTable["{RELPATH}"]);
    relPathTable["{RELPATH_ROOT_NOEXT}"]     = removeExtension(relPathTable["{RELPATH_ROOT}"]);
    relPathTable["{RELPATH_CURDIR_NOEXT}"]   = removeExtension(relPathTable["{RELPATH_CURDIR}"]);
    relPathTable["{RELPATH_FROMFILE_NOEXT}"] = removeExtension(relPathTable["{RELPATH_FROMFILE}"]);
    relPathTable["{FILENAME_NOEXT}"]         = removeExtension(relPathTable["{FILENAME}"]);
    relPathTable["{FILENAME_SEP_NOEXT}"]     = removeExtension(relPathTable["{FILENAME_SEP}"]);

    // Convert Separator
    for (const key in relPathTable) {
        if (Object.prototype.hasOwnProperty.call(relPathTable, key)) {
            relPathTable[key] = convertSeparator(relPathTable[key], sepText);
        }
    }

    // Incorporate relative paths into the format string.
    formatText = formatText.replace(/\\n/g, "\n");
    formatText = formatText.replace(/\\r/g, "\r");
    formatText = formatText.replace(/\\b/g, "\b");
    formatText = formatText.replace(/\\f/g, "\f");
    formatText = formatText.replace(/\\t/g, "\t");
    formatText = formatText.replace(/\\v/g, "\v");

    for (const key in relPathTable) {
        if (Object.prototype.hasOwnProperty.call(relPathTable, key)) {

            const relpath = relPathTable[key];
            if (relpath) {
                const regPlaceholder = new RegExp(key, "g");
                formatText = formatText.replace(regPlaceholder, relpath);
            }
        }
    }

    return formatText
}

async function insertRelPath(pathTo:string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return }

    // Get Config
    const formatList: string[]|undefined = getParsedConfig();
    if (!formatList) { return }

    // Generate String To Insert
    let replaceStrList:string[] = [];
    for (let i = 0; i < formatList.length; i++) {
        const insertStr = generateStringToInsert(editor, pathTo, formatList[i]);
        if (insertStr) {
            replaceStrList.push(insertStr);
        }
    }

    if (replaceStrList.length == 1) {
        const snippet = new vscode.SnippetString(replaceStrList[0]);
        editor.insertSnippet(snippet);

    } else if (replaceStrList.length > 1) {
        const selectedItem:string|undefined = await vscode.window.showQuickPick(replaceStrList);

        if (selectedItem) {
            const snippet = new vscode.SnippetString(selectedItem);
            editor.insertSnippet(snippet);
        }
    }

    // Focus on the editor.
    vscode.window.showTextDocument(editor.document);
}

