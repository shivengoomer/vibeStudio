

import chalk from 'chalk';
import figlet from 'figlet';
import { input } from '@inquirer/prompts';
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
  const techStack = await input({ message: "What do you want me to make + tech Stack?:" });
  const location = await input({ message: "" });
});


