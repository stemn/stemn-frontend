import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
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
    const { files, project, projectModel, ...otherProps } = this.props
    const { editActive } = this.state
    const readmeNames = ['readme.md', 'readme.txt']
    const readmeFile = files.find(item => readmeNames.includes(item.name.toLowerCase()))

    if (readmeFile) {

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

    // Non-file Readme
    return (
      <div>
        <div className={ classes.readme }>
          <div style={ { marginBottom: '15px' } } className="text-mini-caps">Readme</div>
          <SimpleIconButton
            className={ classes.editButton }
            title="Edit Readme"
            onClick={ this.toggleEdit }
          >
            <MdModeEdit size={ 18 }/>
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
      </div>
    )
  }
}
