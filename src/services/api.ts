import { Doctor, Hospital, Nationality, Patient } from "../types/models";

const API_URL = "https://www.sohatey.info"; // Replace with your actual API URL

// Helper function for API requests
async function apiRequest<T>(
  url: string,
  method: string = "GET",
  data?: any
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    mode: "cors",
    credentials: "omit" 
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${url}`, options);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
}

// Function to download files with progress
async function downloadWithProgress(
  url: string,
  onProgress: (progress: number) => void
): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch(`${API_URL}${url}`);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  // Get filename from Content-Disposition header or fallback to sickleaves.pdf
  const contentDisposition = response.headers.get('Content-Disposition');
  const filenameMatch = contentDisposition 
    ? /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition) 
    : null;
  const filename = filenameMatch && filenameMatch[1] 
    ? filenameMatch[1].replace(/['"]/g, '') 
    : 'sickleaves.pdf';

  // Get content length for calculating progress
  const contentLength = response.headers.get('Content-Length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  
  // Create a reader from the response body
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('ReadableStream not supported in this browser.');
  }

  // Read the data
  let receivedLength = 0;
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      break;
    }
    
    chunks.push(value);
    receivedLength += value.length;
    
    // Calculate and report progress
    if (total > 0) {
      onProgress(Math.round((receivedLength / total) * 100));
    }
  }
  
  // Concatenate chunks into a single Uint8Array
  const chunksAll = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }
  
  // Create a blob from the data
  const blob = new Blob([chunksAll], { type: response.headers.get('Content-Type') || 'application/pdf' });
  
  return { blob, filename };
}
 
// Patient API
export const patientAPI = {
  getAll: (limit: number = 100) => apiRequest<Patient[]>("/manger_data/patientsall"),
  getRecent: (limit: number = 20) => {
    console.log("Fetching recent patients from:", `${API_URL}/manger_data/user20`);
    return apiRequest<Patient[]>("/manger_data/user20");
  },
  getById: (id: string) => apiRequest<Patient>(`/manger_data/patients/${id}`),
  create: (patient: Omit<Patient, "_id">) => apiRequest<Patient>("/manger_data/patients", "POST", patient),
  update: (id: string, patient: Partial<Patient>) => apiRequest<Patient>(`/manger_data/patients/${id}`, "PUT", patient),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/manger_data/patients/${id}`, "DELETE"),
  search: (query: string) => {
    console.log("Searching with query:", query, "at URL:", `${API_URL}/manger_data/findgsl/${query}`);
    return apiRequest<{users: Patient[]}>(`/manger_data/findgsl/${query}`).then(data => data.users || []);
  },
  generateReport: async (
    id: string, 
    reportType: string,
    onProgress?: (progress: number) => void
  ): Promise<{ blob: Blob; url: string; filename: string } | undefined> => {
    try {
      if (onProgress) {
        // Use progress-enabled download
        const { blob, filename } = await downloadWithProgress(`/${reportType}/${id}`, onProgress);
        const url = URL.createObjectURL(blob);
        return { blob, url, filename };
      } else {
        // Open in new tab (legacy behavior) if no progress callback provided
        window.open(`${API_URL}/manger_data/reports/${reportType}/generate/${id}`, '_blank');
        return undefined;
      }
    } catch (error) {
      console.error(`Error generating ${reportType} report:`, error);
      throw error;
    }
  },
};

// Hospital API
export const hospitalAPI = {
  getAll: () => apiRequest<Hospital[]>("/manger_data/hospitals"),
  getById: (id: string) => apiRequest<Hospital>(`/manger_data/hospitals/${id}`),
  create: (hospital: Omit<Hospital, "_id">) => apiRequest<Hospital>("/manger_data/hospitals", "POST", hospital),
  update: (id: string, hospital: Partial<Hospital>) => apiRequest<Hospital>(`/manger_data/hospitals/${id}`, "PUT", hospital),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/manger_data/hospitals/${id}`, "DELETE"),
};

// Doctor API
export const doctorAPI = {
  getAll: () => apiRequest<Doctor[]>("/manger_data/doctors"),
  getById: (id: string) => apiRequest<Doctor>(`/manger_data/doctors/${id}`),
  create: (doctor: Omit<Doctor, "_id">) => apiRequest<Doctor>("/manger_data/doctors", "POST", doctor),
  update: (id: string, doctor: Partial<Doctor>) => apiRequest<Doctor>(`/manger_data/doctors/${id}`, "PUT", doctor),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/manger_data/doctors/${id}`, "DELETE"),
};

// Nationality API
export const nationalityAPI = {
  getAll: () => apiRequest<Nationality[]>("/manger_data/nationalities"),
  getById: (id: string) => apiRequest<Nationality>(`/manger_data/nationalities/${id}`),
  create: (nationality: Omit<Nationality, "_id">) => apiRequest<Nationality>("/manger_data/nationalities", "POST", nationality),
  update: (id: string, nationality: Partial<Nationality>) => apiRequest<Nationality>(`/manger_data/nationalities/${id}`, "PUT", nationality),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/manger_data/nationalities/${id}`, "DELETE"),
};
