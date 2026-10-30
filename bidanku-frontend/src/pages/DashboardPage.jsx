import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-pink-600">
            Halo, {user?.nama}!
          </h1>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-600">
          Kamu login sebagai: <span className="font-semibold">{user?.role}</span>
        </p>
      </div>
    </div>
  );
}