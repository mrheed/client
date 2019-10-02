import React, { useState, useEffect } from "react";
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from "@material-ui/core/TableCell";
import Checkbox from '@material-ui/core/Checkbox';

interface EnhancedTableProps {
    componentProps: ComponentProps;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    order: Order;
    orderBy: keyof any;
    rowCount: number;
    withCheckbox?: boolean;
    withActions?: boolean;
    data: number;
}

export interface ComponentProps {
    head: HeadComponentProps[];
}

export interface HeadComponentProps {
    key: string;
    label: string;
}

export type Order = 'asc' | 'desc';

function EnhancedTableHead(props: EnhancedTableProps) {
    const { 
      data,
      order, 
      orderBy, 
      onRequestSort, 
      onSelectAllClick, 
      componentProps, 
      numSelected, 
      rowCount, 
      withActions,
      withCheckbox,
    } = props;
    const createSortHandler = (property: keyof any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  
    return (
        <React.Fragment>
          {withCheckbox && (
            <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={data !== 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
            </TableCell>
          )}
          {componentProps.head.map((row: HeadComponentProps, index: number) => (
            <TableCell
              key={row.key}
              align={withCheckbox && index === 0 ? undefined : "left"}
              component={withCheckbox && index === 0 ? "th" : undefined} 
              scope={withCheckbox && index === 0 ? "row" : undefined} 
              padding={withCheckbox && index === 0 ? "none": "default"}
              sortDirection={orderBy === row.key ? order : false}
            >
              <TableSortLabel
                active={orderBy === row.key}
                direction={order}
                onClick={createSortHandler(row.key)}
              >
                {row.label}
              </TableSortLabel>
            </TableCell>
          ))}
          {withActions && (
            <><TableCell padding="none" align="center">
              Ubah
            </TableCell>
            <TableCell padding="checkbox" align="center">
              Hapus
            </TableCell></>
            )
          }
        </React.Fragment>
    );
  }

export default EnhancedTableHead