import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH"
      ],
      default: "MEDIUM"
    },

    status: {
      type: String,
      enum: [
        "TODO",
        "IN_PROGRESS",
        "IN_REVIEW",
        "DONE",
        "BLOCKED"
      ],
      default: "TODO"
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },

    due_date: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

taskSchema.index({
  status: 1
});

taskSchema.index({
  assignee: 1
});

taskSchema.index({
  due_date: 1
});

taskSchema.index({
  organization: 1,
  assignee: 1,
  status: 1,
  priority: 1
});

const Task = mongoose.model(
  "Task",
  taskSchema
);

export default Task;
