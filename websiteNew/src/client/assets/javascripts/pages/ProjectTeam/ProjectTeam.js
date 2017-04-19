import React, { Component } from 'react'

import classNames from 'classnames'
import classes from './ProjectTeam.scss'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import { ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid } from 'recharts'
import Link from 'stemn-shared/misc/Router/Link'

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
]

class Graph extends Component {
  render() {
    return (
      <ResponsiveContainer width="100%" height={ 150 }>
        <AreaChart data={ data }>
          <XAxis
            dataKey="name"
            fontSize="10px"
            stroke="rgba(0, 0, 0, 0.3)"
          />
          <CartesianGrid
            stroke="rgb(248, 248, 248)"
          />
          <Area
            isAnimationActive={ false }
            type="monotone"
            dataKey="uv"
            stackId="1"
            stroke="rgba(255, 255, 255, 0)"
            fill="rgb(68, 154, 211)"
          />
          <Area
            isAnimationActive={ false }
            type="monotone"
            dataKey="pv"
            stackId="1"
            stroke="rgba(255, 255, 255, 0)"
            fill="rgba(68, 154, 211, 0.5)"
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }
}

export default class ProjectTeam extends Component {
  render() {
    const { project } = this.props
    return (
      <div className={ classes.content }>
        <Container>
          <Row className="layout-row layout-wrap">
            { project.data.team.map((user) => {
              const userLinkParams = { userId: user._id }

              return (
                <Col key={ user._id } className="flex-xs-100 flex-gt-xs-50">
                  <div className={ classes.userPanel }>
                    <div className={ classNames('layout-row layout-align-start-center', classes.header) }>
                      <Link name="userRoute" params={ userLinkParams }>
                        <UserAvatar
                          picture={ user.picture }
                          name={ user.name }
                          className={ classes.avatar }
                          size={ 30 }
                          shape="square"
                        />
                      </Link>
                      <div className="layout-column">
                        <Link className="link-primary" name="userRoute" params={ userLinkParams }>
                          { user.name }
                        </Link>
                        <div className={ classes.blurb }>{ user.blurb }</div>
                      </div>
                    </div>
                    <div className={ classes.graph }>
                      <Graph />
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </Container>
      </div>
    )
  }
}
