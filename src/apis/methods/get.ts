import { Octokit } from "octokit";

export const octokit = new Octokit();

export const getRepoIssueList = async (
  owner: string,
  repo: string,
  label: string,
  perPage: number,
  page: number
) => {
  const queries = [`type:issue`, `repo:${owner}/${repo}`];

  if (label) {
    queries.push(`label:${label}`);
  }

  const {
    data: { items },
  } = await octokit.rest.search.issuesAndPullRequests({
    q: queries.join("+"),
    per_page: perPage,
    page,
  });

  return items;
};

export const getRepoIssueListTotalCount = async (
  owner: string,
  repo: string,
  label: string
) => {
  const queries = [`type:issue`, `repo:${owner}/${repo}`];

  if (label) {
    queries.push(`label:${label}`);
  }

  const {
    data: { total_count },
  } = await octokit.rest.search.issuesAndPullRequests({
    q: queries.join("+"),
  });

  return total_count;
};

export const getRepoIssueLabelList = async (
  owner: string = "",
  repo: string = ""
) => {
  const response = await octokit.rest.issues.listLabelsForRepo({
    owner,
    repo,
  });

  return response.data;
};

export const getRepoList = async (owner: string) => {
  await octokit.rest.users.getByUsername({ username: owner });

  const { data } = await octokit.rest.repos.listForUser({
    username: owner,
  });

  return data;
};

export const getUserList = async (owner: string) => {
  const queries: string[] = [`${owner} in:login`];

  const {
    data: { items },
  } = await octokit.rest.search.users({
    q: queries.join("+"),
    per_page: 5,
  });

  return items;
};
