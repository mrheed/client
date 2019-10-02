import React from 'react';
import { AppContainer } from "."


class Reportsz extends React.Component {
	componentDidMount() {
		console.log("kwkwkw")
	}
	render() {
		return (
			<div>Report</div>
		)
	}
}

function Reports(props) {
	const [f, iff] = React.useState(false)
	React.useEffect(() => {
		iff(true)

	}, [])
	React.useEffect(() => {
		f && console.log("KWKW")
	}, [f])
	return (
		<div>Haha</div>
	)
}

export default Reports;