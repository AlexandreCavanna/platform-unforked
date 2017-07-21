// @flow
/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import { RegistrationAdminPage } from './RegistrationAdminPage';
import IntlData from '../../translations/FR';

describe('<RegistrationAdminPage />', () => {
  const props = {
    ...IntlData,
    isSuperAdmin: true,
    features: {},
    onToggle: jest.fn(),
    reorder: jest.fn(),
    addNewField: jest.fn(),
    dynamicFields: [],
  };

  it('renders correctly', () => {
    const wrapper = shallow(<RegistrationAdminPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when not super admin', () => {
    const wrapper = shallow(<RegistrationAdminPage {...props} isSuperAdmin={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});
