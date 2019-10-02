import React from 'react';
import { View, PDFViewer, Page, Document, Text, StyleSheet } from '@react-pdf/renderer'

const PDFUlangan = (props) => {
    const DATA = props.data[0]
    const HEADER = ["No", "Nama Lengkap", "Nilai"]
    const BORDER_COLOR = '#bfbfbf'
    const BORDER_STYLE = 'solid'
    const FONT_CELL = 10
    const FONT_HEAD = 11
    const COL1_WIDTH = 5
    const COLN_WIDTH = (100 - COL1_WIDTH) / (HEADER.length - 1)
    const styles = StyleSheet.create({
        body: {
            padding: 80,
			paddingTop: 30
        },
        title: {
            fontSize: 16,
        },
        table: {
            display: "table",
            width: "auto",
			marginTop: 10,
            borderStyle: BORDER_STYLE,
            borderColor: BORDER_COLOR,
            borderWidth: 1,
            borderRightWidth: 0,
            borderLeftWidth: 0,
            borderBottomWidth: 0
        },
        tableRow: {
            margin: "auto",
            flexDirection: "row"
        },
        tableCol1Header: {
            textAlign: "center",
            width: COL1_WIDTH + '%',
            borderStyle: BORDER_STYLE,
            borderColor: BORDER_COLOR,
            borderWidth: 1,
            borderTopWidth: 0
        },
        tableColHeader: {
            width: COLN_WIDTH + "%",
            borderStyle: BORDER_STYLE,
            borderColor: BORDER_COLOR,
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableCol1: {
            opacity: 0.7,
            textAlign: "center",
            width: COL1_WIDTH + '%',
            borderStyle: BORDER_STYLE,
            borderColor: BORDER_COLOR,
            borderWidth: 1,
            borderTopWidth: 0
        },
        tableCol: {
            opacity: 0.7,
            width: COLN_WIDTH + "%",
            borderStyle: BORDER_STYLE,
            borderColor: BORDER_COLOR,
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableCellHeader: {
            margin: 5,
            fontSize: FONT_HEAD,
            fontWeight: 500
        },
        tableCell: {
            margin: 5,
            fontSize: FONT_CELL
        },
        width100: {
            width: "100%!important"
        }
    });
    const TR = ({ children }, ...props) => {
        return <View {...props} style={styles.tableRow}>{children}</View>
    }
    const TD = ({ children }, ...props) => {
        return <View {...props} style={styles.tableCol}>{children}</View>
    }
    const TD1 = ({ children }, ...props) => {
        return <View {...props} style={styles.tableCol1}>{children}</View>
    }
    const TC = ({ children }, ...props) => {
        return <Text {...props} style={styles.tableCell}>{children}</Text>
    }
    const TCH = ({ children }, ...props) => {
        return <Text {...props} style={styles.tableCellHeader}>{children}</Text>
    }
    const TH = ({ children }, ...props) => {
        return <View {...props} style={styles.tableColHeader}>{children}</View>
    }
    const TH1 = ({ children }, ...props) => {
        return <View {...props} style={styles.tableCol1Header}>{children}</View>
    }
    const TABLE = ({ children }, ...props) => {
        return <View {...props} style={styles.table}>{children}</View>
    }
    const c = StyleSheet.create({
        mid: {
            width: "100%",
            borderColor: BORDER_COLOR,
            borderWidth: 1,
        },
        first: {
            ...styles.tableCol1,
            width: COL1_WIDTH + "%"
        },
        second: {
            ...styles.tableCol,
            width: (110 - COL1_WIDTH) / (HEADER.length - 1) + "%"
        },
        third: {
            ...styles.tableCol,
            width: (95 - COL1_WIDTH) / (HEADER.length - 1) + "%"
        },
        fourth: {
            ...styles.tableCol,
            width: (95 - COL1_WIDTH) / (HEADER.length - 1) + "%"
        },
        fiveth: {
            ...styles.tableCol,
            width: (95 - COL1_WIDTH) / (HEADER.length - 1) + "%"
        },
        firstH: {
            ...styles.tableCol1Header,
            width: COL1_WIDTH + "%"
        },
        secondH: {
            ...styles.tableColHeader,
            width: (110 - COL1_WIDTH) / (HEADER.length - 1) + "%"
        },
        thirdH: {
            ...styles.tableColHeader,
            width: (95 - COL1_WIDTH) / (HEADER.length - 1) + "%"
        },
        fourthH: {
            ...styles.tableColHeader,
            width: (95 - COL1_WIDTH) / (HEADER.length - 1) + "%"
        },
        fivethH: {
            ...styles.tableColHeader,
            width: (95 - COL1_WIDTH) / (HEADER.length - 1) + "%"
        },
        footDetail: {
            ...styles.tableCol,
            width: (110 - COL1_WIDTH) / (HEADER.length - 1) + "%"
        },
        footDetail2: {
            ...styles.tableCol,
            width: (95 - COL1_WIDTH) / (HEADER.length - 1) + "%"
        },
        cellDetail: {
            ...styles.tableCell,
            opacity: 1,
            fontWeight: 500
        },
        title: {
            fontWeight: 500,
			paddingBottom: 20,
            fontSize: 12,
            width: "100%",
            textAlign: "center"
        },
        desc: {
            fontSize: 10,
            opacity: 0.7,
            marginBottom: 5
        },
        rDesc: {
            fontSize: 10,
            opacity: 0.7,
            marginBottom: 5,
            width: "85%"
        },
        wDesc: {
            fontSize: 10,
            opacity: 0.7,
            marginBottom: 5,
            width: "13%",
        },
        dtb: {
            marginBottom: 5,
            display: "table",
            width: "auto"
        },
        sparator: {
            fontSize: 10,
            opacity: 0.7,
            marginBottom: 5,
            width: "2%"
        },
        marginB20: {
            marginBottom: 20,
        }
    })
		console.log((110 - COL1_WIDTH) / (HEADER.length - 1) + "%",(275 - COL1_WIDTH) / (HEADER.length - 1) + "%")
    return (
        <>
            <PDFViewer width="100%" height={window.innerHeight}>
                <Document title={"Daftar nilai tugas "+DATA.mapel+" kelas XII KJ"}>
                    <Page style={styles.body} orientation="landscape" >
                        <View style={c.title}><Text>Nilai Tugas Siswa SMKN 2 Wonosari</Text></View>
                        <View style={c.dtb}>
                            <View style={styles.tableRow}>
                                <View style={c.wDesc}><Text>Mata Pelajaran</Text></View>
                                <View style={c.sparator}><Text>:</Text></View>
                                <View style={c.rDesc}><Text>{DATA.mapel}</Text></View>
                            </View>
                        </View>
						<View style={c.dtb}>
                            <View style={styles.tableRow}>
                                <View style={c.wDesc}><Text>Nama Tugas</Text></View>
                                <View style={c.sparator}><Text>:</Text></View>
                                <View style={c.rDesc}><Text>{DATA.nama_tugas}</Text></View>
                            </View>
                        </View>
                        <View style={c.dtb}>
                            <View style={styles.tableRow}>
                                <View style={c.wDesc}><Text>Kelas</Text></View>
                                <View style={c.sparator}><Text>:</Text></View>
                                <View style={c.rDesc}><Text>{DATA.kelas}</Text></View>
                            </View>
                        </View>
                        <TABLE>
                            <TR>
                                <View style={c.firstH}>
                                    <Text style={styles.tableCellHeader}>No</Text>
                                </View>
                                <View style={c.secondH}>
                                    <Text style={styles.tableCellHeader}>Nama Siswa</Text>
                                </View>
                                <View style={c.thirdH}>
                                    <Text style={styles.tableCellHeader}>Nilai Tugas</Text>
                                </View>
                            </TR>
                            {DATA.data.map((x, i) =>
                                <TR>
                                    <View style={c.first}>
                                        <Text style={styles.tableCell}>{i+1}</Text>
                                    </View>
                                    <View style={c.second}>
                                        <Text style={styles.tableCell}>{x.nama}</Text>
                                    </View>
                                    <View style={c.third}>
                                        <Text style={styles.tableCell}>{x.nilai_tugas}</Text>
                                    </View>
                                </TR>)}
                            <TR>
                                <TD1><TC></TC></TD1>
                                <View style={c.footDetail}>
                                    <Text style={c.cellDetail}>Nilai Rata - rata</Text>
                                </View>
                                <View style={c.footDetail2}>
                                    <Text style={styles.tableCell}>{DATA.rata2}</Text>
                                </View>
                            </TR>
                            <TR>
                                <TD1><TC></TC></TD1>
                                <View style={c.footDetail}>
                                    <Text style={c.cellDetail}>Nilai Tertinggi</Text>
                                </View>
                                <View style={c.footDetail2}>
                                    <Text style={styles.tableCell}>{DATA.tertinggi}</Text>
                                </View>
                            </TR>
                            <TR>
                                <TD1><TC></TC></TD1>
                                <View style={c.footDetail}>
                                    <Text style={c.cellDetail}>Nilai Terendah</Text>
                                </View>
                                <View style={c.footDetail2}>
                                    <Text style={styles.tableCell}>{DATA.terendah}</Text>
                                </View>
                            </TR>
                        </TABLE>
                    </Page>
                </Document>
            </PDFViewer>
        </>
    )
}

export default PDFUlangan
