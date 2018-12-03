import React from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class InviteFriend extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        emailAddress: {
          required: true,
          email: true,
        },
        password: {
          required: true,
        },
      },
      messages: {
        emailAddress: {
          required: 'Need an email address here.',
          email: 'Is this email address correct?',
        },
        password: {
          required: 'Need a password here.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    Meteor.loginWithPassword(this.emailAddress.value, this.password.value, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Welcome back!', 'success');
      }
    });
  }

  render() { 
    return (
      <div className="InviteFriend">
        <Row>
          <Col xs={12}>
            <h5 className="text-center">Waiting on someone to join your game.</h5>
          {
            // <h4 className="page-header">Invite a Friend</h4>
            // <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            //   <FormGroup>
            //     <ControlLabel>Email Address</ControlLabel>
            //     <input
            //       type="email"
            //       name="emailAddress"
            //       ref={emailAddress => (this.emailAddress = emailAddress)}
            //       className="form-control"
            //     />
            //   </FormGroup>
            //   <Button type="submit" bsStyle="success">Invite a Friend</Button>
            // </form>

            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default InviteFriend;
