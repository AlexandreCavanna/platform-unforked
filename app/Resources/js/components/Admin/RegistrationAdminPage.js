// @flow
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { IntlMixin } from 'react-intl';
import { Col, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import Toggle from 'react-toggle';
import { toggleFeature, showNewFieldModal, deleteRegistrationField } from '../../redux/modules/default';
import type { State, Dispatch } from '../../types';
import RegistrationCommunicationForm from './RegistrationCommunicationForm';

export const RegistrationAdminPage = React.createClass({
  propTypes: {
    features: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
    addNewField: PropTypes.func.isRequired,
    deleteField: PropTypes.func.isRequired,
    dynamicFields: PropTypes.array.isRequired,
  },
  mixins: [IntlMixin],

  render() {
    const { onToggle, deleteField, addNewField, features, dynamicFields } = this.props;
    return (
      <div style={{ margin: '0 15px' }}>
        <h2>Réseaux sociaux</h2>
        <p>Permettre l'inscription via:</p>
        <div className="row" style={{ padding: '10px 0' }}>
          <Col xs={1}>
            <Toggle
              checked={features.login_facebook}
              onChange={() => onToggle('login_facebook', !features.login_facebook)}
            />
          </Col>
          <Col xs={11}>Facebook</Col>
        </div>
        <div className="row" style={{ padding: '10px 0' }}>
          <Col xs={1}>
            <Toggle
              checked={features.login_gplus}
              onChange={() => onToggle('login_gplus', !features.login_gplus)}
            />
          </Col>
          <Col xs={11}>Google</Col>
        </div>
        <h2>Données recueillies</h2>
        <p>Receuillir les données suivantes auprès de l'utilisateur:</p>
        <div className="row" style={{ padding: '10px 0' }}>
          <Col xs={1}>
            <Toggle checked disabled />
          </Col>
          <Col xs={11}>Nom ou pseudonyme</Col>
        </div>
        <div className="row" style={{ padding: '10px 0' }}>
          <Col xs={1}>
            <Toggle checked disabled />
          </Col>
          <Col xs={11}>Mot de passe</Col>
        </div>
        <div className="row" style={{ padding: '10px 0' }}>
          <Col xs={1}>
            <Toggle
              checked={features.zipcode_at_register}
              onChange={() => onToggle('zipcode_at_register', !features.zipcode_at_register)}
            />
          </Col>
          <Col xs={11}>Code postal</Col>
        </div>
        <div className="row" style={{ padding: '10px 0' }}>
          <Col xs={1}>
            <Toggle
              checked={features.user_type}
              onChange={() => onToggle('user_type', !features.user_type)}
            />
          </Col>
          <Col xs={11}>Statut</Col>
        </div>
        <p style={{ marginTop: 10 }}>
          <strong>Champ(s) supplémentaire(s)</strong>
        </p>
        {
          dynamicFields.length > 0 &&
            <ListGroup>
              {
                dynamicFields.map(field =>
                  <ListGroupItem>
                    <Button
                      className="pull-right"
                      onClick={() => deleteField(field.id)}
                    >
                      Supprimer
                    </Button>
                    <div>
                      <strong>{field.question}</strong>
                    </div>
                    <span>{field.type}</span>
                  </ListGroupItem>,
                )
              }
            </ListGroup>
        }
        <Button style={{ marginBottom: 10 }} onClick={() => addNewField()}>
          Ajouter
        </Button>
        <div className="row" style={{ padding: '10px 0' }}>
          <Col xs={1}><Toggle checked disabled /></Col>
          <Col xs={11}>Je ne suis pas un robot</Col>
        </div>
        <h2>Communication</h2>
        <RegistrationCommunicationForm />
      </div>
    );
  },

});

const mapStateToProps = (state: State) => ({
  features: state.default.features,
  dynamicFields: state.user.registration_form.questions,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  onToggle: (feature, value) => {
    toggleFeature(dispatch, feature, value);
  },
  addNewField: () => dispatch(showNewFieldModal()),
  deleteField: (id) => {
    deleteRegistrationField(id, dispatch);
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(RegistrationAdminPage);
