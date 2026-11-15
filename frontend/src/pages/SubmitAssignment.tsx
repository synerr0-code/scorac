import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import type { Submission } from '../api/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { ArrowLeft, Upload, Loader2, CheckCircle2, ThumbsUp, ThumbsDown, AlertTriangle, Info } from 'lucide-react';

export default function SubmitAssignment() {
    const [searchParams] = useSearchParams();
    const [id, setId] = useState(searchParams.get('id') || '');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<Submission | null>(null);
    const [error, setError] = useState('');
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentCriteria, setAssignmentCriteria] = useState('');

    useEffect(() => {
        const urlId = searchParams.get('id');
        if (urlId) {
            setId(urlId);
            fetchAssignmentDetails(urlId);
        }
    }, [searchParams]);

    // Fetch details when user manually changes ID input
    useEffect(() => {
        if (id && id.length > 0) {
            const timer = setTimeout(() => fetchAssignmentDetails(id), 500);
            return () => clearTimeout(timer);
        }
    }, [id]);

    const fetchAssignmentDetails = async (assignmentId: string) => {
        try {
            const response = await api.get(`/assignments/${assignmentId}`);
            setAssignmentTitle(response.data.title);
            setAssignmentCriteria(response.data.criteria);
        } catch (err) {
            // Silently fail if assignment not found (e.g. while typing)
            setAssignmentTitle('');
            setAssignmentCriteria('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !id) return;

        setIsLoading(true);
        setResult(null);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(`/assignments/${id}/submit`, formData);
            setResult(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Submission failed');
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400 border-green-500/30 bg-green-500/10';
        if (score >= 60) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
        return 'text-red-400 border-red-500/30 bg-red-500/10';
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
                    <Upload className="h-8 w-8 text-primary" />
                    Submit Solution
                </h1>
                <p className="text-muted-foreground mt-1">Upload your code to get instant AI-powered feedback</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl">
                        <CardHeader>
                            <CardTitle>Upload Your Code</CardTitle>
                            <CardDescription>Select an assignment and upload your solution file</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="id">Assignment ID</Label>
                                    <Input
                                        id="id"
                                        type="number"
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                        placeholder="e.g. 1"
                                        required
                                        className="bg-input/50 border-border/50 focus:border-primary"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        You can find assignment IDs on the <Link to="/assignments" className="text-primary hover:underline">Assignments page</Link>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="file">Code File</Label>
                                    <div className="relative">
                                        <Input
                                            id="file"
                                            type="file"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            required
                                            className="cursor-pointer bg-input/50 border-border/50 file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:font-medium hover:file:bg-primary/90"
                                        />
                                    </div>
                                    {file && (
                                        <p className="text-xs text-primary">
                                            Selected: {file.name}
                                        </p>
                                    )}
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
                                    {!isLoading && <Upload className="mr-2 h-4 w-4" />}
                                    {isLoading ? 'Grading...' : 'Submit & Grade'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    {/* Assignment Details Preview */}
                    {assignmentTitle && (
                        <Card className="border-primary/20 bg-primary/5 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                                    <Info className="h-5 w-5" />
                                    {assignmentTitle}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">Grading Criteria:</span>
                                    <p className="mt-1 whitespace-pre-wrap">{assignmentCriteria}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {result && (
                    <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl animate-in fade-in slide-in-from-right-4 h-fit">
                        <CardHeader className="border-b border-border/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <CheckCircle2 className="h-6 w-6" />
                                    Grading Complete
                                </CardTitle>
                                <div className={`px-4 py-2 rounded-xl border font-bold text-2xl ${getScoreColor(result.score)}`}>
                                    {result.score}/100
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {/* Cheating Status Indicator - Always Visible */}
                            <div className={`p-4 rounded-xl border flex items-center justify-between ${(result.cheating_detected || result.cheating_reason)
                                    ? 'bg-destructive/10 border-destructive/50'
                                    : 'bg-green-500/10 border-green-500/30'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {(result.cheating_detected || result.cheating_reason)
                                        ? <AlertTriangle className="h-5 w-5 text-destructive" />
                                        : <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    }
                                    <span className={`font-semibold ${(result.cheating_detected || result.cheating_reason) ? 'text-destructive' : 'text-green-500'
                                        }`}>
                                        Suspected Cheating: {(result.cheating_detected || result.cheating_reason) ? 'True' : 'False'}
                                    </span>
                                </div>
                                {(result.cheating_detected || result.cheating_reason) && (
                                    <span className="text-xs text-destructive font-mono bg-destructive/10 px-2 py-1 rounded">
                                        FLAGGED
                                    </span>
                                )}
                            </div>

                            {/* Detailed Cheating Reason if exists */}
                            {(result.cheating_detected || result.cheating_reason) && (
                                <div className="text-sm text-destructive/90 font-medium pl-4 border-l-2 border-destructive/30">
                                    Reason: {result.cheating_reason}
                                </div>
                            )}

                            {/* Feedback */}
                            <div>
                                <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">AI Feedback</h4>
                                <p className="text-foreground leading-relaxed">{result.feedback}</p>
                            </div>

                            {/* Strengths & Weakpoints */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {result.strengths && result.strengths.length > 0 && (
                                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                                        <h4 className="font-semibold mb-2 text-sm text-green-400 flex items-center gap-2">
                                            <ThumbsUp className="h-4 w-4" />
                                            Strengths
                                        </h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            {result.strengths.map((s, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-green-400 mt-1 shrink-0">•</span>
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {result.weakpoints && result.weakpoints.length > 0 && (
                                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                                        <h4 className="font-semibold mb-2 text-sm text-red-400 flex items-center gap-2">
                                            <ThumbsDown className="h-4 w-4" />
                                            Areas to Improve
                                        </h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            {result.weakpoints.map((w, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-red-400 mt-1 shrink-0">•</span>
                                                    <span>{w}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Reasoning */}
                            {result.reasoning && (
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Detailed Analysis</h4>
                                    <pre className="text-xs bg-black/30 p-4 rounded-xl overflow-auto whitespace-pre-wrap border border-border/50 text-muted-foreground font-mono">
                                        {result.reasoning}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
