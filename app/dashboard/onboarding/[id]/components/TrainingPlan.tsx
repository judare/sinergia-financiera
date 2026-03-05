"use client";

import { useEffect, useRef, useState } from "react";
import { useApi } from "@/app/hooks/useApi";
import { fetchCourses, updateOnboardingApi } from "@/app/services/onboarding";
import DS from "@/ds";
import ConfirmToast from "@/app/components/UI/ConfirmToast";

type TrainingPlanItem = {
  courseId: number;
  description: string;
};

export default function TrainingPlan({
  onboardingId,
  initialTrainingPlans,
}: {
  onboardingId: number;
  initialTrainingPlans: any[];
}) {
  const toastRef = useRef<any>(null);
  const { callApi: loadCourses } = useApi(fetchCourses);
  const { callApi: save, loading } = useApi(updateOnboardingApi);

  const [courses, setCourses] = useState<any[]>([]);
  const [items, setItems] = useState<TrainingPlanItem[]>([]);

  useEffect(() => {
    loadCourses().then((data) => {
      if (data) setCourses(data);
    });
  }, []);

  useEffect(() => {
    if (initialTrainingPlans?.length) {
      setItems(
        initialTrainingPlans.map((tp: any) => ({
          courseId: tp.courseId,
          description: tp.description || "",
        }))
      );
    }
  }, [initialTrainingPlans]);

  const toggle = (courseId: number) => {
    const exists = items.find((i) => i.courseId === courseId);
    if (exists) {
      setItems(items.filter((i) => i.courseId !== courseId));
    } else {
      setItems([...items, { courseId, description: "" }]);
    }
  };

  const setDescription = (courseId: number, description: string) => {
    setItems(items.map((i) => (i.courseId === courseId ? { ...i, description } : i)));
  };

  const handleSave = async () => {
    const result = await save({ id: onboardingId, trainingPlan: items });
    if (result !== undefined) {
      toastRef.current?.show("Plan de capacitación guardado", "success");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfirmToast ref={toastRef} />
      <ul className="flex flex-col gap-3 max-h-80 overflow-y-auto">
        {courses.map((course) => {
          const selected = items.find((i) => i.courseId === course.id);
          return (
            <li
              key={course.id}
              className="flex flex-col gap-2 px-3 py-3 bg-neutral-100 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <DS.Checkbox
                  value={!!selected}
                  onChange={() => toggle(course.id)}
                  className="shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900">{course.name}</p>
                  <p className="text-xs text-neutral-500">{course.observation}</p>
                </div>
                <span className="text-xs text-neutral-400 ml-auto">
                  {course.mode === "virtual" ? "Virtual" : "Presencial"}
                </span>
              </div>
              {selected && (
                <DS.Input
                  label="Descripción / observaciones"
                  value={selected.description}
                  onChange={(v: string) => setDescription(course.id, v)}
                />
              )}
            </li>
          );
        })}
      </ul>
      <DS.Button
        text="Guardar plan de capacitación"
        variant="primary"
        size="md"
        loading={loading}
        onClick={handleSave}
      />
    </div>
  );
}
