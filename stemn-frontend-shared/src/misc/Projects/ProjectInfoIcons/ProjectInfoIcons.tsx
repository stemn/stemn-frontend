import cn from 'classnames'
import { get } from 'lodash'
import { MdContentCopy } from 'react-icons/md'
import ProviderIcon from 'stemn-shared/misc/Icons/ProviderIcon'
import PublicPrivateIcon from 'stemn-shared/misc/Icons/PublicPrivateIcon'
import { IProject } from 'stemn-shared/misc/Projects/types'
import Link from 'stemn-shared/misc/Router/Link'
import s from './ProjectInfoIcons.module.scss'

export interface IProjectInfoIconsProps {
  project?: IProject
  hidePublic?: boolean
  padRight?: boolean
  padLeft?: boolean
}

export const ProjectInfoIcons = ({ project, hidePublic, padLeft, padRight }: IProjectInfoIconsProps) => {
  if (!project) {
    return null
  }

  const cloneSource = get(project, 'clone.source')

  return (
    <div
      className={cn('layout-row', 'layout-align-start-center', s.icons, {
        [s.padRight]: padRight,
        [s.padLeft]: padLeft,
      })}
    >
      {!hidePublic && (
        <div key="public-icon" title={project.private ? 'Private Project' : 'Public Project'}>
          <PublicPrivateIcon private={project.private} noColor={true} />
        </div>
      )}
      {cloneSource && (
        <Link
          name="projectRoute"
          params={{ projectId: cloneSource }}
          key="clone-icon"
          title="Cloned Project. View Original."
        >
          <MdContentCopy />
        </Link>
      )}
      <div key="provider-icon" title={`Files stored in ${project.remote.provider}`}>
        <ProviderIcon provider={project.remote.provider} />
      </div>
    </div>
  )
}
