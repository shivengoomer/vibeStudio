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
Generate a 100% error-free ${appName} web application using only HTML, CSS, and JavaScript. Follow these strict requirements:

1. PROJECT SETUP:
- First command must be: mkdir -p "${appName}" && cd "${appName}"
- Create these files: index.html, style.css, script.js
- Use touch before each echo command
- For new files: echo "content" > filename
- For appending: echo "content" >> filename

2. CODE GENERATION RULES:
- HTML:
  * Maintain valid document structure
  * Properly escape all special characters
  * Use semantic HTML5 elements
  * Include responsive meta tag

- CSS:
  * Use modern Flexbox/Grid layouts
  * Mobile-first approach
  * Validate all selectors exist in HTML
  * Prefix experimental features
  * I want Morden and Impressive UI/UX.
  * representable design and UI.

- JavaScript:
  * Triple-check all code against ESLint standards
  * Verify ${UserFunc} implementation
  * Test all event listeners
  * Validate DOM selectors
  * Implement error handling
  * Use strict equality checks
  * No undefined variables

3. VALIDATION PROCESS:
Phase 1: Syntax Checking
- Validate all brackets/braces/parentheses
- Check quote balancing
- Verify semicolon usage

Phase 2: Static Analysis
- Confirm no undefined references
- Verify function implementations
- Check variable scoping

Phase 3: Runtime Testing
- Test all user interactions
- Verify edge cases
- Check null/undefined handling
- Validate responsive behavior

Phase 4: Browser Testing
- Chrome, Firefox, Safari
- Mobile/Desktop views
- Check console for errors
- Verify ${UserFunc} works

4. OUTPUT REQUIREMENTS:
- Only terminal commands (one per line)
- No comments/explanations
- Format: echo 'content' >> filename
- Escape all special characters
- Use single quotes for content

5. ERROR PREVENTION:
- Validate JavaScript 5 times:
  1) Initial implementation
  2) After DOM integration
  3) After event listeners
  4) After ${UserFunc}
  5) Final review

- Test all:
  * Conditional logic
  * Loops
  * Async operations
  * State changes
  * Edge cases

6. FINAL VERIFICATION:
- Zero console errors/warnings
- All interactive elements work
- Proper mobile responsiveness
- ${UserFunc} fully operational
- No memory leaks
- Performance optimized

Generate only validated terminal commands starting with directory creation.`

    const commandsRaw = await groqReturn(fullPrompt);
const commandList = Array.isArray(commandsRaw) 
    ? commandsRaw
    : typeof commandsRaw === 'string'
        ? commandsRaw.split('\n').filter(line => line.trim().length > 0)
        : [];

const allowedCommands = new Set([
    'mkdir', 'cd', 'touch', 'echo', 
    'rm', 'cp', 'mv', 'npm',
    'yarn', 'cat', 'open', 'code',
    'ls', 'pwd'
]);

const fileMapping = {
    'script.js': `${appName}/script.js`,
    'index.html': `${appName}/index.html`, 
    'style.css': `${appName}/style.css`
};

for (const cmdRaw of commandList) {
    try {
        const cmd = cmdRaw.trim();
        if (!cmd) continue;

        // Extract base command
        const baseCmd = cmd.split(/\s+/)[0];
        if (!allowedCommands.has(baseCmd)) continue;

        // Process file paths
        let processedCmd = cmd;
        if (baseCmd === 'echo' || baseCmd === 'touch') {
            for (const [file, mappedPath] of Object.entries(fileMapping)) {
                processedCmd = processedCmd.replace(
                    new RegExp(`(^|\\s)${file}(\\s|$)`, 'g'),
                    `$1${mappedPath}$2`
                );
            }
        }

        // Execute command
        const output = await executeCommand(processedCmd);
        console.log(chalk.green(centerText(`$ ${processedCmd}`)));
        
        if (output?.trim()) {
            console.log(chalk.gray(centerText(output)));
        }
    } catch (err) {
        console.error(chalk.red(centerText(`Error in command "${cmdRaw}": ${err.message}`)));
        if (err.code === 'ENOENT' || err.code === 'EACCES') {
            break; // Stop on critical filesystem errors
        }
    }
}
})