'use client';

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-3 font-medium text-sm transition-all duration-200
              ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <span className="relative z-10">{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t"></span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
