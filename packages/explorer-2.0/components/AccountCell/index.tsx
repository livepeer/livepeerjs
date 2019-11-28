/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import QRCode from 'qrcode.react'
import Link from 'next/link'
import { getDelegationStatusColor } from '../../lib/utils'

const ActiveCircle = ({ status }, props) => {
  return (
    <div
      className="status"
      sx={{
        position: 'absolute',
        right: '-2px',
        bottom: '-2px',
        bg: getDelegationStatusColor(status),
        border: '3px solid',
        borderColor: 'background',
        boxSizing: 'border-box',
        width: 14,
        height: 14,
        borderRadius: 1000,
        ...props.sx,
      }}
    />
  )
}

export default ({ status, active, address }) => {
  return (
    <Flex sx={{ alignItems: 'center' }}>
      <Flex sx={{ minWidth: 32, minHeight: 32, position: 'relative', mr: 2 }}>
        <QRCode
          style={{
            borderRadius: 1000,
            width: 32,
            height: 32,
          }}
          fgColor={`#${address.substr(2, 6)}`}
          value={address}
        />
        <ActiveCircle status={status} />
      </Flex>
      <Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
        <Link
          href="/accounts/[account]/[slug]"
          as={`/accounts/${address}/campaign`}
          passHref
        >
          <a
            className="orchestratorLink"
            sx={{
              mr: 1,
              color: 'text',
              cursor: 'pointer',
              transition: 'all .3s',
              borderBottom: '1px solid',
              borderColor: 'transparent',
            }}
          >
            <Flex
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>{address.replace(address.slice(5, 39), '…')}</div>
            </Flex>
          </a>
        </Link>
        {active && (
          <div
            sx={{
              display: 'inline-flex',
              padding: '3px 6px',
              border: '1px solid',
              borderColor: 'border',
              color: 'muted',
              fontWeight: 600,
              alignSelf: 'center',
              borderRadius: 3,
              fontSize: '10px',
              alignItems: 'center',
            }}
          >
            ACTIVE
          </div>
        )}
      </Flex>
    </Flex>
  )
}
