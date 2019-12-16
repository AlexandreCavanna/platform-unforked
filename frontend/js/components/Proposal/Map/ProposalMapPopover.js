// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled, { type StyledComponent } from 'styled-components';
import moment from 'moment';
import { FormattedDate } from 'react-intl';
import { createFragmentContainer, graphql } from 'react-relay';
import type { State, FeatureToggles } from '../../../types';
import type { ProposalMapPopover_proposal } from '~relay/ProposalMapPopover_proposal.graphql';

import UserAvatar from '../../User/UserAvatar';
import UserLink from '../../User/UserLink';

type Props = {|
  proposal: ProposalMapPopover_proposal,
  features: FeatureToggles,
|};

export const PopoverContainer: StyledComponent<{}, {}, HTMLDivElement> = styled.div`
  margin: 20px 15px;
`;

export const AuthorContainer: StyledComponent<{}, {}, HTMLDivElement> = styled.div`
  margin-bottom: 10px;
  padding-bottom: 19px;
  border-bottom: 1px solid #ddd;
  a {
    font-size: 16px;
  }
  span {
    color: #707070;
    font-size: 16px;
  }
  div {
    span {
      font-size: 14px;
    }
  }
`;

export const TitleContainer: StyledComponent<{}, {}, HTMLDivElement> = styled.div`
  font-size: 16px;
`;

export const PopoverCover: StyledComponent<{}, {}, HTMLImageElement> = styled.img`
  height: 83px;
  border-radius: 4px 4px 0px 0px;
  width: 262px;
  margin: -1px;
  object-fit: cover;
`;

export const ProposalMapPopover = ({ proposal, features }: Props) => (
  <>
    {features.display_pictures_in_depository_proposals_list && (
      <PopoverCover
        src={proposal.media ? proposal.media.url : '/svg/preview-proposal-image.svg'}
        alt="proposal-illustration"
      />
    )}
    <PopoverContainer>
      <AuthorContainer>
        <UserAvatar className="pull-left" user={proposal.author} />
        <UserLink user={proposal.author} />
        <div>
          <FormattedDate
            value={moment(proposal.publishedAt)}
            day="numeric"
            month="long"
            year="numeric"
          />
        </div>
      </AuthorContainer>
      <TitleContainer>
        <a href={proposal.url}>{proposal.title}</a>
      </TitleContainer>
    </PopoverContainer>
  </>
);

const mapStateToProps = (state: State) => ({
  features: state.default.features,
});

export default createFragmentContainer(connect(mapStateToProps)(ProposalMapPopover), {
  proposal: graphql`
    fragment ProposalMapPopover_proposal on Proposal {
      title
      url
      media {
        url
      }
      publishedAt
      author {
        ...UserAvatar_user
        ...UserLink_user
      }
    }
  `,
});