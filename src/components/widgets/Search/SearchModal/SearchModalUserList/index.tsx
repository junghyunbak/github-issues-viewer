// react
import React from "react";
import { useQuery } from "react-query";

// styles
import { css } from "@emotion/react";

// components
import { SearchModalUserListItem } from "./SearchModalUserListItem";

// hooks
import { useOctokit } from "@/hooks";

// apis
import { RequestError } from "octokit";

interface SearchModalUserListProps {
  searchValue: string;

  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchModalUserList({
  searchValue,
  setInputValue,
}: SearchModalUserListProps) {
  const { apiService } = useOctokit();

  const [owner, repo] = searchValue.split("/");

  const users = useQuery(["search", "users", owner], async () => {
    try {
      const users = await apiService.getUsers(owner);

      return users;
    } catch (e) {
      if (!(e instanceof RequestError)) {
        return null;
      }

      if (e.status === 403) {
        throw e;
      } else {
        return null;
      }
    }
  });

  if (!users.data || !users.data.length) {
    return null;
  }

  /**
   * 레포지토리 검색 시에는 유저 검색결과 숨김
   */
  if (repo !== undefined) {
    return null;
  }

  return (
    <div>
      <p
        css={css`
          font-size: 0.75rem;
          font-weight: bold;

          padding: 0.375rem 0.5rem;
        `}
      >
        owner
      </p>

      <ul>
        {users.data.map((user) => {
          return (
            <SearchModalUserListItem
              key={user.id}
              user={user}
              setInputValue={setInputValue}
            />
          );
        })}
      </ul>
    </div>
  );
}
