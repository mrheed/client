import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Crumb } from '..'
import Table from '../Table/CreateTable';
import * as Action from '../../redux/ActionCreator';

function Teacher(props: any) {
    useEffect(() => {(props.class.data.length === 0 || props.request.status === "success") && (props.readClassRecords())}, [props.request]);
    const rowsPerPageArr: number[] = [6, 12, 18];
    const responseData = {
        status: props.request.status, 
        message: props.request.message,
        loading: props.request.loading
      }
    const insertProps = {
      insertState: [
        {
          key: "kode_kelas",
          label: "Kode Kelas",
          formType: "inputString",
        },
        {
          key: "nama_kelas",
          label: "Nama Kelas",
          formType: "inputString",
        },
      ],
      onInsert: {
        todoFunction: props.insertClassRecords,
        ...responseData
      },
    }
    const componentProps = {
      head: [
        {
          key: "kode_kelas",
          label: "Kode Kelas",
        }, 
        {
          key: "nama_kelas",
          label: "Nama Kelas"
        },
      ]     
    }
    

    return (
      <>
        <Crumb {...props} />
        <Table 
            data={props.class.data}
            onDelete={
                {
                    todoFunction: props.deleteClassRecords,
                    ...responseData
                }
            }
            onUpdate={
                {
                    todoFunction: props.updateClassRecords,
                    ...responseData
                }
            }
            rowKey={["Kode Kelas", "Nama Kelas"]}
            loadingData={props.class.loading}
            insertProps={insertProps}
            primaryKey="kode_kelas"
            tableTitle="Tabel Kelas"
            withActions
            withCheckbox
            componentProps={componentProps} 
            rowsPerPageArr={rowsPerPageArr} 
        />
      </>
    )
}

const mapStateToProps = (state: any) => ({
    class: state.class,
    request: state.requestResponse
})

const mapDispatchToProps = (dispatch: any) => ({
    readClassRecords: () => dispatch(Action.readClassRecords()),
    insertClassRecords: (data: any) => dispatch(Action.insertClassRecords(data)),
    updateClassRecords: (data: any) => dispatch(Action.updateClassRecords(data)),
    deleteClassRecords: (data: any) => dispatch(Action.deleteClassRecords(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Teacher);
