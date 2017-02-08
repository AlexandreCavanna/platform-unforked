// @flow
/* eslint-env jest */
import {
  reducer,
  cancelEmailChangeSucceed,
  startSubmittingAccountForm,
  stopSubmittingAccountForm,
  userRequestEmailChange,
  closeConfirmPasswordModal,
  confirmPassword,
  submitConfirmPasswordFormSucceed,
} from './user';
import type { State } from './user';

const initialState : State = {
  isSubmittingAccountForm: false,
  confirmationEmailResent: false,
  showConfirmPasswordModal: false,
  user: null,
};

describe('User Reducer', () => {
  it('Should handle CANCEL_EMAIL_CHANGE', () => {
    const newState = reducer(initialState, cancelEmailChangeSucceed());
    expect(newState).toMatchSnapshot();
  });
  it('Should handle SUBMIT_ACCOUNT_FORM', () => {
    const newState = reducer({ ...initialState, isSubmittingAccountForm: false }, startSubmittingAccountForm());
    expect(newState).toMatchSnapshot();
  });
  it('Should handle STOP_SUBMIT_ACCOUNT_FORM', () => {
    const newState = reducer({ ...initialState, isSubmittingAccountForm: true }, stopSubmittingAccountForm());
    expect(newState).toMatchSnapshot();
  });
  it('Should handle USER_REQUEST_EMAIL_CHANGE', () => {
    const newState = reducer(initialState, userRequestEmailChange('popo@gmail.com'));
    expect(newState).toMatchSnapshot();
  });
  it('Should handle SUBMIT_CONFIRM_PASSWORD_FORM', () => {
    const newState = reducer(initialState, submitConfirmPasswordFormSucceed('qsijdoqsu&éç&'));
    expect(newState).toMatchSnapshot();
  });
  it('Should handle SHOW_CONFIRM_PASSWORD_MODAL', () => {
    const newState = reducer({ ...initialState, showConfirmPasswordModal: false }, confirmPassword());
    expect(newState).toMatchSnapshot();
  });
  it('Should handle CLOSE_CONFIRM_PASSWORD_MODAL', () => {
    const newState = reducer({ ...initialState, showConfirmPasswordModal: true }, closeConfirmPasswordModal());
    expect(newState).toMatchSnapshot();
  });
});
