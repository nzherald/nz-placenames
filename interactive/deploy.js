var env = require('dotenv').config().parsed;
var process = require('child_process');

const io = args => {
 const handler = (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(stdout);
  if (stderr) {
    console.log(`stderr: ${stderr}`);
  }
  if (args.length != 0) {
    seqExec(args);
  }
 };
  return handler;
}



const seqExec = args => {
  process.exec(`aws --region ${env.AWS_REGION} s3 cp build/ ${env.AWS_S3_PATH} \
  --acl=public-read --recursive ${args[0]}`, io(args.slice(1)))
}

seqExec(["--cache-control max-age=2592000,public --exclude=* --include=**/main.* --include=out.csv",
  "--cache-control max-age=60,public --exclude=**/main.* --exclude=out.csv",
])

