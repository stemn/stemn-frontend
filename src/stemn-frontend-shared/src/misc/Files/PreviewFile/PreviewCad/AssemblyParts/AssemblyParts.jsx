
import React from 'react'
import PropTypes from 'prop-types'
import classes              from './AssemblyParts.css'
import { connect }          from 'react-redux'
import { orderBy }          from 'lodash'
import moment               from 'moment'
import { isAssembly, isCad }       from '../PreviewCad.utils.js'
import {
  getAssemblyParts,
  getAssemblyParents,
}                           from '../../../Files.actions.js'
import SectionTitle         from 'stemn-shared/misc/Titles/SectionTitle/SectionTitle.jsx'
import LoadingOverlay       from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'

const propTypesObject = {
  fileMeta: PropTypes.object.isRequired,   // fileMeta for the assembly
  clickFn: PropTypes.func.isRequired,      // clickFn(part) - Run when a part is clicked
}

export class Row extends React.Component {
  render() {
    const { file, clickFn } = this.props
    const timeFromNow = moment(file.modified).fromNow()
    return (
      <a className={ `${classes.part} layout-row` } onClick={ () => clickFn({ file }) }>
        <div className="flex">{file.name}</div>
        <div className={ classes.time }>{timeFromNow}</div>
      </a>
    )
  }
}

export class AssemblyParts extends React.Component {
  static propTypes = propTypesObject;

  onMount = (nextProps, prevProps) => {
    if (!prevProps || nextProps.fileMeta !== prevProps.fileMeta && nextProps.fileMeta.data) {
      if (isAssembly(nextProps.fileMeta.data.extension)) {
        nextProps.dispatch(getAssemblyParts({
          fileId: nextProps.fileMeta.data.fileId,
          projectId: nextProps.fileMeta.data.project._id,
          revisionId: nextProps.fileMeta.data.revisionId,
        }))
      }
      if (isCad(nextProps.fileMeta.data.extension)) {
        nextProps.dispatch(getAssemblyParents({
          fileId: nextProps.fileMeta.data.fileId,
          projectId: nextProps.fileMeta.data.project._id,
          revisionId: nextProps.fileMeta.data.revisionId,
        }))
      }
    }
  };

  componentDidMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

  render() {
    const { parts, assemblies, clickFn } = this.props

    const displayRows = (items, title) => {
      const itemsOrdrered = orderBy(items.data, 'name')
      return (
        <div>
          <SectionTitle style={ { margin: '30px 0 15px' } }>{title}</SectionTitle>
          <div className="rel-box" style={ items.loading ? { minHeight: '70px' } : {} }>
            { itemsOrdrered.map(file => <Row file={ file } clickFn={ clickFn } key={ file._id } />) }
            <LoadingOverlay show={ items.loading } size="sm" />
          </div>
        </div>
      )
    }

    const hasChildParts       = parts && parts.data && parts.data.length > 0 || (parts && parts.loading)
    const hasParentAssemblies = assemblies && assemblies.data && assemblies.data.length > 0 || (assemblies && assemblies.loading)

    if (hasChildParts || hasParentAssemblies) {
      return (
        <div>
          { hasParentAssemblies
            ? displayRows(assemblies, 'Parent Assemblies')
            : null }
          { hasChildParts
            ? displayRows(parts, 'Assembly Parts')
            : null }
        </div>
      )
    }
    
    return null
  }
}

const mapStateToProps = ({ files }, { fileMeta }) => {
  const cacheKey = `${fileMeta.data.fileId}-${fileMeta.data.revisionId}`
  return {
    parts: files.fileAssemblyParts[cacheKey],
    assemblies: files.fileAssemblyParents[cacheKey],
  }
}

export default connect(mapStateToProps)(AssemblyParts)
