import { GitHubClient } from "./github.mjs";

const client = new GitHubClient({ auth: process.env.GITHUB_TOKEN });
await client.dispatchDeployment("aws-amplify-jp", "aws-amplify-jp.github.io");
