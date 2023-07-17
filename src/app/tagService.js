import axios from "./axios";
import querystring from "query-string";

export const TAGS_URL = "/tags";



export function findTags(inputSearch) {
    return axios.get(`${TAGS_URL}?filter[name]=${inputSearch}`);
  }


export function attachTagToElement(tagName,modelType,modelId) {
  return axios.post(`${TAGS_URL}/${tagName}/${modelType}/${modelId}`);
}

export function detachTagToElement(tagName,modelType,modelId) {
    return axios.delete(`${TAGS_URL}/${tagName}/${modelType}/${modelId}`);
  }