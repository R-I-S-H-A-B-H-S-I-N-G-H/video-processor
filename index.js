const { execute } = require("./utils/shellUtil");
const path = require("path");
const fs = require("fs");
const { executeWorker } = require("./utils/shellWorker");


const resMap = {
    360: 360,
    480: 480,
    720: 720,
}
const crfMap = {
    32:32,
    36:36,
    // 38:38,
    // 40:40,
    // 42:42,
    // 44:44,
    // 48:48,
}

const bitrateMap = {
    "10k":"10k",
    "50k":"50k",
    "100k":"100k",
    "150k":"150k",
    "200k":"200k",
    "250k":"250k",
    "300k":"300k",
    "350k":"350k",
    "400k":"400k",
    "450k":"450k",
    "500k":"500k",
    "550k":"550k",
}

async function generateVid(props) {
    const { inputPath, outputPath, res, crf, bitrate } = props;
    console.log(props);
    // await execute(`ffmpeg -i ${inputPath}  -c:v libx264 -preset veryslow -crf ${crf} -vf "scale=-2:${res}" -c:a aac -b:a 192k -pix_fmt yuv420p ${outputPath}`);
    await executeWorker(`ffmpeg -i ${inputPath} -b:v ${bitrate} -bufsize ${bitrate}  -vf "scale=-2:${res}"  -c:v libx264 -preset veryslow -c:a aac -pix_fmt yuv420p ${outputPath}`);
}

// bit = (fisize in kb *1000) / total no of secons

// let {

//     inputPath = path.join(__dirname, "original.mp4"),
//     outputPath = "",
//     videobitrate = "100k",
//     res=320

// } = {};
 

// outputPath = path.resolve(__dirname, `${videobitrate}-${res}.mp4`)



// executeWorker(`ffmpeg -i ${inputPath} -b:v ${videobitrate} -bufsize ${videobitrate} -vf "scale=-2:${res}"  -c:v libx264 -preset veryslow ${outputPath}`);





// (async () => { 
//     const inputPath = path.resolve(__dirname, `original.mp4`);

//     for (let bitrate in bitrateMap) {
//         const promiseList = [];
//         for (let res in resMap) {
//             console.log(`TASK FOR bitrate:${bitrate} and resolution : ${res}`);
           
//             const props = { inputPath, res: res, bitrate: bitrate };
//             props.outputPath = path.resolve(__dirname, `${res}-${bitrate}.mp4`)
//             promiseList.push(generateVid(props))
//         }
//         await Promise.all(promiseList);
//     }
// })()



async function doPocess(count) {
    if (count > 100) return;
    const inputPath = path.resolve(__dirname, `input480-36-${count}.mp4`);
    const stats = fs.statSync(inputPath);
    const fileSizeInMB = stats.size / (1024 * 1024)
    if (fileSizeInMB < 4) return;
    
    
    for (let crf in crfMap) {
        const promiseList = [];
        for (let res in resMap) {
            console.log(`TASK FOR CRF:${crf} and resolution : ${res}`);
           
            const props = { inputPath, res: res, crf: crf };
            // props.outputPath = path.resolve(__dirname, `output${res}-crf=${crf}.mp4`)
            props.outputPath = path.resolve(__dirname, `input480-36-${count+1}.mp4`)
            promiseList.push(generateVid(props))
        }
        await Promise.all(promiseList);
    }

    doPocess(count + 1);
}

// doPocess(9);


