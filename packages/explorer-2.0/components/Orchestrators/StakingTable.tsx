import { Flex, Box } from 'theme-ui'
import { useMemo, useState, useRef } from 'react'
import { useTable, useFilters, useSortBy, usePagination } from 'react-table'
import { abbreviateNumber, expandedPriceLabels } from '../../lib/utils'
import Search from '../../public/img/search.svg'
import Help from '../../public/img/help.svg'
import matchSorter from 'match-sorter'
import AccountCell from '../AccountCell'
import ReactTooltip from 'react-tooltip'
import useWindowSize from 'react-use/lib/useWindowSize'
import Router from 'next/router'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import {
  Menu,
  MenuItemRadioGroup,
  MenuItemRadio,
} from '@modulz/radix/dist/index.es'
import Price from '../Price'

const StakingTable = ({ data: { currentRound, transcoders } }) => {
  const { width } = useWindowSize()
  const [isPriceSettingOpen, setIsPriceSettingOpen] = useState(false)
  const targetRef = useRef()
  const [priceSetting, setPriceSetting] = useState('1t pixels')

  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, {
      keys: [row => row.values[id]],
    })
  }

  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = val => !val

  function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
    return (
      <Flex
        sx={{
          alignItems: 'center',
          pl: 3,
        }}
      >
        <Search sx={{ width: 16, height: 16, mr: 1, color: 'muted' }} />
        <Box
          value={filterValue || ''}
          onChange={e => {
            setFilter(e.target.value || undefined)
          }}
          placeholder={`Filter`}
          as="input"
          type="text"
          variant="input"
          sx={{
            display: 'block',
            outline: 'none',
            width: '100%',
            appearance: 'none',
            fontSize: 2,
            lineHeight: 'inherit',
            border: 0,
            color: 'inherit',
            bg: 'transparent',
          }}
        />
      </Flex>
    )
  }

  const columns: any = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'rank',
        disableSortBy: true,
      },
      {
        Header: 'Orchestrator',
        accessor: 'id',
        filter: 'fuzzyText',
        Filter: DefaultColumnFilter,
        mobile: true,
        sortType: (rowA, rowB, columnID) => {
          let a = getRowValueByColumnID(rowA, columnID)
          let b = getRowValueByColumnID(rowB, columnID)
          let aThreeBoxSpace = getRowValueByColumnID(rowA, 'threeBoxSpace')
          let bThreeBoxSpace = getRowValueByColumnID(rowB, 'threeBoxSpace')
          let rowAIdentity = aThreeBoxSpace?.name ? aThreeBoxSpace?.name : a
          let rowBIdentity = bThreeBoxSpace?.name ? bThreeBoxSpace?.name : b

          return compareBasic(rowAIdentity, rowBIdentity)
        },
      },
      {
        Header: 'Activation Round',
        accessor: 'activationRound',
      },
      {
        Header: 'Deactivation Round',
        accessor: 'deactivationRound',
      },
      {
        Header: 'ThreeBoxSpace',
        accessor: 'threeBoxSpace',
        filter: 'fuzzyText',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Delegator',
        accessor: 'delegator',
      },
      {
        Header: 'Stake',
        accessor: 'totalStake',
        mobile: true,
      },
      {
        Header: 'Fees',
        accessor: 'totalGeneratedFees',
      },
      {
        Header: 'Reward Cut',
        accessor: 'rewardCut',
      },
      {
        Header: 'Fee Cut',
        accessor: 'feeShare',
        sortInverted: true,
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Calls',
        accessor: 'pools',
        sortType: (rowA, rowB, columnID) => {
          let a = getRowValueByColumnID(rowA, columnID)
          let b = getRowValueByColumnID(rowB, columnID)

          let rowACallsMade = a.filter(r => r.rewardTokens != null).length
          let rowBCallsMade = b.filter(r => r.rewardTokens != null).length

          return compareBasic(rowACallsMade, rowBCallsMade)
        },
      },
    ],
    [],
  )

  function getRowValueByColumnID(row, columnID) {
    return row.values[columnID]
  }

  function compareBasic(a, b) {
    return a === b ? 0 : a > b ? 1 : -1
  }

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    [],
  )

  const tableOptions: any = {
    columns,
    data: transcoders,
    disableSortRemove: true,
    autoResetPage: false,
    initialState: {
      sortBy: [{ id: 'totalStake', desc: true }],
      hiddenColumns: [
        'activationRound',
        'deactivationRound',
        'threeBoxSpace',
        'active',
        'delegator',
      ],
    },
    defaultColumn,
    filterTypes,
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    state: { pageIndex },
  }: any = useTable(tableOptions, useFilters, useSortBy, usePagination)

  const accountColumn: any = headerGroups[0].headers[1]

  const PriceSettingToggle = () => (
    <span
      ref={targetRef}
      onClick={e => {
        e.stopPropagation()
        setIsPriceSettingOpen(true)
      }}
      sx={{
        fontSize: 10,
      }}
    >
      <span sx={{ mx: '4px' }}>/</span>
      <span
        title={`Price of transcoding per ${expandedPriceLabels[priceSetting]}`}
        sx={{
          color: 'text',
          borderBottom: '1px dashed',
          borderColor: 'text',
          transition: '.3s',
          ':hover': { color: 'primary' },
          ':active': { color: 'primary' },
        }}
      >
        {priceSetting}
      </span>
    </span>
  )
  return (
    <>
      <Menu
        style={{
          background: '#1E2026',
          padding: 0,
          borderRadius: 10,
          boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
        }}
        isOpen={isPriceSettingOpen}
        onClose={() => setIsPriceSettingOpen(false)}
        buttonRef={targetRef}
      >
        <MenuItemRadioGroup
          value={priceSetting}
          onChange={value => {
            setPriceSetting(value)
          }}
        >
          <MenuItemRadio value="pixel" label="1 pixel" />
          <MenuItemRadio value="1m pixels" label="1 million pixels" />
          <MenuItemRadio value="1b pixels" label="1 billion pixels" />
          <MenuItemRadio value="1t pixels" label="1 trillion pixels" />
        </MenuItemRadioGroup>
      </Menu>
      <Flex
        sx={{
          position: 'relative',
          width: '100%',
          top: 0,
          zIndex: 10,
          flexDirection: 'column',
          alignItems: 'flex-start',
          pt: 0,
          pb: 3,
          ml: 0,
          mr: 0,
          justifyContent: 'space-between',
        }}
      >
        <Box>{accountColumn.render('Filter')}</Box>
      </Flex>
      <Box>
        <table
          sx={{
            display: 'table',
            width: '100%',
            minWidth: ['100%', '100%', '100%', 650],
            borderSpacing: '0',
            borderCollapse: 'collapse',
          }}
          {...getTableProps()}
        >
          <thead sx={{ display: 'table-header-group' }}>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any, i) => (
                  <th
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'rgba(255,255,255,.05)',
                      pb: 1,
                      pl: 3,
                      pr: [
                        3,
                        3,
                        3,
                        headerGroup.headers.length - 1 === i ? 3 : 0,
                      ],
                      display: [
                        column.mobile ? 'table-cell' : 'none',
                        column.mobile ? 'table-cell' : 'none',
                        'table-cell',
                      ],
                      textTransform: 'uppercase',
                    }}
                    align="right"
                    key={i}
                  >
                    <Flex
                      sx={{
                        justifyContent:
                          i === 0 || i === 1 ? 'flex-start' : 'flex-end',
                      }}
                    >
                      <span
                        sx={{
                          fontSize: 10,
                        }}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps({ title: '' }),
                        )}
                      >
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <MdKeyboardArrowDown sx={{ ml: '-12px' }} />
                            ) : (
                              <MdKeyboardArrowUp sx={{ ml: '-12px' }} />
                            )
                          ) : (
                            ''
                          )}
                        </span>
                        {column.render('Header')}
                      </span>
                      {column.render('Header') === 'Price' && (
                        <PriceSettingToggle />
                      )}
                      {renderTooltip(column.render('Header'))}
                    </Flex>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row: any, rowIndex) => {
              const orchestratorIndex = rowIndex + pageIndex * 10
              prepareRow(row)
              return (
                <tr
                  {...row.getRowProps()}
                  key={orchestratorIndex}
                  onClick={() => {
                    if (width < 1020) {
                      Router.push(
                        '/accounts/[account]/[slug]',
                        `/accounts/${row.values.id}/campaign`,
                      )
                    }
                  }}
                  sx={{
                    height: 64,
                    '&:hover': {
                      '.orchestratorLink': {
                        borderColor: 'text',
                        display: 'inlineBlock',
                        transition: 'all .3s',
                      },
                    },
                    '.status': {
                      borderColor: 'surface',
                    },
                  }}
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <td
                        sx={{
                          display: [
                            cell.column.mobile ? 'table-cell' : 'none',
                            cell.column.mobile ? 'table-cell' : 'none',
                            'table-cell',
                          ],
                          textAlign: i === 0 || i === 1 ? 'left' : 'right',
                          cursor:
                            i == 1
                              ? 'pointer'
                              : width < 1020
                              ? 'pointer'
                              : 'default',
                          width: i === 0 ? '10px' : 'auto',
                          fontSize: 1,
                          pl: 3,
                          pr: [3, 3, 3, row.cells.length - 1 === i ? 3 : 0],
                          borderBottom: '1px solid',
                          borderColor: 'rgba(255,255,255,.05)',
                        }}
                        {...cell.getCellProps()}
                        onClick={() => {
                          if (i === 1 && width > 1020) {
                            Router.push(
                              '/accounts/[account]/[slug]',
                              `/accounts/${row.values.id}/campaign`,
                            )
                          }
                        }}
                        key={i}
                      >
                        {renderSwitch(rowIndex, pageIndex, cell, currentRound)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </Box>
      <Flex
        sx={{
          py: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RiArrowLeftLine
          sx={{
            cursor: 'pointer',
            color: canPreviousPage ? 'primary' : 'text',
            opacity: canPreviousPage ? 1 : 0.5,
          }}
          onClick={() => {
            if (canPreviousPage) {
              previousPage()
            }
          }}
        />
        <Box sx={{ fontSize: 1, mx: 2 }}>
          Page <span sx={{ fontFamily: 'monospace' }}>{pageIndex + 1}</span> of{' '}
          <span sx={{ fontFamily: 'monospace' }}>{pageCount}</span>
        </Box>
        <RiArrowRightLine
          sx={{
            cursor: 'pointer',
            color: canNextPage ? 'primary' : 'text',
            opacity: canNextPage ? 1 : 0.5,
          }}
          onClick={() => {
            if (canNextPage) {
              nextPage()
            }
          }}
        />
      </Flex>
    </>
  )
  function renderTooltip(title) {
    switch (title) {
      case 'Stake':
        return (
          <>
            <ReactTooltip
              id="tooltip-stake"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Help
              data-tip="Total LPT staked with an orchestrator, including its own stake."
              data-for="tooltip-stake"
              sx={{
                cursor: 'pointer',
                position: 'relative',
                ml: 1,
                top: '1px',
                width: 12,
                height: 12,
              }}
            />
          </>
        )
      case 'Fees':
        return (
          <>
            <ReactTooltip
              id="tooltip-fees"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Help
              data-tip="Total ETH earned from transcoding."
              data-for="tooltip-fees"
              sx={{
                cursor: 'pointer',
                position: 'relative',
                ml: 1,
                top: '1px',
                width: 12,
                height: 12,
              }}
            />
          </>
        )
      case 'Price':
        return (
          <>
            <ReactTooltip
              id="tooltip-price"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Help
              data-tip={`Price of transcoding per ${expandedPriceLabels[priceSetting]}.`}
              data-for="tooltip-price"
              sx={{
                cursor: 'pointer',
                position: 'relative',
                ml: 1,
                top: '1px',
                width: 12,
                height: 12,
              }}
            />
          </>
        )
      case 'Reward Cut':
        return (
          <>
            <ReactTooltip
              id="tooltip-reward-cut"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Help
              data-tip="The percent of the newly minted Livepeer token that the orchestrator will keep from the round’s inflation distribution. The remainder gets distributed across all staked tokenholders by how much you stake relative to others."
              data-for="tooltip-reward-cut"
              sx={{
                cursor: 'pointer',
                position: 'relative',
                ml: 1,
                top: '1px',
                width: 12,
                height: 12,
              }}
            />
          </>
        )
      case 'Fee Cut':
        return (
          <>
            <ReactTooltip
              id="tooltip-fee-cut"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Help
              data-tip="The percent of the earned fees (ETH) that the orchestrator will keep. The remainder gets distributed across all delegators by how much they have staked relative to others."
              data-for="tooltip-fee-cut"
              sx={{
                cursor: 'pointer',
                position: 'relative',
                ml: 1,
                top: '1px',
                width: 12,
                height: 12,
              }}
            />
          </>
        )
      case 'Calls':
        return (
          <>
            <ReactTooltip
              id="tooltip-calls"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Help
              data-tip="The number of times an orchestrator claimed its newly minted rewards on behalf of its delegators over the last 30 rounds."
              data-for="tooltip-calls"
              sx={{
                cursor: 'pointer',
                position: 'relative',
                ml: 1,
                top: '1px',
                width: 12,
                height: 12,
              }}
            />
          </>
        )

      default:
        return null
    }
  }

  function renderSwitch(rowIndex, pageIndex, cell, currentRound) {
    switch (cell.column.Header) {
      case '#':
        return parseInt(rowIndex) + 1 + pageIndex * 10
      case 'Orchestrator':
        const active =
          cell.row.values.activationRound <= currentRound.id &&
          cell.row.values.deactivationRound > currentRound.id
        return (
          <AccountCell
            active={active}
            threeBoxSpace={cell.row.values.threeBoxSpace}
            address={cell.value}
          />
        )
      case 'Stake':
        return (
          <span sx={{ fontFamily: 'monospace' }}>
            {abbreviateNumber(cell.value ? cell.value : 0, 4)}
          </span>
        )
      case 'Fees':
        return (
          <span sx={{ fontFamily: 'monospace' }}>
            {cell.value ? +parseFloat(cell.value).toFixed(2) : 0}{' '}
            <span sx={{ fontSize: 12 }}>ETH</span>
          </span>
        )
      case 'Reward Cut':
        return (
          <span sx={{ fontFamily: 'monospace' }}>{cell.value / 10000}%</span>
        )
      case 'Fee Cut':
        return (
          <span sx={{ fontFamily: 'monospace' }}>
            {cell.value === '0' || !cell.value
              ? '100%'
              : `${(100 - cell.value / 10000)
                  .toFixed(2)
                  .replace(/[.,]00$/, '')}%`}
          </span>
        )
      case 'Price':
        return (
          <span sx={{ fontFamily: 'monospace' }}>
            <span data-html={true}>
              {cell.value <= 0 ? (
                'N/A'
              ) : (
                <Price value={cell.value} per={priceSetting} />
              )}
            </span>
          </span>
        )
      case 'Calls':
        let callsMade = cell.value.filter(r => r.rewardTokens != null).length
        return (
          <span sx={{ fontFamily: 'monospace' }}>
            {`${callsMade}/${cell.value.length}`}
          </span>
        )
      default:
        return null
    }
  }
}

export default StakingTable
