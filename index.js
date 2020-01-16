const core = require("@actions/core");
const github = require("@actions/github");
const util = require('util');
const path = require('path');
const readPackageJSON = require('read-package-json');
const fs = require('fs');

const readJSON = util.promisify(readPackageJSON); 

const main = async () => {
  try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput("who-to-greet");
    console.log(`Hello ${nameToGreet}!`);
    const time = new Date().toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);

    const workspace = process.env.GITHUB_WORKSPACE;
    console.log(workspace)
    fs.readdirSync(workspace).forEach(file => {
      console.log('FILE')
      console.log(file);
    });
    // const project = await readJSON(
    //   path.join(workspace, "package.json")
    // );
    // console.log(project);
  } catch (error) {
    core.setFailed(error.message);
  }
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});