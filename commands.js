import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
const rl = readline.createInterface({ input, output });
function aiData(reqText){
const replyText = rl.question(`${reqText}`);
return replyText;
rl.close
}



function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command,function(err,stdout,stderr){
            if (err){
                return reject(err)
            }
            resolve(`stdout: ${stdout} \n stderr:${stderr}`)
        });
    });
}

