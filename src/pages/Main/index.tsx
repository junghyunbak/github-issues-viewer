// components
import { IssueList } from "@/pages/Main/components/IssueList";
import { LabelList } from "@/pages/Main/components/LabelList";
import { Header } from "@/pages/Main/components/Header";
import { IssueListPaginate } from "@/pages/Main/components/IssueListPaginate";

// styles
import { css } from "@emotion/react";
import { size, color, device } from "@/assets/styles";

export function Main() {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;

        height: 100vh;
      `}
    >
      <Header />

      <div
        css={css`
          flex: 1;

          // 해당 속성을 추가해주지 않으면, 내부 요소에 의해 전체 레이아웃이 viewport보다 커질 수 있다.
          overflow: hidden;
        `}
      >
        <div
          css={css`
            display: flex;

            height: 100%;
          `}
        >
          <div
            css={css`
              display: none;

              @media ${device.pc} {
                display: block;
              }

              width: ${size.SIDEBAR_WIDTH}px;
              height: 100%;

              border-right: 1px solid ${color.g200};

              overflow-y: auto;
            `}
          >
            <LabelList />
          </div>

          <div
            css={css`
              flex: 1;

              overflow-y: auto;
            `}
          >
            <div
              css={css`
                max-width: ${size.BREAKPOINT_PC}px;

                margin: 0 auto;
              `}
            >
              <IssueList />

              <IssueListPaginate />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
