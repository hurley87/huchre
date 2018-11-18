import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class NewGame extends React.Component {
  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        score: {
          required: true,
        },
      },
      messages: {
        score: {
          required: 'Need a score in here, Seuss.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingGame = this.props.doc && this.props.doc._id;
    const score = parseInt(this.score.value);
    const doc = {
      score,
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
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <ControlLabel>What score would you like to play up to?</ControlLabel>
          <input
            type="number"
            className="form-control"
            name="score"
            ref={score => (this.score = score)}
            defaultValue={doc && doc.score}
          />
        </FormGroup>
        <Button type="submit" bsStyle="success">
          New Game
        </Button>
      </form>
    );
  }
}

NewGame.defaultProps = {
  doc: { score: 100 },
};

NewGame.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default NewGame;
