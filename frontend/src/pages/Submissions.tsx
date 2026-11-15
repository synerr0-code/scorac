import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import type { Submission } from '../api/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, FileText, Loader2, AlertCircle, CheckCircle2, XCircle, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function Submissions() {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        fetchSubmissions();
    }, [user]);

    const fetchSubmissions = async () => {
        try {
            setIsLoading(true);
            setError('');
            const endpoint = user?.role === 'student' ? '/submissions/me' : '/submissions/';
            const response = await api.get(endpoint);
            setSubmissions(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load submissions');
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400 bg-green-500/10 border-green-500/20';
        if (score >= 60) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    };

    const getScoreIcon = (score: number) => {
        if (score >= 80) return <CheckCircle2 className="h-5 w-5" />;
        if (score >= 60) return <AlertCircle className="h-5 w-5" />;
        return <XCircle className="h-5 w-5" />;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                    <FileText className="h-8 w-8 text-primary" />
                    {user?.role === 'student' ? 'My Submissions' : 'All Submissions'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {user?.role === 'student'
                        ? 'View your submitted assignments and scores'
                        : 'View all student submissions and grades'}
                </p>
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
                        <Button variant="outline" className="mt-4" onClick={fetchSubmissions}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && submissions.length === 0 && (
                <Card className="border-border/50 bg-card/80">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <FileText className="h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg">No submissions yet</p>
                        <p className="text-sm mt-2">Submit an assignment to see your results here!</p>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && submissions.length > 0 && (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <Card
                            key={submission.id}
                            className={`card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl transition-all ${expandedId === submission.id ? 'ring-1 ring-primary/50' : ''
                                }`}
                        >
                            <CardHeader
                                className="cursor-pointer"
                                onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl border ${getScoreColor(submission.score)}`}>
                                            {getScoreIcon(submission.score)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                Assignment #{submission.assignment_id}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {formatDate(submission.created_at)}
                                                {user?.role !== 'student' && (
                                                    <span className="ml-2">
                                                        • {submission.student_name || `User #${submission.user_id}`}
                                                        {submission.matric_number ? ` (${submission.matric_number})` : ''}
                                                    </span>
                                                )}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {(submission.cheating_detected || submission.cheating_reason) && (
                                            <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                Cheating
                                            </div>
                                        )}
                                        <div className={`px-4 py-2 rounded-xl border font-bold text-lg ${getScoreColor(submission.score)}`}>
                                            {submission.score}/100
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            {expandedId === submission.id && (
                                <CardContent className="border-t border-border/50 pt-4 space-y-4">
                                    {/* Cheating Status - Explicit */}
                                    <div className={`p-3 rounded-lg border flex items-center gap-3 ${(submission.cheating_detected || submission.cheating_reason)
                                        ? 'bg-destructive/10 border-destructive/50'
                                        : 'bg-green-500/10 border-green-500/30'
                                        }`}>
                                        {(submission.cheating_detected || submission.cheating_reason)
                                            ? <AlertTriangle className="h-4 w-4 text-destructive" />
                                            : <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        }
                                        <span className={`font-semibold text-sm ${(submission.cheating_detected || submission.cheating_reason) ? 'text-destructive' : 'text-green-500'
                                            }`}>
                                            Suspected Cheating: {(submission.cheating_detected || submission.cheating_reason) ? 'True' : 'False'}
                                        </span>
                                    </div>

                                    {/* Feedback */}
                                    <div>
                                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Feedback</h4>
                                        <p className="text-foreground">{submission.feedback}</p>
                                    </div>

                                    {/* Strengths & Weakpoints */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {submission.strengths && submission.strengths.length > 0 && (
                                            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                                                <h4 className="font-semibold mb-2 text-sm text-green-400 flex items-center gap-2">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    Strengths
                                                </h4>
                                                <ul className="space-y-1 text-sm text-muted-foreground">
                                                    {submission.strengths.map((s, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-green-400 mt-1">•</span>
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {submission.weakpoints && submission.weakpoints.length > 0 && (
                                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                                                <h4 className="font-semibold mb-2 text-sm text-red-400 flex items-center gap-2">
                                                    <ThumbsDown className="h-4 w-4" />
                                                    Areas to Improve
                                                </h4>
                                                <ul className="space-y-1 text-sm text-muted-foreground">
                                                    {submission.weakpoints.map((w, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-red-400 mt-1">•</span>
                                                            {w}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cheating Reason */}
                                    {(submission.cheating_detected || submission.cheating_reason) && (
                                        <div className="pl-4 border-l-2 border-destructive/30">
                                            <h4 className="font-semibold mb-1 text-sm text-destructive">
                                                Detection Details
                                            </h4>
                                            <p className="text-sm text-destructive/90">{submission.cheating_reason}</p>
                                        </div>
                                    )}

                                    {/* Reasoning */}
                                    {submission.reasoning && (
                                        <div>
                                            <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">
                                                Detailed Reasoning
                                            </h4>
                                            <pre className="text-xs bg-black/30 p-4 rounded-xl overflow-auto whitespace-pre-wrap border border-border/50 text-muted-foreground">
                                                {submission.reasoning}
                                            </pre>
                                        </div>
                                    )}
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
