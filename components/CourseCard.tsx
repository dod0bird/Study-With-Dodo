export interface Course {
  name: string;
  code: string;
  description?: string;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-zinc-500">{course.code}</p>
      <h2 className="text-lg font-semibold">{course.name}</h2>
      {course.description && (
        <p className="text-sm text-zinc-600">{course.description}</p>
      )}
    </div>
  );
}
