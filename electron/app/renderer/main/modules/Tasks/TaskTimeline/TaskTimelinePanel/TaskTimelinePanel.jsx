// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './TaskTimelinePanel.css';

// Sub Components
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'

export default React.createClass({
  render() {
    const { item, children, style } = this.props;

    return (
      <div className={classes.item + ' layout-row'} style={style}>
        <div className={classes.avatar}>
          <UserAvatar picture={item.user.picture} size="33" shape="square" />
        </div>
        <div className={classes.body + ' flex'}>
          <div className={classes.content}>
            {children}
          </div>
        </div>
      </div>
    )
  }
});
