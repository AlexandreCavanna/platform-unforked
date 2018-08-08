// @flow
import * as React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { FormattedMessage } from 'react-intl';
import { Overlay, Tooltip } from 'react-bootstrap';
import type { UnpublishedTooltip_publishable } from './__generated__/UnpublishedTooltip_publishable.graphql';

type Props = {
  publishable: UnpublishedTooltip_publishable,
  target: Function,
};

export class UnpublishedTooltip extends React.Component<Props> {
  render() {
    const { publishable, target } = this.props;
    return (
      <Overlay
        show={!publishable.published}
        container={() => document.querySelector('body')}
        target={target}
        placement="top">
        <Tooltip id="UnpublishedTooltip">
          {publishable.notPublishedReason === 'WAITING_AUTHOR_CONFIRMATION' ? (
            <FormattedMessage id="voting-pending-publication" />
          ) : null}
          {publishable.notPublishedReason === 'AUTHOR_NOT_CONFIRMED' ? (
            <FormattedMessage id="unpublished-Vote" />
          ) : null}
          {publishable.notPublishedReason === 'AUTHOR_CONFIRMED_TOO_LATE' ? (
            <FormattedMessage id="unpublished-Vote" />
          ) : null}
        </Tooltip>
      </Overlay>
    );
  }
}

export default createFragmentContainer(UnpublishedTooltip, {
  publishable: graphql`
    fragment UnpublishedTooltip_publishable on Publishable {
      id
      published
      notPublishedReason
    }
  `,
});
