import axios from 'axios';
import { GraphData, ModelSummary, NodeDetails } from '../types/models';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadModel = async (file: File): Promise<ModelSummary> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ModelSummary>('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getGraph = async (): Promise<GraphData> => {
    const response = await api.get<GraphData>('/graph');
    return response.data;
};

export const getNodeDetails = async (nodeName: string): Promise<NodeDetails> => {
    const response = await api.get<NodeDetails>(`/node/${nodeName}`);
    return response.data;
};

export const getModelSummary = async (): Promise<ModelSummary> => {
    const response = await api.get<ModelSummary>('/summary');
    return response.data;
}; 