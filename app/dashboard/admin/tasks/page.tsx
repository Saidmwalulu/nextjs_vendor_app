import { promises as fs } from "fs"
import path from "path";
import { z } from "zod"
import { taskSchema } from "@/data/schema";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

// Simulate a database read for tasks.
async function getTasks() {
  //You can fetch data from database or API here.
  //For this example, we're reading from a local JSON file.
  const data = await fs.readFile(
    path.join(process.cwd(), "data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function AdminTasksPage() {
  const tasks = await getTasks()
  return (
    <div className="container mx-auto">
      <div className="px-3 pt-3">
         <DataTable data={tasks} columns={columns} />
      </div>
    </div>
  );
}
