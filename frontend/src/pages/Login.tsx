import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { LogIn, Loader2, GraduationCap } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/login', formData);

            // Fetch actual user data from /users/me
            const userResponse = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${response.data.access_token}` }
            });

            login(response.data.access_token, userResponse.data);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
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
                        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
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
                                {!isLoading && <LogIn className="mr-2 h-4 w-4" />}
                                Sign In
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link to="/register" className="text-primary hover:underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
