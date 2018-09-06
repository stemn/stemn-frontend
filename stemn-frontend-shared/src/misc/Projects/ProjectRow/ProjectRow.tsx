import * as cn from 'classnames'
import * as moment from 'moment'
import * as React from 'react'
import LoadingAnimation from 'stemn-shared/misc/Loading/LoadingAnimation'
import LoadingPlaceholder from 'stemn-shared/misc/Loading/LoadingPlaceholder'
import { ProjectInfoIcons } from 'stemn-shared/misc/Projects/ProjectInfoIcons'
import { IProject } from 'stemn-shared/misc/Projects/types'
import * as Link from 'stemn-shared/misc/Router/Link'
import SocialButton from 'stemn-shared/misc/Social/SocialButton'
import * as classes from './ProjectRow.scss'

export interface IProjectRowProps {
  project: {
    data?: IProject,
  },
  size?: 'wide',
  className?: string,
}

export class ProjectRow extends React.Component<IProjectRowProps> {
  public render () {
    const { project, className, size } = this.props

    if (project && project.data) {
      const { _id: projectId, name, blurb, picture, updated } = project.data

      return (
        <div className={cn(classes.project, 'layout-row', className)} >
          <div className='layout-column flex'>
            <div className={cn('layout-row layout-align-start-center', classes.titleRow)}>
              <Link
                className={cn('link-primary', classes.title)}
                name='projectRoute'
                params={{ projectId }}
              >
                {name || 'Untitled Project'}
              </Link>
            </div>
            <div className={cn('flex', classes.blurb)}>{blurb}</div>
            <div className={cn(classes.meta, 'layout-row', 'layout-align-start-center')}>
              {project.data && <ProjectInfoIcons project={project.data} hidePublic={true} padRight={true} />}
              {moment(updated).fromNow()}
              <div className='flex' />
              <SocialButton
                type='follow'
                entityType={'project'}
                entityId={projectId}
              />
            </div>
          </div>
          { size === 'wide' && picture
            ? <Link name='projectRoute' params={{ projectId }}>
              <img
                className={classes.picture}
                src={`${GLOBAL_ENV.API_SERVER}${picture}?size=feed-sm&crop=true`}
              />
            </Link>
            : null }
        </div>
      )
    }
    return (
      <LoadingAnimation className={cn(classes.project, 'layout-row', className)} >
        <div className='layout-column flex'>
          <div className={classes.titleRow}>
            <LoadingPlaceholder width={200} className={classes.title} />
          </div>
          <div className={classes.blurb}>
            <LoadingPlaceholder width={320} style={{ marginBottom: '5px' }} />
            <LoadingPlaceholder width={300} />
          </div>
          <LoadingPlaceholder width={200} className={classes.meta} />
        </div>
      </LoadingAnimation>
    )
  }
}
