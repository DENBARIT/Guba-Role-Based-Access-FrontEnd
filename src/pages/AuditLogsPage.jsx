import React, { useEffect, useState } from "react";
import api from "../api/apiClient.js";

export default function AuditLogsPage({ apiBaseUrl = "" }) {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entityName, setEntityName] = useState("");
  const [entityId, setEntityId] = useState("");
  const [actorEmail, setActorEmail] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [
    page,
    pageSize,
    search,
    startDate,
    endDate,
    entityName,
    entityId,
    actorEmail,
  ]);

  async function fetchLogs() {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        pageSize,
        ...(search && { search }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(entityName && { entityName }),
        ...(entityId && { entityId }),
        ...(actorEmail && { actorEmail }),
      };

      console.log("Params sent to API:", params);
      const res = await api.get("/auditlogs", { params });
      setLogs(res.data.items || []);
      setTotalCount(res.data.totalCount ?? 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  function prettyDate(s) {
    if (!s) return "-";
    try {
      return new Date(s).toLocaleString();
    } catch {
      return s;
    }
  }

  async function exportCsv() {
    try {
      const qs = new URLSearchParams({
        search,
        startDate,
        endDate,
        entityName,
        entityId,
        actorEmail,
      });
      const res = await api.get(`/auditlogs/export?${qs.toString()}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "auditlogs.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(
        "Failed to export CSV: " + (err.response?.statusText || err.message)
      );
    }
  }

  // ✅ Delete ALL audit logs currently displayed
  async function deleteAllAuditLogs() {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL audit logs on this page?"
      )
    )
      return;
    try {
      for (const log of logs) {
        await api.delete(`/auditlogs/${log.id}`);
      }
      setLogs([]); // clear page
      setTotalCount((prev) => prev - logs.length);
    } catch (err) {
      alert(
        "Failed to delete logs: " + (err.response?.data?.message || err.message)
      );
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2 items-end">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Entity Name"
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Entity ID"
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Actor Email"
          value={actorEmail}
          onChange={(e) => setActorEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchLogs}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Action</th>
              <th className="border p-2">Entity</th>
              <th className="border p-2">Entity ID</th>
              <th className="border p-2">Actor</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="border p-2">{prettyDate(log.createdAtUtc)}</td>
                  <td className="border p-2">{log.action}</td>
                  <td className="border p-2">{log.entityName}</td>
                  <td className="border p-2">{log.entityId}</td>
                  <td className="border p-2">{log.actorEmail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border p-2 rounded"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page{" "}
            <input
              type="number"
              min="1"
              max={totalPages}
              value={page}
              onChange={(e) => {
                let val = Number(e.target.value);
                if (!isNaN(val))
                  setPage(Math.min(Math.max(1, val), totalPages));
              }}
              className="w-16 border p-1 rounded text-center"
            />{" "}
            of {totalPages || 1}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCsv}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            Export CSV
          </button>
          <button
            onClick={deleteAllAuditLogs}
            disabled={logs.length === 0}
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            Delete All Logs
          </button>
        </div>
      </div>
    </div>
  );
}
