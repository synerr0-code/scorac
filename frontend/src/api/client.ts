import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface User {
    id: number;
    email: string;
    name?: string;
    matric_number?: string;
    role: 'teacher' | 'student' | 'admin';
}

export interface ScoreResponse {
    score: number;
    feedback: string;
    reasoning: string | null;
}

export interface Assignment {
    id: number;
    title: string;
    description: string;
    criteria: string;
}

export interface Submission {
    id: number;
    assignment_id: number;
    user_id: number;
    student_name?: string;
    matric_number?: string;
    score: number;
    feedback: string;
    strengths?: string[];
    weakpoints?: string[];
    cheating_detected?: boolean;
    cheating_reason?: string | null;
    reasoning?: string | null;
    created_at: string;
}

export default api;
