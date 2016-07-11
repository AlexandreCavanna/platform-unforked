/* eslint-env mocha */
/* eslint no-unused-expressions:0 */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ProposalPageHeader from './ProposalPageHeader';
import IntlData from '../../../translations/FR';

describe('<ProposalPageHeader />', () => {

  const proposal = {
    theme: {
      title: 'Titre du thème',
    },
    title: 'Titre',
    author: {},
  };

  const proposalWithoutTheme = {
    title: 'Titre',
    author: {},
  };

  const props = {
    userHasVote: false,
    onVote: () => {},
  };

  it('should render a proposal header', () => {
    const wrapper = shallow(<ProposalPageHeader proposal={proposal} showThemes={true} {...props} {...IntlData} />);
    const mainDiv = wrapper.find('div.proposal__header');
    expect(mainDiv).to.have.length(1);
    const theme = mainDiv.children().find('p').first();
    expect(theme.prop('className')).to.equal('excerpt');
    expect(theme.text()).to.equal('Titre du thème');
    const title = mainDiv.find('h1');
    expect(title).to.have.length(1);
    expect(title.prop('className')).to.equal('consultation__header__title h1');
    expect(title.text()).to.equal(proposal.title);
    const mediaDiv = mainDiv.find('div.media');
    expect(mediaDiv).to.have.length(1);
    const avatar = mediaDiv.find('UserAvatar');
    expect(avatar.prop('className')).to.equal('pull-left');
    expect(avatar.prop('user')).to.equal(proposal.author);
    const mediaBody = mediaDiv.find('div.media-body');
    expect(mediaBody).to.have.length(1);
    const par = mediaBody.find('p.media--aligned.excerpt');
    expect(par).to.have.length(1);
    const proposalVoteWrapper = par.find('Connect(ProposalVoteButtonWrapper)');
    expect(proposalVoteWrapper).to.have.length(1);
    expect(proposalVoteWrapper.prop('selectionStep')).to.equal(null);
    expect(proposalVoteWrapper.prop('proposal')).to.equal(proposal);
    expect(proposalVoteWrapper.prop('creditsLeft')).to.equal(null);
    expect(proposalVoteWrapper.prop('userHasVote')).to.equal(props.userHasVote);
    expect(proposalVoteWrapper.prop('onClick')).to.equal(props.onVote);
    expect(proposalVoteWrapper.prop('className')).to.equal('visible-xs pull-right');
  });

  it('should not render theme if proposal has none', () => {
    const wrapper = shallow(<ProposalPageHeader proposal={proposalWithoutTheme} showThemes={true} {...props} {...IntlData} />);
    const mainDiv = wrapper.find('div.proposal__header');
    const theme = mainDiv.find('p');
    expect(theme).to.have.length(1);
  });

  it('should not render theme if specified not to', () => {
    const wrapper = shallow(<ProposalPageHeader proposal={proposal} showThemes={false} {...props} {...IntlData} />);
    const mainDiv = wrapper.find('div.proposal__header');
    const theme = mainDiv.find('p');
    expect(theme).to.have.length(1);
  });

  it('should render a div with specified classes', () => {
    const wrapper = shallow(<ProposalPageHeader proposal={proposal} showThemes={true} className="css-class" {...props} {...IntlData} />);
    const mainDiv = wrapper.find('div.proposal__header.css-class');
    expect(mainDiv).to.have.length(1);
  });
});
