// @flow
import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { ListGroupItem } from 'react-bootstrap';
import { injectIntl, type IntlShape } from 'react-intl';
import OpinionPreview from './OpinionPreview';
import type { OpinionVersion_version } from '~relay/OpinionVersion_version.graphql';
import colors from '../../utils/colors';
import PieChart from '../Ui/Chart/PieChart';

type Props = {
  version: OpinionVersion_version,
  rankingThreshold: ?number,
  intl: IntlShape,
};

class OpinionVersion extends React.Component<Props> {
  render() {
    const { version, rankingThreshold, intl } = this.props;

    const data = [
      { name: intl.formatMessage({ id: 'vote.ok' }), value: version.votesOk.totalCount },
      { name: intl.formatMessage({ id: 'vote.mitige' }), value: version.votesMitige.totalCount },
      { name: intl.formatMessage({ id: 'vote.nok' }), value: version.votesNok.totalCount },
    ];

    return (
      <ListGroupItem
        className={`list-group-item__opinion has-chart${
          version.author && version.author.vip ? ' bg-vip' : ''
        }`}>
        <div className="left-block">
          {/* $FlowFixMe */}
          <OpinionPreview opinion={version} rankingThreshold={rankingThreshold} />
        </div>
        {version.votes && version.votes.totalCount > 0 ? (
          <PieChart data={data} colors={colors.votes} />
        ) : null}
      </ListGroupItem>
    );
  }
}

const container = injectIntl(OpinionVersion);

export default createFragmentContainer(container, {
  version: graphql`
    fragment OpinionVersion_version on Version {
      ...OpinionPreview_opinion
      author {
        vip
      }
      votes(first: 0) {
        totalCount
      }
      votesOk: votes(first: 0, value: YES) {
        totalCount
      }
      votesNok: votes(first: 0, value: NO) {
        totalCount
      }
      votesMitige: votes(first: 0, value: MITIGE) {
        totalCount
      }
    }
  `,
});
