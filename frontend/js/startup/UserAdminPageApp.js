// @flow
import React from 'react';
import { Provider } from 'react-redux';
import ReactOnRails from 'react-on-rails';
import IntlProvider from './IntlProvider';
import { UserAdminPage, type Props } from '../components/User/Admin/UserAdminPage';

export default (props: Props) => (
  <Provider store={ReactOnRails.getStore('appStore')}>
    <IntlProvider>
      <UserAdminPage {...props} />
    </IntlProvider>
  </Provider>
);