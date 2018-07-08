const objectToString = require('object-to-string')
const http = require('axios')
const { flatten, uniqBy } = require('lodash')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const inspect = item => require('util').inspect(item, { depth: 12 })

const ghToken = '98f982b11affb9771a7671f79f6bde4673da67cb'

module.exports = (opts) => {
  // const getProjects = () => {
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
  // }

  const options = {
    created: `${opts.from} .. ${opts.to}`,
    q: opts.q,
    // sort:'stars',
    // order:'desc'
  }

  const usersAlreadyAdded = []

  const recursive = (page, per_page, func, page_limit) => {
    let result = []

    const processResponse = (response) => {
      result = result.concat(response)
      const enoughResults = response.length == per_page
      const lessThanLimit = page + 1 < page_limit // A page limit is added because github doesn't like us querying for than 10*100 pages
      if (enoughResults && lessThanLimit) {
        page++
        return func(page, per_page).then(processResponse)
      } 
      return result
    }

    return func(page, per_page).then(processResponse)
  }

  const getFiles = (page, per_page) => http({
    method: 'GET',
    url: 'https://api.github.com/search/code',
    headers: {
      Authorization: `token ${ghToken}`,
    },
    params: Object.assign({
      created: `${opts.from} .. ${opts.to}`,
      page,
      per_page,
    }, options),
  }).then(response => response.data.items).catch(console.error)


  const getUserEmail = (user, repo, page = 1) => {
    const per_page = 40
    return http({
      method: 'GET',
      url: `https://api.github.com/users/${user}/events/public`,
      params: {
        created: `${opts.from} .. ${opts.to}`,
        page,
        per_page,
      },
      headers: {
        Authorization: `token ${ghToken}`,
      },
    }).then((response) => {
      // We look for a push events
      const pushEvents = response.data.filter(item => item.type === 'PushEvent')

      // If we dont have push events, we iterate
      const enoughResults = response.data.length === per_page
      if ((!pushEvents || pushEvents.length === 0) && enoughResults) {
        page++
        return getUserEmail(user, repo, page)
      } else if (!enoughResults) {
        return 'unknown'
      } 
      const commitEmails = flatten(pushEvents.map(event => event.payload.commits.map(commit => ({
        name: commit.author.name,
        email: commit.author.email,
        message: commit.message,
        url: commit.url,
        repo: event.repo.name,
      }))))
      // push events can point to any repository. we want the events relating to the repo that brought us here.
      console.log(commitEmails.map(e => e.repo))
      console.log(repo)
      console.log('-------------------')
      const commitsForRepository = commitEmails.filter(commit => commit.repo === repo)
      return uniqBy(flatten(commitsForRepository), 'email')
    }).catch(console.error)
  }
  //
  return recursive(1, 100, getFiles, 10).then((files) => {
    const uniquedByOwner = uniqBy(files, file => file.repository.owner.login)
    return Promise.all(uniquedByOwner.map(file => getUserEmail(file.repository.owner.login, file.repository.full_name).then(emails => ({
      file: file.path,
      fileUrl: file.url,
      repo: file.repository.full_name,
      emails,
    }))))
  }).then((response) => {
    const responseFiltered = response.filter(item => item.emails != 'unknown' && item.emails.length > 0)
    console.log(inspect(responseFiltered))
    return fs.writeFile(`${objectToString(options)}.json`, JSON.stringify(responseFiltered, null, 2), () => {})
  })
}
