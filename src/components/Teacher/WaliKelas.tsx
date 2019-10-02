import React from 'react';
import { connect } from 'react-redux';
import { getWaliKelas } from '../../redux/ActionCreators/TeacherActions';
import Table from '../Table/CreateTable';

/* ----
    1. Kelas
    2. Guru Pemgampu
    3. NIS Guru
    4. Jumlah Siswa
    5. Action
---- */

class WaliKelas extends React.Component<WaliKelasProps> {
    state = {
        is_loaded: false
    }

    componentDidMount() {
        this.setState({is_loaded: true})
    }

    componentDidUpdate(prev_props: WaliKelasProps, prev_state: any) {
        if (prev_props.wali_kelas.loading !== this.props.wali_kelas.loading) {
            this.props.wali_kelas.data.length === 0 && this.props.getWaliKelas()
        }
    }

    render() {
        return (      
            <Table 
                data={["props.teacher_data.data"]}
                // onUpdate={
                //     {
                //         todoFunction: props.updateTeacherRecords,
                //         ...responseData
                //     }
                // }
                rowKey={["NIP", "Nama", "Mapel Diampu", "Kelas Diampu", "Jenis Kelamin"]}
                loadingData={true}
                // insertProps={insertProps}
                primaryKey="nip"
                tableTitle="Tabel Guru"
                withActions
                removeAdd
                withFilter
                // filterProps={filterProps} 
                // inputProps={inputProps} 
                componentProps={{head: [{key: "", label: ""}]}} 
                rowsPerPageArr={[5, 10, 15]} 
            />
        )
    }
}

interface WaliKelasProps {
    getWaliKelas: () => void;
    wali_kelas: any;
}

const mapStateToProps = (state: any) => ({
    wali_kelas: state.wali_kelas
})

const mapDispatchToProps = (dispatch: any) => ({
    getWaliKelas: () => dispatch(getWaliKelas())
})

export default connect(mapStateToProps, mapDispatchToProps)(WaliKelas)