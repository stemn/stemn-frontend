import React from 'react';

const data = {
  project : {
    steps: {
      changes : {
        content: (
          <div>
            <p>Welcome to Stemn Desktop.</p>
            <p>Let's go through the basics of the Stemn workflow.</p>
            <a className="link-primary">Next</a>
          </div>
        )
      },
      summary : {
        content: (
          <div>
            <p>Welcome to Stemn Desktop.</p>
            <p>Let's go through the basics of the Stemn workflow.</p>
          </div>
        )
      }
    },
    order: ['changes', 'summary']
  }
}

export default (fullname) => {
  const [group, name] = fullname.split('.');
  if(data[group] && data[group].steps[name]){
    return data[group].steps[name]
  }
  else{
    console.error('This walkthrough item could not be found.');
  }
}
