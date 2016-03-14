const React = require('react')
const axios = require('axios')
const INVITE_BUTTON  = 'INVITE_BUTTON'
const INVITE_ERROR   = 'INVITE_ERROR'
const INVITE_SUCCESS = 'INVITE_SUCCESS'

const InviteButton = React.createClass({

  propTypes: {
    emailAddress: React.PropTypes.string.isRequired,
    sendState: React.PropTypes.func.isRequired
  },

  postInvite() {
    axios.post('./invite', {
      email: this.props.emailAddress
    }).then(() => {
      this.props.sendState({APP_STATE: INVITE_SUCCESS, error: null})
    }).catch((response) => {
      this.props.sendState({APP_STATE: INVITE_ERROR, error: response.data.msg})
    })
  },

  render() {
    return (
      <div>
        <div className="logos"><div className="logo org"></div><div className="logo slack"></div></div>
        <p>
          Slack is a messaging app for teams. IT Services is using Slack to communicate more effectively between ITS units, within project teams, and directly between colleagues.
          Create a public slack team for your new project, chat privately between your small team, or 1-to-1. Even the CIO uses Slack!
        </p>

        <p>
          Click the button below to join SFU ITS on Slack.
        </p>
        <button
          onClick={this.postInvite}
          style={{
            marginBottom: '50px',
            marginTop: '25px'
          }}
        >
          Join SFU ITS on Slack
        </button>
      </div>
    )
  }
})

const InviteSuccess = ({emailAddress}) => {
  return (
    <div>
      <h2>Invitation Sent</h2>
      <p>
        An invitaiton to join the SFUITS team on Slack has been sent to {emailAddress}.
        Please check your email and follow the instructions in the invitation.
      </p>
      <p>
        Chat with you soon! 🎉
      </p>
    </div>
  )
}

InviteSuccess.propTypes = {
  emailAddress: React.PropTypes.string.isRequired
}

const InviteError = React.createClass({
  propTypes: {
    msg: React.PropTypes.string.isRequired,
    sendState: React.PropTypes.func.isRequired
  },

  tryAgain() {
    this.props.sendState({APP_STATE: INVITE_BUTTON, error: null})
  },

  render() {
    const style = {
      borderLeft: '3px solid #ccc',
      paddingLeft: '15px'
    }

    return (
      <div>
        <h2>Uh-Oh&hellip;</h2>
        <p>
          This is embarrasing, but there was a problem sending you an invitation to Slack. 😢
          Here's what they told us:
        </p>
        <p style={style}><i>{this.props.msg}</i></p>
        <button
          onClick={this.tryAgain}
          style={{
            marginBottom: '50px',
            marginTop: '25px'
          }}
        >
          Try Again?
        </button>

      </div>
    )
  }
})


const App = React.createClass({

  getInitialState() {
    return Object.assign({
      APP_STATE: INVITE_BUTTON,
      error: null
    }, window.__STATE__)
  },

  _receiveState(state) {
    const {APP_STATE, error} = state
    this.setState({
      APP_STATE,
      error
    })
  },

  _renderer() {
    let output
    switch (this.state.APP_STATE) {
      case INVITE_BUTTON:
        output = (
          <InviteButton
            emailAddress={this.state.email}
            sendState={this._receiveState}
          />
        )
        break

      case INVITE_SUCCESS:
        output = (
          <InviteSuccess emailAddress={this.state.email} />
        )
        break

      case INVITE_ERROR:
      output = (
        <InviteError
          msg={this.state.error}
          sendState={this._receiveState}
        />
      )
        break
    }
    return output
  },

  render() {
    return (
      <div>
        {this._renderer()}
      </div>
    )
  }
})

module.exports = App
