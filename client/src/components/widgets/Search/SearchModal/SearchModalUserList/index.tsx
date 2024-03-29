// react
import { useEffect } from "react";
import { useQuery } from "react-query";

// zustand
import useStore from "@/store";

// styles
import * as S from "./index.styles";

// components
import { SearchModalUserListItem } from "./SearchModalUserListItem";

// hooks
import { useOctokit } from "@/hooks";

// apis
import { RequestError } from "octokit";

interface SearchModalUserListProps {
  searchValue: string;
}

export function SearchModalUserList({ searchValue }: SearchModalUserListProps) {
  const { apiService } = useOctokit();

  const [setUserSearching] = useStore((state) => [state.setUserSearching]);

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

  useEffect(() => {
    setUserSearching(users.isLoading);

    return () => {
      setUserSearching(false);
    }
  }, [users.isLoading, setUserSearching]);

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
    <S.SearchModalUserListLayout>
      <S.SearchModalUserListTitleParagraph>
        owner
      </S.SearchModalUserListTitleParagraph>

      <S.SearchModalUserList>
        {users.data.map((user) => {
          const { id, login, avatar_url } = user;
          return (
            <SearchModalUserListItem
              key={user.id}
              id={id}
              login={login}
              avatar_url={avatar_url}
            />
          );
        })}
      </S.SearchModalUserList>
    </S.SearchModalUserListLayout>
  );
}
