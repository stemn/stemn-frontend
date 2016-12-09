import React from 'react';
import PreviewExpired from './PreviewExpired/PreviewExpired.jsx';
import AssemblyPartNotFound from './AssemblyPartNotFound/AssemblyPartNotFound.jsx';

export default React.createClass({
  render() {
    const { error, fileMeta } = this.props;
    console.log(error);

    if(error.type == 'REVISION_NOT_FOUND'){
      return <PreviewExpired provider={fileMeta.provider}/>
    }
    else if(error.type == 'ASSEMBLY_PART_NOT_FOUND'){
      return <AssemblyPartNotFound parts={error.data.parts}/>
    }
    else{
      return (
        <div className="layout-column layout-align-center-center flex">
          <div className="text-title-5">{error.message}</div>
        </div>
      )
    }
  }
});
