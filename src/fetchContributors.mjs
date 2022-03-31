import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { GitHubClient } from "./github.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetsDir = path.join(__dirname, "../assets");
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const repositories = [
  {
    owner: "aws-amplify-jp",
    repos: ["aws-amplify-jp.github.io", "awesome-aws-amplify-ja"],
  },
  // {
  //   owner: "aws-amplify",
  //   repos: [
  //     "amplify-js",
  //     "amplify-cli",
  //     "docs",
  //     "amplify-ios",
  //     "amplify-android",
  //     "amplify-flutter",
  //     "amplify-ui",
  //     "maplibre-gl-js-amplify",
  //   ]
  // },
];

async function fetchUsers(client, contributors, users) {
  for (const contributor of contributors) {
    const { login } = contributor;
    if (Object.prototype.hasOwnProperty.call(users, login)) {
      continue;
    }
    const user = await client.fetchUser(login);
    if (!user) {
      continue;
    }
    users[login] = {
      login,
      location: user.location,
    };
  }
}

async function fetchContributors(client) {
  const contributorsJsonPath = path.join(assetsDir, "contributors.json");
  const contributorList = [];
  for (const { owner, repos } of repositories) {
    for (const repo of repos) {
      const contributors = await client.fetchContributors(owner, repo);
      contributorList.push({
        owner,
        repo,
        contributors,
      });
    }
  }

  await fs.promises.writeFile(
    contributorsJsonPath,
    JSON.stringify(contributorList, null, 2)
  );

  return contributorList;
}

async function main() {
  const usersJsonPath = path.join(assetsDir, "users.json");
  const users = fs.existsSync(usersJsonPath)
    ? JSON.parse(fs.readFileSync(usersJsonPath, { encoding: "utf8" }))
    : {};

  const client = new GitHubClient({ auth: process.env.GITHUB_TOKEN });
  const contributorList = await fetchContributors(client);
  for (const { contributors } of contributorList) {
    await fetchUsers(client, contributors, users);
  }
  await fs.promises.writeFile(usersJsonPath, JSON.stringify(users, null, 2));
}

await main();
