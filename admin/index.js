const http = require('axios')
const { flatten, uniqBy } = require('lodash')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const ghToken = '98f982b11affb9771a7671f79f6bde4673da67cb'


//const getProjects = () => {
//  return http({
//    method: 'GET',
//    url: 'https://api.github.com/search/repositories',
//    skipAuthorization: true,
//    params: {
//      q: 'fork:true language:eagle language:kicad',
//      sort:'stars',
//      order:'desc',
//      page: 1,
//      per_page: 100
//    }
//  }).then((response) => {
//    console.log(response.data.items);
//  })
//}

let usersAlreadyAdded = []

const recursive = (page, per_page, func, page_limit) => {
  let result = []
  
  const processResponse = (response) => {
    result = result.concat(response)
    const enoughResults = response.length == per_page
    const lessThanLimit = page + 1 < page_limit // A page limit is added because github doesn't like us querying for than 10*100 pages
    if (enoughResults && lessThanLimit) {
      page++
      return func(page, per_page).then(processResponse)
    } else {
      return result
    }
  }
  
  return func(page, per_page).then(processResponse)
}

const getFiles = (page, per_page) => {
  console.log(`GET PAGE ${page}`);
  return http({
    method: 'GET',
    url: 'https://api.github.com/search/code',
    headers: {
      Authorization: `token ${ghToken}`
    },
    params: {
      q: 'solidworks extension:md',
      sort:'stars',
      order:'desc',
      page,
      per_page,
    }
  }).then(response => response.data.items).catch(console.error)
}


const getUserEmail = (user, page = 1) => {
  const per_page = 40;
  return http({
      method: 'GET',
      url: 'https://api.github.com/users/'+user+'/events/public',
      params: {
        page,
        per_page,
      },
      headers: {
        Authorization: `token ${ghToken}`
      },
  }).then((response) => {
    // We look for a push events
    const pushEvents = response.data.filter(item => item.type === 'PushEvent')
    
    // If we dont have push events, we iterate
    const enoughResults = response.data.length === per_page
    if ((!pushEvents || pushEvents.length === 0) && enoughResults) {
      page++
      return getUserEmail(user, page)
    } else if (!enoughResults) {
      return `unknown`
    } else {
      const commitEmails = pushEvents.map(event => event.payload.commits.map(commit => ({
        name: commit.author.name,
        email: commit.author.email
      })))
      return uniqBy(flatten(commitEmails), 'email')
    }
  }).catch(console.error)
}
//
recursive(1, 100, getFiles, 10).then(files => {
  const uniquedByOwner = uniqBy(files, file => file.repository.owner.login)
  return Promise.all(uniquedByOwner.map((file) => {
    return getUserEmail(file.repository.owner.login).then((emails) => {
      return {
        file: file.path,
        repo: file.repository.full_name,
        emails,
      }
    })
  }))
}).then(response => {
  const responseFiltered = response.filter(item => item.emails != 'unknown')
  return fs.writeFile('result.json', JSON.stringify(responseFiltered, null, 2));
})

