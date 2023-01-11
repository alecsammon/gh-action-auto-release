const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    const githubToken = core.getInput("github-token", { required: true })
    const octokit = github.getOctokit(githubToken)

    console.log({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
    })

    const { data: pullRequest } = await octokit.rest.issues.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
    });

    const labels = pullRequest.labels.filter(l => ["release:none", "release:patch", "release:minor", "release:major"].includes(l.name));

    if (labels.length !== 1) {
        await octokit.rest.issues.createComment({
            issue_number: github.context.issue.number,
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            body: 'Must have one of the following labels: "release:none", "release:patch", "release:minor", "release:major"'
        })

        core.setFailed('Must have one of the following labels: "release:none", "release:patch", "release:minor", "release:major"')
    }
}

run().catch(e => {
    core.error(e)
    core.setFailed(e.message)
})
