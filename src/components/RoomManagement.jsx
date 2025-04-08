import { useState } from 'react';
import { FiPlus, FiHash, FiUsers, FiMonitor, FiWind } from 'react-icons/fi';

const dummyRooms = [
  { id: 1, number: '101', capacity: 40, features: ['AC', 'Projector'], status: 'Free' },
  { id: 2, number: '102', capacity: 30, features: ['Projector'], status: 'Busy' },
  { id: 3, number: '103', capacity: 50, features: ['AC'], status: 'Free' },
];

export default function RoomManagement() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ number: '', capacity: '', features: [] });

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Added room:', formData);
    closeModal();
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Rooms</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dummyRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-3xl shadow-xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Room #{room.number}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${room.status === 'Free' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {room.status}
              </span>
            </div>
            <p>Capacity: {room.capacity}</p>
            <div className="flex flex-wrap gap-2">
              {room.features.map((feature) => (
                <span key={feature} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={openModal}
        className="fixed bottom-8 right-8 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:scale-105 transition"
      >
        ➕ Add Room
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-11/12 max-w-md animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-6">Add Room</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative flex items-center">
                <FiHash className="absolute left-4 text-gray-400" />
                <input
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                  placeholder="Room Number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="relative flex items-center">
                <FiUsers className="absolute left-4 text-gray-400" />
                <input
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  placeholder="Capacity"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Features</label>
                <div className="flex gap-2 flex-wrap">
                  {['AC', 'Projector'].map((feature) => (
                    <button
                      type="button"
                      key={feature}
                      onClick={() => {
                        setFormData((prev) => {
                          const hasFeature = prev.features.includes(feature);
                          return {
                            ...prev,
                            features: hasFeature
                              ? prev.features.filter((f) => f !== feature)
                              : [...prev.features, feature],
                          };
                        });
                      }}
                      className={`px-3 py-1 rounded-full border ${formData.features.includes(feature) ? 'bg-indigo-500 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
