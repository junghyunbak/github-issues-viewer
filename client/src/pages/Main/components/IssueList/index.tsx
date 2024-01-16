// react
import { useQuery } from "react-query";
import { RotatingLines } from "react-loader-spinner";
import { useParams, useSearchParams } from "react-router-dom";
import { IssueSelectionStateProvider } from "./index.context";

// styles
import * as S from "./index.styles";

// constants
import { defaultValue } from "@/constants";

// components
import { IssueListItem } from "./IssueListItem";
import { IssueListPaginate } from "./IssueListPaginate";

// utils
import queryString from "query-string";

// hooks
import { useOctokit } from "@/hooks";

export function IssueList() {
  const { owner, repo } = useParams();

  const [searchParams] = useSearchParams();

  const { apiService } = useOctokit();

  const { label, per_page, page, state, sort, direction } = queryString.parse(
    searchParams.toString()
  );

  const issues = useQuery(
    [
      "issue",
      "list",
      owner,
      repo,
      label,
      per_page || defaultValue.ISSUES_PER_PAGE,
      page || defaultValue.ISSUES_PAGE,
      state || defaultValue.ISSUES_STATE,
      sort || defaultValue.ISSUES_SORT,
      direction || defaultValue.ISSUES_SORT_DIRECTION,
    ],
    async () => {
      if (label instanceof Array) {
        return;
      }

      return await apiService.getRepoIssueList(
        owner || "",
        repo || "",
        !label ? [] : label.split(","),
        Number(per_page) || defaultValue.ISSUES_PER_PAGE,
        Number(page) || defaultValue.ISSUES_PAGE,
        (state as IssuesState) || defaultValue.ISSUES_STATE,
        (sort as IssuesSort) || defaultValue.ISSUES_SORT,
        (direction as IssuesSortDirection) || defaultValue.ISSUES_SORT_DIRECTION
      );
    }
  );

  if (issues.isLoading) {
    return (
      <S.IssueListLoadingBox>
        <RotatingLines width="2rem" strokeColor="gray" />
      </S.IssueListLoadingBox>
    );
  }

  if (!issues.data || issues.data.items.length === 0) {
    return null;
  }

  return (
    <IssueSelectionStateProvider>
      <S.IssueListLayout>
        <S.IssueList>
          {issues.data.items.map((issue) => {
            return <IssueListItem key={issue.id} issue={issue} />;
          })}
        </S.IssueList>

        <S.IssueListPaginateLayout>
          <IssueListPaginate pageCount={issues.data.pageCount} />
        </S.IssueListPaginateLayout>
      </S.IssueListLayout>
    </IssueSelectionStateProvider>
  );
}
