import React, { Component } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid } from 'recharts'
import moment from 'moment'

const demoData = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
]

export default class HistoryGraph extends Component {
  tickFormatter = (tick) => {
    return moment(tick).format('DD MMM')
  }
  render() {
    const { data, loading, history } = this.props

    return (
      <ResponsiveContainer width="100%" height={ 150 }>
        <AreaChart data={ data }>
          <XAxis
            dataKey="date"
            fontSize="10px"
            stroke="rgba(0, 0, 0, 0.3)"
            tickFormatter={ this.tickFormatter }
          />
          <CartesianGrid
            stroke="rgb(248, 248, 248)"
          />
          <Area
            isAnimationActive={ false }
            type="monotone"
            dataKey="count"
            stackId="1"
            stroke="rgba(255, 255, 255, 0)"
            fill="rgb(68, 154, 211)"
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }
}
