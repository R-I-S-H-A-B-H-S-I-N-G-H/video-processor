// shellUtil.js
const { exec } = require('child_process');

exports.execute = (command, inputStream) => {
    return new Promise((res,rej) => { 
        const child = exec(command);

    if (inputStream) {
        inputStream.pipe(child.stdin);
    }

    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
      
    child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
      
    child.on('error', (error) => {
        console.error(`error: ${error.message}`);
        rej(error)
    });
      
    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res(code);
    });
    })
}
