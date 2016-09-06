// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectActions from 'app/shared/actions/project.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Card.css';

// Sub Components
import moment from 'moment';
import { track } from 'react-redux-form';

import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import Textarea from 'app/renderer/main/components/Input/Textarea/Textarea';
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import UserSelect from 'app/renderer/main/components/Users/UserSelect/UserSelect.jsx'


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  render() {
    const { style, task, entityModel } = this.props;

    return (
      <div style={style} className={classNames(classes.card, 'layout-row flex')} id={style ? task._id : null}>
        <Checkbox />
        <div className={classes.text + ' flex'}>
          <Textarea
            model={`${entityModel}.title`}
            value={task.title}
            className="input-plain"
            type="text"
            placeholder="Task description" />
        </div>
          <PopoverMenu preferPlace="right" disableClickClose={true}>
            <UserAvatar picture={task.users[0].picture} size="25px"/>
            <div className="PopoverMenu" style={{padding: '15px'}}>
              <UserSelect value="dropbox" />
              <div>asfsfa asfafsfsa asffs</div>
            </div>
          </PopoverMenu>
      </div>
    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({tasks}, {params, item, project}) {
  return {
    task: tasks.data[item._id],
    entityModel: `tasks.data[${item._id}]`
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
