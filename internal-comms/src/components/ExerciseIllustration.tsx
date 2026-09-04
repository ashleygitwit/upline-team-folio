/** Branded pen + index card art for exercise slides. */
export function ExerciseIllustration({
  className,
  title = 'Exercise',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <img
      className={className}
      src="/exercise-illustration.png"
      alt={title}
      decoding="async"
      draggable={false}
    />
  );
}
