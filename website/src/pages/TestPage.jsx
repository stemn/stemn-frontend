import React, { PropTypes } from 'react';
import store from 'website/src/app/redux/store.js';

import { Provider } from 'react-redux';
import { orderItemsByTime } from 'electron/app/renderer/main/modules/FileCompare/FileCompare.utils.js';
import FileBreadCrumbs      from 'electron/app/renderer/main/modules/FileList/components/FileBreadCrumbs.jsx'
//import FileCompareMenu      from 'electron/app/renderer/main/modules/FileCompare/FileCompareMenu/FileCompareMenu.jsx';
import Header               from 'electron/app/renderer/main/modules/Header/Header.jsx'
import DragResize           from 'electron/app/renderer/main/modules/DragResize/DragResize.jsx';
import SectionTitle         from 'electron/app/shared/modules/Titles/SectionTitle/SectionTitle.jsx';

import classes from './TestPage.css'

const TestPage = React.createClass({
  propTypes : {
    params  : PropTypes.object.isRequired,
  },
  getInitialState () {
    return {
      selected1    : undefined,
      selected2    : undefined,
      lastSelected : 1,
      mode         : 'single'
    }
  },
  render() {
    const { fileMeta, syncTimeline, relatedTasks } = this.props;
    const { mode, selected1, selected2 } = this.state;
    const hasFileMeta = fileMeta && fileMeta.data;
    const isPartOfProject = hasFileMeta && fileMeta.data.project && fileMeta.data.project._id;
    const items = orderItemsByTime(mode, selected1, selected2);
    const file1 = items[0] ? items[0].data : undefined;
    const file2 = items[1] ? items[1].data : undefined;
    const revisions = syncTimeline && syncTimeline.data ? syncTimeline.data.filter(item => item.event == 'revision') : [];

    return (
      <Provider store={store}>
        <div className="layout-column flex">
          <Header>
            <div className="no-drag">{hasFileMeta ? <FileBreadCrumbs meta={fileMeta.data} clickFn={this.clickCrumb} popup={true}/> : ''}</div>
            <div className="flex"></div>
            <div className="divider"></div>
          </Header>
          <div className="layout-row flex">
            <div className="layout-column flex">
            </div>
            <DragResize side="left" width="450" widthRange={[0, 450]} className="layout-column">
              <aside className={classes.sidebar + ' layout-column flex'} style={{minWidth: '400px', overflowY: 'auto'}}>
                <SectionTitle style={{marginBottom: '15px'}}>Meta</SectionTitle>
              </aside>
            </DragResize>
          </div>
        </div>
      </Provider>
    );
  }
});

export default TestPage;
