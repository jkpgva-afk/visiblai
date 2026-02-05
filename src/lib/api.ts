const API_URL = "http://localhost:3001/api";

export async function runScan(payload: {
  brand: string;
  website: string;
  keyword: string;
  competitors: string;
}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/scans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("FREE_LIMIT");
    }

    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function getScanById(id: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/dashboard/scans/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function getDashboardScans() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/dashboard/scans`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}
export async function downloadReport(scanId: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/report/${scanId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch report");
  }

  return res.blob();
}

