export default function MarketToggle({ activeMarket, onChange }) {
  return (
    <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
      <button
        onClick={() => onChange('global')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          activeMarket === 'global' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        🌍 Global
      </button>
      <button
        onClick={() => onChange('indian')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          activeMarket === 'indian' 
            ? 'bg-orange-600 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        🇮🇳 India (NSE/BSE)
      </button>
    </div>
  );
}
