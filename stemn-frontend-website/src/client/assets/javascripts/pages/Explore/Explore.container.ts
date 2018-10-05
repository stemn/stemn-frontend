import { getEntries } from 'modules/Contentful/Contentful.actions'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
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
