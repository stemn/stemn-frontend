
import React, { PropTypes } from 'react';
import classes from './AssemblyParts.css';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import moment from 'moment';
import { isAssembly } from '../PreviewCad.utils.js';
import * as filesActions from '../../../Files.actions.js';
import SectionTitle       from 'app/shared/modules/Titles/SectionTitle/SectionTitle.jsx';

const propTypesObject = {
  fileMeta        : PropTypes.object.isRequired,   // fileMeta for the assembly
  clickFn         : PropTypes.func.isRequired      // clickFn(part) - Run when a part is clicked
};

export const AssemblyParts = React.createClass({
  propTypes: propTypesObject,
  onMount (nextProps, prevProps) {
    if(!prevProps || nextProps.fileMeta != prevProps.fileMeta && nextProps.fileMeta.data){
      if(isAssembly(nextProps.fileMeta.data.extension)){
        nextProps.dispatch(filesActions.getAssemblyParts({
          fileId     : nextProps.fileMeta.data.fileId,
          projectId  : nextProps.fileMeta.data.project._id,
          revisionId : nextProps.fileMeta.data.revisionId,
        }))
      }
    }
  },
  componentDidMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  render() {
    const { parts, clickFn } = this.props;
    if(parts && parts.data){
      const partsOrdered = orderBy(parts.data, 'name');
      return (
        <div>
          <SectionTitle style={{margin: '30px 0 15px'}}>Assembly Parts</SectionTitle>
          {partsOrdered.map(file => {
            const timeFromNow = moment(file.modified).fromNow();
            return (
              <a className={classes.part+ ' layout-row'} onClick={()=>clickFn({file})}>
                <div className="flex">{file.name}</div>
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
  const cacheKey = fileMeta.data.fileId+'-'+fileMeta.data.revisionId;

  console.log(files.fileAssemblyParts);
  return {
    parts: files.fileAssemblyParts[cacheKey]
  };
}

export default connect(mapStateToProps)(AssemblyParts)
