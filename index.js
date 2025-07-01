import 'dotenv/config';

import figlet from 'figlet';
import chalk from 'chalk';
import { groqReturn} from './model.js';
import { input } from '@inquirer/prompts';
import { exec } from 'child_process';
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
figlet.text('VibeStudio', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
}, async (err, data) => {
    if (err) {
        console.dir(err);
        return;
    }

    console.log(chalk.magentaBright(data));
    console.log(chalk.cyan('\n🎧  Welcome to VibeStudio CLI — where ideas drop into code'));
    console.log(chalk.gray('─────────────────────────────────────────────────────────────'));
    console.log(chalk.white('💡 Tell me what you want to build, and I’ll scaffold it — instantly.'));
    console.log(chalk.bold('\n🚀 Let’s build something epic. Just type your idea to get started...\n'));
  });
  
(async () => {
  while (!appName) {
      appName = await input({ message: "What do you want me to make :" });
      if (!appName) console.log(chalk.red("Please provide a tech stack or app idea."));
  }
  let techStack="html css js"
  let command='echo hi'
  const fullPrompt=`Build a fully functional and modern-looking ${appName} application using HTML, CSS, and JavaScript only.

Requirements:
- Provide only terminal commands.
- Every file must be created under the ${appName} folder.
- Start with: mkdir ${appName} && cd ${appName}
- All echo commands must follow this format: echo "content" > ${appName}/filename
- Each command should be printed one by one, line by line (no comments or explanations).
- Use touch to create files before echo.
- use the same ${appName} user provide removing space.
  }Include a good modern UI (not basic).
- Application must be 100% working when opened in the browser.

only commands no bash keyword`
  
const commands = await groqReturn(fullPrompt);
function splitCommandsByCaret(commands) {
    return commands
    .split('\n')               // Split by caret symbol
    .map(cmd => cmd.trim())   // Trim whitespace from each command
    .filter(cmd => cmd);      // Remove empty strings
  }
  function replaceFilePaths(cmd, appName) {
    // Replace > script.js, > index.html, > style.css with > ${appName}/script.js etc.
    const cleanAppName = appName.replace(/\s+/g, '');

    // Replace > script.js, > index.html, > style.css with > ${appName}/filename
    let newCmd = cmd.replace(/> ?(script\.js|index\.html|style\.css)/g, (match, p1) => {
      return `> ${cleanAppName}/${p1}`;
    });

    // Replace touch script.js, touch index.html, touch style.css with touch ${appName}/filename
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
      console.log(chalk.red(`\nError executing: ${fixedCmd}\n${err}`));
      break;
    }
  }
})();

