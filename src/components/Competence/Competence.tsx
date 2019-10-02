import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Crumb } from '..'
import Table from '../Table/CreateTable';
import * as Action from '../../redux/ActionCreator';

function KD(props: any) {
    const [isFetching, setFetching] = useState<boolean>(true)
    useEffect(() => {
      setFetching(false)
    }, [])
    useEffect(() => { !isFetching && (props.competence.data.length === 0 || props.request.status === "success") && (props.readCompetenceRecords())}, [props.request,, isFetching]);
    useEffect(() => {
      if (!isFetching) {
        props.subject.data.length === 0 && props.readSubjectRecords();
      }
    }, [isFetching])
    const rowsPerPageArr: number[] = [6, 12, 18];
    const responseData = {
        status: props.request.status, 
        message: props.request.message,
        loading: props.request.loading
      }
    const insertProps = {
      insertState: [
        {
          key: "kode_materi",
          label: "Kode Materi",
          formType: "inputString",
        },
        {
          key: "nama_mapel",
          label: "Nama Mapel",
          formType: "inputSelect",
          formValue: props.subject.data.map((x: any) => ({label: x.nama_mapel, value: x.kode_mapel}))
        },
        {
          key: "nama_materi",
          label: "Nama Materi",
          formType: "inputString",
        },
      ],
      onInsert: {
        todoFunction: props.insertCompetenceRecords,
        ...responseData
      },
    }
    const componentProps = {
      head: [
        {
          key: "kode_materi",
          label: "Kode Materi",
        }, 
        {
          key: "nama_mapel",
          label: "Nama Mapel",
        }, 
        {
          key: "nama_materi",
          label: "Nama Materi"
        },
      ]     
    }
    

    return (
      <>
        <Crumb {...props} />
        <Table 
            data={props.competence.data}
            onDelete={
                {
                    todoFunction: props.deleteCompetenceRecords,
                    ...responseData
                }
            }
            onUpdate={
                {
                    todoFunction: props.updateCompetenceRecords,
                    ...responseData
                }
            }
            rowKey={["Kode Materi", "Nama Mapel", "Nama Materi"]}
            loadingData={props.competence.loading}
            insertProps={insertProps}
            primaryKey="kode_materi"
            tableTitle="Tabel Kompetensi Dasar"
            withActions
            withCheckbox
            componentProps={componentProps} 
            rowsPerPageArr={rowsPerPageArr} 
        />
      </>
    )
}

const mapStateToProps = (state: any) => ({
    competence: state.competence,
    subject: state.subject,
    request: state.requestResponse
})

const mapDispatchToProps = (dispatch: any) => ({
    readCompetenceRecords: () => dispatch(Action.readCompetenceRecords()),
    readSubjectRecords: () => dispatch(Action.readSubjectRecords()),
    insertCompetenceRecords: (data: any) => dispatch(Action.insertCompetenceRecords(data)),
    updateCompetenceRecords: (data: any) => dispatch(Action.updateCompetenceRecords(data)),
    deleteCompetenceRecords: (data: any) => dispatch(Action.deleteCompetenceRecords(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(KD);