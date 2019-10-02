import React from 'react'
import { CetakTabs, CetakTab } from './CetakTab';
import { Crumb } from '..'
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Rapor from './CetakRapor';
import Tugas from './CetakTugas';
import Ulangan from './CetakUlangan';
import { readGradesList, readExamTypes, getGradesWithCurrentSchoolYear } from '../../redux/ActionCreators/MiscActions'
import { readClassRecords } from '../../redux/ActionCreator';

class Cetak extends React.Component<CetakProps> {
    state = {
        tab: 0,
        grades: [],
        exType: [],
        kelas: [],
        loaded: false
    }
    componentDidMount(){
        this.setState({loaded: true})
    }
    componentDidUpdate(prevProps: CetakProps, prevState: React.ComponentState) {
        if (prevState.loaded !== this.state.loaded) {
            this.props.class.data.length === 0 
                ? this.props.readClassRecords() 
                : this.setState({kelas: this.props.class.data})
            this.props.misc.grades.data.length === 0 
                ? this.props.readGradesList() 
                : this.setState({grades: this.props.misc.grades.data})
            this.props.misc.examTypes.data.length === 0 
                ? this.props.readExamTypes() 
				: this.setState({exType: this.props.misc.examTypes.data})
			!this.props.class_on_school_year.is_requested 
				? this.props.getClassOnSchoolYear()
				: this.setState({class_on_school_year: this.props.class_on_school_year})
        }
        if (prevProps.class.loading !== this.props.class.loading) {
            this.setState({kelas: this.props.class.data})
        }
        if (prevProps.misc.grades.loading !== this.props.misc.grades.loading) {
            this.setState({grades: this.props.misc.grades.data})
		}
		if (prevProps.class_on_school_year.is_loading !== this.props.class_on_school_year.is_loading) {
			this.setState({class_on_school_year: this.props.class_on_school_year})
		}	
        if (prevProps.misc.examTypes.loading !== this.props.misc.examTypes.loading) {
            this.setState({exType: this.props.misc.examTypes.data})
        }
    }
    handleChangeTab = (event: React.ChangeEvent<{}>, newIndex: number) => {
        this.setState({tab: newIndex})
    }
    refreshValues = (name: string, values: any, selectedOption: any) => {
        const keys = Object.keys(values)
        var isEmpty = Array.isArray(values[name]) ? values[name].length === 0 : values[name] === ""
        var isEmptySo = Array.isArray(selectedOption) ? selectedOption.length === 0 : selectedOption === "" 
        var valCheck = !isEmpty && (Array.isArray(values[name]) ? values[name].length : values[name])
        var soCheck = !isEmptySo && (Array.isArray(selectedOption) ? selectedOption.length : selectedOption)
        if (valCheck && valCheck !== soCheck) {
            keys.map((x: string, i: number) => {
                if (x === name) {
                    for (let i2 = i; i2 <= Object.keys(values).length-1; i2++) {
                        if (x !== keys[i2]) {
                            values[keys[i2]] = Array.isArray(values[keys[i2]]) ? [] : ""
                        }
                    }
                }
            })
        }
    }
    render() {
    return(
            <>
                <Crumb {...this.props} />
                <Grid container justify="space-between" className={this.props.classes.wrapper}>
                    <Grid item xs={12} sm={2}>
                    <CetakTabs value={this.state.tab} variant="standard" centered className={this.props.classes.tabs} onChange={this.handleChangeTab}>
                        <CetakTab label="Cetak nilai ulangan" />
                        <CetakTab label="Cetak nilai tugas" />
                        <CetakTab label="Cetak nilai raport" />
                    </CetakTabs>
                    </Grid>
                    <Grid item className={this.props.classes.g1} xs={12} >
                    {
                        (!this.props.class.loading && !this.props.misc.grades.loading && !this.props.misc.examTypes.loading) ? (
                            (this.state.kelas.length && this.state.grades.length && this.state.exType.length) && (
                                <Grid container>
                                    {this.state.tab === 0 && 
                                        <Ulangan 
                                            state={this.state}
                                            refresh={this.refreshValues}
                                        />
                                    }
                                    {this.state.tab === 1 && <Tugas 
                                            state={this.state}
                                            refresh={this.refreshValues}
                                        />
                                    }
                                    {this.state.tab === 2 && <Rapor 
                                            state={this.state}
                                            refresh={this.refreshValues}
                                        />
                                    }
                                </Grid>
                            )
                        ) : <div>Loading</div>
                    }
                    </Grid>
                </Grid>
            </>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    wrapper: {
        marginTop: theme.spacing(3)
    },
    g1: {
        flexGrow: 1,
        maxWidth: "81.5%",
        flexBasis: "81.5%"
    },
    tabs: {
        backgroundColor: "white",
        borderRadius: theme.spacing(1),
        boxShadow: theme.shadows[1],
        marginBottom: theme.spacing(4)
    }
})

interface CetakProps extends WithStyles<typeof styles> {
	getClassOnSchoolYear: () => void;
	readClassRecords: () => void;
    readGradesList: () => void;
    readExamTypes: () => void;
	class_on_school_year: any;
	appSetting: any;
    class: any;
    misc: any;
}

const mapStateToProps = (state: any) => ({
	class_on_school_year: state.classOnSchoolYear,
	class: state.class,
    misc: state.misc,
})
const mapDispatchToProps = (dispatch: any) => ({
	getClassOnSchoolYear: () => dispatch(getGradesWithCurrentSchoolYear()),
    readClassRecords: () => dispatch(readClassRecords()),
    readGradesList: () => dispatch(readGradesList()),
	readExamTypes: () => dispatch(readExamTypes()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Cetak))
