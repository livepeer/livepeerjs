import { useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'
import { initTransaction } from '../../lib/utils'

const Index = ({ unbondingLockId }) => {
  const context = useWeb3React()
  const client = useApolloClient()

  if (!context.active) {
    return null
  }

  const { withdrawStake }: any = useContext(MutationsContext)

  return (
    <>
      <Button
        onClick={() => {
          initTransaction(client, async () => {
            await withdrawStake({
              variables: {
                unbondingLockId,
              },
            })
          })
        }}
        sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}
      >
        Withdraw
      </Button>
    </>
  )
}

export default Index
