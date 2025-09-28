export default function TopBar() {
    return (
      <div className="w-full flex justify-between items-center px-6 py-4 bg-orange-500/20 backdrop-blur-lg shadow-md">
        <h1 className="text-2xl font-bold">⚡ VedAI Admin Dashboard</h1>
        <button className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600">
          Logout
        </button>
      </div>
    );
  }
  