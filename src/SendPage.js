import React, { Component } from 'react';
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Grid,
  HelpBlock
} from 'react-bootstrap';
import Neon, { api, sc, sb, core, rpc, wallet, u, tx } from '@cityofzion/neon-js';

import './SendPage.css';

class SendPage extends Component {
	constructor(props) {
		super(props);

    this.isValidAmountToSend = this.isValidAmountToSend.bind(this);
    this.handleChangeToAmount = this.handleChangeToAmount.bind(this);
    this.setAssetType = this.setAssetType.bind(this);
    this.initiateDeposit = this.initiateDeposit.bind(this);

		this.state = {
      amountToSend: 1,
      amountToSendIsValid: true,
      typeOfAsset: 'NEO',
      neoLinkConnected: false,
      net: 'http://35.192.230.39:5000/',
      contractScriptHash: '77730992315f984e7a3cf281c001e2c34b6d4982',
      sourcePrivateKey: 'L2idY1t6QzBxMQGag2BfyfBCzUxwUf33Dhj458Et8PQWUT7XMZpA'
		};
  }

  setAssetType(asset) {
    this.setState({typeOfAsset: asset});
  }

  isInt(value) {
    var x;
    if (isNaN(value)) {
      return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
  }

  isValidAmountToSend() {
    const amountToSend = this.state.amountToSend;
		if (this.state.typeOfAsset === 'GAS' && (amountToSend == 0 || !(!isNaN(parseFloat(amountToSend)) && isFinite(amountToSend)))) {
      this.state.amountToSendIsValid !== false ? this.setState({amountToSendIsValid: false}) : null;
      return 'error';
    } else if (this.state.typeOfAsset === 'NEO' && !this.isInt(amountToSend)) {
      this.state.amountToSendIsValid !== false ? this.setState({amountToSendIsValid: false}) : null;
      return 'error';
    } else {
      this.state.amountToSendIsValid !== true ? this.setState({amountToSendIsValid: true}) : null;
      return null;
    }
	}

	handleChangeToAmount(e) {
		this.setState({ amountToSend: e.target.value });
  }

  initiateDeposit() {
    const privateKey = Neon.create.privateKey()
    const escrowAccount = new wallet.Account(this.state.privateKey)

    window.postMessage({
      type: "FROM_PAGE",
      text: {
        scriptHash: this.state.contractScriptHash,
        operation: 'deposit',
        arg1: escrowAccount,
        arg2: '',
        assetType: this.state.typeOfAsset,
        assetAmount: this.state.amountToSend
      }
    }, "*");

    // todo: we need to handle success and errors
  }

	render() {
		return (
      <div>
        <h1 className="page-title">Send NEO or GAS</h1>
        <Grid>
          <Col xs={12} md={6}>
            <p className="lead">1. Choose how much you want to send</p>
            <p>more detailed info</p>
            <hr />
            <p className="lead">2. Send using NeoLink</p>
            <p>more detailed info on how to get neolink if not already</p>
            <hr />
            <p className="lead">3. Share the unique URL </p>
            <p>email it etc</p>
            <hr />
            <p className="lead">4. They click the link and tell it where to go!</p>
            <p>give their account address and send and the contract does the rest.</p>
          </Col>
          <Col xs={12} md={6}>
            { !this.state.neoLinkConnected &&
              <Alert bsStyle="warning">
                <strong>Please Unlock NeoLink</strong>
                <p>Once you unlock NeoLink, you will be able to send the transaction through the NEO blckchain.</p>
              </Alert>
            }
            <form>
              <FormGroup
                controlId="formBasicText"
                validationState={this.isValidAmountToSend()}
              >
                <ControlLabel>How much would you like to send?</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.amountToSend}
                  placeholder="Enter text"
                  onChange={this.handleChangeToAmount}
                  bsSize="large"
                />
                <FormControl.Feedback />
                <HelpBlock></HelpBlock>
              </FormGroup>

              <ButtonGroup justified>
                <Button
                  href="#"
                  onClick={() => this.setAssetType('NEO')}
                  active={this.state.typeOfAsset === 'NEO' ? true : false}
                >Send NEO</Button>
                <Button
                  href="#"
                  onClick={() => this.setAssetType('GAS')}
                  active={this.state.typeOfAsset === 'GAS' ? true : false}
                >Send GAS</Button>
              </ButtonGroup>

              <p class="small">By clicking the submit button below, you are acknowledging agreement that you will be
              sending your own assets blah blah blah.</p>

              <Button
                bsStyle="primary"
                bsSize="large"
                block
                disabled={!this.state.amountToSendIsValid || !this.state.neoLinkConnected}
                onClick={() => this.initiateDeposit()}
              >Send Now</Button>
            </form>
          </Col>
        </Grid>
        <pre>
          <code>
            { JSON.stringify(this.state, null, 2) }
          </code>
        </pre>
      </div>
    );
	}
}

export default SendPage;
