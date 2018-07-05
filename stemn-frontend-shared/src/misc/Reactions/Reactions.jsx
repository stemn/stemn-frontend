import React from 'react'
import cn from 'classnames'
import classes from './Reactions.css'
import Popover from 'stemn-shared/misc/Popover'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import { options, groupAndOrderReactions } from './Reactions.utils.js'
import Link from 'stemn-shared/misc/Router/Link'

export default class Reactions extends React.Component {
  render() {
    const { reactions, submitFn } = this.props
    const groupedReactions = reactions && reactions.length > 0 ? groupAndOrderReactions(reactions, options) : []
    return (
      <span>
        { groupedReactions.map(reaction => (
          <Popover
            key={ reaction.type }
            preferPlace="below"
            trigger="hoverDelay"
          >
            <a className={ classes.icon } onClick={ () => submitFn(reaction.type) }>
              { reaction.icon }
              <span>{ reaction.list.length }</span>
            </a>
            <div className="PopoverMenu">
              { reaction.list.map(userReaction => (
                <Link
                  name="userRoute"
                  params={ { userId: userReaction.owner._id } }
                  className={ cn(classes.listPopoverRow) }
                  key={ userReaction.owner._id }
                >
                  <UserAvatar
                    name={ userReaction.owner.name }
                    picture={ userReaction.owner.picture }
                    size={ 20 }
                    shape="square"
                  />
                  <div style={ { marginLeft: '10px' } }>
                    { userReaction.owner.name }
                  </div>
                </Link>
              ))}
            </div>
          </Popover>
        )) }
      </span>
    )
  }
}
