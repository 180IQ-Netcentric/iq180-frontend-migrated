import React, { useCallback, useContext, useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import { client } from '../../config/axiosConfig'
import { Theme, ThemeContext } from '../../contexts/themeContext'
import { AuthenticationErrorMessage, scoreboardError } from '../../utils/errors'
import ErrorAlert from '../alerts/ErrorAlert'
import { UserContext } from '../../contexts/userContext'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../locales/i18n'
import { SocketContext } from '../../contexts/socketContext'
import { IconButton } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'

interface Data {
  rank: number
  username: string
  win: number
  lose: number
  score: number
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { order, orderBy, onRequestSort } = props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  const getHeadCells = () => {
    return [
      {
        id: 'rank' as keyof Data,
        numeric: true,
        disablePadding: true,
        label: t('12'),
      },
      {
        id: 'username' as keyof Data,
        numeric: false,
        disablePadding: false,
        label: t('1'),
      },
      {
        id: 'win' as keyof Data,
        numeric: true,
        disablePadding: false,
        label: t('14'),
      },
      {
        id: 'lose' as keyof Data,
        numeric: true,
        disablePadding: false,
        label: t('15'),
      },
      {
        id: 'score' as keyof Data,
        numeric: true,
        disablePadding: false,
        label: t('16'),
      },
    ]
  }

  const [headCells, setHeadCells] = useState<HeadCell[]>(getHeadCells())

  useEffect(() => {
    setHeadCells(getHeadCells())
  }, [language])

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='left'
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              borderBottom: 'transparent',
              maxWidth: `${headCell.id === 'rank' ? '60px' : 'inherit'}`,
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id && headCell.id !== 'rank'}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              // hideSortIcon={headCell.id === 'rank'}
              sx={{
                textAlign: 'left',
                justifyContent: 'left',
                display: 'flex',
              }}
            >
              <div
                style={{
                  minWidth: headCell.id === 'username' ? '48px' : 'inherit',
                }}
              >
                {headCell.label}
              </div>
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

type Props = {
  small: boolean
  toggleView?: () => void
  className?: string
}

export default function Scoreboard(props: Props) {
  const { t } = useTranslation()
  const { small, toggleView, className } = props
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Data>('score')
  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [dense] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [error, setError] = useState<AuthenticationErrorMessage>()
  const [showError, setShowError] = useState(false)
  const { theme: appTheme } = useContext(ThemeContext)
  const { socket } = useContext(SocketContext)

  function createData(
    username: string,
    rank: number,
    win: number,
    lose: number,
    score: number
  ): Data {
    return {
      rank,
      username,
      win,
      lose,
      score,
    }
  }
  const { user } = useContext(UserContext)
  const [rows, setRows] = useState<Data[]>([])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.username)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const getScoreboard = useCallback((unmounted: boolean) => {
    client
      .get('/scoreboard')
      .then((res) => {
        if (!unmounted) {
          const scores: Data[] = res.data
          const formattedScore = scores.map((info) => {
            return createData(
              info.username,
              info.rank,
              info.win,
              info.lose,
              info.score
            )
          })
          setRows(formattedScore)
        }
      })
      .catch((err) => {
        setError(err.response.data)
        setShowError(true)
      })
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('endGame', () => {
      setTimeout(() => {
        getScoreboard(false)
      }, 1000)
    })
  }, [socket, getScoreboard])

  useEffect(() => {
    let unmounted = false

    getScoreboard(unmounted)
    return () => {
      unmounted = true
    }
  }, [getScoreboard])

  const isInGame = document.URL.includes('game')

  return (
    <div
      className={`scoreboard-container${
        appTheme === Theme.DARK ? '-dark' : ''
      } scoreboard-container${
        small ? '-small' : ''
      } scoreboard-home disable-scrollbars ${className}`}
    >
      {user && error && (
        <ErrorAlert
          open={showError}
          setOpen={setShowError}
          title={scoreboardError(error.reason).title}
          description={scoreboardError(error.reason).description}
          primaryAction={() => setShowError(false)}
        />
      )}
      <div className='chat-header'>
        <div
          className='section-title'
          style={{ paddingTop: small ? '24px' : 'inherit' }}
        >
          {t('11')}
        </div>
        {isInGame ? (
          <IconButton onClick={toggleView} sx={{ margin: '24px 12px 0 0' }}>
            <ChatIcon />
          </IconButton>
        ) : (
          ''
        )}
      </div>
      {rows.length < 1 && <div className='no-score'>{t('66')}</div>}
      {rows.length > 0 && (
        <Paper elevation={0} sx={{ backgroundColor: 'transparent' }}>
          <TableContainer
            sx={{ backgroundColor: 'transparent', height: '200px' }}
          >
            <Table
              sx={{ backgroundColor: 'transparent' }}
              aria-labelledby='tableTitle'
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {rows.length > 0 &&
                  stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.username)
                      const labelId = `enhanced-table-checkbox-${index}`

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.username)}
                          role='checkbox'
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.username}
                          selected={isItemSelected}
                        >
                          <TableCell
                            component='th'
                            id={labelId}
                            scope='row'
                            align='left'
                            sx={{
                              borderBottom: 'transparent',
                              maxWidth: '30px',
                            }}
                          >
                            <div>{index + 1}</div>
                          </TableCell>
                          <TableCell
                            align='left'
                            sx={{
                              maxWidth: '60px',
                              borderBottom: 'transparent',
                            }}
                          >
                            <div className='single-line-text'>
                              <div>{row.username}</div>
                            </div>
                          </TableCell>
                          <TableCell
                            align='left'
                            sx={{ borderBottom: 'transparent' }}
                          >
                            <div>{row.win}</div>
                          </TableCell>
                          <TableCell
                            align='left'
                            sx={{ borderBottom: 'transparent' }}
                          >
                            <div>{row.lose}</div>
                          </TableCell>
                          <TableCell
                            align='left'
                            sx={{ borderBottom: 'transparent' }}
                          >
                            <div>{row.score}</div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </div>
  )
}
