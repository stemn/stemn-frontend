/* First module of every renderer: global styles, date locale, axios defaults */
import '../../static/fonts/opensans/opensans.css'
import '../../static/fonts/blokk/blokkfont.css'
import '../../shared/css/index.global.scss'
import { setDateLocale } from 'stemn-shared/utils/date'

setDateLocale('en-gb')
