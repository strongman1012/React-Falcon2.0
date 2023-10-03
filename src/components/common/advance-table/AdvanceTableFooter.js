import classNames from 'classnames';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import Flex from '../Flex';

export const AdvanceTableFooter = ({
  page,
  pageSize,
  pageIndex,
  rowCount,
  setPageSize,
  canPreviousPage,
  canNextPage,
  nextPage,
  previousPage,
  rowInfo,
  rowsPerPageSelection,
  navButtons,
  rowsPerPageOptions = [5, 10, 15],
  className
}) => {
  return (
    <Flex
      className={classNames(
        className,
        'align-items-center justify-content-between'
      )}
    >
      <Flex alignItems="center" className="fs--1">
        {rowInfo && (
          <p className="mb-0">
            <span className="d-none d-sm-inline-block me-2">
              {pageSize * pageIndex + 1} to {pageSize * pageIndex + page.length}{' '}
              of {rowCount}
            </span>
          </p>
        )}
        {rowsPerPageSelection && (
          <>
            <p className="mb-0 mx-2">Rows per page:</p>
            <Form.Select
              size="sm"
              className="w-auto"
              onChange={e => setPageSize(e.target.value)}
              defaultValue={pageSize}
            >
              {rowsPerPageOptions.map(value => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </>
        )}
      </Flex>
      {navButtons && (
        <Flex>
          <Button
            size="sm"
            variant={canPreviousPage ? 'primary' : 'light'}
            onClick={() => previousPage()}
            className={classNames({ disabled: !canPreviousPage })}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant={canNextPage ? 'primary' : 'light'}
            className={classNames('px-4 ms-2', {
              disabled: !canNextPage
            })}
            onClick={() => nextPage()}
          >
            Next
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default AdvanceTableFooter;
