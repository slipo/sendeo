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

import './ClaimPage.css';

class ClaimPage extends Component {
  constructor(props) {
		super(props);

    this.isValidAisValidDestinationAddressddress = this.isValidDestinationAddress.bind(this);
    this.handleChangeToDestinationAddress = this.handleChangeToDestinationAddress.bind(this);
    this.sendAssets = this.sendAssets.bind(this);

		this.state = {
      destinationAddress: '',
      destinationAddressIsValid: false,
      neoLinkConnected: false,
      net: 'http://35.192.230.39:5000/',
      contractScriptHash: '77730992315f984e7a3cf281c001e2c34b6d4982',
      sourcePrivateKey: 'L2idY1t6QzBxMQGag2BfyfBCzUxwUf33Dhj458Et8PQWUT7XMZpA',
      txId: '',
      status: '',
      errorMsg: ''
		};
  }

  isValidDestinationAddress = () => {
    if (this.state.destinationAddress && this.state.destinationAddress.length > 0) {
      this.state.destinationAddressIsValid !== true ? this.setState({ destinationAddressIsValid: true }) : null;
      return true;
    }

    this.state.destinationAddressIsValid !== false ? this.setState({ destinationAddressIsValid: false }) : null;
    return false;
  };

  handleChangeToDestinationAddress = (event) => {
    this.setState({ destinationAddress: event.target.value });
  };

  sendAssets = (destAddr) => {
    destAddr = 'AKMPCtNYBVNPMbeZCvJ9Jn4z1bdDcG6KhP';

    this.setState({
      txId: '',
      status: 'loading',
      errorMsg: ''
    })

    const { sourcePrivateKey, contractScriptHash, net } = this.state

    const sourceAccount = new wallet.Account(sourcePrivateKey)

    const rpcEndpointPromise = api.neonDB.getRPCEndpoint(net)

    const contractAddr = wallet.getAddressFromScriptHash(contractScriptHash)
    const balancePromise = api.neonDB.getBalance(net, contractAddr)

    // todo, transfer all.
    const transferAmount = 0.00001

    // todo, check gas cost?
    const gasCost = 0

    let signedTx
    let endpt
    let balances
    let script

    return Promise.all([rpcEndpointPromise, balancePromise])
      .then((values) => {
        endpt = values[0]
        balances = values[1]

        const query = Neon.create.query({
          'method' : 'getcontractstate',
          'params' : [
            contractScriptHash
          ]
        })

        return query.execute(endpt)
      })
      .then((contractState) => {
        console.log('contractState', contractState)
        script = contractState.result.script

        const intents = [
          {
            assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
            value: transferAmount,
            scriptHash: wallet.getScriptHashFromAddress(destAddr)
          }
        ]

        const invoke = sourceAccount.scriptHash
        const txConfig = {
          type: 128,
          version: 0,
          outputs: intents,
          script: typeof (invoke) === 'string' ? invoke : sc.createScript(invoke),
          gas: gasCost,
          attributes: [
            {
              usage: 32,
              data: u.reverseHex(sourceAccount.scriptHash)
            }
          ],
          privateKey: sourceAccount.privateKey
        }

        const unsignedTx = new tx.Transaction(txConfig).calculate(balances)

        const promise = Promise.resolve(unsignedTx.sign(txConfig.privateKey))
        return promise.then((signedTx) => {
          return Object.assign(txConfig, { tx: signedTx })
        })
      })
      .then((c) => {
        console.log("Config object just before sending", c)
        signedTx = c.tx
        signedTx.scripts.unshift({
          invocationScript: '00' + signedTx.scripts[0].invocationScript,
          verificationScript: script
        })
        return rpc.Query.sendRawTransaction(signedTx).execute(endpt)
      })
      .then((res) => {
        if (res.result === true) {
          this.setState({
            txId: signedTx.hash,
            status: 'success',
            errorMsg: ''
          })
        } else {
          this.setState({
            txId: '',
            status: 'error',
            errorMsg: 'NEO node returned false, but no error message.'
          })
        }
        console.log(res)
        return res
      })
      .catch((e) => {
        this.setState({
          txId: '',
          status: 'error',
          errorMsg: e.message
        })
      })
  }

  render() {
		return (
      <div>
        <h1 className="page-title">Send NEO or GAS</h1>
        <Grid>
          <Col xs={12} md={6}>
            <p className="lead">HEYO! You just received NEO/GAS</p>
            <p>Whoever gave you this link was kind enough to give you XXX NEO/GAS. To collect it is easy...</p>
            <hr />
            <p className="lead">1. Download and Install the NEON Wallet which will store your new tokens.</p>
            <p><a href="http://neonwallet.com/" target="_blank">http://neonwallet.com/</a> has everything you need.</p>
            <hr />
            <p className="lead">2. Open the app and choose to Create a New Wallet</p>
            <p>Follow the instruction on screen. Be sure not to lose stuff.</p>
            <hr />
            <p className="lead">3. Give us your public address and we will send you everything!</p>
            <p></p>
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
                controlId="claimForm"
                validationState={this.isValidDestinationAddress()}
              >
                <ControlLabel>The Public NEO Wallet Address</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.destinationAddress}
                  placeholder=""
                  onChange={this.handleChangeToDestinationAddress}
                  bsSize="large"
                />
                <FormControl.Feedback />
                <HelpBlock></HelpBlock>
              </FormGroup>

              <p class="small">By clicking the submit button below, you are acknowledging agreement that blah blah blah.</p>

              <Button
                bsStyle="primary"
                bsSize="large"
                block
                disabled={!this.state.destinationAddressIsValid || !this.state.neoLinkConnected}
                onClick={() => this.sendAssets()}
              >Claim Your NEO</Button>
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

export default ClaimPage;
