
export default function PermissionDetails({ permission }) {
  if (!permission) return <p>No permission selected</p>;

  return (
    <div className="border rounded-md shadow p-4 bg-white max-w-sm">
      <h2 className="text-lg font-bold mb-2">Permission Details</h2>
      <p><strong>Name:</strong> {permission.name}</p>
      <p><strong>Description:</strong> {permission.description}</p>
    </div>
  );
}
