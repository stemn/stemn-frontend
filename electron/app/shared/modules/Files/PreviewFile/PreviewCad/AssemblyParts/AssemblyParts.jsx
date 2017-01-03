
import React from 'react';
import classes from './AssemblyParts.css';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import moment from 'moment';
import { isAssembly } from '../PreviewCad.utils.js';
import * as filesActions from '../../../Files.actions.js';
import SectionTitle       from 'app/shared/modules/Titles/SectionTitle/SectionTitle.jsx';

export const AssemblyParts = React.createClass({
  onMount (nextProps, prevProps) {
//    if(!prevProps || nextProps.fileMeta != prevProps.fileMeta){
//      if(isAssembly(nextProps.fileMeta.data.extension)){
//        nextProps.dispatch(filesActions.getAssemblyParts({
//          fileId     : nextProps.fileMeta.data.fileId,
//          projectId  : nextProps.fileMeta.data.project._id,
//          revisionId : nextProps.fileMeta.data.revisionId,
//        }))
//      }
//    }
  },
  componentDidMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  render() {
    const { parts } = this.props;
    if(parts && parts.data){
      const partsOrdered = orderBy(parts.data, 'name');
      return (
        <div>
          <SectionTitle style={{margin: '30px 0 15px'}}>Assembly Parts</SectionTitle>
          {partsOrdered.map(part => {
            const timeFromNow = moment(part.modified).fromNow();
            return (
              <a className={classes.part+ ' layout-row'}>
                <div className="flex">{part.name}</div>
                <div className={classes.time}>{timeFromNow}</div>
              </a>
            )})}
        </div>
      )
    }
    else{
      return null
    }
  }
})

const mapStateToProps = ({files}, {fileMeta}) => {
  const cacheKey = fileMeta.data.fileId+'-'+fileMeta.data.revisionId
  return {
    parts: files.fileAssemblyParts[cacheKey]
  };
}

export default connect(mapStateToProps)(AssemblyParts)
