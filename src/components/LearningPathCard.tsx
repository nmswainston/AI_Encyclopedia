import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import { getScriptBySlug } from "../lib/content";
import type { LearningPath } from "../lib/learningPaths";

interface LearningPathCardProps {
  path: LearningPath;
}

type Step =
  | { kind: "ok"; slug: string; title: string; minutes: number }
  | { kind: "missing"; slug: string };

export function LearningPathCard({ path }: LearningPathCardProps) {
  const steps: Step[] = useMemo(() => {
    return path.slugOrder.map((slug) => {
      const script = getScriptBySlug(slug);
      if (!script) return { kind: "missing", slug };

      const minutesRaw = script.meta.minutes;
      const minutes =
        typeof minutesRaw === "number"
          ? minutesRaw
          : typeof minutesRaw === "string"
            ? Number(minutesRaw)
            : 0;

      return {
        kind: "ok",
        slug: script.slug,
        title: script.meta.title,
        minutes: Number.isFinite(minutes) ? minutes : 0
      };
    });
  }, [path.slugOrder]);

  const availableSteps = steps.filter((s): s is Extract<Step, { kind: "ok" }> => s.kind === "ok");
  const missingSteps = steps.filter((s) => s.kind === "missing");

  const computedMinutes = availableSteps.reduce((sum, s) => sum + (s.minutes || 0), 0);
  const displayMinutes = typeof path.estimatedTime === "number" ? path.estimatedTime : computedMinutes;

  const firstAvailable = availableSteps[0];

  return (
    <div className="learning-path-card">
      <div className="learning-path-header">
        <BookOpen size={24} aria-hidden="true" />
        <div>
          <h3>{path.title}</h3>
          <p className="learning-path-description">{path.description}</p>
        </div>
      </div>

      <div className="learning-path-meta">
        <span className={`learning-path-level badge-level-${path.level}`}>
          {path.level}
        </span>

        <span className="learning-path-time">
          <Clock size={14} aria-hidden="true" />
          <span>{displayMinutes} min</span>
        </span>

        <span className="learning-path-count">
          {availableSteps.length}/{path.slugOrder.length} lessons
        </span>
      </div>

      {missingSteps.length > 0 && (
        <div className="learning-path-warning" role="note">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>
            {missingSteps.length} lesson{missingSteps.length === 1 ? "" : "s"} missing in this path.
          </span>
        </div>
      )}

      <div className="learning-path-steps">
        <h4>Learning Path</h4>
        <ol>
          {steps.map((step) => {
            if (step.kind === "missing") {
              return (
                <li key={step.slug} className="learning-path-step missing">
                  <span className="missing-label">
                    {step.slug} <em>(missing)</em>
                  </span>
                </li>
              );
            }

            return (
              <li key={step.slug} className="learning-path-step">
                <Link to={`/scripts/${step.slug}`}>{step.title}</Link>
                <span className="learning-path-step-minutes">
                  {step.minutes ? `${step.minutes} min` : ""}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {firstAvailable && (
        <Link to={`/scripts/${firstAvailable.slug}`} className="learning-path-start-button">
          Start Learning Path
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
