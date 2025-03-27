import type { BusRoute } from "../page";
// Define markers for Bus 101 (exported for use in parent)

interface BusProps {
  isSelected: boolean;
  onSelect: () => void;
  details: BusRoute;
} 

export default function BusRoute({ isSelected, onSelect, details }: BusProps) {

  return (
    <div
      onClick={onSelect}
      className={`bg-gray-50 rounded-lg p-4 hover:bg-gray-100 hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer ${
        isSelected ? "ring-2 ring-indigo-500 bg-gray-100" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v8zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {details.number}
            </p>
            <p className="text-xs text-gray-500">
            {details.route}
            </p>
            {isSelected && (
              <div className="space-y-1 mt-1">
                  <span className="text-green-500">Bus tracking active</span>
              
              </div>
            )}
          </div>
        </div>
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {details.status}
          </span>
          <p className="text-xs text-gray-500 mt-1 text-right">
          {details.time}

          </p>
        </div>
      </div>
    </div>
  );
} 