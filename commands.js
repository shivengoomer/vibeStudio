
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
