import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import type { Assignment } from '../api/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { ArrowLeft, BookOpen, Loader2, AlertCircle, ArrowRight, Trash2, Edit } from 'lucide-react';

export default function Assignments() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await api.get('/assignments/');
            setAssignments(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load assignments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this assignment?')) return;

        try {
            await api.delete(`/assignments/${id}`);
            setAssignments(assignments.filter(a => a.id !== id));
        } catch (err: any) {
            alert('Failed to delete assignment');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/dashboard">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-primary" />
                    Assignments
                </h1>
                <p className="text-muted-foreground mt-1">Browse and submit solutions to available assignments</p>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {error && (
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                        <p className="text-lg font-medium text-destructive">{error}</p>
                        <Button variant="outline" className="mt-4" onClick={fetchAssignments}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && assignments.length === 0 && (
                <Card className="border-border/50 bg-card/80">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <BookOpen className="h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg">No assignments available</p>
                        <p className="text-sm mt-2">Check back later for new assignments!</p>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && assignments.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {assignments.map((assignment) => (
                        <Card
                            key={assignment.id}
                            className="card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl flex flex-col"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                        <CardDescription className="mt-1">
                                            Assignment #{assignment.id}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {assignment.description}
                                </p>
                            </CardContent>
                            <CardFooter className="flex gap-2 border-t border-border/50 pt-4 mt-auto">
                                <Button
                                    onClick={() => navigate(`/submit-assignment?id=${assignment.id}`)}
                                    className="flex-1 btn-glow bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    Submit Solution
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>

                                {(user?.role === 'teacher' || user?.role === 'admin') && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => navigate(`/assignments/${assignment.id}/edit`)}
                                            className="hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(assignment.id)}
                                            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
