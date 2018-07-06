import isUuid from 'stemn-shared/utils/isUuid.js'
import getUuid from 'stemn-shared/utils/getUuid.js'


/*
text = text.match(/
    (                           // wrap whole match in $1
        \[
        (
            (?:
                \[[^\]]*\]      // allow brackets nested one level
                |
                [^\[\]]         // or anything else
            )*
        )
        \]
        \(                      // literal paren
        [ \t]*
        ()                      // no id, so leave $3 empty
        <?(                     // href = $4
            (?:
                \([^)]*\)       // allow one level of (correctly nested) parens (think MSDN)
                |
                [^()\s]
            )*?
        )>?
        [ \t]*
        (                       // $5
            (['"])              // quote char = $6
            (.*?)               // Title = $7
            \6                  // matching quote
            [ \t]*              // ignore any spaces/tabs between closing quote and )
        )?                      // title is optional
        \)
    )
/g);
*/
const markdownLinkRegex = /(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g

export const newMention = ({ mentionType, display, entityId }) => ({
  display,
  entityId,
  mentionType,
  mentionId: getUuid(),
})

export const validateMention = (href = '') => {
  // mention should be of the form 'entityId:entityType:mentionId'
  // Example: '47db55af7f3423801742e228:user:cb4e8fac7fe980b5da295624'
  // Boths ids should be 24 characters.
  const hrefSplit = href.split(':')
  if (hrefSplit.length === 3) {
    if (isUuid(entityId) && isUuid(mentionId)) {
      return true
    }

    return false
  }
  
  return false
}

export const getMentionString = mention => `[${mention.display}](${mention.entityId}:${mention.mentionType}:${mention.mentionId})`

export const parseMentions = (text) => {
  // Get all the markdown links from the raw text
  const mentionsRaw = text ? text.match(markdownLinkRegex) : []

  // Validate the mentions
  const mentions = []
  if (mentionsRaw && mentionsRaw.length > 0) {
    mentionsRaw.forEach((mention) => {
      const infoString = mention.split('(')[1].split(')')[0] // Get the info (from between the standard brackets)
      if (validateMention(infoString)) {
        const display = mention.split('[')[1].split(']')[0]    // Get the name (from between the square brackets)
        const [entityId, mentionType, mentionId] = infoString.split(':')
        const index = text.indexOf(mention)
        mentions.push({
          raw: mention,
          display,
          entityId,
          mentionType,
          mentionId,
          index: {
            from: index,
            to: index + mention.length,
          },
        })
      }
    })
  }
  return mentions
}


export const removeExistingMentions = (newMentions, existingMentions) => {
  // Create an array of existing mention entity Ids
  const existingMentionEntityIds = existingMentions.map(mention => mention.entityId)
  // Make sure new mentions do not already exist
  return newMentions && newMentions.length > 0 ? newMentions.filter(mention => existingMentionEntityIds.indexOf(mention.entityId) === -1) : newMentions
}

export const addMentionsToText = (text, mentions) => {
  // The will add all the mentions to the end of the text block
  let textNew = text || ''
  if (mentions && mentions.length > 0) {
    mentions.forEach((mention) => {
      textNew = textNew.concat(`${textNew.length > 0 ? ' ' : ''}${getMentionString(mention)}`)
    })
  }
  return textNew
}

export const mentionTriggers = [{
  trigger: '@',
  type: 'user',
}, {
  trigger: '#',
  type: 'thread',
}]

export const mentionTypeFromWord = (word) => {
  const firstLetter = word[0]
  const mentionTriggerInfo = mentionTriggers.find(mention => mention.trigger === firstLetter)
  return mentionTriggerInfo
    ? mentionTriggerInfo.type
    : undefined
}

export const getMentionInfo = (mentionType, entityId, display) => {
  const mentionTypes = {
    user: {
      display: `@${display}`,
      route: 'userRoute',
      params: {
        userId: entityId,
      },
    },
    thread: {
      display: `#${display}`,
      route: 'threadRoute',
      params: {
        threadId: entityId,
      },
    },
    'thread-complete': {
      display: `#${display} (complete)`,
      route: 'threadRoute',
      params: {
        threadId: entityId,
      },
    },
  }
  const mentionInfo = mentionTypes[mentionType]
  if (mentionInfo) {
    return mentionInfo
  } 
  console.error('Invalid mention type', mentionType)
}
