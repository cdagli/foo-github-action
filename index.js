const core = require("@actions/core");
const util = require("util");
const path = require("path");
const readPackageJSON = require("read-package-json");
const compareVersions = require('compare-versions');

const readJSON = util.promisify(readPackageJSON);

const main = async () => {
  try {
    const workspace = process.env.GITHUB_WORKSPACE;
    const project = await readJSON(path.join(workspace, "package.json"));

    const approved = await readJSON(path.join(workspace, "approved.json"));

    let result = true;
    const productApprovalResults = [];

    Object.keys(project.dependencies).forEach((dependency, index) => {
      if (!approved[dependency] /*|| compareVersions(approved[dependency], project.dependencies[dependency]) === -1 */) {
        productApprovalResults.push({
          name: dependency,
          version: project.dependencies[dependency],
          approvedVersion: '-',
          status: 'FAILED'
        })
        result = false;
      }

      productApprovalResults.push({
        name: dependency,
        version: project.dependencies[dependency],
        approvedVersion: approved[dependency],
        status: 'SUCCESS'
      })
    });

    console.table(productApprovalResults);

    if(!result) {
      throw new Error('Dependency check failed!');
    }

    console.log('Dependency check passed!')
  } catch (error) {
    core.setFailed(error.message);
  }
};

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


/*
- Success
- Not approved
- Not approved version 
*/