import React from 'react'

const data = {
  commit: {
    steps: {
      commitIntro: {
        content: (
          <div>
            <p>Let's go through the basics of commiting your changes.</p>
            <p>The 'Changes' tab allows you to inspect recent changes to your files. Click on one of the files in this list to preview.</p>
            <p className="text-grey-3"><small>Your file changes in Dropbox and Drive are automatically synced to Stemn.</small></p>
          </div>
        ),
      },
      commitCheckbox: {
        content: (
          <div>
            <p>Use these checkboxes to select which files you want to commit.</p>
            <p>To begin, you will want to use the master checkbox (this one) to select all changes.</p>
          </div>
        ),
      },
      commitSummary: {
        content: (
          <div>
            <p>It is now time to package these changes into a 'commit'.</p>
            <p>Add a short 'Summary' and more detailed 'Description' so that the your team (or the future you) knows what changes have been made.</p>
          </div>
        ),
      },
      commitThreads: {
        content: (
          <div>
            <p>Next you can add 'related threads' to the commit.</p>
            <p>This allows you and your team see all the work related to a thread in one place.</p>
            <p className="text-grey-3"><small>Threads are added using the 'Threads' tab at the top of the page.</small></p>
          </div>
        ),
      },
      commitSubmit: {
        content: (
          <div>
            <p>Finally, you can now save your commit.</p>
            <p>Once saved, your commit will appear in the 'timeline' and will be linked to any related threads.</p>
            <p className="text-grey-3"><small>You should commit files multiple times each day. This will allow you to keep a good history of what work you have done and what threads have been completed.</small></p>
          </div>
        ),
      },
    },
    order: ['commit.commitIntro', 'commit.commitCheckbox', 'commit.commitSummary', 'commit.commitThreads', 'commit.commitSubmit'],
  },
}

export const getStepData = (fullname) => {
  const [group, name] = fullname.split('.')
  if (data[group] && data[group].steps[name]) {
    return {
      step: data[group].steps[name],
      steps: data[group].order,
    }
  }
  
  console.error('This walkthrough item could not be found.')
}
