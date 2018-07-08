import React from 'react'
import cn from 'classnames'
import moment from 'moment'

import { groupRevisions } from 'stemn-shared/misc/Timeline/Timeline.utils.js'
import pluralise from 'stemn-shared/utils/strings/pluralise'

import TogglerExpand from 'stemn-shared/misc/Toggler/TogglerExpand/TogglerExpand.jsx'
import UserAvatar    from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import Link from 'stemn-shared/misc/Router/Link'
import styles from './SidebarTimelineRow.css'

export default class SidebarTimelineRow extends React.Component {
  state = {
    isOpen: false,
  };

  toggle = (toState) => {
    this.setState({ isOpen: toState === null ? !this.state.isOpen : toState })
  };

  render() {
    const { item } = this.props
    const { isOpen } = this.state
    const timeFromNow = moment(item.timestamp).fromNow()
    if (item.event === 'commit') {
      const groupedRevisions = groupRevisions(item.data.items)

      const routeParams = {
        projectId: item.data.project._id,
        commitId: item._id,
      }

      const getChildRows = () => {
        if (isOpen) {
          return groupedRevisions.map(file => (
            <Link
              name="commitRoute"
              params={ routeParams }
              activeClassName={ styles.active }
              key={ file._id }
              className={ cn(styles.timelineRow, styles.inner, 'layout-row') }
            >
              <div className="flex text-ellipsis">{file.data.path}</div>
              <div>{pluralise(file.revisions.length, 'revision')}</div>
            </Link>
          ))
        }
      }

      return (
        <div>
          <Link
            name="commitRoute"
            params={ routeParams }
            activeClassName={ styles.active }
            className={ cn('layout-row', 'layout-align-start-center', styles.timelineRow) }
          >
            <div className={ `${styles.inner} flex layout-row layout-align-start-center` }>
              <UserAvatar picture={ item.user.picture } name={ item.user.name } size="40" />
              <div className={ `${styles.text} flex text-ellipsis` }>
                <b>{item.data.name}</b>
                <div style={ { marginTop: '5px' } }>{timeFromNow} by {item.user.name}</div>
              </div>
            </div>
            <TogglerExpand isActive={ isOpen } onClick={ () => this.toggle(null) }>
              {groupedRevisions.length}
            </TogglerExpand>
          </Link>
          {getChildRows()}
        </div>
      )
    } 
    return null
    
    //    else {
    //      return (
    //        <div className={cn('layout-row', 'layout-align-start-center', styles.timelineRow, {[styles.active]: this.props.isActive})}>
    //          <div className={styles.inner + ' flex layout-row layout-align-start-center'} onClick={this.props.clickFn}>
    //            <UserAvatar picture={this.props.item.user.picture} name={this.props.item.user.name} size="40"/>
    //            <div className={styles.text + ' flex text-ellipsis'}>
    //              <b>{this.props.item.data.path}</b>
    //              <div style={{marginTop: '5px'}}>{timeFromNow} by {this.props.item.user.name}</div>
    //            </div>
    //          </div>
    //        </div>
    //      )
    //    }
  }
}
