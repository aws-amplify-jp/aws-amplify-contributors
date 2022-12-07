import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { throttling } from "@octokit/plugin-throttling";
const MyOctokit = Octokit.plugin(throttling, paginateRest);

const createOctokit = (options = {}) => {
  const octokit = new MyOctokit({
    ...options,
    throttle: {
      onRateLimit: (retryAfter, options, octokit) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`
        );
        if (options.request.retryCount === 0) {
          octokit.log.warn(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onSecondaryRateLimit: (retryAfter, options, octokit) => {
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}`
        );
      },
    },
  });
  return octokit;
};

export class GitHubClient {
  constructor(options = {}) {
    this.octokit = createOctokit(options);
  }

  async fetchRepositories(owner) {
    const repos = await this.octokit.paginate(
      "GET /orgs/{owner}/repos",
      {
        owner,
      }
    );
    return repos;
  }

  async fetchContributors(owner, repo) {
    const containers = await this.octokit.paginate(
      "GET /repos/{owner}/{repo}/contributors",
      {
        owner,
        repo,
      }
    );
    return containers;
  }

  async fetchUser(username) {
    try {
      const { data } = await this.octokit.request("GET /users/{username}", {
        username,
      });
      return data;
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  async dispatchDeployment(owner, repo) {
    await this.octokit.request("POST /repos/{owner}/{repo}/dispatches", {
      owner,
      repo,
      event_type: "deploy",
    });
  }
}
