import { updateCourse, archiveCourse } from "@/app/actions/courses";

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string | null;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">{course.code}</p>
          <h2 className="text-lg font-semibold">{course.name}</h2>
          {course.description && (
            <p className="text-sm text-zinc-600">{course.description}</p>
          )}
        </div>
          <form action={archiveCourse}>
            <input type="hidden" name="id" value={course.id} />
            <button className="text-sm text-zinc-500">Archive</button>
          </form>
      </div>

      <details>
        <summary className="text-sm cursor-pointer text-zinc-500">Edit</summary>
        <form action={updateCourse} className="flex flex-col gap-2 mt-2">
          <input type="hidden" name="id" value={course.id} />
          <input name="code" defaultValue={course.code} required className="border rounded-lg p-2" />
          <input name="name" defaultValue={course.name} required className="border rounded-lg p-2" />
          <input name="description" defaultValue={course.description ?? ""} className="border rounded-lg p-2" />
          <button className="bg-black text-white rounded-lg p-2">Save changes</button>
        </form>
      </details>
    </div>
  );
}