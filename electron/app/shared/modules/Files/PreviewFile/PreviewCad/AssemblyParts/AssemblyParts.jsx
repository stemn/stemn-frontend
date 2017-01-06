
import React, { PropTypes } from 'react';
import classes from './AssemblyParts.css';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import moment from 'moment';
import { isAssembly } from '../PreviewCad.utils.js';
import * as filesActions from '../../../Files.actions.js';
import SectionTitle       from 'electron/app/shared/modules/Titles/SectionTitle/SectionTitle.jsx';

const propTypesObject = {
  fileMeta        : PropTypes.object.isRequired,   // fileMeta for the assembly
  clickFn         : PropTypes.func.isRequired      // clickFn(part) - Run when a part is clicked
};

export const Row = React.createClass({
  render() {
    const { file, clickFn } = this.props;
    const timeFromNow = moment(file.modified).fromNow();
    return (
      <a className={classes.part+ ' layout-row'} onClick={()=>clickFn({file})}>
        <div className="flex">{file.name}</div>
        <div className={classes.time}>{timeFromNow}</div>
      </a>
    )
  }
})


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
    const { parts, assemblies, clickFn } = this.props;

    const childParts = () => {
      const partsOrdered = orderBy(parts.data, 'name');
      return (
        <div>
          <SectionTitle style={{margin: '30px 0 15px'}}>Assembly Parts</SectionTitle>
          { partsOrdered.map(file => <Row file={file} clickFn={clickFn} key={file._id}/>) }
        </div>
      )
    }

    const parentAssemblies = () => {
      return (
        <div>
          <SectionTitle style={{margin: '30px 0 15px'}}>Parent Assemblies</SectionTitle>
          { assemblies.map(file => <Row file={file} clickFn={clickFn} key={file._id}/>) }
        </div>
      )
    }

    const hasChildParts       = parts && parts.data;
    const hasParentAssemblies = assemblies && assemblies.length > 0;

    if(hasChildParts || hasParentAssemblies){
      return (
        <div>
          { hasChildParts
          ? childParts()
          : null }
          { hasParentAssemblies
          ? parentAssemblies()
          : null }
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
  const assembliesRaw = files.fileAssemblies[cacheKey];
  const assemblies = assembliesRaw ? assembliesRaw.map(cacheKey => files.fileMeta[cacheKey] && files.fileMeta[cacheKey].data ? files.fileMeta[cacheKey].data : undefined) : [];
  return {
    parts     : files.fileAssemblyParts[cacheKey],
    assemblies: assemblies
  };
}

export default connect(mapStateToProps)(AssemblyParts)
