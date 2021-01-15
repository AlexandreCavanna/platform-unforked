// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DropdownButton } from 'react-bootstrap';
import SocialIcon from '../Icons/SocialIcon';
import { ICON_NAME } from '../Icons/Icon';
import type { BsSize } from '~/types/ReactBootstrap.type';

type Props = {|
  id: string,
  children: any,
  bsSize?: BsSize,
  className: string,
  outline?: boolean,
  grey?: boolean,
  margin: string,
  onClick?: Function,
  disabled?: boolean,
|};

const ShareButton = ({
  id,
  children,
  bsSize,
  className,
  outline,
  grey,
  margin,
  onClick,
  disabled,
}: Props) => {
  const greyClass = grey ? 'btn-dark-gray' : '';
  const outlineClass = outline ? 'btn--outline' : '';

  return (
    <div className={`share-button-dropdown ${margin}`}>
      <DropdownButton
        id={id}
        key={id}
        className={`dropdown--custom ${className} ${greyClass} ${outlineClass}`}
        onClick={onClick}
        bsSize={bsSize}
        disabled={disabled}
        title={
          <span>
            <SocialIcon name={ICON_NAME.share} size={bsSize === 'xs' ? 12 : 16} />{' '}
            {<FormattedMessage id="global.share" />}
          </span>
        }>
        {children}
      </DropdownButton>
    </div>
  );
};

ShareButton.defaultProps = {
  className: '',
  margin: '',
  onClick: () => {},
};

export default ShareButton;
