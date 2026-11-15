import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { ArrowLeft, Save, Copy, Check, PlusCircle, Loader2 } from 'lucide-react';

export default function CreateAssignment() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [criteria, setCriteria] = useState('');
    const [createdId, setCreatedId] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/assignments/', { title, description, criteria });
            setCreatedId(response.data.id);
            setTitle('');
            setDescription('');
            setCriteria('');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create assignment');
        } finally {
            setIsLoading(false);
        }
    };

    const copyId = () => {
        if (createdId) {
            navigator.clipboard.writeText(createdId.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
                    <PlusCircle className="h-8 w-8 text-primary" />
                    Create Assignment
                </h1>
                <p className="text-muted-foreground mt-1">Define a new coding task for your students</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle>Assignment Details</CardTitle>
                        <CardDescription>Fill in the assignment information and grading criteria</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Week 1: Python Basics"
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
                                    placeholder="Describe what students need to implement..."
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
                                    placeholder="Define how submissions will be graded..."
                                    required
                                />
                            </div>
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {!isLoading && <Save className="mr-2 h-4 w-4" />}
                                Create Assignment
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {createdId && (
                    <Card className="card-glow h-fit border-primary/30 bg-primary/5 rounded-2xl animate-in fade-in slide-in-from-right-4">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2">
                                <Check className="h-6 w-6" />
                                Assignment Created!
                            </CardTitle>
                            <CardDescription>Share this ID with your students so they can submit</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 p-4 bg-card/80 border border-border/50 rounded-xl">
                                <code className="text-3xl font-mono flex-1 text-center font-bold text-primary">{createdId}</code>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={copyId}
                                    className="hover:bg-primary/10"
                                >
                                    {copied ? <Check className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5" />}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-3">
                                Students can use this ID on the Submit Solution page
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
