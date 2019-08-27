/* eslint-env jest */
/* @flow */
import React from 'react';
import { shallow } from 'enzyme';
import { ChangePasswordForm } from './ChangePasswordForm';
import { intlMock, formMock } from '../../../mocks';
import { features } from '../../../redux/modules/default';

describe('<ChangePasswordForm />', () => {
  const props = {
    features,
    ...formMock,
    intl: intlMock,
  };

  it('should render', () => {
    const wrapper = shallow(<ChangePasswordForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
