// Service layer for listing operations - inspired by the CRUD example
export const listingService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

function getAll(createdBy: string) {
  return fetch(`/api/my-listings?createdBy=${createdBy}`)
    .then(handleResponse)
    .then(data => data.companies); // Extract the companies array from the response
}

function getById(id: string, createdBy: string) {
  return fetch(`/api/my-listings/${id}?createdBy=${createdBy}`)
    .then(handleResponse)
    .then(data => data.company); // Extract the company data from the response
}

function create(params: any) {
  return fetch('/api/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  }).then(handleResponse);
}

function update(id: string, params: any, createdBy: string) {
  return fetch(`/api/my-listings/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-id': createdBy
    },
    body: JSON.stringify(params)
  }).then(handleResponse);
}

function _delete(id: string, createdBy: string) {
  return fetch(`/api/my-listings/${id}?createdBy=${createdBy}`, { 
    method: 'DELETE',
    headers: {
      'x-user-id': createdBy
    }
  }).then(handleResponse);
}

// Helper function to handle API responses
function handleResponse(response: Response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const error = (data && data.error) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
