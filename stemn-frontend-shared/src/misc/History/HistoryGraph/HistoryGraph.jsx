import React, { Component } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid, Tooltip } from 'recharts'
import moment from 'moment'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay'

export default class HistoryGraph extends Component {
  tickFormatter = (tick) => moment(tick).format('DD MMM')
  tooltipLabelFormatter = (date) => moment(date).format('Do MMM YYYY')
  render() {
    const { data, loading, hasLoaded } = this.props

    const dataFormatted = data.map((item) => ({
      date: item.date,
      Commits: item.counts ? item.counts.commit : undefined,
      Revisions: item.counts ? item.counts.revision : undefined,
      Threads: item.counts ? item.counts.thread : undefined,
    }))

    return (
      <div className="rel-box" style={{ width: '100%', height: '100%' }}>
        <LoadingOverlay show={loading && !hasLoaded} size="sm" background="rgba(255, 255, 255, 0.8)" />
        <div style={{ marginBottom: '-10px' }}>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={dataFormatted}>
              <XAxis dataKey="date" fontSize="10px" stroke="rgba(0, 0, 0, 0.3)" tickFormatter={this.tickFormatter} />
              <CartesianGrid stroke="rgb(248, 248, 248)" />
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey="Revisions"
                stackId="1"
                stroke="rgba(255, 255, 255, 0)"
                fill="rgb(68, 74, 211)"
              />
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey="Commits"
                stackId="1"
                stroke="rgba(255, 255, 255, 0)"
                fill="rgba(68, 154, 211, 1)"
              />
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey="Threads"
                stackId="1"
                stroke="rgba(255, 255, 255, 0)"
                fill="rgba(68, 200, 211, 0.8)"
              />
              <Tooltip
                labelFormatter={this.tooltipLabelFormatter}
                itemStyle={{ color: 'rgba(0, 0, 0, 0.5)', marginTop: '3px' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }
}
