import React from 'react';
import { AntTab, AntTabs } from '../ExamGrades/AntTab';
import { connect } from 'react-redux';
import { WithStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { readTeacherRecords, readClassRecords } from '../../redux/ActionCreator';
import { readGradesList } from '../../redux/ActionCreators/MiscActions';
import TeacherTable from './Teacher';


class TeacherTab extends React.Component<TeacherTabProps> {
    state = {
        is_loaded: false,
        tab_index: 0
    }

    componentDidMount() {
        this.setState({is_loaded: true})
    }

    componentDidUpdate(prev_props: TeacherTabProps, prev_state: any) {
        if (prev_state.is_loaded !== this.state.is_loaded && this.state.is_loaded) {
            this.props.class_data.data.length === 0 && this.props.getClassRecords()
            this.props.teacher_data.data.length === 0 && this.props.getTeacherRecords()
            this.props.grades_data.data.length === 0 && this.props.getGradesList()
        }
    }

    handle_tab_change = (e: React.ChangeEvent<{}>, new_index: number) => {
        this.setState({tab_index: new_index})
    }

    render() {
        return (
            <Grid>
                <AntTabs value={this.state.tab_index} onChange={this.handle_tab_change}>
                    <AntTab label="Tabel Guru"/>
                    <AntTab label="Tabel Wali Kelas"/>
                </AntTabs>
                {this.state.tab_index === 0 && <TeacherTable 
                    teacher_data={{data: this.props.teacher_data.data, loading: this.props.teacher_data.loading}}
                    class_data={this.props.class_data.data}
                    grade_list={this.props.grades_data.data}
                />
                
                }
            </Grid>
        )
    }
}


const styles = (theme: Theme) => createStyles({
    
})

interface TeacherTabProps extends WithStyles<typeof styles> {
    getTeacherRecords: () => void;
    getClassRecords: () => void;
    getGradesList: () => void;
    teacher_data: any;
    grades_data: any;
    class_data: any;
}

const mapDispatchToProps = (dispatch: any) => ({
    getTeacherRecords: () => dispatch(readTeacherRecords()),
    getClassRecords: () => dispatch(readClassRecords()),
    getGradesList: () => dispatch(readGradesList()),
})

const mapStateTopProps = (state: any) => ({
    teacher_data: state.teacher,
    class_data: state.class,
    grades_data: state.misc.grades
})

export default connect(mapStateTopProps, mapDispatchToProps)(withStyles(styles)(TeacherTab));