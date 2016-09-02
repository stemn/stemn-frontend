export const groupTasks = (groups, tasks) => {
  const groupedTasks = {};

  groups.forEach((group)=>{
    groupedTasks[group] = [];
  })

  tasks.forEach((task)=>{
    if(!groupedTasks[task.group]){
      groupedTasks[task.group] = [task];
    }
    else{
      groupedTasks[task.group].push(task);
    }
  })

  return groupedTasks
}

