import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Crumb } from '..';
import Table from '../Table/CreateTable'; 
import * as Action from '../../redux/ActionCreator';
import { readGradesList, getGradesWithCurrentSchoolYear } from '../../redux/ActionCreators/MiscActions';

  const Student = (props: any) => {    
    const [isFetching, setFetching] = useState<boolean>(true)
    useEffect(() => { 
        (!isFetching && (props.student.data.length === 0 || props.request.status === "success")) && props.makeStudentRequest()
    }, [props.request, isFetching]);
    useEffect(() => {
      setFetching(false)
    },[])
    useEffect(() => {
      if (!isFetching) {
        !props.class_on_school_year.is_requested && props.getClassOnSchoolYear()
        props.class.data.length === 0 && props.readClassRecords()
        props.grades.data.length === 0 && props.readGradesList()
      }
    }, [isFetching])
    const rowsPerPageArr: number[] = [10, 15, 20];
    const filterProps: {kelas: string; jurusan: string} = {kelas: "", jurusan: ""}
    const responseData = {
      status: props.request.status, 
      message: props.request.message,
      loading: props.request.loading
    }
    const collisonState = {
      collisonKeys: ["kelas", "jurusan"],
      collisonIndex: 2,
      collisonSeparator: " ",
      changeRowsKey: "jeniskelamin",
      collisonChangeRowsValue: (row: any, key: string) => {
        var gender: string;
        if (row[key] === "L") {
          gender = "Laki-Laki"
        } else if (row.jeniskelamin === "P") {
          gender = "Perempuan"
        } else {
          gender = "Other"
        }
        return gender;
      }
    }
    const insertProps = {
      insertState: [
        {
          key: "nis",
          label: "NIS",
          formType: "inputNumber",
        },
        {
          key: "nama",
          label: "Nama",
          formType: "inputString",
        },
        {
          key: "kelas",
          label: "Kelas",
          formType: "inputSelect",
          formValue: props.grades.data.map((row: any) => ({label: row, value: row}))
        },
        {
          key: "jurusan",
          label: "Jurusan",
          formType: "inputSelect",
          formValue: props.class.data.map((row: any) => ({label: row.nama_kelas, value: row.kode_kelas})),
        },
        {
          key: "jeniskelamin",
          label: "Jenis Kelamin",
          formType: "inputRadio",
          formValue: ["L", "P"]
        }
      ],
      onInsert: {
        todoFunction: (data: any) => {
          const newData = data.map((x: any) => ({
            ...x,
            tahun_masuk: typeof x["jurusan"] === "object" 
            ? props.class_on_school_year.school_year_on_grade[x.kelas.value] || 0
            : x["TahunMasuk"],
            jurusan: props.class.data
              .filter((z: any) => z.kode_kelas === (typeof x["jurusan"] === "object" ? x.jurusan.value : x["Jurusan"]))
              .map((y: any) => ({value: y.kode_kelas, label: y.nama_kelas}))[0]
          }))
          props.insertStudentRecords(newData)
        },
        ...responseData
      },
    }
    const inputProps = [
      {
        name: "kelas",
        id: "filter-grade",
        items: props.grades.data
      },
      {
        name: "jurusan",
        id: "filter-class",
        items: props.class.data.map((row: any) => row.nama_kelas)
      }
    ]
    const componentProps = {
      head: [
        {
          key: "nis",
          label: "NIS",
        }, 
        {
          key: "nama",
          label: "Nama"
        }, 
        {
          key: "kelas",
          label: "Kelas"
        }, 
        {
          key: "jeniskelamin",
          label: "Jenis Kelamin"
        }
      ]     
    }
    

    return (
      <>
        <Crumb {...props} />
        <Table 
          data={props.student.data.length === 0 ? [] : props.student.data.map((x: any) => {
            return {...x, kelas: {
              label: props.class_on_school_year.grade_on_school_year[x.tahun_masuk] || "Other", 
              value: props.class_on_school_year.grade_on_school_year[x.tahun_masuk] || "Other"}}
          })}
          onDelete={
            {
              todoFunction: props.deleteStudentRecords, 
              ...responseData
            }
          }
          onUpdate={
            {
              todoFunction: (data: any) => {
                
                props.updateStudentRecords({...data, update: {
                  ...data.update,
                  tahun_masuk: props.class_on_school_year.school_year_on_grade[data.update.kelas.value] || 0
                }})
              }, 
              ...responseData
            }
          }
          rowKey={["NIS", "Nama", "Jurusan", "Jenis Kelamin", "Tahun Masuk" ]}
          insertProps={insertProps}
          loadingData={props.student.loading}
          primaryKey="nis"
          tableTitle="Person Table"
          withActions
          withCheckbox
          withFilter
          collisonState={collisonState} 
          filterProps={filterProps} 
          inputProps={inputProps} 
          componentProps={componentProps} 
          rowsPerPageArr={rowsPerPageArr} 
        />
      </>
    );
  }

  const mapStateToProps = (state: any) => ({
    student: state.student,
    class: state.class,
    request: state.requestResponse,
    setting: state.settings.application,
    grades: state.misc.grades,
    class_on_school_year: state.classOnSchoolYear
  })

  const mapDispatchToProps = (dispatch: any) => ({
    deleteStudentRecords: (data: any) => dispatch(Action.deleteStudentRecords(data)),
    insertStudentRecords: (data: any) => dispatch(Action.insertStudentRecords(data)),
    updateStudentRecords: (data: any) => dispatch(Action.updateStudentRecords(data)),
    getClassOnSchoolYear: () => dispatch(getGradesWithCurrentSchoolYear()),
    makeStudentRequest: () => dispatch(Action.makeStudentRequest()),
    readClassRecords: () => dispatch(Action.readClassRecords()),
    readGradesList: () => dispatch(readGradesList())
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(Student); 
