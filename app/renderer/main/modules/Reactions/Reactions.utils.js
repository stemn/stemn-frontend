import confused    from './emoji/one/confused.png'
import party       from './emoji/one/party.png'
import thumbs_up   from './emoji/one/thumbs_up.png'
import thumbs_down from './emoji/one/thumbs_down.png'
import heart       from './emoji/one/heart.png'

export const options = [{
  path: thumbs_up,
  type: 'up'
},{
  path: thumbs_down,
  type: 'down'
},{
  path: party,
  type: 'party'
},{
  path: heart,
  type: 'heart'
},{
  path: confused,
  type: 'confused'
}]

export const groupAndOrderReactions = (reactions, options) => {
  return orderReactions(groupReactions(reactions), options)
}

//////////////////////////////////////////////////////////////////

function groupReactions(reactions){
  const groupedReactions = {};
  reactions.forEach(reaction => {
    if(!groupedReactions[reaction.type] || !groupedReactions[reaction.type].list){
      groupedReactions[reaction.type] = {
        list: [reaction]
      }
    }
    else{
      groupedReactions[reaction.type] = groupedReactions[reaction.type].list.push(reaction)
    }
  })
  return groupedReactions
}

function orderReactions(groupedReactions, options){
  // Orders reactions by the options array
  const orderedReactions = [];
  options.forEach(option => {
    if(groupedReactions[option.type] && groupedReactions[option.type].list && groupedReactions[option.type].list.length > 0){
      orderedReactions.push({
        type: option.type,
        path: option.path,
        list: groupedReactions[option.type].list
      })
    }
  })
  return orderedReactions
}
