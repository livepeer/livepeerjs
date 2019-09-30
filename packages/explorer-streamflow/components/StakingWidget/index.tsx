/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import React, { useState } from 'react'
import Header from './Header'
import Input from './Input'
import ProjectionBox from './ProjectionBox'
import Help from '../../static/img/help.svg'
import Footer from './Footer'
import { Tabs, TabList, Tab } from './Tabs'
import { Account, Transcoder, Protocol } from '../../@types'
import Banner from '../Banner'
import Approve from '../Approve'
import Button from '../Button'
import Modal from '../Modal'

interface Props {
  transcoder: Transcoder
  protocol: Protocol
  account: Account
}

export default ({ account, transcoder, protocol }: Props) => {
  const [amount, setAmount] = useState('0')
  const [action, setAction] = useState('stake')
  const [open, setModalOpen] = useState(false)

  return (
    <div>
      {account && parseInt(account.tokenBalance) == 0 && (
        <>
          <Banner
            label={
              <div>
                Acquire Livepeer tokens for staking.
                <Help
                  sx={{
                    position: 'relative',
                    ml: 1,
                    top: '2px',
                    width: 12,
                    height: 12,
                  }}
                />
              </div>
            }
            button={<Button onClick={() => setModalOpen(true)}>Acquire</Button>}
          />
          <Modal isOpen={open} setOpen={setModalOpen}>
            <iframe
              sx={{ bg: '#323639', width: '100%', height: '100%', border: '0' }}
              src="https://uniswap.exchange/swap/0x58b6a8a3302369daec383334672404ee733ab239"
            />
          </Modal>
        </>
      )}
      {account &&
        parseInt(account.allowance) == 0 &&
        parseInt(account.tokenBalance) != 0 && (
          <Banner
            label={
              <div>
                Approve Livepeer tokens for staking.
                <Help
                  sx={{
                    position: 'relative',
                    ml: 1,
                    top: '2px',
                    width: 12,
                    height: 12,
                  }}
                />
              </div>
            }
            button={<Approve>Approve</Approve>}
          />
        )}
      <Box
        sx={{
          width: '100%',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: 5,
          backgroundColor: 'surface',
        }}
      >
        <Header transcoder={transcoder} />
        <div sx={{ p: 2 }}>
          <Tabs
            onChange={(index: number) => setAction(index ? 'unstake' : 'stake')}
          >
            <TabList>
              <Tab>Stake</Tab>
              <Tab>Unstake</Tab>
            </TabList>
          </Tabs>
          <Input
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value)
            }
            protocol={protocol}
          />
          <ProjectionBox action={action} />
          <Footer
            account={account}
            transcoder={transcoder}
            action={action}
            amount={amount}
          />
        </div>
      </Box>
    </div>
  )
}
