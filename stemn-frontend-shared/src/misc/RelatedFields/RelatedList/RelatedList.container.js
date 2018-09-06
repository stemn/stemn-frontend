import { connect } from 'react-redux'
import RelatedList from './RelatedList'
import { getRelatedFields } from 'stemn-shared/misc/RelatedFields/RelatedFields.actions'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

const stateToProps = ({ relatedFields }, { fieldId }) => ({
  related: relatedFields[fieldId],
})

const dispatchToProps = {
  getRelatedFields,
}

const fetchConfigs = [{
  hasChanged: 'fieldId',
  onChange: (props) => {
    props.getRelatedFields({
      fieldId: props.fieldId,
    })
  },
}]

const withFetchData = fetchDataHoc(fetchConfigs)(RelatedList)
const withRedux = connect(stateToProps, dispatchToProps)(withFetchData)

export default withRedux
