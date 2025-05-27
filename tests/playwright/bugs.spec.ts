import { test, expect } from '@playwright/test';

const baseURL = 'http://localhost:3000/api/bugs';

test.describe('Bug API', () => {
  test('POST / should create a bug', async ({ request }) => {
    const res = await request.post(baseURL, {
      data: {
        title: 'Sample Bug',
        severity: 'medium',
        status: 'open'
      }
    });
    expect(res.status()).toBe(201);
  });

  test('GET / should list bugs', async ({ request }) => {
    const res = await request.get(baseURL);
    expect(res.status()).toBe(200);
  });

  test('GET /:id should get a bug', async ({ request }) => {
    const post = await request.post(baseURL, {
      data: {
        title: 'Fetch Bug',
        severity: 'low',
        status: 'open'
      }
    });
    const { id } = await post.json();
    const res = await request.get(`${baseURL}/${id}`);
    expect(res.status()).toBe(200);
  });

  test('PUT /:id should update a bug', async ({ request }) => {
    const post = await request.post(baseURL, {
      data: {
        title: 'Update Bug',
        severity: 'medium',
        status: 'open'
      }
    });
    const { id } = await post.json();
    const put = await request.put(`${baseURL}/${id}`, {
      data: { status: 'resolved' }
    });
    expect(put.status()).toBe(200);
  });

  test('DELETE /:id should delete a bug', async ({ request }) => {
    const post = await request.post(baseURL, {
      data: {
        title: 'Delete Bug',
        severity: 'high',
        status: 'open'
      }
    });
    const { id } = await post.json();
    const del = await request.delete(`${baseURL}/${id}`);
    expect(del.status()).toBe(200);
  });
});