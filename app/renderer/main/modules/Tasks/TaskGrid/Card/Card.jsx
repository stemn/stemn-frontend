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
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  render() {
    const { style, task, x, y, entityModel } = this.props;
    console.log(this.props);

    return (
      <div style={style} className={classNames(classes.card, 'layout-row flex')} id={style ? task._id : null}>
        <Checkbox />
        <div className={classes.text + ' flex'}>
          <Textarea
            model={`${entityModel}.items[${x}].cards[${y}].title`}
            value={task.title}
            className="input-plain"
            type="text"
            placeholder="Task description" />
        </div>
        <UserAvatar picture={task.users[0].picture} size="25px"/>
      </div>
    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({tasks, projectSettings}, {params, item, project, entityModel}) {
  return {
    task: tasks[project._id].items[item._id],
    entityModel: entityModel
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ProjectActions: bindActionCreators(ProjectActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);



//            model={track(`${entityModel}.items[].title`, { _id: this.props.item._id })}
