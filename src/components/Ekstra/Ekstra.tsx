import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Crumb } from '..';
import Table from '../Table/CreateTable'; 
import { getEkstraData, insertEkstraData, updateEkstraData, deleteEkstraData } from '../../redux/ActionCreators/EkstraAction';


  const Ekstra = (props: any) => {    
    const [isFetching, setFetching] = useState<boolean>(true)
    useEffect(() => {
      setFetching(false)
    },[])
    useEffect(() => {
      if (!isFetching) {
		  props.ekstra.data.length === 0 && props.getEkstraData()
      }
    }, [isFetching])
    const rowsPerPageArr: number[] = [10, 15, 20];
    const responseData = {
    }
    const insertProps = {
      insertState: [
        {
          key: "kode_ekstra",
          label: "Kode Ekstra",
          formType: "inputString",
        },
        {
          key: "nama_ekstra",
          label: "Nama Ekstra",
          formType: "inputString",
        },
        {
          key: "pelatih",
          label: "Pelatih",
          formType: "inputString",
        }
      ],
      onInsert: {
        todoFunction: (data: any) => {
        },
        ...responseData
      },
    }
    const componentProps = {
      head: [
        {
          key: "kode_ekstra",
          label: "Kode Ekstra",
        }, 
        {
          key: "nama_ekstra",
          label: "Nama Ekstra"
        }, 
        {
          key: "pelatih",
          label: "Pelatih"
        }
	  ]     
    }

    return (
      <>
        <Crumb {...props} />
        <Table 
          data={[]}
          onDelete={
            {
              todoFunction: () => {}, 
              ...responseData
            }
          }
          onUpdate={
            {
              todoFunction: (data: any) => {
              }, 
              ...responseData
            }
          }
          rowKey={["Kode Ekstra", "Nama Ekstra", "Pelatih"]}
          insertProps={insertProps}
          loadingData={false}
          primaryKey="kode_ekstra"
          tableTitle="Tabel Ekstrakulikuler"
          withActions
          withCheckbox
          componentProps={componentProps} 
          rowsPerPageArr={rowsPerPageArr} 
        />
      </>
    );
  }

  const mapStateToProps = (state: any) => ({
	  ekstra: state.ekstra
  })

  const mapDispatchToProps = (dispatch: any) => ({
	  getEkstraData: () => dispatch(getEkstraData()),
	  updateEkstraData: (data: any) => dispatch(updateEkstraData(data)),
	  insertEkstraData: (data: any) => dispatch(insertEkstraData(data)),
	  deleteEkstraData: (data: any) => dispatch(deleteEkstraData(data))
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(Ekstra); 
