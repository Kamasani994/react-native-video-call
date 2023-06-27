import axios from 'axios';
import { REACT_APP_API_ENDPOINT, REACT_APP_CHAT_ENDPOINT } from './constants'

class APIService {
 
  constructor() {
    let service = axios.create({
      baseURL: REACT_APP_API_ENDPOINT, //(NODE_ENV !== 'production') ? 'http://localhost:9000/api/' : ''
      headers: { csrf: 'token', 'Access-Control-Allow-Origin': '*' },
      responseType: 'json'
    });
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  url() {
    return REACT_APP_API_ENDPOINT;
  }

  handleSuccess(response) {
    return response;
  }

  handleError = async (err) => {
    //Check error as response, Reject promise if usual errors
    if (err && err.response && err.response.status === 401) {
      const originalRequest = err.config;
      return axios.post(`${REACT_APP_API_ENDPOINT}/Auth/Refresh`,
        {
          'AccessToken': this.token(),
          'RefreshToken': this.refresh_token()
        })
        .then((res) => {
          if (res.status !== 400) {
            this.setSession({ token: res.data.accessToken, refresh_token: res.data.refreshToken });
            originalRequest.headers.Authorization = "Bearer " + res.data.accessToken;
            return new Promise((resolve, reject) => { resolve(axios(originalRequest)) });
          }
        }, (e) => {
          document.location = '#/login';
          return Promise.reject({ message: "Your session timed out. Sign in to continue setting up your security info." });
        });
    }
    return Promise.reject(err);
  }

//   redirectTo = (document, path) => {
//     document.location = path
//   }

  refresh_token() {
    if (localStorage.getItem('refresh_token')) {
      const { refresh_token } = JSON.parse(localStorage.getItem('refresh_token'))
      return refresh_token;
    }
  }

  token() {
    if (localStorage.getItem('user')) {
      const { token } = JSON.parse(localStorage.getItem('user'));
      return token;
    }
    return '';
  }

  async getAll(q) {
    return await axios.all(q)
      .then(axios.spread((...arg) => {
        return arg;
      })).catch((error) => {
        return Promise.reject(error);
      });;
  }

  setSession(res) {
    localStorage.setItem('user', JSON.stringify({ token: res.token }));
    localStorage.setItem('refresh_token', JSON.stringify({ refresh_token: res.refresh_token }))
  }

  async getAsync(path) {
    return await this.service.request({
      method: 'GET',
      url: this.url() + path,
      headers: { 'Authorization': 'Bearer ' + this.token() }
    })
  }
  async postAsync(path, payload) {
    return await this.service.request({
      method: 'POST',
      url: this.url() + path,
      data: payload,
      headers: {
        'Authorization': 'Bearer ' + this.token(),
        // 'Content-Type': 'multipart/form-data'
      }
    })
  }

  async putAsync(path, payload) {
    return await this.service.request({
      method: 'PUT',
      url: this.url() + path,
      data: payload,
      headers: {
        'Authorization': 'Bearer ' + this.token(),
        // 'Content-Type': 'multipart/form-data'
      }
    })
  }

  get(path, callback) {
    return this.service.request({
      method: 'GET',
      url: this.url() + path,
      headers: { 'Authorization': 'Bearer ' + this.token() }
    }).then(
      (response) => callback(response.status, response.data)
    );
  }

  patch(path, payload, callback) {
    return this.service.request({
      method: 'PATCH',
      url: path,
      data: payload
    }).then((response) => callback(response.status, response.data));
  }

  post(path, payload, callback, exception) {
    return this.service.request({
      method: 'POST',
      url: this.url() + path,
      data: payload,
      headers: {
        'Authorization': 'Bearer ' + this.token(),
      }
    })
      .then((response) => callback(response.status, response.data))
      .catch((error) => exception(error));
  }

  putformdata(path, payload, callback, exception) {
    return this.service.request({
      method: 'PUT',
      url: this.url() + path,
      data: payload,
      headers: {
        'Authorization': 'Bearer ' + this.token(),
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => callback(response.status, response.data))
      .then((response) => exception(response));
  }

  put(path, payload, callback, exception) {
    return this.service.request({
      method: 'PUT',
      url: this.url() + path,
      data: payload,
      headers: {
        'Authorization': 'Bearer ' + this.token(),
      }
    })
      .then((response) => callback(response.status, response.data))
      .then((response) => exception(response));
  }

  async getBlobAsync(path) {
    return await this.service.request({
      method: 'GET',
      responseType: 'blob',
      url: this.url() + path,
      headers: { 'Authorization': 'Bearer ' + this.token() }
    })
  }

  async postBlobAsync(path, payload) {
    return await this.service.request({
      method: 'POST',
      responseType: 'blob',
      url: this.url() + path,
      data: payload,
      headers: { 'Authorization': 'Bearer ' + this.token() }
    });
  }

  async postFormDataAsync(path, payload, onUploadProgress, exception) {

    return await this.service.request({
      method: 'POST',
      url: this.url() + path,
      data: payload,
      onUploadProgress: onUploadProgress,
      headers: {
        'Authorization': 'Bearer ' + this.token(),
        'Content-Type': 'multipart/form-data'
      }
    })
  };
  async putFormDataAsync(path, payload, onUploadProgress, exception) {

    return await this.service.request({
      method: 'PUT',
      url: this.url() + path,
      data: payload,
      onUploadProgress: onUploadProgress,
      headers: {
        'Authorization': 'Bearer ' + this.token(),
        'Content-Type': 'multipart/form-data'
      }
    })
  };
}

export default new APIService();