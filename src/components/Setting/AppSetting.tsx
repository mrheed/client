import React, { ChangeEvent } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';  
import Tooltip from '@material-ui/core/Tooltip';  
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton'; 
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Edit from '@material-ui/icons/Edit';  
import Check from '@material-ui/icons/Check';  
import Close from '@material-ui/icons/Close';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class AppSetting extends React.Component<AppSettingProps> {
    state = {
        defaultData: {
            tahun_ajaran: 0,
            semester: 0,
            nama_sekolah: "",
            deskripsi_sekolah: ""
        },
        editable: {
            tahun_ajaran: {
                state: false,
                value: this.props.appSetting.application.tahun_ajaran
            },
            semester: {
                state: false,
                value: this.props.appSetting.application.semester
            },
            nama_sekolah: {
                state: false,
                value: this.props.appSetting.application.nama_sekolah
            },
            deskripsi_sekolah: {
                state: false,
                value: this.props.appSetting.application.deskripsi_sekolah
            }
        },
        mounted: false
    }

    componentDidMount(){
        this.setState({
            mounted: true
        })
    }

    handleEditable = (nama: string) => {
        this.setState((oldState: any) => ({
            editable: {
                ...oldState.editable,
                [nama]: {
                    ...oldState.editable[nama],
                    state: !oldState.editable[nama].state
                }
            }
        }))
    }
    onBlurDefaultVal = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        const defData: any = this.state.defaultData
        defData[event.target.name as string] = (event.target.name === "tahun_ajaran" || event.target.name === "semester") ? parseInt(event.target.value as string) : event.target.value
    }
    handleSubmitDefaultVals = () => {
        this.props.todoFn.insertAppSetting({
            tab: "application",
            data: this.state.defaultData
        })
    }
    handlePutSetting = (nama: string) => {
        this.props.todoFn.updateAppSetting({
            type: "*",
            tab: "application",
            data: {
                tahun_ajaran: this.state.editable.tahun_ajaran.value,
                nama_sekolah: this.state.editable.nama_sekolah.value,
                deskripsi_sekolah: this.state.editable.deskripsi_sekolah.value,
                semester: this.state.editable.semester.value
            }
        })
        this.handleEditable(nama)
    }
    handleSendPostData = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        this.setState({
            editable: {
                ...this.state.editable,
                [String(event.target.name)]: {
                    ...(this.state.editable as any)[event.target.name as string],
                    value: (event.target.name === "tahun_ajaran" || event.target.name === "semester") ? parseInt(event.target.value as string) : event.target.value
                }   
            }
        })
    }

    render() {
        console.log(this.state.editable)
        return (
            <Grow in={this.props.tab === 0}>
            <Grid className={this.props.classes.gridOpt}>
                <Typography className={this.props.classes.title}>Application Setting</Typography>
                <Grid container alignItems="center">
                    {
                        this.state.editable.nama_sekolah.state
                            ? <>
                                <div className={this.props.classes.eachInput}>
                                    <TextField
                                        variant="outlined" 
                                        name="nama_sekolah"
                                        fullWidth
                                        value={this.state.editable.nama_sekolah.value}
                                        onChange={this.handleSendPostData}
                                        label="Nama Sekolah"
                                    />
                                </div>
                                <Tooltip title="Apply" onClick={() => this.handlePutSetting("nama_sekolah")}>
                                    <IconButton><Check /></IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel" onClick={() => this.handleEditable("nama_sekolah")}>
                                    <IconButton><Close /></IconButton>
                                </Tooltip>
                            </> 
                            : <>
                                <div className={this.props.classes.eachInput}>
                                    <Typography>Nama Sekolah</Typography>
                                    <Typography variant="caption">{this.state.editable.nama_sekolah.value}</Typography>
                                </div>
                                <Tooltip title="Ubah nama sekolah" onClick={() => this.handleEditable("nama_sekolah")}>
                                    <IconButton><Edit /></IconButton>
                                </Tooltip>
                            </>
                    }
                </Grid>
                <Grid container alignItems="center">
                    {
                        this.state.editable.deskripsi_sekolah.state
                            ? <>
                            <div className={this.props.classes.eachInput}>
                                <TextField
                                    variant="outlined" 
                                    multiline
                                    rows={5}
                                    fullWidth
                                    value={this.state.editable.deskripsi_sekolah.value}
                                    name="deskripsi_sekolah"
                                    onChange={this.handleSendPostData}
                                    label="Deskripsi Sekolah"
                                />
                            </div>
                            <Tooltip title="Apply" onClick={() => this.handlePutSetting("deskripsi_sekolah")}>
                                <IconButton><Check /></IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel" onClick={() => this.handleEditable("deskripsi_sekolah")}>
                                <IconButton><Close /></IconButton>
                            </Tooltip>
                            </>
                            : <>
                            <div className={this.props.classes.eachInput}>
                                <Typography>Deskripsi Sekolah</Typography>
                                <Typography variant="caption">{this.state.editable.deskripsi_sekolah.value}</Typography>
                            </div>
                            <Tooltip title="Ubah deskripsi sekolah" onClick={() => this.handleEditable("deskripsi_sekolah")}>
                                <IconButton><Edit /></IconButton>
                            </Tooltip>
                            </>
                    }
                </Grid>
                <Grid container alignItems="center">
                    {
                        this.state.editable.tahun_ajaran.state 
                        ? <><div className={this.props.classes.eachInput}>
                                <TextField
                                    variant="outlined" 
                                    label="Tahun Ajaran" 
                                    type="number"
                                    fullWidth
                                    name="tahun_ajaran"
                                    value={this.state.editable.tahun_ajaran.value}
                                    onChange={this.handleSendPostData}
                                />
                            </div>
                            <Tooltip title="Apply" onClick={() => this.handlePutSetting("tahun_ajaran")}>
                                <IconButton><Check /></IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel" onClick={() => this.handleEditable("tahun_ajaran")}>
                                <IconButton><Close /></IconButton>
                            </Tooltip>
                            </>
                        : <>
                            <div className={this.props.classes.eachInput}>
                                <Typography>Tahun Ajaran</Typography>
                                <Typography variant="caption">{this.state.editable.tahun_ajaran.value}</Typography>
                            </div>
                            <Tooltip title="Ubah tahun ajaran" onClick={() => this.handleEditable("tahun_ajaran")}>
                                <IconButton><Edit /></IconButton>
                            </Tooltip>
                        </>
                    }
                </Grid>
                <Grid container alignItems="center">
                    {
                        this.state.editable.semester.state 
                        ? <><div className={this.props.classes.eachInput}>
                                <InputLabel>Semester</InputLabel>
                                <Select 
                                    onChange={this.handleSendPostData} 
                                    inputProps={{name: "semester"}} 
                                    value={this.state.editable.semester.value}>
                                    <MenuItem value={1}>Ganjil</MenuItem>
                                    <MenuItem value={2}>Genap</MenuItem>
                                </Select>
                            </div>
                            <Tooltip title="Apply" onClick={() => this.handlePutSetting("semester")}>
                                <IconButton><Check /></IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel" onClick={() => this.handleEditable("semester")}>
                                <IconButton><Close /></IconButton>
                            </Tooltip>
                            </>
                        : <>
                            <div className={this.props.classes.eachInput}>
                                <Typography>Semester</Typography>
                                <Typography variant="caption">{this.state.editable.semester.value === 1 ? "Ganjil" : "Genap"}</Typography>
                            </div>
                            <Tooltip title="Ubah semester" onClick={() => this.handleEditable("semester")}>
                                <IconButton><Edit /></IconButton>
                            </Tooltip>
                        </>
                    }
                </Grid>
                <Dialog open={(this.props.appSetting.error && this.props.todoSetting.status !== "success")}>
                    <DialogTitle title="Lengkapi data sekolah dan konfigurasi aplikasi" />
                    <DialogContent>
                        <Grid container>
                            <TextField 
                                type="number"
                                name="tahun_ajaran"
                                label="Tahun ajaran"
                                onBlur={this.onBlurDefaultVal}
                                placeholder="Tahun ajaran"
                            />
                            <FormControl>
                                <InputLabel>Pilih Semester</InputLabel>
                                <Select 
                                    value={this.state.defaultData.semester} 
                                    onChange={this.onBlurDefaultVal} 
                                    inputProps={{name:"semester"}}>
                                    <MenuItem value={1}>Ganjil</MenuItem>
                                    <MenuItem value={2}>Genap</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <TextField 
                            type="string"
                            name="nama_sekolah"
                            label="Nama sekolah"
                            onBlur={this.onBlurDefaultVal}
                            placeholder="Nama sekolah"
                        />
                        <TextField 
                            multiline
                            label="Deskripsi sekolah"
                            name="deskripsi_sekolah"
                            fullWidth
                            onBlur={this.onBlurDefaultVal}
                            placeholder="Deskripsi sekolah..."
                            rows={10}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleSubmitDefaultVals}>Selesai</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Grow>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    eachInput: {
        marginRight: theme.spacing(6),
        marginBottom: theme.spacing(2)
    },
    gridOpt: {
        marginLeft: theme.spacing(6),
        padding: theme.spacing(2, 2)
    },
    title: {
        marginBottom: theme.spacing(2),
        letterSpacing: -0.5,
        fontSize: theme.typography.subtitle1.fontSize,
        fontWeight: 300,
    }
})

interface AppSettingProps extends WithStyles<typeof styles> {
    tab: number;
    todoFn: any;
    appSetting: any;
    todoSetting: any;
}

export default withStyles(styles)(AppSetting)