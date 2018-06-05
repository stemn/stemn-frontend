const modalRegistry = {}

export const registerModal = (modalType, component) => {
  if (!modalRegistry[modalType]) {
    modalRegistry[modalType] = component
  }
}

export const getModal = (modalType) => {
  const modalComponent = modalRegistry[modalType]
  if (modalComponent) {
    return modalComponent
  } 
  console.error(`${modalType} Modal could not be found`)
}
