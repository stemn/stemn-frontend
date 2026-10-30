import React, { Component } from 'react'
import { fromNow } from 'stemn-shared/utils/date'
import classes from './ProjectThread.module.scss'
import cn from 'classnames'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'
import SubSubHeader from 'modules/SubSubHeader'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Tag from 'stemn-shared/misc/Tags/Tag'
import DatePicker from 'stemn-shared/misc/Calendar/DatePicker/DatePicker'
import UserMinimalRow from 'stemn-shared/misc/Users/UserMinimalRow'
import UserSelect from 'stemn-shared/misc/Users/UserSelect/UserSelect.jsx'
import TimelineVertical from 'stemn-shared/misc/SyncTimeline/TimelineVertical'
import CommentNew from 'stemn-shared/misc/Comments/Comment/CommentNew.jsx'
import { MdDone, MdAdd, MdMoreHoriz } from 'react-icons/md'
import ThreadLabelDots from 'stemn-shared/misc/Threads/ThreadLabelDots/ThreadLabelDots.jsx'
import Link from 'stemn-shared/misc/Router/Link'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
import Input from 'stemn-shared/misc/Input/Input/Input'
import LabelSelect from 'stemn-shared/misc/Threads/LabelSelect/LabelSelect'
import ThreadTimelineEmpty from 'stemn-shared/misc/Threads/ThreadTimelineEmpty'
import { Breadcrumbs, Crumb } from 'stemn-shared/misc/Breadcrumbs'
import { SimpleIconButton } from 'stemn-shared/misc/Buttons/SimpleIconButton'
import DueDate from 'stemn-shared/misc/Threads/ThreadDueDate'
import Popover from 'stemn-shared/misc/Popover'
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList'
import SocialButton from 'stemn-shared/misc/Social/SocialButton'
import { permissionsIsMin } from 'stemn-shared/misc/Auth/Auth.utils'
import { get, has } from 'lodash'
import { Helmet } from 'react-helmet-async'
import { projectThreadsRoute, notFound } from 'route-actions'

