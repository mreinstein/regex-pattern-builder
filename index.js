// frontend for the regex builder running at http://regex.inginf.units.it/extract/

import cors from '@koa/cors';
import fs   from 'fs';
import os   from 'os';
import body from 'koa-parse-json';
import Koa  from 'koa';
import { fileURLToPath } from 'url';
import { dirname, sep }  from 'path';
import { spawn }         from 'child_process';


const __dirname = dirname(fileURLToPath(import.meta.url));

const SECRET = process.env.SECRET;

if (!SECRET) {
    console.error('could not read API secret from .env file. Please set it and restart.');
    process.exit(1);
}

// build instructions for extracting the useful bits from RegexGenerator:
//     git clone https://github.com/MaLeLabTs/RegexGenerator.git
//     cd <this project>
//     cp -r ../RegexGenerator/ConsoleRegexTurtle/dist dist/


// expose an http endpoint for running this function
const app = new Koa();

app.use(cors());
app.use(body());

app.use(async (ctx, next) => {
    if (ctx.url === '/' && ctx.method === 'POST') {

        ctx.response.type = 'application/json';
        
        if (!ctx.request.body.apiKey) {
           ctx.response.body = { status: 'FAILED', result: 'missing apiKey' };
            return; 
        } else if (ctx.request.body.apiKey !== SECRET) {
            ctx.response.body = { status: 'FAILED', result: 'invalid apiKey' };
            return;
        }

        try {
            const samples = ctx.request.body.samples.map((s) => {
                return {
                    string: s.string,
                    match: [{
                        start: s.selectionStart,

                        // javascript and java string slices are slightly different.
                        // increment end position to match what java expects.
                        end: s.selectionEnd + 1
                    }]
                };
            });

            const result = await determineRegex(samples);
            ctx.response.body = { status: 'OK', result };
        } catch (er) {
            ctx.response.body = { status: 'FAILED', result: er };
        }
    }
});

const PORT = 5001;
app.listen(PORT);
console.log(`regex build server listening on port ${PORT}`);


// @param Array samples a series of strings and their matches.
async function determineRegex (samples) {
    return new Promise(function (resolve, reject) {
        // java -jar ConsoleRegexTurtle/dist/ConsoleRegexTurtle.jar -g 100 -d mine.json -o ./out
        const tmpDir = os.tmpdir();
        const outputDir = fs.mkdtempSync(`${tmpDir}${sep}`);

        // write the input file to disk
        const tmpDir2 = os.tmpdir();
        const inputDir = fs.mkdtempSync(`${tmpDir2}${sep}`);
        const inputFile = `${inputDir}${sep}in.json`;
        fs.writeFileSync(inputFile, JSON.stringify({ name: '', description: '', examples: samples }), 'utf8');

        const p = spawn('java',
                       [ '-jar', 'dist/ConsoleRegexTurtle.jar', '-g', '200', '-d', inputFile, '-o', outputDir ],
                       { cwd: __dirname });

        // even though we don't do anything with the data, it's necessary to consume stdout
        // or the java process will just hange there
        p.stdout.on('data', function (data) { });

        p.on('close', function (code) {
            
            if (code !== 0)
                return reject(code, 'er:', p.stderr);

            // get the output file
            const fileList = fs.readdirSync(outputDir, { withFileTypes: true });

            if (!fileList[0]?.name || !fs.existsSync(`${outputDir}${sep}${fileList[0]?.name}`))
                return reject(`result file not found.`);
            
            const raw = fs.readFileSync(`${outputDir}${sep}${fileList[0]?.name}`, 'utf8');

            console.log('raw:', raw);

            try {
                const j = JSON.parse(raw);

                // need to convert slashes (\) to double slashes (\\)
                // because json will escape strings
                resolve({
                    solutionJS: j.bestSolution.solutionJS.replace(/\\/g, '\\\\\\\\')
                });

            } catch (er) {
                reject('failed to parse result as JSON');
            }
        });
    });
}
