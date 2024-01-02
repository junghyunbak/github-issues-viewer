// react
import React from "react";
import { useQuery } from "react-query";

// styles
import { css } from "@emotion/react";

// components
import { SearchModalUserListItem } from "./SearchModalUserListItem";

// hooks
import { useOctokit } from "@/hooks";

interface SearchModalUserListProps {
  searchValue: string;

  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchModalUserList({
  searchValue,
  setInputValue,
}: SearchModalUserListProps) {
  const [owner, repo] = searchValue.split("/");

  const { apiService } = useOctokit();

  const userList = useQuery(["search", "users", owner], async () => {
    if (owner === "") {
      return null;
    }

    try {
      const userList = await apiService.getUserList(owner);

      return userList;
    } catch (e) {
      return null;
    }
  });

  if (!userList.data) {
    return null;
  }

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

      <ul css={css``}>
        {userList.data.map((user) => {
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
