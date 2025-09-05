
// import { FiveKSharp } from '@mui/icons-material';
// import React, { useState, useEffect } from 'react';

// export default function UserDetails({ user, onAvatarUpload }) {
//   const [previewImage, setPreviewImage] = useState(
//     user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `https://localhost:5001${user.avatarUrl}`) : null
//   );
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     setPreviewImage(user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `https://localhost:5001${user.avatarUrl}`) : null);
//   }, [user]);

//   if (!user) return null;

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setPreviewImage(URL.createObjectURL(file));

//     try {
//       await onAvatarUpload(user.id, file);
//       setMessage('✅ Profile picture updated');
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Failed to upload avatar');
//     }
//   };

//   return (
//     <div className="border rounded p-4 bg-white shadow space-y-4">
//       <h2 className="text-lg font-medium mb-2">User Details</h2>

//       {/* Avatar */}
//       <div className="flex flex-col items-center gap-2">
//         <img
//           src={previewImage || 'https://via.placeholder.com/120'}
//           alt="avatar"
//           className="w-24 h-24 rounded-full object-cover border-2 border-purple-400 shadow"
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="block w-full text-sm text-gray-600
//                      file:mr-4 file:py-1 file:px-2
//                      file:rounded-full file:border-0
//                      file:text-sm file:font-semibold
//                      file:bg-purple-100 file:text-purple-700
//                      hover:file:bg-purple-200 mt-2"
//         />
//       </div>

//       {/* Basic info */}
//       <div className="text-sm text-gray-700 space-y-1">
//         <div><strong>Username:</strong> {user.username}</div>
//         <div><strong>Email:</strong> {user.email}</div>
//         <div><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</div>
//         <div>
//           <strong>Roles:</strong>{' '}
//           {user.roles && user.roles.length > 0 ? user.roles.join(', ') : '—'}
//         </div>
//       </div>

//       {message && <p className="text-center text-sm font-semibold text-green-600">{message}</p>}
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';

export default function UserDetails({ user, onAvatarUpload }) {
  const [previewImage, setPreviewImage] = useState(
    user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `https://localhost:5001${user.avatarUrl}`) : null
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    setPreviewImage(user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `https://localhost:5001${user.avatarUrl}`) : null);
  }, [user]);

  if (!user) return null;
const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // show temporary preview immediately
  setPreviewImage(URL.createObjectURL(file));

  try {
    const result = await onAvatarUpload(user.id, file); // upload
    const updatedUrl = result?.avatarUrl; // extract the string from object

    if (updatedUrl) {
      setPreviewImage(
        updatedUrl.startsWith('http')
          ? updatedUrl
          : `https://localhost:5001${updatedUrl}`
      );
    }

    setMessage('✅ Profile picture updated');
  } catch (err) {
    console.error(err);
    setMessage('❌ Failed to upload avatar');
  }
};


  return (
    <div className="border rounded p-4 bg-white shadow space-y-4">
      <h2 className="text-lg font-medium mb-2">User Details</h2>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <img
          src={previewImage || '/avatar-placeholder.png'}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-purple-400 shadow"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-600
                     file:mr-4 file:py-1 file:px-2
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-purple-100 file:text-purple-700
                     hover:file:bg-purple-200 mt-2"
        />
      </div>

      {/* Basic info */}
      <div className="text-sm text-gray-700 space-y-1">
        <div><strong>Username:</strong> {user.username}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</div>
        <div>
          <strong>Roles:</strong>{' '}
          {user.roles && user.roles.length > 0 ? user.roles.join(', ') : '—'}
        </div>
      </div>

      {message && <p className="text-center text-sm font-semibold text-green-600">{message}</p>}
    </div>
  );
}
