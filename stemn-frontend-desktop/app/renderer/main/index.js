import bootstrap from '../shared/bootstrap.jsx'
import createRoutes from './routes'
// Registers the thread modal opened by routeActions.threadRoute
import 'stemn-shared/misc/Threads/ThreadDisplayModal'

bootstrap({ createRoutes, loadUser: true })
