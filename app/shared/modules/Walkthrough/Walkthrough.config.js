import React from 'react';

const data = {
  commit : {
    steps: {
      commitIntro : {
        content: (
          <div>
            <p>Let's go through the basics of commiting your changes.</p>
            <p>The 'Changes' tab allows you to inspect recent changes to your files. Click on one of the files in this list to preview.</p>
            <p className="text-grey-3"><small>File changes are automatically synced to Stemn from Dropbox or Drive.</small></p>
          </div>
        )
      },
      commitCheckbox : {
        content: (
          <div>
            <p>Use these checkboxes to select which files you want to commit.</p>
            <p>To begin with, you may want to use the master checkbox (this one) to select all changes.</p>
          </div>
        )
      },
      commitSummary : {
        content: (
          <div>
            <p>It is now time to package these changes into a 'commit'.</p>
            <p>Add a short 'Summary' and more detailed 'Description' so that the your team (or the future you) knows what changes have been made.</p>
          </div>
        )
      },
      commitTasks : {
        content: (
          <div>
            <p>Now you can add 'Related tasks' to the commit.</p>
            <p>This step allows you and your team to look back and see what a file looked like before and after a task was completed.</p>
            <p className="text-grey-3"><small>Tasks are added using the 'tasks' tab at the top of the page.</small></p>
          </div>
        )
      },
      commitSubmit : {
        content: (
          <div>
            <p>Finally, you can now submit your commit.</p>
            <p>Once submitted, your commit will appear in the 'timeline' and be linked from any related tasks.</p>
            <p className="text-grey-3"><small>You should commit files multiple times each day. This will allow you to keep a good history of what work you have done and what tasks have been completed.</small></p>
          </div>
        )
      }
    },
    order: ['commit.commitIntro', 'commit.commitCheckbox', 'commit.commitSummary', 'commit.commitTasks', 'commit.commitSubmit']
  }
}

export const getStepData = (fullname) => {
  const [group, name] = fullname.split('.');
  if(data[group] && data[group].steps[name]){
    return {
      step  : data[group].steps[name],
      steps : data[group].order
    }
  }
  else{
    console.error('This walkthrough item could not be found.');
  }
}