export default class ProjectThread extends Component {
  state = {
    // The title being edited (edit mode), saved with the Save button
    name: undefined,
  }
  saveName = () => {
    const { name } = this.state
    if (name !== undefined && name !== this.props.thread.data.name) this.props.updateThread({ name })
    this.setState({ name: undefined })
  }
  dropdownOptions = [
    {
      value: false,
      name: 'Status: Open',
    },
    {
      value: true,
      name: 'Status: Closed',
    },
  ]
  menu = [
    {
      label: 'Delete Thread',
      onClick: () => {
        const { deleteThread, project, pushRoute } = this.props
        deleteThread()
          .then(() => pushRoute(projectThreadsRoute({ projectId: project.data._id })))
          .catch(() => undefined) // toasted by the mutation cache
      },
    },
  ]
  sidebarEdit = () => {
    const { thread, project, board, updateThread } = this.props

    const groupOptions = board.data.groups.map((group) => ({
      value: group._id,
      name: group.name,
    }))

    const routeParams = {
      projectId: project.data._id,
    }

    return (
      <Col className="flex-gt-xs-30 flex-order-xs-0">
        <div className={classes.panel}>
          <div className="text-mini-caps">Groups</div>
          <SimpleIconButton
            name="projectSettingsThreadsRoute"
            params={routeParams}
            className={classes.miniButton}
            title="Group Settings"
          >
            <MdAdd size={16} />
          </SimpleIconButton>
          <PopoverDropdown
            options={groupOptions}
            onChange={(option) => updateThread({ group: option.value })}
            value={thread.data.group}
            style={{ width: '100%' }}
          >
            Group:&nbsp;
          </PopoverDropdown>
        </div>
        <div className={classes.panel}>
          <div className="text-mini-caps">Due Date</div>
          <DatePicker onChange={(due) => updateThread({ due })} value={thread.data.due} />
        </div>
        <div className={classes.panel}>
          <div className="text-mini-caps">Labels</div>
          <SimpleIconButton
            name="projectSettingsThreadsRoute"
            params={routeParams}
            className={classes.miniButton}
            title="Group Settings"
          >
            <MdAdd size={16} />
          </SimpleIconButton>
          <LabelSelect
            value={thread.data.labels}
            onChange={(labels) => updateThread({ labels })}
            labelInfo={board.data.labels}
          />
        </div>
        <div className={classes.panel}>
          <div className="text-mini-caps">Assigned Users</div>
          <SimpleIconButton
            name="projectSettingsTeamRoute"
            params={routeParams}
            className={classes.miniButton}
            title="Group Settings"
          >
            <MdAdd size={16} />
          </SimpleIconButton>
          <UserSelect
            onChange={(users) => updateThread({ users })}
            value={thread.data.users}
            users={project.data.team}
          />
        </div>
      </Col>
    )
  }
  sidebarNonEdit = () => {
    const { thread, board } = this.props
    const group = board.data.groups.find((group) => group._id === thread.data.group)

    const threadRouteParams = {
      projectId: board.data.project,
    }

    return (
      <Col className="flex-gt-xs-30 flex-order-xs-0">
        <div className={classes.panel}>
          <div className="text-mini-caps">Group</div>
          {group.name}
        </div>
        {thread.data.due && (
          <div className={classes.panel}>
            <div className="text-mini-caps">Due Date</div>
            <DueDate due={thread.data.due} />
          </div>
        )}
        {thread.data.labels && thread.data.labels.length > 0 && (
          <div className={classes.panel}>
            <div className="text-mini-caps">Labels</div>
            <ThreadLabelDots
              labels={thread.data.labels}
              labelInfo={board.data.labels}
              tag
              name="projectThreadsRoute"
              params={threadRouteParams}
              link
            />
          </div>
        )}
        {thread.data.users.length >= 0 && (
          <div className={classes.panel}>
            <div className="text-mini-caps">Assignees</div>
            {thread.data.users.map((user) => (
              <UserMinimalRow key={user._id} user={user} />
            ))}
          </div>
        )}
      </Col>
    )
  }
  render() {
    const {
      thread,
      project,
      board,
      threadId,
      timeline,
      timelineCacheKey,
      location,
      currentUser,
      replaceRoute,
      updateThread,
    } = this.props

    if (thread && thread.error) {
      replaceRoute(notFound())
    }

    if (thread && thread.data && board && board.data && project && project.data) {
      const group = board.data.groups.find((group) => group._id === thread.data.group)

      const userRouteParams = {
        userId: thread.data.owner._id,
      }
      const threadRouteParams = {
        projectId: project.data._id,
        threadId: thread.data._id,
      }

      const isOwner = thread.data.owner._id === currentUser._id
      const currentUserRole = get(
        project.data.team.find((member) => member._id === currentUser._id),
        'permissions.role',
      )
      const isAdmin = currentUserRole && permissionsIsMin(currentUserRole, 'admin')
      const canEdit = isOwner || isAdmin
      const edit = canEdit && location.pathname.endsWith('/edit')

      return (
        <div>
          {has(thread, 'data.name') && (
            <Helmet>
              <title>{`Thread: ${thread.data.name} by ${thread.data.owner.name}`}</title>
            </Helmet>
          )}
          <SubSubHeader>
            <div className="rel-box">
              <Breadcrumbs>
                <Crumb name="projectThreadsRoute" params={{ projectId: project.data._id }} text="Threads" />
                <Crumb
                  name="projectThreadsRoute"
                  params={{ projectId: project.data._id }}
                  query={{ groups: [group._id] }}
                  text={group.name}
                />
                <Crumb text={thread.data.name || 'Untitled Thread'} />
              </Breadcrumbs>
              {canEdit && (
                <Popover preferPlace="below">
                  <SimpleIconButton className={classes.settingsButton}>
                    <MdMoreHoriz size="20px" />
                  </SimpleIconButton>
                  <PopoverMenuList menu={this.menu} />
                </Popover>
              )}
              <br />
              <h2 className={classes.title}>
                {edit ? (
                  <Input
                    changeAction={({ value }) => this.setState({ name: value })}
                    className="dr-input"
                    placeholder="Thread Title"
                    value={this.state.name === undefined ? thread.data.name : this.state.name}
                  />
                ) : (
                  <span>{thread.data.name || 'Untitled Thread'}</span>
                )}
                {edit ? null : (
                  <span className={classes.number}>
                    &nbsp;{thread.data.threadNumber ? `#T${thread.data.threadNumber}` : null}
                  </span>
                )}
              </h2>
              <Row className="sm layout-xs-column layout-gt-xs-row">
                <Col className={cn('sm layout-row layout-align-start-center', classes.meta)}>
                  <Link name="userRoute" params={userRouteParams} className="layout-row layout-align-start-center">
                    <UserAvatar
                      className={classes.avatar}
                      name={thread.data.owner.name}
                      picture={thread.data.owner.picture}
                      size={20}
                      shape="square"
                    />
                    <b>{thread.data.owner.name}</b>
                  </Link>
                  <div>&nbsp;created this thread {fromNow(thread.data.created)}.</div>
                </Col>
                <div className="flex" />
                <Col className={cn('sm layout-row', classes.buttonRow)}>
                  <SocialButton className="flex-xs" type="follow" entityType="thread" entityId={thread.data._id} />
                  {canEdit ? (
                    <PopoverDropdown
                      className="flex-xs"
                      value={thread.data.complete}
                      options={this.dropdownOptions}
                      onChange={(option) => updateThread({ complete: option.value })}
                      style={{ marginLeft: '15px' }}
                    />
                  ) : (
                    <Tag
                      className={cn(!thread.data.complete ? 'warn' : 'success', 'flex-xs')}
                      style={{ margin: '0px', marginLeft: '15px' }}
                    >
                      <MdDone size={20} style={{ marginRight: '5px' }} />
                      {thread.data.complete ? 'Thread Closed' : 'Thread Open'}
                    </Tag>
                  )}
                </Col>
                {canEdit && (
                  <Col className="sm layout-column">
                    {edit ? (
                      <Button
                        className="primary"
                        name="projectThreadRoute"
                        params={threadRouteParams}
                        onClick={this.saveName}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button className="primary" name="threadEditRoute" params={threadRouteParams}>
                        Edit
                      </Button>
                    )}
                  </Col>
                )}
              </Row>
            </div>
          </SubSubHeader>
          <Container style={{ marginTop: '30px', marginBottom: '60px' }}>
            <Row className="layout-xs-column layout-gt-xs-row">
              <Col className="flex flex-order-xs-1 layout-column">
                {timeline && timeline.length > 0 && (
                  <TimelineVertical
                    className={classes.timeline}
                    items={timeline}
                    timelineCacheKey={timelineCacheKey}
                    entity={board}
                    type="thread"
                  />
                )}
                {timeline && timeline.length == 0 && (
                  <ThreadTimelineEmpty className={cn('flex-gt-xs', classes.empty)} />
                )}
                <CommentNew threadId={threadId} timelineCacheKey={timelineCacheKey} />
              </Col>
              {edit ? this.sidebarEdit() : this.sidebarNonEdit()}
            </Row>
          </Container>
        </div>
      )
    }
    return null
  }
}
