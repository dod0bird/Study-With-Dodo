import CourseCard, { Course } from "@/components/CourseCard";

const mockCourses: Course[] = [
  { code: "CPSC 210", name: "Software Construction", description: "OOP, design patterns, testing" },
  { code: "MATH 101", name: "Integral Calculus" },
  { code: "DSCI 100", name: "Introduction to Data Science", description: "R, data wrangling, basic stats" },
];

export default function Home() {
  return (
    <main className="p-8 max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">My Courses</h1>
      {mockCourses.map((course) => (
        <CourseCard key={course.code} course={course} />
      ))}
    </main>
  );
}