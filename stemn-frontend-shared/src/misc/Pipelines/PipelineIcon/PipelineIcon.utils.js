import s from './PipelineIcon.module.scss'

export const getStatusClass = (status) => {
  if (status === 'success') {
    return s.success
  } else if (status === 'running') {
    return s.running
  } else if (status === 'pending') {
    return s.pending
  } else if (status === 'skipped') {
    return s.pending
  } else if (status === 'failed') {
    return s.error
  }
}
