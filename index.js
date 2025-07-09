import 'dotenv/config';
import figlet from 'figlet';
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

    // Prompt for app name and user function immediately after banner
    let appName = '';
    let UserFunc = '';
    while (!appName) {
        appName = (await input({ message: "What do you want me to make :" })).replace(/\s+/g, '');
        if (!appName) console.log(chalk.red(centerText("Please provide a tech stack or app idea.")));
    }
    while (!UserFunc) {
        UserFunc = await input({ message: "Customize features or UI?" });
    }

    let techStack = "html css js";
    const fullPrompt = `
Build a fully functional and modern-looking ${appName} application using only HTML, CSS, and JavaScript.

Requirements:
-seprate each code by '\n'
-make sure the code is 100% working check it 3 to 4 times i dont want any error.
-make sure to provide commands with special ui features that are -${UserFunc}
-make sure to implement ${UserFunc} and error less code with proper functionality and Nesscary Features.
-check min 4-5 times for error free code!!
- Output ONLY terminal commands, one per line.
-promide me in a way like echo "<Doctype.html>" >> index.html not all at once.
- DO NOT include any explanations, comments, or markdown formatting.
- Every file must be created inside a folder named ${appName}.
- The first command must be: mkdir ${appName} && cd ${appName}
- Use touch to create each file before using echo.
- Use this format for writing content: echo "content" > filename or echo "content" >> filename
- Output must be line-by-line terminal commands only.
- The final application must be 100% working when opened in a browser.
`;

    const commandsRaw = await groqReturn(fullPrompt);

const commandList = typeof commandsRaw === 'string'
    ? commandsRaw.split('\n').filter(line => line.trim() !== '')
    : Array.isArray(commandsRaw)
        ? commandsRaw
        : [];

for (const cmdRaw of commandList) {
    let cmd = cmdRaw; // preserve original line without trimming

    // Replace file references with prefixed path only in echo or touch commands
    if (/^\s*(echo|touch)\b/.test(cmd)) {
        const filesToReplace = ['script.js', 'index.html', 'style.css'];
        for (const file of filesToReplace) {
            // Only replace when file appears after >, >>, or as a standalone argument
            const regex = new RegExp(`(?<=\\s|>|>>|\\A)${file}(?=\\s|$)`, 'g');
            cmd = cmd.replace(regex, `${appName}/${file}`);
        }
    }

    if (!cmd || !/^(mkdir|cd|touch|echo|rm|cp|mv|npm|yarn|cat|open|code|ls|pwd)/.test(cmd.trim())) continue;
    try {
        const output = await executeCommand(cmd);
        console.log(chalk.green(centerText(`$ ${cmd}`)));
        if (output && output.trim()) {
            console.log(chalk.gray(centerText(output)));
        }
    } catch (err) {
        console.log(chalk.red(centerText(`Error: ${err.message}`)));
        break;
    }
}})