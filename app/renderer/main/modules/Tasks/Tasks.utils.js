export const groupTasks = (groups, tasks) => {
  const groupedTasks = [];
  const groupIndex = {};
  groups.forEach((group, index)=>{
    groupedTasks.push({
      id: group._id,
      name: group.name,
      cards: []
    })
    groupIndex[group._id] = index;
  })

  tasks.forEach((task)=>{
    task.id = task._id;
    groupedTasks[groupIndex[task.group]].cards.push(task);
  })

  return groupedTasks
}

