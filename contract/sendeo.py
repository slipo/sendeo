from boa.blockchain.vm.Neo.Runtime import Notify, GetTrigger, CheckWitness
from boa.blockchain.vm.Neo.TriggerType import Application, Verification
from boa.blockchain.vm.Neo.Transaction import *
from boa.blockchain.vm.Neo.Blockchain import GetHeight, GetHeader
from boa.blockchain.vm.System.ExecutionEngine import GetScriptContainer, GetExecutingScriptHash
from boa.blockchain.vm.Neo.Output import GetScriptHash, GetValue, GetAssetId
from boa.blockchain.vm.Neo.Attribute import GetData, GetUsage
from boa.blockchain.vm.Neo.Storage import GetContext, Get, Put, Delete
from boa.blockchain.vm.Neo.Header import GetTimestamp, GetNextConsensus
from boa.blockchain.vm.Neo.Input import GetIndex

from .common.serialization import *

def Main(operation, args):
    trigger = GetTrigger()

    if trigger == Verification():
        # Verification is done when sending money out of the contract.
        #
        # We need to check the sender's balance to make sure they have enough to allow them
        # to send what they're trying to send
        #
        # Note: Contract owner has no special privileges here.

        tx = GetScriptContainer()

        valid = False

        # CheckWitness here just to be sure.
        for input in tx.Inputs:
            hash = InputGetHash(input)
            context = GetContext()
            tx_info_serialized = Get(context, hash)
            tx_info = deserialize_bytearray(tx_info_serialized)

            escrow = tx_info[0]
            sender = tx_info[1]
            time = tx_info[2]

            is_escrow = CheckWitness(escrow)

            if is_escrow != True:
                is_sender = CheckWitness(sender)

                if is_sender != True:
                    return False

                current_time = GetCurrentTimestamp()
                two_minutes = 60 * 2
                minimum_time = time + two_minutes
                if current_time < minimum_time:
                    return False

            # We have a least one. We'll keep checking if there are more.
            print('That input was valid')
            valid = True

        # Go through all the outputs and make sure none are coming to the contract
        # This would indicate change, which we don't support. Only full withdrawals are supported.
        contract_script_hash = GetExecutingScriptHash()
        for output in tx.Outputs:
            shash = GetScriptHash(output)
            if shash == contract_script_hash:
                return False

        print('All good')
        return valid

    elif trigger == Application():
        if operation == 'name':
            n = "Sendeo"
            return n

        elif operation == 'deposit':
            if len(args) != 2:
                return False

            recipient = args[0]
            note = args[1]

            deposit = Deposit(recipient, note)

            return deposit

    return False

def Deposit(escrow_script_hash, note):
    """
    Put money into the contract and set the transactions vins to be owned by escrow_script_hash

    :param escrow_script_hash: the script hash who will be able to move these funds out
    :type escrow_script_hash: bytearray

    :param note: a note for the recipient (escrow_script_hash)
    :type note: strung

    :return: True if the deposit was successful, otherwise, false.
    :rtype: bool

    """

    # Get the transaction info.
    tx = GetScriptContainer()

    # Check if the transactions has currency attached
    references = tx.References
    if len(references) < 1:
        return False

    # Sender's script hash. We'll also grant them ownership of the funds if they need to retrieve their money
    # before it's claimed or if it will never be claimed.
    reference = references[0]
    sender = GetScriptHash(reference)

    # This is the contract's address
    contract_script_hash = GetExecutingScriptHash()

    context = GetContext()

    deposited = False

    # Go through all the outputs and handle deposits
    for output in tx.Outputs:
        shash = GetScriptHash(output)
        output_asset_id = GetAssetId(output)

        # We only care about NEO/GAS coming to the contract.
        if shash == contract_script_hash:
            output_val = GetValue(output)

            deposited = True

            # Update our total counter for this asset. This is just for fun display purposes
            total_all_time_key = concat("totalAllTime", output_asset_id)
            total_all_time = Get(context, total_all_time_key)
            new_total_all_time = total_all_time + output_val
            Put(context, total_all_time_key, new_total_all_time)

    # Here we keep a record of all the tx hashes belonging to the sender and recipient.
    # The idea is that they can view a list of these transactions.
    #
    # Also, the sender can rescind any that was still idle after a week (Mom didn't care enough to pick up
    # her GAS)
    if deposited:
        tx_hash = GetHash(tx)
        time = GetCurrentTimestamp()
        tx_info = [escrow_script_hash, sender, time, note]
        tx_info_serialized = serialize_array(tx_info)
        Put(context, tx_hash, tx_info_serialized)

        AddTransactionToScriptHash('recipient_history', escrow_script_hash, tx_hash)
        AddTransactionToScriptHash('sender_history', sender, tx_hash)

        return True

    return False

def AddTransactionToScriptHash(key_prefix, script_hash, tx_hash):
    """
    This adds to script hash's list of transactions to which they have access.

    :param key_prefix: either recipient_history or sender_history. We maintain two lists for slight
    different functionality.

    :param script_hash: the script hash whose list were adding the transaction to.
    :type script_hash: bytearray

    :return: an array of the transactions, updated.
    :rtype: array

    """
    context = GetContext()
    key = concat(key_prefix, script_hash)
    tx_hashes_serialized = Get(context, key)

    if tx_hashes_serialized:
        tx_hashes = deserialize_bytearray(tx_hashes_serialized)
        tx_hashes.append(tx_hash)
    else:
        tx_hashes = [tx_hash]

    tx_hashes_to_save_serialized = serialize_array(tx_hashes)

    Put(context, key, tx_hashes_to_save_serialized)

    return tx_hashes

def GetCurrentTimestamp():
    """
    Get the current timestamp from the block's info

    :return: Unix timestamp.
    :rtype: int

    """
    currentHeight = GetHeight()
    currentBlock = GetHeader(currentHeight)
    time = currentBlock.Timestamp
    return time

# Workaround. Details here:
# https://github.com/CityOfZion/neo-boa/issues/38
def InputGetHash(i):
    return False
