import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import DisplayReadme from './DisplayReadme.jsx'
import EditorDisplay from 'stemn-shared/misc/Editor/EditorDisplay.jsx'
import Editor from 'stemn-shared/misc/Editor/EditorNew'
import classes from './Readme.scss'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton'
import MdModeEdit from 'react-icons/md/mode-edit'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import Link from 'stemn-shared/misc/Router/Link'

export default class Readme extends Component {
  static propTypes = {
    files: PropTypes.array,
    project: PropTypes.object.isRequired,
    projectModel: PropTypes.string.isRequired,
    saveProject: PropTypes.func.isRequired,
    isRoot: PropTypes.bool.isRequired, // Is this the readme for the root directory?
    canEdit: PropTypes.bool.isRequired, // Can the current user edit
  }
  constructor(props) {
    super(props)
    this.state = {
      editActive: false,
    }
  }
  toggleEdit = () => {
    this.setState({
      editActive: !this.state.editActive,
    })
  }
  save = () => {
    const { saveProject, project } = this.props
    this.toggleEdit()
    setTimeout(() => saveProject({
      project: project.data,
    }), 1)
  }
  render() {
    const { files, project, projectModel, isRoot, canEdit, saveProject, ...otherProps } = this.props
    const { editActive } = this.state
    const readmeNames = ['readme.md', 'readme.txt']
    const readmeFile = files.find(item => readmeNames.includes(item.name.toLowerCase()))
    const readmeTextExists = project.data.readme && project.data.readme.length > 0

    
    const getReadmeFileDisplay = () => {
      const fileRouteParams = {
        projectId: readmeFile.project._id,
        fileId: readmeFile.fileId,
        revisionId: readmeFile.revisionId,
      }
      return (
        <div className={ classes.readme }>
          <Link
            style={ { marginBottom: '15px', display: 'inline-block' } }
            className="text-mini-caps"
            name="fileRoute"
            params={ fileRouteParams }
          >
            { readmeFile.name }
          </Link>
          <div { ...otherProps } style={ { position: 'relative' } }>
            <DisplayReadme file={ readmeFile } />
          </div>
        </div>
      )
    }
    
    const getReadmeTextDisplay = () => (
      <div className={ classes.readme }>
        <div style={ { marginBottom: '15px' } } className="text-mini-caps">Readme</div>
        <SimpleIconButton
          className={ classes.editButton }
          title="Edit Readme"
          onClick={ this.toggleEdit }
        >
          <MdModeEdit size={ 18 } />
        </SimpleIconButton>
        { editActive
          ? <Editor
            value={ project.data.readme }
            model={ `${projectModel}.data.readme` }
          />
          : <EditorDisplay value={ project.data.readme } /> }
        { editActive &&
          <div className="layout-row layout-align-end" style={ { marginTop: '15px' } }>
            <ProgressButton
              className="primary"
              onClick={ this.save }
            >
              Save
            </ProgressButton>
          </div> }
      </div>
    )
    
    
    const getAddReadmeTextPrompt = () => (
      <div className={ cn('layout-column layout-align-center-center', classes.readme) }>
        <div className="text-title-5">
          { isRoot
            ? <a className="text-primary" onClick={ this.toggleEdit }>Add a readme</a>
            : 'Add a readme' }
          &nbsp;to this folder to help others understand what is here.
        </div>
      </div>
    )
    
    if (readmeFile) {
      return getReadmeFileDisplay()
    } else if (readmeTextExists || (editActive && isRoot)) {
      return getReadmeTextDisplay()
    } else if (canEdit) {
      return getAddReadmeTextPrompt()
    } 
    return null
  }
}
