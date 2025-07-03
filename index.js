import 'dotenv/config';
import figlet from 'figlet';
import chalk from 'chalk';
import { groqReturn } from './model.js';
import { input } from '@inquirer/prompts';
import { exec } from 'child_process';
import { userInfo } from 'os';

function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, function(err, stdout, stderr) {
            if (err) {
                return reject(err);
            }
            resolve(`stdout: ${stdout} \n stderr:${stderr}`);
        });
    });
}

let appName = '';
let UserFunc = '';

figlet.text('Vibe Studio', {
  font: 'Standard',
  horizontalLayout: 'center',
  verticalLayout: 'default',
}, async (err, data) => {
  if (err) {
    console.dir(err);
    return;
  }

  // Center the figlet banner and all output
  const terminalWidth = process.stdout.columns || 80;
  function centerText(text) {
    return text
      .split('\n')
      .map(line => {
        const pad = Math.max(0, Math.floor((terminalWidth - line.length) / 2));
        return ' '.repeat(pad) + line;
      })
      .join('\n');
  }

  console.log(chalk.magentaBright(centerText(data)));
  console.log(chalk.cyan(centerText('\n🎧  Welcome to VibeStudio CLI — where ideas drop into code')));
  console.log(chalk.gray(centerText('─────────────────────────────────────────────────────────────')));
  console.log(chalk.white(centerText('💡 Tell me what you want to build, and I’ll scaffold it — instantly.')));
  console.log(chalk.bold(centerText('\n🚀 Let’s build something epic. Just type your idea to get started...\n')));
  console.log('\n');
  console.log('\n');
  

  // Prompt immediately after banner
  while (!appName) {
    appName = await input({ message: "What do you want me to make :" });
    if (!appName) console.log(chalk.red(centerText("Please provide a tech stack or app idea.")));
  }
  while (!UserFunc) {
    UserFunc = await input({ message: "Customize features or UI?" });
  }

  let techStack = "html css js";
  const fullPrompt = `Build a fully functional and modern-looking ${appName} application using HTML, CSS, and JavaScript only.

Requirements:
- Provide only terminal commands.
- Every file must be created under the ${appName} folder.
- Start with: mkdir ${appName} && cd ${appName}
- All echo commands must follow this format: echo "content" > ${appName}/filename
- Each command should be printed one by one, line by line (no comments or explanations).
- Use touch to create files before echo.
- use the same ${appName} 
-make sure app code is correct and 100% working check it multiple times and then give the final one (make sure to check 3 /4 times)
-Include a good modern UI (not basic).
- Application must be 100% working when opened in the browser.
-add user Functionality additionaly using ${userInfo}.
only commands no bash keyword`;

  const commands = await groqReturn(fullPrompt);

  function splitCommandsByCaret(commands) {
    return commands
      .split('\n')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd);
  }
  function replaceFilePaths(cmd, appName) {
    const cleanAppName = appName.replace(/\s+/g, '');
    let newCmd = cmd.replace(/> ?(script\.js|index\.html|style\.css)/g, (match, p1) => {
      return `> ${cleanAppName}/${p1}`;
    });
    newCmd = newCmd.replace(/touch +(script\.js|index\.html|style\.css)/g, (match, p1) => {
      return `touch ${cleanAppName}/${p1}`;
    });
    return newCmd;
  }

  for (const cmd of splitCommandsByCaret(commands)) {
    const fixedCmd = replaceFilePaths(cmd, appName);
    try {
      const output = await executeCommand(fixedCmd.replace(/^"|"$/g, ''));
    } catch (err) {
      console.log(chalk.red(centerText(`\nError executing: ${fixedCmd}\n${err}`)));
      break;
    }
  }
});

