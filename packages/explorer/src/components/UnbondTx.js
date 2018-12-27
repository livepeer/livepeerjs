import * as React from 'react'
import { Button, Tooltip } from './index'
import { formatBalance, formatRoundsToDate } from '../utils'
const UnbondTxComponent = ({
  amount,
  currentRound,
  withdrawRound,
  history,
  accountId,
  id,
}) => {
  const goTo = hash => e => {
    e.preventDefault()
    history.push({ hash, state: { accountId } })
  }

  return (
    <div
      style={{
        display: 'flex',
        margin: 0,
        paddingLeft: 20,
        textAlign: 'left',
        minWidth: '100%',
        justifyContent: 'flex-start',
        flexFlow: 'row wrap',
      }}
    >
      <div
        style={{
          textAlign: 'left',
          minWidth: '60%',
          justifyContent: 'flex-start',
        }}
      >
        {withdrawRound <= currentRound ? (
          <h3>
            <strong>{formatBalance(amount)} LPT</strong> <br />{' '}
            <span style={{ fontSize: 12, marginTop: '-10px' }}>
              The unbonding period has completed and you can withdraw your LPT.
            </span>
          </h3>
        ) : (
          <h3>
            <strong>{formatBalance(amount)} LPT</strong> <br />{' '}
            <span style={{ fontSize: 12, marginTop: '-10px' }}>
              You will be able to unbond approximately on{' '}
              {formatRoundsToDate(withdrawRound - currentRound)}
            </span>
          </h3>
        )}
      </div>
      <div
        style={{
          minWidth: '40%',
          justifyContent: 'flex-start',
        }}
      >
        {withdrawRound <= currentRound ? (
          <Tooltip text="You can withdraw now">
            <Button onClick={goTo(`#/withdraw/${id}`)}>Withdraw</Button>
          </Tooltip>
        ) : (
          <Tooltip
            text={`The unbonding period is 7 days. You will be 
                          able to withdraw on ${formatRoundsToDate(
                            withdrawRound - currentRound,
                          )}`}
          >
            <span>
              <Button className="disabled">Withdraw</Button>
            </span>
          </Tooltip>
        )}

        <Button className="bond-token primary" onClick={goTo(`#/rebond/${id}`)}>
          <span>rebond</span>
          <span style={{ marginLeft: 8 }}>&rarr;</span>
        </Button>
      </div>
    </div>
  )
}

export default UnbondTxComponent
