interface Course {
  name: string;
  code: string;
  description?: string;
}

function CourseCard({ course }: { course: Course }) {
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

const mockCourses: Course[] = [
  { code: "CPSC 210", name: "Software Construction", description: "OOP, design patterns, testing" },
  { code: "MATH 101", name: "Integral Calculus" },
  { code: "DSCI 100", name: "Introduction to Data Science", description: "R, data wrangling, basic stats" },
];

export default function Home() {
  return (
    <main className="p-8 max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">My Courses</h1>
      {mockCourses.map((course) => ( // how to render lists 
        <CourseCard key={course.code} course={course} />
      ))}
    </main>
  );
}