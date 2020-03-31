// @flow
import styled, { type StyledComponent } from 'styled-components';

const UserAnalystListHiddenContainer: StyledComponent<{}, {}, HTMLDivElement> = styled.div.attrs({
  className: 'user-analyst-list-hidden',
})``;

export const TooltipAnalystListHiddenContainer: StyledComponent<
  {},
  {},
  HTMLDivElement,
> = styled.div.attrs({
  className: 'tooltip-analyst-list-hidden',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  padding: 4px 0;

  svg {
    margin: 0;
  }

  .circle {
    top: 50%;
    transform: translateY(-50%);
    left: -6px;
    right: initial;
    bottom: initial;
  }
`;

export const UserAvatarWrapper: StyledComponent<{}, {}, HTMLDivElement> = styled.div.attrs({
  className: 'user-avatar-wrapper',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 6px;
`;

export default UserAnalystListHiddenContainer;