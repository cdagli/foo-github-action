const core = require("@actions/core");
const util = require("util");
const path = require("path");
const readPackageJSON = require("read-package-json");
const compareVersions = require("compare-versions");

const readJSON = util.promisify(readPackageJSON);

const main = async () => {
  try {
    const workspace = process.env.GITHUB_WORKSPACE;
    const project = await readJSON(path.join(workspace, "package.json"));

    const approved = await readJSON(path.join(workspace, "approved.json"));

    let result = true;
    const productApprovalResults = [];

    Object.keys(project.dependencies).forEach((dependency, index) => {
      console.log(approved[dependecy])
      if (!approved[dependency]) {
        productApprovalResults.push({
          name: dependency,
          version: project.dependencies[dependency],
          approvedVersion: "-",
          status: "FAILED"
        });
        result = false;
      }
      else if (
        compareVersions(
          approved[dependency].version,
          project.dependencies[dependency]
        ) === -1
      ) {
        productApprovalResults.push({
          name: dependency,
          version: project.dependencies[dependency],
          approvedVersion: approved[dependency].version,
          status: "FAILED"
        });
      } else {
        productApprovalResults.push({
          name: dependency,
          version: project.dependencies[dependency],
          approvedVersion: approved[dependency].version,
          status: "SUCCESS"
        });
      }
    });

    console.table(productApprovalResults);

    if (!result) {
      core.setFailed("Dependency check failed!");
    }

    console.log("Dependency check passed!");
  } catch (error) {
    core.setFailed(error.message);
  }
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
