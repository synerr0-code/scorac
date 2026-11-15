import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { UserPlus, Loader2, GraduationCap } from 'lucide-react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [matricNumber, setMatricNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await api.post('/register', {
                email,
                password,
                role,
                name: name || undefined,
                matric_number: matricNumber || undefined
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-2xl font-bold">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        <span className="text-gradient">Code Grader</span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                        AI-Powered Assignment Grading
                    </p>
                </div>

                <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription>Join Code Grader to submit and grade assignments</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-input/50 border-border/50 focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name (Optional)</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-input/50 border-border/50 focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="matric">Matric Number (Optional)</Label>
                                <Input
                                    id="matric"
                                    type="text"
                                    placeholder="e.g. U2023/1234"
                                    value={matricNumber}
                                    onChange={(e) => setMatricNumber(e.target.value)}
                                    className="bg-input/50 border-border/50 focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-input/50 border-border/50 focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="bg-input/50 border-border/50 focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>I am a</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRole('student')}
                                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${role === 'student'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border/50 bg-card hover:border-primary/50'
                                            }`}
                                    >
                                        🎒 Student
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('teacher')}
                                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${role === 'teacher'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border/50 bg-card hover:border-primary/50'
                                            }`}
                                    >
                                        👨‍🏫 Teacher
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                className="w-full btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {!isLoading && <UserPlus className="mr-2 h-4 w-4" />}
                                Create Account
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline underline-offset-4">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
