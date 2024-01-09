// react
import React, { useCallback, useMemo } from "react";

// components
import { IssueListItemLabelList } from "@/pages/Main/components/IssueList/IssueListItem/IssueListItemLabelList";
import { IssueListItemBody } from "./IssueListItemBody";

// svgs
import { ReactComponent as IssueOpened } from "@/assets/svgs/issue-opened.svg";
import { ReactComponent as IssueClosed } from "@/assets/svgs/issue-closed.svg";
import { ReactComponent as PrOpen } from "@/assets/svgs/pr-open.svg";
import { ReactComponent as PrClosed } from "@/assets/svgs/pr-closed.svg";
import { ReactComponent as PrMerged } from "@/assets/svgs/pr-merged.svg";
import { ReactComponent as Comment } from "@/assets/svgs/comment.svg";

// styles
import { css } from "@emotion/react";
import { color, device, size } from "@/assets/styles";

// apis
import { type components } from "@octokit/openapi-types";

interface IssueListItemProps {
  issue: components["schemas"]["issue"];

  selectedIssueId: number | null;
  setSelectedIssueId: React.Dispatch<React.SetStateAction<number | null>>;
}

export function IssueListItem({
  issue,
  selectedIssueId,
  setSelectedIssueId,
}: IssueListItemProps) {
  const { id, title, labels, state, created_at, pull_request, comments } =
    issue;

  const handleIssueItemClick = useCallback(() => {
    setSelectedIssueId((prev) => {
      if (prev === id) {
        return null;
      }

      return id;
    });
  }, [id, setSelectedIssueId]);

  const StatusIcon = useMemo<React.ReactNode>(() => {
    if (pull_request) {
      if (state === "open") {
        return (
          <PrOpen
            css={css`
              path {
                fill: ${color.success};
              }
            `}
          />
        );
      } else {
        if (!pull_request.merged_at) {
          return (
            <PrClosed
              css={css`
                path {
                  fill: rgb(207, 34, 46);
                }
              `}
            />
          );
        } else {
          return (
            <PrMerged
              css={css`
                path {
                  fill: ${color.complete};
                }
              `}
            />
          );
        }
      }
    }

    return state === "open" ? (
      <IssueOpened
        css={css`
          path {
            fill: ${color.success};
          }
        `}
      />
    ) : (
      <IssueClosed
        css={css`
          path {
            fill: ${color.complete};
          }
        `}
      />
    );
  }, [state, pull_request]);

  return (
    <li
      css={css`
        display: flex;
        flex-direction: column;

        list-style: none;

        &:first-of-type {
          > div:first-child {
            border-top-right-radius: ${size.BORDER_RADIUS}px;
            border-top-left-radius: ${size.BORDER_RADIUS}px;
          }
        }

        &:last-child {
          border-bottom: 0;

          > div:last-child {
            border-bottom-right-radius: ${size.BORDER_RADIUS}px;
            border-bottom-left-radius: ${size.BORDER_RADIUS}px;

            border-bottom: 0;
          }
        }
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;

          padding: 0.5rem;

          position: sticky;
          top: 0;
          background-color: ${color.w};
          z-index: 6;

          border-bottom: 1px solid ${color.g200};

          &:hover {
            @media ${device.canHover} {
              background-color: ${color.g100};
            }
          }

          cursor: pointer;
        `}
        onClick={handleIssueItemClick}
      >
        <div
          css={css`
            display: flex;

            gap: 0.5rem;
          `}
        >
          <div
            css={css`
              padding-left: 0.25rem;
            `}
          >
            {StatusIcon}
          </div>

          <div>
            <div
              css={css`
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 0.375em;
              `}
            >
              <p
                css={css`
                  font-weight: 600;
                  line-height: 1.5rem;
                `}
              >
                {title}
              </p>

              <IssueListItemLabelList labels={labels} />
            </div>

            <div>
              <p
                css={css`
                  color: gray;
                  font-size: 0.75rem;
                  line-height: 1.5rem;
                `}
              >
                {new Date(created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {comments > 0 && (
          <div
            css={css`
              display: flex;
              align-items: top;
              gap: 0.2rem;

              padding-right: 0.25rem;
            `}
          >
            <Comment
              css={css`
                path {
                  fill: gray;
                }
              `}
            />

            <p
              css={css`
                white-space: nowrap;
                font-size: 0.75rem;
                color: gray;
              `}
            >
              {comments}
            </p>
          </div>
        )}
      </div>

      {selectedIssueId === id && (
        <IssueListItemBody
          issue={issue}
          setSelectedIssueId={setSelectedIssueId}
        />
      )}
    </li>
  );
}
