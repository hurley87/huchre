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
        text: {
          required: true,
        },
      },
      messages: {
        text: {
          required: 'Need a text in here, Seuss.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const gameId = this.props.gameId;
    const text = this.text.value;
    console.log(gameId);
    const doc = {
      gameId,
      text,
      playerId: Meteor.userId(),
    };
    console.log(doc);
    Meteor.call('messages.insert', doc, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.form.reset();
        console.log('awesome');
      }
    });
  }

  render() {
    const { doc } = this.props;
    return (
      <form className='chatForm' ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <FormGroup>
          <input
            type="text"
            className="form-control"
            name="text"
            ref={text => (this.text = text)}
          />
        <Button className="submitbutton" type="submit" bsStyle="success">
          Send
        </Button>
        </FormGroup>
      </form>
    );
  }
}
export default NewGame;
