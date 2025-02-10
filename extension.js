const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');

function activate(context) {
    let switchToCursor = vscode.commands.registerCommand('vscode-cursor-switcher.switchToCursor', async () => {
        // Get workspace folder path
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        
        // Get current file and line position
        const activeEditor = vscode.window.activeTextEditor;
        const filePath = activeEditor ? activeEditor.document.uri.fsPath : '';
        const lineNumber = activeEditor ? activeEditor.selection.active.line + 1 : 1;

        try {
            // For macOS
            if (process.platform === 'darwin') {
                // First open the folder in Cursor
                exec(`open -a Cursor "${workspacePath}"`);
                
                // If there's an active file, open it after a short delay
                if (activeEditor) {
                    setTimeout(() => {
                        exec(`open -a Cursor "${filePath}:${lineNumber}"`);
                    }, 1000);
                }
            }
            // For Windows
            else if (process.platform === 'win32') {
                exec(`cursor "${workspacePath}"`);
                if (activeEditor) {
                    setTimeout(() => {
                        exec(`cursor "${filePath}:${lineNumber}"`);
                    }, 1000);
                }
            }
            // For Linux
            else if (process.platform === 'linux') {
                exec(`cursor "${workspacePath}"`);
                if (activeEditor) {
                    setTimeout(() => {
                        exec(`cursor "${filePath}:${lineNumber}"`);
                    }, 1000);
                }
            }

            // Close VS Code window
            vscode.commands.executeCommand('workbench.action.closeWindow');
        } catch (error) {
            vscode.window.showErrorMessage('Failed to open Cursor: ' + error.message);
        }
    });

    let switchToVSCode = vscode.commands.registerCommand('vscode-cursor-switcher.switchToVSCode', async () => {
        // Get workspace folder path
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        
        // Get current file and line position
        const activeEditor = vscode.window.activeTextEditor;
        const filePath = activeEditor ? activeEditor.document.uri.fsPath : '';
        const lineNumber = activeEditor ? activeEditor.selection.active.line + 1 : 1;

        try {
            // Open folder in VS Code
            exec(`code "${workspacePath}"`);
            
            // If there's an active file, open it after a short delay
            if (activeEditor) {
                setTimeout(() => {
                    exec(`code -g "${filePath}:${lineNumber}"`);
                }, 1000);
            }

            // Close VS Code window (this will close Cursor if we're in Cursor)
            vscode.commands.executeCommand('workbench.action.closeWindow');
        } catch (error) {
            vscode.window.showErrorMessage('Failed to switch to VS Code: ' + error.message);
        }
    });

    context.subscriptions.push(switchToCursor, switchToVSCode);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
} 