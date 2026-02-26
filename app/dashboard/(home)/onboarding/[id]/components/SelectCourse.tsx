"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/app/hooks/useApi";
import { fetchCourses } from "@/app/services/onboarding";
import DS from "@/ds";

export default function SelectCourse({ onChange }: any) {
  const [checked, setChecked] = useState<any>([]);
  const { callApi } = useApi(fetchCourses);
  const [courses, setCourses] = useState<any>([]);
  useEffect(() => {
    callApi().then((data) => {
      setCourses(data);
    });
  }, []);

  return (
    <ul className="flex flex-col items-start w-full gap-3 h-[25rem] overflow-y-auto">
      {courses.map((course: any) => (
        <li
          key={course.id}
          className="flex items-start justify-start px-3 py-2 bg-neutral-100 rounded-lg w-full"
        >
          <div className="flex gap-3 justify-start items-center w-full">
            <DS.Checkbox
              value={checked.includes(course.id) ? true : false}
              onChange={() => {
                let arr = [];
                if (checked.includes(course.id)) {
                  arr = checked.filter((n: any) => n != course.id);
                } else {
                  arr = [...checked, course.id];
                }
                setChecked(arr);
                onChange(arr);
              }}
              className="shrink-0"
            />
            <div>
              <div className="text-base font-semibold text-neutral-900">
                {course.name}
              </div>
              <div className="text-xs text-neutral-500">
                {course.observation}
              </div>
            </div>
            <div className="text-sm text-neutral-500 ml-auto">
              {course.mode == "virtual" ? "Virtual" : "Presencial"}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
