/* eslint-env mocha */
/* eslint no-unused-expressions:0 */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import IdeaEditModal from './IdeaEditModal';
import IntlData from '../../../translations/FR';

const props = {
  idea: {},
  themes: [],
  show: true,
  onToggleModal: () => {},
};

describe('<IdeaEditModal />', () => {
  it('should render a modal with an idea form', () => {
    const wrapper = shallow(<IdeaEditModal {...props} {...IntlData} />);
    const modal = wrapper.find('Modal');
    expect(modal).to.have.length(1);
    const form = modal.find('Connect(IdeaEditForm)');
    expect(form).to.have.length(1);
    expect(form.prop('isSubmitting')).to.equal(wrapper.state('isSubmitting'));
    expect(form.prop('onSubmitSuccess')).to.be.a('function');
    expect(form.prop('onValidationFailure')).to.be.a('function');
    expect(form.prop('onSubmitFailure')).to.be.a('function');
    expect(form.prop('idea')).to.equal(props.idea);
  });
});
