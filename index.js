
import figlet from 'figlet';
import 'dotenv/config';
import chalk from 'chalk';
import { groqReturn } from './model.js';
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
  let commands=[];
  const fullPrompt = `You are a senior software engineer with expertise in the ${techStack} and use only required folder or stack. Please provide a concise, step-by-step list of terminal commands to set up and run the ${appName} application, including any necessary file content modifications. Keep it strictly technical and executable
  provide me only terminal commands in right order to be performed one by one making the app fully functional and also providing basic ui.
  dont include bash keyword at top or provide me each command in way start and end command with  quoatation marks
  just excute commands under ${executeCommand(commands)} where "commands" represents terminal commands one by one as string.
  `
commands = await groqReturn(fullPrompt);
// Ensure commands is an array of strings
if (typeof commands === 'string') {
  try {
    commands = JSON.parse(commands);
    if (!Array.isArray(commands)) throw new Error();
  } catch (e) {
    const arrayMatch = commands.match(/\[([\s\S]*)\]/);
    if (arrayMatch) {
      try {
        commands = JSON.parse(arrayMatch[0]);
      } catch {
        commands = arrayMatch[1]
          .split(',')
          .map(cmd => cmd.replace(/^["'\s]+|["'\s]+$/g, ''))
          .filter(Boolean);
      }
    } else {
      commands = commands
        .split(/\n|;/)
        .map(cmd => cmd.replace(/^["'\s]+|["'\s]+$/g, ''))
        .filter(Boolean);
    }
  }
}
if (!Array.isArray(commands)) {
  console.log(chalk.red("Failed to parse commands as an array."));
  process.exit(1);
}

async function runCommands() {
  for (const command of commands) {
    console.log(`\n▶️ Running: ${command}`);
    try {
      await executeCommand(command.replace(/^["']|["']$/g, '')); // Remove surrounding quotes if present
    } catch (err) {
      console.log(`❌ Failed: ${command}`);
      break; // stop further execution on failure
    }
  }
}
await runCommands();
})();

