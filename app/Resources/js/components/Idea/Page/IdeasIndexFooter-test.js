/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import { IdeasIndexFooter } from './IdeasIndexFooter';

const props = {
  trashUrl: 'trash.html',
  countTrashed: 5,
};

const featuresIdeaTrashEnabled = {
  idea_trash: true,
};

const featuresIdeaTrashDisabled = {
  idea_trash: false,
};

describe('<IdeasIndexFooter />', () => {
  it('it should render nothing when idea trash feature is not enabled', () => {
    const wrapper = shallow(
      <IdeasIndexFooter features={featuresIdeaTrashDisabled} {...props} />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('it should render ideas index footer when trash url is provided and ideas trash feature is enabled', () => {
    const wrapper = shallow(
      <IdeasIndexFooter features={featuresIdeaTrashEnabled} {...props} />,
    );
    expect(wrapper.find('.appendices__container')).toHaveLength(1);
    expect(wrapper.find('Row')).toHaveLength(1);
    expect(wrapper.find('Col')).toHaveLength(1);
    expect(wrapper.find('.appendices__item')).toHaveLength(1);
    expect(wrapper.find('#ideas-trash')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
