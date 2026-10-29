// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FileCreateModalComponent } from './FileCreateModal'

// The component only takes the container's types; the container itself pulls in the app's routing
vi.mock('./FileCreateModal.container', () => ({ dispatchToProps: {} }))
// Buttons render through the app's router Link, which needs the website's route table
vi.mock('stemn-shared/misc/Router/Link', () => ({ default: (props: any) => <a {...props} /> }))

;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
// ProgressButton animates its SVG paths, which jsdom doesn't lay out
;(SVGElement.prototype as any).getTotalLength = () => 0

const folder = { _id: 'folder-1', project: { _id: 'project-1' } } as any

let container: HTMLDivElement
let root: Root

const render = (uploadFile: (...args: any[]) => any) => {
  const store = createStore((state = {}) => state)
  act(() => {
    root.render(
      <Provider store={store}>
        <FileCreateModalComponent folder={folder} uploadFile={uploadFile as any} push={vi.fn() as any} />
      </Provider>,
    )
  })
}

const submit = async () => {
  await act(async () => {
    container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  })
}

const type = (value: string) => {
  const input = container.querySelector<HTMLInputElement>('input[placeholder="File Name"]')!
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
  act(() => {
    setter.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  return input
}

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('FileCreateModal', () => {
  it('starts with the .pipeline type and an empty name', () => {
    render(vi.fn())
    expect(container.querySelector<HTMLInputElement>('input[placeholder="File Name"]')!.value).toBe('')
    expect(container.textContent).toContain('.pipeline')
  })

  it('submits the name and type', async () => {
    const uploadFile = vi.fn(() => Promise.resolve())
    render(uploadFile)
    type('readme')
    await submit()
    expect(uploadFile).toHaveBeenCalledWith({
      projectId: 'project-1',
      parent: 'folder-1',
      name: 'readme.pipeline',
      file: 'some data',
    })
  })

  it('submits the type picked from the dropdown', async () => {
    const uploadFile = vi.fn(() => Promise.resolve())
    render(uploadFile)
    type('notes')
    const toggle = Array.from(container.querySelectorAll('button')).find((el) => el.textContent === '.pipeline')!
    act(() => toggle.click())
    const option = Array.from(document.querySelectorAll('a')).find((el) => el.textContent === '.md')!
    act(() => option.click())
    expect(container.textContent).toContain('.md')
    await submit()
    expect(uploadFile).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'notes.md' }))
  })

  it('submits an untouched or cleared name as undefined, as before', async () => {
    const uploadFile = vi.fn(() => Promise.resolve())
    render(uploadFile)
    await submit()
    expect(uploadFile).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'undefined.pipeline' }))
    type('readme')
    type('')
    await submit()
    expect(uploadFile).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'undefined.pipeline' }))
  })

  it('shows the button as loading while the upload is pending', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    let resolve: () => void = () => undefined
    const uploadFile = vi.fn(() => new Promise<void>((r) => (resolve = r)))
    render(uploadFile)
    const wrapper = container.querySelector('button[type="submit"]')!.parentElement!
    expect(wrapper.className).not.toMatch(/loading|success/)
    await submit()
    expect(wrapper.className).toMatch(/loading/)
    await act(async () => resolve())
    act(() => vi.advanceTimersByTime(800))
    expect(wrapper.className).not.toMatch(/loading/)
    expect(wrapper.className).toMatch(/success/)
    vi.useRealTimers()
  })

  it('shows the uploading overlay once files are dropped', async () => {
    render(vi.fn())
    expect(container.textContent).not.toContain('Uploading files...')
    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]')!
    Object.defineProperty(fileInput, 'files', { value: [new File(['x'], 'part.step')] })
    await act(async () => {
      fileInput.dispatchEvent(new Event('change', { bubbles: true }))
      await new Promise((r) => setTimeout(r, 0))
    })
    expect(container.textContent).toContain('Uploading files...')
  })
})
