import { Flex, Box } from 'theme-ui'
import Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Spinner from '../../components/Spinner'
import ListItem from '../ListItem'
import Unlink from '../../public/img/unlink.svg'
import Link from '../../public/img/link.svg'
import Claim from '../../public/img/claim.svg'
import LPT from '../../public/img/lpt.svg'
import ETH from '../../public/img/eth.svg'
import Approve from '../../public/img/approve.svg'
import Play from '../../public/img/play.svg'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroll-component'
import historyQuery from '../../queries/historyView.gql'

const Index = () => {
  const router = useRouter()
  const query = router.query
  const account = query.account as string

  const { data, loading, error, fetchMore, stopPolling } = useQuery(
    historyQuery,
    {
      variables: {
        account: account.toLowerCase(),
        first: 10,
        skip: 0,
      },
      ssr: false,
      notifyOnNetworkStatusChange: true,
    },
  )

  if (error) {
    console.error(error)
  }

  if (loading && !data) {
    return (
      <Flex
        sx={{
          pt: 4,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner />
      </Flex>
    )
  }

  if (!data?.transactions?.length) {
    return <div sx={{ pt: 5 }}>No history</div>
  }

  return (
    <InfiniteScroll
      sx={{ overflow: 'hidden !important' }}
      scrollThreshold={0.5}
      dataLength={data && data.transactions.length}
      next={async () => {
        stopPolling()
        if (!loading && data.transactions.length >= 10) {
          try {
            await fetchMore({
              variables: {
                skip: data.transactions.length,
              },
              updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
                if (!fetchMoreResult) {
                  return previousResult
                }
                return {
                  ...previousResult,
                  transactions: [
                    ...previousResult.transactions,
                    ...fetchMoreResult.transactions,
                  ],
                }
              },
            })
          } catch (e) {
            return e
          }
        }
      }}
      hasMore={true}
    >
      <div sx={{ mt: 3, mb: 4, pb: 6, position: 'relative' }}>
        <div sx={{ pb: 2 }}>
          {data.transactions.map((transaction: any, i: number) =>
            renderSwitch(transaction, i),
          )}
        </div>
        {loading && data.transactions.length >= 10 && (
          <Flex
            sx={{
              position: 'absolute',
              transform: 'translateX(-50%)',
              left: '50%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner />
          </Flex>
        )}
      </div>
    </InfiniteScroll>
  )
}

export default Index

function renderSwitch(transaction: any, i: number) {
  switch (transaction.__typename) {
    case 'Approval':
      return (
        <ListItem
          sx={{
            cursor: 'pointer',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          onClick={() =>
            window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')
          }
          key={i}
          avatar={<Approve sx={{ color: 'primary', mr: 2 }} />}
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Approved LPT for Staking</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              <span sx={{ fontFamily: 'monospace' }}>
                {parseFloat(Utils.fromWei(transaction.amount)).toPrecision(3) +
                  ' LPT'}
              </span>
            </div>
          </Flex>
        </ListItem>
      )
    case 'Bond':
      return (
        <ListItem
          onClick={() =>
            window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')
          }
          sx={{
            cursor: 'pointer',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          key={i}
          avatar={<Link sx={{ color: 'primary', mr: 2 }} />}
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>
                Staked towards{' '}
                {transaction.newDelegate.id.replace(
                  transaction.newDelegate.id.slice(7, 37),
                  '…',
                )}
              </Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                +
                {abbreviateNumber(
                  Utils.fromWei(transaction.additionalAmount),
                  3,
                )}
              </span>{' '}
              LPT
            </div>
          </Flex>
        </ListItem>
      )
    case 'EarningsClaimed':
      return (
        <ListItem
          sx={{
            cursor: 'pointer',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          onClick={() =>
            window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')
          }
          key={i}
          avatar={
            <Claim sx={{ width: 16, height: 16, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Claimed Earnings</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ textAlign: 'right', fontSize: 1, ml: 3 }}>
              <Box>
                <span sx={{ fontFamily: 'monospace' }}>
                  {abbreviateNumber(Utils.fromWei(transaction.rewardTokens), 3)}
                </span>{' '}
                LPT
              </Box>
              <Box>
                <span sx={{ fontFamily: 'monospace' }}>
                  {abbreviateNumber(Utils.fromWei(transaction.fees), 3)}
                </span>{' '}
                ETH
              </Box>
            </div>
          </Flex>
        </ListItem>
      )
    case 'InitializeRound':
      return (
        <ListItem
          sx={{
            cursor: 'pointer',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          onClick={() =>
            window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')
          }
          key={i}
          avatar={
            <Play sx={{ width: 20, height: 20, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Initialized round</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              Round #
              <span sx={{ fontFamily: 'monospace' }}>
                {transaction.round.id}
              </span>
            </div>
          </Flex>
        </ListItem>
      )
    case 'Rebond':
      return (
        <ListItem
          sx={{
            cursor: 'pointer',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          onClick={() =>
            window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')
          }
          key={i}
          avatar={<Link sx={{ color: 'primary', mr: 2 }} />}
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>
                Restaked to{' '}
                {transaction.delegate.id.replace(
                  transaction.delegate.id.slice(7, 37),
                  '…',
                )}
              </Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                +{abbreviateNumber(Utils.fromWei(transaction.amount), 3)}
              </span>{' '}
              LPT
            </div>
          </Flex>
        </ListItem>
      )
    case 'Unbond':
      return (
        <ListItem
          sx={{
            cursor: 'pointer',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          onClick={() =>
            window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')
          }
          key={i}
          avatar={<Unlink sx={{ color: 'primary', mr: 2 }} />}
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>
                Unstaked from{' '}
                {transaction.delegate.id.replace(
                  transaction.delegate.id.slice(7, 37),
                  '…',
                )}
              </Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                -{abbreviateNumber(Utils.fromWei(transaction.amount), 3)}
              </span>{' '}
              LPT
            </div>
          </Flex>
        </ListItem>
      )
    case 'Reward':
      return (
        <ListItem
          sx={{
            cursor: 'pointer',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          onClick={() =>
            window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')
          }
          key={i}
          avatar={
            <LPT sx={{ width: 20, height: 20, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Claimed Inflationary Token Reward</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                +{abbreviateNumber(Utils.fromWei(transaction.rewardTokens), 3)}
              </span>{' '}
              LPT
            </div>
          </Flex>
        </ListItem>
      )
    case 'TranscoderUpdated':
      return (
        <ListItem
          sx={{
            cursor: 'pointer',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          onClick={() =>
            window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')
          }
          key={i}
          avatar={
            <LPT sx={{ width: 20, height: 20, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Updated Orchestrator Cut</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ textAlign: 'right', fontSize: 1, ml: 3 }}>
              <Box>
                <span sx={{ fontFamily: 'monospace' }}>
                  {transaction.rewardCut / 10000}% R
                </span>{' '}
              </Box>
              <Box>
                <span sx={{ fontFamily: 'monospace' }}>
                  {(100 - transaction.feeShare / 10000)
                    .toFixed(2)
                    .replace(/[.,]00$/, '')}
                  % F
                </span>{' '}
              </Box>
            </div>
          </Flex>
        </ListItem>
      )
    case 'WithdrawStake':
      return (
        <ListItem
          sx={{
            cursor: 'pointer',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          onClick={() =>
            window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')
          }
          key={i}
          avatar={
            <LPT sx={{ width: 20, height: 20, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Withdrew Unstaked Tokens</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                +{abbreviateNumber(Utils.fromWei(transaction.amount), 3)}
              </span>{' '}
              LPT
            </div>
          </Flex>
        </ListItem>
      )
    case 'WinningTicketRedeemed':
      return (
        <ListItem
          sx={{
            cursor: 'pointer',
            px: 2,
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          onClick={() =>
            window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')
          }
          key={i}
          avatar={
            <ETH sx={{ width: 20, height: 20, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Redeemed Winning Ticket</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                +{abbreviateNumber(Utils.fromWei(transaction.faceValue), 3)}
              </span>{' '}
              ETH
            </div>
          </Flex>
        </ListItem>
      )
    default:
      return null
  }
}
