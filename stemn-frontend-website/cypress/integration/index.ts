import { createProject } from '../integrations/create_project'
import { pageHome } from '../integrations/page_home'
import { register } from '../integrations/register'

const url = 'http://localhost:3000'
const email = `e2e-tester-${new Date().getTime()}@stemn.com`
const password = 'tester'
const projectName = 'Test Project'
const projectBlurb = 'This is a test project to make sure the stemn systems are working'
const firstName = 'E2E'
const lastName = 'Tester'
const userName = `${firstName} ${lastName}`

pageHome({ url })
register({ url, email, password, firstName, lastName })
createProject({ projectName, projectBlurb, userName })
