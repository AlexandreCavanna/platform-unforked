// @flow
import * as React from 'react';
import styled, { type StyledComponent } from 'styled-components';

import colors from '../../../utils/colors';

type Props = {|
  +avatarSize?: number,
  +max: number,
  +children: any,
|};

const DEFAULT_AVATAR_SIZE = 45;

const UserAvatarListWrapper: StyledComponent<{}, {}, HTMLDivElement> = styled.div`
  display: flex;
  position: relative;
`;

const AvatarWrapper = styled.div`
  z-index: ${props => props.max - props.index};

  img,
  svg {
    margin-right: 0;
    border: 2px solid white;
  }

  &:not(:first-child) {
    margin-left: -10px;
  }
`;

const AvatarDefaultButton = styled.button`
  outline: none;
  border: none;
  background: none;
  padding: 0;
  color: ${colors.darkGray} !important;
  background-color: ${colors.borderColor} !important;
  height: ${({ avatarSize }) => avatarSize || DEFAULT_AVATAR_SIZE}px;
  width: ${({ avatarSize }) => avatarSize || DEFAULT_AVATAR_SIZE}px;
  border-radius: 50%;
`;

const UserAvatarList = (props: Props) => {
  const { max, children, avatarSize } = props;

  return (
    <UserAvatarListWrapper>
      {children.slice(0, max).map((child, index) => (
        <AvatarWrapper max={max} index={index} key={index}>
          {child}
        </AvatarWrapper>
      ))}
      {children.length > max && (
        <AvatarWrapper index={max} max={max}>
          <AvatarDefaultButton
            avatarSize={avatarSize}
            bsStyle="link"
            id="show-all"
            className="more__link text-center">
            {`+${children.length - max >= 100 ? '99' : children.length - max}`}
          </AvatarDefaultButton>
        </AvatarWrapper>
      )}
    </UserAvatarListWrapper>
  );
};

UserAvatarList.defaultProps = {
  max: 5,
};

export default UserAvatarList;