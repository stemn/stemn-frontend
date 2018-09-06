import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { getEntries } from 'stemn-shared/misc/Contentful/Contentful.actions'
import { IStoreState } from '../../app/reducer'
import Explore from './Explore'

const stateToProps = ({ contentful }: IStoreState) => ({
  contentfulPageExplore: contentful.pageExplore && contentful.pageExplore[0],
})

const dispatchToProps = {
  replace,
  getEntries,
}

export default connect(stateToProps, dispatchToProps)(Explore)
