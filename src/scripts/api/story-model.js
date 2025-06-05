export default class StoryModel {
  static async getAllStories({ page = 1, size = 10, location = 0 } = {}) {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `https://story-api.dicoding.dev/v1/stories?page=${page}&size=${size}&location=${location}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.listStory;
  }

  static async addNewStory({ description, photo, lat, lon }) {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat != null && lon != null) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage('new-story-added');

    return result;
  }
}
