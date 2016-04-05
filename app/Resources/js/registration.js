import ReactOnRails from 'react-on-rails';
import ProjectsListApp from './startup/ProjectsListAppClient';
import CollectStepPageApp from './startup/CollectStepPageApp';
import SelectionStepPageApp from './startup/SelectionStepPageApp';
import NavbarRight from './components/Navbar/NavbarRight';
import EmailNotConfirmedAlert from './components/User/EmailNotConfirmedAlert';

import configureStore from '../js/stores/AppStore';
const appStore = configureStore;

const register = ReactOnRails.register;
const registerStore = ReactOnRails.registerStore;

registerStore({ appStore });
register({ ProjectsListApp });
register({ CollectStepPageApp });
register({ SelectionStepPageApp });
register({ NavbarRight });
register({ EmailNotConfirmedAlert });
