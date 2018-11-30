// @flow
import React from 'react';
import { Provider } from 'react-redux';
import ReactOnRails from 'react-on-rails';
import { IntlProvider } from 'react-intl-redux';
import ProjectDistrictPage from '../components/ProjectDistrict/ProjectDistrictPage';

export default (props: Object) => (
  <Provider store={ReactOnRails.getStore('appStore')}>
    <IntlProvider>
      <ProjectDistrictPage {...props} />
    </IntlProvider>
  </Provider>
);
