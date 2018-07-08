import React, { Component } from 'react'
import { get } from 'lodash'

import cn from 'classnames'
import classes from './ProjectTeam.scss'
import { Container, Row, Col } from 'stemn-shared/misc/Layout'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Link from 'stemn-shared/misc/Router/Link'
import HistoryGraph from 'stemn-shared/misc/History/HistoryGraph'
import SocialButton from 'stemn-shared/misc/Social/SocialButton'

export default class ProjectTeam extends Component {
  render() {
    const { project } = this.props
    const team = get(project, 'data.team', [])
    return (
      <div className={ classes.content }>
        <Container>
          <Row className="layout-row layout-wrap">
            { team.map((user) => {
              const userLinkParams = { userId: user._id }
              const historyParams = {
                projectId: project.data._id,
              }
              const historyQuery = {
                user: user._id,
              }

              return (
                <Col key={ user._id } className="flex-xs-100 flex-gt-xs-50">
                  <div className={ classes.userPanel }>
                    <div className={ cn('layout-row layout-align-start-center', classes.header) }>
                      <Link name="userRoute" params={ userLinkParams }>
                        <UserAvatar
                          picture={ user.picture }
                          name={ user.name }
                          className={ classes.avatar }
                          size={ 30 }
                          shape="square"
                        />
                      </Link>
                      <div className="layout-column flex">
                        <Link className="link-primary text-ellipsis" name="userRoute" params={ userLinkParams }>
                          { user.name }
                        </Link>
                        <div className={ cn(classes.blurb, 'text-ellipsis') }>{ user.blurb }</div>
                      </div>
                      <SocialButton
                        style={ { marginLeft: '10px' } }
                        type="follow"
                        entityType="user"
                        entityId={ user._id }
                      />
                    </div>
                    <div className={ classes.graph }>
                      <Link name="projectCommitsRoute" params={ historyParams } query={ historyQuery } className="layout-row">
                        <HistoryGraph
                          entityType="user"
                          entityId={ user._id }
                          parentType="project"
                          parentId={ project.data._id }
                        />
                      </Link>
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
