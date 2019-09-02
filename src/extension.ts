// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';

const LOCAL_COUNTER_INCREMENT = 10;

interface CounterDescription {
  counter: number;
  maxCounter: number;
}

interface ExtensionConfig {
  serviceURL: string | undefined;
  projectName: string;
  counterIncrementValue: number;
  functionKey: string;
  logStatementToInsert: string;
  debug: boolean;
}

const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?$/i;
function isValidUrl(url: string): boolean {
  return url.match(urlRegex) !== null;
}

function isValidProjectName(projectName: string): boolean {
  if (!projectName) {
    return false;
  }
  if (projectName.length === 0) {
    return false;
  }
  return projectName.match(/^\w*$/) !== null;
}

async function getCounterFromHttpService(
  serviceURL: string,
  functionKey: string,
  projectName: string,
  counterIncrementValue: number,
  outputChannel: vscode.OutputChannel,
  debug:boolean
): Promise<CounterDescription> {
  if (debug) {
    outputChannel.appendLine(
      'calling service URL to get new counters:' + serviceURL
    );
  }

  const serviceCallpromise = new Promise<CounterDescription>(
    (resolve, reject) => {
      try {
        axios
          .post(`${serviceURL}?code=${functionKey}`, {
            action: 'get',
            increment: counterIncrementValue,
            projectName,
          })
          .then(response => {
            if (debug) {
              outputChannel.appendLine(
                `service call result: ${JSON.stringify(response.data)}`
              );
            }
            return response.data;
          })
          .then(data => {
            if (data.action !== 'get') {
              throw new Error(
                'invalid service response' + JSON.stringify(data)
              );
            }
            return resolve({
              counter: data.response.counter,
              maxCounter: data.response.maxCounter,
            });
          })
          .catch(error => {
            if (error.response) {
              outputChannel.appendLine('service call error:');
              outputChannel.appendLine(`- status: ${error.response.status}`);
              outputChannel.appendLine(
                `- statusTest: ${error.response.statusText}`
              );
              outputChannel.appendLine(`- message: ${error.response.data}`);
            } else {
              outputChannel.appendLine('internal error:' + error);
            }
            return reject(error);
          });
      } catch (err) {
        outputChannel.appendLine('internal error:' + err);
        return reject(err);
      }
    }
  );

  return vscode.window.withProgress<CounterDescription>(
    {
      location: vscode.ProgressLocation.Notification,
      title: `calling service URL for new counters`,
      cancellable: true,
    },
    (progress, token) => {
      token.onCancellationRequested(() => {
        outputChannel.appendLine('User canceled the long running operation');
      });

      progress.report({ increment: 0 });

      return serviceCallpromise;
    }
  );
}

// Read the value of the counter from a file, increment it and store it back in the file
async function getAndIncrementCounter(
  storage: vscode.Memento,
  config: ExtensionConfig,
  outputChannel: vscode.OutputChannel
): Promise<number> {
  const {
    serviceURL,
    functionKey,
    projectName,
    counterIncrementValue,
    debug,
  } = config;
  let counterData: CounterDescription | undefined = storage.get('counter');
  if (debug) {
    outputChannel.appendLine(`counterData: ${JSON.stringify(counterData)}`);
  }

  if (!counterData) {
    // first time we invoke the extension
    if (serviceURL) {
      counterData = await getCounterFromHttpService(
        serviceURL,
        functionKey,
        projectName,
        counterIncrementValue,
        outputChannel,
        debug
      );
    } else {
      counterData = {
        counter: 1,
        maxCounter: LOCAL_COUNTER_INCREMENT,
      };
    }
  }

  // check if we are overflowing the current counter slot
  if (counterData.counter > counterData.maxCounter) {
    if (serviceURL) {
      counterData = await getCounterFromHttpService(
        serviceURL,
        functionKey,
        projectName,
        counterIncrementValue,
        outputChannel,
        debug
      );
    } else {
      counterData = {
        counter: counterData.counter,
        maxCounter: counterData.counter + LOCAL_COUNTER_INCREMENT - 1,
      };
    }
  }
  const counter = counterData.counter;
  const newCounter = counter + 1;
  counterData.counter = newCounter;
  if (debug) {
    outputChannel.appendLine(
      `update storage with counterData: ${JSON.stringify(counterData)}`
    );
  }
  await storage.update('counter', counterData);

  return counter;
}

function replaceEditorSelection(text: string) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selections = editor.selections;

    editor.edit(editBuilder => {
      selections.forEach(selection => {
        editBuilder.replace(selection, '');
        editBuilder.insert(selection.active, text);
      });
    });
  }
}

async function insertLogErrorCode(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  configuration: vscode.WorkspaceConfiguration
) {
  // The code you place here will be executed every time your command is executed
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No open text editor');
    return;
  }

  const config = readConfiguration(configuration, outputChannel);
  if (!config) {
    vscode.window.showErrorMessage('Invalid configuration. Abort.');
    return;
  }

  const counter = await getAndIncrementCounter(
    context.globalState,
    config,
    outputChannel
  );
  if (counter < 0) {
    vscode.window.showErrorMessage("Can't get log error counter");
    return;
  }

  const logStatement = config.logStatementToInsert.replace(
    /%%counter%%/g,
    `${counter}`
  );
  replaceEditorSelection(logStatement);
}

function readConfiguration(
  configuration: vscode.WorkspaceConfiguration,
  outputChannel: vscode.OutputChannel
): ExtensionConfig | undefined {
  const serviceURL: string | undefined =
    configuration.get('serviceURL') || undefined;
  const projectName: string = configuration.get('projectName') || '';
  const counterIncrementValue: number =
    configuration.get('counterIncrementValue') || 10;
  const functionKey: string = configuration.get('serviceFunctionKey') || '';
  const debug: boolean = configuration.get('showDebugInformation') || false;

  if (debug) {
    outputChannel.appendLine(`- serviceURL: ${serviceURL}`);
    outputChannel.appendLine(`- projectName: ${projectName}`);
    outputChannel.appendLine(
      `- counterIncrementValue: ${counterIncrementValue}`
    );
    outputChannel.appendLine(`- functionKey: ${functionKey}`);
  }

  // check value of configuration parameters
  if (counterIncrementValue <= 0) {
    vscode.window.showErrorMessage(
      `invalid counterIncrementValue: ${counterIncrementValue}`
    );
    return undefined;
  }

  if (serviceURL && !isValidUrl(serviceURL)) {
    vscode.window.showErrorMessage(`invalid serviceURL: ${serviceURL}`);
    return undefined;
  }

  if (!isValidProjectName(projectName)) {
    vscode.window.showErrorMessage(`invalid projectName: ${projectName}`);
    return undefined;
  }

  const logStatementToInsert: string =
    configuration.get('logStatementToInsert') || '%%COUNTER%%';

  const config: ExtensionConfig = {
    serviceURL,
    projectName,
    counterIncrementValue,
    functionKey,
    logStatementToInsert,
    debug
  };

  return config;
}

async function resetLogErrorCode(context: vscode.ExtensionContext) {
  const storage: vscode.Memento = context.globalState;
  await storage.update('counter', null);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel(
    'LogErrorCode'
  );

  const configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(
    'insertlogerrorcode'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'extension.insertLogErrorCode',
      async () => {
        try {
          await insertLogErrorCode(context, outputChannel, configuration);
        } catch (err) {
          // the error should have been displayed before
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.resetLogErrorCode', async () => {
      resetLogErrorCode(context);
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
