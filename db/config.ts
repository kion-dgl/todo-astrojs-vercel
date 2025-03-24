import { defineDb, defineTable, column } from "astro:db";

const TodoItems = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    text: column.text(),
    completed: column.boolean({ default: false }),
    createdAt: column.date({ default: new Date() }),
  },
});

export default defineDb({
  tables: { TodoItems },
});
