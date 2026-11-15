import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';

export default function EditAssignment() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [criteria, setCriteria] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignment();
    }, [id]);

    const fetchAssignment = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/assignments/${id}`);
            const { title, description, criteria } = response.data;
            setTitle(title);
            setDescription(description);
            setCriteria(criteria);
        } catch (err: any) {
            setError('Failed to load assignment details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            await api.put(`/assignments/${id}`, { title, description, criteria });
            navigate('/assignments');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to update assignment');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/assignments">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assignments
                </Button>
            </Link>

            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Edit Assignment #{id}
                    </h1>
                    <p className="text-muted-foreground mt-1">Update assignment details and grading criteria</p>
                </div>

                <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle>Assignment Details</CardTitle>
                        <CardDescription>Make changes to your assignment below</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Assignment Title"
                                    required
                                    className="bg-input/50 border-border/50 focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc">Description</Label>
                                <textarea
                                    id="desc"
                                    className="flex min-h-[120px] w-full rounded-xl border border-border/50 bg-input/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Description"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="crit">Grading Criteria</Label>
                                <textarea
                                    id="crit"
                                    className="flex min-h-[120px] w-full rounded-xl border border-border/50 bg-input/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={criteria}
                                    onChange={(e) => setCriteria(e.target.value)}
                                    placeholder="Grading Criteria"
                                    required
                                />
                            </div>
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm flex items-center gap-2 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                disabled={isSaving}
                            >
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {!isSaving && <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
