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
  let techStack = '';
  let folderName=''
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
  while (!techStack) {
      techStack = await input({ message: "tech Stack? :" });
      if (!techStack) console.log(chalk.red("Please provide a location."));
  }
      while (!folderName) {
      folderName = await input({ message: "Path  :" });
      if (!folderName) console.log(chalk.red("Please provide a location."));
  }
  let commands='echo hi'
  const fullPrompt =`You are a senior software engineer with expertise in the ${techStack} and use only required folder or stack. Please provide a concise, step-by-step list of terminal commands to set up and run the ${appName} application, including any necessary file content modifications. Keep it strictly technical and executable
  provide me only terminal commands in right order to be performed one by one making the app fully functional and also providing basic good appealing ui not basic but properly working application.
  Make sure you give scripts and commands that are perfectly working!
  dont include bash keyword at top or provide me each command.Give commands such that make sure everyfile is under the folder ${folderName}/${appName} example- 'mkdir ${folderName}/${appName}' then cd ${appName} then makes files.
  you need to always first give commands- 'mkdir ${folderName}/${appName}' then cd ${folderName}/${appName}. then all the files will ne inside the app folder and echo the files in ${appName} example- touch ${folderName}/${appName}/requiredFieName(Stack Files)
  just excute commands under ${executeCommand(commands)} where "commands" represents terminal commands one by one as string sepratedby \n `
commands=await groqReturn(fullPrompt);
  function splitCommandsByCaret(commands) {
    return commands
    .split('\n')               // Split by caret symbol
    .map(cmd => cmd.trim())   // Trim whitespace from each command
    .filter(cmd => cmd);      // Remove empty strings
  }
  for (const cmd of splitCommandsByCaret(commands)) {
    try {
      const output = await executeCommand(cmd.replace(/^"|"$/g, ''));
      console.log(chalk.green(`\n$ ${cmd}\n${output}`));
    } catch (err) {
      console.log(chalk.red(`\nError executing: ${cmd}\n${err}`));
      break;
    }
  }

})();

