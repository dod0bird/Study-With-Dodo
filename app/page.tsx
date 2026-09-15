import CourseCard, { Course } from "@/components/CourseCard";
import AssignmentCard, { Assignment } from "@/components/AssignmentCard";

const mockCourses: Course[] = [
  { code: "CPSC 210", name: "Software Construction", description: "OOP, design patterns, testing" },
  { code: "MATH 101", name: "Integral Calculus" },
  { code: "DSCI 100", name: "Introduction to Data Science", description: "R, data wrangling, basic stats" },
];

const mockAssignments: Assignment[] = [
  { title: "Assignment 2", courseCode: "CPSC 210", dueDate: "Sept 20", estimatedHours: 4, priority: "high", status: "not_started" },
  { title: "Problem Set 3", courseCode: "MATH 101", dueDate: "Sept 18", estimatedHours: 2, priority: "medium", status: "in_progress" },
  { title: "Lab Report 1", courseCode: "DSCI 100", dueDate: "Sept 25", estimatedHours: 3, priority: "low", status: "not_started" },
];

export default function Home() {
  return (
    <main className="p-8 max-w-2xl mx-auto flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">My Courses</h1>
        {mockCourses.map((course) => (
          <CourseCard key={course.code} course={course} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {mockAssignments.map((assignment) => (
          <AssignmentCard key={assignment.title} assignment={assignment} />
        ))}
      </section>
    </main>
  );
}