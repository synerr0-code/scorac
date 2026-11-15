import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LogOut, PlusCircle, Upload, GraduationCap, FileText, BookOpen } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen">
            <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <span className="text-gradient">Code Grader</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden md:inline-block">
                            {user?.email}
                            <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full uppercase">
                                {user?.role}
                            </span>
                        </span>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Welcome back!</h1>
                    <p className="text-muted-foreground mt-1">What would you like to do today?</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* View Assignments - Everyone */}
                    <Link to="/assignments">
                        <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-blue-500/10">
                                        <BookOpen className="h-5 w-5 text-blue-400" />
                                    </div>
                                    View Assignments
                                </CardTitle>
                                <CardDescription>
                                    Browse available coding assignments
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Create Assignment - Teachers/Admins only */}
                    {(user?.role === 'teacher' || user?.role === 'admin') && (
                        <Link to="/create-assignment">
                            <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-primary/10">
                                            <PlusCircle className="h-5 w-5 text-primary" />
                                        </div>
                                        Create Assignment
                                    </CardTitle>
                                    <CardDescription>
                                        Create a new coding assignment with grading criteria
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    )}

                    {/* Submit Solution */}
                    <Link to="/submit-assignment">
                        <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-purple-500/10">
                                        <Upload className="h-5 w-5 text-purple-400" />
                                    </div>
                                    Submit Solution
                                </CardTitle>
                                <CardDescription>
                                    Upload your code solution for grading
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* View Submissions */}
                    <Link to="/submissions">
                        <Card className="card-glow border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-amber-500/10">
                                        <FileText className="h-5 w-5 text-amber-400" />
                                    </div>
                                    {user?.role === 'student' ? 'My Submissions' : 'All Submissions'}
                                </CardTitle>
                                <CardDescription>
                                    {user?.role === 'student'
                                        ? 'View your submitted assignments and scores'
                                        : 'View all student submissions and grades'}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </main>
        </div>
    );
}
