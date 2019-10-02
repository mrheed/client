import React, { PropsWithChildren } from 'react';
import { connect } from 'react-redux';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AntTab, AntTabs } from '../ExamGrades/AntTab';
import { Crumb, Input } from '..'
import Remidi from './InputRemidi';
import Nilai from './InputNilai';
import Tugas from './InputTugas';
import { readExamTypes, readGradesList, getGradesWithCurrentSchoolYear } from '../../redux/ActionCreators/MiscActions';
import { readClassRecords } from '../../redux/ActionCreator';
import { Typography, Tooltip } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Download from '@material-ui/icons/CloudDownload';
import Upload from '@material-ui/icons/CloudUpload';
import ButtonBase from '@material-ui/core/ButtonBase';
import Chip from '@material-ui/core/Chip';
import { WithStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { hexToRgbA } from '../../Helpers';


class InputTab extends React.Component<InputTabProps> {
    state = {
        tab: 0,
        loaded: false,
        inc: 0,
        activeStep: 0,
        skipped: new Set(),
        import: [],
        mode: "Manual"
    }
    componentDidMount(){
        this.setState({loaded: true})
    }
    componentWillUnmount(){
        this.setState({loaded: false})
    }
    componentDidUpdate(prevProps: InputTabProps, prevState: any){
        if (this.state.loaded !== prevState.loaded) {
            this.props.class.data.length === 0 && this.props.readClassRecords()
            this.props.misc.grades.data.length === 0 && this.props.readGradesList()
            this.props.misc.examTypes.data.length === 0 && this.props.readExamTypes()
            !this.props.class_on_school_year.is_requested && this.props.getClassOnSchoolYear()
        }
        if (this.state.tab !== prevState.tab) {
            this.setState({activeStep: 0, import: []})
        }
    }
    handleChangeTab = (event: React.ChangeEvent<{}>, newIndex: number) => {
        this.setState({tab: newIndex})
    }
    handleChangeModeInput = (name: any) => {
        this.setState({mode: name})
    }
    handleExportData = (data: any, title: string) => {
        var wb = XLSX.utils.book_new();
        var st = title.split("").splice(24).join("")
        wb.Props = {
          Title: title + " Document",
          Subject: title,
          Author: "User",
          CreatedDate: new Date()
        };
        wb.SheetNames.push("Sheet");
        var ws_data = [data.header];
        for (let i = 0; i < data.rows.length; i++) ws_data.push(data.rows[i])
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        wb.Sheets["Sheet"] = ws;
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        function s2ab(s: any) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
        }
      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), title + '.xlsx');
      this.setState((prev: any) => ({activeStep: prev.activeStep + 1}))
    }
    handleImportData = (event: any) => {
      var targetFile = event.target.files![0]
      var fileReader = new FileReader()
      var setState = this.setState.bind(this)
      fileReader.readAsArrayBuffer(targetFile)
      fileReader.onload = function(e: ProgressEvent) {
        var arrayBuffer: Uint8Array = new Uint8Array(fileReader.result! as ArrayBuffer)
        var workBook = XLSX.read(arrayBuffer, {type: 'array'})
        var files_sheet_name = workBook.SheetNames[0]
        var workSheet = workBook.Sheets[files_sheet_name]
        var json_value = XLSX.utils.sheet_to_json(workSheet)
        var changedVals = json_value.map((x: any) => {
          // Define empty object
          var obj: any = {}
          // Manipulate the object keys
          Object.keys(x).map((z: string) => {
            Object.assign(obj, {[z.split(" ").join("") as string] : x[z]})
          })
          // return the manipulated object
          return obj 
        })
        setState({import: changedVals})
      } 
      event.target.value = ""
      this.setState((prev: any) => ({
        activeStep: prev.activeStep + 1
      }))
    }
    handleChangeCheck = (name: string, values: any, setState: Function, selectedOption: any) => {
        setState = this.setState.bind(this)
        const keys = Object.keys(values)
        !Object.keys(values)
        .map((x: string) => Array.isArray(values[x].value) 
          ? values[x].value.length === 0 
          : values[x].value === null).includes(true) && (setState({kkm: 0}))
        var isEmpty = Array.isArray(values[name].value) ? values[name].value.length === 0 : values[name].value === null
        var isEmptySo = Array.isArray(selectedOption) ? selectedOption.length === 0 : selectedOption === null 
        var valCheck = !isEmpty && (Array.isArray(values[name].value) ? values[name].value.length : values[name].value.value)
        var soCheck = !isEmptySo && (Array.isArray(selectedOption) ? selectedOption.length : selectedOption.value)
        if (valCheck && valCheck !== soCheck) {
            keys.map((x: string, i: number) => {
                if (x === name) {
                    for (let i2 = i; i2 <= Object.keys(values).length-1; i2++) {
                        if (x !== keys[i2]) {
                            values[keys[i2]].value = null
                        }
                    }
                }
            })
        }
    }
  getSteps = (): string[] => {
    return ['Pastikan data benar', 'Download file dibawah ini', 'Import file yang telah didownload'];
  }
  isStepOptional = (step: number) => {
      return step === 1;
  }
  getStepContent = (step: number) => {
      switch (step) {
          case 0:
          return 'Pastikan data terpilih dengan benar...';
          case 1:
          return 'Download file dibawah ini, lalu isi data sesuai kolom';
          case 2:
          return 'Import file yang telah di isi sebelumnya';
          default:
          return 'Langkah tersesat';
      }
  }
  hS = (prevSkipped: any) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(this.state.activeStep);
      return newSkipped
  }
  isStepSkipped = (step: number) => {
    return this.state.skipped.has(step);
  }
  handleNext = () => {
      let newSkipped = this.state.skipped;
      if (this.isStepSkipped(this.state.activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(this.state.activeStep);
      }
      this.setState((prev: any) => ({
        activeStep: prev.activeStep + 1,
        skipped: newSkipped
      }))
  }
  handleBack = () => {
      this.setState((prev: any) => ({
          activeStep: prev.activeStep - 1
      }))
  }
  handleSkip = () => {
      if (!this.isStepOptional(this.state.activeStep)) {
          throw new Error("You can't skip a step that isn't optional.");
      }
      this.setState((prev: any) => ({
          activeStep: prev.activeStep + 1,
          skipped: this.hS(prev.skipped)
      }))
  }
  handleReset = () => {
      this.setState({activeStep: 0, import: []});
  }
  showExcelMode = (data: any, title: string) => {
    const { skipped, activeStep } = this.state
      return (
          <div className={this.props.classes.rootStep}>
          <Stepper activeStep={activeStep}>
          {this.getSteps().map((label: string, index: number) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div className={this.props.classes.stepWrapper}>
        {activeStep === this.getSteps().length ? (
            <div>
            <Typography className={this.props.classes.instructions}>
              Langkah - langkah berhasil dilalui anda dapat melihat preview data yang anda upload pada tabel dibawah ini, ulangi jika data tidak cocok atau dapat di edit pada kolom nilai
            </Typography>
            <Button onClick={this.handleReset} variant="outlined" color="secondary" className={this.props.classes.button}>
              Ulangi
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={this.props.classes.instructions}>{this.getStepContent(activeStep)}</Typography>
            <div>
              <Button disabled={activeStep === 0} variant="outlined" onClick={this.handleBack} className={this.props.classes.button}>
                Back
              </Button>
              {this.isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSkip}
                  className={this.props.classes.button}
                >
                  Skip
                </Button>
              )}
              {activeStep === 1 && (
                <Button variant="contained" color="primary" onClick={() => this.handleExportData(data, title)} className={this.props.classes.button}>
                  Download
                  <Download className={this.props.classes.rightIcon} />
                </Button>
              )}
              {activeStep === 2 && (
                <>
                  <input accept=".xlsx, .xls, .csv" className={this.props.classes.input} id="raised-button-file" onChange={this.handleImportData} type="file" />
                  <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span" color="primary" className={this.props.classes.button}>
                      Import
                    <Upload className={this.props.classes.rightIcon} />
                    </Button>
                  </label>
                </>
              )}
              {activeStep === 0 && (
                <Button
                variant="contained"
                color="primary"
                onClick={this.handleNext}
                className={this.props.classes.button}
              >
                {activeStep === this.getSteps().length - 1 ? 'Finish' : "Selanjutnya"}
              </Button>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
      )
    }
    render() {
        return (
            <>
            <Crumb {...this.props} />
            <Grid container>
            <Grid container alignItems="center" className={this.props.classes.optWrapper}>
                <Grid>
                    {["Manual","Excel"].map((x: string) => {
                        const CBTN = React.forwardRef((props: PropsWithChildren<any>, ref: React.Ref<HTMLAnchorElement>) => (
                            <ButtonBase innerRef={ref} {...props} onClick={() => this.handleChangeModeInput(x)} />
                        ));
                        return (
                            <Chip 
                                key={x}
                                color="secondary"
                                variant={this.state.mode === x ? "default" : "outlined"}
                                component={CBTN} 
                                label={x} 
                                className={clsx(this.state.mode === x
                                    && this.props.classes.activeChip, this.props.classes.chip)} 
                            />
                        )
                    })}
                </Grid>
                <Typography variant="body1" className={this.props.classes.modeInfo}>Mode penginputan data {this.state.mode === "Manual" ? "secara manual" : "menggunakan excel"}</Typography>
            </Grid>
            <AntTabs value={this.state.tab} variant="scrollable" scrollButtons="auto" onChange={this.handleChangeTab}>
                <AntTab label="Nilai ulangan"/>
                <AntTab label="Nilai remidi"/>
                <AntTab label="Nilai tugas / tambahan"/>
            </AntTabs>
            <Grid container>
                { Object.keys(this.props.class_on_school_year).length !== 0 && 
                  (!this.props.class.loading && (!this.props.misc.grades.loading && !this.props.misc.examTypes.loading))
                    ? <>
                        {this.state.tab === 0 && <Nilai 
                            misc={this.props.misc} 
                            mode={this.state.mode}
                            state={this.state}
                            classOnSchoolYear={this.props.class_on_school_year}
                            showExcelStepper={this.showExcelMode}
                            handleChangeCheck={this.handleChangeCheck}>Input nilai ulangan</Nilai>}
                        {this.state.tab === 1 && <Remidi 
                            misc={this.props.misc} 
                            mode={this.state.mode}
                            state={this.state}
                            classOnSchoolYear={this.props.class_on_school_year}
                            showExcelStepper={this.showExcelMode}
                            handleChangeCheck={this.handleChangeCheck}>Input nilai remidi</Remidi>}
                        {this.state.tab === 2 && <Tugas 
                            misc={this.props.misc} 
                            mode={this.state.mode}
                            state={this.state}
                            classOnSchoolYear={this.props.class_on_school_year}
                            showExcelStepper={this.showExcelMode}
                            handleChangeCheck={this.handleChangeCheck}>Input nilai tugas/tambahan</Tugas>} 
                    </>
                    : <div>loading</div>
                }
            </Grid>
            </Grid>
            </>
        )
    }
}

const useStyles = (theme: Theme) =>
  createStyles({
    wrapper: {
      width: "100%",
      overflowX: "auto",
      boxShadow: "none"
    },
    input: {
      display: 'none',
    },
    rootStep: {
      width: "100%"
    },
    stepWrapper: {
      padding: theme.spacing(1.5),
      paddingTop: theme.spacing(0),
    },
    optWrapper: {
      margin: theme.spacing(1, 0)
    },
    modeInfo: {
      marginLeft: theme.spacing(1)
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    activeChip: {
      color: "white!important",
      boxShadow: String(theme.spacing(0.5, 0.5, 1.5)) + " " + hexToRgbA(theme.palette.secondary.main, 0.44),
      transition: "all 0.5s linear"
    },
    chip: {
      transition: "all 0.5s linear",
      padding: theme.spacing(0.5),
      margin: theme.spacing(1, 0),
      marginRight: theme.spacing(1),
      cursor: "pointer",
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })

interface InputTabProps extends WithStyles<typeof useStyles> {
    readExamTypes: () => void;
    readGradesList: () => void;
    readClassRecords: () => void;
    getClassOnSchoolYear: () => void;
    class_on_school_year: any;
    misc: {grades: any; examTypes: any};
    class: {data: any[], loading: boolean};
}

const mapDispatchToProps = (dispatch: any) => ({
    readExamTypes: () => dispatch(readExamTypes()),
    readGradesList: () => dispatch(readGradesList()),
    readClassRecords: () => dispatch(readClassRecords()),
    getClassOnSchoolYear: () => dispatch(getGradesWithCurrentSchoolYear())
})
const mapStateToProps = (state: any) => ({
    class: state.class,
    misc: state.misc,
    class_on_school_year: state.classOnSchoolYear
})
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(InputTab))