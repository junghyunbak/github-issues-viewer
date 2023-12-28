// react
import { useState } from "react";
import { useQuery } from "react-query";
import { Blocks } from "react-loader-spinner";
import { useParams, useSearchParams } from "react-router-dom";

// apis
import { apiSevice } from "@/apis";

// styles
import { css } from "@emotion/react";
import { color, size } from "@/assets/styles";

// constants
import { defaultValue } from "@/constants";

// components
import { IssueListItem } from "./IssueListItem";

// utils
import queryString from "query-string";

export function IssueList() {
  const { owner, repo } = useParams();

  const [searchParams] = useSearchParams();

  const { label, per_page, page } = queryString.parse(searchParams.toString());

  const issueList = useQuery(
    ["issue", "list", owner, repo, label, per_page, page],
    async () => {
      return await apiSevice.getRepoIssueList(
        owner || "",
        repo || "",
        (label as string) || "",
        Number(per_page) || defaultValue.DEFAULT_PER_PAGE,
        Number(page) || 1
      );
    }
  );

  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  if (issueList.isError) {
    return (
      <div>
        <p>해당 레포지토리를 찾을 수 없습니다.</p>
      </div>
    );
  }

  if (issueList.isLoading) {
    return <Blocks />;
  }

  if (!issueList.data) {
    return null;
  }

  return (
    <div
      css={css`
        padding: 1.25rem;
      `}
    >
      {issueList.data.length > 0 ? (
        <ul
          css={css`
            width: 100%;

            border-radius: ${size.BORDER_RADIUS}px;
            border: 1px solid ${color.g200};

            overflow: hidden;
          `}
        >
          {issueList.data.map((issue) => {
            return (
              <IssueListItem
                key={issue.id}
                issue={issue}
                selectedIssueId={selectedIssueId}
                setSelectedIssueId={setSelectedIssueId}
              />
            );
          })}
        </ul>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
}
