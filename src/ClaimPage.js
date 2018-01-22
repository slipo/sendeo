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
      sourcePrivateKey: 'L2idY1t6QzBxMQGag2BfyfBCzUxwUf33Dhj458Et8PQWUT7XMZpA',
      txId: '',
      status: '',
      errorMsg: ''
		};
  }

  handleSubmit = (event) => {
    //this.sendAssets(this.state.destAddr)
    this.sendAssets('AKMPCtNYBVNPMbeZCvJ9Jn4z1bdDcG6KhP')
    event.preventDefault()
  }

  sendAssets = (destAddr) => {
    this.setState({
      txId: '',
      status: 'loading',
      errorMsg: ''
    })

    const { sourcePrivateKey, contractScriptHash, net } = this.props

    console.log('destAddr', destAddr)
    console.log('sourcePrivateKey', sourcePrivateKey)
    console.log('contractScriptHash', contractScriptHash)
    console.log('net', net)

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
    const { status, errorMsg, txId } = this.state
    return (
      <div>
        <form onSubmit={ this.handleSubmit } >
          <label>
            Destination address:
            <input type="text" name="destAddr" />
          </label>
          <input type="submit" value="Send" />
        </form>

        <div>status: { status }</div>
        <div>txId: { txId }</div>
        <div>error message: { errorMsg }</div>
      </div>
    );
  }
}

export default ClaimPage;
