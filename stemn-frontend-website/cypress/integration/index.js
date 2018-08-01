require('../integrations/page_home')
require('../integrations/register')
require('../integrations/create_project')

import initPageHome from '../integrations/page_home'
import initRegister from '../integrations/register'
import initCreateProject from '../integrations/create_project'

const url = 'http://localhost:3000'
const email = `e2e-tester-${new Date().getTime()}@stemn.com`
const password = 'tester'
const projectName = 'Test Project'
const projectBlurb = 'This is a test project to make sure the stemn systems are working'
const firstName = 'E2E'
const lastName = 'Tester'
const userName = `${firstName} ${lastName}`

initPageHome({ url })
initRegister({ url, email, password, firstName, lastName })
initCreateProject({ projectName, projectBlurb, userName })
