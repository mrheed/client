import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Crumb } from '..'
import Table from '../Table/CreateTable';
import * as Action from '../../redux/ActionCreator';
import { readGradesList } from '../../redux/ActionCreators/MiscActions';

function Teacher(props: any) {

    const [isFetching, setFetching] = useState<boolean>(true)
    useEffect(() => {
      !isFetching && (props.teacher_data.data.length === 0 && props.getTeacherRecords())
    }, [isFetching])
	useEffect(() => {
	(props.request.status === "error" || props.request.status === "success") && props.getTeacherRecords()
	}, [props.request])
    useEffect(() => {
      setFetching(false)
    },[])
    useEffect(() => {
      if (!isFetching) {
        props.class_data.data.length === 0 && props.getClassRecords()
        props.subject.data.length === 0 && props.readSubjectRecords()
		props.grades_data.data.length === 0 && props.getGradesList()
      }
    }, [isFetching])
    const rowsPerPageArr: number[] = [6, 12, 18];
    const filterProps: {mapel: string, kelas_diampu: string} = {mapel: "", kelas_diampu: ""}
    const collisonState = {
        changeRowsKey: "jeniskelamin",
        collisonChangeRowsValue: (row: any, key: string) => {
          var gender: string;
          if (row[key] === "L") {
            gender = "Laki-Laki"
          } else if (row[key] === "P") {
            gender = "Perempuan"
          } else {
            gender = "Other"
          }
          return gender;
        }
      }
    const responseData = {
        status: props.request.status, 
        message: props.request.message,
        loading: props.request.loading
      }
	console.log(props.grades_data.data)
    const insertProps = {
      insertState: [
        {
          key: "nip",
          label: "NIP",
          formType: "inputString",
        },
        {
          key: "nama",
          label: "Nama",
          formType: "inputString",
        },
        {
          key: "mapel",
          label: "Mapel diampu",
          formType: "inputSelect",
          multi: true,
          formValue: props.subject.data.map((row: any) => ({label: row.nama_mapel, value: row.kode_mapel}))
        },
        {
          key: "kelas_diampu",
          label: "Kelas diampu",
          formType: "inputSelect",
          multi: true,
          formValue: props.class_data.data
            .map((row: any) => props.grades_data.data
            .map((crow: any) => ({label: crow + " " + row.nama_kelas, value: crow + " " + row.kode_kelas })
             )).flat(1)
             .sort((a: any, b: any) => a.label > b.label ? 1 : -1)
        },
        {
          key: "wali",
          label: "Wali Kelas",
          formType: "inputSelect",
          multi: false,
          formValue: [...props.class_data.data
            .map((row: any) => props.grades_data.data
            .map((crow: any) => ({label: crow + " " + row.nama_kelas, value: crow + " " + row.kode_kelas })
            )).flat(1), {label: "Bukan wali", value: "bukan_wali"}]
            .sort((a: any, b: any) => a.label > b.label ? 1 : -1)
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
          const key = Object.keys(data[0]).filter((kys: string) => kys === "mapel" || kys ==="MapelDiampu")[0]
          const key1 = Object.keys(data[0]).filter((kys: string) => kys === "kelas_diampu" || kys === "KelasDiampu")[0]
          const drFn = (ky: string, x: any) => {
            return x[ky].split(",").length === 1
            ? x[ky]
            : x[ky].split(",").map((v: string, i: number) =>  
              {
                if (v.split("")[0] === " ") {
                  var vSpl = v.split("")
                  vSpl.shift()
                  return vSpl.join("")
                } else {
                  return v.split("").join("")
                }
              }
            )
          }
          const newData = key === "MapelDiampu" && data.map((x: any) => {
            const mapelDariUser = key === "MapelDiampu" && drFn(key, x)
            const kelasDiampu = key1 === "KelasDiampu" ? drFn(key1, x) : x[key1]
			  console.log(kelasDiampu)
              return ({
                Nama: x["Nama"],
                JenisKelamin: x["JenisKelamin"],
                NIP: parseInt(x["NIP"]),
                kelas_diampu: x["KelasDiampu"] ? (!Array.isArray(kelasDiampu) ? [kelasDiampu] : kelasDiampu).map((km: string) => {
                  var sK = km.split(" ")[1]
                  var kK = km.split(" ")[0]
                  return props.class_data.data
                    .filter((df: any) => df.kode_kelas === sK)
                    .map((dm: any) => ({value: kK + " " + dm.kode_kelas, label: kK + " " + dm.nama_kelas}))[0]
                }) : [],
                mapel: props.subject.data.filter((z: any) => !Array.isArray(mapelDariUser)
                ? z.kode_mapel === mapelDariUser
                : mapelDariUser.includes(z.kode_mapel)
                ).map((b: any) => ({label: b.nama_mapel, value: b.kode_mapel}))
              })
            })
			data = data.map((x: any) => {
				return ({...x, "nip": parseInt(x["nip"])})
			})
          props.insertTeacherRecords(key === "MapelDiampu" ? newData : data)
        },
        ...responseData
      },
    }
    const inputProps = [
      	{
        	name: "mapel",
        	id: "filter-mapel",
        	items: props.subject.data.map((row: any) => row.nama_mapel)
      	},
		{
			name: "kelas_diampu",
			id: "filter-kelas_diampu",
          	items: props.class_data.data
            .map((row: any) => props.grades_data.data
            .map((crow: any) => crow + " " + row.nama_kelas)).flat(1)
            .sort((a: any, b: any) => a.label > b.label ? 1 : -1)
		}
    ]
    const componentProps = {
      head: [
        {
          key: "nip",
          label: "NIP",
        }, 
        {
          key: "nama",
          label: "Nama"
        }, 
        {
          key: "mapel",
          label: "Mapel diampu"
        }, 
        {
          key: "kelas_diampu",
          label: "Kelas Diampu"
        }, 
        {
          key: "wali",
          label: "Wali Kelas"
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
            data={props.teacher_data.data}
            onDelete={
                {
                    todoFunction: props.deleteTeacherRecords,
                    ...responseData
                }
            }
            onUpdate={
                {
                    todoFunction: props.updateTeacherRecords,
                    ...responseData
                }
            }
            rowKey={["NIP", "Nama", "Mapel Diampu", "Kelas Diampu", "Jenis Kelamin"]}
            collisonState={collisonState}
            loadingData={props.teacher_data.loading}
            insertProps={insertProps}
            primaryKey="nip"
            tableTitle="Tabel Guru"
            withActions
            withCheckbox
            withFilter
            withMultival
            multiValKey={["mapel", "kelas_diampu"]}
            filterProps={filterProps} 
            inputProps={inputProps} 
            componentProps={componentProps} 
            rowsPerPageArr={rowsPerPageArr} 
        />
        </>
    )
}

const mapStateToProps = (state: any) => ({
    request: state.requestResponse,
    grades_data: state.misc.grades,
    teacher_data: state.teacher,
    class_data: state.class,
    subject: state.subject,
})

const mapDispatchToProps = (dispatch: any) => ({
    insertTeacherRecords: (data: any) => dispatch(Action.insertTeacherRecords(data)),
    updateTeacherRecords: (data: any) => dispatch(Action.updateTeacherRecords(data)),
    deleteTeacherRecords: (data: any) => dispatch(Action.deleteTeacherRecords(data)),
    readSubjectRecords: () => dispatch(Action.readSubjectRecords()),
    getTeacherRecords: () => dispatch(Action.readTeacherRecords()),
    getClassRecords: () => dispatch(Action.readClassRecords()),
    getGradesList: () => dispatch(readGradesList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Teacher);
