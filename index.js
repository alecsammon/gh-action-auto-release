const core = require('@actions/core');
const github = require('@actions/github');

run().catch(error => {
    core.setFailed(error.message);
});


async function run() {
    const token = core.getInput("github-token", { required: true });
    const octokit = github.getOctokit(token);

    core.debug(github.context.eventName)

    const labelNames = await getPullRequestLabelNames(octokit);
    core.debug(`PR label names: ${labelNames}`);

    const labels = getInputLabels();
    core.debug(`Input labels: ${labels}`);

    core.setOutput("result", labels);

    core.debug("End");
}

async function getPullRequestLabelNames(octokit) {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const commit_sha = github.context.sha;
    core.debug(
        `PR context - Owner: ${owner} Repo: ${repo} Commit_SHA: ${commit_sha}`
    );

    const response =
        await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
            owner,
            repo,
            commit_sha,
        });
    core.debug(`Retrieved commit data: ${response.data}`);

    const pr = response.data.length > 0 && response.data[0];
    core.debug(`Retrieved PR: ${pr}`);

    return pr ? pr.labels.map((label) => label.name || "") : [];
}

function getInputLabels() {
    const raw = core.getInput("labels", { required: true });
    core.debug(`Get input "labels": ${raw}`);

    const json = JSON.parse(raw);
    core.debug(`Parsed as JSON: ${json}`);

    return Array.isArray(json) ? json : [];
}

run().catch((err) => {
    core.setFailed(`Action failed with error: ${err.message}`);
});
