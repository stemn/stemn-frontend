import { showModal } from 'stemn-shared/misc/Modal/Modal.actions'
import { IFolder } from '../types'
import { modalName } from './FileCreateModal.container'

export const showFileCreateModal = (folder: IFolder) => showModal({ modalType: modalName, modalProps: { folder } })
