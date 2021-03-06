import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class NewGame extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        limit: {
          required: true,
        },
      },
      messages: {
        limit: {
          required: 'Need a limit in here, Seuss.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingGame = this.props.doc && this.props.doc._id;
    const limit = parseInt(this.limit.value);
    const doc = {
      limit,
    };

    if (existingGame) doc._id = existingGame;

    Meteor.call('games.insert', doc, (error, gameId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.form.reset();
        Bert.alert('Game added!', 'success');
        history.push(`/games`);
      }
    });
  }

  render() {
    const { doc } = this.props;
    return (
      <Row>
        <Col xs={12} sm={4}>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            <FormGroup>
              <ControlLabel>How many points would you like to play up to?</ControlLabel>
              <input
                type="number"
                className="form-control"
                name="limit"
                ref={limit => (this.limit = limit)}
                defaultValue={doc && doc.limit}
              />
            </FormGroup>
            <Button className="button" type="submit" bsStyle="success">
              Create Game
        </Button>
          </form>
        </Col>
      </Row>
    );
  }
}

NewGame.defaultProps = {
  doc: { limit: 10 },
};

NewGame.propTypes = {
  doc: PropTypes.object,
};

export default NewGame;
