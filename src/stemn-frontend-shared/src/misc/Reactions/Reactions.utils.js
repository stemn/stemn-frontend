export const options = [{
  type: 'up',
  icon: '👍',
}, {
  type: 'down',
  icon: '👎',
}, {
  type: 'party',
  icon: '🎉',
}, {
  type: 'heart',
  icon: '❤️',
}, {
  type: 'confused',
  icon: '😕',
}]

export const groupAndOrderReactions = (reactions, options) => orderReactions(groupReactions(reactions), options)

// ////////////////////////////////////////////////////////////////

function groupReactions(reactions) {
  const groupedReactions = {}
  reactions.forEach((reaction) => {
    if (!groupedReactions[reaction.type] || !groupedReactions[reaction.type].list) {
      groupedReactions[reaction.type] = {
        list: [reaction],
      }
    } else {
      groupedReactions[reaction.type].list.push(reaction)
    }
  })
  return groupedReactions
}

function orderReactions(groupedReactions, options) {
  // Orders reactions by the options array
  const orderedReactions = []
  options.forEach((option) => {
    if (groupedReactions[option.type] && groupedReactions[option.type].list && groupedReactions[option.type].list.length > 0) {
      orderedReactions.push({
        type: option.type,
        icon: option.icon,
        list: groupedReactions[option.type].list,
      })
    }
  })
  return orderedReactions
}
