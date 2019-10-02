import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Crumb } from '..'
import Table from '../Table/CreateTable';
import * as Action from '../../redux/ActionCreator';
import { readGradesList } from '../../redux/ActionCreators/MiscActions';

function Subject(props: any) {
	const [isFetching, setFetching] = useState<boolean>(true)
    useEffect(() => {(props.subject.data.length === 0 || props.request.status === "success") && (props.readSubjectRecords())}, [props.request]);
    useEffect(() => {
		if (!isFetching) {
      		props.class.data.length === 0 && props.readClassRecords()
			props.grades.data.length === 0 && props.getGradesList()
		}
    }, [isFetching])
	useEffect(() => {
		setFetching(false)
	}, [])
    const rowsPerPageArr: number[] = [6, 12, 18];
	const filterProps: {kelompok_mapel: string, mapel_kelas: string} = {kelompok_mapel: "", mapel_kelas: ""};
    const responseData = {
        status: props.request.status, 
        message: props.request.message,
        loading: props.request.loading
      }
    const insertProps = {
      insertState: [
        {
          key: "kode_mapel",
          label: "Kode Mapel",
          formType: "inputString",
        },
        {
          key: "nama_mapel",
          label: "Nama Mapel",
          formType: "inputString",
        },
        {
          key: "kelompok_mapel",
          label: "Kelompok Mapel",
          formType: "inputSelect",
          formValue: [{value: "umum", label: "Umum"}, {value: "khusus", label: "Khusus"}]
        },
        {
          key: "mapel_kelas",
          label: "Mapel Kelas (Kelompok Khusus)",
          formType: "inputSelect",
          multi: true,
          formValue: props.grades.data
            .map((c: string) => props.class.data
            .map((a: any) => ({value: c + " " + a.kode_kelas, label: c + " " + a.nama_kelas})))
            .flat(1)
            .sort((a: any, b: any) => a.label > b.label ? 1 : -1)
        },
      ],
      onInsert: {
		todoFunction: (data: any) => {
          props.insertSubjectRecords(data)
        },
        ...responseData
      },
    }
	const inputProps = [
		{
			name: "kelompok_mapel",
			id: "filter-kelompok_mapel",
			items: ["Umum", "Khusus"]
		},
		{
			name: "mapel_kelas",
			id: "filter-mapel_kelas",
			items: props.grades.data
            .map((c: string) => props.class.data
            .map((a: any) => c + " " + a.nama_kelas))
            .flat(1)
            .sort((a: any, b: any) => a > b ? 1 : -1)
		}
	]
    const componentProps = {
      head: [
        {
          key: "kode_mapel",
          label: "Kode Mapel",
        }, 
        {
          key: "nama_mapel",
          label: "Nama Mapel"
        },
        {
          key: "kelompok_mapel",
          label: "Kelompok Mapel"
        },
        {
          key: "mapel_kelas",
          label: "Mapel Kelas"
        },
      ]     
    }
    

    return (
      <>
        <Crumb {...props} />
        <Table 
            data={props.subject.data}
            onDelete={
                {
                    todoFunction: props.deleteSubjectRecords,
                    ...responseData
                }
            }
            onUpdate={
                {
                    todoFunction: props.updateSubjectRecords,
                    ...responseData
                }
            }
            rowKey={["Kode Mapel", "Nama Mapel"]}
            loadingData={props.subject.loading}
            insertProps={insertProps}
			inputProps={inputProps}
			filterProps={filterProps}
            primaryKey="kode_mapel"
            tableTitle="Tabel Mapel"
            withActions
            withCheckbox
            withFilter
            withMultival
            multiValKey={["mapel_kelas"]}
            componentProps={componentProps} 
            rowsPerPageArr={rowsPerPageArr} 
        />
      </>
    )
}

const mapStateToProps = (state: any) => ({
    subject: state.subject,
    class: state.class,
	grades: state.misc.grades,
    request: state.requestResponse
})

const mapDispatchToProps = (dispatch: any) => ({
    readSubjectRecords: () => dispatch(Action.readSubjectRecords()),
    readClassRecords: () => dispatch(Action.readClassRecords()),
	getGradesList: () => dispatch(readGradesList()),
    insertSubjectRecords: (data: any) => dispatch(Action.insertSubjectRecords(data)),
    updateSubjectRecords: (data: any) => dispatch(Action.updateSubjectRecords(data)),
    deleteSubjectRecords: (data: any) => dispatch(Action.deleteSubjectRecords(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Subject);
