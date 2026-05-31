import Task from "../models/Task.js";
import User from "../models/User.js";
import { STATUS_TRANSITIONS } from "../utils/constants.js";
import {
  buildTaskListCacheKey,
  getCachedJson,
  invalidateTaskListCache,
  setCachedJson
} from "../utils/cache.js";

const ensureAssigneeInOrganization = async (
 assignee,
 organization
) => {
 if (!assignee) {
  return;
 }

 const user =
 await User.findOne({
  _id: assignee,
  organization
 });

 if (!user) {
  const error = new Error(
   "assignee must belong to the same organization"
  );
  error.status = 400;
  error.code = "VALIDATION_ERROR";
  throw error;
 }
};


export const getTasks =
async (
 req,
 res,
 next
)=>{

 try{

  const page =
  Number(req.query.page) || 1;

  const limit =
  Number(req.query.limit) || 10;

  const query = req.taskQuery;
  const cacheKey =
  buildTaskListCacheKey(
   query,
   page,
   limit
  );

  const cachedTasks =
  await getCachedJson(cacheKey);

  if (cachedTasks) {
   return res.json(cachedTasks);
  }

  const tasks =
  await Task.find(query)

  .skip(
   (page-1)*limit
  )

  .limit(limit)

  .populate(
   "assignee",
   "name email"
  );

  await setCachedJson(
   cacheKey,
   tasks
  );

  res.json(tasks);

 }catch(error){

  next(error);

 }
};

export const createTask =
async (
  req,
  res,
  next
) => {

  try {

    const {
      title,
      description,
      priority,
      assignee,
      due_date
    } = req.body;

    await ensureAssigneeInOrganization(
      assignee,
      req.user.organization
    );

    const task =
    await Task.create({

      title,

      description,

      priority,

      assignee,

      due_date,

      organization:
      req.user.organization

    });

    await invalidateTaskListCache(
      req.user.organization
    );

    res.status(201).json({
      success: true,
      task
    });

  } catch (error) {

    next(error);

  }
};

export const getTaskById =
async (
 req,
 res,
 next
)=>{

 try{

  const task = req.task;

  res.json(task);

 }catch(error){

  next(error);

 }
};

export const updateTask = async (
  req,
  res,
  next
) => {
  try {

    const task = req.task;

    await ensureAssigneeInOrganization(
      req.body.assignee,
      req.user.organization
    );

    Object.assign(
      task,
      req.body
    );

    await task.save();

    await invalidateTaskListCache(
      req.user.organization
    );

    res.json({
      success: true,
      task
    });

  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req,
  res,
  next
) => {

  try {

    const task = req.task;

    await task.deleteOne();

    await invalidateTaskListCache(
      req.user.organization
    );

    res.json({
      success: true,
      message: "Task deleted"
    });

  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus =
async (
  req,
  res,
  next
) => {

  try {

    const {
      status
    } = req.body;

    const task = req.task;

    const allowedTransitions =
    STATUS_TRANSITIONS[
      task.status
    ];

    if (
      !allowedTransitions.includes(
        status
      )
    ) {

      return res.status(400)
      .json({

        status: 400,

        code:
        "INVALID_STATUS_TRANSITION",

        message:
        `Cannot move from ${task.status} to ${status}`

      });

    }

    task.status = status;

    await task.save();

    await invalidateTaskListCache(
      req.user.organization
    );

    res.json({
      success: true,
      task
    });

  } catch (error) {

    next(error);

  }
};
