import isUuid from '../../../../shared/helpers/isUuid.js';

export const validateMention = (href) => {
  // mention should be of the form 'entityId:entityType:mentionId'
  // Example: '47db55af7f342380174e228:user:cb4e8fac7fe980b53da95624'
  // Boths ids should be 24 characters.
  const hrefSplit = href.split(':');
  if(hrefSplit.length == 3){
    const [entityId, mentionType, mentionId] = hrefSplit;
    if(isUuid(entityId) && isUuid(mentionId)){
      return true
    }
    else{
      return false
    }
  }
  else{
    return false
  }
}

export const getMentionString = (mention) => {
  return `@[${mention.display}](${mention.entityId}:${mention.mentionType}:${mention.mentionId})`
}

export const parseMentions = (text) => {
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

  // Get the markdown links
  const mentionsRaw = text ? text.match(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g) : [];
  const mentions = [];
  if(mentionsRaw && mentionsRaw.length > 0){
    mentionsRaw.forEach(mention=>{
      const display = mention.split('[')[1].split(']')[0]; // Get the name (from between the square brackets)
      const infoString = mention.split('(')[1].split(')')[0]; // Get the info (from between the standard brackets)
      if(validateMention(infoString)){
        const [entityId, mentionType, mentionId] = infoString.split(':');
        mentions.push({
          display,
          entityId,
          mentionType,
          mentionId
        })
      }
    })
  }
  return mentions;
}

export const removeExistingMentions = (newMentions, existingMentions) => {
  // Create an array of existing mention entity Ids
  const existingMentionEntityIds = existingMentions.map(mention => mention.entityId)
  // Make sure new mentions do not already exist
  return newMentions.filter((mention) => existingMentionEntityIds.indexOf(mention.entityId) == -1);
}

export const addMentionsToText = (text, mentions) => {
  let textNew = text || '';
  if(mentions && mentions.length > 0){
    mentions.forEach(mention => {
      textNew = textNew.concat(`${textNew.length > 0 ? ' ' : ''}${getMentionString(mention)}`)
    })
  }
  return textNew
}
