import { useMemo } from 'react';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';
import { getScriptBySlug } from '../lib/content';
import { checkQuality } from '../lib/qualityChecker';

interface QualityIndicatorProps {
  slug: string;
  showDetails?: boolean;
}

export function QualityIndicator({ slug, showDetails = false }: QualityIndicatorProps) {
  const script = getScriptBySlug(slug);
  
  const report = useMemo(() => {
    if (!script) return null;
    return checkQuality(script);
  }, [script]);

  if (!script || !report) return null;

  // Only show in development mode
  if (import.meta.env.PROD) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle2 className="w-4 h-4" />;
    if (score >= 75) return <AlertCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const failedChecks = report.checks.filter(c => !c.passed);
  const byCategory = failedChecks.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = [];
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, typeof failedChecks>);

  return (
    <div className="quality-indicator border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Quality Score (Dev Only)
          </h3>
        </div>
        <div className={`flex items-center gap-2 font-bold ${getScoreColor(report.score)}`}>
          {getScoreIcon(report.score)}
          <span>{report.score}%</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
            ({report.passed}/{report.total})
          </span>
        </div>
      </div>

      {showDetails && failedChecks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Areas for Improvement:
          </h4>
          <div className="space-y-2">
            {Object.entries(byCategory).map(([category, checks]) => (
              <div key={category} className="text-xs">
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {category} ({checks.length} issue{checks.length !== 1 ? 's' : ''})
                </div>
                <ul className="ml-4 space-y-1 text-gray-600 dark:text-gray-400">
                  {checks.map(check => (
                    <li key={check.id} className="list-disc">
                      {check.description}
                      {check.message && (
                        <span className="text-gray-500 dark:text-gray-500 ml-1">
                          - {check.message}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showDetails && failedChecks.length > 0 && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {failedChecks.length} check{failedChecks.length !== 1 ? 's' : ''} need attention
        </div>
      )}
    </div>
  );
}
