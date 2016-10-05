import confused    from './emoji/one/confused.png'
import party       from './emoji/one/party.png'
import thumbs_up   from './emoji/one/thumbs_up.png'
import thumbs_down from './emoji/one/thumbs_down.png'
import heart       from './emoji/one/heart.png'

export const options = [{
  path: thumbs_up,
  name: 'up'
},{
  path: thumbs_down,
  name: 'down'
},{
  path: party,
  name: 'party'
},{
  path: heart,
  name: 'heart'
},{
  path: confused,
  name: 'confused'
}]

export const groupAndOrderReactions = (reactions, options) => {
  return orderReactions(groupReactions(reactions), options)
}

//////////////////////////////////////////////////////////////////

function groupReactions(reactions){
  const groupedReactions = {};
  reactions.forEach(reaction => {
    if(!groupedReactions[reaction.name]){
      groupedReactions[reaction.name] = {
        list: [reaction]
      }
    }
    else{
      groupedReactions[reaction.name] = groupedReactions[reaction.name].list.push(reaction)
    }
  })
  return groupedReactions
}

function orderReactions(groupedReactions, options){
  // Orders reactions by the options array
  const orderedReactions = [];
  options.forEach(option => {
    if(groupedReactions[option.name] && groupedReactions[option.name].list && groupedReactions[option.name].list.length > 0){
      orderedReactions.push({
        name: option.name,
        path: option.path,
        list: groupedReactions[option.name].list
      })
    }
  })
  return orderedReactions
}
