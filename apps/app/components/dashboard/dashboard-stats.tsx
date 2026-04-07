
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { TaskRawObject } from "@workspace/types/repository/tasks";



export function DashboardStats({tasks}: {tasks: TaskRawObject[]}) {

  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const inProgress = tasks.filter((task) => task.status === "in-progress").length;
  const todo = tasks.filter((task) => task.status === "todo").length;
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-medium text-sm">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-medium text-sm">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-green-500">{completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-medium text-sm">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-blue-500">{inProgress}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-medium text-sm">To Do</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-muted-foreground">{todo}</div>
        </CardContent>
      </Card>
    </div>
  );
}
